/**
 * 上游动态抓取：从 GitHub 的公开 Atom feed 拿「最近提交 / 最新版本 / 发版日期」
 *
 * 为什么用 atom 而不是 REST API：
 *   api.github.com 匿名限流 60 次/小时/IP，121 个仓库一次就爆；
 *   commits.atom / releases.atom 不占 API 配额、不需要 token。
 *
 * 为什么每轮抓取几乎不花钱：
 *   atom feed 支持 ETag（实测首次 200 约 20KB，带 If-None-Match 再问返回 304、零响应体）。
 *   所以稳态下每轮 242 个请求里绝大多数是 304，只有真变了的仓库才回 200。
 *   这也是为什么「一小时一轮」甚至更勤都不算骚扰 GitHub。
 *
 * 这个模块被两处复用：
 *   1. site/server.mjs —— 线上服务端定时/按需抓取
 *   2. _tools/fetch-upstream.mjs —— 本地离线刷新内置快照
 * 所以这里只做纯数据逻辑，不碰文件系统、不碰 DOM。
 */

export const VER_RE = /[vV]?\d+(?:\.\d+)+/;

const UA = 'skill-compass/2.0 (+https://skill-compass.app.workbuddy.host)';

export function unesc(s) {
  return String(s)
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/** 解析 atom 里的 <entry> 列表（releases.atom 用） */
export function parseEntries(xml) {
  const out = [];
  const re = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = re.exec(xml))) {
    const body = m[1];
    const t = body.match(/<title>([^<]*)<\/title>/);
    const u = body.match(/<updated>([^<]*)<\/updated>/);
    out.push({ title: t ? unesc(t[1]) : '', updated: u ? u[1] : '' });
  }
  return out;
}

/** feed 级别的第一个 <updated> 就是最近一次提交时间（commits.atom 用） */
export function firstUpdated(xml) {
  const m = String(xml).match(/<updated>([^<]*)<\/updated>/);
  return m ? m[1] : '';
}

/**
 * 带 ETag 协商的 GET
 * @returns {Promise<{notModified:boolean, text:string, etag:string}>}
 */
async function request(url, { etag, retry = 2, timeout = 12000, sleep } = {}) {
  const wait = sleep || ((ms) => new Promise((r) => setTimeout(r, ms)));
  let lastErr;

  for (let i = 0; i < retry; i++) {
    try {
      const headers = { 'User-Agent': UA, Accept: 'application/atom+xml, application/xml' };
      if (etag) headers['If-None-Match'] = etag;

      const res = await fetch(url, { headers, signal: AbortSignal.timeout(timeout) });

      if (res.status === 304) return { notModified: true, text: '', etag: etag || '' };
      if (!res.ok) throw new Error('HTTP ' + res.status);

      return {
        notModified: false,
        text: await res.text(),
        etag: res.headers.get('etag') || ''
      };
    } catch (e) {
      lastErr = e;
      if (i < retry - 1) await wait(1000 * (i + 1));
    }
  }
  throw lastErr;
}

/**
 * 抓一个仓库
 * @param {object} opts {etags, prevRow, ...request opts}
 * @returns {Promise<{row:[string,string,string], etags:object, notModified:boolean, error:boolean}>}
 *   row = [最近提交日期, 版本号, 发版日期]
 *   304 或抓取失败时用 prevRow 兜底，绝不把已有数据抹成空
 */
