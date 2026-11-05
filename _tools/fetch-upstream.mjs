#!/usr/bin/env node
/**
 * 手动刷新内置快照（可选工具，线上不需要它）
 *
 * 线上站点由 site/server.mjs 自己定时抓取，**不需要跑这个脚本**。
 * 它的用途是：改了 skill 清单、或者想在本地把 data.js 里的兜底快照也更新一下。
 *
 * 用法：
 *   node _tools/fetch-upstream.mjs            # 只打印统计，不改文件
 *   node _tools/fetch-upstream.mjs --write    # 同时更新 data.js 的 UPS 块和 site/server/seed.json
 *
 * 抓取逻辑和线上服务端共用 site/server/upstream.mjs，不重复实现。
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fetchAll, readRepos, readUpsBlock } from '../site/server/upstream.mjs';

const execFileP = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'site', 'assets', 'js', 'data.js');
const SEED = path.join(ROOT, 'site', 'server', 'seed.json');
const MARK = '/* ---------- 上游动态';

function pad2(n) { return (n < 10 ? '0' : '') + n; }
function todayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${pad2(t.getMonth() + 1)}-${pad2(t.getDate())}`;
}

async function main() {
  const write = process.argv.includes('--write');
  const src = await fs.readFile(DATA, 'utf8');

  const repos = readRepos(src).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  if (!repos.length) throw new Error('data.js 里没找到 repo 字段');

  const prev = readUpsBlock(src);
  const t0 = Date.now();
  const { data, stats } = await fetchAll(repos, {
    concurrency: 6,
    fallback: prev,
    onProgress: (d, n) => { if (d % 20 === 0 || d === n) process.stdout.write(`  ${d}/${n} …\n`); }
  });

  console.log(`\n${stats.total} 个仓库 · ${((Date.now() - t0) / 1000).toFixed(1)}s · 有版本号 ${stats.withVersion} 个` +
    (stats.failed.length ? ` · 沿用旧值 ${stats.failed.length} 个（${stats.failed.join(', ')}）` : ''));

  const body = repos.map((r) => {
    const [a, b, c] = data[r];
    return `  '${r}': ['${a}', '${b}', '${c}']`;
  }).join(',\n');

  const block = `${MARK}（抓取自 GitHub 的 commits.atom / releases.atom，不消耗 API 配额）
   格式：'owner/repo': [最近提交日期, 版本号(从 tag 里正则可抽则填,否则空), 发版日期]
   这条只是冷启动兜底：线上由 site/server.mjs 定时自动抓取，不需要手动跑脚本
   手动同步：node _tools/fetch-upstream.mjs --write ---------- */
window.UPS_FETCHED = '${todayStr()}';
window.UPS = {
${body}
};
`;

  if (!write) {
    console.log('\n--- 预览（加 --write 才会写盘）---\n');
    console.log(block.slice(0, 420) + '\n  …\n};');
    return;
  }

  const next = src.slice(0, src.indexOf(MARK)) + block;
  await fs.writeFile(DATA, next, 'utf8');
  await fs.writeFile(SEED, JSON.stringify({ fetchedAt: todayStr(), data }, null, 0), 'utf8');

  try {
    await execFileP(process.execPath, ['--check', DATA]);
    console.log(`\n已更新 ${path.relative(ROOT, DATA)} 与 ${path.relative(ROOT, SEED)}，语法自检通过。`);
  } catch (e) {
    await fs.writeFile(DATA, src, 'utf8');
    console.error('\n语法自检失败，data.js 已回滚：\n' + (e.stderr || e.message));
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error('刷新失败：' + ((e && e.message) || e));
  process.exitCode = 1;
});
