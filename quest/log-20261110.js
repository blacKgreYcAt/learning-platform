/* 練習紀錄（2026-11-10）

   為什麼要有這一支：
   家長檢視頁能看出「他哪一科弱、哪幾題卡住」，但是看不出
   「他最近到底有沒有在練」。成績只留最佳紀錄，所以一個月練十次
   跟一個月練一次，在那一頁上長得一模一樣。

   這一支只做一件事：每次練習結束寫一筆流水帳。
   {t 時間, kind 哪一種練習, subject 科目, where 哪一課, n 題數, score 答對, sec 花了幾秒}

   設計上刻意不碰任何既有資料：
   - 自己一個 localStorage key，跟 quest-20261105 完全分開。
     就算這份紀錄壞掉或被清掉，成績、錯題、複習排程都不受影響。
   - 只提供 window.QUEST_LOG()，由三個練習流程各自在結束時呼叫一次。
     拿掉這一行 <script>，那三個呼叫會變成 no-op，整站照常運作。

   保留策略：超過半年的刪掉，再多也只留最後 600 筆。
   家長檢視頁只看最近兩週，留半年是為了之後想看長期趨勢時還有料。 */
(function () {
  'use strict';

  var KEY = 'practice-log-20261110';
  var KEEP_DAYS = 180;
  var MAX = 600;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Object.prototype.toString.call(arr) === '[object Array]' ? arr : [];
    } catch (e) { return []; }
  }

  /** 寫一筆。任何一個欄位壞掉都不該讓練習流程爆掉，所以整段包起來。 */
  window.QUEST_LOG = function (rec) {
    try {
      if (!rec || !rec.n) return;                 // 沒題數的不記
      var log = load();
      log.push({
        t: Date.now(),
        kind: rec.kind || 'quest',                 // quest | exam | review
        subject: rec.subject || '',
        grade: rec.grade || null,
        term: rec.term || '',
        where: rec.where || '',
        n: rec.n,
        score: typeof rec.score === 'number' ? rec.score : null,
        sec: rec.sec ? Math.round(rec.sec) : null
      });

      var cut = Date.now() - KEEP_DAYS * 86400000;
      log = log.filter(function (e) { return e.t >= cut; });
      if (log.length > MAX) log = log.slice(log.length - MAX);

      localStorage.setItem(KEY, JSON.stringify(log));
    } catch (e) { /* 存不進去就算了，練習不能因為記帳失敗而中斷 */ }
  };

  /** 給家長檢視頁用的讀取口，省得那邊再寫一次 key 和容錯。 */
  window.QUEST_LOG.read = load;
  window.QUEST_LOG.KEY = KEY;
})();
