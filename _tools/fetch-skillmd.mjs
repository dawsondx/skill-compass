#!/usr/bin/env node
/**
 * _tools/fetch-skillmd.mjs —— 抓每个仓库的 SKILL.md 源码（零依赖）
 *
 * 抽屉里第二个 tab「SKILL.md 源码透视」用。仓库未必有，所以：
 *   · 先试根目录 SKILL.md / skill.md / SKILL.MD
 *   · 带 path 的子条目，再试 {path}/SKILL.md
 *   · 全都没命中就留空，前端显示「该仓库未提供 SKILL.md」并给 README 跳转
 * 只截前 60 行 / 8KB，避免把整本手册塞进页面。
 *
 * 用法：
 *   node _tools/fetch-skillmd.mjs                 # 全量
 *   node _tools/fetch-skillmd.mjs --limit 10      # 先试 10 个
 *   node _tools/fetch-skillmd.mjs --ids a,b       # 指定条目
 *   node _tools/fetch-skillmd.mjs --dry           # 只统计，不写盘
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = path.join(ROOT, 'site', 'assets', 'js', 'data.js');
const OUT_JS = path.join(ROOT, 'site', 'assets', 'js', 'skillmd.js');
const OUT_INDEX = path.join(ROOT, 'site', 'assets', 'js', 'skillmd-index.js');
const OUT_JSON = path.join(ROOT, '_data', 'skillmd.json');

const args = process.argv.slice(2);
const flag = (k) => args.includes(k);
const val = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const DRY = flag('--dry');
const LIMIT = Number(val('--limit', 0)) || 0;
const ONLY = (val('--ids', '') || '').split(',').filter(Boolean);

const CONCURRENCY = 8;
const MAX_LINES = 24;
const MAX_BYTES = 2 * 1024;
const README_LINES = 24;
const UA = 'Mozilla/5.0 (compatible; skill-compass-skillmd/1.0; +https://skills.dawsondx.top/)';

function loadSkills() {
  const sb = {};
  vm.createContext(sb);
  Object.defineProperty(sb, 'window', { value: sb, writable: true, configurable: true });
  vm.runInContext(fs.readFileSync(DATA_PATH, 'utf8'), sb, { filename: 'data.js' });
  return sb.SKILLS || [];
}

async function getText(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': UA, 'accept': 'text/plain, */*' },
        signal: AbortSignal.timeout(12000)
      });
      if (!res.ok) return null;
      const txt = await res.text();
      // 有些仓库把 HTML 错误页当 200 返，排掉
      if (/^\s*<!DOCTYPE|<html/i.test(txt)) return null;
      if (txt.length < 40) return null;
      return txt;
    } catch (e) {
      if (attempt === 1) return null;
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  return null;
}

function clip(txt) {
  let t = txt.replace(/\r\n/g, '\n').split('\n').slice(0, MAX_LINES).join('\n');
  if (Buffer.byteLength(t, 'utf8') > MAX_BYTES) {
    t = Buffer.from(t, 'utf8').subarray(0, MAX_BYTES).toString('utf8').replace(/\n[^\n]*$/, '') + '\n…';
  }
  return t.trimEnd() + '\n';
}

