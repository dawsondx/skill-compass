#!/usr/bin/env node
/**
 * _tools/build-search-index.mjs —— 离线语义搜索索引构建器（零依赖）
 *
 * 将「离线智能」前移到构建期，产出极轻的静态 site/assets/js/search-index.js：
 *   1. 读取 data.js + skillmd.js + _tools/search-taxonomy.json + _tools/search-enrich.json
 *   2. 结合 Node 原生 Intl.Segmenter 与全库 TF-IDF，从 SKILL.md / README 中提纯高区分度增量关键词
 *   3. 自动归属受控概念簇（含否定极性保护，如「去AI味」「无Mermaid」「省Token」）
 *   4. 计算 320 条全量 TF-IDF 余弦相似度矩阵，为每条生成 Top-5 语义近邻（供抽屉「同类替代」与搜索扩展）
 *   5. 可选 --llm 增量模式：仅为 _tools/search-enrich.json 中缺失的新增条目调 OpenAI-compatible 接口生成 JTBD 意图
 *
 * 用法：
 *   node _tools/build-search-index.mjs          # 纯离线构建（CI 默认）
 *   node _tools/build-search-index.mjs --llm    # 对缺失条目增量调用 LLM 扩充 _tools/search-enrich.json 后再构建
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = path.join(ROOT, 'site', 'assets', 'js', 'data.js');
const SKILLMD_PATH = path.join(ROOT, 'site', 'assets', 'js', 'skillmd.js');
const TAXONOMY_PATH = path.join(ROOT, '_tools', 'search-taxonomy.json');
const ENRICH_PATH = path.join(ROOT, '_tools', 'search-enrich.json');
const OUT_PATH = path.join(ROOT, 'site', 'assets', 'js', 'search-index.js');

const USE_LLM = process.argv.includes('--llm');

/* ---------- 文本归一化（与运行期 search-engine.js 保持同一口径） ---------- */
function normCompact(str) {
  if (!str) return '';
  let s = String(str).toLowerCase();
  // 全角转半角（空格与 ASCII 范围）
  s = s.replace(/\u3000/g, ' ').replace(/[\uFF01-\uFF5E]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
  );
  // 去掉中英文 / 数字之间的盘古之白，让「去 AI 味」与「去AI味」完全等价
  s = s.replace(/([\u4e00-\u9fff])\s+([a-z0-9])/g, '$1$2');
  s = s.replace(/([a-z0-9])\s+([\u4e00-\u9fff])/g, '$1$2');
  // 合并空白
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

const zhSeg = typeof Intl !== 'undefined' && Intl.Segmenter
  ? new Intl.Segmenter('zh-CN', { granularity: 'word' })
  : null;

function tokenize(str) {
  const s = normCompact(str);
  if (!s) return [];
  const out = [];
  if (zhSeg) {
    for (const seg of zhSeg.segment(s)) {
      if (!seg.isWordLike) continue;
      const w = seg.segment.trim();
      if (w) out.push(w);
    }
  } else {
    const m = s.match(/[\u4e00-\u9fff]+|[a-z0-9]+/g);
    if (m) out.push(...m);
  }
  return out;
}

/* ---------- 加载沙箱数据 ---------- */
function loadData() {
  const sb = {};
  vm.createContext(sb);
  Object.defineProperty(sb, 'window', { value: sb, writable: true, configurable: true });
  vm.runInContext(fs.readFileSync(DATA_PATH, 'utf8'), sb, { filename: 'data.js' });
  if (fs.existsSync(SKILLMD_PATH)) {
    vm.runInContext(fs.readFileSync(SKILLMD_PATH, 'utf8'), sb, { filename: 'skillmd.js' });
  }
  return {
    SKILLS: sb.SKILLS || [],
    CATS: sb.CATS || [],
    AUTHORS: sb.AUTHORS || [],
    SKILLMD: sb.SKILLMD || {}
  };
}

/* ---------- 可选 LLM 增量扩充（只补缺失的新增 Skill） ---------- */
async function enrichWithLLM(skills, skillmd, enrich) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('⚠ 传入了 --llm 但未设置 OPENAI_API_KEY，跳过 LLM 增量扩展');
    return enrich;
  }
  const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const missing = skills.filter((s) => !enrich[s.id]);
  if (!missing.length) {
    console.log('· 所有条目均已有语义扩展，无需调用 LLM');
    return enrich;
  }
  console.log(`· 准备为 ${missing.length} 条新增 Skill 增量生成 JTBD 语义扩展（model=${model}）…`);
  const BATCH = 10;
  for (let i = 0; i < missing.length; i += BATCH) {
    const chunk = missing.slice(i, i + BATCH);
    const promptItems = chunk.map((s) => ({
      id: s.id,
      cat: s.cat,
      name: s.name,
      repo: s.repo,
      tags: s.tags,
      desc: s.desc,
      snippet: (skillmd[s.id] || '').slice(0, 260)
    }));
    const body = {
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            '你是中文搜索架构师。请为每个 Agent Skill 生成用户真实会搜的口语意图短语(i, 4-7条, 聚焦痛点/交付物/输入转化, 不加多余空格)和别名/缩写/拼音(a, 2-4条)。返回 JSON：{"items": {"<id>": {"i": [...], "a": [...]}}}'
        },
        { role: 'user', content: JSON.stringify(promptItems) }
      ]
    };
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const parsed = JSON.parse(json.choices[0].message.content);
      const items = parsed.items || parsed;
      for (const s of chunk) {
        if (items[s.id] && Array.isArray(items[s.id].i)) {
          enrich[s.id] = {
            i: items[s.id].i.slice(0, 8),
            a: Array.isArray(items[s.id].a) ? items[s.id].a.slice(0, 6) : []
          };
        }
      }
      console.log(`  ✓ 批次 ${Math.floor(i / BATCH) + 1}/${Math.ceil(missing.length / BATCH)} 完成`);
    } catch (err) {
      console.warn(`  ⚠ 批次 ${Math.floor(i / BATCH) + 1} 失败（已跳过）：${err.message}`);
    }
  }
  enrich._meta = Object.assign({}, enrich._meta, { updated: new Date().toISOString().slice(0, 10) });
  fs.writeFileSync(ENRICH_PATH, JSON.stringify(enrich, null, 2) + '\n', 'utf8');
  return enrich;
}

