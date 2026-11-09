/**
 * 引導式教學　補充元件（2026-11-09）
 *
 * g5-lesson-engine-20260807.js 那 22 個元件是照五上翰林數學的需要做的，
 * 現在要補的四個洞（小數乘法、容積、線對稱）和自然社會國語，有幾個互動
 * 它裡面沒有。這一支把新的掛到同一個 window.G5 上，引擎本身一行都沒動。
 *
 * 新增：
 *   DecimalArea   10×10 方格看小數乘法 —— 為什麼 0.3 × 0.4 = 0.12
 *   VolumeStack   堆單位立方體量容積 —— 長×寬×高 到底在數什麼
 *   MirrorFold    摺紙鏡射 —— 自己點出線對稱圖形的另一半
 *   Timeline      把事件排回正確的先後順序（社會的歷史單元在用）
 *
 * 寫法刻意跟引擎裡那些元件一致：constructor 收一包設定，mount(container)
 * 回傳自己，destroy() 收尾。這樣課程資料不用管是誰做的元件。
 */

'use strict';

(function () {
  var G5 = window.G5;
  if (!G5) { console.error('g5-widgets：要先載入 g5-lesson-engine'); return; }

  var El = G5.El, Svg = G5.Svg, shuffle = G5.shuffle, buzz = G5.buzz;

  /* ══════════════════════════════════════════════════
     DecimalArea —— 小數乘法為什麼會變小
     ══════════════════════════════════════════════════
     一個大正方形代表 1。直的切 10 份、橫的切 10 份，整張就是 100 小格，
     一小格 = 0.01。塗 a 行再塗 b 列，重疊的地方就是答案。

     小孩真正的疑惑是「乘完怎麼變小了」，所以第一步要先看到
     「0.3 是整張的一部分」，而不是直接看公式。
  */
  var DEC = { W: 420, H: 420, PAD: 30 };

  function DecimalArea(opts) {
    this.a = opts.a;                 // 0.1 ~ 0.9，直的那一邊
    this.b = opts.b;                 // 0.1 ~ 0.9，橫的那一邊
    this.step = 0;
  }

  DecimalArea.prototype.mount = function (container) {
    var self = this;
    this.svg = Svg('svg', {
      viewBox: '0 0 ' + DEC.W + ' ' + DEC.H, class: 'dec-svg',
      role: 'img', 'aria-label': '一百格方陣，用來看小數乘法',
    });
    this.note = El('p', { class: 'dec-note', role: 'status' });

    this.next = El('button', { class: 'btn btn--primary', type: 'button' }, '下一步 →');
    this.next.addEventListener('click', function () {
      if (self.step < 3) { self.step++; buzz(); self._redraw(); }
    });
    var again = El('button', { class: 'btn btn--ghost', type: 'button' }, '重看一次');
    again.addEventListener('click', function () { self.step = 0; self._redraw(); });

    container.append(El('div', { class: 'dec-wrap' },
      this.svg, this.note,
      El('div', { class: 'dec-controls' }, this.next, again)));
    this._redraw();
    return this;
  };

  DecimalArea.prototype._redraw = function () {
    var cols = Math.round(this.a * 10), rows = Math.round(this.b * 10);
    var size = (DEC.W - DEC.PAD * 2) / 10;
    this.svg.replaceChildren();

    for (var r = 0; r < 10; r++) {
      for (var c = 0; c < 10; c++) {
        var inCol = c < cols, inRow = r < rows;
        var cls = 'dec-cell';
        if (this.step >= 1 && inCol) cls += ' is-a';
        if (this.step >= 2 && inRow) cls += ' is-b';
        if (this.step >= 3 && inCol && inRow) cls = 'dec-cell is-both';
        this.svg.append(Svg('rect', {
          x: DEC.PAD + c * size, y: DEC.PAD + r * size,
          width: size, height: size, class: cls,
        }));
      }
    }

    var txt = [
      '整張正方形代表 1。直的切 10 份、橫的切 10 份，' +
        '所以一小格是 0.01，整張剛好 100 小格。',
      '先塗 ' + this.a + '：直的 10 份裡面塗 ' + cols + ' 份。' +
        '看得出來 ' + this.a + ' 只是整張的一部分。',
      '再塗 ' + this.b + '：橫的 10 份裡面塗 ' + rows + ' 份。',
      '兩次都被塗到的地方有 ' + cols + ' × ' + rows + ' = ' + (cols * rows) + ' 小格，' +
        '一小格 0.01，所以 ' + this.a + ' × ' + this.b + ' = ' +
        Number((this.a * this.b).toFixed(2)) + '。' +
        '乘完比兩個數都小，因為你是在「一部分裡面再取一部分」。',
    ][this.step];

    this.note.textContent = txt;
    this.next.disabled = this.step >= 3;
  };

  DecimalArea.prototype.destroy = function () {};

  /* ══════════════════════════════════════════════════
     VolumeStack —— 容積是在數什麼
     ══════════════════════════════════════════════════
     用 1 立方公分的小積木把盒子填滿。先數一層有幾個（長×寬），
     再看有幾層（高）。公式是數出來的結果，不是背來的起點。

     畫法刻意不做立體透視：一層一層往上畫、每層稍微往右上偏，
     小孩才數得出「這是第幾層」。透視圖好看但會擋住後面的積木。
  */
  function VolumeStack(opts) {
    this.max = opts.max || 5;
    this.L = opts.L || 3;
    this.W = opts.W || 2;
    this.H = opts.H || 2;
  }

  VolumeStack.prototype.mount = function (container) {
    var self = this;
    this.svg = Svg('svg', {
      viewBox: '0 0 360 320', class: 'stack-svg',
      role: 'img', 'aria-label': '用小積木堆出來的長方體',
    });
    this.readout = El('p', { class: 'stack-readout', role: 'status' });

    var controls = El('div', { class: 'stack-controls' });
    [['長', 'L'], ['寬', 'W'], ['高', 'H']].forEach(function (pair) {
      var label = pair[0], key = pair[1];
      var minus = El('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, label + ' −');
      var plus = El('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, label + ' ＋');
      minus.addEventListener('click', function () {
        if (self[key] > 1) { self[key]--; buzz(); self._redraw(); }
      });
      plus.addEventListener('click', function () {
        if (self[key] < self.max) { self[key]++; buzz(); self._redraw(); }
      });
      controls.append(minus, plus);
    });

    container.append(El('div', { class: 'stack-wrap' }, this.svg, this.readout, controls));
    this._redraw();
    return this;
  };

  VolumeStack.prototype._redraw = function () {
    var S = 30, SKEW = 14;                 // 積木邊長、每層往右上偏移
    this.svg.replaceChildren();

    // 由下往上畫，上面那層才會蓋住下面那層，看得出堆疊
    for (var h = 0; h < this.H; h++) {
      var ox = 60 + h * SKEW;
      var oy = 250 - h * (S + SKEW * 0.4);
      for (var w = 0; w < this.W; w++) {
        for (var l = 0; l < this.L; l++) {
          this.svg.append(Svg('rect', {
            x: ox + l * S + w * SKEW * 0.8,
            y: oy - w * S * 0.45,
            width: S, height: S, rx: 3,
            class: 'stack-cube' + (h === this.H - 1 ? ' is-top' : ''),
          }));
        }
      }
    }

    var layer = this.L * this.W, total = layer * this.H;
    this.readout.replaceChildren(
      El('span', {}, '一層有 ' + this.L + ' × ' + this.W + ' = '),
      El('b', {}, String(layer)),
      El('span', {}, ' 個，疊了 ' + this.H + ' 層，所以總共 '),
      El('b', {}, String(total)),
      El('span', {}, ' 個。'),
      El('br', {}),
      El('span', {}, '一個小積木是 1 立方公分，所以容積是 '),
      El('b', {}, total + ' 立方公分'),
      El('span', {}, '，也就是 '),
      El('b', {}, total + ' 毫升'),
      El('span', {}, '。'));
  };

  VolumeStack.prototype.destroy = function () {};

  /* ══════════════════════════════════════════════════
     MirrorFold —— 自己點出對稱的另一半
     ══════════════════════════════════════════════════
     左半邊先畫好，對稱軸是中間那條虛線，小孩點右半邊把圖形補完。
     按「對摺看看」才檢查 —— 先讓他自己判斷，不要一點下去就馬上說對錯，
     不然會變成用紅綠燈試出來的，不是想出來的。
  */
  function MirrorFold(opts) {
    this.cols = opts.cols || 8;           // 總欄數，必須是偶數
    this.rows = opts.rows || 6;
    this.shape = opts.shape;              // 左半已經填好的格子 [[c,r], ...]
    this.picked = {};
  }

  MirrorFold.prototype.mount = function (container) {
    var self = this;
    var S = 44, half = this.cols / 2;
    var W = this.cols * S, H = this.rows * S;

    this.svg = Svg('svg', {
      viewBox: '0 0 ' + W + ' ' + H, class: 'mirror-svg',
      role: 'group', 'aria-label': '線對稱方格，點右半邊把圖形補完',
    });

    this.cells = {};
    for (var r = 0; r < this.rows; r++) {
      for (var c = 0; c < this.cols; c++) {
        var on = c < half && this._inShape(c, r);
        var rect = Svg('rect', {
          x: c * S, y: r * S, width: S, height: S,
          class: 'mirror-cell' + (on ? ' is-on' : ''),
        });
        if (c >= half) {
          rect.dataset.c = String(c);
          rect.dataset.r = String(r);
          rect.addEventListener('click', this._tap.bind(this, c, r, rect));
        }
        this.cells[c + ',' + r] = rect;
        this.svg.append(rect);
      }
    }

    this.svg.append(Svg('line', {
      x1: half * S, y1: 0, x2: half * S, y2: H, class: 'mirror-axis',
    }));

    this.note = El('p', { class: 'mirror-note', role: 'status' },
      '中間那條黃色虛線是對稱軸。點右半邊的格子，把左邊的圖形照鏡子補出來。');

    var check = El('button', { class: 'btn btn--primary', type: 'button' }, '對摺看看 🪞');
    check.addEventListener('click', function () { self._check(); });
    var reset = El('button', { class: 'btn btn--ghost', type: 'button' }, '全部清掉');
    reset.addEventListener('click', function () { self._reset(); });

    container.append(El('div', { class: 'mirror-wrap' },
      this.svg, this.note,
      El('div', { class: 'stack-controls' }, check, reset)));
    return this;
  };

  MirrorFold.prototype._inShape = function (c, r) {
    for (var i = 0; i < this.shape.length; i++) {
      if (this.shape[i][0] === c && this.shape[i][1] === r) return true;
    }
    return false;
  };

  /** 右邊 c 的鏡像是左邊的 cols-1-c —— 對稱軸兩邊距離一樣遠 */
  MirrorFold.prototype._mirrorOf = function (c) { return this.cols - 1 - c; };

  MirrorFold.prototype._tap = function (c, r, rect) {
    var key = c + ',' + r;
    // 上一次檢查留下的紅（多塗）和綠（漏掉）提示要清掉，
    // 不然他補上漏掉的那一格之後，那格還是綠的，看起來像沒生效。
    rect.classList.remove('is-wrong', 'is-ghost');
    if (this.picked[key]) { delete this.picked[key]; rect.classList.remove('is-on'); }
    else { this.picked[key] = true; rect.classList.add('is-on'); }
    buzz();
  };

  MirrorFold.prototype._check = function () {
    var half = this.cols / 2, miss = 0, extra = 0, self = this;

    for (var r = 0; r < this.rows; r++) {
      for (var c = half; c < this.cols; c++) {
        var key = c + ',' + r;
        var should = this._inShape(this._mirrorOf(c), r);
        var has = Boolean(this.picked[key]);
        var rect = this.cells[key];
        rect.classList.remove('is-wrong', 'is-ghost');
        if (should && !has) { miss++; rect.classList.add('is-ghost'); }
        else if (!should && has) { extra++; rect.classList.add('is-wrong'); }
      }
    }

    if (!miss && !extra) {
      this.note.textContent = '對了！沿著黃線對摺，兩邊會完全疊在一起 —— ' +
        '這就是線對稱。對稱軸兩邊的點，離軸一樣遠。';
      buzz();
      return;
    }
    var msg = [];
    if (miss) msg.push('綠色的格子是漏掉的 ' + miss + ' 格');
    if (extra) msg.push('紅色的格子多塗了 ' + extra + ' 格');
    this.note.textContent = msg.join('，') +
      '。提示：左邊第幾格離黃線多遠，右邊對應的那一格就要離黃線一樣遠。';
    void self;
  };

  MirrorFold.prototype._reset = function () {
    var half = this.cols / 2;
    for (var r = 0; r < this.rows; r++) {
      for (var c = half; c < this.cols; c++) {
        this.cells[c + ',' + r].classList.remove('is-on', 'is-wrong', 'is-ghost');
      }
    }
    this.picked = {};
    this.note.textContent = '清掉了，再來一次。';
  };

  MirrorFold.prototype.destroy = function () {};

  /* ══════════════════════════════════════════════════
     Timeline —— 把事件排回正確的先後
     ══════════════════════════════════════════════════
     歷史最難的不是記年份，是「誰先誰後」。所以格子上寫的是年代，
     卡片上寫的是事件，小孩要做的是配對，不是默寫年份。
  */
  function Timeline(opts) {
    this.slots = opts.slots;              // [{ when, answer, why }]
    this.pool = shuffle(this.slots.map(function (s) { return s.answer; }));
    this.selected = null;
    this.done = 0;
  }

  Timeline.prototype.mount = function (container) {
    var self = this;
    this.poolEl = El('div', { class: 'timeline-pool' });
    this.slotEl = El('div', { class: 'timeline-slots' });
    this.note = El('p', { class: 'timeline-note', role: 'status' },
      '先點一張事件卡，再點它應該放的年代。');

    this.pool.forEach(function (text) {
      var card = El('button', { class: 'timeline-card', type: 'button' }, text);
      card.addEventListener('click', function () {
        if (card.classList.contains('is-done')) return;
        self.poolEl.querySelectorAll('.timeline-card').forEach(function (c) {
          c.classList.remove('is-selected');
        });
        card.classList.add('is-selected');
        self.selected = { text: text, el: card };
        buzz();
      });
      self.poolEl.append(card);
    });

    this.slots.forEach(function (s) {
      var body = El('span', { class: 'timeline-body' }, '　');
      var slot = El('div', { class: 'timeline-slot' },
        El('span', { class: 'timeline-when' }, s.when), body);
      slot.addEventListener('click', function () {
        if (!self.selected) {
          self.note.textContent = '先點上面的一張事件卡。';
          return;
        }
        if (slot.classList.contains('is-filled')) return;
        if (self.selected.text !== s.answer) {
          self.note.textContent = '還不對。想一想這件事發生的時候，臺灣是什麼樣子。';
          return;
        }
        body.textContent = s.answer;
        slot.classList.add('is-filled');
        self.selected.el.classList.add('is-done');
        self.selected.el.classList.remove('is-selected');
        self.selected = null;
        self.done++;
        self.note.textContent = s.why;
        buzz();
        if (self.done === self.slots.length) {
          self.note.textContent = '全部排好了！先後順序比年份好記，' +
            '因為每一件事都是前一件事造成的。';
        }
      });
      self.slotEl.append(slot);
    });

    container.append(El('div', { class: 'timeline-wrap' },
      this.poolEl, this.slotEl, this.note));
    return this;
  };

  Timeline.prototype.destroy = function () {};

  /* ── 掛上去 ── */
  G5.DecimalArea = DecimalArea;
  G5.VolumeStack = VolumeStack;
  G5.MirrorFold = MirrorFold;
  G5.Timeline = Timeline;
})();
