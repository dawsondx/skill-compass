#!/usr/bin/env node
/**
 * _tools/prerender.mjs —— 构建期静态注入（零依赖）
 *
 * 做三件事，全部幂等，可以反复跑：
 *   1. 把「推荐排序」前 24 张卡片直接写进 index.html 的 #grid，首屏不用等 JS 就有内容
 *   2. 把全部条目的中文说明编译成 schema.org/ItemList（JSON-LD），让搜索引擎拿到全量长尾词
 *   3. 在 #grid 后补一份 <noscript> 全量目录，给不吃 JSON-LD 的爬虫（如百度）兜底
 *
 * 卡片 HTML 直接复用 site/assets/js/card-template.js —— 前端渲染同一份实现，
 * 所以静态卡片和 JS 接管后的 DOM 完全一致，不会出现「两套样式」。
 *
 * 用法：
 *   node _tools/prerender.mjs            # 写入 site/index.html
 *   node _tools/prerender.mjs --check    # 只校验，不写盘（CI 里可用）
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML_PATH = path.join(ROOT, 'site', 'index.html');
const DATA_PATH = path.join(ROOT, 'site', 'assets', 'js', 'data.js');
const TPL_PATH = path.join(ROOT, 'site', 'assets', 'js', 'card-template.js');

const TOP_COUNT = 24;
const CHECK_ONLY = process.argv.includes('--check');
const SITE_URL = 'https://skills.dawsondx.top/';
const SEO_MARK_A = '<!--PRERENDER:SEO:START-->';
const SEO_MARK_B = '<!--PRERENDER:SEO:END-->';
const NOS_MARK_A = '<!--PRERENDER:NOSCRIPT:START-->';
const NOS_MARK_B = '<!--PRERENDER:NOSCRIPT:END-->';

/* ---------- 加载数据与模板（同一个沙箱，模拟浏览器 window） ---------- */
function loadSandbox() {
  for (const f of [DATA_PATH, TPL_PATH]) {
    if (!fs.existsSync(f)) throw new Error('缺少文件：' + path.relative(ROOT, f));
  }
  const sandbox = {};
  vm.createContext(sandbox);
  Object.defineProperty(sandbox, 'window', { value: sandbox, writable: true, configurable: true });
  vm.runInContext(fs.readFileSync(DATA_PATH, 'utf8'), sandbox, { filename: 'data.js' });
  vm.runInContext(fs.readFileSync(TPL_PATH, 'utf8'), sandbox, { filename: 'card-template.js' });
  return sandbox;
}

const sb = loadSandbox();
const SKILLS = sb.SKILLS || [];
const CATS = sb.CATS || [];
const AUTHORS = sb.AUTHORS || [];
const UPS = sb.UPS || {};
const UPS_AT = sb.UPS_FETCHED || '';
const CT = sb.CardTemplate;

if (!SKILLS.length) throw new Error('data.js 里没有 SKILLS');
if (!CT) throw new Error('card-template.js 没有导出 CardTemplate');

/* ---------- 补齐 app.js 运行时才算的派生字段 ---------- */
const CAT_MAP = {};
CATS.forEach((c) => { CAT_MAP[c.key] = c; });
const AUTHOR_MAP = {};
AUTHORS.forEach((a) => { AUTHOR_MAP[a.owner.toLowerCase()] = a; });

const NOW = new Date();
SKILLS.forEach((s) => {
  s.owner = s.repo.split('/')[0];
  s.author = AUTHOR_MAP[s.owner.toLowerCase()] || null;
  s.catName = (CAT_MAP[s.cat] || {}).name || s.cat;
  const u = UPS[s.repo] || [];
  s.upd = u[0] || '';
  s.ver = u[1] || '';
  s.verAt = u[2] || '';
  s.days = CT.daysSince(s.upd, NOW);
});

const repoUrl = (s) => 'https://github.com/' + s.repo + (s.path ? '/' + s.path : '');
const nSkills = SKILLS.length;
const nImgs = SKILLS.filter((s) => s.img).length;
const nAuthors = AUTHORS.filter((a) =>
  SKILLS.some((s) => s.owner.toLowerCase() === a.owner.toLowerCase())
).length;

/* ---------- 1. 首屏卡片 ---------- */
const ordered = CT.recommendOrder(SKILLS, CATS.map((c) => c.key));
const top = ordered.slice(0, TOP_COUNT);
if (top.length < TOP_COUNT) {
  console.warn(`⚠ 只有 ${top.length} 条数据，不足 ${TOP_COUNT} 张`);
}

const gridInner =
  '\n    <!-- 构建期生成：node _tools/prerender.mjs 会整段重写，别手改 -->\n    ' +
  top.map((s) => CT.cardHTML(s, { cat: CAT_MAP[s.cat], mark: '' })).join('\n    ') +
  '\n  ';

