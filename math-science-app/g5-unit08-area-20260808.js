/**
 * 五上 · 單元 8：面積（翰林版）
 * 2026-08-08
 *
 * 依賴單元 3（平面圖形），特別是「高一定是垂直的那一段」。
 *
 * 設計重點：所有面積公式都用「剪下來、移過去」推導出來，不直接給公式。
 * 三個公式其實是同一件事的延伸：
 *   平行四邊形 → 剪一刀變長方形（底 × 高）
 *   三角形     → 兩個拼成平行四邊形（所以 ÷ 2）
 *   梯形       → 兩個拼成平行四邊形（底變成上底＋下底，所以 ÷ 2）
 * 把這條線講清楚，小孩就不用背三條公式，只要記住「都在想辦法變成長方形」。
 */

'use strict';

(function () {
  const { El, Svg, ChoiceQuiz, DissectArea, SortBuckets } = window.G5;

  /** 用格子數數面積，建立「面積＝有幾個單位正方形」的原始意義 */
  const countSquares = ({ w, h, unit = 46 }) => ({
    mount(container) {
      const wrap = El('div', { class: 'geo-wrap' });
      const board = El('div', {
        class: 'count-board',
        style: `grid-template-columns: repeat(${w}, ${unit}px)`,
      });
      for (let i = 0; i < w * h; i++) {
        board.append(El('span', { class: 'count-cell' }, String(i + 1)));
      }
      wrap.append(board);
      container.append(wrap,
        El('p', { class: 'geo-readout' },
          `一格是 1 平方公分。橫的 ${w} 格、直的 ${h} 格，總共 ${w * h} 格，` +
          `所以面積是 ${w * h} 平方公分——這就是為什麼長方形面積 = 長 × 寬。`));
      return this;
    },
    destroy() {},
  });

  /** 複合圖形：同一個 L 形，三種算法都得到一樣的答案 */
  const compositeArea = () => {
    const U = 42, X0 = 40, Y0 = 30;
    const px = (x) => X0 + x * U;
    const py = (y) => Y0 + y * U;
    // L 形：外框 7×5，右上角挖掉 3×2
    const L = [[0, 0], [7, 0], [7, 3], [4, 3], [4, 5], [0, 5]];

    const methods = [
      {
        label: '① 橫著切',
        parts: [
          { pts: [[0, 0], [7, 0], [7, 3], [0, 3]], label: '7 × 3 = 21', cls: 'a' },
          { pts: [[0, 3], [4, 3], [4, 5], [0, 5]], label: '4 × 2 = 8', cls: 'b' },
        ],
        note: '橫著切成上下兩塊長方形：7 × 3 = 21，4 × 2 = 8，合起來 21 + 8 = 29 平方公分。',
      },
      {
        label: '② 直著切',
        parts: [
          { pts: [[0, 0], [4, 0], [4, 5], [0, 5]], label: '4 × 5 = 20', cls: 'a' },
          { pts: [[4, 0], [7, 0], [7, 3], [4, 3]], label: '3 × 3 = 9', cls: 'b' },
        ],
        note: '直著切成左右兩塊：4 × 5 = 20，3 × 3 = 9，合起來 20 + 9 = 29 平方公分。切法不同，答案一樣。',
      },
      {
        label: '③ 補成大長方形再扣掉',
        parts: [
          { pts: [[0, 0], [7, 0], [7, 5], [0, 5]], label: '7 × 5 = 35', cls: 'a' },
          { pts: [[4, 3], [7, 3], [7, 5], [4, 5]], label: '扣掉 3 × 2 = 6', cls: 'cut' },
        ],
        note: '先當成完整的 7 × 5 = 35，再扣掉缺角 3 × 2 = 6，35 − 6 = 29 平方公分。三種算法答案完全一樣。',
      },
    ];

    return {
      mount(container) {
        const wrap = El('div', {});
        const tabs = El('div', { class: 'compare-tabs' });
        const holder = El('div', { class: 'geo-wrap' });
        const note = El('p', { class: 'geo-readout', role: 'status' });

        const show = (idx) => {
          tabs.querySelectorAll('button').forEach((b, i) => b.classList.toggle('is-active', i === idx));
          const m = methods[idx];
          const svg = Svg('svg', { viewBox: '0 0 400 280', class: 'geo-svg' });
          m.parts.forEach((p) => {
            svg.append(Svg('polygon', {
              class: `comp-part comp-${p.cls}`,
              points: p.pts.map(([x, y]) => `${px(x)},${py(y)}`).join(' '),
            }));
          });
          // L 形外框永遠畫在最上面，讓小孩看得出原本的形狀
          svg.append(Svg('polygon', {
            class: 'comp-outline', points: L.map(([x, y]) => `${px(x)},${py(y)}`).join(' '),
          }));
          m.parts.forEach((p) => {
            const cx = p.pts.reduce((s, q) => s + q[0], 0) / p.pts.length;
            const cy = p.pts.reduce((s, q) => s + q[1], 0) / p.pts.length;
            svg.append(Svg('text', {
              class: 'comp-label', x: px(cx), y: py(cy) + 6, 'text-anchor': 'middle',
            }, p.label));
          });
          holder.replaceChildren(svg);
          note.textContent = m.note;
        };

        methods.forEach((m, i) => {
          const b = El('button', { class: 'compare-tab', type: 'button' }, m.label);
          b.addEventListener('click', () => show(i));
          tabs.append(b);
        });

        wrap.append(tabs, holder, note);
        container.append(wrap);
        show(0);
        return this;
      },
      destroy() {},
    };
  };

  const unit = {
    id: 'g5-u08-area',
    grade: 5,
    semester: '上',
    order: 8,
    title: '單元 8　面積',
    subtitle: '所有公式，都在想辦法變成長方形',
    icon: '🟩',
    estimatedMinutes: 40,
    objectives: [
      '知道面積就是「裡面有幾個單位正方形」',
      '會算長方形和正方形的面積',
      '理解平行四邊形面積 = 底 × 高 是怎麼來的',
      '理解三角形和梯形的公式為什麼要除以 2',
      '會用分割或補形的方法算複合圖形的面積',
    ],
    wrapUp: '這三個公式不用分開背——它們都是「想辦法變成長方形」。平行四邊形剪一刀就變長方形；三角形和梯形各拿兩個拼成平行四邊形，所以要除以 2。忘記公式的時候，回想圖形怎麼變的就推得出來。',

    sections: [
      /* ── 1. 面積是什麼 ───────────────────────── */
      {
        heading: '面積，其實就是數格子',
        blocks: [
          {
            type: 'text',
            text: '面積是在講「一個圖形佔了多大的地方」。最原始的量法就是：看它裡面裝得下幾個 1 公分 × 1 公分的小正方形。',
          },
          { type: 'component', build: () => countSquares({ w: 6, h: 4 }) },
          {
            type: 'callout', icon: '📐', title: '單位要記得寫',
            text: '面積的單位是「平方公分（cm²）」或「平方公尺（m²）」。長度用公分，面積要用平方公分——單位寫錯是很常見的失分點。',
          },
          {
            type: 'callout', icon: '🔑', title: '長方形與正方形',
            text: '長方形面積 = 長 × 寬。正方形是四邊相等的長方形，所以正方形面積 = 邊長 × 邊長。',
          },
        ],
      },

      /* ── 2. 平行四邊形 ───────────────────────── */
      {
        heading: '平行四邊形：剪一刀就變長方形',
        blocks: [
          {
            type: 'text',
            text: '平行四邊形是斜的，沒辦法直接數格子。但只要剪一刀、移過去，就變成我們會算的長方形了。按「下一步」看看。',
          },
          { type: 'component', build: () => new DissectArea({ mode: 'parallelogram', base: 6, height: 4, offset: 2 }) },
          {
            type: 'callout', icon: '🔑', title: '公式',
            text: '平行四邊形面積 = 底 × 高。',
          },
          {
            type: 'callout', icon: '⚠️', title: '最常錯的地方',
            text: '「高」是垂直的那一段，不是斜邊！這就是單元 3 講的垂直。用斜邊去乘，算出來會比真正的面積大。',
          },
        ],
      },

      /* ── 3. 三角形 ───────────────────────────── */
      {
        heading: '三角形：兩個拼成平行四邊形',
        blocks: [
          {
            type: 'text',
            text: '三角形怎麼辦？拿兩個一模一樣的三角形，把其中一個轉半圈，就可以拼成一個平行四邊形。',
          },
          { type: 'component', build: () => new DissectArea({ mode: 'triangle', base: 6, height: 4, offset: 2 }) },
          {
            type: 'callout', icon: '🔑', title: '公式',
            text: '三角形面積 = 底 × 高 ÷ 2。除以 2 的原因很單純：我們拼了兩個，但只要其中一個。',
          },
          {
            type: 'callout', icon: '💡', title: '哪一邊當底都可以',
            text: '三角形的三條邊都可以當底，只要配上「對應那條底的高」就好，算出來的面積會一樣。',
          },
        ],
      },

      /* ── 4. 梯形 ─────────────────────────────── */
      {
        heading: '梯形：一樣的招數再用一次',
        blocks: [
          {
            type: 'text',
            text: '梯形的上底和下底不一樣長。但一樣拿兩個轉半圈拼起來，會發生什麼事？',
          },
          { type: 'component', build: () => new DissectArea({ mode: 'trapezoid', base: 6, top: 3, height: 4, offset: 2 }) },
          {
            type: 'callout', icon: '🔑', title: '公式',
            text: '梯形面積 =（上底 + 下底）× 高 ÷ 2。拼起來的平行四邊形，底剛好是「上底 + 下底」，而我們一樣只要一半。',
          },
          {
            type: 'callout', icon: '🪄', title: '三個公式其實是同一招',
            text: '平行四邊形剪一刀變長方形；三角形和梯形各拿兩個拼成平行四邊形。全部都在想辦法變成長方形——這就是為什麼三角形和梯形要除以 2，而平行四邊形不用。',
          },
        ],
      },

      /* ── 5. 複合圖形 ─────────────────────────── */
      {
        heading: '複合圖形：切開，或補起來',
        blocks: [
          {
            type: 'text',
            text: '生活中的圖形常常不是標準形狀。下面這個 L 形有三種算法，切換看看它們的答案。',
          },
          { type: 'component', build: () => compositeArea() },
          {
            type: 'callout', icon: '✂️', title: '兩種思路',
            text: '分割法：切成幾個會算的圖形，面積相加。補形法：先補成一個大長方形，再扣掉多出來的部分。哪一種好算就用哪一種。',
          },
        ],
      },

      /* ── 6. 選對公式 ─────────────────────────── */
      {
        heading: '看到圖形，該用哪個公式？',
        blocks: [
          { type: 'text', text: '把下面的情境放進正確的籃子：' },
          {
            type: 'component',
            build: () => new SortBuckets({
              wide: true,
              buckets: [
                { id: 'no2', label: '不用除以 2' },
                { id: 'div2', label: '要除以 2' },
              ],
              items: [
                { text: '長方形，長 8 公分、寬 5 公分', bucket: 'no2',
                  why: '長方形直接 8 × 5 = 40 平方公分。' },
                { text: '平行四邊形，底 8 公分、高 5 公分', bucket: 'no2',
                  why: '剪一刀就變長方形，8 × 5 = 40 平方公分，不用除以 2。' },
                { text: '三角形，底 8 公分、高 5 公分', bucket: 'div2',
                  why: '兩個三角形才拼成平行四邊形，8 × 5 ÷ 2 = 20 平方公分。' },
                { text: '梯形，上底 3、下底 5、高 4 公分', bucket: 'div2',
                  why: '兩個梯形才拼成平行四邊形，(3 + 5) × 4 ÷ 2 = 16 平方公分。' },
              ],
            }),
          },
        ],
      },

      /* ── 7. 概念檢查 ─────────────────────────── */
      {
        heading: '概念檢查',
        blocks: [
          { type: 'text', text: '七題小測驗。記得單位要寫平方公分。' },
          {
            type: 'component',
            build: () => new ChoiceQuiz({
              questions: [
                {
                  question: '一個長方形長 9 公分、寬 4 公分，面積是多少？',
                  options: ['13 平方公分', '26 平方公分', '36 平方公分', '36 公分'],
                  answer: 2,
                  explanation: '9 × 4 = 36 平方公分。注意單位是「平方公分」，不是「公分」。',
                },
                {
                  question: '一個平行四邊形底 7 公分、高 6 公分，斜邊 8 公分。面積是多少？',
                  hint: '題目給了斜邊 8 公分，是用來混淆的。',
                  options: ['42 平方公分', '56 平方公分', '21 平方公分', '48 平方公分'],
                  answer: 0,
                  explanation: '底 × 高 = 7 × 6 = 42 平方公分。斜邊 8 公分完全用不到——面積公式裡的高一定是垂直的那一段。',
                },
                {
                  question: '一個三角形底 10 公分、高 6 公分，面積是多少？',
                  options: ['60 平方公分', '30 平方公分', '16 平方公分', '15 平方公分'],
                  answer: 1,
                  explanation: '10 × 6 ÷ 2 = 30 平方公分。忘記除以 2 就會答成 60。',
                },
                {
                  question: '三角形的面積公式為什麼要除以 2？',
                  options: [
                    '因為三角形有三個邊',
                    '因為兩個一樣的三角形才拼成一個平行四邊形',
                    '因為高比較短',
                    '這是規定，沒有原因',
                  ],
                  answer: 1,
                  explanation: '把兩個一模一樣的三角形拼起來會變成平行四邊形（底 × 高），一個三角形只有它的一半，所以除以 2。',
                },
                {
                  question: '一個梯形上底 4 公分、下底 8 公分、高 5 公分，面積是多少？',
                  hint: '（上底 + 下底）× 高 ÷ 2',
                  options: ['60 平方公分', '30 平方公分', '20 平方公分', '160 平方公分'],
                  answer: 1,
                  explanation: '(4 + 8) × 5 ÷ 2 = 12 × 5 ÷ 2 = 30 平方公分。',
                },
                {
                  question: '一個 L 形，可以用 7 × 5 的大長方形扣掉右上角 3 × 2 的缺角來算。面積是多少？',
                  options: ['35 平方公分', '29 平方公分', '41 平方公分', '6 平方公分'],
                  answer: 1,
                  explanation: '35 − 6 = 29 平方公分。這是「補形法」：先當成完整的大長方形，再把多算的扣掉。',
                },
                {
                  question: '兩個三角形，底和高都一樣，但形狀看起來完全不同（一個很尖、一個很扁）。它們的面積？',
                  hint: '公式裡只用到底和高。',
                  options: ['尖的比較大', '扁的比較大', '一樣大', '要看邊長才知道'],
                  answer: 2,
                  explanation: '面積 = 底 × 高 ÷ 2，只要底和高一樣，面積就一樣，跟形狀看起來尖不尖沒有關係。',
                },
              ],
            }),
          },
        ],
      },
    ],
  };

  window.G5_UNITS = window.G5_UNITS || {};
  window.G5_UNITS[unit.id] = unit;
})();
