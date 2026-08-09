/**
 * 引導式教學引擎 — iPad 觸控優先
 * 2026-08-07
 *
 * 設計原則：
 * 1. 所有拖曳一律用 Pointer Events（iOS Safari 不支援 HTML5 drag-and-drop，
 *    舊版 factors-multiples-tutorial.js 的 DraggablePairingTool 在 iPad 上完全拖不動）
 * 2. 觸控目標最小 48×48（Apple HIG 建議 44，這裡給小孩用再放大一點）
 * 3. 不使用只靠 hover 才出現的資訊，平板沒有滑鼠指標
 * 4. 每個元件都要能用「點兩下」完成，拖曳只是加分的操作方式
 */

'use strict';

/* ────────────────────────────────────────────
   共用工具
   ──────────────────────────────────────────── */

const El = (tag, props = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (v !== null && v !== undefined) {
      node.setAttribute(k, v);
    }
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
};

const SVG_NS = 'http://www.w3.org/2000/svg';
const Svg = (tag, props = {}, ...children) => {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === null || v === undefined) continue;
    if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
};

/** Fisher-Yates。不要用 sort(() => Math.random() - 0.5)，那個分布是偏的。 */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 輕微震動回饋。
 * 注意：iOS / iPadOS Safari 不支援 Vibration API，在 iPad 上這裡實際上不會有任何作用，
 * 純粹是給 Android 平板或支援的瀏覽器的加分回饋，不能當成主要的操作提示。
 * 非使用者手勢觸發時瀏覽器會擋下並丟例外，所以整段包起來。
 */
const buzz = (ms = 12) => {
  // 沒有使用者手勢時瀏覽器會擋下並在 console 印警告（try/catch 攔不掉，
  // 因為那是瀏覽器自己印的，不是丟出的例外），所以先問 userActivation。
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  try {
    if (typeof navigator.vibrate === 'function') navigator.vibrate(ms);
  } catch { /* 不支援就算了，回饋本來就是加分性質 */ }
};

/* ────────────────────────────────────────────
   互動元件
   每個元件都實作 mount(container) 並回傳自己，
   以及 destroy() 清掉監聽器與計時器。
   ──────────────────────────────────────────── */

/**
 * 可拖曳的資料點折線圖。
 * 這是整套教材裡最關鍵的元件——「動手把點放到正確位置」是折線圖單元的核心活動。
 * 用 Pointer Events + setPointerCapture，滑鼠、觸控筆、手指都通用。
 */
class LineChartBuilder {
  constructor(config) {
    this.labels = config.labels;                 // X 軸標籤，例如 ['1月','2月',...]
    this.target = config.target;                 // 正解陣列
    this.values = config.initial ?? config.labels.map(() => config.yMin);
    this.yMin = config.yMin ?? 0;
    this.yMax = config.yMax ?? 40;
    this.step = config.step ?? 1;
    this.unit = config.unit ?? '';
    this.tolerance = config.tolerance ?? 0;
    this.readOnly = config.readOnly ?? false;
    this.showTarget = config.showTarget ?? false;
    this.onChange = config.onChange ?? (() => {});
    this.onSolved = config.onSolved ?? (() => {});
    this._solved = false;
    this._cleanup = [];
  }

  // 版面座標：以 viewBox 內的座標計算，SVG 會自動隨容器縮放
  get _geo() {
    const pad = { top: 24, right: 24, bottom: 56, left: 56 };
    const w = 640, h = 400;
    return {
      pad, w, h,
      plotW: w - pad.left - pad.right,
      plotH: h - pad.top - pad.bottom,
    };
  }

  _x(i) {
    const { pad, plotW } = this._geo;
    const n = this.labels.length;
    return pad.left + (n === 1 ? plotW / 2 : (plotW * i) / (n - 1));
  }

  _y(v) {
    const { pad, plotH } = this._geo;
    const t = (v - this.yMin) / (this.yMax - this.yMin);
    return pad.top + plotH * (1 - t);
  }

  _valueFromY(y) {
    const { pad, plotH } = this._geo;
    const t = 1 - (y - pad.top) / plotH;
    const raw = this.yMin + t * (this.yMax - this.yMin);
    const snapped = Math.round(raw / this.step) * this.step;
    return Math.min(this.yMax, Math.max(this.yMin, snapped));
  }

  mount(container) {
    const { w, h, pad, plotW, plotH } = this._geo;
    const svg = Svg('svg', {
      viewBox: `0 0 ${w} ${h}`,
      class: 'chart-svg',
      role: 'img',
      'aria-label': '可調整的折線圖',
    });

    // 網格線與 Y 軸刻度
    const ticks = 5;
    for (let i = 0; i <= ticks; i++) {
      const v = this.yMin + ((this.yMax - this.yMin) * i) / ticks;
      const y = this._y(v);
      svg.append(
        Svg('line', {
          x1: pad.left, y1: y, x2: pad.left + plotW, y2: y,
          class: 'chart-grid',
        }),
        Svg('text', {
          x: pad.left - 12, y: y + 6, class: 'chart-tick', 'text-anchor': 'end',
        }, String(Math.round(v)))
      );
    }

    // X 軸標籤
    this.labels.forEach((label, i) => {
      svg.append(
        Svg('text', {
          x: this._x(i), y: pad.top + plotH + 32,
          class: 'chart-tick', 'text-anchor': 'middle',
        }, label)
      );
    });

    // 軸線
    svg.append(
      Svg('line', {
        x1: pad.left, y1: pad.top, x2: pad.left, y2: pad.top + plotH, class: 'chart-axis',
      }),
      Svg('line', {
        x1: pad.left, y1: pad.top + plotH, x2: pad.left + plotW, y2: pad.top + plotH,
        class: 'chart-axis',
      })
    );

    // 參考答案（教學演示用，可選）
    if (this.showTarget) {
      svg.append(Svg('polyline', {
        points: this.target.map((v, i) => `${this._x(i)},${this._y(v)}`).join(' '),
        class: 'chart-line chart-line--ghost',
      }));
    }

    this._line = Svg('polyline', { class: 'chart-line' });
    svg.append(this._line);

    // 每個資料點：一個大的透明觸控圈 + 一個看得見的小圓
    this._dots = this.labels.map((_, i) => {
      const hit = Svg('circle', {
        cx: this._x(i), cy: this._y(this.values[i]),
        r: 30,                       // 觸控範圍遠大於視覺尺寸，手指才好按
        class: 'chart-hit',
        'data-index': i,
      });
      const dot = Svg('circle', {
        cx: this._x(i), cy: this._y(this.values[i]),
        r: 11, class: 'chart-dot',
      });
      const label = Svg('text', {
        x: this._x(i), y: this._y(this.values[i]) - 22,
        class: 'chart-value', 'text-anchor': 'middle',
      }, String(this.values[i]));
      svg.append(hit, dot, label);
      return { hit, dot, label };
    });

    if (!this.readOnly) this._bindDrag(svg);
    this._redraw();

    const wrap = El('div', { class: 'chart-wrap' }, svg);
    container.append(wrap);
    this._svg = svg;
    return this;
  }

  _bindDrag(svg) {
    let active = null;

    const toSvgPoint = (evt) => {
      const rect = svg.getBoundingClientRect();
      const { w, h } = this._geo;
      return {
        x: ((evt.clientX - rect.left) / rect.width) * w,
        y: ((evt.clientY - rect.top) / rect.height) * h,
      };
    };

    const onDown = (evt) => {
      const target = evt.target.closest('.chart-hit');
      if (!target) return;
      evt.preventDefault();
      active = Number(target.dataset.index);
      target.setPointerCapture(evt.pointerId);
      this._dots[active].dot.classList.add('is-dragging');
      buzz();
    };

    const onMove = (evt) => {
      if (active === null) return;
      evt.preventDefault();
      const { y } = toSvgPoint(evt);
      const next = this._valueFromY(y);
      if (next !== this.values[active]) {
        this.values[active] = next;
        this._redraw();
        this.onChange([...this.values]);
      }
    };

    const onUp = (evt) => {
      if (active === null) return;
      this._dots[active].dot.classList.remove('is-dragging');
      const target = evt.target.closest('.chart-hit');
      if (target && target.hasPointerCapture?.(evt.pointerId)) {
        target.releasePointerCapture(evt.pointerId);
      }
      active = null;
      this._checkSolved();
    };

    svg.addEventListener('pointerdown', onDown);
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerup', onUp);
    svg.addEventListener('pointercancel', onUp);
    this._cleanup.push(() => {
      svg.removeEventListener('pointerdown', onDown);
      svg.removeEventListener('pointermove', onMove);
      svg.removeEventListener('pointerup', onUp);
      svg.removeEventListener('pointercancel', onUp);
    });

    // 不會拖的小孩也要能完成：點一下資料點，用 +／− 按鈕調整
    svg.addEventListener('click', (evt) => {
      const target = evt.target.closest('.chart-hit');
      if (!target) return;
      const i = Number(target.dataset.index);
      this._dots.forEach((d, idx) => d.dot.classList.toggle('is-selected', idx === i));
      this._selected = i;
    });
  }

  /** 給外部的 +／− 按鈕呼叫，讓不擅長拖曳的孩子也能操作。 */
  nudge(delta) {
    const i = this._selected ?? 0;
    this.values[i] = Math.min(
      this.yMax,
      Math.max(this.yMin, this.values[i] + delta * this.step)
    );
    this._redraw();
    this.onChange([...this.values]);
    this._checkSolved();
  }

  _redraw() {
    this._line.setAttribute(
      'points',
      this.values.map((v, i) => `${this._x(i)},${this._y(v)}`).join(' ')
    );
    this.values.forEach((v, i) => {
      const y = this._y(v);
      const { hit, dot, label } = this._dots[i];
      hit.setAttribute('cy', y);
      dot.setAttribute('cy', y);
      label.setAttribute('y', y - 22);
      label.textContent = `${v}${this.unit}`;
      const ok = this.target && Math.abs(v - this.target[i]) <= this.tolerance;
      dot.classList.toggle('is-correct', Boolean(this.target) && ok);
    });
  }

  _checkSolved() {
    if (!this.target || this._solved) return;
    const done = this.values.every(
      (v, i) => Math.abs(v - this.target[i]) <= this.tolerance
    );
    if (done) {
      this._solved = true;
      buzz(40);
      this.onSolved();
    }
  }

  destroy() {
    this._cleanup.forEach((fn) => fn());
    this._cleanup = [];
  }
}

/**
 * 點選配對。取代舊版的 HTML5 拖放配對——
 * 「先點左邊、再點右邊」在 iPad 上比拖曳穩定得多，小孩也不會拖到一半手指離開螢幕。
 */
class TapPairing {
  constructor({ left, right, pairs, onSolved }) {
    this.left = left;
    this.right = right;
    this.pairs = pairs;               // { [leftId]: rightId }
    this.onSolved = onSolved ?? (() => {});
    this.matched = new Set();
    this.selected = null;
  }

