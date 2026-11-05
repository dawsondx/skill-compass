/**
 * Skill 指北 · 服务端
 *
 * 为什么需要一个服务端：GitHub 的 commits.atom 不返回 CORS 头，浏览器直连会被拦死；
 * api.github.com 虽然允许跨域，但匿名限流 60 次/小时/IP，121 个仓库一次就爆。
 * 所以把「抓取」放到服务端，浏览器只问自己的 /api/upstream。
 *
 * 刷新策略是 stale-while-revalidate：
 *   · 请求进来先立刻返回手里的数据（首屏永远不等）
 *   · 如果数据超过 TTL，同时在后台异步重抓，下一个请求就是新的
 *   · 再加一个定时器兜底，进程活着就定期自己刷
 * 结果：用户打开页面拿到的最新数据最多滞后 TTL（默认 30 分钟），完全不需要人的电脑开着。
 *
 * 零依赖：只用 node:http / node:fs，不需要 npm install。
 */

import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchAll, fetchOne, readRepos, readUpsBlock } from './server/upstream.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA_JS = path.join(ROOT, 'assets', 'js', 'data.js');
const SEED_JSON = path.join(ROOT, 'server', 'seed.json');
const CACHE_JSON = path.join(ROOT, 'server', 'cache.json');   // 运行期缓存，能跨进程存活就跨

const PORT = Number(process.env.PORT) || 3000;
// 默认 60 分钟一轮。因为抓取走 ETag 协商缓存，稳态下绝大多数请求只是 304，
// 真正拉取正文的只有「这一小时里确实变过」的那几个仓库，所以这个频率对 GitHub 很轻。
const TTL = Math.max(5, Number(process.env.UPSTREAM_TTL_MIN) || 60) * 60 * 1000;
const CONCURRENCY = 6;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

const now = () => Date.now();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/* ---------- 上游数据缓存 ---------- */
let repos = [];
let cache = { at: 0, updatedAt: 0, fetchedAt: '', data: {}, source: 'seed' };
let etags = {};                                  // 跨轮保留的 ETag，让下一轮大量请求退化成 304
let lastStats = { notModified: 0, changed: 0 };
let inflight = null;
let lastError = '';
let lastMs = 0;

async function boot() {
  // 仓库清单以 data.js 为准
  let src = '';
  try {
    src = await fsp.readFile(DATA_JS, 'utf8');
    repos = readRepos(src);
    if (!repos.length) throw new Error('data.js 里没解析出 repo');
  } catch (e) {
    log('读 data.js 失败：' + e.message);
  }

  // 内置快照：冷启动的第一屏直接用它，不用等抓取
  // 优先用运行期缓存（如果磁盘持久，上轮抓到的数据能接着用），否则退回随包发布的 seed
  let loaded = null;
  try {
    const c = JSON.parse(await fsp.readFile(CACHE_JSON, 'utf8'));
    if (c && c.data && Object.keys(c.data).length) {
      loaded = { at: Number(c.at) || 0, updatedAt: Number(c.updatedAt) || 0, data: c.data, from: 'cache.json' };
      if (c.etags) etags = c.etags;
    }
  } catch { /* 没有缓存文件，正常 */ }

  if (!loaded) {
    try {
      const seed = JSON.parse(await fsp.readFile(SEED_JSON, 'utf8'));
      loaded = { at: 0, updatedAt: 0, data: seed.data || {}, fetchedAt: seed.fetchedAt || '', from: 'seed.json' };
    } catch (e) {
      // 没有 seed.json 就从 data.js 的 UPS 块里捞一份
      const ups = src ? readUpsBlock(src) : {};
      loaded = { at: 0, updatedAt: 0, data: ups, fetchedAt: '', from: ups ? 'data.js' : 'empty' };
      if (!Object.keys(ups).length) log('没有可用快照，首屏会等第一次抓取：' + e.message);
    }
  }

  cache = {
    at: loaded.at,
    updatedAt: loaded.updatedAt,
    fetchedAt: loaded.fetchedAt || todayStr(),
    data: loaded.data,
    source: loaded.from === 'cache.json' ? 'cache' : 'seed'
  };
  log(`快照来源 ${loaded.from} · ${Object.keys(cache.data).length} 条`);

  if (!repos.length) repos = Object.keys(cache.data);
  log(`仓库 ${repos.length} 个，TTL ${TTL / 60000} 分钟`);

  refresh();                                   // 启动即预热
  setInterval(() => { if (!inflight) refresh(); }, TTL);   // 定时兜底
}

