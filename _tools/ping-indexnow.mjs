#!/usr/bin/env node
/**
 * _tools/ping-indexnow.mjs —— 部署后自动向 IndexNow 推送全站 URL（零依赖）
 *
 * IndexNow 协议由 Bing、Yandex 等搜索引擎共同支持；
 * Bing 索引同时是 ChatGPT Search 等 AI 搜索引擎的重要底座，推送后可大幅缩短收录延迟。
 *
 * 用法：
 *   node _tools/ping-indexnow.mjs          # 读取 site/sitemap.xml 并向 api.indexnow.org 提交
 *   node _tools/ping-indexnow.mjs --dry    # 仅打印将要提交的载荷，不发网络请求
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_HOST, SITE_URL, INDEXNOW_KEY } from './build-seo.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITEMAP_PATH = path.join(ROOT, 'site', 'sitemap.xml');
const KEY_FILE = path.join(ROOT, 'site', `${INDEXNOW_KEY}.txt`);
const DRY = process.argv.includes('--dry');

function extractUrls(xml) {
  const out = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml))) {
    const u = m[1].trim()
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
    if (u.startsWith(`https://${SITE_HOST}/`)) out.push(u);
  }
  return Array.from(new Set(out));
}

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error('找不到 site/sitemap.xml，请先运行 node _tools/build-seo.mjs');
  }
  if (!fs.existsSync(KEY_FILE)) {
    throw new Error(`找不到 IndexNow 校验文件 ${path.relative(ROOT, KEY_FILE)}`);
  }

  const urls = extractUrls(fs.readFileSync(SITEMAP_PATH, 'utf8'));
  if (!urls.length) {
    console.log('· sitemap.xml 中无有效 URL，跳过 IndexNow 推送');
    return;
  }

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}${INDEXNOW_KEY}.txt`,
    urlList: urls
  };

  if (DRY) {
    console.log('· --dry 预览模式，将向 https://api.indexnow.org/indexnow 提交：');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000)
  });

  if (res.ok || res.status === 202) {
    console.log(`✅ IndexNow 推送成功（HTTP ${res.status} · 共 ${urls.length} 个 URL）`);
  } else {
    const body = await res.text().catch(() => '');
    console.warn(`⚠ IndexNow 返回 HTTP ${res.status}：${body.slice(0, 200)}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('❌ IndexNow 推送异常：', err.message || err);
  process.exit(1);
});
