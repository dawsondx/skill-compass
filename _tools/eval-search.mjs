#!/usr/bin/env node
/**
 * _tools/eval-search.mjs —— 搜索质量黄金评测集（新旧引擎 A/B 对比）
 *
 * 用法：
 *   node _tools/eval-search.mjs           # 输出汇总指标与逐条明细
 *   node _tools/eval-search.mjs --strict  # 若任何核心指标不达标则以非 0 退出（可用于 CI）
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');

/* ---------- 加载同一份前端代码（零偏差评测） ---------- */
const sb = {};
vm.createContext(sb);
Object.defineProperty(sb, 'window', { value: sb, writable: true, configurable: true });
for (const rel of [
  'site/assets/js/data.js',
  'site/assets/js/pulse.js',
  'site/assets/js/search-index.js',
  'site/assets/js/search-engine.js'
]) {
  const full = path.join(ROOT, rel);
  if (fs.existsSync(full)) {
    vm.runInContext(fs.readFileSync(full, 'utf8'), sb, { filename: path.basename(rel) });
  }
}

const SKILLS = sb.SKILLS || [];
const CATS = sb.CATS || [];
const AUTHORS = sb.AUTHORS || [];
const catMap = Object.fromEntries(CATS.map((c) => [c.key, c]));
const authorMap = Object.fromEntries(AUTHORS.map((a) => [a.owner.toLowerCase(), a]));

SKILLS.forEach((s) => {
  s.catName = (catMap[s.cat] || {}).name || s.cat;
  s.owner = s.repo.split('/')[0];
  s.author = authorMap[s.owner.toLowerCase()] || null;
});

const engine = sb.SkillSearch.createEngine(SKILLS, {
  cats: CATS,
  searchIndex: sb.SEARCH_INDEX,
  pulse: sb.PULSE
});

/* ---------- 旧版搜索基线（app.js 原始 indexOf 实现） ---------- */
function oldSearch(q) {
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return SKILLS.filter((s) => {
    let hay = (s.name + ' ' + s.repo + ' ' + s.desc + ' ' + s.tags.join(' ') + ' ' + s.catName + ' ' + s.id
      + ' ' + (s.author ? s.author.name + ' ' + s.author.owner : '')).toLowerCase();
    if (s.subs) {
      hay += ' ' + s.subs.map((x) => x.name + ' ' + x.one + ' ' + x.dir + ' ' + ((catMap[x.cat] || {}).name || '')).join(' ').toLowerCase();
    }
    return terms.every((t) => hay.indexOf(t) > -1);
  }).map((s) => s.id);
}

/* ---------- 30 条真实场景黄金评测集 ----------
   mustTopK: 期望进入前 K 的核心 skill（至少命中目标比例）
   forbidTop5: 不应该污染前 5 的无关 skill（用于验证极性保护等） */
