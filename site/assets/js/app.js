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

  // 卡片模板与日期格式化放在 card-template.js：构建期预渲染（_tools/prerender.mjs）
  // 加载的是同一份实现，静态卡片与 JS 渲染的 DOM 才不会跑偏
  var CT = window.CardTemplate;
  var pad2 = CT.pad2;
  var dayNum = CT.dayNum;
  var daysSince = CT.daysSince;
  var fmtAgo = CT.fmtAgo;
  var freshOf = CT.freshOf;

  function todayStr() {
    var t = new Date();
    return t.getFullYear() + '-' + pad2(t.getMonth() + 1) + '-' + pad2(t.getDate());
  }

  SKILLS.forEach(function (s) {
    s.catName = (CAT_MAP[s.cat] || {}).name || s.cat;
    s.owner = ownerOf(s);
    s.author = authorOf(s);
    // 补图清单（_tools/fetch-demo-images.mjs 生成）里有的，就当作有图；data.js 自带的 img 优先
    if (!s.img) {
      var extra = window.DEMO_IMGS && window.DEMO_IMGS[s.id];
      if (extra) s.img = extra;
    }
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

  var state = { cat: 'all', q: '', sort: 'recommend', onlyImg: false, recentOnly: false, openId: null, author: 'all', fav: false, view: 'grid' };
  var $grid = document.getElementById('grid');
  var $chips = document.getElementById('chips');
  var $authorBtn = document.getElementById('author-btn');
  var $authorMenu = document.getElementById('author-menu');
  var $authorLabel = document.getElementById('author-label');
  var $authorWrap = document.getElementById('author-wrap');
  var $flagImg = document.getElementById('flag-img');
  var $flagUpd = document.getElementById('flag-upd');
  var $flagFav = document.getElementById('flag-fav');
  var $viewSwitch = document.getElementById('view-switch');
  var $filterReset = document.getElementById('filter-reset');
  var $filterReset2 = document.getElementById('filter-reset-2');
  var $q = document.getElementById('q');
  var $sortBtn = document.getElementById('sort-btn');
  var $sortLabel = document.getElementById('sort-label');
  var $sortMenu = document.getElementById('sort-menu');
  var $sortWrap = document.getElementById('sort-wrap');
  var $sortScrim = document.getElementById('sort-scrim');
  var $resultText = document.getElementById('result-text');
  var $resultHint = document.getElementById('result-hint');
  var $activeFilters = document.getElementById('active-filters');
  var $statImg = document.querySelector('.stat[data-stat="img"]');
  var $favBtn = document.getElementById('fav-btn');
  var $favPop = document.getElementById('fav-pop');
  var $favN = document.getElementById('fav-n');

  /* ---------- 收藏夹：只存在这台机器上，没有账号、不上传 ---------- */
  var FAV_KEY = 'skill-compass-favs-v1';
  var favs = [];
  try {
    var savedFavs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    if (Array.isArray(savedFavs)) favs = savedFavs.filter(function (x) { return typeof x === 'string'; });
  } catch (e) { favs = []; }
  var favMap = {};
  favs.forEach(function (id) { favMap[id] = 1; });

  function isFav(id) { return !!favMap[id]; }
  function saveFavs() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {}
  }
  function syncFavCount() {
    if ($favN) { $favN.textContent = favs.length; $favN.dataset.n = favs.length; }
    var nFav = document.getElementById('n-fav');
    if (nFav) nFav.textContent = favs.length;
  }
  function toggleFav(id) {
    if (favMap[id]) {
      favs = favs.filter(function (x) { return x !== id; });
      delete favMap[id];
    } else {
      favs.unshift(id);
      favMap[id] = 1;
    }
    saveFavs();
    // 卡片上的按钮就地翻转，不整屏重排；只有在「只看收藏」时才需要重排
    Array.prototype.forEach.call(
      document.querySelectorAll('.card-fav[data-fav="' + id + '"], .rr-fav[data-fav="' + id + '"]'),
      function (b) { b.setAttribute('aria-pressed', isFav(id) ? 'true' : 'false'); }
    );
    syncFavCount();
    renderFavPop();
    syncDrawerFav();
    if (state.fav) render();
  }
  function favList() {
    return favs.map(function (id) {
      return SKILLS.filter(function (s) { return s.id === id; })[0];
    }).filter(Boolean);
  }
  function renderFavPop() {
    if (!$favPop) return;
    var list = favList();
    if (!list.length) {
      $favPop.innerHTML = '<div class="fav-empty"><b>还没有收藏</b>卡片右上角的星标点一下就收进来，存在本机浏览器里，不用登录。</div>';
      return;
    }
    $favPop.innerHTML = '<div class="fav-head"><b>我的收藏</b>' + list.length + ' 个<button class="fav-clear" type="button" data-fav-clear="1">清空</button></div>' +
      list.map(function (s) {
        return '<div class="fav-item" data-fav-open="' + s.id + '">' +
          '<div class="fi-main"><div class="fi-name">' + s.name + '</div><div class="fi-repo">' + s.repo + '</div></div>' +
          '<button class="fi-x" type="button" data-fav-remove="' + s.id + '" aria-label="取消收藏 ' + s.name + '">×</button>' +
          '</div>';
      }).join('');
  }
  function setFavOpen(open) {
    if (!$favPop || !$favBtn) return;
    $favPop.hidden = !open;
    $favBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) renderFavPop();
  }

  /* ---------- 日夜纸墨主题（按钮 / D 键 / 系统偏好） ---------- */
  var THEME_KEY = 'skill-compass-theme';
  var $themeBtn = document.getElementById('theme-btn');
  var $metaTheme = document.querySelector('meta[name="theme-color"]');
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function applyTheme(mode) {
    var dark = mode === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    if ($themeBtn) $themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    if ($metaTheme) $metaTheme.setAttribute('content', dark ? '#15120E' : '#D9553A');
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  }
  if ($themeBtn) $themeBtn.addEventListener('click', toggleTheme);

  /* ---------- 快速安装器：切宿主换命令 ---------- */
  var HOSTS = {
    npx: '',
    claude: ' -a claude-code',
    cursor: ' -a cursor',
    codex: ' -a codex'
  };
  var installHost = 'npx';
  // 安装器默认演示「推荐排序第一位」那个仓库：它既是首屏第一张卡，也是这个站最想推的东西
  var spotlight = SKILLS[0];
  function cmdFor(s, host) {
    if (!s) return '';
    return 'npx skills add ' + s.repo + (s.skill ? ' --skill ' + s.skill : '') + (HOSTS[host] || '');
  }
  function paintInstaller() {
    var el = document.getElementById('inst-cmd-text');
    if (el) el.textContent = cmdFor(spotlight, installHost);
  }

  /* ---------- 本周安装热度风向标 ---------- */
  var PULSE = window.PULSE || null;
  var $pulseList = document.getElementById('pulse-list');
  var $pulseToggle = document.getElementById('pulse-toggle');
  var $pulseFoot = document.getElementById('pulse-foot');
  var pulseOpen = false;
  var PULSE_COLLAPSED = 3;

  // 榜单右侧那个数字：过万折成「12.6万」，万是单位不是数字，单独缩小一档
  function fmtWan(n) {
    if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '<i>万</i>';
    return String(n);
  }
  // 8 周安装量 → 一条小折线。只用真实序列，没有数据就不画
  function sparkSVG(series) {
    if (!series || series.length < 2) return '';
    var w = 74, h = 22, pad = 2;
    var max = Math.max.apply(null, series);
    var min = Math.min.apply(null, series);
    var span = max - min || 1;
    var step = (w - pad * 2) / (series.length - 1);
    var pts = series.map(function (v, i) {
      var x = pad + i * step;
      var y = pad + (1 - (v - min) / span) * (h - pad * 2);
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    var last = pts.split(' ').pop().split(',');
    return '<svg class="pulse-spark" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' +
      '<polyline points="' + pts + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="1.9" fill="currentColor"/>' +
      '</svg>';
  }
  function renderPulse() {
    if (!$pulseList) return;
    var items = (PULSE && PULSE.items) ? PULSE.items.filter(function (x) {
      return SKILLS.some(function (s) { return s.id === x.id; });
    }) : [];
    if (!items.length) {
      $pulseList.innerHTML = '<li class="pulse-empty">暂时没有可用的安装量数据，下次构建会补。</li>';
      if ($pulseToggle) $pulseToggle.hidden = true;
      return;
    }
    var shown = pulseOpen ? items : items.slice(0, PULSE_COLLAPSED);
    $pulseList.innerHTML = shown.map(function (it, i) {
      var dir = it.delta > 0 ? '较上周 +' + it.delta : (it.delta < 0 ? '较上周 ' + it.delta : '与上周持平');
      var tip = '本周安装 ' + it.week + ' 次 · ' + dir + ' 次 · 累计 ' + it.installs + ' 次';
      return '<li class="pulse-item" data-id="' + it.id + '" title="' + tip + '">' +
        '<span class="pulse-rank">' + (i + 1) + '</span>' +
        '<div class="pulse-main"><span class="pulse-name">' + it.name + '</span>' +
        '<span class="pulse-repo">' + it.repo + '</span></div>' +
        sparkSVG(it.weekly) +
        '<span class="pulse-val">' + fmtWan(it.week) + '</span>' +
        '</li>';
    }).join('');
    if ($pulseToggle) {
      $pulseToggle.hidden = items.length <= PULSE_COLLAPSED;
      $pulseToggle.setAttribute('aria-expanded', pulseOpen ? 'true' : 'false');
      $pulseToggle.textContent = pulseOpen ? '收起榜单 ↑' : '切换完整榜单视图 →';
    }
    if ($pulseFoot && PULSE) {
      $pulseFoot.innerHTML = '口径：<a href="https://www.skills.sh/" target="_blank" rel="noopener"><b>skills.sh</b></a> 公开安装量（<code>npx skills add</code> 的匿名遥测）· ' +
        '按最近 7 天安装量排序，折线为近 8 周 · 站内 ' + SKILLS.length + ' 个仓库里 ' +
        PULSE.total + ' 个查得到安装量，只排这些 · 更新于 ' + PULSE.at;
    }
  }
  if ($pulseToggle) {
    $pulseToggle.addEventListener('click', function () {
      pulseOpen = !pulseOpen;
      renderPulse();
    });
  }
  if ($pulseList) {
    $pulseList.addEventListener('click', function (e) {
      var li = e.target.closest('.pulse-item');
      if (!li) return;
      var t = SKILLS.filter(function (s) { return s.id === li.dataset.id; })[0];
      if (t) openDrawer(t);
    });
  }

  /* ---------- 提交 Skill ---------- */
  var ISSUE_BASE = 'https://github.com/dawsondx/skill-compass/issues/new';
  var SUBMIT_TPL = [
    '## 想推荐的 skill',
    '- 仓库地址：',
    '- 它产出什么（一句话）：',
    '- 你实际用它做过什么：',
    '- 有真实效果图吗（链接即可）：',
    '',
    '## 我确认',
    '- [ ] 这是一个开源仓库，能直接 npx skills add 装',
    '- [ ] 上面写的是我自己用过的感受，不是复制 README'
  ].join('\n');
  var $modal = document.getElementById('submit-modal');
  function openModal() {
    if (!$modal) return;
    var issue = document.getElementById('submit-issue');
    if (issue) {
      issue.href = ISSUE_BASE + '?title=' + encodeURIComponent('[投稿] ') + '&body=' + encodeURIComponent(SUBMIT_TPL);
    }
    $modal.hidden = false;
    document.body.classList.add('modal-open');
    var close = $modal.querySelector('.modal-close');
    if (close) close.focus();
  }
  function closeModal() {
    if (!$modal || $modal.hidden) return;
    $modal.hidden = true;
    document.body.classList.remove('modal-open');
    if ($submitBtn) $submitBtn.focus();
  }
  var $submitBtn = document.getElementById('submit-btn');
  if ($submitBtn) $submitBtn.addEventListener('click', openModal);
  if ($modal) {
    $modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-close-modal]')) closeModal();
    });
    var $submitCopy = document.getElementById('submit-copy');
    if ($submitCopy) {
      $submitCopy.addEventListener('click', function () {
        var done = function () {
          $submitCopy.textContent = '已复制，去粘贴';
          setTimeout(function () { $submitCopy.textContent = '复制投稿模板'; }, 1600);
        };
        if (navigator.clipboard) navigator.clipboard.writeText(SUBMIT_TPL).then(done, done);
        else done();
      });
    }
  }

  /* ---------- 工具 ---------- */
  var fmtNum = CT.fmtNum;
  function hex2rgba(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }
  var glyphOf = CT.glyphOf;
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
    // 榜单表头的 ▲ 跟着走，跟下拉是同一个 state
    Array.prototype.forEach.call(document.querySelectorAll('.rank-head [data-sort]'), function (b) {
      if (b.dataset.sort === state.sort) {
        b.setAttribute('aria-sort', b.dataset.sort === 'name' ? 'ascending' : 'descending');
      } else {
        b.removeAttribute('aria-sort');
      }
    });
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
  // 顶栏「N 个 skill · M 个分类」那行已让位给 收藏夹 / 提交 / 主题 三件套，
  // 总数由 hero 的 #hero-total 和统计栏 #s1 承担；这里只兜底，别让旧节点缺失把整个脚本打断
  var $statTotal = document.getElementById('stat-total');
  if ($statTotal) $statTotal.textContent = SKILLS.length;

  /* ---------- 顶栏快照号 ----------
     原来这里是抄样板的「VOL.26」，没有任何数据来源。改成跟数据日期走：
     显示 2026.11.06，鼠标悬停给出中文全称。拿不到日期就把徽章藏起来，不挂假号。 */
  var $brandVol = document.getElementById('brand-vol');
  function syncBrandVol(at) {
    if (!$brandVol) return;
    var snap = String(at || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(snap)) { $brandVol.hidden = true; return; }
    var y = snap.slice(0, 4);
    var m = +snap.slice(5, 7);
    var d = +snap.slice(8, 10);
    $brandVol.hidden = false;
    $brandVol.textContent = y + '.' + snap.slice(5, 7) + '.' + snap.slice(8, 10);
    $brandVol.title = '数据快照 · ' + y + ' 年 ' + m + ' 月 ' + d + ' 日';
  }
  syncBrandVol(UPS_AT);

  /* ---------- 分类 chips ---------- */
  function countOf(key) {
    return SKILLS.filter(function (s) { return key === 'all' || s.cat === key; }).length;
  }
  function recentCount() {
    return SKILLS.filter(function (s) { return s.days != null && s.days <= 30; }).length;
  }
  function buildCats() {
    var html = '<button class="cat-tab" type="button" role="tab" data-cat="all" aria-selected="' +
      (state.cat === 'all' ? 'true' : 'false') + '">全部场景<span class="n">' + SKILLS.length + '</span></button>';
    CATS.forEach(function (c) {
      html += '<button class="cat-tab" type="button" role="tab" data-cat="' + c.key + '" aria-selected="' +
        (state.cat === c.key ? 'true' : 'false') + '">' + c.name +
        '<span class="n">' + countOf(c.key) + '</span></button>';
    });
    $chips.innerHTML = html;

    $chips.addEventListener('click', function (e) {
      var btn = e.target.closest('.cat-tab');
      if (!btn) return;
      // 再点一次当前分类 = 取消回全部，省得为退出一个分类去找重置按钮
      var next = btn.dataset.cat === state.cat ? 'all' : btn.dataset.cat;
      if (next === state.cat) return;
      state.cat = next;
      syncCats();
      render();
    });
  }
  function syncCats() {
    if (!$chips) return;
    Array.prototype.forEach.call($chips.children, function (c) {
      c.setAttribute('aria-selected', c.dataset.cat === state.cat ? 'true' : 'false');
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
  function authorCountOf() {
    return AUTHORS.filter(function (a) { return countByAuthor(a.owner) > 0; }).length;
  }
  function buildAuthorMenu() {
    if (!$authorMenu) return;
    var own = AUTHORS.map(function (a) {
      return { a: a, n: countByAuthor(a.owner) };
    }).filter(function (x) { return x.n > 0; })
      .sort(function (x, y) { return y.n - x.n; })
      .map(function (x) { return x.a; });

    var html = '<li class="au-opt" role="option" data-author="all" aria-selected="' +
      (state.author === 'all' ? 'true' : 'false') + '">' +
      '<span class="avatar" style="background:var(--ink-3)">全</span>' +
      '<span class="au-name">全部创作者</span>' +
      '<span class="n">' + SKILLS.length + '</span></li>';
    own.forEach(function (a) {
      var pressed = state.author.toLowerCase() === a.owner.toLowerCase();
      var n = countByAuthor(a.owner);
      var meta = authorMeta(a.owner, true);
      // 「15 仓库」和右边的 15 是同一个数时不重复写，只有合集展开过（仓库≠skill）才补一句
      var sub = meta === n + ' 仓库' ? '' : meta;
      html += '<li class="au-opt" role="option" data-author="' + a.owner + '" aria-selected="' + (pressed ? 'true' : 'false') +
        '" title="' + a.note + '｜' + authorMeta(a.owner) + '">' +
        '<span class="avatar" style="background:' + a.color + '">' + a.name.slice(0, 1) + '</span>' +
        '<span class="au-name">' + a.name + '</span>' +
        (sub ? '<span class="au-sub">' + sub + '</span>' : '') +
        '<span class="n">' + n + '</span>' +
        '</li>';
    });
    $authorMenu.innerHTML = html;

    $authorMenu.addEventListener('click', function (e) {
      var opt = e.target.closest('.au-opt');
      if (!opt) return;
      var next = opt.dataset.author;
      setAuthor(state.author.toLowerCase() === String(next).toLowerCase() ? 'all' : next);
      setAuthorOpen(false);
      render();
    });
  }
  function setAuthorOpen(open) {
    if (!$authorMenu || !$authorBtn) return;
    if (open) {
      // 控件条贴着视口底部时向下弹会被裁掉，量一下剩余空间改成向上
      var r = $authorBtn.getBoundingClientRect();
      var need = Math.min($authorMenu.offsetHeight || 300, 380) + 16;
      $authorMenu.classList.toggle('drop-up', window.innerHeight - r.bottom < need);
    }
    $authorMenu.hidden = !open;
    $authorBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function setAuthor(owner) {
    state.author = owner || 'all';
    syncAuthorUI();
  }
  function syncAuthorUI() {
    if ($authorLabel) {
      var hit = state.author !== 'all' ? (AUTHOR_MAP[state.author.toLowerCase()] || null) : null;
      $authorLabel.textContent = hit ? hit.name : '全部 ' + authorCountOf() + ' 位作者';
    }
    if ($authorMenu) {
      Array.prototype.forEach.call($authorMenu.children, function (c) {
        var on = String(c.dataset.author || '').toLowerCase() === state.author.toLowerCase();
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* 把 state 回写到所有筛选控件（从结果栏摘掉某个条件后，整组要跟着同步） */
  function syncFilterUI() {
    syncCats();
    syncAuthorUI();
    if ($flagImg) $flagImg.setAttribute('aria-pressed', state.onlyImg ? 'true' : 'false');
    if ($flagUpd) $flagUpd.setAttribute('aria-pressed', state.recentOnly ? 'true' : 'false');
    if ($flagFav) $flagFav.setAttribute('aria-pressed', state.fav ? 'true' : 'false');
    if ($q && $q.value !== state.q) $q.value = state.q;
    if ($statImg) $statImg.classList.toggle('on', state.onlyImg);
  }

  /* ---------- 控件条的三个快捷开关 + 创作者下拉 ---------- */
  function bindFlag(btn, key) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (key === 'img') state.onlyImg = !state.onlyImg;
      else if (key === 'recent') state.recentOnly = !state.recentOnly;
      else state.fav = !state.fav;
      syncFilterUI();
      render();
    });
  }
  bindFlag($flagImg, 'img');
  bindFlag($flagUpd, 'recent');
  bindFlag($flagFav, 'fav');
  if ($filterReset) $filterReset.addEventListener('click', resetAll);
  if ($filterReset2) $filterReset2.addEventListener('click', resetAll);
  // 开关上的计数（演示图 / 近 30 天 / 收藏）跟着数据走，不写死在 HTML 里
  (function () {
    var $nImg = document.getElementById('n-img');
    var $nUpd = document.getElementById('n-upd');
    if ($nImg) $nImg.textContent = withImg;
    if ($nUpd) $nUpd.textContent = recentCount();
  })();

  if ($authorBtn) {
    $authorBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setAuthorOpen($authorMenu.hidden);
    });
  }
  if ($authorMenu) {
    document.addEventListener('click', function (e) {
      if ($authorMenu.hidden || (e.target.closest && e.target.closest('.author-wrap'))) return;
      setAuthorOpen(false);
    });
  }

  /* ---------- 画廊 / 榜单：同一批结果两种看法 ---------- */
  if ($viewSwitch) {
    $viewSwitch.addEventListener('click', function (e) {
      var b = e.target.closest('.vs-btn');
      if (!b || b.dataset.view === state.view) return;
      state.view = b.dataset.view === 'list' ? 'list' : 'grid';
      render();
    });
  }

  /* 已选条件标签：分类 + 创作者 + 搜索 + 两个快捷开关叠加时，结果栏上一眼看清是谁在过滤 */
  function activeFiltersHTML() {
    var out = [];
    if (state.cat !== 'all') out.push({ k: 'cat', t: '分类：' + ((CAT_MAP[state.cat] || {}).name || state.cat) });
    if (state.author !== 'all') out.push({ k: 'author', t: '创作者：' + ((AUTHOR_MAP[state.author.toLowerCase()] || {}).name || state.author) });
    if (state.q) out.push({ k: 'q', t: '搜索：' + state.q });
    if (state.onlyImg) out.push({ k: 'img', t: '有演示图' });
    if (state.recentOnly) out.push({ k: 'recent', t: '近 30 天有更新' });
    if (state.fav) out.push({ k: 'fav', t: '只看收藏' });
    if (!out.length) return '';
    return out.map(function (f) {
      var t = esc(f.t);
      return '<span class="af-chip">' + t +
        '<button class="af-x" type="button" data-drop="' + f.k + '" aria-label="移除条件：' + t + '">×</button></span>';
    }).join('');
  }

  function dropFilter(k) {
    if (k === 'cat') state.cat = 'all';
    else if (k === 'author') state.author = 'all';
    else if (k === 'q') state.q = '';
    else if (k === 'img') state.onlyImg = false;
    else if (k === 'recent') state.recentOnly = false;
    else if (k === 'fav') state.fav = false;
    syncFilterUI();
    render();
  }

  /* ---------- 过滤 + 排序 ---------- */
  function matches(s, terms) {
    if (state.cat !== 'all' && s.cat !== state.cat) return false;
    if (state.onlyImg && !s.img) return false;
    if (state.recentOnly && !(s.days != null && s.days <= 30)) return false;
    if (state.fav && !isFav(s.id)) return false;
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
    // 与构建期预渲染首屏卡片共用同一份排序，保证静态/动态顺序一致
    return CT.recommendOrder(list, CATS.map(function (c) { return c.key; }));
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
    return CT.cardHTML(s, { cat: CAT_MAP[s.cat], mark: markOf(s), fav: isFav(s.id) });
  }

  /* ---------- 渲染 ---------- */
  function isFiltered() {
    return state.cat !== 'all' || state.author !== 'all' || !!state.q ||
      state.onlyImg || state.recentOnly || state.fav;
  }

  /* 榜单视图的一行：宽屏按表格对齐（名次/缩略/名称/一句话/分类/★/更新/收藏/箭头），
     窄屏靠 CSS 塌成卡片行。列顺序改这里的同时也要改 headHTML 与 .rank-* 的 grid 模板 */
  function rowHTML(s, i) {
    var c = CAT_MAP[s.cat] || {};
    var thumb = s.img
      ? '<span class="rr-thumb"><img data-src="assets/img/' + s.img + '" alt=""></span>'
      : '<span class="rr-thumb">' + esc(s.name.slice(0, 1)) + '</span>';
    var n = i + 1;
    return '<div class="rank-row" tabindex="0" role="button" data-id="' + s.id + '" aria-label="' + esc(s.name) + '，查看详情">' +
      '<span class="rr-num">' + (n < 10 ? '0' + n : n) + '</span>' +
      thumb +
      '<span class="rr-name-c">' +
        '<span class="rr-name">' + esc(s.name) + '</span>' +
        '<span class="rr-repo">' + esc(s.repo) + '</span>' +
      '</span>' +
      '<span class="rr-desc">' + esc(s.desc) + '</span>' +
      '<span class="rr-cat"><i style="background:' + (c.color || '#888') + '"></i>' + esc(c.name || s.cat) + '</span>' +
      '<span class="rr-star">★ ' + (s.stars ? fmtNum(s.stars) : '—') + '</span>' +
      '<span class="rr-upd" title="最近提交 ' + (s.upd || '—') + '">' + (s.days != null ? fmtAgo(s.days) : '—') + '</span>' +
      '<button class="rr-fav" type="button" data-fav="' + s.id + '" aria-pressed="' + (isFav(s.id) ? 'true' : 'false') +
        '" aria-label="收藏 ' + esc(s.name) + '" title="收藏 / 取消收藏">' +
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z"/></svg>' +
      '</button>' +
      '<span class="rr-go"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span>' +
      '</div>';
  }

  /* 表头：只有「名称 / ★ / 更新」可点，点一下按它排，再点回推荐排序 */
  function headHTML() {
    return '<div class="rank-head">' +
      '<span class="rh-num">#</span><span class="rh-thumb"></span>' +
      '<button class="rh-name" type="button" data-sort="name">名称 / 仓库</button>' +
      '<span class="rh-desc">一句话</span>' +
      '<span class="rh-cat">分类</span>' +
      '<button class="rh-star" type="button" data-sort="stars">★ Star</button>' +
      '<button class="rh-upd" type="button" data-sort="updated">更新</button>' +
      '<span></span><span></span>' +
      '</div>';
  }

  function syncViewUI() {
    if (!$viewSwitch) return;
    Array.prototype.forEach.call($viewSwitch.children, function (b) {
      b.setAttribute('aria-selected', b.dataset.view === state.view ? 'true' : 'false');
    });
  }

  function render() {
    writeURL();
    var terms = state.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var list = sortList(SKILLS.filter(function (s) { return matches(s, terms); }));

    $grid.className = state.view === 'list' ? 'grid list' : 'grid';
    syncViewUI();
    // 「重置全部筛选」只在有筛选条件时露出，跟筛选控件待在同一条里，不用滚回去找
    if ($filterReset) $filterReset.hidden = !isFiltered();
    if ($filterReset2) $filterReset2.hidden = !isFiltered();
    // 结果数：样板页的写法是「展示 N 个（共收录 M 个）」，一眼能看出筛掉了多少；
    // 窄屏把括号那截收掉，控件条才排得进一行
    $resultText.innerHTML = (isFiltered() ? '筛选出 ' : '展示 ') + '<b>' + list.length + '</b> 个' +
      '<span class="fb-all">（共收录 <b>' + SKILLS.length + '</b> 个）</span>';
    if ($activeFilters) $activeFilters.innerHTML = activeFiltersHTML();
    $resultHint.textContent = '';

    if (!list.length) {
      var noFilter = state.cat === 'all' && state.author === 'all' && !state.q &&
        !state.onlyImg && !state.recentOnly && !state.fav;
      if (state.fav && !favs.length) {
        $grid.innerHTML = '<div class="empty"><div class="big">收藏夹还是空的</div>' +
          '<div>卡片右上角那颗星点一下就收进来，存在本机浏览器里，换设备不会同步。</div>' +
          '<button class="empty-reset" type="button" data-reset="1">看全部 skill</button></div>';
        return;
      }
      $grid.innerHTML = '<div class="empty"><div class="big">没找到匹配的 skill</div>' +
        '<div>换个说法试试，比如「PPT」「配图」「架构图」「省 token」，或者点上面的分类</div>' +
        (noFilter ? '' : '<button class="empty-reset" type="button" data-reset="1">清空全部筛选</button>') +
        '</div>';
      return;
    }

    if (state.view === 'list') {
      $grid.innerHTML = headHTML() + list.map(rowHTML).join('');
      $grid.querySelectorAll('.rank-row').forEach(function (el, i) {
        el.style.animationDelay = Math.min(i * 12, 200) + 'ms';
      });
      syncSortUI();                      // 表头的 ▲ 要等表头插进 DOM 后再标
      initIO();
      $grid.querySelectorAll('img[data-src]').forEach(observeImg);
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

  /* ---------- 抽屉 P1–P4：三段式骨架 + 两个 tab + 数据联动 ----------
     对照 docs/drawer-spec.md。保留我们原有的：锁滚动 / aria-modal / 焦点归还 /
     ?open= 双向深链 / 减动效兜底 / 合集反链 / 同作者作品 / 上游动态。 */
  var MD_META = window.SKILLMD_META || {};       // 轻量索引，随首屏加载
  var MD_TEXT = null;                            // 440KB 正文，点开源码 tab 才注入
  var mdLoading = false;
  var drawerTab = 'overview';
  var paneScroll = { overview: 0, source: 0 };

  function mdKind(id) { return MD_META[id] || ''; }        // 'md' | 'readme' | ''
  function mdLabel(k) { return k === 'md' ? 'SKILL.md 源码透视' : (k === 'readme' ? '仓库说明' : '源码透视'); }
  function currentDrawerSkill() {
    return SKILLS.filter(function (x) { return x.id === state.openId; })[0] || null;
  }

  /* 效果图：有真图用真图；没有就用 COVER_ART 的逐仓插画（按 1.55 倍放大，见 .shot-cov-wrap） */
  function shotHTML(s, c) {
    if (s.img) return '<img class="shot-img" src="assets/img/' + esc(s.img) + '" alt="' + esc(s.name) + ' 效果演示">';
    return '<div class="shot-cov-wrap">' + CT.coverHTML(s, c) + '</div>';
  }

  var HOST_LABELS = [['npx', 'npx 通用'], ['claude', 'Claude Code'], ['cursor', 'Cursor'], ['codex', 'Codex']];
  function hostsHTML() {
    return HOST_LABELS.map(function (h) {
      return '<button type="button" class="dw-host' + (installHost === h[0] ? ' on' : '') +
        '" data-dw-host="' + h[0] + '"><i></i>' + h[1] + '</button>';
    }).join('');
  }

  /* 宿主切换时抽屉命令要跟着变 —— 样板漏掉的联动 */
  function syncDrawerCmd() {
    var s = currentDrawerSkill();
    if (!s) return;
    var txt = cmdFor(s, installHost);
    var code = document.getElementById('d-cmd');
    var btn = document.getElementById('d-copy');
    if (code) code.textContent = txt;
    if (btn) btn.setAttribute('data-copy', txt);
    Array.prototype.forEach.call(document.querySelectorAll('.dw-host'), function (h) {
      h.classList.toggle('on', h.getAttribute('data-dw-host') === installHost);
    });
  }

  /* SKILL.md 是源码，用等宽代码块；README 已经洗成纯文本摘要，用正文段落排版，
     别再套 <pre> mono，否则「读起来像一坨代码」。 */
  function fillSource(el, s, fallback) {
    if (!el) return;
    if (!MD_TEXT) { el.textContent = fallback || '正在载入…'; return; }
    var kind = mdKind(s.id);
    var text = MD_TEXT[s.id] || '';
    if (kind === 'readme') {
      var parts = text.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
      el.innerHTML = parts.length
        ? parts.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('')
        : '<p>这份 README 主要是图片和徽章，没有可提取的正文。' +
          '<a href="' + repoUrl(s) + '/blob/HEAD/README.md" target="_blank" rel="noopener">到 GitHub 看原文 ↗</a></p>';
    } else {
      el.textContent = text || '（源码快照缺失，可到仓库查看完整文件）';
    }
  }

  function loadSkillMd() {
    var s = currentDrawerSkill();
    if (!s || !mdKind(s.id)) return;
    if (MD_TEXT) { fillSource(document.getElementById('d-src'), s); return; }
    if (mdLoading) return;
    mdLoading = true;
    fillSource(document.getElementById('d-src'), s, '正在载入仓库说明…');
    var sc = document.createElement('script');
    sc.src = 'assets/js/skillmd.js';
    sc.onload = function () {
      MD_TEXT = window.SKILLMD || {};
      mdLoading = false;
      var cur = currentDrawerSkill();
      if (cur) fillSource(document.getElementById('d-src'), cur);
    };
    sc.onerror = function () {
      mdLoading = false;
      var target = document.getElementById('d-src');
      if (target) target.textContent = '源码快照加载失败，可直接到仓库查看完整文件。';
    };
    document.head.appendChild(sc);
  }

  /* 切 tab 记住各自的滚动位置，别像样板那样被内容高度骤减夹到 0 */
  function setDrawerTab(name) {
    var btn = document.querySelector('.dtab[data-dtab="' + name + '"]');
    if (!btn || btn.getAttribute('aria-disabled') === 'true') return;
    if (drawerTab === name) return;
    paneScroll[drawerTab] = $dScroll.scrollTop;
    drawerTab = name;
    Array.prototype.forEach.call(document.querySelectorAll('.dtab'), function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-dtab') === name ? 'true' : 'false');
    });
    var ov = document.getElementById('dpane-overview');
    var sr = document.getElementById('dpane-source');
    if (ov) ov.hidden = name !== 'overview';
    if (sr) sr.hidden = name !== 'source';
    if (name === 'source') loadSkillMd();
    var max = Math.max(0, $dScroll.scrollHeight - $dScroll.clientHeight);
    $dScroll.scrollTop = Math.min(paneScroll[name] || 0, max);
  }

  function syncDrawerHead(s, c) {
    var cat = document.getElementById('d-cat');
    var ver = document.getElementById('d-ver');
    var upd = document.getElementById('d-upd');
    var cr = document.getElementById('d-creator');
    var gh = document.getElementById('d-gh');
    if (cat) { cat.textContent = c.name; cat.style.setProperty('--cc', c.color); }
    if (ver) {
      if (s.ver) { ver.textContent = s.ver; ver.removeAttribute('title'); }
      else { ver.textContent = '—'; ver.title = '无 Release / Tag，以最近提交为准'; }
    }
    if (upd) upd.textContent = s.days != null ? '· ' + fmtAgo(s.days) + '更新' : '· —';
    if (cr) cr.textContent = s.author ? s.author.name : s.owner;
    if (gh) gh.href = repoUrl(s);
  }

  function shareDrawer(btn) {
    var s = currentDrawerSkill();
    if (!s) return;
    var url = location.href.split('?')[0].split('#')[0] + '?open=' + encodeURIComponent(s.id);
    var done = function () {
      btn.textContent = '✓ 已复制链接';
      btn.classList.add('done');
      setTimeout(function () { btn.textContent = '复制分享链接'; btn.classList.remove('done'); }, 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done);
    else done();
  }

  function openDrawer(s) {
    if (!s) return;
    var c = CAT_MAP[s.cat] || { color: '#888', name: s.cat };
    var kind = mdKind(s.id);
    var cmd = cmdFor(s, installHost);

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
      var gorder = CATS.map(function (cc) { return cc.key; }).filter(function (k) { return groups[k]; });
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

    function simCardHTML(o) {
      var oc = CAT_MAP[o.cat] || { color: '#888', name: o.cat };
      return '<div class="sim-item" data-id="' + o.id + '">' +
        '<div class="sim-th" style="background:linear-gradient(140deg,' + oc.color + ',' + hex2rgba(oc.color, .55) + ')">' +
        (o.img
          ? '<img src="assets/img/' + o.img + '" alt="" loading="lazy">'
          : '<span style="display:grid;place-items:center;height:100%;color:#fff;font-family:var(--serif);font-size:14px;font-weight:700">' + glyphOf(o) + '</span>') +
        '</div>' +
        '<div><div class="sim-name">' + o.name + '</div><div class="sim-meta">' + oc.name + ' · ★ ' + fmtNum(o.stars) + '</div></div>' +
        '</div>';
    }
    var sims = similarOf(s);                        // 固定 3 个，不留半空格子
    var simHTML = sims.map(simCardHTML).join('');
    var sameAuthor = s.author ? SKILLS.filter(function (o) {
      return o.id !== s.id && o.owner.toLowerCase() === s.owner.toLowerCase();
    }).sort(function (a, b) { return (b.stars || 0) - (a.stars || 0); }) : [];
    var byAuthorHTML = sameAuthor.map(simCardHTML).join('');

    var sourceInner = kind === 'md'
      ? '<pre id="d-src"></pre>'
      : (kind === 'readme'
        ? '<div class="dw-prose" id="d-src"></div>'
        : '<div class="dw-empty">该仓库没有可用的 SKILL.md / README 源码快照。<br>' +
          '<a href="' + repoUrl(s) + '/blob/HEAD/README.md" target="_blank" rel="noopener">到 GitHub 查看完整说明 ↗</a></div>');

    $dScroll.innerHTML =
      '<div class="dw-body">' +
        '<div class="dw-title-row">' +
          '<div class="dw-title-wrap">' +
            '<h2 id="d-title">' + esc(s.name) + '</h2>' +
            '<div class="dw-repo">' + esc(s.repo + (s.path ? ' / ' + s.path.replace('tree/main/', '') : '')) + '</div>' +
          '</div>' +
          '<div class="dw-stars">★ ' + esc(fmtNum(s.stars)) + '</div>' +
        '</div>' +

        '<figure class="shot"><div class="shot-in">' +
          '<div class="shot-cap"><span>' +
            (s.img ? 'LIVE OUTPUT PREVIEW · 仓库实测效果图' : 'OUTPUT PREVIEW · 按项目定位绘制的示意图') +
          '</span><span>16:10 GALLERY MATTE</span></div>' +
          '<div class="shot-canvas">' + shotHTML(s, c) + '</div>' +
        '</div></figure>' +

        '<div class="dtabs" role="tablist">' +
          '<button type="button" class="dtab" data-dtab="overview" role="tab" aria-selected="true">功能说明书与安装</button>' +
          '<button type="button" class="dtab' + (kind === 'md' ? ' mono' : '') + '" data-dtab="source" role="tab" aria-selected="false"' +
            (kind ? '' : ' aria-disabled="true"') + '>' + mdLabel(kind) + '</button>' +
        '</div>' +

        '<section class="dpane" id="dpane-overview" role="tabpanel">' +
          '<p class="dw-desc">' + esc(s.desc) + '</p>' +
          '<div class="drawer-tags dw-tags">' +
            s.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
            '<span class="tag">★ ' + esc(fmtNum(s.stars)) + '</span></div>' +
          fromHTML +
          (s.author
            ? '<button class="author-pill" data-filter-author="' + s.author.owner + '">' +
              '<span class="avatar" style="background:' + s.author.color + '">' + s.author.name.slice(0, 1) + '</span>' +
              '<b>' + s.author.name + '</b><span class="ap-note">' + s.author.note + '</span>' +
              '<span class="ap-arrow">' + authorMeta(s.author.owner, true) + ' →</span></button>'
            : '') +
          upstreamHTML(s) + subsHTML +

          '<div class="dw-install">' +
            '<div class="di-head"><span>一键安装到当前工作区</span>' +
              (kind === 'md'
                ? '<span class="di-ok">✓ 已通过 SKILL.md 规范校验</span>'
                : '<span class="di-ok" style="color:var(--ink-3)">以仓库 README 为准</span>') +
            '</div>' +
            '<div class="di-cmd"><code id="d-cmd">' + esc(cmd) + '</code>' +
              '<button id="d-copy" type="button" data-copy="' + esc(cmd) + '">复制</button></div>' +
          '</div>' +
          '<div class="dw-sec">原生兼容宿主环境 · 点一下切换</div>' +
          '<div class="dw-hosts">' + hostsHTML() + '</div>' +

          '<div class="drawer-actions">' +
            '<button class="btn btn-ghost" id="drawer-fav" type="button" data-drawer-fav="' + s.id +
              '" aria-pressed="' + (isFav(s.id) ? 'true' : 'false') + '">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z"/></svg>' +
              '<span>' + (isFav(s.id) ? '已收藏' : '收藏') + '</span></button>' +
          '</div>' +

          (sameAuthor.length
            ? '<div class="sec-label">' + s.author.name + ' 的其他作品（' + sameAuthor.length + '）</div>' +
              '<div class="sim-list">' + byAuthorHTML + '</div>'
            : '') +
          (sims.length
            ? '<div class="sec-label">同类替代 · 点击直接对比</div><div class="sim-list">' + simHTML + '</div>'
            : '') +
          '<p class="dw-hint">需要 Node.js 22+。也可以用 <b>git clone</b> 后把 skill 目录拷进 ' +
            '<code>~/.claude/skills/</code>；具体安装方式以仓库 README 为准。</p>' +
        '</section>' +

        '<section class="dpane" id="dpane-source" role="tabpanel" hidden>' +
          (kind === 'readme'
            ? '<div class="dw-src-head">摘自仓库 README · 已去除图片、徽章与代码块</div>'
            : (kind === 'md' ? '<div class="dw-src-head">SKILL.md 前 24 行 · 完整文件见仓库</div>' : '')) +
          '<div class="dw-src">' + sourceInner + '</div>' +
        '</section>' +
      '</div>';

    var wasOpen = $drawer.classList.contains('on');
    syncDrawerHead(s, c);
    drawerTab = 'overview';
    paneScroll = { overview: 0, source: 0 };
    if (!wasOpen) lastFocus = document.activeElement;
    state.openId = s.id;
    writeURL();
    $drawer.classList.add('on');
    $drawer.setAttribute('aria-hidden', 'false');
    $overlay.classList.add('on');
    document.body.style.overflow = 'hidden';
    $dScroll.scrollTop = 0;
    if (!wasOpen) setTimeout(function () { document.getElementById('drawer-close').focus(); }, 60);
  }

  function closeDrawer() {
    if (!$drawer.classList.contains('on')) return;
    var closedId = state.openId;
    state.openId = null;
    writeURL();
    $drawer.classList.remove('on');
    $drawer.setAttribute('aria-hidden', 'true');
    $overlay.classList.remove('on');
    document.body.style.overflow = '';
    // 鼠标点卡片不会让卡片获得焦点，这时 lastFocus 是 BODY；
    // 退一步按 data-id 找回那张卡片，保证 ESC 之后焦点不会掉在页面根部
    var back = lastFocus;
    if (!back || !back.isConnected || back === document.body || back === document.documentElement) {
      back = closedId
        ? document.querySelector('.card[data-id="' + closedId + '"], .rank-row[data-id="' + closedId + '"]')
        : null;
    }
    if (back && back.isConnected) back.focus();
    else {
      // 从替代方案跳过去的条目未必在当前这页 24 张卡里，最后兜底到搜索框
      var q = document.getElementById('q');
      if (q) q.focus();
      else if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    }
  }

  function syncDrawerFav() {
    var b = document.getElementById('drawer-fav');
    if (!b) return;
    var on = isFav(b.getAttribute('data-drawer-fav'));
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    var sp = b.querySelector('span');
    if (sp) sp.textContent = on ? '已收藏' : '收藏';
  }

  /* ---------- 事件 ---------- */
  function resetAll() {
    state.cat = 'all'; state.author = 'all'; state.q = '';
    state.sort = 'recommend'; state.onlyImg = false; state.recentOnly = false; state.fav = false;
    syncFilterUI();
    syncSortUI();
    render();
  }

  /* ---------- 点 logo / 站名 = 回首页 https://skills.dawsondx.top/ ----------
     href 写的是绝对地址，所以从别处点进来、中键新开、右键复制链接都正常。
     已经在本站时拦下来做「软导航」：清空所有筛选与深链、关掉抽屉、回顶部，
     结果 URL 同样变成干净的站点根，但不用整页刷新。 */
  var $brandHome = document.getElementById('brand-home');
  if ($brandHome) {
    $brandHome.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      var onSite = location.protocol === 'file:' ||
        /(^|\.)skills\.dawsondx\.top$/.test(location.hostname) ||
        /github\.io$/.test(location.hostname);
      if (!onSite) return;
      e.preventDefault();
      if ($drawer.classList.contains('on')) closeDrawer();
      state.openId = null;                 // 兜底：不带任何 ?open= 残留
      state.view = 'grid';
      resetAll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if ($activeFilters) {
    $activeFilters.addEventListener('click', function (e) {
      if (e.target.closest('[data-reset]')) { resetAll(); return; }
      var x = e.target.closest('[data-drop]');
      if (x) dropFilter(x.dataset.drop);
    });
  }

  /* 统计数字直接当入口：129 → 清空回全部、72 → 切「有演示图」、11/14 → 跳到对应筛选行。
     hero 里因此不用再写「怎么筛」的使用说明 */
  var $stats = document.querySelector('.stats');
  function scrollToFilterbar() {
    var bar = document.querySelector('.filterbar');
    if (!bar) return;
    window.scrollTo({ top: bar.offsetTop - 70, behavior: 'smooth' });
  }
  if ($stats) {
    $stats.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-stat]');
      if (!btn) return;
      var k = btn.dataset.stat;
      if (k === 'img') {
        state.onlyImg = !state.onlyImg;
        syncFilterUI();
        render();
        scrollToFilterbar();
      } else if (k === 'all') {
        resetAll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        scrollToFilterbar();
      }
    });
  }

  /* 卡片右下角的一键复制：就地变「已复制」，1.6s 还原，不打断浏览 */
  function copyInstall(btn) {
    var cmd = btn.dataset.cmd || '';
    var label = btn.querySelector('.qc-t');
    function done() {
      btn.classList.add('done');
      if (label) label.textContent = '✓ 已复制';
      setTimeout(function () {
        btn.classList.remove('done');
        if (label) label.textContent = '$ 一键复制命令';
      }, 1600);
    }
    if (navigator.clipboard && cmd) navigator.clipboard.writeText(cmd).then(done, done);
    else done();
  }

  $grid.addEventListener('click', function (e) {
    if (e.target.closest('[data-reset]')) { resetAll(); return; }
    // 表头排序：点一下按这列排，再点同一列回推荐排序
    var headBtn = e.target.closest('.rank-head [data-sort]');
    if (headBtn) {
      e.stopPropagation();
      var next = headBtn.dataset.sort;
      state.sort = state.sort === next ? 'recommend' : next;
      syncSortUI();
      render();
      return;
    }
    var qc = e.target.closest('.quick-copy');
    if (qc) {
      e.stopPropagation();
      copyInstall(qc);
      return;
    }
    var favBtn = e.target.closest('.card-fav, .rr-fav');
    if (favBtn) {
      e.stopPropagation();
      toggleFav(favBtn.dataset.fav);
      return;
    }
    var card = e.target.closest('.card, .rank-row');
    if (card) openDrawer(SKILLS.filter(function (s) { return s.id === card.dataset.id; })[0]);
  });
  $grid.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target.closest('.card-fav, .rr-fav, .quick-copy')) return;
    var card = e.target.closest('.card, .rank-row');
    if (!card) return;
    e.preventDefault();
    openDrawer(SKILLS.filter(function (s) { return s.id === card.dataset.id; })[0]);
  });

  $dScroll.addEventListener('click', function (e) {
    var drawerFav = e.target.closest('[data-drawer-fav]');
    if (drawerFav) {
      toggleFav(drawerFav.dataset.drawerFav);
      syncDrawerFav();
      return;
    }
    var authorBtn = e.target.closest('[data-filter-author]');
    if (authorBtn) {
      setAuthor(authorBtn.dataset.filterAuthor);
      closeDrawer();
      var bar = document.querySelector('.filterbar');
      if (bar) window.scrollTo({ top: bar.offsetTop - 70, behavior: 'smooth' });
      render();
      return;
    }
    var tabBtn = e.target.closest('.dtab');
    if (tabBtn) { setDrawerTab(tabBtn.getAttribute('data-dtab')); return; }
    var hostBtn = e.target.closest('[data-dw-host]');
    if (hostBtn) { setInstallHost(hostBtn.getAttribute('data-dw-host')); return; }
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
  document.getElementById('d-share').addEventListener('click', function () { shareDrawer(this); });
  $overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    // 抽屉打开时把 Tab 关在里面，别跑到背后的页面上去
    if (e.key === 'Tab' && $drawer.classList.contains('on')) {
      var canFocus = Array.prototype.filter.call(
        $drawer.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'),
        function (x) { return x.offsetParent !== null; }
      );
      if (!canFocus.length) return;
      var firstF = canFocus[0], lastF = canFocus[canFocus.length - 1];
      if (e.shiftKey && document.activeElement === firstF) { e.preventDefault(); lastF.focus(); }
      else if (!e.shiftKey && document.activeElement === lastF) { e.preventDefault(); firstF.focus(); }
      return;
    }
    if (e.key === 'Escape') {
      if ($modal && !$modal.hidden) { closeModal(); return; }
      if ($favPop && !$favPop.hidden) { setFavOpen(false); if ($favBtn) $favBtn.focus(); return; }
      if ($authorMenu && !$authorMenu.hidden) { setAuthorOpen(false); if ($authorBtn) $authorBtn.focus(); return; }
      if ($sortMenu && !$sortMenu.hidden) { setSortOpen(false); if ($sortBtn) $sortBtn.focus(); return; }
      if ($drawer.classList.contains('on')) closeDrawer();
      return;
    }
    // D 切换日夜纸墨；正在输入时让位给文字
    if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var el = document.activeElement;
      var typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      if (!typing && !document.body.classList.contains('modal-open')) {
        e.preventDefault();
        toggleTheme();
      }
      return;
    }
    if (e.key === '/' && document.activeElement !== $q && !document.body.classList.contains('sort-open')) {
      e.preventDefault();
      $q.focus();
      $q.select();
    }
  });

  /* ---------- 收藏夹浮层 / 安装器 ---------- */
  if ($favBtn) {
    $favBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setFavOpen($favPop.hidden);
    });
  }
  if ($favPop) {
    $favPop.addEventListener('click', function (e) {
      e.stopPropagation();
      if (e.target.closest('[data-fav-clear]')) {
        favs = []; favMap = {};
        saveFavs(); renderFavPop(); syncFavCount(); syncFilterUI(); render();
        return;
      }
      var rm = e.target.closest('[data-fav-remove]');
      if (rm) { toggleFav(rm.dataset.favRemove); return; }
      var op = e.target.closest('[data-fav-open]');
      if (op) {
        setFavOpen(false);
        var t = SKILLS.filter(function (s) { return s.id === op.dataset.favOpen; })[0];
        if (t) openDrawer(t);
      }
    });
    document.addEventListener('click', function (e) {
      if ($favPop.hidden || e.target.closest('.fav-wrap')) return;
      setFavOpen(false);
    });
  }

  /* 宿主切换：安装器 tab、抽屉里的兼容矩阵、抽屉里的安装命令三处一起更新 */
  function setInstallHost(host) {
    if (!HOSTS[host]) return;
    installHost = host;
    if ($instTabs) {
      Array.prototype.forEach.call($instTabs.children, function (x) {
        x.setAttribute('aria-selected', x.getAttribute('data-host') === host ? 'true' : 'false');
      });
    }
    paintInstaller();
    if ($drawer.classList.contains('on')) syncDrawerCmd();
  }

  var $instTabs = document.querySelector('.inst-tabs');
  if ($instTabs) {
    $instTabs.addEventListener('click', function (e) {
      var b = e.target.closest('.inst-tab');
      if (b) setInstallHost(b.getAttribute('data-host'));
    });
  }
  var $instCopy = document.getElementById('inst-copy');
  if ($instCopy) {
    $instCopy.addEventListener('click', function () {
      var txt = cmdFor(spotlight, installHost);
      var label = $instCopy.querySelector('span');
      var done = function () {
        $instCopy.classList.add('done');
        if (label) label.textContent = '已复制';
        setTimeout(function () {
          $instCopy.classList.remove('done');
          if (label) label.textContent = '复制命令';
        }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, done);
      else done();
    });
  }

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
    if (p.get('view') === 'list') state.view = 'list';
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
    if (state.view !== 'grid') p.set('view', state.view);
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
    if (p.fetchedAt) { UPS_AT = p.fetchedAt; syncBrandVol(UPS_AT); }
    return changed;
  }

  function refreshUpstream() {
    if (!window.fetch || location.protocol === 'file:') return;
    // 静态托管（GitHub Pages）没有 api 端点：请求失败就保留内置快照的日期，不清空
    function keepSeed() { setFreshHint({ source: 'seed', fetchedAt: UPS_AT }); }
    fetch('api/upstream', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (p) {
        if (!p) { keepSeed(); return; }
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
      .catch(keepSeed);
  }

  /* ---------- 启动 ---------- */
  function syncTopH() {
    var tb = document.querySelector('.topbar');
    if (tb) document.documentElement.style.setProperty('--top-h', tb.offsetHeight + 'px');
  }
  window.addEventListener('resize', syncTopH);
  window.addEventListener('load', syncTopH);

  readURL();
  buildCats();
  buildAuthorMenu();
  syncFilterUI();          // 把 URL 带进来的状态回写到场景 tabs / 创作者下拉 / 搜索框 / 统计入口
  syncSortUI();
  syncViewUI();

  /* ---------- 接管构建期预渲染的首屏卡片 ----------
     _tools/prerender.mjs 已经把「推荐排序」前 24 张卡写进 #grid。默认状态首次访问时
     直接复用这批 DOM（点击已由 #grid 上的事件委托兜住），不再整屏 innerHTML 重建，
     省掉一次重排 —— 这正是 CLS 的来源。
     以下情况照常 render()：带筛选/深链接参数、有回访快照（要补「新增 / 有更新」角标）、
     静态数据不是这两天的（相对时间「X 天前」会偏）。 */
  function hydrateStatic() {
    $resultText.innerHTML = '展示 <b>' + SKILLS.length + '</b> 个' +
      '<span class="fb-all">（共收录 <b>' + SKILLS.length + '</b> 个）</span>';
    $resultHint.textContent = '';
    if ($activeFilters) $activeFilters.innerHTML = '';
    initIO();
    $grid.querySelectorAll('img[data-src]').forEach(observeImg);
  }
  function canHydrate() {
    if (prevSnap || !$grid.querySelector('.card')) return false;
    if (state.view !== 'grid') return false;      // 榜单视图要自己铺行，别接管静态卡
    if (state.cat !== 'all' || state.author !== 'all' || state.q) return false;
    if (state.onlyImg || state.recentOnly || state.openId) return false;
    if (state.sort !== 'recommend') return false;
    var age = UPS_AT ? CT.daysSince(UPS_AT) : null;   // 数据抓取日距今
    return age != null && age >= 0 && age <= 2;
  }

  if (canHydrate()) hydrateStatic(); else render();
  syncTopH();

  /* ---------- 首屏静态块的首次填充（不挂在交互上，否则要等用户点一下才出现） ---------- */
  applyTheme(currentTheme());   // 内联脚本已定好 data-theme，这里只补按钮状态
  syncFavCount();
  renderFavPop();
  paintInstaller();
  renderPulse();
  if (state.openId) {
    var target = SKILLS.filter(function (s) { return s.id === state.openId; })[0];
    if (target) openDrawer(target);
  }
  setFreshHint({ source: 'seed', fetchedAt: UPS_AT });
  refreshUpstream();
})();