  mount(container) {
    this.root = El('div', { class: 'pair-grid' });
    this.colL = El('div', { class: 'pair-col' });
    this.colR = El('div', { class: 'pair-col' });

    this.left.forEach((item) => {
      const btn = El('button', {
        class: 'pair-item', type: 'button', dataset: { id: item.id, side: 'left' },
      }, item.text);
      btn.addEventListener('click', () => this._tapLeft(item.id, btn));
      this.colL.append(btn);
    });

    shuffle(this.right).forEach((item) => {
      const btn = El('button', {
        class: 'pair-item', type: 'button', dataset: { id: item.id, side: 'right' },
      }, item.text);
      btn.addEventListener('click', () => this._tapRight(item.id, btn));
      this.colR.append(btn);
    });

    this.feedback = El('p', { class: 'pair-feedback', role: 'status' }, '先點左邊，再點右邊配對');
    this.root.append(this.colL, this.colR);
    container.append(this.root, this.feedback);
    return this;
  }

  _tapLeft(id, btn) {
    if (this.matched.has(id)) return;
    this.colL.querySelectorAll('.pair-item').forEach((b) => b.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    this.selected = { id, btn };
    this.feedback.textContent = '現在點右邊對應的答案';
    buzz();
  }

  _tapRight(rightId, btn) {
    if (!this.selected) {
      this.feedback.textContent = '要先點左邊的題目喔';
      return;
    }
    const expected = this.pairs[this.selected.id];
    if (expected === rightId) {
      this.selected.btn.classList.add('is-matched');
      this.selected.btn.classList.remove('is-selected');
      btn.classList.add('is-matched');
      this.matched.add(this.selected.id);
      this.feedback.textContent = '配對成功！';
      buzz(30);
      this.selected = null;
      if (this.matched.size === this.left.length) {
        this.feedback.textContent = '全部配對完成！';
        this.onSolved();
      }
    } else {
      btn.classList.add('is-wrong');
      this.feedback.textContent = '再想想看，這兩個不是一組';
      setTimeout(() => btn.classList.remove('is-wrong'), 600);
    }
  }

  destroy() {}
}

/**
 * 單選題。
 * 修正了 english-app QuizEngine 的老問題：
 * 作答後所有選項一律停用（含選中的那顆），避免連點造成重複計分／跳題。
 */
class ChoiceQuiz {
  constructor({ questions, onFinish }) {
    this.questions = questions;
    this.onFinish = onFinish ?? (() => {});
    this.index = 0;
    this.score = 0;
    this.locked = false;
    this.timers = [];
  }

  mount(container) {
    this.root = El('div', { class: 'quiz' });
    container.append(this.root);
    this._render();
    return this;
  }

  _render() {
    const q = this.questions[this.index];
    this.root.replaceChildren();
    this.locked = false;

    this.root.append(
      El('p', { class: 'quiz-progress' }, `第 ${this.index + 1} / ${this.questions.length} 題`),
      El('h4', { class: 'quiz-question' }, q.question)
    );
    if (q.hint) this.root.append(El('p', { class: 'quiz-hint' }, `💡 ${q.hint}`));

    const list = El('div', { class: 'quiz-options' });
    q.options.forEach((opt, i) => {
      const btn = El('button', { class: 'quiz-option', type: 'button' }, opt);
      btn.addEventListener('click', () => this._answer(i, btn, list));
      list.append(btn);
    });
    this.root.append(list);

    this.explain = El('div', { class: 'quiz-explain', hidden: 'hidden' });
    this.root.append(this.explain);
  }

  _answer(i, btn, list) {
    if (this.locked) return;          // 連點防護：第一次作答後就鎖住
    this.locked = true;
    const q = this.questions[this.index];
    const correct = i === q.answer;

    list.querySelectorAll('.quiz-option').forEach((b, idx) => {
      b.disabled = true;              // 全部停用，包含剛按的這顆
      if (idx === q.answer) b.classList.add('is-correct');
    });
    if (!correct) btn.classList.add('is-wrong');
    else this.score++;
    buzz(correct ? 30 : 60);

    this.explain.hidden = false;
    this.explain.replaceChildren(
      El('p', { class: correct ? 'explain-good' : 'explain-bad' },
        correct ? '答對了！' : '再看一次說明：'),
      El('p', {}, q.explanation),
      El('button', {
        class: 'btn btn--primary', type: 'button',
        onClick: () => this._next(),
      }, this.index < this.questions.length - 1 ? '下一題' : '看結果')
    );
  }

  _next() {
    if (this.index < this.questions.length - 1) {
      this.index++;
      this._render();
    } else {
      this.root.replaceChildren(
        El('div', { class: 'quiz-result' },
          El('h4', {}, `答對 ${this.score} / ${this.questions.length} 題`),
          El('p', {}, this.score === this.questions.length
            ? '全對！這個單元的概念你已經懂了。'
            : '沒有全對沒關係，回上面再看一次動畫，再試一次。'),
          El('button', {
            class: 'btn btn--primary', type: 'button',
            onClick: () => { this.index = 0; this.score = 0; this._render(); },
          }, '再做一次')
        )
      );
      this.onFinish(this.score, this.questions.length);
    }
  }

  destroy() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
}

/** 可點選的圖解：點圖上的部位，顯示該部位的說明。 */
class LabeledDiagram {
  constructor({ parts, caption }) {
    this.parts = parts;
    this.caption = caption;
  }

  mount(container) {
    const wrap = El('div', { class: 'diagram' });
    const buttons = El('div', { class: 'diagram-parts' });
    const detail = El('div', { class: 'diagram-detail' },
      El('p', {}, this.caption ?? '點點看各個部位，認識它的名字'));

    this.parts.forEach((part) => {
      const btn = El('button', { class: 'diagram-part', type: 'button' },
        `${part.icon ?? '🔎'} ${part.name}`);
      btn.addEventListener('click', () => {
        buttons.querySelectorAll('.diagram-part').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        detail.replaceChildren(
          El('h5', {}, part.name),
          El('p', {}, part.description)
        );
        buzz();
      });
      buttons.append(btn);
    });

    wrap.append(buttons, detail);
    container.append(wrap);
    return this;
  }

  destroy() {}
}

/** 兩張圖對比切換（例如長條圖 vs 折線圖）。 */
class CompareToggle {
  constructor({ options, onSwitch }) {
    this.options = options;
    this.onSwitch = onSwitch ?? (() => {});
  }

  mount(container) {
    const wrap = El('div', { class: 'compare' });
    const tabs = El('div', { class: 'compare-tabs' });
    const body = El('div', { class: 'compare-body' });

    const show = (idx) => {
      tabs.querySelectorAll('button').forEach((b, i) =>
        b.classList.toggle('is-active', i === idx));
      body.replaceChildren();
      const opt = this.options[idx];
      if (typeof opt.render === 'function') opt.render(body);
      body.append(El('p', { class: 'compare-note' }, opt.note));
      this.onSwitch(idx);
    };

    this.options.forEach((opt, i) => {
      const btn = El('button', { class: 'compare-tab', type: 'button' }, opt.label);
      btn.addEventListener('click', () => { show(i); buzz(); });
      tabs.append(btn);
    });

    wrap.append(tabs, body);
    container.append(wrap);
    show(0);
    return this;
  }

  destroy() {}
}

/**
 * 數字方格。可以「自動高亮」當教具，也可以「讓小孩自己點」當練習。
 * 因數與倍數兩種模式共用同一個元件，因為這兩個概念本來就該放在一起看。
 */
class NumberGrid {
  constructor({ max, target, mode, interactive = false, onSolved }) {
    this.max = max;                    // 方格顯示 1..max
    this.target = target;              // 要找誰的因數／倍數
    this.mode = mode;                  // 'factor' | 'multiple'
    this.interactive = interactive;
    this.onSolved = onSolved ?? (() => {});
    this.found = new Set();
  }

  _isAnswer(n) {
    return this.mode === 'factor'
      ? this.target % n === 0
      : n % this.target === 0;
  }

  get _answers() {
    const list = [];
    for (let n = 1; n <= this.max; n++) if (this._isAnswer(n)) list.push(n);
    return list;
  }

  mount(container) {
    const wrap = El('div', { class: 'numgrid-wrap' });
    const grid = El('div', { class: 'numgrid' });
    this.cells = [];

    for (let n = 1; n <= this.max; n++) {
      const isAns = this._isAnswer(n);
      const cell = El('button', {
        class: 'numcell', type: 'button', dataset: { n: String(n) },
        disabled: this.interactive ? null : 'disabled',
      }, String(n));

      if (!this.interactive && isAns) cell.classList.add('is-on');
      if (this.interactive) cell.addEventListener('click', () => this._tap(n, cell));

      grid.append(cell);
      this.cells.push(cell);
    }

    this.status = El('p', { class: 'numgrid-status', role: 'status' },
      this.interactive
        ? (this.mode === 'factor'
            ? `點出所有「${this.target} 的因數」（共 ${this._answers.length} 個）`
            : `點出 ${this.max} 以內所有「${this.target} 的倍數」`)
        : (this.mode === 'factor'
            ? `${this.target} 的因數：${this._answers.join('、')}`
            : `${this.target} 的倍數：${this._answers.join('、')}…`));

    wrap.append(grid, this.status);
    container.append(wrap);
    return this;
  }

  _tap(n, cell) {
    if (cell.classList.contains('is-on')) return;      // 已答對的不重複計分
    if (this._isAnswer(n)) {
      cell.classList.add('is-on');
      this.found.add(n);
      buzz(25);
      const total = this._answers.length;
      this.status.textContent = `找到 ${this.found.size} / ${total} 個`;
      if (this.found.size === total) {
        this.status.textContent = `全部找到了！${this.target} 的${this.mode === 'factor' ? '因數' : '倍數'}是 ${this._answers.join('、')}`;
        buzz(40);
        this.onSolved();
      }
    } else {
      cell.classList.add('is-off');
      buzz(60);
      const why = this.mode === 'factor'
        ? `${this.target} ÷ ${n} 除不盡，所以 ${n} 不是 ${this.target} 的因數`
        : `${n} ÷ ${this.target} 除不盡，所以 ${n} 不是 ${this.target} 的倍數`;
      this.status.textContent = why;
      setTimeout(() => cell.classList.remove('is-off'), 700);
    }
  }

  destroy() {}
}

/**
 * 方塊排長方形。因數最具體的樣子——
 * 「12 個方塊能排成幾種完整的長方形」比背定義有效得多。
 */
class ArrayBuilder {
  constructor({ total, onAllFound }) {
    this.total = total;
    this.onAllFound = onAllFound ?? (() => {});
    this.discovered = new Set();
    this.cols = 1;
  }

  get _factors() {
    const f = [];
    for (let n = 1; n <= this.total; n++) if (this.total % n === 0) f.push(n);
    return f;
  }

  mount(container) {
    const wrap = El('div', { class: 'array-wrap' });

    this.picker = El('div', { class: 'array-picker' });
    for (let c = 1; c <= this.total; c++) {
      const btn = El('button', {
        class: 'array-pick', type: 'button', dataset: { c: String(c) },
      }, String(c));
      btn.addEventListener('click', () => this._pick(c));
      this.picker.append(btn);
    }

    this.board = El('div', { class: 'array-board' });
    this.note = El('p', { class: 'array-note', role: 'status' });
    this.found = El('p', { class: 'array-found' });

    wrap.append(
      El('p', { class: 'array-label' }, `每排放幾個？點數字看看 ${this.total} 個方塊排得成不成長方形`),
      this.picker, this.board, this.note, this.found
    );
    container.append(wrap);
    this._pick(1);
    return this;
  }

