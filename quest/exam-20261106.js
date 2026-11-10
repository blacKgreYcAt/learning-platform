/**
 * 月考測驗卷（2026-11-06）
 *
 * 跟闖關模式的差別，就是真實考試的差別：
 *   闖關  一課十題，答完一題馬上告訴你對不對、為什麼
 *   測驗卷 整份寫完才給分，寫的時候沒有任何提示
 * 會做這個，是因為孩子一題一題看解析時都「會」，
 * 但整份考卷混在一起、跨單元、沒有提示時就不一定了。
 *
 * 規則：
 *   - 從所選範圍（期中／期末／全冊）的所有課裡隨機抽題
 *   - 每次重抽、重新洗牌，選項順序也重洗，所以同一份卷考兩次不會一樣
 *   - 一份 40 題（題庫不足就有多少出多少）
 *   - 可以跳題、可以回頭改，交卷前會提醒還有幾題沒寫
 *   - 交卷後列出所有錯題和解析，錯題自動進錯題本
 *   - 記錄最佳成績，跟闖關的進度分開存
 *
 * 這個檔案是外掛：quest/index.html 導出 window.QUEST 之後會呼叫
 * window.QUEST_EXAM_INIT()。拿掉這個 <script> 就完全回到沒有測驗卷的樣子。
 */

'use strict';

