#!/usr/bin/env node
/**
 * _tools/add-skill.mjs —— 跨 AI 通用「新增 Skill」确定性流水线（零依赖）
 *
 * 将「AI 擅长的高判断力工作」与「易出错的机械同步工作」彻底解耦：
 *   1. inspect <url...>       侦察 GitHub 仓库：解析 URL、防重、抓 stars/提交/版本/SKILL.md/README/作者状态
 *   2. commit <json | ->      校验 AI 决策单（含强制语义搜索意图），一条龙完成写入与全链路验证：
 *                               data.js (SKILLS / AUTHORS / UPS) → seed.json → search-enrich.json
 *                               → search-taxonomy.json → fetch-skillmd (--ids) → fetch-demo-images (--ids)
 *                               → build-search-index.mjs → prerender.mjs → README.md 计数同步
 *                               → eval-search.mjs --strict + 新条目即席搜索 Top-3 断言
 *
 * 用法：
 *   node _tools/add-skill.mjs inspect https://github.com/owner/repo
 *   node _tools/add-skill.mjs commit decision.json
 *   node _tools/add-skill.mjs commit decision.json --dry
 *   cat decision.json | node _tools/add-skill.mjs commit -
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fetchOne } from '../site/server/upstream.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = path.join(ROOT, 'site', 'assets', 'js', 'data.js');
const SEED_PATH = path.join(ROOT, 'site', 'server', 'seed.json');
const ENRICH_PATH = path.join(ROOT, '_tools', 'search-enrich.json');
const TAXONOMY_PATH = path.join(ROOT, '_tools', 'search-taxonomy.json');
const README_PATH = path.join(ROOT, 'README.md');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';
const AUTHOR_PALETTE = [
  '#C2410C', '#0D9488', '#E2603F', '#B45309', '#BE185D',
  '#7C3AED', '#0F766E', '#1D4ED8', '#4B5563', '#9F1239',
  '#0891B2', '#166534', '#92400E', '#1E40AF'
];

function pad2(n) { return (n < 10 ? '0' : '') + n; }
function todayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${pad2(t.getMonth() + 1)}-${pad2(t.getDate())}`;
}
function slugify(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function escJS(s) {
  return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/* ---------- 加载当前 data.js 沙箱 ---------- */
function loadCurrentData() {
  const src = fs.readFileSync(DATA_PATH, 'utf8');
  const sb = {};
  vm.createContext(sb);
  Object.defineProperty(sb, 'window', { value: sb, writable: true, configurable: true });
  vm.runInContext(src, sb, { filename: 'data.js' });
  return {
    src,
    SKILLS: sb.SKILLS || [],
    CATS: sb.CATS || [],
    AUTHORS: sb.AUTHORS || [],
    UPS: sb.UPS || {},
    UPS_FETCHED: sb.UPS_FETCHED || ''
  };
}

/* ---------- 解析各种形态的 GitHub 链接 ---------- */
function parseGithubInput(raw) {
  const s = String(raw || '').trim();
  // 允许简写 owner/repo
  if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(s)) {
    const repo = s.replace(/\.git$/, '');
    return { repo, path: '', skill: '' };
  }
  let u;
  try { u = new URL(s); } catch { throw new Error(`无法解析 GitHub 链接：${raw}`); }
  if (!/(^|\.)github\.com$/i.test(u.hostname)) {
    throw new Error(`不是 GitHub 链接：${raw}`);
  }
  const parts = u.pathname.replace(/^\/+|\/+$/g, '').split('/');
  if (parts.length < 2) throw new Error(`链接缺少 owner/repo：${raw}`);
  const repo = `${parts[0]}/${parts[1].replace(/\.git$/, '')}`;
  let subPath = '';
  let skill = '';
  if (parts[2] === 'tree' && parts.length >= 5) {
    subPath = parts.slice(2).join('/');
    skill = parts[parts.length - 1];
  }
  return { repo, path: subPath, skill };
}