  _pick(cols) {
    this.cols = cols;
    this.picker.querySelectorAll('.array-pick').forEach((b) =>
      b.classList.toggle('is-active', Number(b.dataset.c) === cols));
    buzz();

    const rows = Math.ceil(this.total / cols);
    const fits = this.total % cols === 0;

    this.board.replaceChildren();
    // 方塊必須緊密相鄰才看得出「長方形」。
    // 用 1fr 會讓每欄平分整個容器寬度，方塊被拉得很散，概念就傳達不出來——
    // 所以依欄數反推每格邊長，讓整塊圖形置中且不溢出。
    const GAP = 8;
    const avail = (this.board.clientWidth || 560) - 40;
    const cell = Math.max(16, Math.min(48, Math.floor((avail - (cols - 1) * GAP) / cols)));
    this.board.style.gridTemplateColumns = `repeat(${cols}, ${cell}px)`;
    for (let i = 0; i < rows * cols; i++) {
      const filled = i < this.total;
      this.board.append(El('span', {
        class: 'array-cell' + (filled ? '' : ' is-empty'),
      }));
    }

    if (fits) {
      this.discovered.add(cols);
      this.note.textContent =
        `排成了！${this.total} = ${cols} × ${this.total / cols}，所以 ${cols} 和 ${this.total / cols} 都是 ${this.total} 的因數。`;
      this.note.className = 'array-note is-good';
    } else {
      this.note.textContent =
        `最後一排缺了 ${rows * cols - this.total} 個，排不成完整的長方形，所以 ${cols} 不是 ${this.total} 的因數。`;
      this.note.className = 'array-note is-bad';
    }

    const all = this._factors;
    this.found.textContent = `已經找到的因數：${[...this.discovered].sort((a, b) => a - b).join('、') || '（還沒有）'}`;
    if (this.discovered.size === all.length) {
      this.found.textContent = `全部找到了！${this.total} 的因數有 ${all.join('、')}，共 ${all.length} 個。`;
      this.onAllFound();
    }
  }

  destroy() {}
}

/**
 * 兩個數共用的數字方格。
 * 同一格用顏色分三種身分：只屬於 A、只屬於 B、兩個都屬於（就是公因數／公倍數）。
 * 把「共同」這件事直接畫在同一張圖上，比分開兩張圖再叫小孩自己比對有效。
 */
class CommonGrid {
  constructor({ a, b, max, mode, interactive = false, onSolved }) {
    this.a = a; this.b = b; this.max = max;
    this.mode = mode;                    // 'factor' | 'multiple'
    this.interactive = interactive;
    this.onSolved = onSolved ?? (() => {});
    this.found = new Set();
  }

  _isA(n) { return this.mode === 'factor' ? this.a % n === 0 : n % this.a === 0; }
  _isB(n) { return this.mode === 'factor' ? this.b % n === 0 : n % this.b === 0; }

  get _common() {
    const list = [];
    for (let n = 1; n <= this.max; n++) if (this._isA(n) && this._isB(n)) list.push(n);
    return list;
  }

  mount(container) {
    const wrap = El('div', { class: 'numgrid-wrap' });
    const word = this.mode === 'factor' ? '因數' : '倍數';

    const legend = El('div', { class: 'grid-legend' },
      El('span', { class: 'legend-item legend-a' }, `${this.a} 的${word}`),
      El('span', { class: 'legend-item legend-b' }, `${this.b} 的${word}`),
      El('span', { class: 'legend-item legend-both' }, `兩個都是（公${word}）`));

    const grid = El('div', { class: 'numgrid' });
    this.cells = [];
    for (let n = 1; n <= this.max; n++) {
      const cell = El('button', {
        class: 'numcell', type: 'button',
        disabled: this.interactive ? null : 'disabled',
      }, String(n));
      if (!this.interactive) {
        const inA = this._isA(n), inB = this._isB(n);
        if (inA && inB) cell.classList.add('is-both');
        else if (inA) cell.classList.add('is-a');
        else if (inB) cell.classList.add('is-b');
      } else {
        cell.addEventListener('click', () => this._tap(n, cell));
      }
      grid.append(cell);
      this.cells.push(cell);
    }

    const common = this._common;
    this.status = El('p', { class: 'numgrid-status', role: 'status' },
      this.interactive
        ? `點出所有「${this.a} 和 ${this.b} 的公${word}」（共 ${common.length} 個）`
        : `公${word}是 ${common.join('、')}${this.mode === 'factor'
            ? `，其中最大的 ${Math.max(...common)} 叫做「最大公因數」`
            : `…，其中最小的 ${Math.min(...common)} 叫做「最小公倍數」`}`);

    wrap.append(legend, grid, this.status);
    container.append(wrap);
    return this;
  }

  _tap(n, cell) {
    if (cell.classList.contains('is-both')) return;
    const word = this.mode === 'factor' ? '因數' : '倍數';
    if (this._isA(n) && this._isB(n)) {
      cell.classList.add('is-both');
      this.found.add(n);
      buzz(25);
      const total = this._common.length;
      this.status.textContent = `找到 ${this.found.size} / ${total} 個`;
      if (this.found.size === total) {
        const c = this._common;
        this.status.textContent = this.mode === 'factor'
          ? `全部找到了！公因數是 ${c.join('、')}，最大公因數是 ${Math.max(...c)}。`
          : `全部找到了！公倍數是 ${c.join('、')}…，最小公倍數是 ${Math.min(...c)}。`;
        buzz(40);
        this.onSolved();
      }
    } else {
      cell.classList.add('is-off');
      buzz(60);
      const inA = this._isA(n), inB = this._isB(n);
      this.status.textContent = inA
        ? `${n} 只是 ${this.a} 的${word}，不是 ${this.b} 的${word}，所以不算公${word}。`
        : inB
          ? `${n} 只是 ${this.b} 的${word}，不是 ${this.a} 的${word}，所以不算公${word}。`
          : `${n} 兩邊都不是${word}。`;
      setTimeout(() => cell.classList.remove('is-off'), 800);
    }
  }

  destroy() {}
}

/** 因數的文氏圖。左右各放獨有的因數，中間交集就是公因數。 */
class VennFactors {
  constructor({ a, b }) { this.a = a; this.b = b; }

  _factors(n) {
    const f = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i);
    return f;
  }

  mount(container) {
    const fa = this._factors(this.a);
    const fb = this._factors(this.b);
    const both = fa.filter((n) => fb.includes(n));
    const onlyA = fa.filter((n) => !both.includes(n));
    const onlyB = fb.filter((n) => !both.includes(n));

    const W = 640, H = 340;
    const svg = Svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'venn-svg',
      role: 'img', 'aria-label': `${this.a} 與 ${this.b} 的因數文氏圖` });

    svg.append(
      Svg('circle', { cx: 250, cy: 170, r: 140, class: 'venn-circle venn-a' }),
      Svg('circle', { cx: 390, cy: 170, r: 140, class: 'venn-circle venn-b' }),
      Svg('text', { x: 150, y: 44, class: 'venn-label venn-label-a', 'text-anchor': 'middle' }, `${this.a} 的因數`),
      Svg('text', { x: 490, y: 44, class: 'venn-label venn-label-b', 'text-anchor': 'middle' }, `${this.b} 的因數`)
    );

    const place = (nums, cx, cls) => {
      const startY = 170 - ((nums.length - 1) * 34) / 2;
      nums.forEach((n, i) => {
        svg.append(Svg('text', {
          x: cx, y: startY + i * 34 + 8, class: `venn-num ${cls}`, 'text-anchor': 'middle',
        }, String(n)));
      });
    };
    place(onlyA, 175, 'venn-num-a');
    place(both, 320, 'venn-num-both');
    place(onlyB, 465, 'venn-num-b');

    const caption = El('p', { class: 'venn-caption' },
      `中間重疊的部分 ${both.join('、')} 就是 ${this.a} 和 ${this.b} 的公因數，` +
      `其中最大的 ${Math.max(...both)} 就是「最大公因數」。`);

    container.append(El('div', { class: 'venn-wrap' }, svg), caption);
    return this;
  }

  destroy() {}
}

/**
 * 週期同步時間軸。兩班公車各自每隔幾分鐘發一班，什麼時候會同時發車？
 * 最小公倍數最好懂的具體模型——小孩看得到「兩排記號第一次對齊」的位置。
 */
class PeriodSync {
  constructor({ pa, pb, max, labelA, labelB }) {
    this.pa = pa; this.pb = pb; this.max = max;
    this.labelA = labelA ?? `每 ${pa} 分鐘`;
    this.labelB = labelB ?? `每 ${pb} 分鐘`;
  }

  mount(container) {
    // left 要留得夠寬：標籤是右對齊貼著軸線起點，太窄會讓「紅線」「藍線」被裁掉
    const W = 700, H = 250, left = 150, right = 30;
    const plotW = W - left - right;
    const x = (t) => left + (plotW * t) / this.max;

    const svg = Svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'sync-svg',
      role: 'img', 'aria-label': '兩個週期的時間軸' });

    const lcm = (() => {
      const g = (m, n) => (n === 0 ? m : g(n, m % n));
      return (this.pa * this.pb) / g(this.pa, this.pb);
    })();

    [[this.pa, 70, 'sync-a', this.labelA],
     [this.pb, 140, 'sync-b', this.labelB]].forEach(([p, y, cls, label]) => {
      svg.append(
        Svg('line', { x1: left, y1: y, x2: left + plotW, y2: y, class: 'sync-axis' }),
        Svg('text', { x: left - 14, y: y + 6, class: 'sync-label', 'text-anchor': 'end' }, label)
      );
      for (let t = p; t <= this.max; t += p) {
        const isSync = t % lcm === 0;
        svg.append(Svg('circle', {
          cx: x(t), cy: y, r: isSync ? 13 : 8,
          class: `sync-dot ${cls}` + (isSync ? ' is-sync' : ''),
        }));
      }
    });

    // 對齊的時刻畫一條直線串起來，讓「同時」看得見
    for (let t = lcm; t <= this.max; t += lcm) {
      svg.append(
        Svg('line', { x1: x(t), y1: 56, x2: x(t), y2: 154, class: 'sync-join' }),
        Svg('text', { x: x(t), y: 186, class: 'sync-mark', 'text-anchor': 'middle' }, `${t} 分`)
      );
    }

    // 時間刻度
    for (let t = 0; t <= this.max; t += Math.max(1, Math.round(this.max / 12))) {
      svg.append(Svg('text', { x: x(t), y: 224, class: 'sync-tick', 'text-anchor': 'middle' }, String(t)));
    }
    svg.append(Svg('text', { x: left + plotW / 2, y: 244, class: 'sync-tick', 'text-anchor': 'middle' }, '時間（分鐘）'));

    container.append(
      El('div', { class: 'sync-wrap' }, svg),
      El('p', { class: 'sync-caption' },
        `第一次同時發車是在第 ${lcm} 分鐘——${lcm} 就是 ${this.pa} 和 ${this.pb} 的最小公倍數。` +
        `之後每隔 ${lcm} 分鐘就會再遇到一次。`)
    );
    return this;
  }

  destroy() {}
}

/**
 * 運算順序求解器。
 * 不直接告訴小孩答案，而是每一步問「你覺得先算哪一段？」，
 * 選錯的時候針對他選的那一段解釋為什麼不能先算——
 * 錯誤本身就是教學素材，比事後才講規則有效。
 */
