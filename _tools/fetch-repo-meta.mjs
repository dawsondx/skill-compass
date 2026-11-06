#!/usr/bin/env node
/**
 * 抓取 GitHub 仓库元信息（stars / description / 归档状态 / 最终地址）
 * 不占 API 配额：解析仓库首页内嵌 JSON 里的 stargazerCount
 *
 * 用法: node _tools/fetch-repo-meta.mjs <in.json> <out.json>
 *   in.json: [{repo, ...}, ...]   repo 形如 owner/name
 */
import fs from 'node:fs/promises';

const [, , IN, OUT] = process.argv;
const list = JSON.parse(await fs.readFile(IN, 'utf8'));

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';

async function one(repo) {
  const url = `https://github.com/${repo}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000)
    });
    if (!res.ok) return { repo, status: res.status, finalUrl: res.url };
    const html = await res.text();
    const num = (k) => {
      const m = html.match(new RegExp('"' + k + '":(\\d+)'));
      return m ? Number(m[1]) : null;
    };
    const str = (k) => {
      const m = html.match(new RegExp('"' + k + '":"((?:[^"\\\\]|\\\\.)*)"'));
      return m ? JSON.parse('"' + m[1] + '"') : null;
    };
    const finalRepo = (() => {
      const m = res.url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
      return m ? m[1] + '/' + m[2] : repo;
    })();
    return {
      repo,
      status: 200,
      finalRepo,
      stars: num('stargazerCount'),
      desc: str('description'),
      archived: /"isArchived":true/.test(html),
      pushedAt: str('pushedAt') || str('lastCommitDate')
    };
  } catch (e) {
    return { repo, status: 0, error: String(e && e.message || e) };
  }
}

const out = [];
let i = 0;
const conc = 5;
await Promise.all(Array.from({ length: conc }, async () => {
  while (i < list.length) {
    const item = list[i++];
    const r = await one(item.repo);
    out.push(r);
    if (out.length % 20 === 0) process.stdout.write(`  ${out.length}/${list.length}\n`);
  }
}));

out.sort((a, b) => list.findIndex((x) => x.repo === a.repo) - list.findIndex((x) => x.repo === b.repo));
await fs.writeFile(OUT, JSON.stringify(out, null, 1), 'utf8');

const ok = out.filter((x) => x.status === 200);
console.log(`完成 ${out.length}：可访问 ${ok.length}，404 ${out.filter((x) => x.status === 404).length}，其他失败 ${out.filter((x) => x.status !== 200 && x.status !== 404).length}`);