/* ---------- 2. 全量 JSON-LD ---------- */
function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Skill 指北 · ${nSkills} 个开源 Agent Skills 精选库`,
  description: `从收藏夹和头部创作者仓库中挑出的 ${nSkills} 个开源 Agent Skills，按「你想做出什么」分类，附中文用途说明、适用场景与演示图。`,
  numberOfItems: nSkills,
  itemListElement: SKILLS.map((s, i) => {
    const item = {
      '@type': 'SoftwareSourceCode',
      name: s.name,
      description: s.desc,
      codeRepository: repoUrl(s),
      keywords: s.tags.concat(s.catName).join(', ')
    };
    if (s.author) item.author = { '@type': 'Person', name: s.author.name };
    return { '@type': 'ListItem', position: i + 1, item };
  })
};
// </script> 不能出现在内联脚本里，转义掉
const jsonLdText = JSON.stringify(jsonLd).replace(/<\//g, '<\\/');
const seoBlock = `${SEO_MARK_A}\n<script type="application/ld+json">\n${jsonLdText}\n</script>\n${SEO_MARK_B}`;

/* ---------- 3. noscript 全量目录 ---------- */
const nosBlock = `${NOS_MARK_A}
<noscript>
  <section class="seo-index" aria-label="全部 Skill 完整目录">
    <h2>全部收录的 Agent Skills（共 ${nSkills} 个）</h2>
    <p class="seo-index-note">以下是纯文本目录，与上方卡片内容一致；开启 JavaScript 后可用分类、创作者与搜索筛选。</p>
    <ul>
${SKILLS.map((s) => {
  const meta = [s.catName, s.author ? s.author.name : '', s.stars ? '★ ' + s.stars : '']
    .filter(Boolean)
    .join(' · ');
  return `      <li><a href="${escapeHtml(repoUrl(s))}">${escapeHtml(s.name)}</a>：${escapeHtml(s.desc)}<span class="seo-meta">（${escapeHtml(meta)}）</span></li>`;
}).join('\n')}
    </ul>
  </section>
</noscript>
${NOS_MARK_B}`;

/* ---------- 写入 index.html ---------- */
let html = fs.readFileSync(HTML_PATH, 'utf8');
const before = html;

/* 3.1 #grid 内部：用括号配平扫描定位容器，不依赖正则去猜嵌套 */
function replaceGridInner(src, inner) {
  const open = src.indexOf('<div class="grid" id="grid"');
  if (open < 0) throw new Error('index.html 里找不到 <div class="grid" id="grid">');
  const start = src.indexOf('>', open) + 1;
  let depth = 1;
  let i = start;
  while (i < src.length) {
    const nextOpen = src.indexOf('<div', i);
    const nextClose = src.indexOf('</div>', i);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) { depth++; i = nextOpen + 4; }
    else { depth--; i = nextClose + 6; if (depth === 0) break; }
  }
  if (depth !== 0) throw new Error('#grid 容器标签不配平，请检查 index.html');
  return src.slice(0, start) + inner + src.slice(i - 6);
}
html = replaceGridInner(html, gridInner);

/* 3.2 noscript 目录：接在 #grid 之后 */
const gridEnd = html.indexOf(NOS_MARK_A) >= 0
  ? html.indexOf(NOS_MARK_A)
  : html.indexOf('</main>');
if (html.indexOf(NOS_MARK_A) >= 0) {
  html = html.replace(
    new RegExp(NOS_MARK_A.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' +
      NOS_MARK_B.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    nosBlock
  );
} else {
  if (gridEnd < 0) throw new Error('index.html 里找不到 </main>');
  html = html.slice(0, gridEnd) + nosBlock + '\n' + html.slice(gridEnd);
}

/* 3.3 JSON-LD：塞进 </head> */
if (html.indexOf(SEO_MARK_A) >= 0) {
  html = html.replace(
    new RegExp(SEO_MARK_A.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' +
      SEO_MARK_B.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    seoBlock
  );
} else {
  html = html.replace('</head>', seoBlock + '\n</head>');
}

/* 3.4 静态数字跟上数据（页内会被 JS 再刷一次，这里保证爬虫和首帧看到的是真数） */
function setNum(src, id, val) {
  const re = new RegExp('(id="' + id + '"[^>]*>)\\d+');
  return re.test(src) ? src.replace(re, '$1' + val) : src;
}
html = setNum(html, 'stat-total', nSkills);
html = setNum(html, 's1', nSkills);
html = setNum(html, 's2', nImgs);
html = setNum(html, 's3', CATS.length);
html = setNum(html, 's4', nAuthors);
html = setNum(html, 'hero-total', nSkills);
html = html.replace(/(<title>Skill 指北 · )\d+( 个开源 Agent Skills 精选库)/, `$1${nSkills}$2`);
html = html.replace(/(筛出 )\d+( 个开源 Agent Skills)/, `$1${nSkills}$2`);

if (html === before) {
  console.log('· 内容无变化，index.html 未改动');
} else if (CHECK_ONLY) {
  console.log('· 校验模式：index.html 需要重新生成（未写盘）');
  process.exitCode = 0;
} else {
  fs.writeFileSync(HTML_PATH, html, 'utf8');
  console.log('· 已写入 site/index.html');
}

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
console.log(
  `✅ 预渲染完成：首屏 ${top.length} 张卡片（共 ${nSkills} 条）` +
  ` · JSON-LD ${kb(jsonLdText.length)} · 数据日期 ${UPS_AT || '未知'}`
);