class ExpressionSolver {
  constructor({ steps, answer, onSolved }) {
    this.steps = steps;              // [{ expr, options:[{text, ok, why}], after }]
    this.answer = answer;
    this.onSolved = onSolved ?? (() => {});
    this.index = 0;
    this.history = [];
    this.locked = false;
  }

  mount(container) {
    this.root = El('div', { class: 'solver' });
    container.append(this.root);
    this._render();
    return this;
  }

  _render() {
    const step = this.steps[this.index];
    this.root.replaceChildren();
    this.locked = false;

    if (this.history.length) {
      this.root.append(El('p', { class: 'solver-history' }, this.history.join('　→　')));
    }

    this.root.append(
      El('div', { class: 'solver-expr' }, step.expr),
      El('p', { class: 'solver-ask' }, '先算哪一段？')
    );

    const opts = El('div', { class: 'solver-options' });
    shuffle(step.options).forEach((o) => {
      const btn = El('button', { class: 'solver-option', type: 'button' }, o.text);
      btn.addEventListener('click', () => this._pick(o, btn, opts));
      opts.append(btn);
    });
    this.root.append(opts);

    this.note = El('div', { class: 'solver-note', role: 'status' });
    this.root.append(this.note);
  }

  _pick(o, btn, opts) {
    if (this.locked) return;
    if (!o.ok) {
      btn.classList.add('is-wrong');
      this.note.replaceChildren(El('p', { class: 'explain-bad' }, o.why));
      buzz(60);
      return;                        // 選錯不鎖，讓他再選一次
    }
    this.locked = true;
    btn.classList.add('is-correct');
    opts.querySelectorAll('.solver-option').forEach((b) => (b.disabled = true));
    buzz(30);

    const step = this.steps[this.index];
    this.history.push(step.expr);
    this.note.replaceChildren(
      El('p', { class: 'explain-good' }, o.why),
      El('button', {
        class: 'btn btn--primary', type: 'button',
        onClick: () => {
          if (this.index < this.steps.length - 1) { this.index++; this._render(); }
          else this._finish();
        },
      }, this.index < this.steps.length - 1 ? '算下一步 →' : '看答案')
    );
  }

  _finish() {
    this.root.replaceChildren(
      El('p', { class: 'solver-history' }, this.history.join('　→　')),
      El('div', { class: 'solver-expr is-answer' }, `= ${this.answer}`),
      El('p', { class: 'explain-good' }, '運算順序全部正確！'),
      El('button', {
        class: 'btn btn--ghost', type: 'button',
        onClick: () => { this.index = 0; this.history = []; this._render(); },
      }, '再做一次')
    );
    this.onSolved();
  }

  destroy() {}
}

/** 最大公因數。約分與通分都會用到。 */
const gcd = (m, n) => (n === 0 ? m : gcd(n, m % n));
const lcm = (m, n) => (m * n) / gcd(m, n);

/** 畫一條分數條：分成 d 等份、塗滿前 n 份。回傳 DOM 節點。 */
const fractionBar = (n, d, cls = '') =>
  El('div', { class: `frac-bar ${cls}`, style: `grid-template-columns: repeat(${d}, 1fr)` },
    Array.from({ length: d }, (_, i) =>
      El('span', { class: 'frac-seg' + (i < n ? ' is-filled' : '') })));

/** 分數的文字寫法 n/d，用上下排版而不是斜線，跟課本一致。 */
const fractionText = (n, d, cls = '') =>
  El('span', { class: `frac-text ${cls}` },
    El('span', { class: 'frac-n' }, String(n)),
    El('span', { class: 'frac-line' }),
    El('span', { class: 'frac-d' }, String(d)));

/**
 * 等值分數探索器（擴分／約分的核心）。
 * 重點在：不管切得多細，塗色的「長度」永遠一樣寬。
 * 這條長度不變的視覺事實，就是「分子分母同乘（除）同一個數，大小不變」的證明。
 */
class EquivalentFraction {
  constructor({ n, d }) {
    this.baseN = n; this.baseD = d;
    this.n = n; this.d = d;
    this.chain = [`${n}/${d}`];
  }

  mount(container) {
    const wrap = El('div', { class: 'frac-wrap' });

    this.barHolder = El('div', { class: 'frac-bar-holder' });
    this.readout = El('div', { class: 'frac-readout' });
    this.chainEl = El('p', { class: 'frac-chain' });
    this.note = El('p', { class: 'frac-note', role: 'status' });

    const controls = El('div', { class: 'frac-controls' });
    [2, 3].forEach((k) => {
      const btn = El('button', { class: 'btn btn--ghost frac-btn', type: 'button' }, `× ${k}`);
      btn.addEventListener('click', () => this._scale(k));
      controls.append(btn);
    });
    [2, 3].forEach((k) => {
      const btn = El('button', {
        class: 'btn btn--ghost frac-btn', type: 'button', dataset: { div: String(k) },
      }, `÷ ${k}`);
      btn.addEventListener('click', () => this._reduce(k));
      controls.append(btn);
    });
    const reset = El('button', { class: 'btn btn--ghost frac-btn', type: 'button' }, '重來');
    reset.addEventListener('click', () => {
      this.n = this.baseN; this.d = this.baseD;
      this.chain = [`${this.baseN}/${this.baseD}`];
      this.note.textContent = '';
      this._redraw();
    });
    controls.append(reset);
    this.controls = controls;

    wrap.append(this.readout, this.barHolder, controls, this.chainEl, this.note);
    container.append(wrap);
    this._redraw();
    return this;
  }

  _scale(k) {
    if (this.d * k > 48) {           // 超過 48 等份，格子細到看不出來，反而失去教學意義
      this.note.textContent = '再切下去每一份會細到看不清楚，先按「重來」或用 ÷ 試試看。';
      return;
    }
    this.n *= k; this.d *= k;
    this.chain.push(`${this.n}/${this.d}`);
    this.note.textContent = `分子分母都乘以 ${k}：切成 ${k} 倍細，但塗色的長度完全沒變。這叫「擴分」。`;
    buzz();
    this._redraw();
  }

  _reduce(k) {
    if (this.n % k !== 0 || this.d % k !== 0) {
      this.note.textContent = `${this.n} 和 ${this.d} 沒辦法同時被 ${k} 整除，不能這樣約。`;
      buzz(60);
      return;
    }
    this.n /= k; this.d /= k;
    this.chain.push(`${this.n}/${this.d}`);
    this.note.textContent = `分子分母都除以 ${k}：格子變粗了，但塗色的長度還是一樣。這叫「約分」。`;
    buzz();
    this._redraw();
  }

  _redraw() {
    this.readout.replaceChildren(fractionText(this.n, this.d, 'is-big'));
    this.barHolder.replaceChildren(fractionBar(this.n, this.d));
    this.chainEl.textContent = this.chain.join('  =  ');
    // ÷ 按鈕只在真的除得盡時才可按，避免小孩亂試而困惑
    this.controls.querySelectorAll('[data-div]').forEach((b) => {
      const k = Number(b.dataset.div);
      b.disabled = !(this.n % k === 0 && this.d % k === 0);
    });
  }

  destroy() {}
}

/** 約分練習：一直除到不能再除為止，就是最簡分數。 */
class SimplifyTool {
  constructor({ n, d, onSolved }) {
    this.startN = n; this.startD = d;
    this.n = n; this.d = d;
    this.onSolved = onSolved ?? (() => {});
    this.steps = 0;
  }

  mount(container) {
    const wrap = El('div', { class: 'frac-wrap' });
    this.readout = El('div', { class: 'frac-readout' });
    this.barHolder = El('div', { class: 'frac-bar-holder' });
    this.note = El('p', { class: 'frac-note', role: 'status' }, '點下面的數字，把分子和分母同時除以它');

    this.controls = El('div', { class: 'frac-controls' });
    [2, 3, 4, 5, 6, 7, 9].forEach((k) => {
      const btn = El('button', {
        class: 'btn btn--ghost frac-btn', type: 'button', dataset: { k: String(k) },
      }, `÷ ${k}`);
      btn.addEventListener('click', () => this._divide(k));
      this.controls.append(btn);
    });

    wrap.append(this.readout, this.barHolder, this.controls, this.note);
    container.append(wrap);
    this._redraw();
    return this;
  }

  _divide(k) {
    if (this.n % k !== 0 || this.d % k !== 0) {
      this.note.textContent =
        `${this.n} 和 ${this.d} 不能同時被 ${k} 整除——${k} 不是它們的公因數。`;
      buzz(60);
      return;
    }
    this.n /= k; this.d /= k;
    this.steps++;
    buzz();
    if (gcd(this.n, this.d) === 1) {
      this.note.textContent =
        `${this.n}/${this.d} 的分子分母除了 1 以外沒有共同的因數了，這就是「最簡分數」。` +
        (this.steps > 1
          ? `（你分了 ${this.steps} 次才約完。如果一開始就直接除以最大公因數 ${this.startD / this.d}，一次就到了。）`
          : '（一次就約到最簡，因為你用的就是最大公因數。）');
      this.controls.querySelectorAll('button').forEach((b) => (b.disabled = true));
      this.onSolved();
    } else {
      this.note.textContent = `除以 ${k} 之後變成 ${this.n}/${this.d}，還可以再約，繼續。`;
    }
    this._redraw();
  }

  _redraw() {
    this.readout.replaceChildren(
      fractionText(this.startN, this.startD, 'is-dim'),
      El('span', { class: 'frac-arrow' }, '→'),
      fractionText(this.n, this.d, 'is-big'));
    this.barHolder.replaceChildren(fractionBar(this.n, this.d));
    this.controls.querySelectorAll('[data-k]').forEach((b) => {
      const k = Number(b.dataset.k);
      if (!b.disabled) b.classList.toggle('is-dim', !(this.n % k === 0 && this.d % k === 0));
    });
  }

  destroy() {}
}

/**
 * 異分母加減法的分步演示。
 * 一步一步走：看見問題 → 通分 → 相加 → 約分，每一步都有圖。
 */
class FractionAdd {
  constructor({ a, b, op = '+' }) {
    this.a = a;                       // { n, d }
    this.b = b;
    this.op = op;
    this.step = 0;
    this.L = lcm(a.d, b.d);
  }

  get _converted() {
    return {
      a: { n: this.a.n * (this.L / this.a.d), d: this.L },
      b: { n: this.b.n * (this.L / this.b.d), d: this.L },
    };
  }

  get _result() {
    const c = this._converted;
    const n = this.op === '+' ? c.a.n + c.b.n : c.a.n - c.b.n;
    return { n, d: this.L };
  }

  mount(container) {
    this.wrap = El('div', { class: 'frac-wrap' });
    this.body = El('div', { class: 'fadd-body' });
    this.note = El('p', { class: 'frac-note', role: 'status' });
    this.next = El('button', { class: 'btn btn--primary', type: 'button' }, '下一步 →');
    this.next.addEventListener('click', () => {
      if (this.step < 3) { this.step++; buzz(); this._redraw(); }
    });
    const back = El('button', { class: 'btn btn--ghost', type: 'button' }, '重看一次');
    back.addEventListener('click', () => { this.step = 0; this._redraw(); });

    this.wrap.append(this.body, this.note, El('div', { class: 'fadd-nav' }, back, this.next));
    container.append(this.wrap);
    this._redraw();
    return this;
  }