window.QUEST_EXAM_INIT = function () {

  var Q = window.QUEST;
  if (!Q) { console.warn('[exam] 找不到 window.QUEST，測驗卷沒有啟用'); return; }

  var PAPER_SIZE = 40;
  var BEST_KEY = 'examBest';          // 存在 QUEST.DB 底下，跟闖關進度分開
  Q.DB[BEST_KEY] = Q.DB[BEST_KEY] || {};

  var run = null;   // 進行中的考卷

  /* ── 樣式：沿用闖關站既有的 class，只補測驗卷專屬的幾個 ── */
  var css = document.createElement('style');
  css.textContent = [
    '.exam-head{display:flex;align-items:center;gap:.8rem;flex-wrap:wrap;margin-bottom:1rem}',
    '.exam-timer{font-weight:900;color:var(--gold);font-variant-numeric:tabular-nums}',
    /* 題號方格：一眼看出哪幾題還沒寫 */
    '.exam-map{display:flex;flex-wrap:wrap;gap:.35rem;margin:.9rem 0 1.2rem}',
    '.exam-map button{font:inherit;font-size:.78rem;font-weight:800;cursor:pointer;',
    '  width:2rem;height:2rem;border-radius:7px;color:var(--dim);',
    '  background:rgba(255,255,255,.03);border:2px solid rgba(255,255,255,.14)}',
    '.exam-map button.done{color:var(--text);border-color:var(--accent);background:rgba(var(--accent-rgb),.14)}',
    '.exam-map button.here{outline:2px solid var(--gold);outline-offset:1px}',
    '.exam-foot{margin-top:1.2rem;display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}',
    '.exam-foot .spacer{flex:1 1 auto}',
    /* 交卷後的逐題檢討 */
    '.ri.ok{background:rgba(169,214,54,.08);border-left-color:var(--good)}',
    '.ri-yours{color:var(--bad)}',
    '@media (max-width:480px){.exam-map button{width:1.8rem;height:1.8rem;font-size:.72rem}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ── 抽題 ──
     把範圍內每一課的每一題攤平，洗牌後取前 N 題。
     不平均分配到各課 —— 題數多的課本來就該多考一點，這樣比較接近真的考卷。 */
  function buildPaper(b, range) {
    var pool = [];
    Q.unitsInRange(b, range).forEach(function (u) {
      u.lessons.forEach(function (l) {
        l.quiz.forEach(function (q) {
          pool.push({ q: q, where: b.subject + '・' + u.name + '・' + l.name });
        });
      });
    });
    return Q.shuffle(pool).slice(0, PAPER_SIZE).map(function (it) {
      // 選項也要重洗，否則答案位置固定，背位置就能過
      var pairs = Q.shuffle(it.q.choices.map(function (text, i) {
        return { text: text, right: i === it.q.correct };
      }));
      return { q: it.q, where: it.where, pairs: pairs, picked: null };
    });
  }

  function fmtTime(ms) {
    var s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  function bestKeyOf(b, range) { return Q.bankId(b) + '/' + range; }

  /* ═══ 選卷 ═══ */
  function renderPicker() {
    run = null;
    Q.backBtn.hidden = false;
    Q.backBtn.onclick = Q.home;

    var banks = Q.banksFor(Q.DB.setup);
    var s = Q.DB.setup;
    Q.crumb.innerHTML = '<b>月考測驗卷</b>　' + s.grade + '年級' + s.term + '學期';

    if (!banks.length) {
      Q.view.innerHTML = '<div class="quiz"><div class="q-text">這個年級學期還沒有題庫</div>' +
        '<p class="empty">先去設定換一個年級，或回首頁看看別的。</p></div>';
      Q.setFoot('');
      return;
    }

    var html = '<h1>📝 月考<span>測驗卷</span></h1>' +
      '<p class="lede">整份寫完才給分，寫的時候不會告訴你對不對 —— 跟真的考試一樣。' +
      '每次都重新抽題、重新洗選項，同一份考兩次不會一樣。</p>';

    banks.forEach(function (b) {
      html += '<h2>' + (b.icon || '') + ' ' + Q.esc(b.subject) + '</h2><div class="grid">';
      Q.RANGES.forEach(function (r) {
        var n = 0;
        Q.unitsInRange(b, r[0]).forEach(function (u) {
          u.lessons.forEach(function (l) { n += l.quiz.length; });
        });
        var size = Math.min(PAPER_SIZE, n);
        var best = Q.DB[BEST_KEY][bestKeyOf(b, r[0])];
        html += '<button class="card" data-exam="' + Q.bankId(b) + '" data-range="' + r[0] + '">' +
          '<div class="card-name">' + r[1] + '</div>' +
          '<div class="card-sub">從 ' + n + ' 題裡抽 ' + size + ' 題</div>' +
          '<div class="card-meta">' +
            (best ? '最佳 ' + best.score + '/' + best.total + '（' + Math.round(best.score / best.total * 100) + ' 分）' : '還沒考過') +
          '</div></button>';
      });
      html += '</div>';
    });

    Q.view.innerHTML = html;
    Q.view.querySelectorAll('[data-exam]').forEach(function (el) {
      el.addEventListener('click', function () {
        var b = banks.filter(function (x) { return Q.bankId(x) === el.dataset.exam; })[0];
        if (b) start(b, el.dataset.range);
      });
    });
    Q.setFoot('成績只存在這台瀏覽器裡。');
    Q.top();
  }

  /* ═══ 作答 ═══ */
  function start(b, range) {
    var items = buildPaper(b, range);
    if (!items.length) { renderPicker(); return; }
    run = { b: b, range: range, items: items, i: 0, startedAt: Date.now(), done: false };
    renderQ();
  }

  function answered() {
    return run.items.filter(function (it) { return it.picked !== null; }).length;
  }

  function renderQ() {
    var it = run.items[run.i];
    Q.backBtn.hidden = false;
    Q.backBtn.onclick = function () {
      if (confirm('離開會放棄這份考卷，確定嗎？')) { run = null; renderPicker(); }
    };
    Q.crumb.innerHTML = '<b>' + Q.esc(run.b.subject) + ' 測驗卷</b>　' +
      (Q.RANGES.filter(function (r) { return r[0] === run.range; })[0] || ['', ''])[1];

    var html = '<div class="quiz">' +
      '<div class="exam-head">' +
        '<span>第 <b>' + (run.i + 1) + '</b> 題 / ' + run.items.length + '</span>' +
        '<span class="spacer" style="flex:1"></span>' +
        '<span>已寫 ' + answered() + '</span>' +
        '<span class="exam-timer" id="exam-timer">' + fmtTime(Date.now() - run.startedAt) + '</span>' +
      '</div>' +
      '<div class="exam-map">' +
        run.items.map(function (x, i) {
          return '<button data-go="' + i + '" class="' +
            (x.picked !== null ? 'done ' : '') + (i === run.i ? 'here' : '') + '">' + (i + 1) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="q-text">' + Q.esc(it.q.q) + '</div>' +
      '<div class="opts">' +
        it.pairs.map(function (p, i) {
          // 作答中不顯示對錯，只顯示「這題我選了哪個」
          return '<button class="opt' + (it.picked === i ? ' right' : '') + '" data-pick="' + i + '">' +
            Q.esc(p.text) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="exam-foot">' +
        '<button class="btn ghost sm" id="ex-prev"' + (run.i === 0 ? ' disabled' : '') + '>← 上一題</button>' +
        '<button class="btn ghost sm" id="ex-next"' + (run.i === run.items.length - 1 ? ' disabled' : '') + '>下一題 →</button>' +
        '<span class="spacer"></span>' +
        '<button class="btn" id="ex-submit">交卷</button>' +
      '</div>' +
    '</div>';

    Q.view.innerHTML = html;

    Q.view.querySelectorAll('[data-pick]').forEach(function (el) {
      el.addEventListener('click', function () {
        it.picked = +el.dataset.pick;
        // 選完自動往下一題，但最後一題停著不動（不然會跳回開頭很怪）
        if (run.i < run.items.length - 1) run.i++;
        renderQ();
      });
    });
    Q.view.querySelectorAll('[data-go]').forEach(function (el) {
      el.addEventListener('click', function () { run.i = +el.dataset.go; renderQ(); });
    });
    document.getElementById('ex-prev').addEventListener('click', function () {
      if (run.i > 0) { run.i--; renderQ(); }
    });
    document.getElementById('ex-next').addEventListener('click', function () {
      if (run.i < run.items.length - 1) { run.i++; renderQ(); }
    });
    document.getElementById('ex-submit').addEventListener('click', trySubmit);

    Q.setFoot('點上面的題號可以跳題，寫完的題號會亮起來。交卷前都可以改答案。');
  }

  /* 計時器：每秒只改那一個 span，不整頁重畫 */
  setInterval(function () {
    if (!run || run.done) return;
    var el = document.getElementById('exam-timer');
    if (el) el.textContent = fmtTime(Date.now() - run.startedAt);
  }, 1000);

  function trySubmit() {
    var blank = run.items.length - answered();
    if (blank && !confirm('還有 ' + blank + ' 題沒寫，要直接交卷嗎？沒寫的會算錯。')) return;
    submit();
  }

  function submit() {
    run.done = true;
    var took = Date.now() - run.startedAt;
    var score = 0;

    run.items.forEach(function (it) {
      var right = it.picked !== null && it.pairs[it.picked].right;
      if (right) { score++; return; }
      Q.addWrong({
        q: it.q.q,
        answer: (it.pairs.filter(function (p) { return p.right; })[0] || {}).text,
        explain: it.q.explain,
        where: it.where,
        at: Date.now()
      });
    });

    var total = run.items.length;
    var k = bestKeyOf(run.b, run.range);
    var prev = Q.DB[BEST_KEY][k];
    var isBest = !prev || (score / total) > (prev.score / prev.total);
    if (isBest) Q.DB[BEST_KEY][k] = { score: score, total: total, at: Date.now() };
    Q.save();

    /* 2026-11-10：練習紀錄。測驗卷本來就有 took，直接用。 */
    if (typeof window.QUEST_LOG === 'function') {
      window.QUEST_LOG({
        kind: 'exam',
        subject: run.b.subject, grade: run.b.grade, term: run.b.term,
        where: (Q.RANGES.filter(function (r) { return r[0] === run.range; })[0]
                 || ['', '月考'])[1],
        n: total, score: score, sec: took / 1000
      });
    }

    renderResult(score, total, took, isBest && !!prev);
  }

  function renderResult(score, total, took, beatPrev) {
    var pct = Math.round(score / total * 100);
    var wrongs = run.items.filter(function (it) {
      return !(it.picked !== null && it.pairs[it.picked].right);
    });

    Q.backBtn.hidden = false;
    Q.backBtn.onclick = renderPicker;

    var html = '<div class="quiz">' +
      '<div class="score">' + pct + ' <small>分</small></div>' +
      '<p class="lede">' + score + ' / ' + total + ' 題　用了 ' + fmtTime(took) +
        (beatPrev ? '　🎉 破紀錄' : '') + '</p>' +
      '<div class="exam-foot">' +
        '<button class="btn" id="ex-again">再考一次（重新抽題）</button>' +
        '<button class="btn ghost sm" id="ex-back">換一份</button>' +
      '</div></div>';

    html += '<h2>逐題檢討</h2><div class="review">' +
      run.items.map(function (it, i) {
        var right = it.picked !== null && it.pairs[it.picked].right;
        var correct = (it.pairs.filter(function (p) { return p.right; })[0] || {}).text;
        return '<div class="ri' + (right ? ' ok' : '') + '">' +
          '<div class="ri-q">' + (i + 1) + '. ' + Q.esc(it.q.q) + '</div>' +
          (right ? '' :
            '<div class="ri-yours">你寫：' +
              (it.picked === null ? '（空白）' : Q.esc(it.pairs[it.picked].text)) + '</div>') +
          '<div class="ri-a">正解：' + Q.esc(correct || '') + '</div>' +
          '<div>' + Q.esc(it.q.explain) + '</div>' +
          '<div class="ri-where">' + Q.esc(it.where) + '</div>' +
        '</div>';
      }).join('') + '</div>';

    Q.view.innerHTML = html;
    document.getElementById('ex-again').addEventListener('click', function () {
      start(run.b, run.range);
    });
    document.getElementById('ex-back').addEventListener('click', renderPicker);
    Q.setFoot(wrongs.length
      ? '錯的 ' + wrongs.length + ' 題已經收進錯題本了。'
      : '全對，沒有東西進錯題本。');
    Q.top();
  }

  /* ── 在工具列加一顆按鈕 ── */
  var btn = document.createElement('button');
  btn.className = 'btn ghost sm';
  btn.id = 'btn-exam';
  btn.textContent = '📝 測驗卷';
  var wrongBtn = document.getElementById('btn-wrong');
  wrongBtn.parentNode.insertBefore(btn, wrongBtn);
  btn.addEventListener('click', renderPicker);
};
