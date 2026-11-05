/* ═══════════════════════════════════════════════════════════
   星際數學探險．四年級下學期 — 分頁切換修正（2026-11-04）

   不改動 index-g4b-20260807.html 的原有程式，只在它之後覆寫兩個
   導覽函式。拿掉頁尾那一行 <script> 就完全還原。

   ── 原本壞在哪 ──
   這一頁的分頁切換混用了兩套機制：CSS 的 .active class，以及直接
   寫 element.style.display。兩套各有程式在用，於是互相打架：

   1) 「遊戲化關卡」頁最下方的返回首頁沒反應
      backToHome() 只做兩件事：把 homePage 設成 flex、把 cardModePage
      的 .active 拿掉。它從頭到尾沒碰過 gameModePage。
      所以在遊戲選單頁按下去，gameModePage 仍然是 display:block
      留在畫面上，而且人就停在頁面底部，看起來就是「按了沒用」。

   2) 走過時間換算再進卡牌模式會整頁空白（同一個根因的另一面）
      backToTimeConversion() 很完整，會把 cardModePage 的 inline
      display 設成 none。但 goToCardMode() 只加 .active ——
      inline 樣式優先權高於 class，蓋不過去，於是三個頁面全都是
      none，整頁空白。

   ── 怎麼修 ──
   回首頁時，把每個分頁的 .active 拿掉，並且把 inline display 清成
   空字串（還給 CSS 決定），而不是寫死 none。這樣下次進任何模式，
   單靠 .active 就能正常顯示，不會再被殘留的 inline 樣式擋住。

   卡牌模式自己的狀態重置（currentQuestions / currentIndex）仍交給
   原本的 backToHome 做，這裡不重寫，避免兩邊各寫一份而走鐘。
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // homePage 不列入：它是靠 inline display 控制的底層頁。
  var PAGES = [
    'cardModePage',
    'gameModePage',
    'gamePlayPage',
    'timeConversionPage',
    'timeConversionQuizPage'
  ];

  // 先接住原本的版本，狀態重置還是用它的。
  var origBackToHome = window.backToHome;

  function goHome() {
    if (typeof origBackToHome === 'function') {
      try {
        origBackToHome();      // 只為了它的 currentQuestions / currentIndex 歸零
      } catch (e) {
        // 原函式壞掉也不能卡住返回，剩下的照做
        console.warn('[g4b-nav-fix] 原本的 backToHome 丟出例外：', e);
      }
    }

    PAGES.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('active');
      el.style.display = '';   // 清掉 inline，交還給 class 決定
    });

    var home = document.getElementById('homePage');
    if (home) home.style.display = 'flex';

    // 原本的 backToHome 沒有捲回頂端，在長頁面按完會停在底部，
    // 看起來也像沒反應。
    window.scrollTo(0, 0);
  }

  window.backToHome = goHome;
  // 時間換算頁的「← 返回首頁」本來是另一份幾乎一樣的實作，
  // 就是它留下 inline display:none 造成第 2 個問題。統一成同一個。
  window.backToTimeConversion = goHome;
})();