  _row(label, frac, cls = '') {
    return El('div', { class: 'fadd-row' },
      El('span', { class: 'fadd-label' }, label),
      fractionText(frac.n, frac.d, cls),
      fractionBar(frac.n, frac.d, cls));
  }

  _redraw() {
    const c = this._converted;
    const res = this._result;
    this.body.replaceChildren();

    if (this.step === 0) {
      this.body.append(this._row('', this.a), this._row(this.op, this.b));
      this.note.textContent =
        `${this.a.n}/${this.a.d} ${this.op} ${this.b.n}/${this.b.d}：兩條的格子大小不一樣，` +
        '不能直接把分子加起來——就像 1 塊大的和 1 塊小的，不能說成 2 塊一樣大的。';
    } else if (this.step === 1) {
      this.body.append(this._row('', this.a), this._row(this.op, this.b));
      this.note.textContent =
        `先讓兩邊的格子一樣大。${this.a.d} 和 ${this.b.d} 的最小公倍數是 ${this.L}，` +
        `所以兩條都改切成 ${this.L} 等份。`;
    } else if (this.step === 2) {
      this.body.append(this._row('', c.a, 'is-converted'), this._row(this.op, c.b, 'is-converted'));
      this.note.textContent =
        `通分完成：${this.a.n}/${this.a.d} = ${c.a.n}/${this.L}，` +
        `${this.b.n}/${this.b.d} = ${c.b.n}/${this.L}。塗色長度都沒變，只是切得不一樣了。`;
    } else {
      this.body.append(
        this._row('', c.a, 'is-converted'),
        this._row(this.op, c.b, 'is-converted'),
        El('div', { class: 'fadd-sep' }),
        this._row('=', res, 'is-result'));
      const g = gcd(Math.abs(res.n), res.d);
      this.note.textContent =
        `現在格子一樣大了，分子直接${this.op === '+' ? '相加' : '相減'}：` +
        `${c.a.n} ${this.op} ${c.b.n} = ${res.n}，分母不變還是 ${this.L}。` +
        (g > 1 ? `（${res.n}/${res.d} 還可以約分成 ${res.n / g}/${res.d / g}。）` : '（已經是最簡分數了。）');
    }

    this.next.disabled = this.step >= 3;
    this.next.textContent = this.step >= 3 ? '完成' : '下一步 →';
  }

  destroy() {}
}

/**
 * 分堆取幾份。用來建立「整數 × 幾分之一」的意義：
 * 12 × 1/3 不是「12 變成 3 倍」，是「把 12 平分成 3 堆，取其中 1 堆」。
 */
class GroupSplit {
  constructor({ total, parts, take }) {
    this.total = total; this.parts = parts; this.take = take;
  }

  mount(container) {
    const per = this.total / this.parts;
    const wrap = El('div', { class: 'group-wrap' });
    const board = El('div', { class: 'group-board' });

    for (let g = 0; g < this.parts; g++) {
      const taken = g < this.take;
      const group = El('div', { class: 'group-box' + (taken ? ' is-taken' : '') });
      for (let i = 0; i < per; i++) group.append(El('span', { class: 'group-dot' }));
      group.append(El('span', { class: 'group-cap' }, `${per} 個`));
      board.append(group);
    }

    wrap.append(
      El('p', { class: 'group-label' },
        `把 ${this.total} 個平分成 ${this.parts} 堆，每堆 ${per} 個；取其中 ${this.take} 堆。`),
      board,
      El('p', { class: 'group-result' },
        `${this.total} × ${this.take}/${this.parts} = ${per * this.take}`));
    container.append(wrap);
    return this;
  }

  destroy() {}
}

/**
 * 分數乘法的面積模型。
 * 橫的切 a 份、直的切 b 份，重疊的格子就是答案的分子，總格數就是分母。
 * 「為什麼分母要相乘」用講的很抽象，用格子數就一目了然。
 */
class AreaModel {
  constructor({ a, b }) {
    this.a = a;                       // 橫向分數 { n, d }
    this.b = b;                       // 縱向分數 { n, d }
    this.step = 0;
  }

  mount(container) {
    this.wrap = El('div', { class: 'area-wrap' });
    this.board = El('div', { class: 'area-board' });
    this.note = El('p', { class: 'frac-note', role: 'status' });

    this.next = El('button', { class: 'btn btn--primary', type: 'button' }, '下一步 →');
    this.next.addEventListener('click', () => {
      if (this.step < 2) { this.step++; buzz(); this._redraw(); }
    });
    const back = El('button', { class: 'btn btn--ghost', type: 'button' }, '重看一次');
    back.addEventListener('click', () => { this.step = 0; this._redraw(); });

    this.wrap.append(this.board, this.note, El('div', { class: 'fadd-nav' }, back, this.next));
    container.append(this.wrap);
    this._redraw();
    return this;
  }

  _redraw() {
    const { a, b } = this;
    this.board.replaceChildren();
    this.board.style.gridTemplateColumns = `repeat(${a.d}, 1fr)`;
    this.board.style.gridTemplateRows = `repeat(${b.d}, 1fr)`;

    for (let r = 0; r < b.d; r++) {
      for (let c = 0; c < a.d; c++) {
        const inCol = c < a.n;                 // 屬於橫向分數
        const inRow = r < b.n;                 // 屬於縱向分數
        let cls = 'area-cell';
        if (this.step >= 1 && inCol && inRow) cls += ' is-both';
        else if (this.step >= 0 && inCol) cls += ' is-col';
        if (this.step >= 1 && inRow && !inCol) cls += ' is-row';
        this.board.append(El('span', { class: cls }));
      }
    }

    if (this.step === 0) {
      this.note.textContent =
        `先看橫的：整張紙直著切成 ${a.d} 條，塗滿其中 ${a.n} 條，這就是 ${a.n}/${a.d}。`;
    } else if (this.step === 1) {
      this.note.textContent =
        `再看直的：橫著切成 ${b.d} 排，取其中 ${b.n} 排。` +
        `我們要的是「${a.n}/${a.d} 的 ${b.n}/${b.d}」，也就是兩邊都被選到的部分。`;
    } else {
      const n = a.n * b.n, d = a.d * b.d;
      const g = gcd(n, d);
      this.note.textContent =
        `重疊的格子有 ${a.n} × ${b.n} = ${n} 格，整張紙總共 ${a.d} × ${b.d} = ${d} 格，` +
        `所以答案是 ${n}/${d}` +
        (g > 1 ? `，約分後是 ${n / g}/${d / g}。` : '。') +
        `　這就是為什麼分數相乘要「分子乘分子、分母乘分母」。`;
    }

    this.next.disabled = this.step >= 2;
    this.next.textContent = this.step >= 2 ? '完成' : '下一步 →';
  }

  destroy() {}
}

/**
 * 分類遊戲：先點卡片，再點要放進去的籃子。
 * 用來處理「因數」和「倍數」搞混這個最常見的卡點。
 */
class SortBuckets {
  constructor({ buckets, items, onSolved, wide = false }) {
    this.buckets = buckets;            // [{ id, label }]
    this.items = items;                // [{ text, bucket, why }]
    this.wide = wide;                  // 卡片是整句應用題時設 true，排版才不會擠成一團
    this.onSolved = onSolved ?? (() => {});
    this.left = shuffle(this.items);
    this.placed = 0;
    this.selected = null;
  }

  mount(container) {
    const wrap = El('div', { class: 'sort-wrap' });
    this.pool = El('div', { class: 'sort-pool' });
    this.zone = El('div', { class: 'sort-buckets' });
    this.note = El('p', { class: 'sort-note', role: 'status' }, '先點一張卡片，再點它該去的籃子');

    if (this.wide) this.pool.classList.add('sort-pool--wide');
    this.left.forEach((item, i) => {
      const card = El('button', {
        class: 'sort-card' + (this.wide ? ' sort-card--wide' : ''),
        type: 'button', dataset: { i: String(i) },
      }, item.text);
      card.addEventListener('click', () => {
        if (card.classList.contains('is-done')) return;
        this.pool.querySelectorAll('.sort-card').forEach((c) => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        this.selected = { item, card };
        buzz();
      });
      this.pool.append(card);
    });

    this.buckets.forEach((b) => {
      const box = El('button', { class: 'sort-bucket', type: 'button' },
        El('strong', {}, b.label));
      box.addEventListener('click', () => this._drop(b.id, box));
      this.zone.append(box);
    });

    wrap.append(this.pool, this.zone, this.note);
    container.append(wrap);
    return this;
  }

  _drop(bucketId, box) {
    if (!this.selected) { this.note.textContent = '要先點一張卡片喔'; return; }
    const { item, card } = this.selected;
    if (item.bucket === bucketId) {
      card.classList.add('is-done');
      card.classList.remove('is-selected');
      card.disabled = true;
      this.placed++;
      this.note.textContent = item.why;
      buzz(30);
      this.selected = null;
      if (this.placed === this.items.length) {
        this.note.textContent = '全部分類正確！因數和倍數的差別你抓到了。';
        this.onSolved();
      }
    } else {
      box.classList.add('is-wrong');
      this.note.textContent = '不是這個籃子，再想想「誰除得盡誰」。';
      setTimeout(() => box.classList.remove('is-wrong'), 600);
    }
  }

  destroy() {}
}

/* ════════════════════════════════════════════
   幾何元件（單元 3 平面圖形 / 5 立體形體 / 8 面積 / 10 扇形 共用）

   共通約定：
   - 一律用 Pointer Events 拖曳，且可見圖形設 pointer-events:none，
     只有透明的大觸控圈接收事件（第一版就是踩過這個坑：
     手指點正中央會打到可見圖形，closest() 找不到觸控目標，拖曳整個失效）
   - 座標用格線單位（GRID_UNIT）計算，換算成 SVG 座標才畫，
     這樣邊長/面積可以直接用整數格數表示，不用處理像素換算
   ════════════════════════════════════════════ */

const GEO = { W: 640, H: 460, unit: 40, pad: 40 };

/** 格線座標 → SVG 座標 */
const gx = (x) => GEO.pad + x * GEO.unit;
const gy = (y) => GEO.H - GEO.pad - y * GEO.unit;
/** SVG 座標 → 格線座標（拖曳時反推用，會吸附到最近的格點） */
const ungx = (px) => Math.round((px - GEO.pad) / GEO.unit);
const ungy = (py) => Math.round((GEO.H - GEO.pad - py) / GEO.unit);

/** 畫背景格線 */
const geoGrid = (cols, rows) => {
  const g = Svg('g', { class: 'geo-grid' });
  for (let x = 0; x <= cols; x++) {
    g.append(Svg('line', { x1: gx(x), y1: gy(0), x2: gx(x), y2: gy(rows) }));
  }
  for (let y = 0; y <= rows; y++) {
    g.append(Svg('line', { x1: gx(0), y1: gy(y), x2: gx(cols), y2: gy(y) }));
  }
  return g;
};

const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);

/** 多邊形在頂點 i 的內角（度） */
const angleAt = (pts, i) => {
  const n = pts.length;
  const p = pts[(i - 1 + n) % n], c = pts[i], q = pts[(i + 1) % n];
  const a = { x: p.x - c.x, y: p.y - c.y };
  const b = { x: q.x - c.x, y: q.y - c.y };
  const cos = (a.x * b.x + a.y * b.y) / (Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y));
  return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
};

