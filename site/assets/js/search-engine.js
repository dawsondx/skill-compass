/* Skill 指北 · 零依赖混合搜索引擎
   浏览器：window.SkillSearch
   评测器：_tools/eval-search.mjs 用 node:vm 加载同一份实现

   四层能力：
     1. 文本归一化（全半角、大小写、盘古之白压缩：「去 AI 味」≡「去AI味」）
     2. 原生 Intl.Segmenter 中文分词 + 原子概念提取 + 极性保护（不把「去AI味」拆成孤立的「AI」）
     3. 消费离线语义索引（JTBD 意图、别名/拼音、SKILL.md 提纯词、受控概念簇）+ 英文编辑距离容错
     4. 多字段加权评分 + 覆盖率分层 + 质量微调（相关性主导，热度只做 tie-breaker） */
(function (g) {
  'use strict';

  var zhSegmenter = (typeof Intl !== 'undefined' && Intl.Segmenter)
    ? new Intl.Segmenter('zh-CN', { granularity: 'word' })
    : null;

  function escHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function escRe(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* 归一化：全角转半角 + 小写 + 压缩中英/数字间的盘古之白 */
  function normCompact(str) {
    if (!str) return '';
    var s = String(str).toLowerCase();
    s = s.replace(/\u3000/g, ' ').replace(/[\uFF01-\uFF5E]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
    });
    s = s.replace(/([\u4e00-\u9fff])\s+([a-z0-9])/g, '$1$2');
    s = s.replace(/([a-z0-9])\s+([\u4e00-\u9fff])/g, '$1$2');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
  }

  /* ASCII 词边界匹配：防 ui 误匹配 build、pm 误匹配 npm、md 误匹配 cmd */
  function isAsciiWord(t) {
    return /^[a-z0-9._-]+$/.test(t);
  }

  function containsTerm(hay, term) {
    if (!hay || !term) return false;
    var idx = hay.indexOf(term);
    if (idx < 0) return false;
    if (term.length <= 2 && isAsciiWord(term)) {
      var re = new RegExp('(^|[^a-z0-9])' + escRe(term) + '([^a-z0-9]|$)');
      return re.test(hay);
    }
    return true;
  }

  function isWholeWordHit(hay, term) {
    if (!hay || !term) return false;
    if (hay === term) return true;
    if (isAsciiWord(term)) {
      return new RegExp('(^|[^a-z0-9])' + escRe(term) + '([^a-z0-9]|$)').test(hay);
    }
    return false;
  }

  /* Damerau-Levenshtein 距离 ≤ 1 快速判定（仅针对英文拼写容错，O(n) 极速） */
  function editDistLe1(a, b) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    if (a === b) return true;
    var i = 0, j = 0, diff = 0;
    while (i < la && j < lb) {
      if (a[i] === b[j]) { i++; j++; continue; }
      diff++;
      if (diff > 1) return false;
      // 相邻两字符换位（如 markitdwon vs markitdown）
      if (la === lb && i + 1 < la && a[i] === b[j + 1] && a[i + 1] === b[j]) {
        i += 2; j += 2;
      } else if (la > lb) {
        i++;
      } else if (lb > la) {
        j++;
      } else {
        i++; j++;
      }
    }
    if (i < la || j < lb) diff++;
    return diff <= 1;
  }

  /* 中文友好分词（优先浏览器原生 Intl.Segmenter，老环境自动降级） */
  function segmentWords(text) {
    if (!text) return [];
    var out = [];
    if (zhSegmenter) {
      var segs = zhSegmenter.segment(text);
      var iter = segs[Symbol.iterator]();
      for (var step = iter.next(); !step.done; step = iter.next()) {
        var seg = step.value;
        if (!seg.isWordLike) continue;
        var w = seg.segment.trim();
        if (w) out.push(w);
      }
      return out;
    }
    var m = text.match(/[\u4e00-\u9fff]+|[a-z0-9._-]+/g);
    if (!m) return [];
    for (var i = 0; i < m.length; i++) {
      var tok = m[i];
      if (/^[\u4e00-\u9fff]+$/.test(tok) && tok.length > 3) {
        for (var k = 0; k < tok.length - 1; k++) out.push(tok.slice(k, k + 2));
      } else {
        out.push(tok);
      }
    }
    return out;
  }

  /* 把查询词转为「容忍中英盘古之白」的高亮正则，让搜「去AI味」也能精准高亮原文「去 AI 味」 */
  function buildHighlightRegex(terms) {
    if (!terms || !terms.length) return null;
    var uniq = [];
    var seen = {};
    for (var i = 0; i < terms.length; i++) {
      var t = normCompact(terms[i]);
      if (!t || seen[t]) continue;
      if (t.length === 1 && !/[\u4e00-\u9fff]/.test(t)) continue;
      seen[t] = 1;
      uniq.push(t);
    }
    if (!uniq.length) return null;
    uniq.sort(function (a, b) { return b.length - a.length; });
    var parts = uniq.slice(0, 12).map(function (t) {
      // 在汉字与字母数字的交界处插入可选空格 \s*
      var pat = '';
      for (var j = 0; j < t.length; j++) {
        var ch = t[j];
        var prev = j > 0 ? t[j - 1] : '';
        if (prev) {
          var prevZh = /[\u4e00-\u9fff]/.test(prev);
          var curZh = /[\u4e00-\u9fff]/.test(ch);
          var prevAlnum = /[a-z0-9]/.test(prev);
          var curAlnum = /[a-z0-9]/.test(ch);
          if ((prevZh && curAlnum) || (prevAlnum && curZh)) pat += '\\s*';
        }
        pat += escRe(ch);
      }
      return pat;
    });
    try {
      return new RegExp('(' + parts.join('|') + ')', 'gi');
    } catch (e) {
      return null;
    }
  }

  function highlightHTML(text, terms) {
    var raw = String(text == null ? '' : text);
    var re = buildHighlightRegex(terms);
    if (!re) return escHTML(raw);
    var out = '';
    var last = 0;
    re.lastIndex = 0;
    var m;
    while ((m = re.exec(raw)) !== null) {
      if (!m[0]) { re.lastIndex++; continue; }
      if (m.index > last) out += escHTML(raw.slice(last, m.index));
      out += '<mark class="hl">' + escHTML(m[0]) + '</mark>';
      last = m.index + m[0].length;
    }
    if (last < raw.length) out += escHTML(raw.slice(last));
    return out;
  }

  /* ---------- 创建搜索引擎实例 ---------- */
  function createEngine(skills, opts) {
    opts = opts || {};
    var cats = opts.cats || [];
    var index = opts.searchIndex || null;
    var pulse = opts.pulse || null;

    var catMap = {};
    cats.forEach(function (c) { catMap[c.key] = c; });

    var pulseMap = {};
    if (pulse && pulse.items) {
      pulse.items.forEach(function (it) { pulseMap[it.id] = it.week || 0; });
    }

    // 停用词表
    var stopMap = {};
    var stopList = (index && index.stopwords) ? index.stopwords : [
      '帮我', '帮忙', '怎么', '如何', '可以', '想要', '一个', '工具', '技能', '用来', '做', '写', '画', '用', '把', '给', '让', '的', '了', '和'
    ];
    stopList.forEach(function (w) { stopMap[normCompact(w)] = 1; });

    // 概念表与词 → 概念反向索引
    var conceptById = {};
    var termToConcepts = {};
    var atomicPhrases = [];       // 按长度降序扫描，用于原子词切分与极性保护

    var rawConcepts = (index && index.concepts) ? index.concepts : [];
    rawConcepts.forEach(function (c) {
      var obj = {
        id: c.id,
        label: c.l || c.label || c.id,
        atomic: !!(c.at || c.atomic),
        polarity: !!(c.p || c.polarity),
        terms: (c.t || c.terms || []).map(normCompact).filter(Boolean),
        related: (c.r || c.related || []).map(normCompact).filter(Boolean)
      };
      conceptById[obj.id] = obj;
      obj.terms.forEach(function (t) {
        (termToConcepts[t] = termToConcepts[t] || []).push(obj);
        // 极性短语、多字复合短语（含中英混排或 >=3 字）加入原子优先识别列表
        if (obj.atomic || obj.polarity || (/[\u4e00-\u9fff]/.test(t) && /[a-z0-9]/.test(t)) || t.length >= 3) {
          atomicPhrases.push({ term: t, concept: obj });
        }
      });
    });

    // 去重并按长度降序，保证「中文去ai味」优先于「去ai味」优先于「ai」
    var seenPhrase = {};
    atomicPhrases = atomicPhrases
      .sort(function (a, b) { return b.term.length - a.term.length; })
      .filter(function (x) {
        if (seenPhrase[x.term]) return false;
        seenPhrase[x.term] = 1;
        return true;
      });

    var docsIdx = (index && index.docs) ? index.docs : {};

    // 预编译所有 320 条文档结构（仅在初始化跑一次，< 3ms）
    var compiled = skills.map(function (s) {
      var d = docsIdx[s.id] || {};
      var catObj = catMap[s.cat] || {};
      var repoParts = String(s.repo || '').split('/');
      var repoLeaf = repoParts[1] || '';
      var tagsN = (s.tags || []).map(normCompact).filter(Boolean);
      var intentsRaw = d.i || [];
      var intentsN = intentsRaw.map(normCompact).filter(Boolean);
      var aliasesN = (d.a || []).map(normCompact).filter(Boolean);
      var bodyN = (d.b || []).map(normCompact).filter(Boolean);
      var conceptsMap = {};
      (d.c || []).forEach(function (cid) { conceptsMap[cid] = 1; });

      var subsN = (s.subs || []).map(function (x) {
        return {
          rawName: x.name,
          text: normCompact(x.name + ' ' + x.one + ' ' + x.dir + ' ' + ((catMap[x.cat] || {}).name || ''))
        };
      });

      var nameN = normCompact(s.name);
      var idN = normCompact(s.id);
      var repoN = normCompact(s.repo);
      var repoLeafN = normCompact(repoLeaf);
      var descN = normCompact(s.desc);
      var authorN = normCompact((s.author ? s.author.name + ' ' + s.author.owner : '') + ' ' + (s.owner || ''));
      // 只索引分类名，不把分类总览 desc 复制到该类所有 skill 上，避免「去AI味」拉进整个写作类
      var catN = normCompact(catObj.name || s.cat || '');

      // 提取可容错匹配的英文实词（长度 >= 4）
      var asciiSet = {};
      var asciiSrc = nameN + ' ' + idN + ' ' + repoN + ' ' + tagsN.join(' ') + ' ' + aliasesN.join(' ');
      var asciiMatches = asciiSrc.match(/[a-z0-9]{4,}/g) || [];
      asciiMatches.forEach(function (w) { asciiSet[w] = 1; });

      // 质量微调分（同相关性梯队内让高星 / 有图 / 高安装热度的主力工具自然排前）
      var stars = s.stars || 0;
      var pw = pulseMap[s.id] || 0;
      var qualityTie = Math.log10(stars + 10) * 3.4 + (s.img ? 2.5 : 0) + (pw > 0 ? Math.min(4.0, Math.log10(pw + 1) * 1.2) : 0);

      return {
        skill: s,
        id: s.id,
        nameN: nameN,
        idN: idN,
        repoN: repoN,
        repoLeafN: repoLeafN,
        descN: descN,
        authorN: authorN,
        catN: catN,
        tagsN: tagsN,
        tagsJoined: tagsN.join(' '),
        intentsRaw: intentsRaw,
        intentsN: intentsN,
        intentsJoined: intentsN.join(' '),
        aliasesN: aliasesN,
        bodyN: bodyN,
        bodyJoined: bodyN.join(' '),
        subsN: subsN,
        conceptsMap: conceptsMap,
        asciiTokens: Object.keys(asciiSet),
        qualityTie: qualityTie
      };
    });

    /* ---------- 解析用户查询为语义槽（Slots） ---------- */
    function parseQuery(rawQuery) {
      var rawNorm = normCompact(rawQuery);
      if (!rawNorm) return { rawNorm: '', slots: [], hasPolarity: false, highlightTerms: [] };

      var remaining = rawNorm;
      var slots = [];
      var slotSeen = {};

      function pushSlot(term, concepts, isAtomic, isPolarity) {
        if (!term || slotSeen[term]) return;
        slotSeen[term] = 1;
        var cList = concepts || termToConcepts[term] || [];
        var cIds = {};
        var related = [];
        cList.forEach(function (c) {
          cIds[c.id] = c;
          if (c.related) c.related.forEach(function (r) { related.push(r); });
        });
        slots.push({
          term: term,
          concepts: Object.keys(cIds).map(function (k) { return cIds[k]; }),
          related: related,
          isAtomic: !!isAtomic,
          isPolarity: !!isPolarity
        });
      }

      // 1. 先抽原子短语与极性短语（按长度优先）
      for (var i = 0; i < atomicPhrases.length; i++) {
        var ap = atomicPhrases[i];
        var t = ap.term;
        if (!containsTerm(remaining, t)) continue;
        // 避免把纯英文词的一部分切坏（如搜索「slides」时不能错切「slide」）
        if (isAsciiWord(t) && !isWholeWordHit(remaining, t)) continue;
        pushSlot(t, termToConcepts[t] || [ap.concept], true, ap.concept.polarity);
        // 把已抽走的短语替换为空格，防止再被拆成「ai」等碎片
        var cutRe = isAsciiWord(t)
          ? new RegExp('(^|[^a-z0-9])' + escRe(t) + '(?=[^a-z0-9]|$)', 'g')
          : new RegExp(escRe(t), 'g');
        remaining = remaining.replace(cutRe, '$1 ').replace(/\s+/g, ' ').trim();
      }

      // 2. 对剩余文本做中文分词 + 英文切词
      if (remaining) {
        // 先按空格拆，再对每段跑分词
        var parts = remaining.split(/\s+/).filter(Boolean);
        var rawTokens = [];
        parts.forEach(function (p) {
          // 如果整体就是一个概念词或非停用短词，保留
          if (termToConcepts[p]) {
            rawTokens.push(p);
            return;
          }
          var segs = segmentWords(p);
          segs.forEach(function (w) { rawTokens.push(w); });
        });

        // 过滤停用词
        var kept = rawTokens.filter(function (w) {
          if (!w) return false;
          if (stopMap[w]) return false;
          // 单英文字母一般无检索意义（除非是 x，如 X 运营）
          if (w.length === 1 && /[a-z0-9]/.test(w) && w !== 'x') return false;
          return true;
        });

        kept.forEach(function (w) {
          var cs = termToConcepts[w] || [];
          var isPol = cs.some(function (c) { return c.polarity; });
          pushSlot(w, cs, false, isPol);
        });
      }

      // 3. 兜底：如果全被停用词吃空了（如用户专门搜「skill」或「agent」），恢复原词
      if (!slots.length) {
        rawNorm.split(/\s+/).filter(Boolean).forEach(function (w) {
          pushSlot(w, termToConcepts[w] || [], false, false);
        });
      }

      var hasPolarity = slots.some(function (sl) { return sl.isPolarity; });
      var highlightTerms = [rawNorm];
      slots.forEach(function (sl) { highlightTerms.push(sl.term); });

      return {
        rawNorm: rawNorm,
        slots: slots,
        hasPolarity: hasPolarity,
        highlightTerms: highlightTerms
      };
    }

    /* ---------- 单槽对单文档打分 ---------- */
    function scoreSlot(doc, slot) {
      var t = slot.term;
      var best = 0;
      var reason = '';
      var reasonLabel = '';
      var matchedSub = '';
      var isDirect = false;

      // 1. 名称 / ID / 仓库名
      if (doc.nameN === t || doc.idN === t || doc.repoLeafN === t || isWholeWordHit(doc.nameN, t)) {
        best = Math.max(best, 122);
        reason = 'name';
        isDirect = true;
      } else if (containsTerm(doc.nameN, t) || containsTerm(doc.idN, t) || containsTerm(doc.repoN, t)) {
        best = Math.max(best, 112);
        reason = 'name';
        isDirect = true;
      }

      // 2. 标签精确 / 子串
      for (var i = 0; i < doc.tagsN.length; i++) {
        var tg = doc.tagsN[i];
        if (tg === t) {
          if (120 > best) { best = 120; reason = 'tag'; }
          isDirect = true;
          break;
        }
        if (containsTerm(tg, t)) {
          if (106 > best) { best = 106; reason = 'tag'; }
          isDirect = true;
        }
      }

      // 3. 离线 JTBD 意图短语（P1 核心增益）
      for (var j = 0; j < doc.intentsN.length; j++) {
        var itn = doc.intentsN[j];
        if (itn === t) {
          if (118 > best) { best = 118; reason = 'intent'; reasonLabel = doc.intentsRaw[j]; }
          isDirect = true;
          break;
        }
        if (containsTerm(itn, t)) {
          if (102 > best) { best = 102; reason = 'intent'; reasonLabel = doc.intentsRaw[j]; }
          isDirect = true;
        }
      }

      // 4. 创作者
      if (doc.authorN && (isWholeWordHit(doc.authorN, t) || (t.length >= 2 && containsTerm(doc.authorN, t)))) {
        if (114 > best) { best = 114; reason = 'author'; }
        isDirect = true;
      }

      // 5. 别名 / 缩写 / 拼音
      for (var k = 0; k < doc.aliasesN.length; k++) {
        var al = doc.aliasesN[k];
        if (al === t) {
          if (100 > best) { best = 100; reason = 'alias'; reasonLabel = al; }
          isDirect = true;
          break;
        }
        if (t.length >= 3 && (al.indexOf(t) === 0 || containsTerm(al, t))) {
          if (82 > best) { best = 82; reason = 'alias'; reasonLabel = al; }
          isDirect = true;
        }
      }

      // 6. 简介正文
      if (containsTerm(doc.descN, t)) {
        if (70 > best) { best = 70; reason = 'desc'; }
        isDirect = true;
      }

      // 7. 合集子条目
      for (var m = 0; m < doc.subsN.length; m++) {
        if (containsTerm(doc.subsN[m].text, t)) {
          if (86 > best) { best = 86; reason = 'sub'; matchedSub = doc.subsN[m].rawName; }
          isDirect = true;
          break;
        }
      }

      // 8. 概念簇语义命中（受控词表同义扩展）
      if (slot.concepts.length) {
        for (var ci = 0; ci < slot.concepts.length; ci++) {
          var c = slot.concepts[ci];
          if (doc.conceptsMap[c.id]) {
            // 如果文档在 name/tags/intents 里命中了该概念的强核心词，分数更高
            var coreHit = c.terms.some(function (ct) {
              return containsTerm(doc.nameN, ct) || containsTerm(doc.tagsJoined, ct) || containsTerm(doc.intentsJoined, ct);
            });
            var cScore = coreHit ? 104 : 84;
            if (cScore > best) {
              best = cScore;
              reason = 'concept';
              reasonLabel = c.label;
            }
          }
        }
      }

      // 9. 分类名与分类描述
      if (t.length >= 2 && containsTerm(doc.catN, t)) {
        if (44 > best) { best = 44; reason = 'cat'; }
      }

      // 10. SKILL.md / README 提纯关键词（低权重补召回，防正文噪音喧宾夺主）
      if (!slot.isPolarity && best < 42 && doc.bodyN.length) {
        for (var bi = 0; bi < doc.bodyN.length; bi++) {
          if (doc.bodyN[bi] === t || (t.length >= 3 && containsTerm(doc.bodyN[bi], t))) {
            if (40 > best) { best = 40; reason = 'body'; reasonLabel = doc.bodyN[bi]; }
            break;
          }
        }
      }

      // 11. 概念关联延伸（如「去AI味」延伸到文风复刻/风格蒸馏，自然落到第三梯队）
      if (best === 0 && slot.related.length) {
        for (var ri = 0; ri < slot.related.length; ri++) {
          var rel = slot.related[ri];
          if (containsTerm(doc.tagsJoined, rel) || containsTerm(doc.intentsJoined, rel)) {
            best = 34;
            reason = 'related';
            reasonLabel = rel;
            break;
          }
        }
      }

      // 12. 英文拼写容错（编辑距离 <= 1，如 humnizer -> humanizer）
      if (best === 0 && isAsciiWord(t) && t.length >= 5) {
        for (var ai = 0; ai < doc.asciiTokens.length; ai++) {
          if (editDistLe1(t, doc.asciiTokens[ai])) {
            best = 62;
            reason = 'fuzzy';
            reasonLabel = doc.asciiTokens[ai];
            break;
          }
        }
      }

      return {
        score: best,
        reason: reason,
        reasonLabel: reasonLabel,
        matchedSub: matchedSub,
        isDirect: isDirect
      };
    }

    /* ---------- 执行搜索 ---------- */
    function search(rawQuery, filterFn) {
      var parsed = parseQuery(rawQuery);
      var slots = parsed.slots;
      var rawNorm = parsed.rawNorm;
      if (!slots.length) {
        return { query: parsed, items: [], exactTierCount: 0, totalBeforeFilter: 0 };
      }

      var totalSlots = slots.length;
      var scoredAll = [];

      for (var i = 0; i < compiled.length; i++) {
        var doc = compiled[i];
        var matched = 0;
        var sumScore = 0;
        var missedPolarity = false;
        var primaryReason = '';
        var primaryLabel = '';
        var bestSlotScore = 0;
        var matchedSub = '';
        var anyDirectInVisible = false;

        for (var j = 0; j < totalSlots; j++) {
          var sl = slots[j];
          var r = scoreSlot(doc, sl);
          if (r.score > 0) {
            matched++;
            sumScore += r.score;
            if (r.score > bestSlotScore) {
              bestSlotScore = r.score;
              primaryReason = r.reason;
              primaryLabel = r.reasonLabel;
            }
            if (r.matchedSub && !matchedSub) matchedSub = r.matchedSub;
            if (r.reason === 'name' || r.reason === 'tag' || r.reason === 'desc' || r.reason === 'author') {
              anyDirectInVisible = true;
            }
          } else if (sl.isPolarity) {
            missedPolarity = true;
            break;
          }
        }

        if (missedPolarity || matched === 0) continue;

        // 多词部分匹配门槛：至少覆盖一半槽位且得分够硬，避免无关弱匹配凑数
        var isFull = matched === totalSlots;
        if (!isFull) {
          if (totalSlots === 1) continue;
          if (matched / totalSlots < 0.5 || sumScore < 65) continue;
        }

        // 完整有效短语直击加成（仅多词查询或无停用词损耗的精确短语触发，避免「做PPT」因正文巧含「做PPT」而扭曲排序）
        var phraseBonus = 0;
        var effPhrase = totalSlots >= 2 ? slots.map(function (sl) { return sl.term; }).join('') : '';
        if (effPhrase.length >= 3) {
          if (containsTerm(doc.nameN, effPhrase)) phraseBonus = 52;
          else if (containsTerm(doc.tagsJoined, effPhrase)) phraseBonus = 42;
          else if (containsTerm(doc.intentsJoined, effPhrase)) phraseBonus = 34;
          else if (containsTerm(doc.descN, effPhrase)) phraseBonus = 22;
        } else if (totalSlots === 1 && rawNorm === slots[0].term && rawNorm.length >= 2) {
          if (containsTerm(doc.nameN, rawNorm)) phraseBonus = 18;
          else if (containsTerm(doc.tagsJoined, rawNorm)) phraseBonus = 14;
        }

        // 区分核心直击 vs 延伸相关（例如「去AI味」时 T1 文字去味 > T2 视觉反味 > T3 文风定制）
        var tier = isFull ? (bestSlotScore >= 55 ? 2 : 1) : 1;
        var totalScore = (tier === 2 ? 1000 : 0) + (matched / totalSlots) * 200 + sumScore + phraseBonus + doc.qualityTie;

        // 生成简洁可读的「为什么命中」微提示（仅当卡片可见文字里没有字面命中时显示，保持页面清爽）
        var badge = '';
        if (matchedSub) {
          badge = '含子技能 · ' + matchedSub;
        } else if (!anyDirectInVisible) {
          if (primaryReason === 'intent' && primaryLabel) badge = '匹配场景 · ' + primaryLabel;
          else if (primaryReason === 'concept' && primaryLabel) badge = '同义场景 · ' + primaryLabel;
          else if (primaryReason === 'fuzzy' && primaryLabel) badge = '近似拼写 · ' + primaryLabel;
          else if (primaryReason === 'body' && primaryLabel) badge = 'SKILL.md · ' + primaryLabel;
          else if (primaryReason === 'related' && primaryLabel) badge = '相关延伸 · ' + primaryLabel;
          else if (primaryReason === 'alias' && primaryLabel) badge = '别名 · ' + primaryLabel;
        }

        scoredAll.push({
          skill: doc.skill,
          score: totalScore,
          tier: tier,
          matchedSlots: matched,
          totalSlots: totalSlots,
          reason: primaryReason,
          badge: badge
        });
      }

      scoredAll.sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return (b.skill.stars || 0) - (a.skill.stars || 0);
      });

      var totalBeforeFilter = scoredAll.length;
      var filtered = filterFn ? scoredAll.filter(function (x) { return filterFn(x.skill); }) : scoredAll;
      var exactTierCount = filtered.filter(function (x) { return x.tier === 2; }).length;

      return {
        query: parsed,
        items: filtered,
        exactTierCount: exactTierCount,
        totalBeforeFilter: totalBeforeFilter
      };
    }

    /* 离线预计算的 Top-K 语义相似 Skill（供抽屉「同类替代」直接消费） */
    function similarIdsOf(id) {
      var d = docsIdx[id];
      return (d && Array.isArray(d.s)) ? d.s : null;
    }

    return {
      search: search,
      parseQuery: parseQuery,
      similarIdsOf: similarIdsOf,
      hotQueries: (index && index.hotQueries) ? index.hotQueries : []
    };
  }

  g.SkillSearch = {
    normCompact: normCompact,
    highlightHTML: highlightHTML,
    createEngine: createEngine
  };
})(typeof window !== 'undefined' ? window : globalThis);
