#!/usr/bin/env node
/**
 * _tools/fetch-demo-images.mjs —— 给「没有演示图」的仓库补一张真图（零依赖）
 *
 * 只做一件事：去仓库 README 里把作者自己放的演示图揪出来，验证能打开，下载自托管。
 * 判断口径（按可信度从高到低挑第一个）：
 *   1. 文件名/路径带 screenshot / demo / preview / showcase / example / cover 的优先
 *   2. 格式 gif > webp > png > jpg（gif 多半是录制好的效果动画）
 *   3. 排掉徽章、logo、头像、图标、纯外链统计图（shields.io 之类）
 *   4. 真下载回来验一遍：content-type 是图片、12KB ~ 8MB 之间，太大太小都不要
 *
 * 用法：
 *   node _tools/fetch-demo-images.mjs --limit 10        # 先试 10 个
 *   node _tools/fetch-demo-images.mjs                   # 全量
 *   node _tools/fetch-demo-images.mjs --dry             # 只打印结果，不下载不写盘
 *   node _tools/fetch-demo-images.mjs --ids a,b,c       # 指定条目
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = path.join(ROOT, 'site', 'assets', 'js', 'data.js');
const IMG_DIR = path.join(ROOT, 'site', 'assets', 'img');
const OUT_JS = path.join(ROOT, 'site', 'assets', 'js', 'demo-images.js');
const OUT_JSON = path.join(ROOT, '_data', 'demo-images.json');

const args = process.argv.slice(2);
const flag = (k) => args.includes(k);
const val = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const DRY = flag('--dry');
const LIMIT = Number(val('--limit', 0)) || 0;
const ONLY = (val('--ids', '') || '').split(',').filter(Boolean);

const MIN_BYTES = 12 * 1024;
const MAX_BYTES = 8 * 1024 * 1024;
const CONCURRENCY = 8;
const UA = 'Mozilla/5.0 (compatible; skill-compass-demo-fetch/1.0; +https://skills.dawsondx.top/)';

function loadSkills() {
  const sb = {};
  vm.createContext(sb);
  Object.defineProperty(sb, 'window', { value: sb, writable: true, configurable: true });
  vm.runInContext(fs.readFileSync(DATA_PATH, 'utf8'), sb, { filename: 'data.js' });
  return sb.SKILLS || [];
}

const READMES = ['README.md', 'readme.md', 'Readme.md', 'README.MD', 'README.markdown', 'README.rst'];

async function getText(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(15000) });
      if (!res.ok) return null;
      const txt = await res.text();
      return txt.length > 400000 ? txt.slice(0, 400000) : txt;
    } catch (e) {
      if (attempt === 1) return null;
      await new Promise((r) => setTimeout(r, 700));
    }
  }
  return null;
}

/* 从 README 里扒出所有图片地址（markdown / html / rst / 引用式四种写法） */
function extractImages(md, base) {
  const out = [];
  const push = (raw, alt) => {
    let u = String(raw || '').trim().replace(/^<|>$/g, '').replace(/^["']|["']$/g, '');
    if (!u || u.startsWith('data:')) return;
    if (/^(mailto:|javascript:)/i.test(u)) return;
    try { u = new URL(u, base).href; } catch (e) { return; }
    out.push({ url: u, alt: alt || '' });
  };
  let m;
  const reMd = /!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g;
  while ((m = reMd.exec(md))) push(m[2], m[1]);
  const reHtml = /<img[^>]+src=["']([^"']+)["'][^>]*?(?:alt=["']([^"']*)["'])?[^>]*>/gi;
  while ((m = reHtml.exec(md))) push(m[1], m[2]);
  const reRst = /\.\. image::\s*(\S+)/g;
  while ((m = reRst.exec(md))) push(m[1]);
  // 引用式：![alt][id] + [id]: https://...
  const refs = {};
  const reRef = /^\s*\[([^\]]+)\]:\s*(\S+)/gm;
  while ((m = reRef.exec(md))) refs[m[1].toLowerCase()] = m[2];
  const reRefImg = /!\[([^\]]*)\]\[([^\]]*)\]/g;
  while ((m = reRefImg.exec(md))) {
    const key = (m[2] || m[1] || '').toLowerCase();
    if (refs[key]) push(refs[key], m[1]);
  }
  return out;
}