/* ---------- 从 SKILL.md / README 中提纯高区分度增量关键词 ---------- */
const BODY_NOISE = new Set([
  'name', 'description', 'allowed', 'tools', 'metadata', 'trigger', 'source', 'revision', 'author', 'version',
  'license', 'mit', 'apache', 'github', 'readme', 'skill', 'skills', 'claude', 'code', 'codex', 'cursor', 'agent',
  'agents', 'opencode', 'npx', 'npm', 'git', 'clone', 'install', 'installation', 'usage', 'example', 'examples',
  'project', 'open', 'free', 'support', 'sponsor', 'sponsors', 'sponsoring', 'thanks', 'click', 'collapse',
  'http', 'https', 'www', 'com', 'org', 'net', 'io', 'dev', 'blob', 'main', 'master', 'tree', 'src', 'docs',
  'read', 'write', 'edit', 'bash', 'run', 'use', 'using', 'used', 'with', 'from', 'that', 'this', 'your', 'you',
  'for', 'the', 'and', 'are', 'can', 'will', 'all', 'any', 'into', 'when', 'how', 'what', 'why', 'more', 'most',
  'also', 'just', 'like', 'make', 'made', 'new', 'one', 'two', 'three', 'first', 'best', 'based', 'built', 'via',
  'askuserquestion', 'webfetch', 'websearch', 'grep', 'glob', 'todo', 'task', 'file', 'files', 'output', 'input',
  'prompt', 'prompts', 'llm', 'ai', 'model', 'models', 'api', 'data', 'text', 'user', 'users', 'work', 'workflow',
  'its', 'gets', 'get', 'set', 'not', 'but', 'out', 'off', 'own', 'same', 'such', 'each', 'both', 'few', 'has',
  'have', 'had', 'does', 'did', 'been', 'being', 'they', 'them', 'their', 'then', 'than', 'only', 'very', 'much',
  'should', 'would', 'could', 'about', 'after', 'before', 'between', 'through', 'under', 'again', 'without', 'within',
  'into', 'over', 'other', 'some', 'more', 'here', 'there', 'where', 'which', 'while', 'want', 'need', 'just',
  '使用', '支持', '可以', '通过', '进行', '自动', '生成', '功能', '工具', '项目', '文件', '内容', '方式', '效果',
  '基于', '提供', '帮助', '用户', '直接', '需要', '快速', '一键', '完整', '开源', '免费', '安装', '配置', '说明',
  '文档', '包括', '以及', '或者', '如果', '一个', '这个', '用于', '适用', '默认', '输出', '输入', '系统', '模式'
]);