/* ---------- 抓取 GitHub 仓库元信息 + SKILL.md / README ---------- */
async function fetchRepoHtmlMeta(repo) {
  const url = `https://github.com/${repo}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000)
  });
  if (!res.ok) return { ok: false, status: res.status, finalRepo: repo };
  const html = await res.text();
  const num = (k) => {
    const m = html.match(new RegExp('"' + k + '":(\\d+)'));
    return m ? Number(m[1]) : null;
  };
  const str = (k) => {
    const m = html.match(new RegExp('"' + k + '":"((?:[^"\\\\]|\\\\.)*)"'));
    if (!m) return null;
    try { return JSON.parse('"' + m[1] + '"'); } catch { return m[1]; }
  };
  const finalRepo = (() => {
    const m = res.url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
    return m ? `${m[1]}/${m[2]}` : repo;
  })();
  // 顺手判断仓库 HTML 里常见的 star 兜底（当内嵌 JSON 缺 stargazerCount 时）
  let stars = num('stargazerCount');
  if (stars == null) {
    const mStar = html.match(/id="repo-stars-counter-star"[^>]*title="([0-9,]+)"/i)
      || html.match(/aria-label="([0-9,]+) users starred this repository"/i);
    if (mStar) stars = Number(mStar[1].replace(/,/g, ''));
  }
  const isOrg = /"owner":\{[^}]*"__typename":"Organization"/.test(html)
    || /<meta name="octolytics-dimension-user_login"[^>]*>/i.test(html) && /"organization":\{/.test(html);
  return {
    ok: true,
    status: 200,
    finalRepo,
    stars: stars ?? 0,
    githubDesc: str('description') || '',
    archived: /"isArchived":true/.test(html),
    isOrg
  };
}

async function fetchRawFirst(candidates) {
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA },
        redirect: 'follow',
        signal: AbortSignal.timeout(12000)
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim()) return { url, text };
      }
    } catch {}
  }
  return null;
}

async function fetchRepoDocs(repo, subPath) {
  const base = `https://raw.githubusercontent.com/${repo}`;
  const cleanSub = subPath ? subPath.replace(/^tree\/[^/]+\//, '').replace(/^\/+|\/+$/g, '') : '';
  const skillCandidates = [];
  if (cleanSub) {
    skillCandidates.push(`${base}/HEAD/${cleanSub}/SKILL.md`, `${base}/main/${cleanSub}/SKILL.md`);
  }
  skillCandidates.push(
    `${base}/HEAD/SKILL.md`, `${base}/HEAD/skill.md`,
    `${base}/main/SKILL.md`, `${base}/master/SKILL.md`
  );
  const skillMd = await fetchRawFirst(skillCandidates);
  const readme = await fetchRawFirst([
    `${base}/HEAD/README.md`, `${base}/HEAD/readme.md`,
    `${base}/HEAD/README_CN.md`, `${base}/HEAD/README.zh-CN.md`,
    `${base}/main/README.md`, `${base}/master/README.md`
  ]);
  return {
    hasSkillMd: !!skillMd,
    skillMdPreview: skillMd ? skillMd.text.slice(0, 2200) : '',
    readmePreview: readme ? readme.text.slice(0, 2600) : ''
  };
}

/* ---------- 作者准入自动侦察（双轨克制门槛） ----------
   轨道 A（个人创作者）：多产 + 口碑双达标
     - 密度：站内独立仓库 >= 3（或站内卡片 >= 2 且含大型多子技能合集）
     - 口碑：站内累计 Star >= 1,500 或单仓最高 >= 1,000（纯单卡爆款不占创作者坑位）
   轨道 B（一级生态官方）：仅知名 AI / 开发 / 办公大厂官方组织，不把任意小团队 Org 自动放行 */
const TIER1_OFFICIAL_ORGS = new Set([
  'anthropics', 'microsoft', 'vercel-labs', 'vercel', 'larksuite', 'google', 'google-gemini',
  'openai', 'github', 'aws', 'opensensenova', 'wecomteam', 'wechatpay-apiv3', 'alibaba', 'bytedance'
]);

function evaluateAuthor(owner, stars, repo, isDup, SKILLS, AUTHORS) {
  const low = owner.toLowerCase();
  const existingAuthor = AUTHORS.find((a) => a.owner.toLowerCase() === low);
  if (existingAuthor) {
    return {
      status: 'already_listed',
      author: existingAuthor,
      reason: `创作者 ${existingAuthor.name} (${existingAuthor.owner}) 已在 AUTHORS 中，无需新增`
    };
  }
  const ownerSkills = SKILLS.filter((s) => s.repo.split('/')[0].toLowerCase() === low);
  const existingRepos = new Set(ownerSkills.map((s) => s.repo.toLowerCase()));
  const repoLow = String(repo || '').toLowerCase();
  const isNewRepo = repoLow && !existingRepos.has(repoLow);
  const totalReposAfter = existingRepos.size + (isDup ? 0 : (isNewRepo ? 1 : 0));
  const totalCardsAfter = ownerSkills.length + (isDup ? 0 : 1);
  const maxStarAfter = ownerSkills.reduce((m, s) => Math.max(m, s.stars || 0), stars || 0);
  const totalStarsAfter = ownerSkills.reduce((acc, s) => acc + (s.stars || 0), isDup ? 0 : (stars || 0));
  const hasBigPack = ownerSkills.some((s) => s.cat === 'pack' || (s.subs && s.subs.length >= 15));

  // 选一个和当前 AUTHORS 颜色尽量少重复的配色
  const usedColors = {};
  AUTHORS.forEach((a) => { usedColors[a.color] = (usedColors[a.color] || 0) + 1; });
  const suggestedColor = AUTHOR_PALETTE.slice().sort((a, b) => (usedColors[a] || 0) - (usedColors[b] || 0))[0];

  // 轨道 B：一级生态官方
  if (TIER1_OFFICIAL_ORGS.has(low)) {
    return {
      status: 'suggest_add_author',
      existingRepoCount: existingRepos.size,
      totalReposAfter,
      totalCardsAfter,
      maxStarAfter,
      totalStarsAfter,
      suggested: { owner, name: owner, kind: 'official', color: suggestedColor, note: '' },
      reason: '命中轨道 B（一线生态官方组织），建议评估作为 official 纳入 AUTHORS'
    };
  }

  // 轨道 A：多产 + 口碑双达标
  const passDensity = totalReposAfter >= 3 || (totalCardsAfter >= 2 && hasBigPack);
  const passReputation = totalStarsAfter >= 1500 || maxStarAfter >= 1000;
  if (passDensity && passReputation) {
    return {
      status: 'suggest_add_author',
      existingRepoCount: existingRepos.size,
      totalReposAfter,
      totalCardsAfter,
      maxStarAfter,
      totalStarsAfter,
      suggested: { owner, name: owner, kind: 'creator', color: suggestedColor, note: '' },
      reason: `命中轨道 A（多产 + 口碑双达标）：站内 ${totalReposAfter} 仓 / ${totalCardsAfter} 卡 · 累计 ★ ${totalStarsAfter}（最高 ★ ${maxStarAfter}）`
    };
  }

  let skipNote = `未达双轨门槛（当前 ${totalReposAfter} 仓 / ${totalCardsAfter} 卡，累计 ★ ${totalStarsAfter}；个人创作者需 ≥3 仓且累计 ≥1500★ 或单仓 ≥1000★，单卡爆款不占创作者坑位）`;
  if (passDensity && !passReputation) {
    skipNote = `已达作品集密度（${totalReposAfter} 仓），但累计 ★ ${totalStarsAfter} 暂未过 1,500 门槛；除非具备极鲜明垂直辨识度并由用户明确指定，否则暂不新增`;
  }
  return {
    status: 'skip',
    existingRepoCount: existingRepos.size,
    totalReposAfter,
    totalCardsAfter,
    maxStarAfter,
    totalStarsAfter,
    reason: skipNote
  };
}

/* ---------- 子命令 1：inspect ---------- */
async function cmdInspect(inputs) {
  if (!inputs.length) {
    console.error('用法：node _tools/add-skill.mjs inspect <github-url> [url2 ...]');
    process.exit(1);
  }
  const { SKILLS, CATS, AUTHORS } = loadCurrentData();
  const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf8'));
  const existingIds = new Set(SKILLS.map((s) => s.id));

  const results = [];
  for (const raw of inputs) {
    const parsed = parseGithubInput(raw);
    const meta = await fetchRepoHtmlMeta(parsed.repo);
    const finalRepo = meta.finalRepo || parsed.repo;
    const dup = SKILLS.find((s) =>
      s.repo.toLowerCase() === finalRepo.toLowerCase() &&
      String(s.skill || '').toLowerCase() === String(parsed.skill || '').toLowerCase()
    );
    const upsRes = meta.ok ? await fetchOne(finalRepo) : null;
    const upsRow = (upsRes && Array.isArray(upsRes.row)) ? upsRes.row : ['', '', ''];
    const docs = meta.ok ? await fetchRepoDocs(finalRepo, parsed.path) : { hasSkillMd: false, skillMdPreview: '', readmePreview: '' };
    const owner = finalRepo.split('/')[0];
    let suggestedId = slugify(parsed.skill ? `${finalRepo}-${parsed.skill}` : finalRepo);
    if (existingIds.has(suggestedId)) suggestedId += '-new';

    results.push({
      input: raw,
      accessible: meta.ok,
      httpStatus: meta.status,
      duplicate: dup ? { id: dup.id, name: dup.name, repo: dup.repo, cat: dup.cat } : null,
      repo: finalRepo,
      path: parsed.path || undefined,
      skill: parsed.skill || undefined,
      suggestedId,
      stars: meta.stars,
      archived: meta.archived,
      githubDesc: meta.githubDesc,
      upstream: { upd: upsRow[0] || '', ver: upsRow[1] || '', verAt: upsRow[2] || '' },
      authorCheck: evaluateAuthor(owner, meta.stars, finalRepo, !!dup, SKILLS, AUTHORS),
      hasSkillMd: docs.hasSkillMd,
      skillMdPreview: docs.skillMdPreview,
      readmePreview: docs.readmePreview
    });
  }

  const report = {
    inspectedAt: todayStr(),
    totalSkillsBefore: SKILLS.length,
    categories: CATS.map((c) => ({ key: c.key, name: c.name, desc: c.desc })),
    existingConcepts: (taxonomy.concepts || []).map((c) => ({ id: c.id, label: c.label, polarity: !!c.polarity })),
    items: results,
    commitSchemaHint: {
      repo: 'owner/repo',
      id: 'kebab-case-id',
      name: '中文短名（建议 4-16 字）',
      cat: '11 个分类 key 之一',
      desc: '40-120 字人话描述：先说产出什么，再说什么时候用',
      tags: ['标签1', '标签2', '标签3'],
      searchIntents: ['至少 4 条（推荐 5-8 条）用户真实会搜的痛点/场景口语短语，不加多余空格'],
      searchAliases: ['2-5 条中英文别名/缩写/拼音'],
      newAuthor: '(可选) { owner, name, kind: "creator"|"official", color?, note, aliases?: [...] }',
      newTaxonomyTerms: '(可选) [{ conceptId, terms: [...] }]'
    }
  };
  console.log(JSON.stringify(report, null, 2));
}

/* ---------- 写入辅助函数（严格保持原文件风格与 CRLF） ---------- */
function insertAuthorInDataJs(src, author, eol) {
  const skillsMark = 'window.SKILLS = [';
  const sIdx = src.indexOf(skillsMark);
  if (sIdx < 0) throw new Error('data.js 中找不到 window.SKILLS');
  const endIdx = src.lastIndexOf('];', sIdx);
  if (endIdx < 0) throw new Error('data.js 中找不到 window.AUTHORS 结尾');
  const head = src.slice(0, endIdx).replace(/[\s,]+$/, '');
  const line = `  { owner: '${escJS(author.owner)}', name: '${escJS(author.name)}', kind: '${author.kind}', color: '${author.color}', note: '${escJS(author.note)}' }`;
  return head + ',' + eol + line + eol + src.slice(endIdx);
}

function insertSkillsInDataJs(src, items, eol) {
  const resIdx = src.indexOf('/* 站外延伸资源');
  if (resIdx < 0) throw new Error('data.js 中找不到「站外延伸资源」标记');
  const skillsEnd = src.lastIndexOf('];', resIdx);
  if (skillsEnd < 0) throw new Error('data.js 中找不到 SKILLS 数组结尾');

  const body = items.map((s) => {
    const extras = [];
    if (s.path) extras.push(`path: '${escJS(s.path)}'`);
    if (s.skill) extras.push(`skill: '${escJS(s.skill)}'`);
    if (s.from) extras.push(`from: '${escJS(s.from)}'`);
    const extraLine = extras.length ? `${eol}    ${extras.join(', ')},` : '';
    return [
      '  {',
      `    id: '${escJS(s.id)}', name: '${escJS(s.name)}', repo: '${escJS(s.repo)}',`,
      `    cat: '${escJS(s.cat)}', stars: ${s.stars}, img: '${escJS(s.img || '')}',${extraLine}`,
      `    desc: '${escJS(s.desc)}',`,
      `    tags: [${s.tags.map((t) => `'${escJS(t)}'`).join(', ')}]`,
      '  }'
    ].join(eol);
  }).join(',' + eol);

  const comment = `  /* ---------- ${todayStr()} 新增：由 add-skill.mjs 自动收录 ${items.length} 条 ---------- */`;
  const head = src.slice(0, skillsEnd).replace(/[\s,]+$/, '');
  return head + ',' + eol + eol + comment + eol + body + eol + src.slice(skillsEnd);
}

function updateUpsInDataJs(src, upsMap, newFetched, eol) {
  const upsStart = src.indexOf('window.UPS = {');
  if (upsStart < 0) throw new Error('data.js 中找不到 window.UPS');
  const upsEnd = src.indexOf('};', upsStart);
  if (upsEnd < 0) throw new Error('data.js 中找不到 window.UPS 结尾');

  const keys = Object.keys(upsMap).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const body = keys.map((r) => {
    const [a = '', b = '', c = ''] = upsMap[r] || [];
    return `  '${escJS(r)}': ['${escJS(a)}', '${escJS(b)}', '${escJS(c)}']`;
  }).join(',' + eol);

  let next = src.slice(0, upsStart) + `window.UPS = {${eol}${body}${eol}` + src.slice(upsEnd);
  if (newFetched) {
    next = next.replace(/window\.UPS_FETCHED = '[^']*';/, `window.UPS_FETCHED = '${newFetched}';`);
  }
  return next;
}

function updateReadmeCounts(skillCount, authorCount) {
  if (!fs.existsSync(README_PATH)) return false;
  let md = fs.readFileSync(README_PATH, 'utf8');
  const before = md;
  md = md.replace(/(收录 \*\*)\d+(\*\* 个仓库 · \*\*\d+\*\* 个产出物分类 · \*\*)\d+(\*\* 位创作者)/, `$1${skillCount}$2${authorCount}$3`);
  md = md.replace(/(data\.js\s+← )\d+( 条仓库主数据)/, `$1${skillCount}$2`);
  if (md !== before) {
    fs.writeFileSync(README_PATH, md, 'utf8');
    return true;
  }
  return false;
}

/* ---------- 运行子脚本 ---------- */
function runNodeScript(relScript, args = []) {
  execFileSync(process.execPath, [path.join(ROOT, relScript), ...args], {
    cwd: ROOT,
    stdio: 'inherit'
  });
}

/* ---------- 新条目即席搜索验收（确保搜自己的核心意图词能进 Top 3） ---------- */
function verifyLiveSearchForNewItems(items) {
  const sb = {};
  vm.createContext(sb);
  Object.defineProperty(sb, 'window', { value: sb, writable: true, configurable: true });
  for (const rel of [
    'site/assets/js/data.js',
    'site/assets/js/pulse.js',
    'site/assets/js/search-index.js',
    'site/assets/js/search-engine.js'
  ]) {
    const p = path.join(ROOT, rel);
    if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), sb, { filename: path.basename(rel) });
  }
  const catMap = Object.fromEntries((sb.CATS || []).map((c) => [c.key, c]));
  const authorMap = Object.fromEntries((sb.AUTHORS || []).map((a) => [a.owner.toLowerCase(), a]));
  (sb.SKILLS || []).forEach((s) => {
    s.catName = (catMap[s.cat] || {}).name || s.cat;
    s.owner = s.repo.split('/')[0];
    s.author = authorMap[s.owner.toLowerCase()] || null;
  });
  const engine = sb.SkillSearch.createEngine(sb.SKILLS || [], {
    cats: sb.CATS || [],
    searchIndex: sb.SEARCH_INDEX,
    pulse: sb.PULSE
  });

  console.log('\n🔍 新条目即席搜索验收：');
  let allGood = true;
  for (const item of items) {
    const probes = [item.name, ...item.searchIntents.slice(0, 3)];
    let top3Hits = 0;
    const summary = probes.map((q) => {
      const res = engine.search(q).items;
      const rank = res.findIndex((x) => x.skill.id === item.id) + 1;
      if (rank >= 1 && rank <= 3) top3Hits++;
      return `「${q}」→#${rank || '未中'}`;
    }).join(' · ');
    const ok = top3Hits >= 2;
    if (!ok) allGood = false;
    console.log(`  ${ok ? '✓' : '⚠'} [${item.id}] ${summary}`);
  }
  return allGood;
}

