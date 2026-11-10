/**
 * 錯題本複習排程（2026-11-10）
 *
 * 為什麼要做這個：
 *   錯題本本來只是一份清單 —— 答錯的題目會掉進去，但是不會再問你一次。
 *   孩子當下看完解析都「懂了」，可是兩個禮拜後再遇到同一題，照樣錯。
 *   題庫現在有一千多題，真正拉開差距的不是題目夠不夠多，
 *   而是「錯過的題目有沒有在忘掉之前再碰到一次」。
 *
 * 用的方法：萊特納盒（Leitner box），間隔重複裡面最簡單也最好解釋的一種。
 *   盒 1 → 1 天後再問
 *   盒 2 → 3 天後
 *   盒 3 → 7 天後
 *   盒 4 → 14 天後
 *   盒 5 → 30 天後，再答對就畢業
 *   答對往上一盒（間隔拉長），答錯直接退回盒 1（明天再問）。
 *   會這樣設計，是因為「快忘掉的時候複習」記得最久。
 *   答得出來就讓它等久一點，答不出來就拉回來多問幾次。
 *
 * 一個關鍵的設計決定：題目從題庫現找，不存進錯題本
 *   錯題本的紀錄只有 {q, answer, explain, where}，沒有選項，
 *   所以沒辦法直接拿來出選擇題。
 *   解法不是改錯題本的格式（那樣舊紀錄就全部作廢了），
 *   而是用題目文字回題庫裡把原題找回來 —— 選項、正解、解析全都有。
 *   好處：已經存在的錯題一題都不會漏掉，而且 quest/index.html 一行都不用動。
 *
 * 這個檔案是外掛，照 exam-20261106.js 的作法：
 *   quest/index.html 導出 window.QUEST 之後，這支自己掛上去。
 *   拿掉這個 <script>，錯題本就回到原本那份唯讀清單，什麼都不會壞。
 */

'use strict';

