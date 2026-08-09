/**
 * 五上 · 單元 6：四則運算（翰林版）
 * 2026-08-07
 *
 * 設計重點：這個單元的規則本身不難背，難的是「為什麼要這樣規定」。
 * 所以先用生活情境讓小孩看到「順序不同會算出不同答案」，
 * 產生「那到底該聽誰的」的疑問之後，規則才有意義。
 *
 * 另外刻意大量使用「選錯了針對他選的那一段解釋」，因為運算順序的錯誤
 * 幾乎都是同一種：把加減搶在乘除前面算。
 */

'use strict';

(function () {
  const { El, ChoiceQuiz, ExpressionSolver, LabeledDiagram, SortBuckets } = window.G5;

  /** 並排顯示兩種算法得到不同答案，用來製造衝突 */
  const conflict = (rows, caption) => ({
    mount(container) {
      const wrap = El('div', { class: 'solver' });
      rows.forEach((r) => {
        wrap.append(El('div', { class: 'conflict-row' },
          El('span', { class: 'conflict-label' }, r.label),
          El('span', { class: 'conflict-expr' }, r.steps.join('　→　')),
          El('strong', { class: r.right ? 'conflict-ok' : 'conflict-bad' }, `= ${r.result}`)));
      });
      if (caption) wrap.append(El('p', { class: 'solver-note' }, caption));
      container.append(wrap);
      return this;
    },
    destroy() {},
  });

  const unit = {
    id: 'g5-u06-operations',
    grade: 5,
    semester: '上',
    order: 6,
    title: '單元 6　四則運算',
    subtitle: '算式裡誰先誰後，要有規矩',
    icon: '➗',
    estimatedMinutes: 30,
    objectives: [
      '知道為什麼運算順序需要一個統一的規定',
      '記得順序：先括號，再乘除，最後加減',
      '同一層級的運算由左往右算',
      '會把兩三個分開的算式合併成一個算式（併式）',
      '會用括號改變原本的計算順序',
    ],
    wrapUp: '運算順序看起來只是規則，但它是後面所有計算的地基——分數四則、代數、方程式都靠它。算錯的時候先檢查順序，往往問題就在那裡。',

    sections: [
      /* ── 1. 製造衝突 ─────────────────────────── */
      {
        heading: '同一個算式，兩個人算出不同答案',
        blocks: [
          {
            type: 'text',
            text: '小明買了 1 個 12 元的麵包，還有 3 瓶 4 元的牛奶。算式寫成 12 + 3 × 4。他和妹妹算出了不一樣的答案。',
          },
          {
            type: 'component',
            build: () => conflict([
              { label: '妹妹', steps: ['12 + 3 × 4', '15 × 4'], result: '60', right: false },
              { label: '小明', steps: ['12 + 3 × 4', '12 + 12'], result: '24', right: true },
            ], '同一個算式竟然有兩個答案——問題出在「先算哪一段」。'),
          },
          {
            type: 'callout', icon: '🤔', title: '想一想',
            text: '回到題目：3 瓶牛奶要 3 × 4 = 12 元，加上麵包 12 元，總共 24 元。小明才是對的。如果每個人都照自己高興的順序算，同一個算式就會有很多答案，那數學就沒辦法溝通了——所以需要一個大家都遵守的規定。',
          },
        ],
      },

      /* ── 2. 規則 ─────────────────────────────── */
      {
        heading: '運算順序的規定',
        blocks: [
          { type: 'text', text: '點下面每一層，看它的說明和例子。' },
          {
            type: 'component',
            build: () => new LabeledDiagram({
              caption: '由上往下，先做上面那一層',
              parts: [
                { icon: '1️⃣', name: '第一層：括號',
                  description: '有括號就先算括號裡面的。例如 (12 + 3) × 4，要先算 12 + 3 = 15，再算 15 × 4 = 60。括號的作用就是「插隊」。' },
                { icon: '2️⃣', name: '第二層：乘、除',
                  description: '沒有括號的話，先做乘法和除法。例如 12 + 3 × 4，先算 3 × 4 = 12。' },
                { icon: '3️⃣', name: '第三層：加、減',
                  description: '最後才做加法和減法。例如上一步算完剩下 12 + 12 = 24。' },
                { icon: '➡️', name: '同一層：由左往右',
                  description: '乘和除同一層、加和減同一層。同一層的時候從左邊算到右邊。例如 24 ÷ 4 × 2，先算 24 ÷ 4 = 6，再算 6 × 2 = 12（不是先算 4 × 2）。' },
              ],
            }),
          },
          {
            type: 'callout', icon: '🔑', title: '一句話記住',
            text: '先括號 → 再乘除 → 後加減，同一層由左往右。',
          },
        ],
      },

      /* ── 3. 動手判斷 ─────────────────────────── */
      {
        heading: '換你決定：先算哪一段？',
        blocks: [
          { type: 'text', text: '每一步都選出應該先算的那一段。選錯會告訴你為什麼不行。' },
          {
            type: 'component',
            build: () => new ExpressionSolver({
              answer: '38',
              steps: [
                {
                  expr: '20 + 6 × 3',
                  options: [
                    { text: '6 × 3', ok: true, why: '對！先乘除後加減，6 × 3 = 18，算式變成 20 + 18。' },
                    { text: '20 + 6', ok: false, why: '不行。加法在第三層，乘法在第二層，要先算乘法。' },
                  ],
                },
                {
                  expr: '20 + 18',
                  options: [
                    { text: '20 + 18', ok: true, why: '只剩加法了，20 + 18 = 38。' },
                  ],
                },
              ],
            }),
          },
          { type: 'text', text: '再來一題，這次有括號：' },
          {
            type: 'component',
            build: () => new ExpressionSolver({
              answer: '15',
              steps: [
                {
                  expr: '(8 + 7) ÷ 3 × 3',
                  options: [
                    { text: '8 + 7', ok: true, why: '對！括號在第一層，最優先。8 + 7 = 15。' },
                    { text: '3 × 3', ok: false, why: '不行。雖然乘法在第二層，但括號在第一層，要先算括號裡面的。' },
                    { text: '7 ÷ 3', ok: false, why: '不行。7 在括號裡面，不能把它拉出來跟外面的 3 相除。' },
                  ],
                },
                {
                  expr: '15 ÷ 3 × 3',
                  options: [
                    { text: '15 ÷ 3', ok: true, why: '對！乘除同一層，要由左往右，所以先算 15 ÷ 3 = 5。' },
                    { text: '3 × 3', ok: false, why: '不行。乘和除同一層時要由左往右算，除法在左邊，先算除法。' },
                  ],
                },
                {
                  expr: '5 × 3',
                  options: [
                    { text: '5 × 3', ok: true, why: '5 × 3 = 15。' },
                  ],
                },
              ],
            }),
          },
        ],
      },

      /* ── 4. 括號的用途 ───────────────────────── */
      {
        heading: '括號：讓某一段插隊先算',
        blocks: [
          {
            type: 'text',
            text: '同樣的數字，加不加括號結果完全不同。比較這兩個算式：',
          },
          {
            type: 'component',
            build: () => conflict([
              { label: '沒括號', steps: ['12 + 3 × 4', '12 + 12'], result: '24', right: true },
              { label: '有括號', steps: ['(12 + 3) × 4', '15 × 4'], result: '60', right: true },
            ], '兩個都算對——因為它們本來就是不同的算式。括號改變了計算順序。'),
          },
          {
            type: 'callout', icon: '💡', title: '什麼時候要用括號',
            text: '當你想先算的那一段不符合原本的順序時，就用括號把它框起來。例如「先把兩種餅乾加起來，再平分給 5 個人」，就要寫成 (8 + 12) ÷ 5，不能寫成 8 + 12 ÷ 5。',
          },
        ],
      },

      /* ── 5. 併式 ─────────────────────────────── */
      {
        heading: '併式：把好幾個算式合成一個',
        blocks: [
          {
            type: 'text',
            text: '一枝筆 15 元，買了 4 枝；一本本子 25 元，買了 2 本。分開算是：15 × 4 = 60、25 × 2 = 50、60 + 50 = 110。',
          },
          {
            type: 'text',
            text: '把它們合併成一個算式就是：15 × 4 + 25 × 2 = 110。因為乘法會先算，所以這裡不用加括號。',
          },
          {
            type: 'component',
            build: () => new ExpressionSolver({
              answer: '110',
              steps: [
                {
                  expr: '15 × 4 + 25 × 2',
                  options: [
                    { text: '15 × 4', ok: true, why: '對！兩個乘法都要先算，從左邊的開始，15 × 4 = 60。' },
                    { text: '4 + 25', ok: false, why: '不行。加法在第三層，要等兩邊的乘法都算完才輪到它。' },
                  ],
                },
                {
                  expr: '60 + 25 × 2',
                  options: [
                    { text: '25 × 2', ok: true, why: '對！還有一個乘法沒算，25 × 2 = 50。' },
                    { text: '60 + 25', ok: false, why: '不行。乘法還沒算完，不能先做加法。' },
                  ],
                },
                {
                  expr: '60 + 50',
                  options: [{ text: '60 + 50', ok: true, why: '最後做加法，60 + 50 = 110。' }],
                },
              ],
            }),
          },
          { type: 'text', text: '判斷下面的題目，併式時需不需要加括號：' },
          {
            type: 'component',
            build: () => new SortBuckets({
              wide: true,
              buckets: [
                { id: 'need', label: '（　）需要括號' },
                { id: 'no', label: '不需要括號' },
              ],
              items: [
                { text: '買 3 枝 8 元的筆和 1 個 20 元的本子，共多少錢？',
                  bucket: 'no', why: '寫成 8 × 3 + 20。乘法本來就先算，不用括號。' },
                { text: '把 8 元和 20 元加起來，再平分給 4 個人，每人多少錢？',
                  bucket: 'need', why: '寫成 (8 + 20) ÷ 4。要先加再除，不加括號就會變成先算 20 ÷ 4。' },
                { text: '30 元花掉 6 元後，剩下的平分成 4 份，每份多少？',
                  bucket: 'need', why: '寫成 (30 − 6) ÷ 4。要先減再除，所以需要括號。' },
                { text: '4 盒各 6 顆的糖果，再拿掉 5 顆，還剩幾顆？',
                  bucket: 'no', why: '寫成 6 × 4 − 5。乘法先算，減法後算，順序本來就對。' },
              ],
            }),
          },
        ],
      },

      /* ── 6. 常見錯誤 ─────────────────────────── */
      {
        heading: '最容易錯的三個地方',
        blocks: [
          {
            type: 'callout', icon: '⚠️', title: '錯誤一：從左邊一路算到底',
            text: '20 + 6 × 3 算成 (20 + 6) × 3 = 78。這是最常見的錯，記得乘除要先算。',
          },
          {
            type: 'callout', icon: '⚠️', title: '錯誤二：以為乘一定比除先算',
            text: '24 ÷ 4 × 2 算成 24 ÷ 8 = 3。乘和除是同一層，要由左往右：24 ÷ 4 = 6，6 × 2 = 12。',
          },
          {
            type: 'callout', icon: '⚠️', title: '錯誤三：減法也要由左往右',
            text: '20 − 8 − 3 算成 20 − 5 = 15。加減同一層，一樣由左往右：20 − 8 = 12，12 − 3 = 9。',
          },
          { type: 'text', text: '這一題三個陷阱都有，小心：' },
          {
            type: 'component',
            build: () => new ExpressionSolver({
              answer: '13',
              steps: [
                {
                  expr: '36 ÷ 6 × 2 + 1',
                  options: [
                    { text: '36 ÷ 6', ok: true, why: '對！乘除同一層由左往右，除法在最左邊，36 ÷ 6 = 6。' },
                    { text: '6 × 2', ok: false, why: '不行。乘除同一層要由左往右，除法在左邊，要先算。' },
                    { text: '2 + 1', ok: false, why: '不行。加法在第三層，最後才算。' },
                  ],
                },
                {
                  expr: '6 × 2 + 1',
                  options: [
                    { text: '6 × 2', ok: true, why: '對！乘法先於加法，6 × 2 = 12。' },
                    { text: '2 + 1', ok: false, why: '不行。乘法在第二層，加法在第三層，乘法先算。' },
                  ],
                },
                {
                  expr: '12 + 1',
                  options: [{ text: '12 + 1', ok: true, why: '12 + 1 = 13。' }],
                },
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
                  question: '15 + 5 × 2 = ?',
                  hint: '先乘除後加減。',
                  options: ['40', '25', '30', '22'],
                  answer: 1,
                  explanation: '先算 5 × 2 = 10，再算 15 + 10 = 25。答 40 的人是先算了 15 + 5。',
                },
                {
                  question: '(15 + 5) × 2 = ?',
                  hint: '有括號先算括號。',
                  options: ['25', '40', '30', '35'],
                  answer: 1,
                  explanation: '括號優先：15 + 5 = 20，再算 20 × 2 = 40。跟上一題比較，就知道括號的威力。',
                },
                {
                  question: '48 ÷ 6 × 2 = ?',
                  hint: '乘除同一層，注意方向。',
                  options: ['4', '16', '576', '12'],
                  answer: 1,
                  explanation: '由左往右：48 ÷ 6 = 8，8 × 2 = 16。答 4 的人是先算了 6 × 2 = 12。',
                },
                {
                  question: '30 − 12 − 5 = ?',
                  options: ['23', '13', '17', '47'],
                  answer: 1,
                  explanation: '加減同一層也要由左往右：30 − 12 = 18，18 − 5 = 13。答 23 的人是先算了 12 − 5。',
                },
                {
                  question: '「50 元買了 2 支 15 元的筆，找回多少錢？」正確的併式是？',
                  hint: '先算筆的總價，再從 50 元扣掉。',
                  options: ['50 − 15 × 2', '(50 − 15) × 2', '50 × 2 − 15', '50 − 15 − 2'],
                  answer: 0,
                  explanation: '兩支筆是 15 × 2 = 30 元，50 − 30 = 20 元。乘法本來就先算，所以 50 − 15 × 2 不用加括號。',
                },
                {
                  question: '「把 18 顆和 6 顆糖果合起來，平分給 4 個人」，哪個算式對？',
                  hint: '要先合起來，才平分。',
                  options: ['18 + 6 ÷ 4', '(18 + 6) ÷ 4', '18 ÷ 4 + 6', '18 + 6 × 4'],
                  answer: 1,
                  explanation: '要先加再除，但除法本來會先算，所以必須用括號把加法框起來：(18 + 6) ÷ 4 = 24 ÷ 4 = 6 顆。',
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