/**
 * 可拖曳頂點的多邊形板。
 * 這是平面圖形單元的主力：小孩拖動頂點，邊長和角度即時跟著變，
 * 但三角形內角和永遠是 180°——自己拖出來的結論，比課本寫的有說服力。
 */
class GeoBoard {
  constructor({ points, cols = 13, rows = 9, showSides = true, showAngles = true, editable = true, onChange }) {
    this.points = points.map((p) => ({ ...p }));
    this.cols = cols; this.rows = rows;
    this.showSides = showSides;
    this.showAngles = showAngles;
    this.editable = editable;
    this.onChange = onChange ?? (() => {});
    this._cleanup = [];
  }

  mount(container) {
    const svg = Svg('svg', {
      viewBox: `0 0 ${GEO.W} ${GEO.H}`, class: 'geo-svg',
      role: 'img', 'aria-label': '可拖曳頂點的圖形',
    });
    svg.append(geoGrid(this.cols, this.rows));

    this.poly = Svg('polygon', { class: 'geo-poly' });
    this.labels = Svg('g', { class: 'geo-labels' });
    svg.append(this.poly, this.labels);

    // 觸控圈在下、可見的點在上；可見的點關掉指標事件，事件才會落到觸控圈
    this.hits = this.points.map((_, i) =>
      Svg('circle', { r: 30, class: 'geo-hit', 'data-index': i }));
    this.dots = this.points.map(() => Svg('circle', { r: 12, class: 'geo-dot' }));
    this.hits.forEach((h) => svg.append(h));
    this.dots.forEach((d) => svg.append(d));

    if (this.editable) this._bindDrag(svg);
    this.svg = svg;

    this.readout = El('p', { class: 'geo-readout', role: 'status' });
    container.append(El('div', { class: 'geo-wrap' }, svg), this.readout);
    this._redraw();
    return this;
  }

  _bindDrag(svg) {
    let active = null;
    const toGrid = (evt) => {
      const r = svg.getBoundingClientRect();
      const px = ((evt.clientX - r.left) / r.width) * GEO.W;
      const py = ((evt.clientY - r.top) / r.height) * GEO.H;
      return {
        x: Math.max(0, Math.min(this.cols, ungx(px))),
        y: Math.max(0, Math.min(this.rows, ungy(py))),
      };
    };
    const down = (e) => {
      const t = e.target.closest('.geo-hit');
      if (!t) return;
      e.preventDefault();
      active = Number(t.dataset.index);
      t.setPointerCapture(e.pointerId);
      this.dots[active].classList.add('is-dragging');
      buzz();
    };
    const move = (e) => {
      if (active === null) return;
      e.preventDefault();
      const g = toGrid(e);
      if (g.x !== this.points[active].x || g.y !== this.points[active].y) {
        this.points[active] = g;
        this._redraw();
        this.onChange(this.points.map((p) => ({ ...p })));
      }
    };
    const up = (e) => {
      if (active === null) return;
      this.dots[active].classList.remove('is-dragging');
      const t = e.target.closest('.geo-hit');
      if (t && t.hasPointerCapture?.(e.pointerId)) t.releasePointerCapture(e.pointerId);
      active = null;
    };
    svg.addEventListener('pointerdown', down);
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    this._cleanup.push(() => {
      svg.removeEventListener('pointerdown', down);
      svg.removeEventListener('pointermove', move);
      svg.removeEventListener('pointerup', up);
      svg.removeEventListener('pointercancel', up);
    });
  }

  _redraw() {
    const pts = this.points;
    this.poly.setAttribute('points', pts.map((p) => `${gx(p.x)},${gy(p.y)}`).join(' '));
    pts.forEach((p, i) => {
      this.hits[i].setAttribute('cx', gx(p.x));
      this.hits[i].setAttribute('cy', gy(p.y));
      this.dots[i].setAttribute('cx', gx(p.x));
      this.dots[i].setAttribute('cy', gy(p.y));
    });

    this.labels.replaceChildren();
    if (this.showSides) {
      pts.forEach((p, i) => {
        const q = pts[(i + 1) % pts.length];
        const mid = { x: (gx(p.x) + gx(q.x)) / 2, y: (gy(p.y) + gy(q.y)) / 2 };
        this.labels.append(Svg('text', {
          x: mid.x, y: mid.y - 10, class: 'geo-side', 'text-anchor': 'middle',
        }, dist(p, q).toFixed(1)));
      });
    }
    if (this.showAngles) {
      pts.forEach((p, i) => {
        this.labels.append(Svg('text', {
          x: gx(p.x), y: gy(p.y) + 34, class: 'geo-angle', 'text-anchor': 'middle',
        }, `${Math.round(angleAt(pts, i))}°`));
      });
    }

    const sum = pts.reduce((s, _, i) => s + angleAt(pts, i), 0);
    const name = pts.length === 3 ? '三角形' : pts.length === 4 ? '四邊形' : `${pts.length} 邊形`;
    this.readout.textContent =
      `${name}　內角和 = ${Math.round(sum)}°　（拖動任何一個頂點試試看，內角和會不會變）`;
  }

  destroy() {
    this._cleanup.forEach((fn) => fn());
    this._cleanup = [];
  }
}

/**
 * 三根吸管排三角形。
 * 「任兩邊之和要大於第三邊」用背的很抽象，但看到兩根短的怎麼樣都碰不到，
 * 小孩自己就會說出這個結論。
 */
class TriangleSides {
  constructor({ a = 5, b = 4, c = 6, max = 10, onChange }) {
    this.s = { a, b, c };              // a、b 是兩腰，c 是底
    this.max = max;
    this.onChange = onChange ?? (() => {});
  }

  get _valid() {
    const { a, b, c } = this.s;
    return a + b > c && b + c > a && a + c > b;
  }

  /** 哪一條不等式沒過（回傳說明文字） */
  get _why() {
    const { a, b, c } = this.s;
    if (a + b <= c) return `${a} + ${b} = ${a + b}，沒有大於底邊 ${c}`;
    if (b + c <= a) return `${b} + ${c} = ${b + c}，沒有大於 ${a}`;
    if (a + c <= b) return `${a} + ${c} = ${a + c}，沒有大於 ${b}`;
    return '';
  }

  mount(container) {
    const wrap = El('div', { class: 'tri-wrap' });

    this.controls = El('div', { class: 'tri-controls' });
    // 幾何上：A 是左端點、B 是右端點，從 A 出發的那條邊長度是 b、從 B 出發的是 a。
    // 所以「左邊」要對應 b、「右邊」對應 a，順序寫反的話控制項和圖上的數字會對不起來。
    [['c', '底邊'], ['b', '左邊'], ['a', '右邊']].forEach(([key, label]) => {
      const val = El('span', { class: 'tri-val', dataset: { k: key } }, String(this.s[key]));
      const row = El('div', { class: 'tri-row' },
        El('span', { class: 'tri-label' }, label),
        El('button', { class: 'btn btn--round tri-step', type: 'button',
          onClick: () => this._bump(key, -1) }, '−'),
        val,
        El('button', { class: 'btn btn--round tri-step', type: 'button',
          onClick: () => this._bump(key, 1) }, '＋'));
      this.controls.append(row);
    });

    this.svg = Svg('svg', { viewBox: '0 0 560 340', class: 'geo-svg' });
    this.note = El('p', { class: 'geo-readout', role: 'status' });

    wrap.append(El('div', { class: 'geo-wrap' }, this.svg), this.controls, this.note);
    container.append(wrap);
    this._redraw();
    return this;
  }

  _bump(key, d) {
    const next = this.s[key] + d;
    if (next < 1 || next > this.max) return;
    this.s[key] = next;
    buzz();
    this._redraw();
    this.onChange({ ...this.s });
  }

  _redraw() {
    const { a, b, c } = this.s;
    const U = 34;                       // 每單位長多少像素
    const originX = 60, originY = 260;

    this.controls.querySelectorAll('.tri-val').forEach((el) => {
      el.textContent = String(this.s[el.dataset.k]);
    });

    this.svg.replaceChildren();
    const A = { x: originX, y: originY };
    const B = { x: originX + c * U, y: originY };

    if (this._valid) {
      // 用餘弦定理定出第三個頂點
      const x = (b * b + c * c - a * a) / (2 * c);
      const y = Math.sqrt(Math.max(0, b * b - x * x));
      const C = { x: originX + x * U, y: originY - y * U };
      this.svg.append(
        Svg('polygon', { class: 'geo-poly',
          points: `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}` }),
        Svg('text', { class: 'geo-side', x: (A.x + B.x) / 2, y: A.y + 28, 'text-anchor': 'middle' }, String(c)),
        Svg('text', { class: 'geo-side', x: (A.x + C.x) / 2 - 16, y: (A.y + C.y) / 2 }, String(b)),
        Svg('text', { class: 'geo-side', x: (B.x + C.x) / 2 + 6, y: (B.y + C.y) / 2 }, String(a)));
      const kind = (a === b && b === c) ? '正三角形'
        : (a === b || b === c || a === c) ? '等腰三角形' : '不等邊三角形';
      this.note.textContent = `排得成！這是一個${kind}。任兩邊之和都大於第三邊。`;
      this.note.className = 'geo-readout is-good';
    } else {
      // 排不成：把兩根短的攤平指向對方，讓小孩看到中間接不起來
      const left = { x: originX + b * U, y: originY };
      const right = { x: originX + c * U - a * U, y: originY };
      this.svg.append(
        Svg('line', { class: 'geo-dim', x1: A.x, y1: A.y + 26, x2: B.x, y2: A.y + 26 }),
        Svg('text', { class: 'geo-side', x: (A.x + B.x) / 2, y: A.y + 54, 'text-anchor': 'middle' }, `底邊 ${c}`),
        Svg('line', { class: 'tri-stick', x1: A.x, y1: A.y, x2: left.x, y2: left.y }),
        Svg('line', { class: 'tri-stick', x1: B.x, y1: B.y, x2: right.x, y2: right.y }),
        Svg('circle', { class: 'geo-dot', cx: left.x, cy: left.y, r: 9 }),
        Svg('circle', { class: 'geo-dot', cx: right.x, cy: right.y, r: 9 }),
        Svg('text', { class: 'geo-side', x: (A.x + left.x) / 2, y: A.y - 16, 'text-anchor': 'middle' }, String(b)),
        Svg('text', { class: 'geo-side', x: (B.x + right.x) / 2, y: A.y - 16, 'text-anchor': 'middle' }, String(a)));
      this.note.textContent = `排不成三角形——${this._why}，兩根短的就算攤平也碰不到。`;
      this.note.className = 'geo-readout is-bad';
    }
  }

  destroy() {}
}

/**
 * 面積的分割重組。
 * 平行四邊形剪一刀移到另一邊就變成長方形——「底 × 高」的公式不是背來的，
 * 是看著圖形變過去的。三角形則是「兩個一樣的拼成平行四邊形」，所以要除以 2。
 */
class DissectArea {
  constructor({ mode = 'parallelogram', base = 6, height = 4, offset = 2, top = 3 }) {
    this.mode = mode;                  // 'parallelogram' | 'triangle' | 'trapezoid'
    this.base = base; this.height = height; this.offset = offset;
    this.top = top;                    // 梯形的上底
    this.step = 0;
    this.maxStep = 2;
  }