const BUDGET = Math.max(30, Number(process.env.UPSTREAM_BUDGET_SEC) || 120) * 1000;
const REFRESH_KEY = process.env.REFRESH_KEY || 'sc-refresh-7f3a91';

function refresh() {
  if (inflight) return inflight;
  const t0 = now();
  inflight = (async () => {
    let timer;
    try {
      // 跑太久就放弃本轮（进程可能被平台回收，白占资源），保留旧数据
      const guard = new Promise((_, rej) => {
        timer = setTimeout(() => rej(new Error(`本轮抓取超过 ${BUDGET / 1000}s，已放弃`)), BUDGET);
      });
      const { data, etags: newEtags, stats } = await Promise.race([
        fetchAll(repos, { concurrency: CONCURRENCY, fallback: cache.data, etags }),
        guard
      ]);
      clearTimeout(timer);

      etags = newEtags;
      // 抓失败的保留旧值，别把好数据抹掉
      for (const r of repos) {
        const row = data[r];
        if (!row || !row[0]) data[r] = (cache.data && cache.data[r]) || ['', '', ''];
      }
      lastMs = now() - t0;
      lastStats = stats;
      cache = { at: now(), updatedAt: now(), fetchedAt: todayStr(), data, source: 'live' };
      lastError = '';
      log(`抓取完成 ${stats.total} 个 · ${(lastMs / 1000).toFixed(1)}s · 304 命中 ${stats.notModified} · 有变化 ${stats.changed}` +
        (stats.failed.length ? ` · 沿用旧值 ${stats.failed.length}` : ''));

      // 落盘：平台如果回收进程，下次冷启动能接着用这批数据
      fsp.writeFile(CACHE_JSON, JSON.stringify({ at: cache.at, updatedAt: cache.updatedAt, data, etags }))
        .then(() => log('缓存已落盘'))
        .catch((e) => log('缓存落盘失败（不影响内存数据）：' + e.message));
    } catch (e) {
      clearTimeout(timer);
      lastError = String((e && e.message) || e);
      log('抓取失败：' + lastError);
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/* ---------- HTTP ---------- */
function sendJSON(res, code, obj, extra = {}) {
  const body = Buffer.from(JSON.stringify(obj));
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Access-Control-Allow-Origin': '*',
    ...extra
  });
  res.end(body);
}

/**
 * 只允许访问 index.html 和 assets/ 下的东西。
 * 白名单而不是黑名单：server.mjs / package.json / server/seed.json 都在同一个目录里，
 * 黑名单一旦漏一条就等于把服务端源码和数据公开了。
 */
function safePath(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath.split('?')[0]); } catch { return null; }
  if (p === '/' || p === '') p = '/index.html';
  if (p.indexOf('\0') > -1) return null;
  if (p !== '/index.html' && !p.startsWith('/assets/')) return null;
  const full = path.normalize(path.join(ROOT, p));
  if (!full.startsWith(ROOT + path.sep)) return null;   // 防路径穿越
  return full;
}

