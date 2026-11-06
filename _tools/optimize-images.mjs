#!/usr/bin/env node
/**
 * _tools/optimize-images.mjs —— 把补图清单里太大的图压成 webp（依赖本机 ffmpeg）
 *
 * 卡片最宽也就 300 出头，原图动辄 1-2MB 纯属浪费流量。口径：
 *   静图：宽压到 ≤880，webp q80
 *   动图：宽压到 ≤760、fps 12，动图 webp（<img> 直接能放）
 *   只有 > 180KB 的才处理，压完没变小就保留原图
 *
 * 用法：node _tools/optimize-images.mjs [--dry] [--force]
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = path.join(ROOT, 'site', 'assets', 'img');
const MAP_JSON = path.join(ROOT, '_data', 'demo-images.json');
const MAP_JS = path.join(ROOT, 'site', 'assets', 'js', 'demo-images.js');

const DRY = process.argv.includes('--dry');
const FORCE = process.argv.includes('--force');
const MIN_BYTES = 180 * 1024;

const map = JSON.parse(fs.readFileSync(MAP_JSON, 'utf8'));
// 原图不删，挪到仓库外层的归档目录（本机删除被安全垫片拦，而且留个原件更好复查）
const ARCHIVE = path.join(ROOT, '_data', 'img-src');
fs.mkdirSync(ARCHIVE, { recursive: true });

// 先对账：上一轮可能已经压过但 map 还指着原图
let fixed = 0;
for (const [id, info] of Object.entries(map)) {
  const alt = info.file.replace(/\.[^.]+$/, '') + '.webp';
  if (alt !== info.file && fs.existsSync(path.join(IMG_DIR, alt)) && !fs.existsSync(path.join(IMG_DIR, info.file))) {
    map[id] = { ...info, file: alt };
    fixed++;
  }
}
if (fixed) console.log(`· 修正 ${fixed} 条指向已压缩文件的记录`);

const entries = Object.entries(map);
let saved = 0;
let done = 0;

function writeMap() {
  fs.writeFileSync(MAP_JSON, JSON.stringify(map, null, 1), 'utf8');
  const plain = Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.file]));
  fs.writeFileSync(MAP_JS,
    '/* 补图清单 · 由 _tools/fetch-demo-images.mjs 生成、_tools/optimize-images.mjs 压过，别手改 */\n' +
    'window.DEMO_IMGS = ' + JSON.stringify(plain, null, 0) + ';\n', 'utf8');
}

for (const [id, info] of entries) {
  const file = info.file;
  const src = path.join(IMG_DIR, file);
  if (!fs.existsSync(src)) continue;
  const size = fs.statSync(src).size;
  if (size < MIN_BYTES && !FORCE) continue;
  if (file.endsWith('.webp') && !FORCE) continue;

  const isGif = /\.gif$/i.test(file);
  const out = path.join(IMG_DIR, file.replace(/\.[^.]+$/, '') + '.webp');
  if (out !== src && fs.existsSync(out)) {
    // 上一轮已经压过、只是原件没挪走：直接用压好的，把原件归档
    const exSize = fs.statSync(out).size;
    if (exSize < size) {
      try { fs.renameSync(src, path.join(ARCHIVE, path.basename(src))); } catch (e) {}
      map[id] = { ...info, file: path.basename(out) };
      writeMap();
      saved += size - exSize;
      done++;
      console.log(`· 复用已压缩 ${file.padEnd(44)} ${(size / 1024).toFixed(0)}KB → ${(exSize / 1024).toFixed(0)}KB`);
    } else {
      console.log(`· 跳过（同名 webp 反而更大）${file}`);
    }
    continue;
  }
  const vf = isGif ? "scale='min(760,iw)':-2,fps=12" : "scale='min(880,iw)':-2";
  const args = ['-y', '-loglevel', 'error', '-i', src, '-vf', vf];
  if (isGif) args.push('-c:v', 'libwebp', '-lossless', '0', '-q:v', '65', '-loop', '0');
  else args.push('-q:v', '80');
  args.push(out);

  if (DRY) { console.log(`would: ${file} → ${path.basename(out)}`); continue; }
  try {
    execFileSync('ffmpeg', args, { stdio: 'pipe' });
  } catch (e) {
    console.log(`✗ 失败 ${file}: ${String(e.message).slice(0, 60)}`);
    continue;
  }
  const newSize = fs.statSync(out).size;
  if (newSize >= size) {
    try { fs.unlinkSync(out); } catch (e) {}
    continue;
  }
  if (out !== src) {
    // 原件归档，不站内留着白占带宽
    try { fs.renameSync(src, path.join(ARCHIVE, path.basename(src))); } catch (e) {}
  }
  map[id] = { ...info, file: path.basename(out) };
  writeMap();
  saved += size - newSize;
  done++;
  console.log(`+ ${file.padEnd(52)} ${(size / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB`);
}

if (!DRY && done) writeMap();
console.log(`\n处理 ${done} 张，省下 ${(saved / 1048576).toFixed(1)}MB`);