/* ---------- 子命令 2：commit ---------- */
async function cmdCommit(fileArg, flags) {
  const dry = flags.has('--dry');
  const skipFetch = flags.has('--skip-fetch');
  if (!fileArg) {
    console.error('用法：node _tools/add-skill.mjs commit <decision.json | -> [--dry] [--skip-fetch]');
    process.exit(1);
  }
  const rawText = fileArg === '-'
    ? fs.readFileSync(0, 'utf8')
    : fs.readFileSync(path.resolve(fileArg), 'utf8');
  const parsed = JSON.parse(rawText);
  const inputItems = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.items) ? parsed.items : [parsed]);
  if (!inputItems.length) throw new Error('决策 JSON 为空');

  const { src: origDataSrc, SKILLS, CATS, AUTHORS, UPS, UPS_FETCHED } = loadCurrentData();
  const catKeys = new Set(CATS.map((c) => c.key));
  const existingIds = new Set(SKILLS.map((s) => s.id));
  const existingRepoSkills = new Set(SKILLS.map((s) => `${s.repo.toLowerCase()}::${String(s.skill || '').toLowerCase()}`));
  const existingAuthors = new Set(AUTHORS.map((a) => a.owner.toLowerCase()));

  const problems = [];
  const batchIds = new Set();
  const batchRepoSkills = new Set();
  const normalized = [];

  for (const raw of inputItems) {
    const item = Object.assign({}, raw);
    if (!item.repo) { problems.push('缺少 repo 字段'); continue; }
    // 允许直接传 GitHub URL
    if (/^https?:\/\//i.test(item.repo)) {
      const p = parseGithubInput(item.repo);
      item.repo = p.repo;
      if (!item.path && p.path) item.path = p.path;
      if (!item.skill && p.skill) item.skill = p.skill;
    }
    item.id = item.id ? String(item.id).trim() : slugify(item.skill ? `${item.repo}-${item.skill}` : item.repo);
    if (!/^[a-z0-9-]+$/.test(item.id)) problems.push(`id 只能包含小写字母/数字/连字符：${item.id}`);
    if (existingIds.has(item.id) || batchIds.has(item.id)) problems.push(`id 冲突：${item.id}`);
    batchIds.add(item.id);

    const rk = `${item.repo.toLowerCase()}::${String(item.skill || '').toLowerCase()}`;
    if (existingRepoSkills.has(rk) || batchRepoSkills.has(rk)) problems.push(`仓库已存在：${item.repo}${item.skill ? ' / ' + item.skill : ''}`);
    batchRepoSkills.add(rk);

    if (!catKeys.has(item.cat)) problems.push(`分类非法（${item.cat}），合法值：${[...catKeys].join(', ')}`);
    if (!item.name || String(item.name).trim().length < 2) problems.push(`缺少 name：${item.id}`);
    if (!item.desc || item.desc.length < 20 || item.desc.length > 150) {
      problems.push(`desc 长度需在 20–150 字之间（当前 ${item.desc ? item.desc.length : 0}）：${item.id}`);
    }
    if (!Array.isArray(item.tags) || item.tags.length !== 3 || item.tags.some((t) => !String(t).trim())) {
      problems.push(`tags 必须是 3 个非空标签：${item.id}`);
    }
    if (!Array.isArray(item.searchIntents) || item.searchIntents.filter((x) => String(x).trim()).length < 4) {
      problems.push(`searchIntents 必须至少提供 4 条用户痛点/场景口语短语（保障语义搜索召回）：${item.id}`);
    }
    item.searchIntents = (item.searchIntents || []).map((x) => String(x).trim()).filter(Boolean).slice(0, 10);
    item.searchAliases = Array.isArray(item.searchAliases)
      ? item.searchAliases.map((x) => String(x).trim()).filter(Boolean).slice(0, 8)
      : [];

    if (item.newAuthor) {
      const a = item.newAuthor;
      if (!a.owner || !a.name || !a.note) problems.push(`newAuthor 缺少 owner/name/note：${item.id}`);
      if (a.kind && a.kind !== 'creator' && a.kind !== 'official') problems.push(`newAuthor.kind 只能是 creator 或 official：${a.owner}`);
      if (a.owner && existingAuthors.has(a.owner.toLowerCase())) {
        // 已存在则忽略新增，避免误报错
        item.newAuthor = null;
      }
    }
    normalized.push(item);
  }

  if (problems.length) {
    console.error('❌ 决策单校验未通过：');
    problems.forEach((p) => console.error('  - ' + p));
    process.exit(1);
  }

  // 自动补齐未提供的 GitHub stars 与 upstream 动态
  for (const item of normalized) {
    if (typeof item.stars !== 'number' || !item.upstream) {
      if (!skipFetch) {
        const meta = await fetchRepoHtmlMeta(item.repo);
        if (meta.ok) {
          if (typeof item.stars !== 'number') item.stars = meta.stars;
          if (meta.finalRepo && meta.finalRepo !== item.repo) item.repo = meta.finalRepo;
        }
        const upsRes = await fetchOne(item.repo);
        item.upstream = (upsRes && Array.isArray(upsRes.row)) ? upsRes.row : ['', '', ''];
      } else {
        if (typeof item.stars !== 'number') item.stars = 0;
        if (!item.upstream) item.upstream = [todayStr(), '', ''];
      }
    } else if (!Array.isArray(item.upstream)) {
      item.upstream = [item.upstream.upd || '', item.upstream.ver || '', item.upstream.verAt || ''];
    }
  }

  console.log(`✅ 校验通过，准备收录 ${normalized.length} 条 Skill：`);
  normalized.forEach((s) => {
    console.log(`  + [${s.id}] ${s.name} (${s.cat}) · ★ ${s.stars} · 意图 ${s.searchIntents.length} 条${s.newAuthor ? ' · +创作者 ' + s.newAuthor.name : ''}`);
  });

  if (dry) {
    console.log('\n· --dry 预览模式，未写入任何文件。');
    return;
  }

  // 备份将被直接修改的文件，任何一步失败立刻完整回滚
  const backups = new Map();
  for (const p of [DATA_PATH, SEED_PATH, ENRICH_PATH, TAXONOMY_PATH, README_PATH]) {
    if (fs.existsSync(p)) backups.set(p, fs.readFileSync(p, 'utf8'));
  }

  try {
    const eol = origDataSrc.includes('\r\n') ? '\r\n' : '\n';
    let nextData = origDataSrc;
    const upsNext = Object.assign({}, UPS);
    const enrich = fs.existsSync(ENRICH_PATH) ? JSON.parse(fs.readFileSync(ENRICH_PATH, 'utf8')) : {};
    const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf8'));
    const addedAuthors = new Set();

    // 1. 写入新创作者（如有）
    for (const item of normalized) {
      if (item.newAuthor && !addedAuthors.has(item.newAuthor.owner.toLowerCase())) {
        const a = item.newAuthor;
        const usedColors = {};
        AUTHORS.forEach((x) => { usedColors[x.color] = (usedColors[x.color] || 0) + 1; });
        const color = a.color || AUTHOR_PALETTE.slice().sort((x, y) => (usedColors[x] || 0) - (usedColors[y] || 0))[0];
        nextData = insertAuthorInDataJs(nextData, {
          owner: a.owner,
          name: a.name,
          kind: a.kind || 'creator',
          color,
          note: a.note
        }, eol);
        addedAuthors.add(a.owner.toLowerCase());
        // 同步到 authorAliases，保障搜创作者中文名/拼音直接命中
        taxonomy.authorAliases = taxonomy.authorAliases || {};
        const aKey = a.owner.toLowerCase();
        const prevAl = taxonomy.authorAliases[aKey] || [];
        const mergedAl = Array.from(new Set([...prevAl, a.name, a.owner, ...(a.aliases || [])].filter(Boolean)));
        taxonomy.authorAliases[aKey] = mergedAl;
      }
    }

    // 2. 写入 SKILLS 与 UPS
    nextData = insertSkillsInDataJs(nextData, normalized, eol);
    for (const item of normalized) {
      upsNext[item.repo] = item.upstream;
    }
    const fetchedAt = UPS_FETCHED || todayStr();
    nextData = updateUpsInDataJs(nextData, upsNext, fetchedAt, eol);

    fs.writeFileSync(DATA_PATH, nextData, 'utf8');
    execFileSync(process.execPath, ['--check', DATA_PATH], { stdio: 'pipe' });

    // 3. 同步 seed.json
    if (fs.existsSync(SEED_PATH)) {
      const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
      seed.data = Object.assign({}, seed.data || {}, Object.fromEntries(normalized.map((s) => [s.repo, s.upstream])));
      fs.writeFileSync(SEED_PATH, JSON.stringify(seed), 'utf8');
    }

    // 4. 写入 search-enrich.json 与可选 search-taxonomy.json 扩展词
    for (const item of normalized) {
      enrich[item.id] = { i: item.searchIntents, a: item.searchAliases };
      if (Array.isArray(item.newTaxonomyTerms)) {
        for (const nt of item.newTaxonomyTerms) {
          if (!nt || !nt.conceptId || !Array.isArray(nt.terms)) continue;
          const target = (taxonomy.concepts || []).find((c) => c.id === nt.conceptId);
          if (target) {
            target.terms = Array.from(new Set([...target.terms, ...nt.terms.map((x) => String(x).trim()).filter(Boolean)]));
          }
        }
      }
    }
    enrich._meta = Object.assign({}, enrich._meta, { updated: todayStr() });
    fs.writeFileSync(ENRICH_PATH, JSON.stringify(enrich, null, 2) + '\n', 'utf8');
    fs.writeFileSync(TAXONOMY_PATH, JSON.stringify(taxonomy, null, 2) + '\n', 'utf8');

    // 5. 同步 README.md 统计数字
    const newSkillCount = SKILLS.length + normalized.length;
    const newAuthorCount = AUTHORS.length + addedAuthors.size;
    updateReadmeCounts(newSkillCount, newAuthorCount);

    // 6. 单条安全增量抓取 SKILL.md 与演示图
    const idArg = normalized.map((s) => s.id).join(',');
    if (!skipFetch) {
      console.log(`\n📥 增量抓取 SKILL.md / README（--ids ${idArg}）…`);
      try { runNodeScript('_tools/fetch-skillmd.mjs', ['--ids', idArg]); }
      catch (e) { console.warn('⚠ 抓取 SKILL.md 失败（不阻断收录）：', e.message); }

      console.log(`\n🖼  增量抓取演示图（--ids ${idArg}）…`);
      try { runNodeScript('_tools/fetch-demo-images.mjs', ['--ids', idArg]); }
      catch (e) { console.warn('⚠ 抓取演示图失败（不阻断收录）：', e.message); }
    }

    // 7. 重建离线语义搜索索引 + 预渲染首屏与 SEO
    console.log('\n🧠 重建离线语义搜索索引…');
    runNodeScript('_tools/build-search-index.mjs');

    console.log('\n📄 预渲染首屏卡片与全量 JSON-LD…');
    runNodeScript('_tools/prerender.mjs');

    console.log('\n🌐 同步 SEO / GEO 静态资产（sitemap / llms.txt / skills.json）…');
    runNodeScript('_tools/build-seo.mjs');

    // 8. 全站回归评测 + 新条目即席搜索 Top-3 断言
    console.log('\n🧪 运行全站搜索质量回归评测…');
    runNodeScript('_tools/eval-search.mjs', ['--strict']);
    const searchOk = verifyLiveSearchForNewItems(normalized);

    console.log(`\n🎉 收录完成！当前全站共 ${newSkillCount} 条 Skill · ${newAuthorCount} 位创作者` +
      (searchOk ? ' · 语义搜索验证全部通过' : ' · ⚠ 请检查上方搜索排名提示并按需补充意图词'));
  } catch (err) {
    // 任一环节失败则完整回滚核心数据文件
    for (const [p, content] of backups.entries()) {
      fs.writeFileSync(p, content, 'utf8');
    }
    console.error('\n❌ 收录流程异常，已自动回滚核心文件：', err.message || err);
    process.exit(1);
  }
}

/* ---------- CLI 入口 ---------- */
const [, , sub, ...rest] = process.argv;
const flags = new Set(rest.filter((a) => a.startsWith('--')));
const pos = rest.filter((a) => !a.startsWith('--'));

if (sub === 'inspect') {
  cmdInspect(pos).catch((e) => { console.error('❌ inspect 失败：', e.message || e); process.exit(1); });
} else if (sub === 'commit') {
  cmdCommit(pos[0], flags).catch((e) => { console.error('❌ commit 失败：', e.message || e); process.exit(1); });
} else {
  console.log([
    'Skill 指北 · 新增 Skill 统一流水线',
    '',
    '用法：',
    '  node _tools/add-skill.mjs inspect <github-url> [url2 ...]     # 侦察仓库与作者状态',
    '  node _tools/add-skill.mjs commit <decision.json | -> [--dry]  # 校验、写入、同步搜索与预渲染'
  ].join('\n'));
}