  mount(container) {
    this.wrap = El('div', { class: 'geo-wrap' });
    this.svg = Svg('svg', { viewBox: `0 0 ${GEO.W} ${GEO.H}`, class: 'geo-svg' });
    this.note = El('p', { class: 'geo-readout', role: 'status' });

    this.next = El('button', { class: 'btn btn--primary', type: 'button' }, '下一步 →');
    this.next.addEventListener('click', () => {
      if (this.step < this.maxStep) { this.step++; buzz(); this._redraw(); }
    });
    const back = El('button', { class: 'btn btn--ghost', type: 'button' }, '重看一次');
    back.addEventListener('click', () => { this.step = 0; this._redraw(); });

    container.append(
      El('div', { class: 'geo-wrap' }, this.svg),
      this.note,
      El('div', { class: 'fadd-nav' }, back, this.next));
    this._redraw();
    return this;
  }

  _redraw() {
    const { base: b, height: h, offset: o } = this;
    this.svg.replaceChildren(geoGrid(13, 9));
    const P = (x, y) => `${gx(x)},${gy(y)}`;

    if (this.mode === 'parallelogram') {
      if (this.step === 0) {
        this.svg.append(
          Svg('polygon', { class: 'geo-poly', points: [P(1, 1), P(1 + b, 1), P(1 + b + o, 1 + h), P(1 + o, 1 + h)].join(' ') }),
          Svg('line', { class: 'geo-dim', x1: gx(1), y1: gy(0.6), x2: gx(1 + b), y2: gy(0.6) }),
          Svg('text', { class: 'geo-dim-text', x: gx(1 + b / 2), y: gy(0.6) + 28, 'text-anchor': 'middle' }, `底 = ${b}`));
        this.note.textContent = '這是一個平行四邊形。底是 6，但它是斜的，沒辦法直接用「長 × 寬」算面積。';
      } else if (this.step === 1) {
        this.svg.append(
          Svg('polygon', { class: 'geo-poly', points: [P(1 + o, 1), P(1 + b, 1), P(1 + b + o, 1 + h), P(1 + o, 1 + h)].join(' ') }),
          Svg('polygon', { class: 'geo-piece', points: [P(1, 1), P(1 + o, 1), P(1 + o, 1 + h)].join(' ') }),
          Svg('line', { class: 'geo-cut', x1: gx(1 + o), y1: gy(1), x2: gx(1 + o), y2: gy(1 + h) }));
        this.note.textContent = '沿著虛線把左邊那個三角形剪下來（黃色的部分）。';
      } else {
        this.svg.append(
          Svg('polygon', { class: 'geo-poly', points: [P(1 + o, 1), P(1 + o + b, 1), P(1 + o + b, 1 + h), P(1 + o, 1 + h)].join(' ') }),
          Svg('line', { class: 'geo-dim', x1: gx(1 + o), y1: gy(0.6), x2: gx(1 + o + b), y2: gy(0.6) }),
          Svg('text', { class: 'geo-dim-text', x: gx(1 + o + b / 2), y: gy(0.6) + 28, 'text-anchor': 'middle' }, `底 = ${b}`),
          // 高的標示線要貼著長方形的左邊，離太遠會看不出它在量哪一段
          Svg('line', { class: 'geo-dim', x1: gx(1 + o - 0.4), y1: gy(1), x2: gx(1 + o - 0.4), y2: gy(1 + h) }),
          Svg('text', { class: 'geo-dim-text', x: gx(1 + o - 0.6), y: gy(1 + h / 2), 'text-anchor': 'end' }, `高 = ${h}`));
        this.note.textContent =
          `把剪下來的三角形移到右邊，剛好補齊，變成一個長方形！` +
          `長 = ${b}、寬 = ${h}，面積 = ${b} × ${h} = ${b * h}。` +
          `所以平行四邊形面積 = 底 × 高，高要量垂直的那一段，不是斜邊。`;
      }
    } else if (this.mode === 'trapezoid') {
      // 梯形 T：下底 b、上底 t、高 h，左上角往右偏 o
      const t = this.top;
      const T = [P(1, 1), P(1 + b, 1), P(1 + t + o, 1 + h), P(1 + o, 1 + h)].join(' ');
      // 把 T 繞右腰中點轉 180° 得到 T'，兩個剛好拼成平行四邊形
      const T2 = [P(1 + b + t + o, 1 + h), P(1 + t + o, 1 + h), P(1 + b, 1), P(1 + b + t, 1)].join(' ');

      if (this.step === 0) {
        this.svg.append(
          Svg('polygon', { class: 'geo-poly', points: T }),
          Svg('line', { class: 'geo-dim', x1: gx(1), y1: gy(0.6), x2: gx(1 + b), y2: gy(0.6) }),
          Svg('text', { class: 'geo-dim-text', x: gx(1 + b / 2), y: gy(0.6) + 28, 'text-anchor': 'middle' }, `下底 = ${b}`),
          Svg('line', { class: 'geo-dim', x1: gx(1 + o), y1: gy(1 + h + 0.4), x2: gx(1 + t + o), y2: gy(1 + h + 0.4) }),
          Svg('text', { class: 'geo-dim-text', x: gx(1 + o + t / 2), y: gy(1 + h + 0.4) - 12, 'text-anchor': 'middle' }, `上底 = ${t}`),
          Svg('line', { class: 'geo-dim', x1: gx(0.6), y1: gy(1), x2: gx(0.6), y2: gy(1 + h) }),
          Svg('text', { class: 'geo-dim-text', x: gx(0.6) - 14, y: gy(1 + h / 2), 'text-anchor': 'end' }, `高 = ${h}`));
        this.note.textContent =
          `這是一個梯形：上底 ${t}、下底 ${b}、高 ${h}。上下兩底不一樣長，沒辦法直接用「底 × 高」。`;
      } else if (this.step === 1) {
        this.svg.append(
          Svg('polygon', { class: 'geo-poly', points: T }),
          Svg('polygon', { class: 'geo-piece', points: T2 }));
        this.note.textContent =
          '再拿一個一模一樣的梯形（黃色），把它轉半圈接在右邊。';
      } else {
        this.svg.append(
          Svg('polygon', { class: 'geo-poly',
            points: [P(1, 1), P(1 + b + t, 1), P(1 + b + t + o, 1 + h), P(1 + o, 1 + h)].join(' ') }),
          Svg('line', { class: 'geo-cut', x1: gx(1 + b), y1: gy(1), x2: gx(1 + t + o), y2: gy(1 + h) }),
          Svg('line', { class: 'geo-dim', x1: gx(1), y1: gy(0.6), x2: gx(1 + b + t), y2: gy(0.6) }),
          Svg('text', { class: 'geo-dim-text', x: gx(1 + (b + t) / 2), y: gy(0.6) + 28, 'text-anchor': 'middle' },
            `底 = ${t} + ${b} = ${t + b}`));
        this.note.textContent =
          `兩個梯形拼成一個平行四邊形，它的底是「上底 + 下底」= ${t} + ${b} = ${t + b}，高還是 ${h}，` +
          `面積 = ${t + b} × ${h} = ${(t + b) * h}。一個梯形只有它的一半，` +
          `所以梯形面積 =（上底 + 下底）× 高 ÷ 2 = ${((t + b) * h) / 2}。`;
      }
    } else {
      const tri = [P(1, 1), P(1 + b, 1), P(1 + o + 1, 1 + h)].join(' ');
      if (this.step === 0) {
        this.svg.append(Svg('polygon', { class: 'geo-poly', points: tri }));
        this.note.textContent = `這是一個三角形，底 = ${b}、高 = ${h}。`;
      } else if (this.step === 1) {
        this.svg.append(
          Svg('polygon', { class: 'geo-poly', points: tri }),
          Svg('polygon', {
            class: 'geo-piece',
            points: [P(1 + b, 1), P(1 + o + 1, 1 + h), P(1 + o + 1 + b - b, 1 + h)].join(' '),
          }));
        this.note.textContent = '再拿一個一模一樣的三角形（黃色），把它轉半圈。';
      } else {
        this.svg.append(
          Svg('polygon', {
            class: 'geo-poly',
            points: [P(1, 1), P(1 + b, 1), P(1 + o + 1 + b, 1 + h), P(1 + o + 1, 1 + h)].join(' '),
          }),
          Svg('line', { class: 'geo-cut', x1: gx(1 + b), y1: gy(1), x2: gx(1 + o + 1), y2: gy(1 + h) }));
        this.note.textContent =
          `兩個一樣的三角形可以拼成一個平行四邊形，面積是 ${b} × ${h} = ${b * h}。` +
          `一個三角形只有它的一半，所以三角形面積 = 底 × 高 ÷ 2 = ${(b * h) / 2}。`;
      }
    }

    this.next.disabled = this.step >= this.maxStep;
    this.next.textContent = this.step >= this.maxStep ? '完成' : '下一步 →';
  }

  destroy() {}
}

/**
 * 扇形工具：拖動把手改變圓心角，即時顯示角度與「佔整個圓的幾分之幾」。
 * 扇形的一切（弧長、面積）都是這個比例的延伸。
 */
class PieSector {
  constructor({ angle = 90, radiusLabel = 10, onChange }) {
    this.angle = angle;
    this.r = radiusLabel;
    this.onChange = onChange ?? (() => {});
    this._cleanup = [];
  }

  mount(container) {
    const W = 460, H = 420, cx = 230, cy = 210, R = 150;
    this.geo = { W, H, cx, cy, R };
    const svg = Svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'geo-svg pie-svg',
      role: 'img', 'aria-label': '可調整圓心角的扇形' });

    svg.append(Svg('circle', { cx, cy, r: R, class: 'pie-circle' }));
    this.sector = Svg('path', { class: 'pie-sector' });
    this.armA = Svg('line', { x1: cx, y1: cy, x2: cx + R, y2: cy, class: 'pie-arm' });
    this.armB = Svg('line', { x1: cx, y1: cy, class: 'pie-arm' });
    this.hit = Svg('circle', { r: 34, class: 'geo-hit' });
    this.knob = Svg('circle', { r: 14, class: 'geo-dot' });
    svg.append(this.sector, this.armA, this.armB, this.hit, this.knob);

    this._bind(svg);
    this.svg = svg;
    this.readout = El('p', { class: 'geo-readout', role: 'status' });
    container.append(El('div', { class: 'geo-wrap' }, svg), this.readout);
    this._redraw();
    return this;
  }

  _bind(svg) {
    let dragging = false;
    const toAngle = (e) => {
      const r = svg.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * this.geo.W;
      const py = ((e.clientY - r.top) / r.height) * this.geo.H;
      let deg = (Math.atan2(this.geo.cy - py, px - this.geo.cx) * 180) / Math.PI;
      if (deg < 0) deg += 360;
      return Math.max(1, Math.min(359, Math.round(deg / 5) * 5));   // 吸附到 5 度
    };
    const down = (e) => {
      if (!e.target.closest('.geo-hit')) return;
      e.preventDefault(); dragging = true;
      e.target.setPointerCapture(e.pointerId);
      this.knob.classList.add('is-dragging'); buzz();
    };
    const move = (e) => {
      if (!dragging) return;
      e.preventDefault();
      const a = toAngle(e);
      if (a !== this.angle) { this.angle = a; this._redraw(); this.onChange(a); }
    };
    const up = () => { dragging = false; this.knob.classList.remove('is-dragging'); };
    svg.addEventListener('pointerdown', down);
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    this._cleanup.push(() => {
      svg.removeEventListener('pointerdown', down);
      svg.removeEventListener('pointermove', move);
      svg.removeEventListener('pointerup', up);
      svg.removeEventListener('pointercancel', up);
    });
  }

  _redraw() {
    const { cx, cy, R } = this.geo;
    const rad = (this.angle * Math.PI) / 180;
    const ex = cx + R * Math.cos(rad), ey = cy - R * Math.sin(rad);
    const large = this.angle > 180 ? 1 : 0;
    this.sector.setAttribute('d',
      `M ${cx} ${cy} L ${cx + R} ${cy} A ${R} ${R} 0 ${large} 0 ${ex} ${ey} Z`);
    this.armB.setAttribute('x2', ex);
    this.armB.setAttribute('y2', ey);
    this.hit.setAttribute('cx', ex); this.hit.setAttribute('cy', ey);
    this.knob.setAttribute('cx', ex); this.knob.setAttribute('cy', ey);

    const g = gcd(this.angle, 360);
    this.readout.textContent =
      `圓心角 = ${this.angle}°　佔整個圓的 ${this.angle}/360 = ${this.angle / g}/${360 / g}` +
      `　（拖動白色圓點改變角度）`;
  }

  destroy() {
    this._cleanup.forEach((fn) => fn());
    this._cleanup = [];
  }
}

