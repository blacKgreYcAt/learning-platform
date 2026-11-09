/**
 * 闖關站 — 每個單元上面加一條「先看教學」
 * 2026-11-09
 *
 * 為什麼要有這一份：
 *   引導式教學（星際數學探險）從頭到尾都還在，一個檔案都沒刪。
 *   問題是 11/06 改版之後首頁按年級過濾，而那些引導式 App 只做到四年級，
 *   五上就只剩題庫看得見 —— 看起來像「只剩題庫」，實際是「五上的教學還沒做」。
 *   這一份補的是另一半：小孩已經在題庫裡面、正卡在某個單元的時候，
 *   直接給他一條路回到那個單元的教學，而不是要他退回首頁自己找。
 *
 * 做法：
 *   不改殼。用 MutationObserver 看著 #view，每次畫出單元清單就把教學條插進去。
 *   殼完全不知道這一份存在，刪掉 index.html 裡那一行 <script> 就全部還原。
 *
 * 對照表怎麼來的：
 *   題庫是康軒版，引導教學當初照翰林版的單元順序做。兩邊的「單元」切法不同，
 *   但 108 課綱的觀念是同一套，所以用觀念對應，不是用單元編號對應。
 *   只有真的在教那個觀念才連 —— 寧可少連一條，也不要讓小孩點進去發現不是他要的。
 *   還沒有教學的格子就不顯示，缺口要看得見。
 */

'use strict';

(function () {
  if (!window.QUEST) return;

  var M = '../math-science-app/?grade=5-1&unit=';

  /**
   * 科目|年級|學期 → 單元名 → 教學連結
   *
   * label 寫的是「那份教學實際在教什麼」，不是題庫單元的名字。
   * 名字不一樣是刻意的：小孩點進去看到的標題會跟 label 對得上。
   */
  var TEACH = {
    '數學|5|上': {
      '因數與倍數': [
        { label: '倍數與因數', url: M + 'g5-u02-factors' },
        { label: '公因數與公倍數', url: M + 'g5-u04-common' },
      ],
      '分數的加減': [
        { label: '擴分、約分與異分母加減', url: M + 'g5-u07-fractions' },
      ],
      '整數的四則運算與小數乘法': [
        // 小數乘法這一塊引導教學還沒做，所以只連四則運算，標題也不假裝有。
        { label: '四則運算的順序與併式', url: M + 'g5-u06-operations' },
      ],
      '多邊形與面積': [
        { label: '角、三角形與四邊形', url: M + 'g5-u03-plane' },
        { label: '面積公式是怎麼來的', url: M + 'g5-u08-area' },
      ],
      '容積、容量與線對稱': [
        // 立體形體不等於容積，但是容積的先備觀念，標籤要講清楚是哪一個。
        { label: '立體形體（容積的先備觀念）', url: M + 'g5-u05-solids' },
      ],
    },
  };

  var crumb = document.getElementById('crumb');
  var view = document.getElementById('view');
  if (!crumb || !view) return;

  /** 現在畫面上是哪一科？麵包屑的 <b> 就是科目名。 */
  function scopeKey() {
    var b = crumb.querySelector('b');
    var s = window.QUEST.DB && window.QUEST.DB.setup;
    if (!b || !s) return null;
    return b.textContent.trim() + '|' + s.grade + '|' + s.term;
  }

  function strip(list) {
    var html = '<div class="teach-strip"><span class="teach-lead">先看教學</span>' +
      list.map(function (t) {
        return '<a class="teach-link" href="' + t.url + '">' +
          t.label.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</a>';
      }).join('') + '</div>';
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.firstChild;
  }

  function decorate() {
    var map = TEACH[scopeKey()];
    if (!map) return;

    var hs = view.querySelectorAll('h2');
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i];
      // 單元標題長這樣：「🔢 單元 1　因數與倍數」。對不上就不是單元清單，跳過。
      var m = /單元\s*\d+[\s　]+(.+)$/.exec(h.textContent.trim());
      if (!m) continue;

      var list = map[m[1].trim()];
      if (!list) continue;

      var next = h.nextElementSibling;
      if (next && next.classList.contains('teach-strip')) continue;   // 已經插過了
      h.parentNode.insertBefore(strip(list), next);
    }
  }

  /* 殼每次換畫面都是重寫 #view.innerHTML，所以看 childList 就夠。
     decorate 自己會跳過插過的，重複觸發不會長出兩條。 */
  new MutationObserver(decorate).observe(view, { childList: true });
  decorate();
})();
