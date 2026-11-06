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

  /* opt: { cat: {name,color}, mark: 'new' | 'upd' | '' } */
  function cardHTML(s, opt) {
    opt = opt || {};
    var c = opt.cat || { color: '#888', name: s.cat };
    var mark = opt.mark || '';
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
    cardHTML: cardHTML,
    recommendOrder: recommendOrder
  };
})(typeof window !== 'undefined' ? window : globalThis);