function extractCleanSnippet(raw) {
  if (!raw) return '';
  const lines = String(raw).split('\n');
  const priority = [];
  const rest = [];
  let inFront = false;
  let frontClosed = false;
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i].trim();
    if (i === 0 && ln === '---') { inFront = true; continue; }
    if (inFront && ln === '---') { inFront = false; frontClosed = true; continue; }
    if (inFront) {
      const m = ln.match(/^(description|trigger|summary|keywords|tags)\s*:\s*(.+)$/i);
      if (m) priority.push(m[2].replace(/^['"]|['"]$/g, ''));
      continue;
    }
    if (!ln) continue;
    // 跳过赞助商 / 折叠 / 徽章 / 纯命令 / URL 行
    if (/sponsor|click to collapse|buy me a coffee|star history|shields\.io|badge|license|npx skills/i.test(ln)) continue;
    if (/^(https?:\/\/|```|\$ |npm |pnpm |yarn |git |pip |brew )/i.test(ln)) continue;
    rest.push(ln.replace(/https?:\/\/\S+/g, ' ').replace(/[#*`>|]/g, ' '));
    if (rest.length >= 14) break;
  }
  // YAML description/trigger 权重加倍（重复一次以提高 TF）
  return (priority.join(' ') + ' ' + priority.join(' ') + ' ' + rest.join(' ')).trim();
}

function buildBodyKeywords(skills, skillmd, baseTexts) {
  const df = new Map();
  const docTF = new Map();

  for (const s of skills) {
    const snippet = extractCleanSnippet(skillmd[s.id] || '');
    const tokens = tokenize(snippet).filter((w) => {
      if (BODY_NOISE.has(w)) return false;
      if (/^\d+$/.test(w)) return false;
      const isZh = /[\u4e00-\u9fff]/.test(w);
      if (isZh) return w.length >= 2 && w.length <= 6;
      return /^[a-z][a-z0-9._-]{2,20}$/.test(w);
    });
    const tf = new Map();
    for (const w of tokens) tf.set(w, (tf.get(w) || 0) + 1);
    docTF.set(s.id, tf);
    for (const w of tf.keys()) df.set(w, (df.get(w) || 0) + 1);
  }

  const N = skills.length;
  const out = {};
  for (const s of skills) {
    const tf = docTF.get(s.id) || new Map();
    const baseNorm = baseTexts.get(s.id) || '';
    const scored = [];
    for (const [w, count] of tf.entries()) {
      // 已在卡片基础字段里出现过的词不重复塞进 body，省空间且只保留增量信息
      if (baseNorm.includes(w)) continue;
      const docFreq = df.get(w) || 1;
      // 出现在超过 22% 文档中的词区分度太低，滤掉
      if (docFreq > N * 0.22) continue;
      const idf = Math.log((N + 1) / (docFreq + 1)) + 1;
      const isZh = /[\u4e00-\u9fff]/.test(w);
      scored.push({ w, score: (1 + Math.log(count)) * idf * (isZh ? 1.15 : 1.0) });
    }
    scored.sort((a, b) => b.score - a.score);
    out[s.id] = scored.slice(0, 12).map((x) => x.w);
  }
  return out;
}