(function () {

  var Q = window.QUEST;
  if (!Q) { console.warn('[review] 找不到 window.QUEST，複習排程沒有啟用'); return; }

  /* 盒 1..5 各自要等幾天。改這一行就能調整整套節奏。 */
  var STEPS = [1, 3, 7, 14, 30];
  var TOP_BOX = STEPS.length;          // 在最後一盒再答對就畢業
  var SESSION_MAX = 20;                // 一次最多複習幾題，不要讓孩子看到 80 題就放棄

  Q.DB.review = Q.DB.review || {};     // 題目文字 -> {box, due, right, wrong, done}

  var run = null;

  /* ───────────────────────── 時間 ───────────────────────── */

  /** 當地時間的今天零點。用「天」當單位，到期判斷才符合直覺。 */
  function startOfToday() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  function daysFromToday(n) { return startOfToday() + n * 86400000; }

  /** 把到期時間講成人話 */
  function whenText(due) {
    var diff = Math.round((due - startOfToday()) / 86400000);
    if (diff <= 0) return '今天';
    if (diff === 1) return '明天';
    if (diff < 7) return diff + ' 天後';
    if (diff < 30) return Math.round(diff / 7) + ' 週後';
    return Math.round(diff / 30) + ' 個月後';
  }

  /* ──────────────────── 從題庫把原題找回來 ──────────────────── */

  /**
   * 題目文字 -> 完整題目。
   * 所有年級所有學期的題庫在 index.html 都已經載進來了，所以一次建好就夠用。
   * 萬一有同文字的題目（不同科出了一模一樣的題幹），先建到的那一筆贏 ——
   * 選項和解析本來就會一樣，影響不到孩子看到的東西。
   */
  var INDEX = null;
  function index() {
    if (INDEX) return INDEX;
    INDEX = {};
    Object.keys(Q.BANKS).forEach(function (k) {
      var b = Q.BANKS[k];
      b.units.forEach(function (u) {
        u.lessons.forEach(function (l) {
          l.quiz.forEach(function (item) {
            if (INDEX[item.q]) return;
            INDEX[item.q] = {
              q: item.q, choices: item.choices, correct: item.correct,
              explain: item.explain,
              where: b.subject + '・' + u.name + '・' + l.name,
              subject: b.subject,
            };
          });
        });
      });
    });
    return INDEX;
  }

  /* ───────────────────────── 排程 ───────────────────────── */

  /**
   * 把錯題本裡還沒排進度的題目補上。
   *
   * 每次要畫面之前都跑一次，所以剛剛才答錯的題目馬上就會排進來，
   * 不必等重新整理頁面。
   *
   * 另外：錯題本被清空（孩子自己按的）視為「整個重來」，排程跟著歸零。
   * 不會因為錯題本滿 200 筆把舊的擠掉就刪排程 —— 那是容量問題，不是他的意思。
   */
  function sync() {
    if (!Q.DB.wrong.length) {
      if (Object.keys(Q.DB.review).length) { Q.DB.review = {}; Q.save(); }
      return;
    }
    var idx = index(), changed = false;
    Q.DB.wrong.forEach(function (w) {
      if (Q.DB.review[w.q]) return;
      if (!idx[w.q]) return;                 // 題庫裡找不到就不排，寧可少一題也不要排一題問不出來的
      Q.DB.review[w.q] = { box: 1, due: Date.now(), right: 0, wrong: 0, done: false };
      changed = true;
    });
    if (changed) Q.save();
  }

  /** 現在到期、而且還沒畢業的題目 */
  function dueList() {
    var now = Date.now(), idx = index(), out = [];
    Object.keys(Q.DB.review).forEach(function (qq) {
      var r = Q.DB.review[qq];
      if (r.done || r.due > now || !idx[qq]) return;
      out.push(qq);
    });
    return out;
  }

  /** 還沒畢業、但是時候未到的題目，照到期日排序 */
  function pendingList() {
    var now = Date.now(), idx = index(), out = [];
    Object.keys(Q.DB.review).forEach(function (qq) {
      var r = Q.DB.review[qq];
      if (r.done || r.due <= now || !idx[qq]) return;
      out.push(qq);
    });
    out.sort(function (a, b) { return Q.DB.review[a].due - Q.DB.review[b].due; });
    return out;
  }

  function stats() {
    var s = { total: 0, due: 0, done: 0, boxes: [0, 0, 0, 0, 0], next: null };
    var now = Date.now(), idx = index();
    Object.keys(Q.DB.review).forEach(function (qq) {
      if (!idx[qq]) return;
      var r = Q.DB.review[qq];
      s.total++;
      if (r.done) { s.done++; return; }
      s.boxes[Math.min(r.box, TOP_BOX) - 1]++;
      if (r.due <= now) s.due++;
      else if (s.next === null || r.due < s.next) s.next = r.due;
    });
    return s;
  }

  /** 答完一題之後重排。答對往上一盒，答錯回盒 1。 */
  function grade(qq, ok) {
    var r = Q.DB.review[qq];
    if (!r) return;
    if (ok) {
      r.right++;
      if (r.box >= TOP_BOX) { r.done = true; r.due = daysFromToday(STEPS[TOP_BOX - 1]); }
      else { r.box++; r.due = daysFromToday(STEPS[r.box - 1]); }
    } else {
      r.wrong++;
      r.box = 1;
      r.due = daysFromToday(STEPS[0]);
    }
    Q.save();
  }

  /* ───────────────────────── 畫面 ───────────────────────── */

  var css = document.createElement('style');
  css.textContent = [
    '.rv-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.7rem;margin:1rem 0 1.3rem}',
    '.rv-card{background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.12);',
    '  border-radius:12px;padding:.8rem .9rem;text-align:center}',
    '.rv-card b{display:block;font-size:1.9rem;font-weight:900;line-height:1.1;font-variant-numeric:tabular-nums}',
    '.rv-card span{display:block;margin-top:.25rem;font-size:.82rem;color:var(--dim)}',
    /* 工具列按鈕：有到期的題目就讓它亮起來，不然孩子根本不會去點 */
    '#btn-review.hot{border-color:var(--gold);color:var(--gold)}',
    '.rv-card.hot{border-color:var(--gold)}',
    '.rv-card.hot b{color:var(--gold)}',
    '.rv-card.ok b{color:var(--good)}',
    /* 盒子分布：一條一盒，長度就是題數，一眼看得出卡在哪一層 */
    '.rv-boxes{margin:.3rem 0 1.3rem}',
    '.rv-box{display:flex;align-items:center;gap:.6rem;margin:.35rem 0;font-size:.86rem}',
    '.rv-box-name{flex:0 0 5.5rem;color:var(--dim)}',
    '.rv-box-bar{flex:1 1 auto;height:.75rem;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden}',
    '.rv-box-fill{height:100%;border-radius:99px;background:var(--accent)}',
    '.rv-box-n{flex:0 0 2.5rem;text-align:right;font-weight:800;font-variant-numeric:tabular-nums}',
    /* 複習中每一題上面那一條 */
    '.rv-tag{display:inline-block;font-size:.75rem;font-weight:800;padding:.18rem .55rem;',
    '  border-radius:99px;border:2px solid rgba(255,255,255,.18);color:var(--dim);margin-bottom:.5rem}',
    '.rv-tag.again{border-color:var(--bad);color:var(--bad)}',
    '.rv-move{margin-top:.6rem;font-size:.86rem;font-weight:800}',
    '.rv-move.up{color:var(--good)}',
    '.rv-move.down{color:var(--bad)}',
    /* 錯題本卡片上補的那一行狀態 */
    '.rv-state{margin-top:.4rem;font-size:.78rem;color:var(--dim)}',
    '.rv-state b{color:var(--gold);font-weight:800}',
    '.rv-state.done b{color:var(--good)}',
    /* 手機：三張統計卡要排得下一列（2+1 看起來像壞掉），
       盒子名稱「盒 4（14 天）」八個字不能折行，所以位置要留夠。 */
    '@media (max-width:480px){',
    '  .rv-cards{grid-template-columns:repeat(3,1fr);gap:.45rem}',
    '  .rv-card{padding:.6rem .35rem}',
    '  .rv-card b{font-size:1.5rem}',
    '  .rv-card span{font-size:.72rem}',
    '  .rv-box{font-size:.8rem;gap:.45rem}',
    '  .rv-box-name{flex:0 0 6.4rem;white-space:nowrap}',
    '  .rv-box-n{flex-basis:2rem}',
    '}'
  ].join('\n');
  document.head.appendChild(css);

  function boxBar(s) {
    var live = s.total - s.done;
    var max = Math.max.apply(null, s.boxes.concat([1]));
    var rows = s.boxes.map(function (n, i) {
      return '<div class="rv-box"><span class="rv-box-name">盒 ' + (i + 1) +
        '（' + STEPS[i] + ' 天）</span>' +
        '<span class="rv-box-bar"><span class="rv-box-fill" style="width:' +
        Math.round(n / max * 100) + '%"></span></span>' +
        '<span class="rv-box-n">' + n + '</span></div>';
    }).join('');
    return '<div class="rv-boxes">' + rows + '</div>' +
      '<p class="foot" style="margin:0">還在複習的 ' + live + ' 題。' +
      '答對往下一盒，間隔拉長；答錯退回盒 1，明天再問。</p>';
  }

  function renderHome() {
    sync();
    Q.backBtn.hidden = false;
    Q.backBtn.onclick = Q.home;
    Q.crumb.textContent = '';

    var s = stats(), due = dueList();
    var html = '<h1>🔁 錯題<span>複習</span></h1>';

    if (!s.total) {
      html += '<p class="lede">還沒有東西要複習。去闖幾關，答錯的題目會自動排進複習排程，' +
        '之後在你快忘掉的時候再問你一次。</p>' +
        '<div class="next-row" style="justify-content:flex-start">' +
        '<button class="btn" id="rv-go-home">去闖關</button></div>';
      Q.view.innerHTML = html;
      document.getElementById('rv-go-home').addEventListener('click', Q.home);
      Q.setFoot('');
      Q.top();
      return;
    }

    html += '<div class="rv-cards">' +
      '<div class="rv-card' + (s.due ? ' hot' : '') + '"><b>' + s.due + '</b><span>今天要複習</span></div>' +
      '<div class="rv-card"><b>' + (s.total - s.done) + '</b><span>排程中</span></div>' +
      '<div class="rv-card' + (s.done ? ' ok' : '') + '"><b>' + s.done + '</b><span>已經畢業</span></div>' +
      '</div>';

    if (s.due) {
      var n = Math.min(due.length, SESSION_MAX);
      html += '<p class="lede">今天有 <b>' + s.due + '</b> 題到期。' +
        (due.length > SESSION_MAX
          ? '這一輪先做 ' + SESSION_MAX + ' 題，做完還可以再來一輪。'
          : '一輪做完就收工。') + '</p>' +
        '<div class="next-row" style="justify-content:flex-start">' +
        '<button class="btn" id="rv-start">開始複習（' + n + ' 題）</button></div>';
    } else {
      html += '<p class="lede">今天沒有到期的題目' +
        (s.next ? '，下一次是<b>' + whenText(s.next) + '</b>' : '') +
        '。間隔是故意拉開的 —— 太早複習記不久，不用急著提前做。</p>';
      if (s.total - s.done) {
        html += '<div class="next-row" style="justify-content:flex-start">' +
          '<button class="btn ghost" id="rv-early">還是想先練（提早複習）</button></div>';
      }
    }

    html += '<h2>目前的分布</h2>' + boxBar(s);
    Q.view.innerHTML = html;

    var go = document.getElementById('rv-start');
    if (go) go.addEventListener('click', function () { start(dueList()); });
    var early = document.getElementById('rv-early');
    if (early) early.addEventListener('click', function () { start(pendingList()); });

    Q.setFoot('複習排程只存在這台瀏覽器，跟闖關進度放在一起。');
    Q.top();
  }

  /* ── 一輪複習 ── */

  function start(keys) {
    var idx = index();
    var picked = Q.shuffle(keys).slice(0, SESSION_MAX);
    if (!picked.length) { renderHome(); return; }

    run = {
      items: picked.map(function (qq) {
        var src = idx[qq];
        return {
          key: qq, src: src, scored: false, again: false,
          pairs: Q.shuffle(src.choices.map(function (c, i) {
            return { text: c, ok: i === src.correct };
          })),
        };
      }),
      i: 0, score: 0, up: 0, down: 0, graduated: 0, requeue: [],
    };
    renderQ();
  }

  function renderQ() {
    var it = run.items[run.i], n = run.items.length;
    Q.backBtn.hidden = false;
    Q.backBtn.onclick = renderHome;
    Q.crumb.textContent = '';

    var r = Q.DB.review[it.key];
    var tag = it.again
      ? '<span class="rv-tag again">剛剛答錯，再問一次</span>'
      : '<span class="rv-tag">盒 ' + (r ? r.box : 1) + '　' + Q.esc(it.src.where) + '</span>';

    Q.view.innerHTML =
      '<div class="prog"><div class="prog-row"><span>第 <b>' + (run.i + 1) + '</b> 題 / ' + n +
      '</span><span>答對 ' + run.score + '</span></div>' +
      '<div class="prog-bg"><div class="prog-fill" style="width:' + (run.i / n * 100) + '%"></div></div></div>' +
      '<div class="quiz">' + tag +
      '<div class="q-text">' + Q.esc(it.src.q) + '</div><div class="opts">' +
      it.pairs.map(function (p, i) {
        return '<button class="opt" data-i="' + i + '">' + Q.esc(p.text) + '</button>';
      }).join('') +
      '</div><div id="rv-after"></div></div>';

    Q.view.querySelectorAll('.opt').forEach(function (el) {
      el.addEventListener('click', function () { answer(+el.dataset.i); }, { once: true });
    });
    Q.setFoot('');
    Q.top();
  }

  function answer(picked) {
    var it = run.items[run.i], ci = 0;
    it.pairs.forEach(function (p, i) { if (p.ok) ci = i; });

    Q.view.querySelectorAll('.opt').forEach(function (el, i) {
      el.disabled = true;
      if (i === ci) el.classList.add('right');
      else if (i === picked) el.classList.add('wrong');
    });

    var ok = picked === ci;
    if (ok) run.score++;

    /* 只有第一次作答才算分、才重排。
       同一輪最後補問的那一次不再動盒子 —— 不然等於偷偷送他升一盒。 */
    var moveHtml = '';
    if (!it.scored) {
      it.scored = true;
      var before = Q.DB.review[it.key] ? Q.DB.review[it.key].box : 1;
      grade(it.key, ok);
      var after = Q.DB.review[it.key];
      if (ok) {
        if (after && after.done) {
          run.graduated++;
          moveHtml = '<div class="rv-move up">🎓 這一題畢業了，不會再問你。</div>';
        } else {
          run.up++;
          moveHtml = '<div class="rv-move up">↑ 進到盒 ' + after.box +
            '，下次是 ' + whenText(after.due) + '。</div>';
        }
      } else {
        run.down++;
        moveHtml = '<div class="rv-move down">↓ 退回盒 1' +
          (before > 1 ? '（原本在盒 ' + before + '）' : '') + '，明天再問一次。</div>';
        if (!it.again) run.requeue.push(it);   // 這一輪的最後再補問一次
      }
    }

    document.getElementById('rv-after').innerHTML =
      '<div class="explain"><b>' + (ok ? '答對了！' : '正解：' + Q.esc(it.pairs[ci].text)) +
      '</b><br>' + Q.esc(it.src.explain) + '</div>' + moveHtml +
      '<div class="next-row"><button class="btn" id="rv-next">' +
      (run.i + 1 < run.items.length ? '下一題 →' : '看結果 →') + '</button></div>';

    document.getElementById('rv-next').addEventListener('click', function () {
      run.i++;
      if (run.i >= run.items.length && run.requeue.length) {
        /* 答錯的題目在這一輪的最後再問一次。
           當下看完解析就馬上再答一次，印象會深很多，而且不影響排程。 */
        run.requeue.forEach(function (x) {
          run.items.push({
            key: x.key, src: x.src, scored: true, again: true,
            pairs: Q.shuffle(x.src.choices.map(function (c, i) {
              return { text: c, ok: i === x.src.correct };
            })),
          });
        });
        run.requeue = [];
      }
      if (run.i < run.items.length) renderQ(); else finish();
    });
  }

  function finish() {
    var s = stats();
    var word = run.down === 0 ? '這一輪全部往前推進了，很漂亮。'
      : run.up + run.graduated > run.down ? '大部分都記住了，退回去的幾題明天再碰一次。'
      : '退回去的比較多，代表這幾題還沒真的懂 —— 可以回教學再看一遍。';

    var html = '<div class="quiz" style="text-align:center">' +
      '<div class="score">' + (run.up + run.graduated) + '<small> / ' +
      (run.up + run.graduated + run.down) + ' 題往前推進</small></div>' +
      '<p style="margin-top:.7rem;color:var(--dim)">' + Q.esc(word) + '</p></div>';

    html += '<div class="rv-cards">' +
      '<div class="rv-card ok"><b>' + run.up + '</b><span>升一盒</span></div>' +
      '<div class="rv-card' + (run.graduated ? ' ok' : '') + '"><b>' + run.graduated + '</b><span>畢業</span></div>' +
      '<div class="rv-card"><b>' + run.down + '</b><span>退回盒 1</span></div>' +
      '</div>';

    if (s.due) {
      html += '<p class="lede">今天還有 <b>' + s.due + '</b> 題到期。</p>';
    } else if (s.next) {
      html += '<p class="lede">今天的複習做完了。下一次是<b>' + whenText(s.next) + '</b>。</p>';
    } else {
      html += '<p class="lede">全部的錯題都畢業了。厲害。</p>';
    }

    html += '<div class="next-row" style="justify-content:flex-start">' +
      (s.due ? '<button class="btn" id="rv-more">再來一輪</button>' : '') +
      '<button class="btn ghost" id="rv-back">回複習首頁</button>' +
      '<button class="btn ghost" id="rv-quest">回闖關站</button></div>';

    Q.view.innerHTML = html;
    var more = document.getElementById('rv-more');
    if (more) more.addEventListener('click', function () { start(dueList()); });
    document.getElementById('rv-back').addEventListener('click', renderHome);
    document.getElementById('rv-quest').addEventListener('click', Q.home);
    refreshBadge();
    Q.setFoot('');
    Q.top();
  }

  /* ──────────────── 工具列按鈕（到期題數直接寫在上面）──────────────── */

  var btn = document.createElement('button');
  btn.className = 'btn ghost sm';
  btn.id = 'btn-review';
  var wrongBtn = document.getElementById('btn-wrong');
  wrongBtn.parentNode.insertBefore(btn, wrongBtn);
  btn.addEventListener('click', renderHome);

  function refreshBadge() {
    sync();
    var s = stats();
    btn.textContent = s.due ? '🔁 複習 ' + s.due : '🔁 複習';
    btn.classList.toggle('hot', !!s.due);
  }
  refreshBadge();

  /* 按鈕上的數字要會跟著變：孩子剛答錯一題，回到首頁就該看到數字加一。
     闖關站每換一次畫面都是重寫 #view.innerHTML，所以看 childList 就夠。 */
  new MutationObserver(function () {
    refreshBadge();
    decorateWrong();
  }).observe(Q.view, { childList: true });

  /* ──────────── 錯題本的每張卡片補一行「現在在第幾盒、下次什麼時候」 ──────────── */

  /**
   * 不改 quest/index.html 的 renderWrong，而是等它畫完之後補上去。
   * 跟 teach-link 同一招：殼完全不知道這一份存在。
   */
  function decorateWrong() {
    var cards = Q.view.querySelectorAll('.review .ri');
    if (!cards.length) return;
    var idx = index();
    cards.forEach(function (card) {
      if (card.querySelector('.rv-state')) return;         // 補過了
      var qEl = card.querySelector('.ri-q');
      if (!qEl) return;
      var r = Q.DB.review[qEl.textContent];
      if (!r) return;
      var p = document.createElement('div');
      if (r.done) {
        p.className = 'rv-state done';
        p.innerHTML = '🎓 <b>已經畢業</b>　答對 ' + r.right + ' 次';
      } else {
        p.className = 'rv-state';
        p.innerHTML = '🔁 盒 <b>' + r.box + '</b>　下次複習：<b>' + whenText(r.due) + '</b>';
      }
      card.appendChild(p);
    });
  }

})();