function clipReadme(txt) {
  const lines = txt.replace(/\r\n/g, '\n').split('\n');
  // README 开头常常是一堆徽章 / logo / 空行，从第一处正文或标题开始截
  let start = lines.findIndex((l, i) =>
    i > 2 && (l.trim().length > 60 || /^#{1,3}\s+\S/.test(l)) && !/^\s*\[?!\[/.test(l)
  );
  if (start < 0) start = 0;
  let t = lines.slice(start, start + README_LINES).join('\n');
  if (Buffer.byteLength(t, 'utf8') > MAX_BYTES) {
    t = Buffer.from(t, 'utf8').subarray(0, MAX_BYTES).toString('utf8').replace(/\n[^\n]*$/, '') + '\n…';
  }
  return t.trimEnd() + '\n';
}

function candidates(s) {
  const base = `https://raw.githubusercontent.com/${s.repo}/HEAD/`;
  const out = ['SKILL.md', 'skill.md', 'SKILL.MD'];
  if (s.path) {
    const sub = String(s.path).replace(/^tree\/[^/]+\//, '').replace(/^\/+|\/+$/g, '');
    if (sub) ['SKILL.md', 'skill.md'].forEach((f) => out.push(sub + '/' + f));
  }
  // 合集类仓库根目录没有 SKILL.md，退一步给 README 节选（前端会把 tab 名换成 README 节选）
  ['README.md', 'readme.md', 'README.MD'].forEach((f) => out.push(f));
  return out.map((f) => ({ file: base + f, isReadme: /readme/i.test(f) }));
}

async function work(s) {
  for (const c of candidates(s)) {
    const txt = await getText(c.file);
    if (!txt) continue;
    return {
      id: s.id,
      text: c.isReadme ? clipReadme(txt) : clip(txt),
      from: c.file.replace(/^https:\/\/raw\.githubusercontent\.com\//, '')
    };
  }
  return null;
}

async function main() {
  let list = loadSkills();
  if (ONLY.length) list = list.filter((s) => ONLY.includes(s.id));
  if (LIMIT) list = list.slice(0, LIMIT);

  const found = {};
  const meta = {};
  let done = 0, hits = 0, cursor = 0;

  async function runner() {
    while (cursor < list.length) {
      const s = list[cursor++];
      let r = null;
      try { r = await work(s); } catch (e) { /* 单条失败不影响整批 */ }
      done++;
      if (r) { found[r.id] = r.text; meta[r.id] = r.from; hits++; }
      if (done % 25 === 0 || done === list.length) {
        console.log(`  ${done}/${list.length} · 命中 ${hits}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, runner));

  console.log(`✅ SKILL.md 命中 ${hits}/${list.length}`);
  if (DRY) {
    console.log(Object.keys(meta).slice(0, 8).map((k) => k + ' ← ' + meta[k]).join('\n'));
    return;
  }

  const keys = Object.keys(found).sort();
  const body = keys.map((k) => '  ' + JSON.stringify(k) + ': ' + JSON.stringify(found[k])).join(',\n');
  const js = `/* SKILL.md 源码快照 —— 由 _tools/fetch-skillmd.mjs 生成，别手改\n` +
    `   命中 ${keys.length} 个仓库；只截前 ${MAX_LINES} 行。缺的就是仓库里没有。 */\n` +
    `window.SKILLMD = {\n${body}\n};\n` +
    `window.SKILLMD_FROM = ${JSON.stringify(meta, null, 0)};\n`;
  fs.mkdirSync(path.dirname(OUT_JS), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JS, js, 'utf8');
  fs.writeFileSync(OUT_JSON, JSON.stringify({ texts: found, from: meta }, null, 2), 'utf8');
  // 轻量索引（几 KB）随首屏加载：只记「有没有 / 是 SKILL.md 还是 README」，
  // 真正的正文放在 skillmd.js 里，点开「源码透视」tab 才注入，别把几百 KB 压在首屏。
  const kind = {};
  keys.forEach((k) => { kind[k] = /\/SKILL\.md$/i.test(meta[k]) ? 'md' : 'readme'; });
  fs.writeFileSync(OUT_INDEX,
    `/* 源码快照索引 —— _tools/fetch-skillmd.mjs 生成。md=真 SKILL.md，readme=README 节选 */\n` +
    `window.SKILLMD_META = ${JSON.stringify(kind)};\n`, 'utf8');
  console.log(`· 已写入 site/assets/js/skillmd.js (${(Buffer.byteLength(js) / 1024).toFixed(1)} KB)`);
  console.log(`· 已写入 site/assets/js/skillmd-index.js (${Object.keys(kind).length} 条索引)`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