/* ---------- 语义近邻计算（TF-IDF 加权余弦相似度） ---------- */
function buildSemanticNeighbors(skills, docMeta) {
  const df = new Map();
  const vecs = new Map();

  for (const s of skills) {
    const meta = docMeta.get(s.id);
    const bag = new Map();
    const add = (tok, weight) => {
      if (!tok || tok.length < 2) return;
      bag.set(tok, (bag.get(tok) || 0) + weight);
    };
    // 分类作为温和底座，避免跨类乱连又允许跨类强语义（如 hallmark 与 humanizer-zh）
    add('__cat:' + s.cat, 1.4);
    // 概念簇是强语义锚点
    for (const c of meta.c) add('__concept:' + c, 3.2);
    // 标签高权
    for (const t of (s.tags || [])) {
      const nt = normCompact(t);
      add('__tag:' + nt, 2.8);
      for (const tok of tokenize(t)) add(tok, 1.6);
    }
    // 离线意图词高权
    for (const intent of meta.i) {
      for (const tok of tokenize(intent)) add(tok, 1.5);
    }
    // 标题与描述分词
    for (const tok of tokenize(s.name)) add(tok, 1.4);
    for (const tok of tokenize(s.desc)) add(tok, 0.9);
    // 提纯 body 词低权
    for (const bw of meta.b) add(bw, 0.5);

    vecs.set(s.id, bag);
    for (const k of bag.keys()) df.set(k, (df.get(k) || 0) + 1);
  }

  const N = skills.length;
  const tfidf = new Map();
  const norms = new Map();
  for (const s of skills) {
    const bag = vecs.get(s.id);
    const v = new Map();
    let sq = 0;
    for (const [k, tf] of bag.entries()) {
      const idf = k.startsWith('__cat:') ? 1.0 : Math.log((N + 1) / ((df.get(k) || 1) + 1)) + 1;
      const val = tf * idf;
      v.set(k, val);
      sq += val * val;
    }
    tfidf.set(s.id, v);
    norms.set(s.id, Math.sqrt(sq) || 1);
  }

  const neighbors = {};
  for (const a of skills) {
    const va = tfidf.get(a.id);
    const na = norms.get(a.id);
    const scores = [];
    for (const b of skills) {
      if (a.id === b.id) continue;
      // 同一个合集的父子条目本身就有 from/subs 反链，不占同类替代坑位
      if (a.from === b.id || b.from === a.id) continue;
      const vb = tfidf.get(b.id);
      let dot = 0;
      for (const [k, val] of va.entries()) {
        const bv = vb.get(k);
        if (bv) dot += val * bv;
      }
      if (dot <= 0) continue;
      let sim = dot / (na * norms.get(b.id));
      // 稍微照顾同分类的稳定度，但强跨类语义依然能穿透
      if (a.cat === b.cat) sim += 0.04;
      // 极轻微热度微调，打破平局
      sim += Math.log10((b.stars || 0) + 10) * 0.004;
      scores.push({ id: b.id, sim });
    }
    scores.sort((x, y) => y.sim - x.sim);
    neighbors[a.id] = scores.slice(0, 5).map((x) => x.id);
  }
  return neighbors;
}

