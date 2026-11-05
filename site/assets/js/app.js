(function () {
  'use strict';

  var SKILLS = (window.SKILLS || []).slice();
  var CATS = window.CATS || [];
  var AUTHORS = window.AUTHORS || [];
  var CAT_MAP = {};
  CATS.forEach(function (c) { CAT_MAP[c.key] = c; });

  // 作者索引：owner 小写 → 作者信息
  var AUTHOR_MAP = {};
  AUTHORS.forEach(function (a) { AUTHOR_MAP[a.owner.toLowerCase()] = a; });
  function ownerOf(s) { return s.repo.split('/')[0]; }
  function authorOf(s) { return AUTHOR_MAP[ownerOf(s).toLowerCase()] || null; }

  /* ---------- 上游动态：最近提交 / 版本 / 发版日期 ---------- */
  var UPS = window.UPS || {};
  var UPS_AT = window.UPS_FETCHED || '';
  var UPS_TTL = 0;                             // 服务端刷新间隔（秒），由 /api/upstream 告知

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function dayNum(str) {                       // 'YYYY-MM-DD' → 可比较的整数
    if (!str) return 0;
    var p = String(str).slice(0, 10).split('-');
    return (+p[0]) * 10000 + (+p[1]) * 100 + (+p[2]);
  }
  function daysSince(str) {                    // 距今多少天（按本地日历日算，不看时分）
    if (!str) return null;
    var p = String(str).slice(0, 10).split('-');
    var d = new Date(+p[0], (+p[1]) - 1, +p[2]);
    var t = new Date();
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
  function todayStr() {
    var t = new Date();
    return t.getFullYear() + '-' + pad2(t.getMonth() + 1) + '-' + pad2(t.getDate());
  }

  SKILLS.forEach(function (s) {
    s.catName = (CAT_MAP[s.cat] || {}).name || s.cat;
    s.owner = ownerOf(s);
    s.author = authorOf(s);
    var u = UPS[s.repo] || [];
    s.upd = u[0] || '';       // 最近一次提交
    s.ver = u[1] || '';       // 能抽出语义化版本号才有
    s.verAt = u[2] || '';     // 该版本的发布时间
    s.days = daysSince(s.upd);
  });

  /* ---------- 「新」角标：跟上次访问时的快照比 ---------- */
  var SNAP_KEY = 'skill-compass-snap-v1';
  var prevSnap = null;
  try { prevSnap = JSON.parse(localStorage.getItem(SNAP_KEY) || 'null'); } catch (e) { prevSnap = null; }
  var prevIds = {};
  if (prevSnap && prevSnap.ids) prevSnap.ids.forEach(function (id) { prevIds[id] = 1; });
  var prevAt = (prevSnap && prevSnap.at) ? dayNum(prevSnap.at) : 0;

  function markOf(s) {
    if (!prevSnap) return '';                            // 第一次来不打标，免得满屏都是「新」
    if (!prevIds[s.id]) return 'new';                     // 站点里新收录的
    if (s.upd && dayNum(s.upd) > prevAt) return 'upd';    // 上次访问之后上游有提交
    return '';
  }
  function saveSnap() {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify({
        at: todayStr(),
        ids: SKILLS.map(function (s) { return s.id; })
      }));
    } catch (e) {}
  }
  // 关页面时才落盘：这样同一天里刷新不会把角标刷掉，下次来才「清账」
  window.addEventListener('pagehide', saveSnap);

  var state = { cat: 'all', q: '', sort: 'recommend', onlyImg: false, recentOnly: false, openId: null, author: 'all' };
  var $grid = document.getElementById('grid');
  var $chips = document.getElementById('chips');
  var $authors = document.getElementById('authors');
  var $q = document.getElementById('q');
  var $sortBtn = document.getElementById('sort-btn');
  var $sortLabel = document.getElementById('sort-label');
  var $sortMenu = document.getElementById('sort-menu');
  var $sortWrap = document.getElementById('sort-wrap');
  var $sortScrim = document.getElementById('sort-scrim');
  var $resultText = document.getElementById('result-text');
  var $resultHint = document.getElementById('result-hint');

  /* ---------- 工具 ---------- */
  function fmtNum(n) {
    if (n == null) return '—';
    if (n >= 10000) return (n / 1000).toFixed(n >= 100000 ? 0 : 1).replace('.0', '') + 'k';
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return String(n);
  }
  function hex2rgba(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }
  function glyphOf(s) {
    var n = s.name.replace(/[（(\[].*?[）)\]]/g, '').trim();
    if (/^[A-Za-z]/.test(n)) return n.slice(0, 1).toUpperCase();
    return n.slice(0, 1);
  }
  function repoUrl(s) {
    return 'https://github.com/' + s.repo + (s.path ? '/' + s.path : '');
  }
  function installCmd(s) {
    // 合集里的子 skill 要带 --skill，否则会装整个仓库
    return 'npx skills add ' + s.repo + (s.skill ? ' --skill ' + s.skill : '');
  }

  /* ---------- 排序下拉（自定义，不用原生 select）---------- */
  var SORTS = [
    { v: 'recommend', t: '推荐排序' },
    { v: 'updated', t: '最近更新' },
    { v: 'stars', t: '按 Star 数' },
    { v: 'name', t: '按名称' }
  ];
  function sortText(v) {
    for (var i = 0; i < SORTS.length; i++) if (SORTS[i].v === v) return SORTS[i].t;
    return SORTS[0].t;
  }
  function isSort(v) {
    for (var i = 0; i < SORTS.length; i++) if (SORTS[i].v === v) return true;
    return false;
  }
  function syncSortUI() {
    if ($sortLabel) $sortLabel.textContent = sortText(state.sort);
    if (!$sortMenu) return;
    Array.prototype.forEach.call($sortMenu.children, function (li) {
      if (!li.dataset || !li.dataset.value) return;
      li.setAttribute('aria-selected', li.dataset.value === state.sort ? 'true' : 'false');
    });
  }
  function setSortOpen(open) {
    if (!$sortMenu || !$sortBtn) return;
    if (open) {
      // 先显示再量高度，判断往下弹会不会被视口底部切掉
      $sortMenu.hidden = false;
      var r = $sortBtn.getBoundingClientRect();
      var need = $sortMenu.offsetHeight + 12;
      var below = window.innerHeight - r.bottom;
      $sortMenu.classList.toggle('drop-up', below < need && r.top > need);
    }
    $sortMenu.hidden = !open;
    $sortBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if ($sortScrim) $sortScrim.hidden = !open;
    document.body.classList.toggle('sort-open', open);
  }

  /* ---------- 统计 ---------- */
  var withImg = SKILLS.filter(function (s) { return s.img; }).length;
  document.getElementById('s1').innerHTML = SKILLS.length + '<span>个</span>';
  document.getElementById('s2').innerHTML = withImg + '<span>个</span>';
  document.getElementById('s3').innerHTML = CATS.length + '<span>类</span>';
  var s4 = document.getElementById('s4');
  if (s4) {
    var liveAuthors = AUTHORS.filter(function (a) {
      return SKILLS.some(function (s) { return s.owner.toLowerCase() === a.owner.toLowerCase(); });
    }).length;
    s4.innerHTML = liveAuthors + '<span>位</span>';
  }
  document.getElementById('stat-total').textContent = SKILLS.length;

  /* ---------- 分类 chips ---------- */
  function countOf(key) {
    return SKILLS.filter(function (s) { return key === 'all' || s.cat === key; }).length;
  }
  function recentCount() {
    return SKILLS.filter(function (s) { return s.days != null && s.days <= 30; }).length;
  }
  function buildChips() {
    var html = '<button class="chip" data-cat="all" aria-pressed="' + (state.cat === 'all' ? 'true' : 'false') + '">全部<span class="n">' + SKILLS.length + '</span></button>';
    CATS.forEach(function (c) {
      html += '<button class="chip" data-cat="' + c.key + '" aria-pressed="' + (state.cat === c.key ? 'true' : 'false') + '">' +
        '<span class="dot" style="background:' + c.color + '"></span>' + c.name +
        '<span class="n">' + countOf(c.key) + '</span></button>';
    });
    html += '<button class="chip chip-flag" data-cat="__upd" aria-pressed="' + (state.recentOnly ? 'true' : 'false') + '" title="最近 30 天内有提交的仓库">⟳ 近 30 天有更新<span class="n">' + recentCount() + '</span></button>';
    html += '<button class="chip chip-flag" data-cat="__img" aria-pressed="' + (state.onlyImg ? 'true' : 'false') + '">▶ 有演示图<span class="n">' + withImg + '</span></button>';
    $chips.innerHTML = html;

    $chips.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      var cat = btn.dataset.cat;
      if (cat === '__img') {
        state.onlyImg = !state.onlyImg;
        btn.setAttribute('aria-pressed', state.onlyImg ? 'true' : 'false');
      } else if (cat === '__upd') {
        state.recentOnly = !state.recentOnly;
        btn.setAttribute('aria-pressed', state.recentOnly ? 'true' : 'false');
      } else {
        state.cat = cat;
        Array.prototype.forEach.call($chips.children, function (c) {
          if (c.dataset.cat === '__img' || c.dataset.cat === '__upd') return;
          c.setAttribute('aria-pressed', c === btn ? 'true' : 'false');
        });
      }
      render();
    });
  }

  /* ---------- 创作者 chips ---------- */
  // 作者口径拆三个：卡片数（点了能看到几张）、仓库数（去重）、skill 数（合集按 subs 展开）
  // chip 上标卡片数，保证「标 7 → 点开 7 张」不打架；仓库/skill 数放 tooltip 与抽屉
  function countByAuthor(owner) {
    return SKILLS.filter(function (s) { return s.owner.toLowerCase() === owner.toLowerCase(); }).length;
  }
  function reposByAuthor(owner) {
    var seen = {};
    SKILLS.forEach(function (s) {
      if (s.owner.toLowerCase() !== owner.toLowerCase()) return;
      seen[s.repo] = 1;
    });
    return Object.keys(seen).length;
  }
  function skillsByAuthor(owner) {
    var n = 0;
    SKILLS.forEach(function (s) {
      if (s.owner.toLowerCase() !== owner.toLowerCase()) return;
      if (s.from) return;                       // 子条目已算进合集的 subs，别重复
      n += (s.subs && s.subs.length) || 1;
    });
    return n;
  }
  // 只有 skill 数比仓库数多（说明有合集被展开过）时才值得显示第二口径
  function authorMeta(owner, compact) {
    var r = reposByAuthor(owner), k = skillsByAuthor(owner);
    if (compact) return r + ' 仓库' + (k > r ? ' · ' + k + ' skill' : '');
    return r + ' 个仓库' + (k > r ? ' / ' + k + ' 个 skill' : '');
  }
  function buildAuthors() {
    var own = AUTHORS.map(function (a) {
      return { a: a, n: countByAuthor(a.owner) };
    }).filter(function (x) { return x.n > 0; })
      .sort(function (x, y) { return y.n - x.n; })
      .map(function (x) { return x.a; });

    var html = '<button class="chip chip-sm" data-author="all" aria-pressed="' + (state.author === 'all' ? 'true' : 'false') + '">全部</button>';
    own.forEach(function (a) {
      var pressed = state.author.toLowerCase() === a.owner.toLowerCase();
      var n = countByAuthor(a.owner);
      html += '<button class="chip chip-sm" data-author="' + a.owner + '" aria-pressed="' + (pressed ? 'true' : 'false') + '" title="' + a.note + '｜' + authorMeta(a.owner) + '">' +
        '<span class="avatar" style="background:' + a.color + '">' + a.name.slice(0, 1) + '</span>' +
        a.name +
        (n > 1 ? '<span class="n">' + n + '</span>' : '') +
        '</button>';
    });
    $authors.innerHTML = html;

    $authors.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      var next = btn.dataset.author;
      setAuthor(state.author.toLowerCase() === next.toLowerCase() ? 'all' : next);
      render();
    });
  }

  function setAuthor(owner) {
    state.author = owner || 'all';
    if (!$authors) return;
    Array.prototype.forEach.call($authors.children, function (c) {
      var on = c.dataset.author.toLowerCase() === state.author.toLowerCase();
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------- 过滤 + 排序 ---------- */
  function matches(s, terms) {
    if (state.cat !== 'all' && s.cat !== state.cat) return false;
    if (state.onlyImg && !s.img) return false;
    if (state.recentOnly && !(s.days != null && s.days <= 30)) return false;
    if (state.author !== 'all' && s.owner.toLowerCase() !== state.author.toLowerCase()) return false;
    if (!terms.length) return true;
    var hay = (s.name + ' ' + s.repo + ' ' + s.desc + ' ' + s.tags.join(' ') + ' ' + s.catName + ' ' + s.id
      + ' ' + (s.author ? s.author.name + ' ' + s.author.owner : '')).toLowerCase();
    // 合集里的子 skill 也进搜索：否则「袋鼠封面」「爆款选题」搜不到那个合集
    if (s.subs) {
      hay += ' ' + s.subs.map(function (x) {
        return x.name + ' ' + x.one + ' ' + x.dir + ' ' + ((CAT_MAP[x.cat] || {}).name || '');
      }).join(' ').toLowerCase();
    }
    return terms.every(function (t) { return hay.indexOf(t) > -1; });
  }

  function sortList(list) {
    if (state.sort === 'stars') {
      return list.slice().sort(function (a, b) { return (b.stars || 0) - (a.stars || 0); });
    }
    if (state.sort === 'updated') {
      return list.slice().sort(function (a, b) {
        var x = dayNum(a.upd), y = dayNum(b.upd);
        if (x !== y) return y - x;                       // 有新提交的排前面
        return (b.stars || 0) - (a.stars || 0);
      });
    }
    if (state.sort === 'name') {
      return list.slice().sort(function (a, b) { return a.name.localeCompare(b.name, 'zh-Hans-CN'); });
    }
    // 推荐：分类轮转，让第一屏覆盖不同分类，而不是被几个巨型仓库霸榜
    var byCat = {};
    list.slice().sort(function (a, b) { return (b.stars || 0) - (a.stars || 0); }).forEach(function (s) {
      (byCat[s.cat] = byCat[s.cat] || []).push(s);
    });
    var order = CATS.map(function (c) { return c.key; }).filter(function (k) { return byCat[k]; });
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

  /* ---------- 卡片 ---------- */
  var io = null;
  function loadImg(img) {
    function show() { img.classList.add('loaded'); }
    if (img.dataset.src) {
      img.src = img.dataset.src;
      delete img.dataset.src;
    }
    // 缓存命中时 load 事件不会再触发，必须主动判断
    if (img.complete && img.naturalWidth > 0) show();
    img.addEventListener('load', show);
    img.addEventListener('error', function () {
      var fb = img.parentNode.querySelector('.thumb-fallback');
      if (fb) fb.style.display = 'grid';
      img.style.display = 'none';
    });
  }
  function observeImg(img) {
    if (!('IntersectionObserver' in window)) { loadImg(img); return; }
    io.observe(img);
  }
  function initIO() {
    if (io || !('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        loadImg(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: '400px 0px' });
  }

  function cardHTML(s) {
    var c = CAT_MAP[s.cat] || { color: '#888', name: s.cat };
    var fb = '<div class="thumb-fallback" style="--c:' + c.color + (s.img ? ';display:none' : '') + '">' +
      '<div class="fb-inner">' +
      '<div class="fb-mark">' + glyphOf(s) + '</div>' +
      '<div class="fb-name">' + s.name + '</div>' +
      '<div class="fb-cat">' + c.name + '</div>' +
      '</div></div>';
    var thumb = '<div class="thumb' + (s.fit === 'contain' ? ' fit' : '') + '">' + fb;
    if (s.img) {
      thumb += '<img data-src="assets/img/' + s.img + '" alt="' + s.name + ' 效果演示">';
    }
    thumb += '<span class="badge-cat"><span class="dot" style="background:' + c.color + '"></span>' + c.name + '</span>';
    var mark = markOf(s);
    if (mark) {
      thumb += '<span class="badge-new ' + mark + '">' + (mark === 'new' ? '新增' : '有更新') + '</span>';
    }
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

  /* ---------- 渲染 ---------- */
  function render() {
    writeURL();
    var terms = state.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var list = sortList(SKILLS.filter(function (s) { return matches(s, terms); }));

    $resultText.innerHTML = '共 <b>' + list.length + '</b> 个 skill' +
      (state.author !== 'all' ? ' · ' + ((AUTHOR_MAP[state.author.toLowerCase()] || {}).name || state.author) : '') +
      (state.cat !== 'all' ? ' · ' + (CAT_MAP[state.cat] || {}).name : '') +
      (state.onlyImg ? ' · 仅看有演示图' : '') +
      (state.recentOnly ? ' · 近 30 天有更新' : '');
    $resultHint.textContent = terms.length ? '关键词：' + terms.join(' + ') : '';

    if (!list.length) {
      $grid.innerHTML = '<div class="empty"><div class="big">没找到匹配的 skill</div>' +
        '<div>换个说法试试，比如「PPT」「配图」「架构图」「省 token」，或者点上面的分类</div></div>';
      return;
    }
    $grid.innerHTML = list.map(cardHTML).join('');
    $grid.querySelectorAll('.card').forEach(function (el, i) {
      el.style.animationDelay = Math.min(i * 18, 260) + 'ms';
    });
    initIO();
    $grid.querySelectorAll('img[data-src]').forEach(observeImg);
  }

  /* ---------- 抽屉 ---------- */
  var $drawer = document.getElementById('drawer');
  var $overlay = document.getElementById('overlay');
  var $dScroll = document.getElementById('drawer-scroll');
  var lastFocus = null;

  function similarOf(s) {
    return SKILLS.filter(function (o) { return o.id !== s.id; })
      .map(function (o) {
        var shared = o.tags.filter(function (t) { return s.tags.indexOf(t) > -1; }).length;
        var score = shared * 100 + (o.cat === s.cat ? 30 : 0) + Math.log10((o.stars || 0) + 10) * 3;
        return { o: o, score: score };
      })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 3)
      .map(function (x) { return x.o; });
  }

  function ttlText(sec) {
    if (!sec) return '服务端自动刷新';
    var m = Math.round(sec / 60);
    if (m >= 60 && m % 60 === 0) return '服务端每 ' + (m / 60) + ' 小时自动刷新';
    return '服务端每 ' + m + ' 分钟自动刷新';
  }

  // 抽屉里的「上游动态」：最近提交 + 最新版本 + 两个跳转
  function upstreamHTML(s) {
    if (!s.upd && !s.ver) return '';
    var repoBase = 'https://github.com/' + s.repo;
    var rows = '<div class="upd-line"><span class="upd-k">最近提交</span>' +
      '<b>' + (s.upd || '—') + '</b>' +
      (s.days != null ? '<i class="upd-ago ' + freshOf(s) + '">' + fmtAgo(s.days) + '</i>' : '') +
      '</div>';
    if (s.ver) {
      rows += '<div class="upd-line"><span class="upd-k">最新版本</span><b>' + s.ver + '</b>' +
        (s.verAt ? '<i class="upd-ago">' + s.verAt + ' 发布</i>' : '') + '</div>';
    } else {
      rows += '<div class="upd-line"><span class="upd-k">最新版本</span>' +
        '<b class="upd-none">没有 Release / Tag</b><i class="upd-ago">以提交为准</i></div>';
    }
    return '<div class="upd-panel">' +
      '<div class="upd-head">上游动态<span class="upd-fetched">数据日期 ' + (UPS_AT || '—') +
        ' · ' + ttlText(UPS_TTL) + '</span></div>' +
      rows +
      '<div class="upd-links">' +
      '<a href="' + repoBase + '/commits" target="_blank" rel="noopener">提交历史</a>' +
      '<a href="' + repoBase + '/releases" target="_blank" rel="noopener">Releases</a>' +
      '</div></div>';
  }

  function openDrawer(s) {
    var c = CAT_MAP[s.cat] || { color: '#888', name: s.cat };
    var heroHTML;
    if (s.img) {
      heroHTML = '<div class="drawer-hero' + (s.fit === 'contain' ? ' fit' : '') + '"><img src="assets/img/' + s.img + '" alt="' + s.name + ' 效果图"></div>';
    } else {
      heroHTML = '<div class="drawer-hero"><div class="thumb-fallback" style="position:absolute;inset:0;--c:' + c.color + '">' +
        '<div class="fb-inner">' +
        '<div class="fb-mark" style="width:54px;height:54px;font-size:23px;margin-bottom:11px">' + glyphOf(s) + '</div>' +
        '<div class="fb-name" style="font-size:21px">' + s.name + '</div>' +
        '<div class="fb-cat">' + c.name + '</div>' +
        '</div></div></div>';
    }
    // 子条目 → 合集的反链
    var fromHTML = '';
    if (s.from) {
      var par = SKILLS.filter(function (o) { return o.id === s.from; })[0];
      if (par) {
        fromHTML = '<button class="from-pill" data-open="' + par.id + '">' +
          '<span>出自合集 <b>' + par.name + '</b>' +
          (par.subs ? '（' + par.subs.length + ' 个 skill）' : '') + '</span>' +
          '<span class="fp-arrow">看全部 →</span></button>';
      }
    }
    // 合集 → 按产出物分组的子 skill 清单
    var subsHTML = '';
    if (s.subs && s.subs.length) {
      var groups = {};
      s.subs.forEach(function (x) { (groups[x.cat] = groups[x.cat] || []).push(x); });
      var gorder = CATS.map(function (c) { return c.key; }).filter(function (k) { return groups[k]; });
      subsHTML = '<div class="sec-label">包含 ' + s.subs.length + ' 个 skill</div><div class="sub-list">' +
        gorder.map(function (k) {
          var gc = CAT_MAP[k] || { color: '#888', name: k };
          return '<div class="sub-group">' +
            '<div class="sub-group-head"><span class="sg-dot" style="background:' + gc.color + '"></span>' + gc.name + '</div>' +
            groups[k].map(function (x) {
              var link = SKILLS.filter(function (o) { return o.from === s.id && o.skill === x.dir; })[0];
              return '<div class="sub-item' + (link ? ' linked' : '') + '"' +
                (link ? ' data-open="' + link.id + '"' : '') + '>' +
                '<span class="sub-name">' + x.name + '</span>' +
                '<span class="sub-one">' + x.one + '</span>' +
                (link
                  ? '<span class="sub-go">详情</span>'
                  : '<a class="sub-go" href="https://github.com/' + s.repo + '/tree/main/' + x.dir + '" target="_blank" rel="noopener">目录</a>') +
                '</div>';
            }).join('') +
            '</div>';
        }).join('') + '</div>';
    }

    var sims = similarOf(s);
    var simHTML = sims.map(function (o) {
      var oc = CAT_MAP[o.cat] || { color: '#888', name: o.cat };
      return '<div class="sim-item" data-id="' + o.id + '">' +
        '<div class="sim-th" style="background:linear-gradient(140deg,' + oc.color + ',' + hex2rgba(oc.color, .55) + ')">' +
        (o.img
          ? '<img src="assets/img/' + o.img + '" alt="" loading="lazy">'
          : '<span style="display:grid;place-items:center;height:100%;color:#fff;font-family:var(--serif);font-size:14px;font-weight:700">' + glyphOf(o) + '</span>') +
        '</div>' +
        '<div><div class="sim-name">' + o.name + '</div><div class="sim-meta">' + oc.name + ' · ★ ' + fmtNum(o.stars) + '</div></div>' +
        '</div>';
    }).join('');

    var sameAuthor = s.author ? SKILLS.filter(function (o) {
      return o.id !== s.id && o.owner.toLowerCase() === s.owner.toLowerCase();
    }).sort(function (a, b) { return (b.stars || 0) - (a.stars || 0); }) : [];
    var byAuthorHTML = sameAuthor.map(function (o) {
      var oc = CAT_MAP[o.cat] || { color: '#888', name: o.cat };
      return '<div class="sim-item" data-id="' + o.id + '">' +
        '<div class="sim-th" style="background:linear-gradient(140deg,' + oc.color + ',' + hex2rgba(oc.color, .55) + ')">' +
        (o.img
          ? '<img src="assets/img/' + o.img + '" alt="" loading="lazy">'
          : '<span style="display:grid;place-items:center;height:100%;color:#fff;font-family:var(--serif);font-size:14px;font-weight:700">' + glyphOf(o) + '</span>') +
        '</div>' +
        '<div><div class="sim-name">' + o.name + '</div><div class="sim-meta">' + oc.name + ' · ★ ' + fmtNum(o.stars) + '</div></div>' +
        '</div>';
    }).join('');

    $dScroll.innerHTML = heroHTML +
      '<div class="drawer-body">' +
      '<div class="drawer-cat"><span class="dot" style="width:6px;height:6px;border-radius:50%;background:' + c.color + ';display:inline-block"></span>' + c.name + '</div>' +
      '<h2 id="d-title">' + s.name + '</h2>' +
      '<div class="drawer-repo">' + s.repo + (s.path ? ' / ' + s.path.replace('tree/main/', '') : '') + '</div>' +
      fromHTML +
      (s.author
        ? '<button class="author-pill" data-filter-author="' + s.author.owner + '">' +
          '<span class="avatar" style="background:' + s.author.color + '">' + s.author.name.slice(0, 1) + '</span>' +
          '<b>' + s.author.name + '</b><span class="ap-note">' + s.author.note + '</span>' +
          '<span class="ap-arrow">' + authorMeta(s.author.owner, true) + ' →</span></button>'
        : '') +
      '<p class="drawer-desc">' + s.desc + '</p>' +
      '<div class="drawer-tags">' + s.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') +
      '<span class="tag">★ ' + fmtNum(s.stars) + '</span></div>' +
      upstreamHTML(s) +
      subsHTML +
      '<div class="drawer-actions">' +
      '<a class="btn btn-primary" href="' + repoUrl(s) + '" target="_blank" rel="noopener">打开 GitHub 仓库' +
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></a>' +
      '</div>' +
      '<div class="sec-label">安装</div>' +
      '<div class="cmd"><code>' + installCmd(s) + '</code><button data-copy="' + installCmd(s) + '">复制</button></div>' +
      '<p class="hint">需要 Node.js 22+。也可以用 <b>git clone</b> 后把 skill 目录拷进 <code>~/.claude/skills/</code>；具体安装方式以仓库 README 为准。</p>' +
      (sameAuthor.length ? '<div class="sec-label">' + s.author.name + ' 的其他作品（' + sameAuthor.length + '）</div><div class="sim-list">' + byAuthorHTML + '</div>' : '') +
      (sims.length ? '<div class="sec-label">同类替代</div><div class="sim-list">' + simHTML + '</div>' : '') +
      '</div>';

    lastFocus = document.activeElement;
    state.openId = s.id;
    writeURL();
    $drawer.classList.add('on');
    $overlay.classList.add('on');
    document.body.style.overflow = 'hidden';
    $dScroll.scrollTop = 0;
    setTimeout(function () { document.getElementById('drawer-close').focus(); }, 60);
  }

  function closeDrawer() {
    state.openId = null;
    writeURL();
    $drawer.classList.remove('on');
    $overlay.classList.remove('on');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- 事件 ---------- */
  $grid.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (card) openDrawer(SKILLS.filter(function (s) { return s.id === card.dataset.id; })[0]);
  });
  $grid.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest('.card');
    if (!card) return;
    e.preventDefault();
    openDrawer(SKILLS.filter(function (s) { return s.id === card.dataset.id; })[0]);
  });

  $dScroll.addEventListener('click', function (e) {
    var authorBtn = e.target.closest('[data-filter-author]');
    if (authorBtn) {
      setAuthor(authorBtn.dataset.filterAuthor);
      closeDrawer();
      var bar = document.querySelector('.filterbar');
      if (bar) window.scrollTo({ top: bar.offsetTop - 70, behavior: 'smooth' });
      render();
      return;
    }
    var copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      var txt = copyBtn.dataset.copy;
      var done = function () {
        copyBtn.textContent = '已复制';
        setTimeout(function () { copyBtn.textContent = '复制'; }, 1400);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, done);
      else done();
      return;
    }
    var opener = e.target.closest('[data-open]');
    if (opener) {
      var t = SKILLS.filter(function (x) { return x.id === opener.dataset.open; })[0];
      if (t) openDrawer(t);
      return;
    }
    var sim = e.target.closest('.sim-item');
    if (sim) {
      var target = SKILLS.filter(function (s) { return s.id === sim.dataset.id; })[0];
      if (target) openDrawer(target);
    }
  });

  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  $overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if ($sortMenu && !$sortMenu.hidden) { setSortOpen(false); if ($sortBtn) $sortBtn.focus(); return; }
      if ($drawer.classList.contains('on')) closeDrawer();
      return;
    }
    if (e.key === '/' && document.activeElement !== $q && !document.body.classList.contains('sort-open')) {
      e.preventDefault();
      $q.focus();
      $q.select();
    }
  });

  var timer = null;
  $q.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      state.q = $q.value;
      render();
    }, 110);
  });
  if ($sortBtn) {
    $sortBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setSortOpen($sortMenu.hidden);
    });
    $sortMenu.addEventListener('click', function (e) {
      var li = e.target.closest('.sort-opt');
      if (!li) return;
      state.sort = li.dataset.value;
      syncSortUI();
      setSortOpen(false);
      render();
    });
    if ($sortScrim) $sortScrim.addEventListener('click', function () { setSortOpen(false); });
    document.addEventListener('click', function (e) {
      if ($sortMenu.hidden || $sortWrap.contains(e.target)) return;
      setSortOpen(false);
    });
  }

  /* ---------- 延伸资源 ---------- */
  document.getElementById('ext-list').innerHTML = (window.RESOURCES || []).map(function (r) {
    return '<a class="ext-item" href="' + r.url + '" target="_blank" rel="noopener"><b>' + r.name + '</b><i>' + r.desc + '</i></a>';
  }).join('');

  /* ---------- URL 状态（可分享筛选结果） ---------- */
  function readURL() {
    var p = new URLSearchParams(location.search);
    var cat = p.get('cat');
    if (cat && (cat === 'all' || CAT_MAP[cat])) state.cat = cat;
    if (p.get('q')) state.q = p.get('q');
    if (p.get('sort') && isSort(p.get('sort'))) state.sort = p.get('sort');
    if (p.get('img') === '1') state.onlyImg = true;
    if (p.get('recent') === '1') state.recentOnly = true;
    if (p.get('open')) state.openId = p.get('open');
    if (p.get('by')) {
      var by = p.get('by');
      if (AUTHOR_MAP[by.toLowerCase()] && countByAuthor(by) > 0) state.author = AUTHOR_MAP[by.toLowerCase()].owner;
    }
  }
  function writeURL() {
    var p = new URLSearchParams();
    if (state.cat !== 'all') p.set('cat', state.cat);
    if (state.author !== 'all') p.set('by', state.author);
    if (state.q) p.set('q', state.q);
    if (state.sort !== 'recommend') p.set('sort', state.sort);
    if (state.onlyImg) p.set('img', '1');
    if (state.recentOnly) p.set('recent', '1');
    if (state.openId) p.set('open', state.openId);
    var qs = p.toString();
    try { history.replaceState(null, '', qs ? '?' + qs : location.pathname); } catch (err) {}
  }

  /* ---------- 服务端实时数据（渐进增强） ----------
     首屏用 data.js 里的内置快照直接渲染，不等网络；
     随后静默问 /api/upstream（服务端自己抓、自己缓存），拿到差别就地更新。
     纯本地 file:// 打开时没有这个端点，自动跳过。 */
  var $fresh = document.getElementById('fresh-hint');

  function agoText(sec) {
    if (sec == null) return '';
    if (sec < 60) return '刚刚更新';
    if (sec < 3600) return Math.floor(sec / 60) + ' 分钟前更新';
    if (sec < 86400) return Math.floor(sec / 3600) + ' 小时前更新';
    return Math.floor(sec / 86400) + ' 天前更新';
  }

  function setFreshHint(p) {
    if (!$fresh) return;
    if (!p) { $fresh.innerHTML = ''; return; }
    if (p.source === 'seed' && !p.updatedAt) {
      $fresh.innerHTML = '<i class="live-dot warm"></i>内置快照 ' + (p.fetchedAt || '—');
      return;
    }
    $fresh.innerHTML = '<i class="live-dot"></i>' + (agoText(p.ageSeconds) || '已同步') +
      (p.stale ? '<span class="fh-tip" title="服务端正在后台重新抓取，稍后刷新即可看到最新">· 同步中</span>' : '');
    if (p.fetchedAt) $fresh.title = '数据日期 ' + p.fetchedAt +
      (p.ttlSeconds ? ' · 服务端每 ' + Math.round(p.ttlSeconds / 60) + ' 分钟自动刷新一次' : '');
  }

  function applyUpstream(p) {
    if (!p || !p.data) return 0;
    var changed = 0;
    SKILLS.forEach(function (s) {
      var u = p.data[s.repo];
      if (!u) return;
      if (u[0] !== s.upd || u[1] !== s.ver || u[2] !== s.verAt) {
        changed++;
        s.upd = u[0] || '';
        s.ver = u[1] || '';
        s.verAt = u[2] || '';
        s.days = daysSince(s.upd);
      }
    });
    if (p.fetchedAt) UPS_AT = p.fetchedAt;
    return changed;
  }

  function refreshUpstream() {
    if (!window.fetch || location.protocol === 'file:') return;
    // GitHub Pages 是纯静态托管，没有 api 端点，直接跳过免得控制台刷 404
    if (/(^|\.)github\.io$/.test(location.hostname)) return;
    fetch('api/upstream', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (p) {
        if (!p) { setFreshHint(null); return; }
        var wasUnknown = !UPS_TTL;              // 第一次拿到服务端参数
        if (p.ttlSeconds) UPS_TTL = p.ttlSeconds;
        var changed = applyUpstream(p);
        setFreshHint(p);
        if (changed) {
          var y = window.scrollY;
          render();
          window.scrollTo(0, y);
        }
        // 直接带 ?open= 进来时，抽屉在接口返回前就渲染了，这里补一次
        if (state.openId && (changed || wasUnknown)) {
          var t = SKILLS.filter(function (s) { return s.id === state.openId; })[0];
          if (t) openDrawer(t);
        }
      })
      .catch(function () { setFreshHint(null); });
  }

  /* ---------- 启动 ---------- */
  function syncTopH() {
    var tb = document.querySelector('.topbar');
    if (tb) document.documentElement.style.setProperty('--top-h', tb.offsetHeight + 'px');
  }
  window.addEventListener('resize', syncTopH);
  window.addEventListener('load', syncTopH);

  readURL();
  buildChips();
  buildAuthors();
  setAuthor(state.author);
  $q.value = state.q;
  syncSortUI();
  render();
  syncTopH();
  if (state.openId) {
    var target = SKILLS.filter(function (s) { return s.id === state.openId; })[0];
    if (target) openDrawer(target);
  }
  setFreshHint({ source: 'seed', fetchedAt: UPS_AT });
  refreshUpstream();
})();
