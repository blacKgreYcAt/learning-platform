/**
 * 引導式教學　補充元件（五下用）
 * 2026-11-09
 *
 * 五下自然的「力與運動」有兩個觀念光看文字很難通：
 *   彈簧秤為什麼讀得出力 —— 要看到「越重拉得越長」，而且是成比例的。
 *   蹺蹺板為什麼要算距離 —— 要看到重的人往內坐，蹺蹺板才會平。
 * 所以補這兩個元件。寫法跟 g5-widgets-20261109.js 一樣：
 * constructor 收一包設定、mount(container) 回傳自己、destroy() 收尾，
 * 掛到同一個 window.G5 上，引擎和既有元件都沒有動。
 *
 * 新增：
 *   SpringScale   彈簧秤 —— 掛砝碼看彈簧伸長，順便示範超過彈性限度會怎樣
 *   LeverBalance  蹺蹺板 —— 調距離把「重量 × 距離」調成兩邊一樣
 */

'use strict';

(function () {
  var G5 = window.G5;
  if (!G5) { console.error('g5-widgets-5b：要先載入 g5-lesson-engine'); return; }

  var El = G5.El, Svg = G5.Svg, buzz = G5.buzz;

  /* ══════════════════════════════════════════════════
     SpringScale —— 彈簧秤
     ══════════════════════════════════════════════════
     每加一個砝碼，彈簧就多伸長固定的長度。重點不是「會用彈簧秤」，
     是看出「伸長量跟重量成正比」—— 正因為成正比，刻度才畫得出來。

     刻意做得到「拉壞」：超過彈性限度之後再加，彈簧變紅而且回不去。
     課本寫「不可超過彈性限度」，小孩看到彈簧真的壞掉才記得住為什麼。
  */
  function SpringScale(opts) {
    this.stepG = opts.stepG || 100;        // 一個砝碼幾公克重
    this.stepCm = opts.stepCm || 2;        // 一個砝碼讓彈簧伸長幾公分
    this.limitN = opts.limitN || 5;        // 超過幾個砝碼就超出彈性限度
    this.maxN = this.limitN + 2;           // 最多還能再掛兩個，讓他看到壞掉
    this.n = 0;
    this.broken = false;
  }

  SpringScale.prototype.mount = function (container) {
    var self = this;
    this.svg = Svg('svg', {
      viewBox: '0 0 300 340', class: 'spring-svg',
      role: 'img', 'aria-label': '彈簧秤，掛上砝碼之後彈簧會伸長',
    });
    this.readout = El('p', { class: 'spring-readout', role: 'status' });

    var add = El('button', { class: 'btn btn--primary btn--sm', type: 'button' },
      '掛上 ' + this.stepG + ' 公克重');
    add.addEventListener('click', function () {
      if (self.n < self.maxN) { self.n++; buzz(); self._redraw(); }
    });
    var take = El('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, '拿掉一個');
    take.addEventListener('click', function () {
      if (self.n > 0) { self.n--; buzz(); self._redraw(); }
    });
    var reset = El('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, '換一條新的彈簧');
    reset.addEventListener('click', function () {
      self.n = 0; self.broken = false; self._redraw();
    });

    container.append(El('div', { class: 'spring-wrap' },
      this.svg, this.readout,
      El('div', { class: 'spring-controls' }, add, take, reset)));
    this._redraw();
    return this;
  };

  SpringScale.prototype._redraw = function () {
    var TOP = 40, X = 110, PX_PER_CM = 9;
    if (this.n > this.limitN) this.broken = true;     // 拉壞了就回不去，要換新的

    var cm = this.n * this.stepCm;
    var len = 60 + cm * PX_PER_CM;                    // 彈簧原長 60px
    this.svg.replaceChildren();

    // 掛鉤的橫桿
    this.svg.append(Svg('rect', { x: 50, y: TOP - 14, width: 120, height: 10, rx: 4, class: 'spring-bar' }));

    // 彈簧畫成之字形，圈數固定，所以伸長的時候看得出「被拉開」
    var coils = 8, d = 'M ' + X + ' ' + TOP;
    for (var i = 0; i < coils; i++) {
      var y1 = TOP + len * (i + 0.5) / coils;
      var y2 = TOP + len * (i + 1) / coils;
      d += ' L ' + (X + (i % 2 ? -18 : 18)) + ' ' + y1 + ' L ' + X + ' ' + y2;
    }
    this.svg.append(Svg('path', {
      d: d, class: 'spring-coil' + (this.broken ? ' is-broken' : ''),
    }));

    // 砝碼：一個一個疊在鉤子下面
    var hookY = TOP + len;
    this.svg.append(Svg('circle', { cx: X, cy: hookY + 6, r: 6, class: 'spring-hook' }));
    for (var k = 0; k < this.n; k++) {
      this.svg.append(Svg('rect', {
        x: X - 26, y: hookY + 12 + k * 16, width: 52, height: 14, rx: 3, class: 'spring-weight',
      }));
    }

    // 右邊的尺：每 1 公分一格，每 5 公分標一次數字。
    // 尺的長度只畫到比最大伸長量多一點，畫太長會拖到砝碼旁邊很亂。
    var RULER = this.maxN * this.stepCm + 2;
    for (var c = 0; c <= RULER; c++) {
      var y = TOP + 60 + c * PX_PER_CM;
      var long = c % 5 === 0;
      this.svg.append(Svg('line', {
        x1: 200, y1: y, x2: long ? 216 : 208, y2: y, class: 'spring-tick',
      }));
      if (long) this.svg.append(Svg('text', { x: 222, y: y + 4, class: 'spring-num' }, String(c)));
    }
    this.svg.append(Svg('line', { x1: 200, y1: TOP + 60, x2: 200, y2: TOP + 60 + RULER * PX_PER_CM, class: 'spring-rule' }));
    // 指針指向目前伸長到哪裡
    this.svg.append(Svg('polygon', {
      points: (196) + ',' + hookY + ' ' + (182) + ',' + (hookY - 6) + ' ' + (182) + ',' + (hookY + 6),
      class: 'spring-pointer',
    }));

    var r = this.readout;
    r.replaceChildren();
    if (this.n === 0) {
      r.append(El('span', {}, '還沒掛東西。彈簧現在是原來的長度。'));
    } else if (this.broken) {
      r.append(El('b', { class: 'is-bad' }, '超過彈性限度了！'),
        El('br', {}),
        El('span', {}, '彈簧被拉壞，放手也回不到原來的長度，' +
          '這條秤量出來的數字已經不能相信。按「換一條新的彈簧」重來。'));
    } else {
      r.append(
        El('span', {}, '掛了 '), El('b', {}, this.n + ' 個'),
        El('span', {}, '，總共 '), El('b', {}, (this.n * this.stepG) + ' 公克重'),
        El('span', {}, '，彈簧伸長 '), El('b', {}, cm + ' 公分'),
        El('br', {}),
        El('span', {}, '每 ' + this.stepG + ' 公克重就伸長 ' + this.stepCm + ' 公分 —— ' +
          '一直都是這個數字，所以看伸長多少就知道力多大。'));
    }
  };

  SpringScale.prototype.destroy = function () {};

  /* ══════════════════════════════════════════════════
     LeverBalance —— 蹺蹺板
     ══════════════════════════════════════════════════
     左邊固定，右邊的重量和距離都可以調。兩邊的「重量 × 距離」一樣的時候
     板子才會平。小孩自己調到平的那一刻，公式就不用背了。

     傾斜角度照兩邊的差距算，差越多斜越兇，但是最多斜 14 度 ——
     斜到翻過去就看不出誰比較重了。
  */
  function LeverBalance(opts) {
    this.leftW = opts.leftW || 30;
    this.leftD = opts.leftD || 2;
    this.rightW = opts.rightW || 20;
    this.rightD = opts.rightD || 2;
    this.maxD = opts.maxD || 4;
    this.maxW = opts.maxW || 60;
    this.stepW = opts.stepW || 10;
    this.lockWeight = !!opts.lockWeight;   // true = 只能調距離
  }

  LeverBalance.prototype.mount = function (container) {
    var self = this;
    this.svg = Svg('svg', {
      viewBox: '0 0 400 230', class: 'lever-svg',
      role: 'img', 'aria-label': '蹺蹺板，可以調整右邊的重量和距離',
    });
    this.readout = El('p', { class: 'lever-readout', role: 'status' });

    var controls = El('div', { class: 'lever-controls' });
    function pair(label, key, step, min, max) {
      var minus = El('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, label + ' −');
      var plus = El('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, label + ' ＋');
      minus.addEventListener('click', function () {
        if (self[key] - step >= min) { self[key] -= step; buzz(); self._redraw(); }
      });
      plus.addEventListener('click', function () {
        if (self[key] + step <= max) { self[key] += step; buzz(); self._redraw(); }
      });
      controls.append(minus, plus);
    }
    pair('右邊距離', 'rightD', 1, 1, this.maxD);
    if (!this.lockWeight) pair('右邊重量', 'rightW', this.stepW, this.stepW, this.maxW);

    container.append(El('div', { class: 'lever-wrap' },
      this.svg, this.readout, controls));
    this._redraw();
    return this;
  };

  LeverBalance.prototype._redraw = function () {
    var CX = 200, CY = 150, ARM = 150, UNIT = ARM / this.maxD;
    var ml = this.leftW * this.leftD, mr = this.rightW * this.rightD;
    var diff = mr - ml;
    // 斜多少：差距越大越斜，但是夾在 ±14 度，斜過頭就看不出來了
    var deg = Math.max(-14, Math.min(14, diff / Math.max(ml, mr, 1) * 20));
    var rad = deg * Math.PI / 180;

    function at(dist, side) {
      var dx = side * dist * UNIT;
      return { x: CX + dx * Math.cos(rad), y: CY + dx * Math.sin(rad) };
    }

    this.svg.replaceChildren();

    // 支點：一個三角形。先畫，板子才蓋在上面
    this.svg.append(Svg('polygon', {
      points: (CX - 22) + ',200 ' + (CX + 22) + ',200 ' + CX + ',' + (CY + 6),
      class: 'lever-fulcrum',
    }));

    var a = at(this.maxD, -1), b = at(this.maxD, 1);
    this.svg.append(Svg('line', {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      class: 'lever-beam' + (diff === 0 ? ' is-level' : ''),
    }));

    // 刻度：每一格就是 1 公尺，小孩才數得出距離
    for (var i = 1; i <= this.maxD; i++) {
      [-1, 1].forEach(function (side) {
        var p = at(i, side);
        this.svg.append(Svg('circle', { cx: p.x, cy: p.y, r: 3, class: 'lever-notch' }));
      }, this);
    }

    var self = this;
    [[this.leftW, this.leftD, -1], [this.rightW, this.rightD, 1]].forEach(function (w) {
      var p = at(w[1], w[2]);
      var h = 12 + w[0] * 0.95;                 // 越重畫越高，一眼看得出誰重
      self.svg.append(Svg('rect', {
        x: p.x - 20, y: p.y - h - 4, width: 40, height: h, rx: 4,
        class: 'lever-block' + (w[2] > 0 ? ' is-right' : ''),
      }));
      self.svg.append(Svg('text', {
        x: p.x, y: p.y - h - 10, class: 'lever-label',
      }, w[0] + ' 公斤'));
    });

    var r = this.readout;
    r.replaceChildren(
      El('span', {}, '左邊 ' + this.leftW + ' × ' + this.leftD + ' = '),
      El('b', {}, String(ml)),
      El('span', {}, '　右邊 ' + this.rightW + ' × ' + this.rightD + ' = '),
      El('b', {}, String(mr)),
      El('br', {}));
    if (diff === 0) {
      r.append(El('b', { class: 'is-good' }, '兩邊一樣，蹺蹺板平了！'),
        El('span', {}, '　平衡要的不是「一樣重」，是「重量 × 距離一樣」。'));
    } else if (diff > 0) {
      r.append(El('span', {}, '右邊比較大，所以右邊沉下去。' +
        '把右邊往內移（距離變小），或是把右邊變輕。'));
    } else {
      r.append(El('span', {}, '左邊比較大，所以左邊沉下去。' +
        '把右邊往外移（距離變大），或是把右邊變重。'));
    }
  };

  LeverBalance.prototype.destroy = function () {};

  G5.SpringScale = SpringScale;
  G5.LeverBalance = LeverBalance;
})();