async function serveStatic(req, res, urlPath) {
  const full = safePath(urlPath);
  if (!full) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found'); return; }

  let st;
  try {
    st = await fsp.stat(full);
    if (st.isDirectory()) return serveStatic(req, res, urlPath.replace(/\/?$/, '/index.html'));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }

  const ext = path.extname(full).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  // 页面/脚本边走协商缓存（改了立刻生效），图片长缓存
  const isAsset = /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf)$/i.test(full);
  const headers = {
    'Content-Type': type,
    'Content-Length': st.size,
    'Cache-Control': isAsset ? 'public, max-age=604800' : 'no-cache',
    'Last-Modified': st.mtime.toUTCString()
  };
  if (ext === '.html') headers['Cache-Control'] = 'no-cache';

  const ims = req.headers['if-modified-since'];
  if (ims && !isAsset && new Date(ims).getTime() >= Math.floor(st.mtime.getTime() / 1000) * 1000) {
    res.writeHead(304, headers).end();
    return;
  }

  res.writeHead(200, headers);
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(full).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = req.url || '/';

    if (url.startsWith('/api/upstream')) {
      const age = cache.at ? now() - cache.at : Infinity;
      const stale = age > TTL;
      // 后台刷新，不阻塞本次响应
      if (stale && !inflight) refresh();
      return sendJSON(res, 200, {
        updatedAt: cache.updatedAt || 0,
        fetchedAt: cache.fetchedAt || '',
        source: cache.source,
        stale,
        ageSeconds: Number.isFinite(age) ? Math.round(age / 1000) : null,
        ttlSeconds: Math.round(TTL / 1000),
        refreshing: !!inflight,
        lastError,
        count: Object.keys(cache.data || {}).length,
        data: cache.data || {}
      }, { 'Cache-Control': 'no-store' });
    }

    // 手动催一次完整抓取（顺便用来验证这条链路真的能跑完）
    // 不是公开按钮，带个固定 key 防止被爬虫误触
    if (url.startsWith('/api/refresh')) {
      if (!url.includes('key=' + REFRESH_KEY)) {
        return sendJSON(res, 403, { ok: false, error: 'bad key' });
      }
      const t0 = now();
      await refresh();
      return sendJSON(res, 200, {
        ok: !lastError,
        elapsedMs: now() - t0,
        lastError,
        lastMs,
        source: cache.source,
        stats: lastStats,
        etagEntries: Object.keys(etags).length
      }, { 'Cache-Control': 'no-store' });
    }

    // 诊断用：拿 3 个仓库实测这个环境到 GitHub 的连通性和耗时
    if (url.startsWith('/api/diag')) {
      const sample = repos.slice(0, 3);
      const t0 = now();
      const results = await Promise.all(sample.map(async (repo) => {
        const t = now();
        try {
          const r = await fetchOne(repo, { etags, prevRow: cache.data[repo], retry: 1, timeout: 8000 });
          return { repo, ms: now() - t, ok: !!(r.row && r.row[0]), notModified: r.notModified, err: r.error, row: r.row };
        } catch (e) {
          return { repo, ms: now() - t, error: String((e && e.message) || e) };
        }
      }));
      return sendJSON(res, 200, { totalMs: now() - t0, results }, { 'Cache-Control': 'no-store' });
    }

    if (url.startsWith('/api/health')) {
      return sendJSON(res, 200, {
        ok: true,
        repos: repos.length,
        cached: Object.keys(cache.data || {}).length,
        source: cache.source,
        fetchedAt: cache.fetchedAt,
        ageSeconds: cache.at ? Math.round((now() - cache.at) / 1000) : null,
        ttlSeconds: Math.round(TTL / 1000),
        etagEntries: Object.keys(etags).length,
        notModified: lastStats.notModified || 0,
        changed: lastStats.changed || 0,
        lastMs, lastError, uptime: Math.round(process.uptime())
      });
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405).end('Method not allowed');
      return;
    }
    await serveStatic(req, res, url);
  } catch (e) {
    log('请求出错：' + ((e && e.stack) || e));
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal error');
  }
});

server.listen(PORT, '0.0.0.0', () => log(`listening on 0.0.0.0:${PORT}`));
boot();

process.on('unhandledRejection', (e) => log('unhandledRejection: ' + ((e && e.message) || e)));
