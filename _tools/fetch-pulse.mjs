#!/usr/bin/env node
/**
 * _tools/fetch-pulse.mjs —— 「本周安装热度风向标」数据构建（零依赖）
 *
 * 数据依据（2026-11 实测）：skills.sh 是 `skills` CLI 的官方目录，站点首页的服务端渲染包里
 * 带着每个 skill 的安装量遥测：
 *   { source: "owner/repo", skillId, name, installs: 累计安装, weeklyInstalls: [近 8 周每周安装数] }
 * 这就是「本周安装热度」唯一公开、可复核的来源 —— 它来自 `npx skills add` 的真实调用埋点，
 * 不是 Star、不是 fork，也不是我们自己估的分数。
 *
 * 做法：抓一次首页 → 按仓库聚合（取该仓库安装量最高的那个 skill，和 skills.sh 榜单口径一致）
 *      → 与站内 data.js 的 294 个仓库求交集 → 按「最近一周安装量」排序 → 写 pulse.js
 *
 * 用法：
 *   node _tools/fetch-pulse.mjs           # 抓取并写入
 *   node _tools/fetch-pulse.mjs --check   # 只打印结果，不写盘
 *   node _tools/fetch-pulse.mjs --file x.html   # 用本地缓存的首页 HTML 离线重建
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = path.join(ROOT, 'site', 'assets', 'js', 'data.js');
const OUT_JS = path.join(ROOT, 'site', 'assets', 'js', 'pulse.js');
const OUT_JSON = path.join(ROOT, '_data', 'pulse.json');
const SOURCE_URL = 'https://skills.sh/';
const TOP_KEEP = 24;                       // 榜单最多留多少条（前 3 条直接铺在首页）

const args = process.argv.slice(2);
const CHECK_ONLY = args.includes('--check');
const FILE_ARG = (() => {
  const i = args.indexOf('--file');
  return i >= 0 ? args[i + 1] : '';
})();

function today() {
  const t = new Date();
  const p = (n) => (n < 10 ? '0' : '') + n;
  return t.getFullYear() + '-' + p(t.getMonth() + 1) + '-' + p(t.getDate());
}

async function getHtml() {
  if (FILE_ARG) return fs.readFileSync(path.resolve(FILE_ARG), 'utf8');
  const res = await fetch(SOURCE_URL, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; skill-compass-pulse/1.0; +https://skills.dawsondx.top/)',
      'accept-language': 'en'
    }
  });
  if (!res.ok) throw new Error('skills.sh 返回 ' + res.status);
  return res.text();
}

/* 首页是 Next.js RSC 流：字段被包在 JS 字符串里，引号前多一层反斜杠。
   两种引号形态都试一遍，免得对方改渲染方式就整个失效。 */
function parseItems(html) {
  const patterns = [
    /\\"source\\":\\"([^\\"]+)\\",\\"skillId\\":\\"[^\\"]*\\",\\"name\\":\\"([^\\"]*)\\",\\"installs\\":(\d+),\\"weeklyInstalls\\":\[([0-9,]+)\]/g,
    /"source":"([^"]+)","skillId":"[^"]*","name":"([^"]*)","installs":(\d+),"weeklyInstalls":\[([0-9,]+)\]/
  ];
  for (const re of patterns) {
    const out = [];
    let m;
    while ((m = re.exec(html))) {
      out.push({
        source: m[1],
        name: m[2],
        installs: Number(m[3]),
        weekly: m[4].split(',').map(Number)
      });
    }
    if (out.length) return out;
  }
  return [];
}

function loadSkills() {
  const src = fs.readFileSync(DATA_PATH, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  Object.defineProperty(sandbox, 'window', { value: sandbox, writable: true, configurable: true });
  vm.runInContext(src, sandbox, { filename: 'data.js' });
  return sandbox.SKILLS || [];
}

const html = await getHtml();
const items = parseItems(html);
if (!items.length) throw new Error('没解析到安装量数据：skills.sh 首页结构可能变了，先人工看一眼');

const byRepo = new Map();
for (const it of items) {
  const key = it.source.toLowerCase();
  if (!byRepo.has(key)) byRepo.set(key, []);
  byRepo.get(key).push(it);
}

const SKILLS = loadSkills();
const ranked = [];
for (const s of SKILLS) {
  const list = byRepo.get(s.repo.toLowerCase());
  if (!list) continue;
  const top = list.slice().sort((a, b) => b.installs - a.installs)[0];
  const weekly = top.weekly.slice(-8);
  const week = weekly[weekly.length - 1] || 0;
  const prev = weekly.length > 1 ? weekly[weekly.length - 2] : 0;
  ranked.push({
    id: s.id,
    name: s.name,
    repo: s.repo,
    installs: top.installs,
    week,
    delta: week - prev,
    weekly
  });
}

ranked.sort((a, b) => b.week - a.week || b.installs - a.installs);
const kept = ranked.filter((x) => x.week > 0).slice(0, TOP_KEEP);

const payload = {
  at: today(),
  source: 'skills.sh',
  total: ranked.length,
  items: kept
};

if (CHECK_ONLY) {
  console.log(JSON.stringify({ at: payload.at, total: payload.total, items: kept.slice(0, 8) }, null, 1));
  process.exit(0);
}

const header = `/* 本周安装热度风向标 · 由 _tools/fetch-pulse.mjs 生成，别手改
   数据源：skills.sh 首页公开安装量遥测（\`skills\` CLI 匿名统计），抓取日期 ${payload.at}
   站内 ${SKILLS.length} 个仓库中，${payload.total} 个能在 skills.sh 查到安装量，
   下面按「最近一周安装量」取前 ${kept.length} 条。weekly 为近 8 周每周安装数。 */
`;
fs.writeFileSync(
  OUT_JS,
  header + 'window.PULSE = ' + JSON.stringify(payload, null, 0) + ';\n',
  'utf8'
);
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 1), 'utf8');

console.log(
  `✅ 风向标：命中 ${payload.total}/${SKILLS.length} 个仓库，保留 ${kept.length} 条` +
  ` · 榜首 ${kept[0] ? kept[0].repo + ' ' + kept[0].week : '—'}`
);
