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

  /* ---------------- 逐仓插画母题（cover-art.js 里每条指定用哪个） ----------------
     每个母题只解决一类"画面"，具体字句/数值/配色由 cover-art.js 逐仓给定，
     所以同母题的两张卡也不会长一样。 */
  var MOTIFS = {
    rules: function (a) {
      return '<div class="ar-rules">' + (a.rows || []).map(function (r) {
        return '<div class="ar-row' + (r[2] === 'hl' ? ' hl' : '') + '">' +
          '<b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>';
      }).join('') + '</div>';
    },
    browser: function (a) {
      return '<div class="ar-browser">' +
        '<div class="bar"><i></i><i></i><i></i><span>' + esc(a.url || '') + '</span></div>' +
        '<div class="page"><div class="blk w70"></div><div class="blk w45"></div>' +
        '<div class="target"><em>click</em></div><div class="blk w60"></div></div>' +
        '<div class="cursor"></div></div>';
    },
    install: function (a) {
      var pk = a.pkgs || [];
      return '<div class="ar-install">' +
        '<div class="ar-cmd"><s>$</s><b>' + esc(a.t || '') + '</b><u>' + esc(pk[0] || '') + '</u></div>' +
        '<div class="prog"><i style="width:' + (a.pct || 70) + '%"></i></div>' +
        '<div class="ok">✓ ' + pk.length + ' 个 skill 就位</div>' +
        '<div class="list">' + pk.map(function (x) { return '<span>+' + esc(x) + '</span>'; }).join('') + '</div></div>';
    },
    sheet: function (a) {
      var hd = '<div class="hd">' + (a.cols || []).map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div>';
      var rows = (a.rows || []).map(function (r) {
        var cls = r[1] === '已完成' ? 'ok' : 'run';
        return '<div class="tr"><span>' + esc(r[0]) + '</span><i class="' + cls + '">' + esc(r[1]) + '</i>' +
          '<span class="who">' + esc(r[2]) + '</span></div>';
      }).join('');
      return '<div class="ar-sheet">' + hd + rows + '</div>';
    },
    memory: function (a) {
      return '<div class="ar-memory">' + (a.cards || []).map(function (c) {
        return '<div class="mc"><b>' + esc(c[0]) + '</b><s>' + esc(c[1]) + '</s>' +
          '<span>' + esc(c[2]) + '</span></div>';
      }).join('') + '</div>';
    },
    pkg: function (a) {
      return '<div class="ar-pkg"><div class="file">' + esc(a.t || 'skills.json') + '</div>' +
        (a.deps || []).map(function (d) {
          return '<div class="dep"><span>' + esc(d[0]) + '</span><i>' + esc(d[1]) + '</i></div>';
        }).join('') + '</div>';
    },
    flow: function (a) {
      return '<div class="ar-flow">' + (a.steps || []).map(function (st, i) {
        return (i ? '<i class="arr"></i>' : '') +
          '<div class="n"><b>' + esc(st[0]) + '</b><s>' + esc(st[1]) + '</s></div>';
      }).join('') + '</div>';
    },
    tasks: function (a) {
      return '<div class="ar-tasks">' +
        '<div class="pbar"><i style="width:' + (a.pct || 60) + '%"></i><s>' + (a.pct || 60) + '%</s></div>' +
        (a.items || []).map(function (it) {
          return '<div class="t' + (it[1] ? ' done' : '') + '"><i>' + (it[1] ? '✓' : '') + '</i><span>' + esc(it[0]) + '</span></div>';
        }).join('') + '</div>';
    }
  };

  /* ── 母题库（第二批） ──────────────────────────────────────────────
     每个仓库挑一个，同一分类内不重复。母题只负责「长什么样」，
     具体文案全部由 cover-art.js 逐仓提供，所以同一个母题在不同仓库上长得不一样。 */
  var MOTIFS_X = {

    /* 终端会话：一条命令 + 几行输出 */
    terminal: function (a) {
      return '<div class="x-term"><div class="tb"><i></i><i></i><i></i><b>' + esc(a.shell || 'zsh') + '</b></div>' +
        '<div class="tl"><div class="ln c"><s>$</s><b>' + esc(a.cmd || '') + '</b></div>' +
        (a.lines || []).map(function (l) {
          return '<div class="ln ' + (l[1] || '') + '">' + (l[2] ? '<em>' + esc(l[2]) + '</em>' : '') + esc(l[0]) + '</div>';
        }).join('') + '</div></div>';
    },

    /* 提交闸门：一串提交节点卡在一道关前 */
    commit: function (a) {
      var ns = a.nodes || [];
      return '<div class="x-git"><div class="tr">' + ns.map(function (n, i) {
        return '<div class="nd ' + (n[1] || '') + '"><i></i><b>' + esc(n[0]) + '</b></div>' + (i < ns.length - 1 ? '<s></s>' : '');
      }).join('') + '</div>' +
        '<div class="gt"><b>' + esc(a.gate || 'PASS') + '</b><span>' + esc(a.note || '') + '</span></div></div>';
    },

    /* 阶段流水：竖排编号，状态写在右边 */
    pipeline: function (a) {
      return '<div class="x-pipe">' + (a.stages || []).map(function (st, i) {
        return '<div class="st ' + (st[2] || '') + '"><i>' + (i + 1) + '</i><b>' + esc(st[0]) + '</b><em>' + esc(st[1] || '') + '</em></div>';
      }).join('') + '</div>';
    },

    /* 分层解剖：从上往下逐层剥开 */
    layers: function (a) {
      return '<div class="x-lay">' + (a.layers || []).map(function (l) {
        return '<div class="ly"><b>' + esc(l[0]) + '</b><s>' + esc(l[1] || '') + '</s></div>';
      }).join('') + '</div>';
    },

    /* 工具铺：小方块阵列 */
    tiles: function (a) {
      var items = a.items || [];
      return '<div class="x-tiles" style="--n:' + (a.cols || 3) + '">' + items.map(function (t, i) {
        var nm = typeof t === 'string' ? t : t[0];
        var on = typeof t === 'string' ? 0 : t[1];
        return '<div class="tl' + (on ? ' on' : '') + '"><i>' + (i + 1) + '</i><b>' + esc(nm) + '</b></div>';
      }).join('') + '</div>' + (a.more ? '<div class="x-more">' + esc(a.more) + '</div>' : '');
    },

    /* 柱状：把过程量成一条曲线 */
    chart: function (a) {
      var bars = a.bars || [];
      var max = 1;
      bars.forEach(function (b) { if (+b[1] > max) max = +b[1]; });
      return '<div class="x-chart"><div class="cap"><b>' + esc(a.unit || '') + '</b><em>' + esc(a.label || '') + '</em></div>' +
        '<div class="bs">' + bars.map(function (b) {
          return '<div class="b' + (b[2] ? ' ' + b[2] : '') + '"><s>' + esc(String(b[1])) + '</s>' +
            '<i style="height:' + Math.max(8, Math.round(+b[1] / max * 100)) + '%"></i><em>' + esc(b[0]) + '</em></div>';
        }).join('') + '</div></div>';
    },

    /* 减法：两根对比条 */
    meter: function (a) {
      return '<div class="x-meter">' +
        '<div class="mr be"><b>' + esc(a.from) + '</b><s>' + esc(a.l1 || '之前') + '</s><i><u style="width:100%"></u></i></div>' +
        '<div class="mr af"><b>' + esc(a.to) + '</b><s>' + esc(a.l2 || '之后') + '</s><i><u style="width:' + (a.pct || 40) + '%"></u></i></div>' +
        (a.delta ? '<div class="dl">' + esc(a.delta) + '</div>' : '') + '</div>';
    },

    /* 逐项打分清单 */
    checklist: function (a) {
      return '<div class="x-check">' + (a.items || []).map(function (it) {
        var no = it[1] === '×' || it[1] === '✕';
        return '<div class="it' + (no ? ' no' : '') + '"><i>' + (no ? '✕' : '✓') + '</i><span>' + esc(it[0]) + '</span><b>' + esc(it[1]) + '</b></div>';
      }).join('') + '</div>';
    },

    /* 卡片墙：一堆小卡片摊开 */
    wall: function (a) {
      return '<div class="x-wall">' + (a.cards || []).map(function (c) {
        return '<div class="wc"><i></i><b>' + esc(c[0]) + '</b>' + (c[1] ? '<s>' + esc(c[1]) + '</s>' : '') + '</div>';
      }).join('') + '</div>' + (a.more ? '<div class="x-more">' + esc(a.more) + '</div>' : '');
    },

    /* 目录树 */
    tree: function (a) {
      return '<div class="x-tree">' + (a.rows || []).map(function (r) {
        return '<div class="tr" style="padding-left:' + ((r[2] || 0) * 9) + 'px">' +
          '<i class="' + (r[3] || 'f') + '"></i><b>' + esc(r[0]) + '</b>' + (r[1] ? '<s>' + esc(r[1]) + '</s>' : '') + '</div>';
      }).join('') + '</div>';
    },

    /* 前后对照 */
    diff: function (a) {
      return '<div class="x-diff"><div class="cl l"><b>' + esc(a.l || '前') + '</b>' +
        (a.li || []).map(function (x, i) {
          return '<s class="' + (i === (a.lcut == null ? 1 : a.lcut) ? 'cut' : '') + '">' + esc(x) + '</s>';
        }).join('') + '</div><div class="cl r"><b>' + esc(a.r || '后') + '</b>' +
        (a.ri || []).map(function (x) { return '<s>' + esc(x) + '</s>'; }).join('') + '</div></div>';
    },

    /* 论文 / 文献卡 */
    papers: function (a) {
      return '<div class="x-papers">' + (a.items || []).map(function (p, i) {
        return '<div class="pp' + (i === 0 ? ' top' : '') + '"><i>' + pad2(i + 1) + '</i><b>' + esc(p[0]) + '</b>' +
          (p[1] ? '<s>' + esc(p[1]) + '</s>' : '') + '</div>';
      }).join('') + '</div>';
    },

    /* 视觉：一张图 + 识别框 */
    lens: function (a) {
      return '<div class="x-lens"><div class="pic">' + (a.boxes || []).map(function (b) {
        return '<i style="left:' + b[0] + '%;top:' + b[1] + '%;width:' + b[2] + '%;height:' + b[3] + '%"><s>' + esc(b[4] || '') + '</s></i>';
      }).join('') + '</div><div class="ops">' + (a.ops || []).map(function (o) { return '<span>' + esc(o) + '</span>'; }).join('') + '</div></div>';
    },

    /* 上线前逐项检查 */
    deploy: function (a) {
      return '<div class="x-dep"><div class="url"><i></i><b>' + esc(a.url || '') + '</b></div>' +
        (a.checks || []).map(function (c) {
          var ok = c[1] !== '×' && c[1] !== '✕';
          return '<div class="ck"><i class="' + (ok ? 'ok' : 'no') + '">' + (ok ? '✓' : '✕') + '</i><span>' + esc(c[0]) + '</span><b>' + esc(c[1]) + '</b></div>';
        }).join('') + '</div>';
    },

    /* 云资源：中心 + 卫星 */
    cloud: function (a) {
      return '<div class="x-cloud"><div class="hub"><b>' + esc(a.hub || '') + '</b></div><div class="sat">' +
        (a.nodes || []).map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</div></div>';
    },

    /* 桌面应用：侧栏 + 主区 */
    app: function (a) {
      return '<div class="x-app"><div class="bar"><i></i><i></i><i></i><b>' + esc(a.title || '') + '</b></div>' +
        '<div class="bd"><div class="sd">' + (a.side || []).map(function (s, i) {
          return '<span class="' + (i === 0 ? 'on' : '') + '">' + esc(s) + '</span>';
        }).join('') + '</div><div class="mn">' + (a.main || []).map(function (m) {
          return '<div class="rw"><i></i><b>' + esc(m) + '</b></div>';
        }).join('') + '</div></div></div>';
    },

    /* 屏幕热区：点哪哪就能操作 */
    hotspot: function (a) {
      return '<div class="x-hot"><div class="scr">' +
        '<div class="chr"><i></i><i></i><i></i><b>' + esc(a.app || '') + '</b></div>' +
        '<div class="ui"><s></s><s></s><s></s><s></s></div>' +
        (a.spots || []).map(function (p) {
          return '<i style="left:' + p[0] + '%;top:' + p[1] + '%"><s>' + esc(p[2] || '') + '</s></i>';
        }).join('') + '</div><div class="lb">' + esc(a.label || '') + '</div></div>';
    },

    /* 先给答案 */
    answer: function (a) {
      return '<div class="x-ans"><div class="big">' + esc(a.big || '') + '</div><div class="dim">' +
        (a.dim || []).map(function (d) { return '<s>' + esc(d) + '</s>'; }).join('') + '</div></div>';
    },

    /* 16:9 幻灯片 */
    deck: function (a) {
      return '<div class="x-deck"><div class="sl"><div class="hd"><b>' + esc(a.hd || '') + '</b><em>' + esc(a.no || '') + '</em></div>' +
        '<div class="tt">' + esc(a.t || '') + '</div><div class="bs">' + (a.bullets || []).map(function (b) {
          return '<s>' + esc(b) + '</s>';
        }).join('') + '</div></div></div>';
    },

    /* 整页出图的幻灯片 */
    deckimg: function (a) {
      return '<div class="x-dimg"><div class="fr"><div class="cap"><b>' + esc(a.cap || '') + '</b></div>' +
        '<div class="ov">' + (a.lines || []).map(function (l) { return '<s>' + esc(l) + '</s>'; }).join('') + '</div></div></div>';
    },

    /* 缩略图网格 */
    deckgrid: function (a) {
      return '<div class="x-dgrid">' + (a.thumbs || []).map(function (t, i) {
        return '<div class="th' + (i === (a.act || 0) ? ' on' : '') + '">' +
          '<u></u><i></i><i></i><s></s><b>' + esc(t) + '</b></div>';
      }).join('') + '</div>';
    },

    /* 带自评分的幻灯片 */
    slidescore: function (a) {
      return '<div class="x-ss"><div class="sl"><i></i><i></i><i></i></div><div class="sc"><b>' + esc(a.score || '') + '</b>' +
        (a.notes || []).map(function (n) {
          return '<s class="' + (n[1] || '') + '">' + esc(n[0]) + '</s>';
        }).join('') + '</div></div>';
    },

    /* 图片版 → 可编辑分层 */
    decklayers: function (a) {
      return '<div class="x-dlay"><div class="stk">' + (a.layers || []).map(function (l) {
        return '<div class="ly"><b>' + esc(l) + '</b></div>';
      }).join('') + '</div>' + (a.note ? '<div class="bk">' + esc(a.note) + '</div>' : '') + '</div>';
    },

    /* 导出文件 */
    deckexport: function (a) {
      return '<div class="x-dexp"><div class="sl"><i></i><i></i><i></i></div><div class="arw">→</div>' +
        '<div class="fl"><b>' + esc(a.file || 'deck.pptx') + '</b>' + (a.meta ? '<s>' + esc(a.meta) + '</s>' : '') + '</div></div>';
    },

    /* 封面页 */
    deckcover: function (a) {
      return '<div class="x-dcov"><div class="kp">' + esc(a.kp || '') + '</div><div class="tt">' + esc(a.t || '') + '</div>' +
        '<div class="ft">' + (a.ft || []).map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') + '</div></div>';
    },

    /* 竖版 9:16 */
    frame916: function (a) {
      return '<div class="x-916"><div class="ph"><div class="ov"><b>' + esc(a.t || '') + '</b>' +
        (a.sub ? '<s>' + esc(a.sub) + '</s>' : '') + '</div><div class="rg">' + esc(a.rg || '9:16') + '</div></div></div>';
    },

    /* 时间轴：片段 + 刻度 */
    timeline: function (a) {
      return '<div class="x-time"><div class="tr">' + (a.clips || []).map(function (c) {
        return '<i style="flex:' + (c[1] || 1) + '" class="' + (c[2] || '') + '"><s>' + esc(c[0]) + '</s></i>';
      }).join('') + '</div><div class="rl">' + (a.ticks || []).map(function (t) { return '<s>' + esc(t) + '</s>'; }).join('') + '</div></div>';
    },

    /* 分镜条 */
    storyboard: function (a) {
      return '<div class="x-sb">' + (a.shots || []).map(function (s, i) {
        return '<div class="sh"><i>' + (i + 1) + '</i><b>' + esc(s[0]) + '</b>' + (s[1] ? '<s>' + esc(s[1]) + '</s>' : '') + '</div>';
      }).join('') + '</div>';
    },

    /* 地图路线 */
    route: function (a) {
      return '<div class="x-route"><svg viewBox="0 0 120 70" preserveAspectRatio="none">' +
        '<path d="' + (a.d || 'M10 54 C 30 54 26 16 50 16 S 84 46 110 18') + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" stroke-linecap="round"/>' +
        '</svg><i class="p1"></i><i class="p2"></i>' +
        '<div class="st"><b>' + esc(a.from || '') + '</b><em>' + esc(a.to || '') + '</em></div>' +
        (a.dist ? '<div class="ds">' + esc(a.dist) + '</div>' : '') + '</div>';
    },

    /* 大字海报 */
    poster: function (a) {
      return '<div class="x-poster"><div class="big">' + (a.words || []).map(function (w) { return '<s>' + esc(w) + '</s>'; }).join('') +
        '</div>' + (a.sm ? '<div class="sm">' + esc(a.sm) + '</div>' : '') + '</div>';
    },

    /* 图片格 + 色板 */
    gallery: function (a) {
      return '<div class="x-gal"><div class="g" style="--n:' + (a.cols || 2) + '">' + (a.tiles || []).map(function (t, i) {
        return '<i class="t' + i + '"><s>' + esc(t) + '</s></i>';
      }).join('') + '</div>' + (a.pal ? '<div class="pal">' + a.pal.map(function (p) {
        return '<i style="background:' + p + '"></i>';
      }).join('') + '</div>' : '') + '</div>';
    },

    /* 书：封面 + 目录 */
    book: function (a) {
      return '<div class="x-book"><div class="cv"><b>' + esc(a.title || '') + '</b>' + (a.sub ? '<s>' + esc(a.sub) + '</s>' : '') + '</div>' +
        '<div class="toc">' + (a.chs || []).map(function (c, i) {
          return '<div class="ch"><i>' + pad2(i + 1) + '</i><span>' + esc(c) + '</span></div>';
        }).join('') + '</div></div>';
    },

    /* 索引卡 */
    notes: function (a) {
      return '<div class="x-notes">' + (a.cards || []).map(function (c) {
        return '<div class="ic"><b>' + esc(c[0]) + '</b>' + (c[1] ? '<s>' + esc(c[1]) + '</s>' : '') + '</div>';
      }).join('') + '</div>';
    },

    /* 信息流：名次 + 热度条 */
    feed: function (a) {
      return '<div class="x-feed">' + (a.rows || []).map(function (r, i) {
        return '<div class="rw"><i>' + (i + 1) + '</i><b>' + esc(r[0]) + '</b><s style="width:' + (r[1] || 50) + '%"></s>' +
          (r[2] ? '<em>' + esc(r[2]) + '</em>' : '') + '</div>';
      }).join('') + '</div>';
    },

    /* 雷达图 */
    radar: function (a) {
      return '<div class="x-radar"><svg viewBox="0 0 100 100">' +
        '<circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="16"/>' +
        '<line x1="50" y1="6" x2="50" y2="94"/><line x1="6" y1="50" x2="94" y2="50"/>' +
        '<polygon points="' + (typeof a.points === 'string' ? a.points : (a.points || []).join(' ')) + '"/></svg>' +
        '<div class="lb">' + (a.labels || []).map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('') + '</div></div>';
    },

    /* 2×2 矩阵 */
    matrix: function (a) {
      return '<div class="x-mtx"><div class="ay"><b>' + esc(a.y || '') + '</b></div><div class="qd">' +
        (a.quads || []).map(function (q, i) {
          return '<div class="q' + (i === (a.act || 0) ? ' on' : '') + '"><b>' + esc(q[0]) + '</b>' + (q[1] ? '<s>' + esc(q[1]) + '</s>' : '') + '</div>';
        }).join('') + '</div><div class="ax"><b>' + esc(a.x || '') + '</b></div></div>';
    },

    /* 大纲 */
    outline: function (a) {
      return '<div class="x-out">' + (a.rows || []).map(function (r) {
        return '<div class="rw" style="padding-left:' + ((r[2] || 0) * 9) + 'px"><i>' + esc(r[3] || '–') + '</i><b>' + esc(r[0]) + '</b>' +
          (r[1] ? '<s>' + esc(r[1]) + '</s>' : '') + '</div>';
      }).join('') + '</div>';
    },

    /* 文档页 */
    page: function (a) {
      return '<div class="x-page"><div class="hd"><b>' + esc(a.title || '') + '</b><em>' + esc(a.no || '') + '</em></div>' +
        (a.blocks || []).map(function (b) {
          if (b[0] === 'h') return '<div class="hh">' + esc(b[1]) + '</div>';
          if (b[0] === 'q') return '<div class="qq">' + esc(b[1]) + '</div>';
          return '<div class="pp"><s style="width:' + (b[1] || 70) + '%"></s><s style="width:' + (b[2] || 38) + '%"></s></div>';
        }).join('') + '</div>';
    },

    /* 多角色对话 */
    chat: function (a) {
      return '<div class="x-chat">' + (a.turns || []).map(function (t) {
        return '<div class="ms ' + (t[1] || 'l') + '"><i>' + esc(t[2] || '·') + '</i><b>' + esc(t[0]) + '</b></div>';
      }).join('') + '</div>';
    },

    /* 日历节奏 */
    calendar: function (a) {
      return '<div class="x-cal"><div class="wk">' + (a.head || []).map(function (h) { return '<span>' + esc(h) + '</span>'; }).join('') + '</div>' +
        '<div class="gd">' + (a.cells || []).map(function (c) {
          return '<i class="' + (c[1] || '') + '">' + esc(c[0]) + '</i>';
        }).join('') + '</div></div>';
    },

    /* 色板 + 字阶 */
    swatch: function (a) {
      return '<div class="x-sw"><div class="cols">' + (a.cols || []).map(function (c) {
        return '<i style="background:' + c[0] + '">' + (c[1] ? '<s>' + esc(c[1]) + '</s>' : '') + '</i>';
      }).join('') + '</div><div class="ty">' + (a.type || []).map(function (t) {
        return '<span style="font-size:' + (t[1] || 11) + 'px">' + esc(t[0]) + '</span>';
      }).join('') + '</div></div>';
    },

    /* 三个标志方向 */
    marks: function (a) {
      return '<div class="x-marks">' + (a.marks || []).map(function (m) {
        return '<div class="mk ' + (m[1] || 'c') + '"><i></i><b>' + esc(m[0]) + '</b></div>';
      }).join('') + '</div>';
    },

    /* 抠图：棋盘格 + 主体 */
    cutout: function (a) {
      return '<div class="x-cut"><div class="ck">' + (a.items || []).map(function (t) {
        return '<i><s>' + esc(t) + '</s></i>';
      }).join('') + '</div><div class="lb">' + esc(a.label || '') + '</div></div>';
    },

    /* 蓝图 / CAD */
    cad: function (a) {
      return '<div class="x-cad"><svg viewBox="0 0 120 70" preserveAspectRatio="none">' +
        '<path d="' + (a.d || 'M24 52 L24 26 L48 16 L88 16 L88 40 L64 52 Z') + '" fill="none" stroke="currentColor" stroke-width="1.3"/>' +
        '<path d="' + (a.d2 || 'M24 26 L48 26 L48 52 M48 26 L88 26 M64 52 L64 40 L88 40') + '" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="2 2" stroke-opacity=".6"/>' +
        '<path d="M24 60 L88 60 M24 57 L24 63 M88 57 L88 63" fill="none" stroke="currentColor" stroke-width=".6" stroke-opacity=".7"/>' +
        '<path d="M14 26 L14 52 M11 26 L17 26 M11 52 L17 52" fill="none" stroke="currentColor" stroke-width=".6" stroke-opacity=".7"/>' +
        '</svg><div class="dm"><span>' + esc(a.w || '') + '</span><span>' + esc(a.h || '') + '</span></div></div>';
    },

    /* 节点图 */
    nodes: function (a) {
      return '<div class="x-nds"><svg viewBox="0 0 120 70" preserveAspectRatio="none"><path d="' + (a.links || '') +
        '" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="1" stroke-dasharray="3 2"/></svg><div class="nb">' +
        (a.list || []).map(function (n) {
          return '<span style="left:' + n[1] + '%;top:' + n[2] + '%">' + esc(n[0]) + '</span>';
        }).join('') + '</div></div>';
    },

    /* KPI 数字行 */
    kpi: function (a) {
      return '<div class="x-kpi">' + (a.nums || []).map(function (n) {
        return '<div class="kp"><b>' + esc(n[0]) + '</b><s>' + esc(n[1] || '') + '</s></div>';
      }).join('') + '</div>';
    }
  };

  for (var _mx in MOTIFS_X) { if (MOTIFS_X.hasOwnProperty(_mx)) MOTIFS[_mx] = MOTIFS_X[_mx]; }

  /* 逐仓插画：外壳沿用 .cov 的三层结构，主体换成母题 */
  function posterHTML(s, c, a) {
    var body = MOTIFS[a.m] ? MOTIFS[a.m](a) : '';
    return '<div class="cov cv-art art-' + a.m + ' shl' + (a.s || 0) + '" style="--cc:' + (a.accent || (c && c.color) || '#888') + '">' +
      '<div class="cv-top"><span class="k">' + esc(a.kicker || '') + '</span><span class="v">' + esc(a.right || '') + '</span></div>' +
      '<div class="cv-body">' + body + '</div>' +
      '<div class="cv-foot">' +
      '<span>' + esc(a.t || '') + '</span>' +
      (a.sub ? '<em>' + esc(a.sub) + '</em>' : '') +
      '<i>' + esc((c && c.name) || s.cat) + '</i></div>' +
      '</div>';
  }

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
    var art = g.COVER_ART && g.COVER_ART[s.id];
    if (art && MOTIFS[art.m]) return posterHTML(s, c, art);
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
    posterHTML: posterHTML,
    cardHTML: cardHTML,
    recommendOrder: recommendOrder
  };
})(typeof window !== 'undefined' ? window : globalThis);