/* ---------- 主流程 ---------- */
async function main() {
  const { SKILLS, CATS, AUTHORS, SKILLMD } = loadData();
  const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf8'));
  let enrich = fs.existsSync(ENRICH_PATH)
    ? JSON.parse(fs.readFileSync(ENRICH_PATH, 'utf8'))
    : {};

  if (USE_LLM) {
    enrich = await enrichWithLLM(SKILLS, SKILLMD, enrich);
  }

  const catMap = Object.fromEntries(CATS.map((c) => [c.key, c]));
  const authorMap = Object.fromEntries(AUTHORS.map((a) => [a.owner.toLowerCase(), a]));
  const authorAliases = taxonomy.authorAliases || {};

  // 预编译概念匹配表
  const concepts = (taxonomy.concepts || []).filter((c) => c.terms && c.terms.length).map((c) => ({
    id: c.id,
    label: c.label,
    atomic: !!c.atomic,
    polarity: !!c.polarity,
    terms: Array.from(new Set(c.terms.map(normCompact).filter(Boolean))),
    related: (c.related || []).map(normCompact).filter(Boolean)
  }));

  // 1. 组装每个 Skill 的基础归一化文本（供 body 去重 & 概念归属）
  const baseTexts = new Map();
  for (const s of SKILLS) {
    const owner = s.repo.split('/')[0].toLowerCase();
    const author = authorMap[owner];
    const e = enrich[s.id] || {};
    const subsText = (s.subs || []).map((x) => `${x.name} ${x.one} ${x.dir}`).join(' ');
    const full = normCompact([
      s.id, s.name, s.repo, s.desc,
      (s.tags || []).join(' '),
      author ? `${author.name} ${author.owner}` : owner,
      (e.i || []).join(' '),
      (e.a || []).join(' '),
      subsText
    ].join(' '));
    baseTexts.set(s.id, full);
  }

  // 2. 提纯 SKILL.md / README 增量关键词
  const bodyMap = buildBodyKeywords(SKILLS, SKILLMD, baseTexts);

  // 3. 逐条组装文档搜索元数据
  const docMeta = new Map();
  let enrichedCount = 0;
  for (const s of SKILLS) {
    const owner = s.repo.split('/')[0].toLowerCase();
    const e = enrich[s.id] || null;
    if (e) enrichedCount++;

    const intents = Array.from(new Set((e && e.i ? e.i : []).map((x) => String(x).trim()).filter(Boolean)));
    const aliasSet = new Set();
    if (e && e.a) e.a.forEach((x) => aliasSet.add(normCompact(x)));
    if (authorAliases[owner]) authorAliases[owner].forEach((x) => aliasSet.add(normCompact(x)));
    // 仓库名去连字符别名（如 stop-slop → stopslop, ui-ux-pro-max → uiuxpromax）
    const repoLeaf = normCompact(s.repo.split('/')[1] || '');
    if (repoLeaf.includes('-')) aliasSet.add(repoLeaf.replace(/-/g, ''));
    const aliases = Array.from(aliasSet).filter((x) => x && x.length >= 2);

    const body = bodyMap[s.id] || [];

    // 概念簇归属：基于精选结构化基础文本（含 JTBD 意图与别名），所有纯 ASCII 词走词边界防子串误伤
    const baseText = baseTexts.get(s.id) || '';
    const matchedConcepts = [];
    for (const c of concepts) {
      const hit = c.terms.some((t) => {
        if (/^[a-z0-9._-]+$/.test(t)) {
          const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`).test(baseText);
        }
        return baseText.includes(t);
      });
      if (hit) matchedConcepts.push(c.id);
    }

    docMeta.set(s.id, { i: intents, a: aliases, b: body, c: matchedConcepts });
  }

  // 4. 离线计算 Top-5 语义近邻
  const neighbors = buildSemanticNeighbors(SKILLS, docMeta);

  // 5. 生成紧凑的静态 JS 快照
  const docs = {};
  for (const s of SKILLS) {
    const m = docMeta.get(s.id);
    const entry = {};
    if (m.i.length) entry.i = m.i;
    if (m.a.length) entry.a = m.a;
    if (m.b.length) entry.b = m.b;
    if (m.c.length) entry.c = m.c;
    if (neighbors[s.id] && neighbors[s.id].length) entry.s = neighbors[s.id];
    docs[s.id] = entry;
  }

  const payload = {
    v: 1,
    builtAt: new Date().toISOString().slice(0, 10),
    hotQueries: taxonomy.hotQueries || [],
    stopwords: (taxonomy.stopwords || []).map(normCompact).filter(Boolean),
    concepts: concepts.map((c) => {
      const obj = { id: c.id, l: c.label, t: c.terms };
      if (c.atomic) obj.at = 1;
      if (c.polarity) obj.p = 1;
      if (c.related.length) obj.r = c.related;
      return obj;
    }),
    docs
  };

  const outCode =
    '/* 离线语义搜索索引 —— _tools/build-search-index.mjs 生成，别手改\n' +
    '   i=JTBD意图短语 a=别名/拼音 b=SKILL.md提纯关键词 c=受控概念簇 s=语义Top5近邻 */\n' +
    'window.SEARCH_INDEX = ' + JSON.stringify(payload) + ';\n';

  fs.writeFileSync(OUT_PATH, outCode, 'utf8');
  const kb = (Buffer.byteLength(outCode, 'utf8') / 1024).toFixed(1);
  console.log(
    `✅ 搜索索引构建完成：${SKILLS.length} 条（JTBD 精加工 ${enrichedCount} 条 · 概念簇 ${concepts.length} 组）· 输出 ${kb} KB → site/assets/js/search-index.js`
  );

  // 顺手打印几条关键抽检结果，确认质量
  ['humanizer-zh', 'hallmark', 'human-writing', 'ppt-master', 'caveman'].forEach((id) => {
    const d = docs[id];
    if (!d) return;
    console.log(`  [${id}] concepts=${(d.c || []).join(',')} | sim=${(d.s || []).slice(0, 3).join(',')} | body=${(d.b || []).slice(0, 5).join(',')}`);
  });
}

main().catch((err) => {
  console.error('❌ 构建搜索索引失败：', err);
  process.exit(1);
});
