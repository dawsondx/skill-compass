/* 卡片 HTML 模板 —— 前端与构建脚本共用同一份实现
   浏览器：window.CardTemplate
   构建期：_tools/prerender.mjs 用 node:vm 加载本文件，生成首屏静态卡片
   改卡片结构只改这里，预渲染产物会自动跟上，不会出现「静态卡片和 JS 渲染长得不一样」 */
(function (g) {
  'use strict';

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function dayNum(str) {                       // 'YYYY-MM-DD' → 可比较的整数
    if (!str) return 0;
    var p = String(str).slice(0, 10).split('-');
    return (+p[0]) * 10000 + (+p[1]) * 100 + (+p[2]);
  }

  function daysSince(str, now) {               // 距今多少天（按本地日历日算，不看时分）
    if (!str) return null;
    var p = String(str).slice(0, 10).split('-');
    var d = new Date(+p[0], (+p[1]) - 1, +p[2]);
    var t = now || new Date();
    var today = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    return Math.round((today - d) / 86400000);
  }

  function fmtAgo(n) {
    if (n == null) return '';
    if (n <= 0) return '今天';
    if (n === 1) return '昨天';
    if (n < 30) return n + ' 天前';
    if (n < 60) return '1 个月前';
    if (n < 365) return Math.round(n / 30) + ' 个月前';
    return Math.round(n / 365) + ' 年前';
  }

  function freshOf(s) {                        // hot:30 天内 / warm:90 天内 / cold:更久
    if (s.days == null) return '';
    if (s.days <= 30) return 'hot';
    if (s.days <= 90) return 'warm';
    return 'cold';
  }

  function fmtNum(n) {
    if (n == null) return '—';
    if (n >= 10000) return (n / 1000).toFixed(n >= 100000 ? 0 : 1).replace('.0', '') + 'k';
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return String(n);
  }

  function glyphOf(s) {
    var n = s.name.replace(/[（(\[].*?[）)\]]/g, '').trim();
    if (/^[A-Za-z]/.test(n)) return n.slice(0, 1).toUpperCase();
    return n.slice(0, 1);
  }

  /* 安装命令：合集里的子 skill 要带 --skill，否则会装整个仓库 */
  function installCmd(s) {
    if (!s) return '';
    return 'npx skills add ' + s.repo + (s.skill ? ' --skill ' + s.skill : '');
  }

  /* ---------------- 无图封面：按分类做「假界面画布」 ----------------
     思路来自样板页：不画抽象图形，而是把这类 skill 的产出物做成一张微型版式
     （色板/幻灯片/播放器/终端/文件树…），并塞进这条 skill 自己的真实字段。
     所有颜色走 CSS 变量，深色主题自动跟着换。 */
  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function starText(n) {
    if (!n) return '—';
    return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k' : String(n);
  }

  var COVER_RAW = {
    design: function (s, h) {
      var sw = ['var(--cc)', 'currentColor', 'color-mix(in srgb, var(--cc) 42%, var(--line))', 'var(--teal)'];
      var r = h % 4;
      sw = sw.slice(r).concat(sw.slice(0, r));
      return '<div class="cv-sw">' + sw.map(function (c, i) {
        return '<i style="background:' + c + ';opacity:' + (1 - i * 0.1) + '"></i>';
      }).join('') + '</div>' +
        '<div class="cv-type"><b>Aa</b><span>' + esc(s.tags[0] || 'Type') + '</span></div>' +
        '<div class="cv-bar"><i style="width:' + (46 + h % 22) + '%"></i></div>' +
        '<div class="cv-bar thin"><i style="width:' + (72 - h % 18) + '%"></i></div>';
    },
    slides: function (s, h) {
      var n = 1 + h % 9;
      return '<div class="cv-slide">' +
        '<b>' + esc(s.tags[0] || s.name) + '</b>' +
        '<u style="width:' + (74 - h % 16) + '%"></u><u style="width:' + (88 - h % 22) + '%"></u>' +
        '<u style="width:64%"></u><u style="width:78%"></u>' +
        '<div class="cv-slide-f"><span class="chip"></span><s>' + ('0' + n).slice(-2) + ' / 24</s></div></div>';
    },
    diagram: function (s, h) {
      return '<div class="cv-graph">' +
        '<span class="n n1">' + esc((s.tags[0] || '输入').slice(0, 4)) + '</span>' +
        '<span class="n n2">' + esc((s.tags[1] || '节点').slice(0, 4)) + '</span>' +
        '<span class="n n3">' + esc((s.tags[2] || '输出').slice(0, 4)) + '</span>' +
        '<span class="n n4">' + esc((s.tags[1] || '处理').slice(0, 3)) + '</span>' +
        '<i class="l l1"></i><i class="l l2"></i><i class="l l3"></i></div>';
    },
    video: function (s, h) {
      return '<div class="cv-player">' +
        '<span class="rec"><i></i>REC</span>' +
        '<span class="tc">00:' + ('0' + (10 + h % 40)).slice(-2) + ' / 01:20</span>' +
        '<span class="play"></span>' +
        '<div class="track"><i style="width:' + (28 + h % 40) + '%"></i></div>' +
        '<div class="track sub"><i style="width:' + (44 + h % 30) + '%"></i></div>' +
        '<s>' + esc(s.tags[0] || '4K') + ' · ' + esc(s.tags[1] || '9:16') + '</s></div>';
    },
    image: function (s, h) {
      return '<div class="cv-tiles">' +
        [0, 1, 2, 3, 4, 5].map(function (i) {
          var o = 14 + ((h + i * 9) % 6) * 10;
          return '<i style="background:color-mix(in srgb, var(--cc) ' + o + '%, var(--paper-2))"></i>';
        }).join('') + '</div>';
    },
    writing: function (s, h) {
      return '<div class="cv-doc">' +
        '<b>' + esc(s.tags[0] || '正文') + '</b>' +
        '<u style="width:96%"></u><u style="width:' + (88 - h % 16) + '%"></u>' +
        '<u style="width:92%"></u><u style="width:' + (78 + h % 14) + '%"></u>' +
        '<u style="width:88%"></u><u style="width:' + (52 + h % 22) + '%"></u>' +
        '<div class="cv-doc-f"><span>1,240 字</span><span>· 3 稿</span></div></div>';
    },
    knowledge: function (s, h) {
      return '<div class="cv-cards">' +
        '<i class="c1"></i><i class="c2"></i>' +
        '<div class="c3"><b>' + esc((s.tags[0] || '索引').slice(0, 8)) + '</b>' +
        '<u style="width:88%"></u><u style="width:72%"></u><u style="width:80%"></u>' +
        '<div class="chips"><span></span><span></span></div></div></div>';
    },
    intel: function (s, h) {
      return '<div class="cv-feed">' +
        [0, 1, 2, 3].map(function (i) {
          return '<div class="row"><i></i><b style="width:' + (82 - i * 9 - h % 8) + '%"></b><s>' +
            (2 + i * 4) + 'm</s></div>';
        }).join('') + '</div>';
    },
    meta: function (s, h) {
      return '<div class="cv-term">' +
        '<div class="ln"><s>$</s><b>skills</b><u>' + esc((s.tags[0] || 'run').slice(0, 12)) + '</u></div>' +
        '<div class="ln out"><i style="width:' + (66 - h % 14) + '%"></i></div>' +
        '<div class="ln out"><i style="width:' + (42 + h % 22) + '%"></i></div>' +
        '<div class="ln out"><i style="width:' + (54 - h % 12) + '%"></i></div>' +
        '<div class="ln ok">✓ ready <span class="cur"></span></div></div>';
    },
    pack: function (s, h) {
      var n = (s.subs && s.subs.length) || 4;
      return '<div class="cv-tree">' +
        '<b>' + esc(s.repo.split('/').pop()) + '/</b>' +
        '<span>├─ ' + esc((s.tags[0] || 'skill-01')) + '</span>' +
        '<span>├─ ' + esc((s.tags[1] || 'skill-02')) + '</span>' +
        '<span>├─ ' + esc((s.tags[2] || 'skill-03')) + '</span>' +
        '<span class="last">└─ +' + Math.max(1, n - 3) + ' more</span></div>';
    },
    business: function (s, h) {
      return '<div class="cv-kpi">' +
        '<div class="num">' + starText(s.stars) + '<s>★</s></div>' +
        '<div class="bars">' + [0, 1, 2, 3, 4, 5].map(function (i) {
          return '<i style="height:' + (24 + ((h + i * 13) % 58)) + '%"></i>';
        }).join('') + '</div></div>' +
        '<div class="cv-kpi-f"><span>' + esc(s.tags[0] || '留存') + '</span><span>' + esc(s.tags[1] || '转化') + '</span><i>+18%</i></div>';
    }
  };

  var COVER_HEAD = {
    design: ['PALETTE', 'AA+'],
    slides: ['SLIDE', '16:9'],
    diagram: ['DIAGRAM', 'SVG'],
    video: ['TIMELINE', '60FPS'],
    image: ['GALLERY', 'PNG'],
    writing: ['DRAFT', 'A4'],
    knowledge: ['INDEX', '3 CARDS'],
    intel: ['FEED', 'LIVE'],
    meta: ['TERMINAL', 'zsh'],
    pack: ['BUNDLE', 'ZIP'],
    business: ['METRICS', 'Q4']
  };

  function coverHTML(s, c) {
    var key = COVER_RAW[s.cat] ? s.cat : 'meta';
    var h = hash(s.id);
    var head = COVER_HEAD[key] || ['SKILL', 'NEW'];
    return '<div class="cov cv-' + key + '" style="--cc:' + (c && c.color ? c.color : 'var(--accent)') + '">' +
      '<div class="cv-top"><span class="k">' + head[0] + '</span><span class="v">' + head[1] + '</span></div>' +
      '<div class="cv-body">' + COVER_RAW[key](s, h) + '</div>' +
      '<div class="cv-foot">' +
      '<span>' + esc(s.tags[0] || '') + '</span>' +
      (s.tags[1] ? '<span>' + esc(s.tags[1]) + '</span>' : '') +
      '<i>' + (c && c.name ? c.name : s.cat) + '</i></div>' +
      '</div>';
  }

  /* opt: { cat: {name,color}, mark: 'new' | 'upd' | '', fav: bool } */
  function cardHTML(s, opt) {
    opt = opt || {};
    var c = opt.cat || { color: '#888', name: s.cat };
    var mark = opt.mark || '';
    var hasImg = !!s.img;
    var thumb = '<div class="thumb' + (s.fit === 'contain' ? ' fit' : '') + (hasImg ? '' : ' cov-thumb') + '">';
    if (hasImg) {
      // 有真图：先铺一层字母占位，图挂了才显形
      thumb += '<div class="thumb-fallback" style="--c:' + c.color + ';display:none">' +
        '<div class="fb-inner">' +
        '<div class="fb-mark">' + glyphOf(s) + '</div>' +
        '<div class="fb-name">' + s.name + '</div>' +
        '<div class="fb-cat">' + c.name + '</div>' +
        '</div></div>' +
        '<img data-src="assets/img/' + s.img + '" alt="' + s.name + ' 效果演示">';
    } else {
      // 没图：按分类画一张「假界面」，用这条 skill 自己的字段填
      thumb += coverHTML(s, c);
    }
    thumb += '<span class="badge-cat"><span class="dot" style="background:' + c.color + '"></span>' + c.name + '</span>';
    // 右上角：角标 + 收藏。两个都挤在这一条里，收藏按钮才不会盖住「有更新」
    var corner = '';
    if (mark) {
      corner += '<span class="badge-new ' + mark + '">' + (mark === 'new' ? '新增' : '有更新') + '</span>';
    }
    corner += '<button class="card-fav" type="button" data-fav="' + s.id + '" aria-pressed="' +
      (opt.fav ? 'true' : 'false') + '" aria-label="收藏 ' + s.name + '" title="收藏 / 取消收藏">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z"/></svg>' +
      '</button>';
    thumb += '<div class="thumb-tags">' + corner + '</div>';
    // 右下角的一键复制：默认藏着，鼠标上来才浮起（触屏设备常显）
    var cmd = installCmd(s);
    thumb += '<button class="quick-copy" type="button" data-cmd="' + cmd + '" aria-label="复制安装命令：' + cmd + '" title="' + cmd + '">' +
      '<span class="qc-t">$ 一键复制命令</span></button>';
    thumb += '</div>';

    var updHTML = s.days == null ? '' :
      '<span class="upd ' + freshOf(s) + '" title="最近提交 ' + s.upd +
      (s.ver ? ' · 最新版本 ' + s.ver : '') + '">' +
      '<i class="upd-dot"></i>' + fmtAgo(s.days) +
      (s.ver ? '<span class="upd-v">' + s.ver + '</span>' : '') +
      '</span>';

    return '<div class="card" tabindex="0" role="button" data-id="' + s.id + '" aria-label="' + s.name + '，查看详情">' +
      thumb +
      '<div class="card-body">' +
      '<h3 class="card-title">' + s.name + '</h3>' +
      '<div class="card-repo">' +
      (s.author ? '<span class="by" style="color:' + s.author.color + '">' + s.author.name + '</span>' : '') +
      s.repo + (s.skill ? ' / ' + s.skill : '') + '</div>' +
      '<p class="card-desc">' + s.desc + '</p>' +
      '<div class="card-tags">' + s.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>' +
      '<div class="card-foot">' +
      '<span class="star"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>' + fmtNum(s.stars) + '</span>' +
      (s.subs ? '<span class="pack-n">' + s.subs.length + ' 个 skill</span>' : '') +
      (s.from ? '<span class="from-tag">合集内</span>' : '') +
      updHTML +
      '<span class="goto">GitHub <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span>' +
      '</div></div></div>';
  }

  /* 「推荐排序」：分类轮转，让第一屏覆盖不同分类，而不是被几个巨型仓库霸榜
     构建脚本要用同一份逻辑决定首屏预渲染哪 24 张，所以放这里 */
  function recommendOrder(list, catOrder) {
    var byCat = {};
    list.slice().sort(function (a, b) { return (b.stars || 0) - (a.stars || 0); }).forEach(function (s) {
      (byCat[s.cat] = byCat[s.cat] || []).push(s);
    });
    var order = (catOrder || []).filter(function (k) { return byCat[k]; });
    var out = [], i = 0, added = true;
    while (added) {
      added = false;
      for (var j = 0; j < order.length; j++) {
        var arr = byCat[order[j]];
        if (arr[i]) { out.push(arr[i]); added = true; }
      }
      i++;
    }
    return out;
  }

  g.CardTemplate = {
    pad2: pad2,
    dayNum: dayNum,
    daysSince: daysSince,
    fmtAgo: fmtAgo,
    freshOf: freshOf,
    fmtNum: fmtNum,
    glyphOf: glyphOf,
    installCmd: installCmd,
    coverHTML: coverHTML,
    cardHTML: cardHTML,
    recommendOrder: recommendOrder
  };
})(typeof window !== 'undefined' ? window : globalThis);