const CASES = [
  {
    q: '去AI味',
    mustTop10: ['humanizer-zh', 'larashero3-dotcom-lieflat-less-ai-tone', 'oil-tone', 'human-writing', 'conorbronsdon-avoid-ai-writing', 'stop-slop', 'blader-humanizer', 'hallmark'],
    forbidTop5: ['ai-wechat', 'aihot', 'dai-article-daily']
  },
  {
    q: '去 AI 味',
    mustTop10: ['humanizer-zh', 'larashero3-dotcom-lieflat-less-ai-tone', 'oil-tone', 'human-writing', 'stop-slop', 'blader-humanizer']
  },
  {
    q: '活人感',
    mustTop5: ['human-writing', 'humanizer-zh', 'oil-tone']
  },
  {
    q: '说人话',
    mustTop5: ['oil-tone', 'humanizer-zh', 'human-writing']
  },
  {
    q: '降AI率',
    mustTop10: ['humanizer-zh', 'larashero3-dotcom-lieflat-less-ai-tone', 'human-writing', 'conorbronsdon-avoid-ai-writing']
  },
  {
    q: '人味',
    mustTop10: ['humanizer-zh', 'human-writing', 'oil-tone', 'stop-slop']
  },
  {
    q: 'humanizer',
    mustTop5: ['blader-humanizer', 'humanizer-zh']
  },
  {
    q: 'humnizer', // 故意拼错：测试 Damerau-Levenshtein 容错
    mustTop5: ['blader-humanizer', 'humanizer-zh']
  },
  {
    q: '反模板落地页',
    mustTop5: ['hallmark']
  },
  {
    q: '做PPT',
    mustTop10: ['ppt-master', 'frontend-slides', 'guizang-ppt', 'anthropics-pptx']
  },
  {
    q: '麦肯锡PPT',
    mustTop5: ['likaku-mck-ppt-design-skill']
  },
  {
    q: '省token',
    mustTop5: ['caveman', 'steipete-agent-scripts']
  },
  {
    q: '省钱',
    mustTop5: ['caveman']
  },
  {
    q: '画流程图',
    mustTop10: ['diagram-design', 'drawio', 'excalidraw', 'fireworks-graph']
  },
  {
    q: '画架构图',
    mustTop10: ['tt-a1i-archify', 'arch-diagram', 'fireworks-graph', 'drawio']
  },
  {
    q: 'excalidrw', // 拼写容错
    mustTop5: ['excalidraw']
  },
  {
    q: '无Mermaid',
    mustTop5: ['diagram-design']
  },
  {
    q: '小红书封面',
    mustTop10: ['social-card', 'oil-cover', 'ziguishian-xhs-visual-director-skill', 'irenerachel-xiaohongshu-layout-factory-skill']
  },
  {
    q: 'xhs',
    mustTop10: ['social-card', 'ziguishian-xhs-visual-director-skill', 'comeonzhj-auto-redbook-skills']
  },
  {
    q: '写公众号',
    mustTop10: ['wewrite', 'ai-wechat', 'gzh-design', 'dai-article-daily']
  },
  {
    q: '公众号排版',
    mustTop5: ['gzh-design', 'wewrite']
  },
  {
    q: 'PDF转Markdown',
    mustTop5: ['markitdown']
  },
  {
    q: '公众号转MD',
    mustTop5: ['jackwener-wechat-article-to-markdown']
  },
  {
    q: '视频剪辑',
    mustTop5: ['baocut', 'screen-studio-editor']
  },
  {
    q: '白板动画',
    mustTop5: ['srt-whiteboard', 'handdrawn-motion', 'brandonvant-claude-skill-whiteboard-explainer']
  },
  {
    q: '透明底抠图',
    mustTop5: ['vividvictor-transparent-image-generator', 'oil-visual']
  },
  {
    q: '思维蒸馏',
    mustTop5: ['nuwa', 'colleague', 'human-distillation']
  },
  {
    q: '公文排版',
    mustTop5: ['gongwen-gbt9704', 'larashero3-dotcom-lieflat-gongwen']
  },
  {
    q: '改简历求职',
    mustTop5: ['career-ops']
  },
  {
    q: '爆款选题',
    mustTop5: ['dai-viral-topic', 'spacezephyr-creator-buddy', 'kangarooking']
  },
  {
    q: '花叔',
    mustTop10: ['huashu-design', 'huashu-motion', 'huashu-skills']
  },
  {
    q: 'huashu',
    mustTop10: ['huashu-design', 'huashu-motion', 'huashu-skills']
  },
  {
    q: '飞书多维表',
    mustTop5: ['lark-cli']
  },
  {
    q: '帮我写公众号去AI味',
    mustTop10: ['humanizer-zh', 'human-writing', 'oil-tone', 'larashero3-dotcom-lieflat-less-ai-tone']
  }
];