export async function fetchOne(repo, opts = {}) {
  const prevEtags = (opts.etags && opts.etags[repo]) || {};
  const prevRow = opts.prevRow || ['', '', ''];
  const nextEtags = { ...prevEtags };

  let commit = '', tag = '', relAt = '';
  let notModified = false;
  let error = false;

  // 1) 最近提交
  try {
    const c = await request(`https://github.com/${repo}/commits.atom`, { ...opts, etag: prevEtags.commits });
    if (c.notModified) {
      notModified = true;
      commit = prevRow[0] || '';
      nextEtags.commits = c.etag || prevEtags.commits;
    } else {
      commit = firstUpdated(c.text).slice(0, 10);
      if (c.etag) nextEtags.commits = c.etag;
    }
  } catch {
    error = true;
    commit = prevRow[0] || '';
  }

  // 2) 最新版本
  try {
    const r = await request(`https://github.com/${repo}/releases.atom`, { ...opts, etag: prevEtags.releases });
    if (r.notModified) {
      notModified = true;
      tag = prevRow[1] || '';
      relAt = prevRow[2] || '';
      nextEtags.releases = r.etag || prevEtags.releases;
    } else {
      const e = parseEntries(r.text)[0];
      if (e) {
        const v = e.title.match(VER_RE);
        if (v) {
          tag = v[0];
          relAt = e.updated.slice(0, 10);
        }
      }
      if (r.etag) nextEtags.releases = r.etag;
    }
  } catch {
    error = true;
    tag = prevRow[1] || '';
    relAt = prevRow[2] || '';
  }

  if (!commit) error = true;
  return { row: [commit, tag, relAt], etags: nextEtags, notModified, error };
}

/**
 * 并发抓一批仓库（两轮：第一轮 6 并发，失败的第二轮 3 并发再试一次）
 * @param {string[]} repos
 * @param {object} opts {concurrency, fallback, etags, onProgress}
 *   fallback: 上一轮的数据；304 或抓失败都沿用它
 *   etags:   上一轮的 ETag，用于协商缓存
 * @returns {Promise<{data, etags, stats}>}
 */
export async function fetchAll(repos, opts = {}) {
  const { concurrency = 6, fallback = {}, etags = {}, onProgress } = opts;
  const data = {};
  const nextEtags = { ...etags };
  const ok = new Set();
  const failed = [];

  let done = 0;
  let notModifiedCount = 0;
  let changedCount = 0;

  async function runPool(list, conc, fn) {
    let cursor = 0;
    await Promise.all(Array.from({ length: Math.min(conc, list.length) }, async () => {
      while (cursor < list.length) {
        const item = list[cursor++];
        await fn(item);
        done++;
        if (onProgress) onProgress(Math.min(done, repos.length), repos.length);
      }
    }));
  }

  async function attempt(repo) {
    const prevRow = fallback[repo] || ['', '', ''];
    let r;
    try {
      r = await fetchOne(repo, { ...opts, etags, prevRow });
    } catch {
      r = { row: prevRow, etags: {}, notModified: false, error: true };
    }

    data[repo] = r.row;
    if (r.etags && Object.keys(r.etags).length) nextEtags[repo] = r.etags;

    if (r.notModified) notModifiedCount++;
    if (!r.error) {
      ok.add(repo);
      if (prevRow[0] && (r.row[0] !== prevRow[0] || r.row[1] !== prevRow[1] || r.row[2] !== prevRow[2])) {
        changedCount++;
      }
    }
  }

  await runPool(repos, concurrency, attempt);

  // 第二轮：只重试仍然失败、且没有旧值兜底的（偶发 5xx / 超时）
  const retryList = repos.filter((r) => !ok.has(r) && !(fallback[r] && fallback[r][0]));
  if (retryList.length) {
    await runPool(retryList, 3, attempt);
  }

  for (const r of repos) if (!ok.has(r)) failed.push(r);

  const withVersion = Object.values(data).filter((r) => /^[vV]?\d+\.\d+/.test(r[1])).length;
  return {
    data,
    etags: nextEtags,
    stats: { total: repos.length, withVersion, failed, notModified: notModifiedCount, changed: changedCount }
  };
}

/** 从 data.js 源码里读出所有 repo（去重、保持出现顺序） */
export function readRepos(src) {
  const seen = new Set();
  const out = [];
  for (const m of String(src).matchAll(/\brepo:\s*'([^']+\/[^']+)'/g)) {
    if (!seen.has(m[1])) { seen.add(m[1]); out.push(m[1]); }
  }
  return out;
}

/** 从 data.js 源码里读出已有的 UPS 块（当兜底用） */
export function readUpsBlock(src) {
  const i = String(src).indexOf('window.UPS = {');
  if (i < 0) return {};
  const out = {};
  const re = /'([^']+\/[^']+)':\s*\['([^']*)',\s*'([^']*)',\s*'([^']*)'\]/g;
  let m;
  while ((m = re.exec(src.slice(i)))) out[m[1]] = [m[2], m[3], m[4]];
  return out;
}