const BAD = /(badge|shield|shields\.io|badgen|travis|circleci|codecov|coveralls|npmjs\.com\/package|license|logo|favicon|avatar|icon-|sprite|star-history|visitor|star-badge|sponsor|partner|donat|payment|wechat|alipay|coffee|afdian|打赏|赞赏|二维码|qrcode|qr-code)/i;
const GOOD = /(screenshot|screen-shot|demo|preview|showcase|example|sample|cover|hero|result|output|before-after|usage|效果|演示|截图)/i;
const EXT_SCORE = { gif: 6, webp: 5, png: 4, jpg: 3, jpeg: 3 };

/* 从图片头里读宽高：用来挡掉赞助商 logo（太扁/太小）和收款码（正方形小块） */
function dims(buf, ext) {
  try {
    if (ext === 'png' && buf.length > 24) {
      return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    }
    if (ext === 'gif' && buf.length > 10) {
      return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
    }
    if (ext === 'jpg' && buf.length > 4) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) { i++; continue; }
        const mk = buf[i + 1];
        if (mk >= 0xc0 && mk <= 0xcf && mk !== 0xc4 && mk !== 0xc8 && mk !== 0xcc) {
          return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
        }
        const len = buf.readUInt16BE(i + 2);
        if (!len) break;
        i += 2 + len;
      }
    }
    if (ext === 'webp' && buf.length > 30) {
      const kind = buf.toString('ascii', 12, 16);
      if (kind === 'VP8X') {
        const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
        const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
        return { w, h };
      }
      if (kind === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
      if (kind === 'VP8L') {
        const b = buf.readUInt32LE(21);
        return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
      }
    }
  } catch (e) {}
  return null;
}

function score(cand) {
  let u;
  try { u = new URL(cand.url); } catch (e) { return -99; }
  const p = decodeURIComponent(u.pathname);
  const ext = (p.split('.').pop() || '').toLowerCase();
  // GitHub 的贴图地址（user-attachments / private-user-images）不带扩展名，只能靠 content-type 判断
  const attach = /\/user-attachments\/assets\//.test(p) || /private-user-images\.githubusercontent\.com/.test(u.host);
  if (!attach && !(ext in EXT_SCORE)) return -99;
  if (BAD.test(p) || BAD.test(cand.alt)) return -99;
  let s = attach ? 4 : EXT_SCORE[ext];
  if (GOOD.test(p) || GOOD.test(cand.alt)) s += 5;
  if (/raw\.githubusercontent\.com|user-images\.githubusercontent\.com|github\.com/.test(u.host)) s += 2;
  else s -= 2;
  if (/\/docs?\//i.test(p)) s += 1;
  if (/\.(svg)$/i.test(p)) s -= 6;          // 矢量图标基本不是效果图
  return s;
}

async function probe(url) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) return null;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.startsWith('image/')) return null;
    const len = Number(res.headers.get('content-length') || 0);
    if (len && (len < MIN_BYTES || len > MAX_BYTES)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < MIN_BYTES || buf.length > MAX_BYTES) return null;
    const ext = (ct.split('/')[1] || 'png').replace('jpeg', 'jpg').replace('svg+xml', 'svg');
    if (ext === 'svg') return null;
    const d = dims(buf, ext);
    // 尺寸闸门：宽度 <480、太扁（banner）或接近正方形的小图（收款码/logo）都判为不是效果图
    if (d) {
      if (d.w < 480 || d.h < 200) return null;
      const ratio = d.w / d.h;
      if (ratio > 3.2 || ratio < 0.65) return null;
    }
    return { buf, ext, w: d ? d.w : 0, h: d ? d.h : 0 };
  } catch (e) {
    return null;
  }
}