function evalRunner(name, searchIdsFn) {
  let totalTarget = 0;
  let totalHit = 0;
  let zeroCount = 0;
  let mrrSum = 0;
  let forbidViolations = 0;
  const details = [];

  const t0 = performance.now();
  for (const c of CASES) {
    const ids = searchIdsFn(c.q);
    if (!ids.length) zeroCount++;
    const k = c.mustTop5 ? 5 : 10;
    const expected = c.mustTop5 || c.mustTop10 || [];
    const topK = ids.slice(0, k);
    const hits = expected.filter((id) => topK.includes(id));
    totalTarget += expected.length;
    totalHit += hits.length;

    // MRR：第一个期望结果的倒数排名
    let rr = 0;
    for (let i = 0; i < ids.length; i++) {
      if (expected.includes(ids[i])) { rr = 1 / (i + 1); break; }
    }
    mrrSum += rr;

    const bad = (c.forbidTop5 || []).filter((id) => ids.slice(0, 5).includes(id));
    forbidViolations += bad.length;

    details.push({
      q: c.q,
      count: ids.length,
      hit: `${hits.length}/${expected.length}@${k}`,
      missed: expected.filter((id) => !topK.includes(id)),
      bad,
      top5: ids.slice(0, 5)
    });
  }
  const elapsedMs = performance.now() - t0;
  return {
    name,
    recall: totalHit / totalTarget,
    mrr: mrrSum / CASES.length,
    zeroRate: zeroCount / CASES.length,
    forbidViolations,
    avgMs: elapsedMs / CASES.length,
    details
  };
}

const oldRes = evalRunner('旧版 indexOf 基线', oldSearch);
const newRes = evalRunner('新版混合搜索引擎', (q) => engine.search(q).items.map((x) => x.skill.id));

const pct = (n) => (n * 100).toFixed(1) + '%';
console.log('================ 搜索质量 A/B 评测汇总 ================');
console.log(`测试用例：${CASES.length} 条真实查询（覆盖 11 分类、盘古之白、口语痛点、极性保护、拼写容错、拼音）\n`);
console.log(
  `指标               | ${oldRes.name.padEnd(16)} | ${newRes.name}\n` +
  `-------------------+----------------------+----------------------\n` +
  `核心召回率 (Recall) | ${pct(oldRes.recall).padEnd(20)} | ${pct(newRes.recall)}\n` +
  `首命中 MRR         | ${oldRes.mrr.toFixed(3).padEnd(20)} | ${newRes.mrr.toFixed(3)}\n` +
  `零结果率 (越低越好) | ${pct(oldRes.zeroRate).padEnd(20)} | ${pct(newRes.zeroRate)}\n` +
  `极性污染次数       | ${String(oldRes.forbidViolations).padEnd(20)} | ${newRes.forbidViolations}\n` +
  `单次平均耗时       | ${oldRes.avgMs.toFixed(2)} ms              | ${newRes.avgMs.toFixed(2)} ms`
);

console.log('\n---------------- 新引擎逐条明细 ----------------');
for (const d of newRes.details) {
  const status = d.missed.length === 0 && d.bad.length === 0 ? '✓' : '△';
  console.log(
    `${status} [${d.q}] 共 ${String(d.count).padStart(2)} 条 · 命中 ${d.hit.padEnd(7)} · Top5: ${d.top5.join(', ')}` +
    (d.missed.length ? `  ⚠ 漏: ${d.missed.join(',')}` : '') +
    (d.bad.length ? `  ❌ 误入Top5: ${d.bad.join(',')}` : '')
  );
}

// 重点打印「去AI味」完整排序结果
console.log('\n---------------- 重点检验：「去AI味」完整排序 ----------------');
const demo = engine.search('去AI味');
demo.items.forEach((it, idx) => {
  console.log(
    `${String(idx + 1).padStart(2)}. [${it.skill.id}] ${it.skill.name} (${it.skill.cat}) · score=${it.score.toFixed(1)} · tier=${it.tier}` +
    (it.badge ? ` · ${it.badge}` : '')
  );
});

if (STRICT && (newRes.recall < 0.9 || newRes.zeroRate > 0.05 || newRes.forbidViolations > 0)) {
  console.error('\n❌ 严格模式未通过阈值');
  process.exit(1);
}