/**
 * 展開圖判斷。給幾張展開圖，讓小孩判斷哪些摺得成正方體。
 * 這是立體形體單元最容易錯、也最需要動腦的部分。
 */
class NetGallery {
  constructor({ nets, onSolved }) {
    this.nets = nets;                  // [{ cells:[[r,c]...], ok, why }]
    this.onSolved = onSolved ?? (() => {});
    this.answered = new Set();
  }

  mount(container) {
    const wrap = El('div', { class: 'net-wrap' });
    this.note = El('p', { class: 'geo-readout', role: 'status' }, '點點看每一張，判斷它摺不摺得成正方體');

    this.nets.forEach((net, i) => {
      const rows = Math.max(...net.cells.map((c) => c[0])) + 1;
      const cols = Math.max(...net.cells.map((c) => c[1])) + 1;
      const board = El('div', {
        class: 'net-board',
        style: `grid-template-columns: repeat(${cols}, 34px); grid-template-rows: repeat(${rows}, 34px)`,
      });
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const on = net.cells.some(([rr, cc]) => rr === r && cc === c);
          board.append(El('span', {
            class: 'net-cell' + (on ? ' is-on' : ''),
            style: `grid-row:${r + 1};grid-column:${c + 1}`,
          }));
        }
      }
      const card = El('button', { class: 'net-card', type: 'button' },
        board, El('span', { class: 'net-tag' }, `第 ${i + 1} 張`));
      card.addEventListener('click', () => this._judge(net, card, i));
      wrap.append(card);
    });

    container.append(wrap, this.note);
    return this;
  }

  _judge(net, card, i) {
    if (this.answered.has(i)) return;
    this.answered.add(i);
    card.classList.add(net.ok ? 'is-ok' : 'is-no');
    card.querySelector('.net-tag').textContent = net.ok ? '✓ 摺得成' : '✗ 摺不成';
    this.note.textContent = net.why;
    buzz(net.ok ? 30 : 60);
    if (this.answered.size === this.nets.length) this.onSolved();
  }

  destroy() {}
}

/* ────────────────────────────────────────────
   課程引擎：把一份單元資料變成可以一段一段前進的教學流程
   ──────────────────────────────────────────── */

class LessonEngine {
  constructor(unit, mountPoint) {
    this.unit = unit;
    this.root = mountPoint;
    this.sectionIndex = 0;
    this.live = [];                    // 目前畫面上的元件，換頁時要 destroy
    this.storageKey = `g5-progress-${unit.id}`;
  }

  start() {
    const saved = Number(localStorage.getItem(this.storageKey));
    if (Number.isInteger(saved) && saved > 0 && saved < this.unit.sections.length) {
      this.sectionIndex = saved;
    }
    this._render();
  }

  _teardown() {
    this.live.forEach((c) => c.destroy?.());
    this.live = [];
  }

  _render() {
    this._teardown();
    const section = this.unit.sections[this.sectionIndex];
    this.root.replaceChildren();

    // 進度條
    const pct = ((this.sectionIndex + 1) / this.unit.sections.length) * 100;
    this.root.append(
      El('div', { class: 'lesson-progress' },
        El('div', { class: 'lesson-progress-bar', style: `width:${pct}%` })),
      El('p', { class: 'lesson-step' },
        `${this.unit.title}　第 ${this.sectionIndex + 1} / ${this.unit.sections.length} 段`),
      El('h2', { class: 'lesson-title' }, section.heading)
    );

    // 內容段落
    const body = El('div', { class: 'lesson-body' });
    (section.blocks ?? []).forEach((block) => {
      if (block.type === 'text') {
        body.append(El('p', { class: 'lesson-text' }, block.text));
      } else if (block.type === 'callout') {
        body.append(El('div', { class: 'lesson-callout' },
          El('span', { class: 'callout-icon' }, block.icon ?? '💡'),
          El('div', {}, El('strong', {}, block.title ?? '重點'), El('p', {}, block.text))));
      } else if (block.type === 'component') {
        const holder = El('div', { class: 'lesson-component' });
        body.append(holder);
        const instance = block.build();
        instance.mount(holder);
        this.live.push(instance);
      }
    });
    this.root.append(body);

    // 「問老師」：預先寫好的問答，不呼叫任何 API，所以給多少人用都不會有費用
    const qa = window.G5_TUTOR?.[this.unit.id]?.[this.sectionIndex];
    if (qa && qa.length) this.root.append(this._tutor(qa));

    // 導覽
    const nav = El('div', { class: 'lesson-nav' });
    if (this.sectionIndex > 0) {
      nav.append(El('button', {
        class: 'btn btn--ghost', type: 'button',
        onClick: () => this._go(this.sectionIndex - 1),
      }, '← 上一段'));
    }
    if (this.sectionIndex < this.unit.sections.length - 1) {
      nav.append(El('button', {
        class: 'btn btn--primary', type: 'button',
        onClick: () => this._go(this.sectionIndex + 1),
      }, '下一段 →'));
    } else {
      nav.append(El('button', {
        class: 'btn btn--primary', type: 'button',
        onClick: () => this._finish(),
      }, '完成這個單元 🎉'));
    }
    this.root.append(nav);
    this.root.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  /**
   * 問老師面板。
   * 內容是預先寫好的（見 g5-tutor-content-*.js），不連任何 API——
   * 這個網站會分享給同班同學用，走 API 的話費用會隨人數一直長，
   * 而且沒辦法事先審過每個回答。
   */
  /**
   * 記錄小孩實際點了哪些問題。
   * 目的是不要靠猜——沒人點的問題代表方向寫錯了，一直被點的代表那裡是真難點。
   * 只存在這台裝置的 localStorage，不上傳、不接任何伺服器。
   */
  _logTutor(entry) {
    try {
      const KEY = 'g5-tutor-log';
      const log = JSON.parse(localStorage.getItem(KEY) || '[]');
      log.push({ ...entry, t: Date.now() });
      // 只留最近 800 筆，避免無限長大
      localStorage.setItem(KEY, JSON.stringify(log.slice(-800)));
    } catch { /* 無痕模式或空間滿了就算了，不能影響教學本身 */ }
  }

  _tutor(qa) {
    const panel = El('div', { class: 'tutor', hidden: 'hidden' });
    const answer = El('div', { class: 'tutor-answer', hidden: 'hidden' });

    const list = El('div', { class: 'tutor-questions' });
    qa.forEach((item) => {
      const btn = El('button', { class: 'tutor-q', type: 'button' }, item.q);
      btn.addEventListener('click', () => {
        list.querySelectorAll('.tutor-q').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this._showAnswer(answer, item);
        this._logTutor({ unit: this.unit.id, sec: this.sectionIndex, q: item.q, kind: 'q' });
        buzz();
      });
      list.append(btn);
    });

    panel.append(
      El('p', { class: 'tutor-intro' }, '哪裡不懂呢？點一個問題看看'),
      list, answer);

    const toggle = El('button', { class: 'btn tutor-open', type: 'button' },
      '🙋 我不懂，問老師');
    toggle.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      toggle.classList.toggle('is-open', !panel.hidden);
      if (!panel.hidden) {
        panel.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      }
      buzz();
    });

    return El('div', { class: 'tutor-wrap' }, toggle, panel);
  }

  _showAnswer(holder, item) {
    holder.hidden = false;
    holder.replaceChildren(El('p', { class: 'tutor-who' }, '👩‍🏫 老師'));
    const paras = Array.isArray(item.a) ? item.a : [item.a];
    paras.forEach((p) => holder.append(El('p', { class: 'tutor-text' }, p)));

    // 「還是不懂」：再講一次更慢、更具體的版本
    if (item.more) {
      const again = El('button', { class: 'btn btn--ghost tutor-more', type: 'button' },
        item.more.q || '我還是不懂');
      again.addEventListener('click', () => {
        again.remove();
        holder.append(El('p', { class: 'tutor-who' }, '👩‍🏫 老師（換個方式講）'));
        (Array.isArray(item.more.a) ? item.more.a : [item.more.a])
          .forEach((p) => holder.append(El('p', { class: 'tutor-text' }, p)));
        // 按了「還是不懂」是最強的訊號：第一層的解釋沒有講通
        this._logTutor({ unit: this.unit.id, sec: this.sectionIndex, q: item.q, kind: 'more' });
        buzz();
      });
      holder.append(again);
    }
  }

  _go(next) {
    this.sectionIndex = next;
    localStorage.setItem(this.storageKey, String(next));
    this._render();
  }

  _finish() {
    localStorage.setItem(`${this.storageKey}-done`, '1');
    this._teardown();
    this.root.replaceChildren(
      El('div', { class: 'lesson-done' },
        El('h2', {}, '🎉 完成！'),
        El('p', {}, `${this.unit.title} 的概念你已經走完一遍了。`),
        El('p', { class: 'lesson-text' }, this.unit.wrapUp ?? ''),
        El('button', {
          class: 'btn btn--primary', type: 'button',
          onClick: () => { this.sectionIndex = 0; this._render(); },
        }, '再複習一次'),
        El('button', {
          class: 'btn btn--ghost', type: 'button',
          onClick: () => window.dispatchEvent(new CustomEvent('lesson:exit')),
        }, '回單元地圖')
      )
    );
  }
}

window.G5 = {
  El, Svg, shuffle, buzz,
  LineChartBuilder, TapPairing, ChoiceQuiz, LabeledDiagram, CompareToggle,
  NumberGrid, ArrayBuilder, SortBuckets, CommonGrid, VennFactors, PeriodSync,
  EquivalentFraction, SimplifyTool, FractionAdd, ExpressionSolver, GroupSplit, AreaModel,
  GeoBoard, DissectArea, PieSector, NetGallery, TriangleSides,
  gcd, lcm, fractionBar, fractionText,
  LessonEngine,
};
