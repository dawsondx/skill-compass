#!/usr/bin/env node
/**
 * 把 _data/new_batch_*.json 里的新条目并进 site/assets/js/data.js
 *
 * 做四件事：
 *   1. 修正已改名的仓库地址（旧链接仍会 301，但站点应指向现用地址）
 *   2. 校验新条目：分类合法 / 不与现有 repo 冲突 / id 唯一 / 字段齐全
 *   3. 按现有代码风格追加到 SKILLS 数组末尾（单独一段，标日期）
 *   4. 自检 data.js 语法
 *
 * 用法：
 *   node _tools/merge-new-skills.mjs           # 预览，不写盘
 *   node _tools/merge-new-skills.mjs --write   # 写盘
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'site', 'assets', 'js', 'data.js');
const WRITE = process.argv.includes('--write');

/* ---------- 1. 已改名的仓库：旧地址 -> 现用地址 ---------- */
const RENAMED = {
  'Webioinfo01/aweskill': 'Wehuman01/aweskill',
  'adrianpunk/punk-ip-illustrations': 'adrianpunk/Punk-IP',
  'forrestchang/andrej-karpathy-skills': 'multica-ai/andrej-karpathy-skills',
  'oaker-io/wewrite': 'imraywang/wewrite',
  'peterskoett/self-improving-agent': 'pskoett/self-improving-agent',
  'santifer/career-ops': 'career-ops-hq/career-ops',
  'titanwings/colleague-skill': 'titanwings/distilly',
  'zephyrwang6/info-skill': 'SpaceZephyr/read-buddy',
  'zephyrwang6/pm-skills': 'SpaceZephyr/pm-skills'
};

/* ---------- 2. 载入新条目 ---------- */
const batches = ['a', 'b', 'c', 'd'].map((k) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, '_data', `new_batch_${k}.json`), 'utf8'))
);
const added = batches.flat();

const addMeta = JSON.parse(fs.readFileSync(path.join(ROOT, '_data', 'to_add.json'), 'utf8'));
const starOf = {};
addMeta.forEach((r) => { starOf[r.repo.toLowerCase()] = r.stars; });

let src = fs.readFileSync(DATA, 'utf8');

/* 幂等：先摘掉上一次生成的增补块，再按当前批次重新生成，重复跑不会叠两份 */
const BLOCK_RE = /\r?\n  \/\* ---------- 2026-11-06 增补[\s\S]*?(?=\r?\n\];)/;
if (BLOCK_RE.test(src)) {
  src = src.replace(BLOCK_RE, '');
  console.log('已移除上一次生成的增补块，将按当前批次重建');
}

/* ---------- 3. 校验 ---------- */
const catKeys = [...src.matchAll(/\{ key: '([a-z]+)',\s+name:/g)].map((m) => m[1]);
const existingRepos = new Set([...src.matchAll(/\brepo:\s*'([^']+)'/g)].map((m) => m[1].toLowerCase()));
const existingIds = new Set([...src.matchAll(/\bid:\s*'([^']+)'/g)].map((m) => m[1]));

const problems = [];
const seenRepo = new Set();
const seenId = new Set();

const slug = (repo) => repo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

for (const s of added) {
  if (!catKeys.includes(s.cat)) problems.push(`分类非法: ${s.repo} -> ${s.cat}`);
  if (!s.name || !s.desc) problems.push(`字段缺失: ${s.repo}`);
  if (!Array.isArray(s.tags) || s.tags.length !== 3) problems.push(`tags 不是 3 个: ${s.repo}`);
  if (s.desc.length < 20 || s.desc.length > 130) problems.push(`desc 长度 ${s.desc.length}: ${s.repo}`);
  const key = s.repo.toLowerCase();
  if (existingRepos.has(key)) problems.push(`与已有条目重复: ${s.repo}`);
  if (seenRepo.has(key)) problems.push(`同批重复: ${s.repo}`);
  seenRepo.add(key);
  s.id = slug(s.repo);
  if (existingIds.has(s.id) || seenId.has(s.id)) problems.push(`id 冲突: ${s.repo} -> ${s.id}`);
  seenId.add(s.id);
  s.stars = starOf[key];
  if (typeof s.stars !== 'number') problems.push(`缺 star 数: ${s.repo}`);
}

console.log(`新条目 ${added.length} 条 · 分类分布：`);
const byCat = {};
added.forEach((s) => { byCat[s.cat] = (byCat[s.cat] || 0) + 1; });
console.log(Object.entries(byCat).map(([k, v]) => `${k}=${v}`).join('  '));

if (problems.length) {
  console.error('\n校验未通过：');
  problems.forEach((p) => console.error('  - ' + p));
  process.exit(1);
}
console.log('校验通过（分类 / 字段 / 重复 / id / star）');

/* ---------- 4. 生成代码块 ---------- */
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const body = added.map((s) => `  {
    id: '${s.id}', name: '${esc(s.name)}', repo: '${s.repo}',
    cat: '${s.cat}', stars: ${s.stars}, img: '',
    desc: '${esc(s.desc)}',
    tags: [${s.tags.map((t) => `'${esc(t)}'`).join(', ')}]
  }`).join(',\n');

const block = `
  /* ---------- 2026-11-06 增补：IMA 开源 Skill 清单核对后新增的 ${added.length} 条 ----------
     来源：资料库「开源Skill清单」（255 条）逐条核对 GitHub 是否可访问、是否与本站已有条目重复，
     剔除失效 / 非 skill 仓库后新增。这部分没有自托管演示图，img 留空。 */
${body}
`;

/* ---------- 5. 修正旧仓库地址 ---------- */
let fixed = 0;
for (const [oldRepo, newRepo] of Object.entries(RENAMED)) {
  const re = new RegExp(`(repo: ')${oldRepo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(')`, 'g');
  const n = (src.match(re) || []).length;
  if (n) { src = src.replace(re, `$1${newRepo}$2`); fixed += n; }
}
console.log(`仓库地址修正 ${fixed} 处（${Object.keys(RENAMED).length} 个已知改名）`);

/* ---------- 6. 插入到 SKILLS 数组末尾 ---------- */
// data.js 用 CRLF，按「站外延伸资源」注释往前找数组结尾的 `];`
const resIdx = src.indexOf('/* 站外延伸资源');
if (resIdx < 0) throw new Error('找不到「站外延伸资源」区块');
const skillsEnd = src.lastIndexOf('];', resIdx);
if (skillsEnd < 0) throw new Error('找不到 SKILLS 数组结尾');
const crlf = (t) => t.replace(/\n/g, '\r\n');
// 插入点在 `];` 之前：把结尾的空白和残留逗号一并剥掉，再统一补一个逗号，
// 否则重复跑会留下 `},,` 这种空数组元素
const head = src.slice(0, skillsEnd).replace(/[\s,]+$/, '');
const next = head + crlf(',' + block) + src.slice(skillsEnd);

const total = (next.match(/\bid:\s*'/g) || []).length;
console.log(`条目总数：${(src.match(/\bid:\s*'/g) || []).length} -> ${total}`);

if (!WRITE) {
  console.log('\n预览模式，未写盘。加 --write 生效。');
  console.log(block.slice(0, 600) + '\n  …');
  process.exit(0);
}

fs.writeFileSync(DATA, next, 'utf8');
try {
  execFileSync(process.execPath, ['--check', DATA], { stdio: 'pipe' });
  console.log('已写入 data.js，语法自检通过。');
} catch (e) {
  fs.writeFileSync(DATA, src, 'utf8');
  console.error('语法自检失败，已回滚：\n' + (e.stderr || e.message));
  process.exit(1);
}
