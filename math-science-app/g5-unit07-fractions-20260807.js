/**
 * 五上 · 單元 7：擴分、約分與分數加減（翰林版）
 * 2026-08-07
 *
 * 依賴單元 4（公倍數與公因數）：約分用最大公因數、通分用最小公倍數。
 *
 * 設計重點：整個單元只圍繞一個視覺事實——
 * 「不管切成幾份，塗色的那一段長度沒有改變」。
 * 擴分、約分、通分全都是這件事的不同說法。小孩只要抓住這一點，
 * 就不會把「分子分母同乘」背成一條沒有意義的規則。
 */

'use strict';

(function () {
  const { El, ChoiceQuiz, EquivalentFraction, SimplifyTool, FractionAdd, fractionBar, fractionText } = window.G5;

  /** 並排兩條分數條做比較，純展示用 */
  const compareBars = (pairs, caption) => ({
    mount(container) {
      const wrap = El('div', { class: 'frac-wrap' });
      pairs.forEach(([n, d]) => {
        wrap.append(El('div', { class: 'fadd-row' },
          El('span', { class: 'fadd-label' }, ''),
          fractionText(n, d),
          fractionBar(n, d)));
      });
      if (caption) wrap.append(El('p', { class: 'frac-note' }, caption));
      container.append(wrap);
      return this;
    },
    destroy() {},
  });

  const unit = {
    id: 'g5-u07-fractions',
    grade: 5,
    semester: '上',
    order: 7,
    title: '單元 7　擴分約分與加減',
    subtitle: '切法不同，大小可以一樣',
    icon: '🍰',
    estimatedMinutes: 35,
    objectives: [
      '知道同一個大小可以有很多種分數寫法（等值分數）',
      '會擴分：分子分母同乘一個數，大小不變',
      '會約分，並用最大公因數一次約到最簡分數',
      '知道異分母為什麼不能直接相加',
      '會用最小公倍數通分，計算異分母分數的加減',
    ],
    wrapUp: '通分和約分是分數運算的兩個基本動作，後面的分數乘除、比例都會一直用到。如果哪裡卡住，回到分數條看一次「長度有沒有變」通常就通了。',

    sections: [
      /* ── 1. 情境 ─────────────────────────────── */
      {
        heading: '切法不一樣，吃到的一樣多嗎？',
        blocks: [
          {
            type: 'text',
            text: '哥哥把蛋糕切成 2 塊，拿走 1 塊。妹妹把一模一樣的蛋糕切成 4 塊，拿走 2 塊。誰吃得比較多？',
          },
          {
            type: 'component',
            build: () => compareBars([[1, 2], [2, 4]],
              '兩條塗色的長度一模一樣長——雖然一個寫成 1/2、一個寫成 2/4，吃到的其實一樣多。'),
          },
          {
            type: 'callout', icon: '🔑', title: '等值分數',
            text: '大小相同、但寫法不同的分數，叫做「等值分數」。1/2、2/4、3/6、4/8 都是同一個大小。',
          },
        ],
      },

      /* ── 2. 擴分 ─────────────────────────────── */
      {
        heading: '擴分：把格子切得更細',
        blocks: [
          {
            type: 'text',
            text: '按 × 2 或 × 3，看看格子變細的時候，塗色的長度有沒有跟著改變。',
          },
          { type: 'component', build: () => new EquivalentFraction({ n: 1, d: 2 }) },
          {
            type: 'callout', icon: '📏', title: '為什麼大小不變',
            text: '每一格變成一半大，但塗色的格子數也變成兩倍——一半 × 兩倍 = 沒變。所以「分子和分母同乘一個數，分數大小不變」，這叫擴分。',
          },
          {
            type: 'callout', icon: '⚠️', title: '注意',
            text: '一定要「同時」乘同一個數。只乘分子（1/2 → 2/2）會變成 1，那就完全是另一個數了。',
          },
        ],
      },

      /* ── 3. 約分 ─────────────────────────────── */
      {
        heading: '約分：反過來，把格子合併變粗',
        blocks: [
          {
            type: 'text',
            text: '約分就是擴分的反向操作：分子分母同時除以一個公因數，格子變粗，但長度一樣。試著把 18/24 約到最簡。',
          },
          { type: 'component', build: () => new SimplifyTool({ n: 18, d: 24 }) },
          {
            type: 'callout', icon: '⚡', title: '一次到位的方法',
            text: '18 和 24 的最大公因數是 6（這就是單元 4 學的）。直接除以 6，一步就得到 3/4，不用一次一次慢慢除。',
          },
          { type: 'text', text: '再練一題：把 24/36 約到最簡分數。' },
          { type: 'component', build: () => new SimplifyTool({ n: 24, d: 36 }) },
        ],
      },

      /* ── 4. 最簡分數 ─────────────────────────── */
      {
        heading: '什麼是最簡分數？',
        blocks: [
          {
            type: 'text',
            text: '當分子和分母除了 1 以外沒有共同的因數（也就是最大公因數是 1），就沒辦法再約了，這時候叫「最簡分數」。',
          },
          {
            type: 'component',
            build: () => compareBars([[6, 8], [3, 4]],
              '6/8 還可以約（都能被 2 整除）；3/4 的 3 和 4 沒有共同因數，是最簡分數。長度從頭到尾都一樣。'),
          },
          {
            type: 'callout', icon: '✍️', title: '習慣',
            text: '算完分數題目，答案通常要寫成最簡分數。算完先看一眼分子分母有沒有共同的因數，有就再約一次。',
          },
        ],
      },

      /* ── 5. 為什麼要通分 ─────────────────────── */
      {
        heading: '異分母為什麼不能直接加？',
        blocks: [
          {
            type: 'text',
            text: '1/2 + 1/3 可不可以寫成 2/5？看圖就知道不行——兩條的格子大小根本不一樣。',
          },
          {
            type: 'component',
            build: () => compareBars([[1, 2], [1, 3], [2, 5]],
              '上面兩條塗色加起來，明顯比第三條的 2/5 還多。分母不同時，格子大小不同，分子不能直接相加。'),
          },
          {
            type: 'callout', icon: '🍕', title: '想成披薩',
            text: '1 塊切成兩半的披薩，加 1 塊切成三份的披薩，不能說成「2 塊」——因為這兩塊根本不一樣大。要先把它們切成一樣大才能數。',
          },
        ],
      },

      /* ── 6. 通分與加減 ───────────────────────── */
      {
        heading: '通分：把格子改成一樣大',
        blocks: [
          { type: 'text', text: '按「下一步」，一步一步看 1/2 + 1/3 怎麼算。' },
          { type: 'component', build: () => new FractionAdd({ a: { n: 1, d: 2 }, b: { n: 1, d: 3 }, op: '+' }) },
          {
            type: 'callout', icon: '🔑', title: '通分',
            text: '把兩個分母改成同一個數（用它們的最小公倍數），這個動作叫「通分」。通分之後格子一樣大，分子才可以直接加減。',
          },
          { type: 'text', text: '減法也一樣。看 3/4 − 1/6：' },
          { type: 'component', build: () => new FractionAdd({ a: { n: 3, d: 4 }, b: { n: 1, d: 6 }, op: '-' }) },
          {
            type: 'callout', icon: '📋', title: '完整步驟',
            text: '① 看分母一不一樣 ② 不一樣就找最小公倍數通分 ③ 分子加減、分母不變 ④ 答案能約分就約成最簡分數。',
          },
        ],
      },

      /* ── 7. 概念檢查 ─────────────────────────── */
      {
        heading: '概念檢查',
        blocks: [
          { type: 'text', text: '六題小測驗。答錯會告訴你是哪個步驟想錯了。' },
          {
            type: 'component',
            build: () => new ChoiceQuiz({
              questions: [
                {
                  question: '下面哪一個分數和 2/3 一樣大？',
                  hint: '分子分母同乘一個數。',
                  options: ['3/4', '4/6', '2/6', '4/3'],
                  answer: 1,
                  explanation: '2/3 的分子分母同乘 2 得到 4/6，大小不變。2/6 是只有分母乘 2，那樣會變小。',
                },
                {
                  question: '12/18 約到最簡分數是多少？',
                  hint: '12 和 18 的最大公因數是 6。',
                  options: ['6/9', '4/6', '2/3', '3/4'],
                  answer: 2,
                  explanation: '12 ÷ 6 = 2、18 ÷ 6 = 3，得到 2/3。6/9 和 4/6 雖然也等值，但還可以再約，不是最簡。',
                },
                {
                  question: '下面哪一個已經是最簡分數？',
                  options: ['8/12', '5/9', '6/10', '9/15'],
                  answer: 1,
                  explanation: '5 的因數只有 1、5；9 的因數是 1、3、9，共同的只有 1，所以 5/9 是最簡分數。其他三個分子分母都還有共同因數。',
                },
                {
                  question: '要計算 1/4 + 1/6，通分後的分母應該是多少？',
                  hint: '找 4 和 6 的最小公倍數。',
                  options: ['10', '12', '24', '2'],
                  answer: 1,
                  explanation: '4 和 6 的最小公倍數是 12。（24 也是公倍數、也算得出來，但數字比較大、之後還要多約一次，用最小的最省事。）',
                },
                {
                  question: '1/3 + 1/6 等於多少？',
                  hint: '先通分成同分母，再把分子相加，最後記得約分。',
                  options: ['2/9', '1/2', '2/6', '1/9'],
                  answer: 1,
                  explanation: '通分：1/3 = 2/6。2/6 + 1/6 = 3/6，再約分得到 1/2。答案要寫成最簡分數。',
                },
                {
                  question: '小明說「1/2 + 1/3 = 2/5」。他錯在哪裡？',
                  options: [
                    '他應該把分母相乘',
                    '他把分子和分母各自相加了，但異分母不能這樣算',
                    '他忘記約分',
                    '他沒有錯',
                  ],
                  answer: 1,
                  explanation: '分子加分子、分母加分母是錯的。必須先通分成同分母（1/2 = 3/6、1/3 = 2/6），再把分子相加得到 5/6。',
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
