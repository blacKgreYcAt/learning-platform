/* ═══════════════════════════════════════════════════════════
   自然科綜合版．四年級下學期 — 「下一任務」沒反應的修正（2026-11-04）

   不改動 index.html 的原有程式，只在它之後包一層。
   拿掉頁尾那一行 <script> 就完全還原。

   ── 原本壞在哪 ──
   每個遊戲畫面最下方都常駐一顆「下一任務」。按下去時，各自的
   next*Task() 會先檢查這一關到底完成了沒；沒完成就：

       console.log('⚠️ 請先完成遊戲任務！');
       return;

   問題是這句話只進開發者工具的 console，畫面上一個字也沒有。
   小孩看到的就是：按鈕明明在那裡，按了完全沒反應。

   實際量過（力的特性那一關）：
     未完成時按 → 畫面停在 screen-game-force，currentGame 還是 1-1
     把關卡標記完成再按 → currentGame 變 1-2，功能本身是好的

   所以不是導覽壞掉，是「擋下來的時候沒告訴人為什麼」。

   ── 怎麼修 ──
   包住這六個有檢查的函式。呼叫原函式前後各記一次「現在顯示哪個
   畫面 + currentGame」，如果兩次完全一樣，就代表它被自己的檢查
   擋下來了，這時候跳一個提示條說明還差什麼。

   刻意不去重寫那些檢查條件 —— 條件留在原本的程式裡，這裡只判斷
   「有沒有真的發生事情」。日後原本的條件改了，這層仍然正確，
   最多只是提示文字需要跟著更新。

   nextEarthTask / nextEnergyConvTask 沒有包：它們會自動把當前關卡
   標記為完成，不會有擋下來卻沒反應的情況。
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* 只有提示文字寫在這裡，判斷條件不複製一份。 */
  var HINTS = {
    nextForceTask:     '還沒完成：把木箱拖到綠色目標區，才算推動成功',
    nextHydraulicTask: '還沒完成：三個關卡都要通過才能前進',
    nextFluidTask:     '還沒完成：三個關卡都要通過才能前進',
    nextCircuitTask:   '還沒完成：三個電路關卡都要通過才能前進',
    nextConductorTask: '還沒完成：要把所有良導體都找出來',
    nextEnergyTask:    '還沒完成：四個耗電問題都要修正完'
  };

  /* ── 提示條 ───────────────────────────────────── */
  var STYLE_ID = 'next-task-hint-style';
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '.next-task-hint{',
      '  position:fixed; left:50%; bottom:28px; transform:translateX(-50%) translateY(12px);',
      '  z-index:9999; max-width:min(90vw,560px);',
      '  padding:14px 22px; border:3px solid var(--ink-black,#0A1216); border-radius:0;',
      '  background:var(--ink-gold,#FFB03A); color:var(--ink-black,#0A1216);',
      '  font-size:17px; font-weight:800; line-height:1.45; text-align:center;',
      '  box-shadow:6px 6px 0 var(--ink-black,#0A1216);',
      '  opacity:0; pointer-events:none; transition:opacity .16s, transform .16s;',
      '}',
      '.next-task-hint.is-on{ opacity:1; transform:translateX(-50%) translateY(0); }',
      '@media (prefers-reduced-motion:reduce){ .next-task-hint{ transition:none; } }'
    ].join('\n');
    document.head.appendChild(s);
  }

  var hintEl = null;
  var hintTimer = null;

  /* 記住最後按到的按鈕，提示條才能貼在它上面，而不是蓋住它。
     用捕獲階段，確保比 onclick 先跑到。 */
  var lastBtn = null;
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('button');
    if (b) lastBtn = b;
  }, true);

  /* 預設貼在畫面底部，但那裡常常正好是「下一任務」自己。
     有抓到按鈕就改成浮在它正上方；太靠上就夾回安全範圍。 */
  function place() {
    var gap = 14;
    var bottom = 28;
    if (lastBtn && document.body.contains(lastBtn)) {
      var r = lastBtn.getBoundingClientRect();
      if (r.height) {
        bottom = window.innerHeight - r.top + gap;
        var max = window.innerHeight - hintEl.offsetHeight - 12;
        if (bottom > max) bottom = Math.max(12, max);
      }
    }
    hintEl.style.bottom = bottom + 'px';
  }

  function showHint(msg) {
    ensureStyle();
    if (!hintEl) {
      hintEl = document.createElement('div');
      hintEl.className = 'next-task-hint';
      // 讀螢幕軟體也要聽得到，不然視覺以外的人一樣不知道被擋住了
      hintEl.setAttribute('role', 'status');
      hintEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(hintEl);
    }
    hintEl.textContent = msg;
    // 先量高度再定位，不然 offsetHeight 還是上一則訊息的
    place();
    // 強制重排，連按兩次才會重新播放淡入
    void hintEl.offsetWidth;
    hintEl.classList.add('is-on');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () {
      hintEl.classList.remove('is-on');
    }, 2600);
  }

  /* ── 有沒有真的發生事情 ───────────────────────── */
  function stateKey() {
    var shown = [];
    document.querySelectorAll('.screen').forEach(function (el) {
      if (getComputedStyle(el).display !== 'none') shown.push(el.id);
    });
    // 同一章換任務時畫面 id 不會變（例如液壓三關都是同一個 screen），
    // 所以要連 currentGame 一起看。
    var game = '';
    try {
      if (typeof currentGame !== 'undefined') game = String(currentGame);
    } catch (e) { /* 還沒宣告就當空字串 */ }
    return shown.join(',') + '|' + game;
  }

  Object.keys(HINTS).forEach(function (name) {
    var orig = window[name];
    if (typeof orig !== 'function') {
      console.warn('[next-task-fix] 找不到 ' + name + '，略過');
      return;
    }
    window[name] = function () {
      var before = stateKey();
      var result = orig.apply(this, arguments);
      if (stateKey() === before) showHint(HINTS[name]);
      return result;
    };
  });
})();
