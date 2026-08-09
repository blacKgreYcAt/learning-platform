/**
 * 五上 · 單元 9：乘以幾分之一（翰林版）
 * 2026-08-07
 *
 * 依賴單元 7（分數的基本概念與約分）。
 *
 * 設計重點：小孩到五年級為止，對乘法的印象是「乘會變大」。
 * 這個單元最大的障礙不是計算，是要推翻這個舊印象。
 * 所以第一段就直接用「12 的 1/3 是 4」讓他看到乘完變小，
 * 先鬆動舊觀念，再教規則。
 */

'use strict';

(function () {
  const { El, ChoiceQuiz, GroupSplit, AreaModel, SortBuckets, fractionBar, fractionText } = window.G5;

  /** 一條分數條加上文字說明，展示用 */
  const barRow = (n, d, label) => ({
    mount(container) {
      const wrap = El('div', { class: 'frac-wrap' });
      wrap.append(El('div', { class: 'fadd-row' },
        El('span', { class: 'fadd-label' }, ''),
        fractionText(n, d),
        fractionBar(n, d)));
      if (label) wrap.append(El('p', { class: 'frac-note' }, label));
      container.append(wrap);
      return this;
    },
    destroy() {},
  });

  const unit = {
    id: 'g5-u09-multiply',
    grade: 5,
    semester: '上',
    order: 9,
    title: '單元 9　乘以幾分之一',
    subtitle: '為什麼乘完會變小？',
    icon: '✖️',
    estimatedMinutes: 30,
    objectives: [
      '知道「乘以幾分之一」就是「平分成幾份，取幾份」',
      '會計算整數乘以分數',
      '用面積模型理解分數乘分數，知道分母為什麼要相乘',
      '會計算分數乘分數並約分',
      '判斷乘完會變大還是變小',
    ],
    wrapUp: '「乘不一定變大」這件事很重要，六年級的分數除法、比例都建立在這個理解上。如果覺得怪怪的，回到「的」這個字：乘以分數就是在求「某個東西的幾分之幾」。',

    sections: [
      /* ── 1. 推翻舊印象 ───────────────────────── */
      {
        heading: '乘完，居然變小了',
        blocks: [
          {
            type: 'text',
            text: '媽媽買了 12 顆蘋果，說「拿三分之一去給奶奶」。要拿幾顆？',
          },
          { type: 'component', build: () => new GroupSplit({ total: 12, parts: 3, take: 1 }) },
          {
            type: 'callout', icon: '😲', title: '等一下',
            text: '12 × 1/3 = 4。乘完之後居然比 12 還小！以前學的乘法都是越乘越大，這裡怎麼反過來了？',
          },
          {
            type: 'text',
            text: '關鍵在「乘以幾分之一」的意思根本不是「變成幾倍」，而是「平分成幾份，取其中幾份」。所以會變小是正常的。',
          },
        ],
      },

      /* ── 2. 「的」這個字 ─────────────────────── */
        {
        heading: '看到「的」，就是乘',
        blocks: [
          {
            type: 'text',
            text: '「12 的 1/3」寫成算式就是 12 × 1/3。日常說話裡的「的」，在數學裡就是乘號。',
          },
          { type: 'component', build: () => new GroupSplit({ total: 12, parts: 4, take: 3 }) },
          {
            type: 'callout', icon: '🔑', title: '算法',
            text: '12 × 3/4：先把 12 平分成 4 堆（每堆 3 個），再取 3 堆，得到 9。算式上就是 12 ÷ 4 × 3 = 9，也可以寫成 (12 × 3) ÷ 4 = 9，兩種算出來一樣。',
          },
          {
            type: 'callout', icon: '📝', title: '直接算的方法',
            text: '整數乘分數：把整數當成分子去乘，分母不變。12 × 3/4 = (12 × 3)/4 = 36/4 = 9。',
          },
        ],
      },

      /* ── 3. 分數乘分數 ───────────────────────── */
      {
        heading: '分數乘分數：一半的一半是多少？',
        blocks: [
          {
            type: 'text',
            text: '半張披薩，再拿它的一半，是整張的多少？也就是 1/2 × 1/2。用一張紙來看最清楚。',
          },
          { type: 'component', build: () => new AreaModel({ a: { n: 1, d: 2 }, b: { n: 1, d: 2 } }) },
          {
            type: 'callout', icon: '🔑', title: '重疊的部分就是答案',
            text: '一邊直著切、一邊橫著切，兩邊都被選到的那塊就是答案。1/2 的 1/2 = 1/4。',
          },
        ],
      },

      /* ── 4. 為什麼分母要相乘 ─────────────────── */
      {
        heading: '為什麼「分母乘分母」？',
        blocks: [
          { type: 'text', text: '換一組數字再看一次：2/3 × 3/4。注意最後總格數是怎麼來的。' },
          { type: 'component', build: () => new AreaModel({ a: { n: 2, d: 3 }, b: { n: 3, d: 4 } }) },
          {
            type: 'callout', icon: '🔲', title: '格子數就是理由',
            text: '直著切 3 條、橫著切 4 排，整張紙被切成 3 × 4 = 12 格——這就是分母相乘的來源。重疊的部分是 2 × 3 = 6 格，就是分子相乘。',
          },
          {
            type: 'callout', icon: '✍️', title: '規則',
            text: '分數 × 分數 = 分子乘分子、分母乘分母，最後記得約分。6/12 約分後是 1/2。',
          },
        ],
      },

      /* ── 5. 先約再乘 ─────────────────────────── */
      {
        heading: '小技巧：先約分再乘，數字比較小',
        blocks: [
          {
            type: 'text',
            text: '計算 3/4 × 8/9 時，如果先乘會得到 24/36，數字很大還要再約分。可以在乘之前先約：',
          },
          {
            type: 'component',
            build: () => barRow(2, 3, '3/4 × 8/9：3 和 9 都能被 3 整除、4 和 8 都能被 4 整除，先約掉之後變成 1/1 × 2/3 = 2/3。跟先乘再約的結果一樣，但數字小很多。'),
          },
          {
            type: 'callout', icon: '⚡', title: '為什麼可以這樣',
            text: '因為乘法是把分子全部相乘、分母全部相乘，所以任何一個分子都可以跟任何一個分母約分，順序不影響結果。',
          },
        ],
      },

      /* ── 6. 判斷變大還是變小 ─────────────────── */
      {
        heading: '不用算也知道：會變大還是變小？',
        blocks: [
          {
            type: 'text',
            text: '看乘的那個數跟 1 比較就知道了。這個判斷很有用——算完可以拿來檢查答案合不合理。',
          },
          {
            type: 'callout', icon: '🔽', title: '乘以小於 1 的數 → 變小',
            text: '例如 20 × 3/4 = 15。因為 3/4 比 1 小，等於只取原來的一部分。',
          },
          {
            type: 'callout', icon: '🟰', title: '乘以 1 → 不變',
            text: '20 × 4/4 = 20。分子分母一樣大的分數就是 1。',
          },
          {
            type: 'callout', icon: '🔼', title: '乘以大於 1 的數 → 變大',
            text: '20 × 5/4 = 25。因為 5/4 比 1 大，比原來多拿了一些。',
          },
          { type: 'text', text: '不用實際計算，判斷下面每一題的結果會比 20 大還是小：' },
          {
            type: 'component',
            build: () => new SortBuckets({
              buckets: [
                { id: 'small', label: '🔽 比 20 小' },
                { id: 'big', label: '🔼 比 20 大' },
              ],
              items: [
                { text: '20 × 2/5', bucket: 'small', why: '2/5 比 1 小，所以結果比 20 小（答案是 8）。' },
                { text: '20 × 7/8', bucket: 'small', why: '7/8 比 1 小，所以結果比 20 小（答案是 17.5）。' },
                { text: '20 × 3/2', bucket: 'big', why: '3/2 比 1 大，所以結果比 20 大（答案是 30）。' },
                { text: '20 × 9/4', bucket: 'big', why: '9/4 比 1 大，所以結果比 20 大（答案是 45）。' },
              ],
            }),
          },
        ],
      },

      /* ── 7. 概念檢查 ─────────────────────────── */
      {
        heading: '概念檢查',
        blocks: [
          { type: 'text', text: '六題小測驗。' },
          {
            type: 'component',
            build: () => new ChoiceQuiz({
              questions: [
                {
                  question: '18 的 1/3 是多少？',
                  hint: '平分成 3 堆，取 1 堆。',
                  options: ['3', '6', '9', '54'],
                  answer: 1,
                  explanation: '18 ÷ 3 = 6，所以 18 × 1/3 = 6。答 54 的人是算成 18 × 3 了。',
                },
                {
                  question: '20 × 3/5 = ?',
                  hint: '先分成 5 堆，再取 3 堆。',
                  options: ['4', '12', '15', '60'],
                  answer: 1,
                  explanation: '20 ÷ 5 = 4（每堆 4 個），取 3 堆就是 12。也可以算 (20 × 3) ÷ 5 = 60 ÷ 5 = 12。',
                },
                {
                  question: '1/2 × 1/3 = ?',
                  hint: '想紙張切格子：直切 2 份、橫切 3 份。',
                  options: ['2/5', '1/5', '1/6', '2/6'],
                  answer: 2,
                  explanation: '分子乘分子：1 × 1 = 1；分母乘分母：2 × 3 = 6。答案是 1/6。分母不可以相加。',
                },
                {
                  question: '2/3 × 3/4 = ?（記得約分）',
                  options: ['6/12', '1/2', '5/7', '6/7'],
                  answer: 1,
                  explanation: '2 × 3 = 6、3 × 4 = 12，得到 6/12，約分後是 1/2。答案要寫成最簡分數。',
                },
                {
                  question: '不用計算，30 × 4/7 的結果會？',
                  hint: '看 4/7 跟 1 比誰大。',
                  options: ['比 30 大', '比 30 小', '等於 30', '不一定'],
                  answer: 1,
                  explanation: '4/7 比 1 小，乘以小於 1 的數結果會變小，所以比 30 小。',
                },
                {
                  question: '一條 3/4 公尺的繩子，用掉了它的 2/3，用掉幾公尺？',
                  hint: '「它的」就是乘。',
                  options: ['1/2 公尺', '17/12 公尺', '1/4 公尺', '9/8 公尺'],
                  answer: 0,
                  explanation: '3/4 × 2/3 = 6/12 = 1/2 公尺。看到「它的」就用乘法，不是減法。',
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
