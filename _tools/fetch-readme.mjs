#!/usr/bin/env node
/**
 * 抓 README 前若干行，用于给缺简介的仓库补中文说明
 * 用法: node _tools/fetch-readme.mjs <in.json> <out.json>
 *   in.json: ["owner/repo", ...]
 */
import fs from 'node:fs/promises';

const [, , IN, OUT] = process.argv;
const repos = JSON.parse(await fs.readFile(IN, 'utf8'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';
const NAMES = ['README.md', 'readme.md', 'README.MD', 'README.zh-CN.md', 'README-en.md', 'README.rst', 'README.txt'];

async function get(repo) {
  for (const n of NAMES) {
    try {
      const r = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/${n}`, {
        headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000)
      });
      if (r.ok) return { repo, file: n, text: (await r.text()).slice(0, 2600) };
    } catch { /* 换下一个文件名 */ }
  }
  return { repo, file: '', text: '' };
}

const out = [];
let i = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  while (i < repos.length) out.push(await get(repos[i++]));
}));
out.sort((a, b) => repos.indexOf(a.repo) - repos.indexOf(b.repo));
await fs.writeFile(OUT, JSON.stringify(out, null, 1), 'utf8');
console.log(`完成 ${out.length}，有 README ${out.filter((x) => x.text).length}`);