function safeName(s) {
  return String(s.repo).replace(/\//g, '~').replace(/[^A-Za-z0-9._~-]/g, '-');
}

async function work(s) {
  try {
    return await workInner(s);
  } catch (e) {
    return { id: s.id, status: 'error', msg: String(e).slice(0, 80) };
  }
}

async function workInner(s) {
  const base = 'https://raw.githubusercontent.com/' + s.repo + '/HEAD/';
  let md = null;
  let usedReadme = '';
  for (const name of READMES) {
    md = await getText(base + name);
    if (md) { usedReadme = name; break; }
  }
  if (!md) return { id: s.id, status: 'no-readme' };

  const cands = extractImages(md, base)
    .map((c) => ({ ...c, s: score(c) }))
    .filter((c) => c.s > -90)
    .sort((a, b) => b.s - a.s)
    .slice(0, 5);

  if (!cands.length) return { id: s.id, status: 'no-image' };

  for (const c of cands) {
    const got = await probe(c.url);
    if (!got) continue;
    const file = safeName(s) + '.' + got.ext;
    if (!DRY) fs.writeFileSync(path.join(IMG_DIR, file), got.buf);
    return { id: s.id, status: DRY ? 'would-add' : 'added', file, bytes: got.buf.length, source: c.url, readme: usedReadme };
  }
  return { id: s.id, status: 'all-404' };
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  const runners = Array.from({ length: n }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
      const r = out[idx];
      process.stdout.write(r && r.status !== 'added' && r.status !== 'would-add' ? '·' : '+');
    }
  });
  await Promise.all(runners);
  return out;
}

const SKILLS = loadSkills();
let targets = SKILLS.filter((s) => !s.img);
if (ONLY.length) targets = targets.filter((s) => ONLY.includes(s.id));
if (LIMIT) targets = targets.slice(0, LIMIT);

console.error(`待补图 ${targets.length} 个仓库，并发 ${CONCURRENCY}\n`);
const results = await pool(targets, CONCURRENCY, work);
console.error('\n');

const added = results.filter((r) => r && (r.status === 'added' || r.status === 'would-add'));
const bucket = {};
results.forEach((r) => { if (r) bucket[r.status] = (bucket[r.status] || 0) + 1; });

console.log(JSON.stringify({ bucket, added: added.length }, null, 1));
added.forEach((r) => console.log(`  + ${r.id.padEnd(28)} ${(r.bytes / 1024).toFixed(0)}KB  ${r.source.slice(0, 100)}`));

if (!DRY) {
  // 已有映射 + 本轮新增，写成前端可直接吃的一张表
  let prev = {};
  try { prev = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8')); } catch (e) {}
  const map = {};
  Object.keys(prev).forEach((k) => { map[k] = prev[k].file; });
  added.forEach((r) => { if (r.file) map[r.id] = r.file; });
  fs.writeFileSync(OUT_JSON, JSON.stringify(
    Object.fromEntries(Object.entries(map).map(([id, file]) => {
      const hit = added.find((a) => a.id === id);
      return [id, { file, source: hit ? hit.source : (prev[id] && prev[id].source) || '' }];
    })), null, 1), 'utf8');
  fs.writeFileSync(OUT_JS,
    '/* 补图清单 · 由 _tools/fetch-demo-images.mjs 生成，别手改\n' +
    '   只收录 data.js 里本来没有 img 的仓库；加载后由 app.js 合并进 SKILLS */\n' +
    'window.DEMO_IMGS = ' + JSON.stringify(map, null, 0) + ';\n', 'utf8');
  console.log(`\n→ ${path.relative(ROOT, OUT_JS)}（${Object.keys(map).length} 条）`);
}
