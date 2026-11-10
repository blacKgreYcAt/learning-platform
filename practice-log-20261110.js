/* 練習紀錄（2026-11-10）

   為什麼要有這一支：
   家長檢視頁能看出「他哪一科弱、哪幾題卡住」，但是看不出
   「他最近到底有沒有在練」。成績只留最佳紀錄，所以一個月練十次
   跟一個月練一次，在那一頁上長得一模一樣。

   這一支只做一件事：每次練習結束寫一筆流水帳。

   2026-11-10 晚一點搬到根目錄：本來只有闖關站要用，
   後來引導式教學也要記，放在 quest/ 底下就讀起來很怪。
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
      /* 做了題、花了時間、讀了段落、或者把單元走完 ——
         四種任一都算練習。
         引導教學可能一段都沒前進（只是回頭再讀一次），
         但是那十分鐘是真的坐在那邊讀，不能當成沒練。
         反過來，走完一個單元但是快到不足一秒（測試、或者本來就
         讀過只是再翻一次）也不該被丟掉。 */
      if (!rec) return;
      if (!rec.n && !rec.sec && !rec.steps && !rec.done) return;
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
        sec: rec.sec ? Math.round(rec.sec) : null,
        /* 引導教學專用：這次往前讀了幾段、有沒有把單元走完。
           闖關類的紀錄沒有這兩個欄位。 */
        steps: typeof rec.steps === 'number' ? rec.steps : undefined,
        done: rec.done ? true : undefined
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

  /* ──────────────────────────────────────────────────────────────
     引導式教學的紀錄

     闖關有明確的「結束」可以掛鉤，引導教學沒有 —— 小孩可能讀兩段就
     跑去吃飯，明天再回來讀三段。所以這裡記的是「一次造訪」：
     從打開單元到離開（關頁面、回單元地圖、或換去別的單元）之間，
     前進了幾段、花了多少時間。

     時間只在分頁真的看得到的時候才累加。不然他開著頁面去睡覺，
     隔天就會變成「練了十四個小時」，那個數字一點用都沒有。
     單次上限兩小時，再長一定是忘了關。
     ────────────────────────────────────────────────────────────── */
  var VISIBLE_ONLY = true;
  var CAP_MS = 2 * 60 * 60 * 1000;
  var sess = null;

  function activeNow() {
    if (!sess) return 0;
    return Math.min(sess.active, CAP_MS);
  }

  /** 把累積時間推進到現在。分頁隱藏的那段不算。 */
  function tick() {
    if (!sess) return;
    var now = Date.now();
    if (!VISIBLE_ONLY || !document.hidden) sess.active += now - sess.tickedAt;
    sess.tickedAt = now;
  }

  /** 找出這個單元屬於哪一科。lesson/ 的單元查得到 pack，
      星際數學探險（g5-uXX）沒有 pack，但它整套都是數學。 */
  function describe(unit) {
    var packs = window.LESSON_PACKS || [];
    for (var i = 0; i < packs.length; i++) {
      var hit = packs[i].units.filter(function (u) { return u.id === unit.id; })[0];
      if (hit) {
        return { subject: packs[i].subject, grade: packs[i].grade, term: packs[i].term };
      }
    }
    if (/^g5-u\d/.test(unit.id || '')) return { subject: '數學', grade: 5, term: '上' };
    return { subject: '', grade: unit.grade || null, term: '' };
  }

  function flush() {
    if (!sess) return;
    tick();
    var advanced = Math.max(0, sess.at - sess.from);
    var sec = Math.round(activeNow() / 1000);
    /* 進去又馬上出來的不記。沒前進、又待不到一分鐘，那不是讀書。 */
    if ((advanced || sess.done) || sec >= 60) {
      var d = describe(sess.unit);
      window.QUEST_LOG({
        kind: 'lesson',
        subject: d.subject, grade: d.grade, term: d.term,
        where: String(sess.unit.title || sess.unit.id || '').replace(/^單元 \d+　/, ''),
        n: 0,                       // 引導教學沒有題數，別混進「做了幾題」
        steps: advanced,            // 這次往前讀了幾段
        done: !!sess.done,
        sec: sec
      });
    }
    sess = null;
  }

  window.LESSON_LOG = {
    /** 進入一個單元（LessonEngine.start）。換單元時先把上一段結掉。 */
    enter: function (unit, fromIndex) {
      flush();
      if (!unit) return;
      sess = { unit: unit, from: fromIndex || 0, at: fromIndex || 0,
               active: 0, tickedAt: Date.now(), done: false };
    },
    /** 翻到下一段（LessonEngine._go）。 */
    step: function (index) { tick(); if (sess) sess.at = index; },
    /** 整個單元走完（LessonEngine._finish）。 */
    finish: function () { if (sess) { sess.done = true; flush(); } },
  };

  document.addEventListener('visibilitychange', tick);
  window.addEventListener('lesson:exit', flush);
  /* pagehide 比 beforeunload 可靠，手機切走也會觸發。 */
  window.addEventListener('pagehide', flush);
})();
