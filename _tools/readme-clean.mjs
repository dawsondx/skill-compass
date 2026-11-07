#!/usr/bin/env node
/**
 * _tools/readme-clean.mjs —— README 摘要的「二次抛光」（零依赖，无副作用）
 *
 * cleanReadme() 负责从原始 Markdown 里剥标记、判噪声；这里负责把剥完之后的
 * 纯文本再收拾一遍，专治几种「看着还像源码」的残留：
 *   · GitHub 提示块  > [!IMPORTANT] / [!NOTE]  → 剥完方括号剩下的 !IMPORTANT
 *   · HTML 实体      &nbsp; &amp; &#39;        → 空白 / 正常标点
 *   · 语言切换栏     Language: / English | 简体中文 | 日本語 | …
 *   · Markdown 表格   | A | B | C |            → A · B · C
 *   · 漏网的标题井号（原行是 "> ### x"，剥引用符时井号才露出来）
 *   · 零宽字符 / BOM
 *
 * 两个调用方共用这一份规则：
 *   · _tools/fetch-skillmd.mjs  抓到 README 后直接调用
 *   · 离线补洗脚本              对仓库里已提交的 skillmd.js 快照重跑一遍
 * 只作用于 README 型摘要；真 SKILL.md 是源码，绝不经过这里。
 */

export const MAX_BYTES = 2 * 1024;

const ADMONITION = /^\s*!?\[?!\s*(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\s*\]?\s*$/i;
const LANG_LABEL = /^\s*(languages?|select language|语言|其他语言|切换语言)\s*[:：]?\s*$/i;
const LANG_NAME = /^(english|中文|简体中文|繁体中文|繁體中文|普通话|粤語|粤语|日本語|日本语|한국어|русский|русский язык|español|français|deutsch|português(\s*\(brasil\))?|portuguese|italiano|türkçe|tiếng việt|polski|polish|nederlands|العربية|हिन्दी|ไทย|ภาษาไทย)$/i;
const ENTITIES = {
  nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '‹', gt: '›',
  hellip: '…', mdash: '—', ndash: '–', bull: '·', middot: '·',
  laquo: '«', raquo: '»', copy: '©', reg: '®', trade: '™'
};

function decodeEntities(s) {
  return s
    .replace(/&(nbsp|#0*160|#xA0);/gi, ' ')
    .replace(/&([a-z]+);/gi, (m, n) => Object.prototype.hasOwnProperty.call(ENTITIES, n.toLowerCase()) ? ENTITIES[n.toLowerCase()] : '')
    .replace(/&#x([0-9a-f]+);/gi, (m, n) => safeCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (m, n) => safeCodePoint(Number(n)));
}

function safeCodePoint(n) {
  if (!Number.isFinite(n) || n < 32 || n > 0x10ffff) return '';
  try { return String.fromCodePoint(n); } catch (e) { return ''; }
}

/** 把已经剥过标记的纯文本摘要再抛光一遍。输入空串返回空串。 */
export function polishReadme(text) {
  if (!text) return '';
  const out = [];

  for (const raw of String(text).split('\n')) {
    let l = decodeEntities(raw)
      .replace(/[\u200B-\u200F\uFEFF\u00AD]/g, '')
      .trim();
    if (!l) continue;
    if (ADMONITION.test(l)) continue;                 // !IMPORTANT / [!NOTE]
    if (LANG_LABEL.test(l)) continue;                // Language:

    // 跨行 HTML 标签残留：cleanReadme 只能剥掉单行完整的 <...>，
    // 像 <a href="…" 换行写 alt="…" 的徽章块会逐行漏出来，这里按属性特征补掉。
    if (/^<[a-z][^>]*$/i.test(l)) continue;
    if (/^(alt|src|width|height|align|title|style|class|loading)\s*=\s*["']?/i.test(l)) continue;
    if (/^["'][^"']*["']\s*\/?>$/.test(l) || /^\s*\/?>\s*$/.test(l)) continue;

    // 语言切换栏：① 整行一个语言名（常见写法 "English |"、"简体中文 ·"）
    //             ② 一行多段、绝大多数段是语言名
    const bare = l.replace(/^[\s|·]+/, '').replace(/[\s|·]+$/, '').trim();
    if (LANG_NAME.test(bare)) continue;
    const segs = l.split(/\s*[|·]\s*/).map((x) => x.trim()).filter(Boolean);
    if (segs.length >= 2 && segs.every((x) => LANG_NAME.test(x))) continue;
    if (segs.length >= 3 && segs.filter((x) => LANG_NAME.test(x)).length >= Math.ceil(segs.length * 0.6)) continue;

    l = l.replace(/^#{1,6}\s+/, '').trim();           // 剥引用符之后才露出来的井号

    // Markdown 表格行 → 用间隔号串起来；分隔行直接丢
    if (/^\|[\s\S]*\|$/.test(l) && (l.match(/\|/g) || []).length >= 3) {
      const cells = l.replace(/^\s*\|/, '').replace(/\|\s*$/, '')
        .split('|').map((x) => x.trim()).filter(Boolean);
      if (!cells.length || cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
      l = cells.join(' · ');
    } else if (l.includes('|') && /^[\s:|\-]+$/.test(l)) {
      continue;                                      // |---|---|
    }

    // 保留 cleanReadme 生成的行首 «· » 列表符号，只清掉 TOC 目录项粘在行尾的孤立分隔符
    l = l.replace(/\s{2,}/g, ' ').replace(/^[\s|]+/, '').replace(/[\s·|]+$/, '').trim();
    if (l.length < 2) continue;
    if (out.length && out[out.length - 1] === l) continue;
    out.push(l);
  }

  let t = out.join('\n');
  if (Buffer.byteLength(t, 'utf8') > MAX_BYTES) {
    t = Buffer.from(t, 'utf8').subarray(0, MAX_BYTES).toString('utf8').replace(/\n[^\n]*$/, '');
  }
  return t ? t.trimEnd() + '\n' : '';
}
