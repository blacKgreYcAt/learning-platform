/**
 * 五上 · 單元 2：倍數與因數（翰林版）
 * 2026-08-07
 *
 * 教學順序沿用舊版 factors-multiples-data.js 的骨架
 * （因數 → 配對法 → 倍數 → 兩者關係），但把「先給定義」改成「先動手」：
 * 小孩要先自己把方塊排成長方形、發現排得成和排不成的差別，
 * 才給「因數」這個名字。名詞放在經驗後面，才不會變成死背。
 */

'use strict';

(function () {
  const { El, ChoiceQuiz, NumberGrid, ArrayBuilder, SortBuckets, TapPairing } = window.G5;

  const unit = {
    id: 'g5-u02-factors',
    grade: 5,
    semester: '上',
    order: 2,
    title: '單元 2　倍數與因數',
    subtitle: '從排方塊開始，弄懂誰整除誰',
    icon: '🔢',
    estimatedMinutes: 30,
    objectives: [
      '知道「整除」是什麼意思',
      '會用排長方形的方法找出一個數的所有因數',
      '會用配對法有系統地找因數，不會漏掉',
      '知道倍數是什麼，會列出一個數的倍數',
      '分得清楚因數和倍數，不會搞混',
    ],
    wrapUp: '因數和倍數是後面「公因數、公倍數」和「約分、通分」的基礎。這兩個字如果會混，之後的分數運算會一路卡住，所以這個單元值得多花點時間。',

    sections: [
      /* ── 1. 情境導入：先有問題 ───────────────── */
      {
        heading: '24 顆糖果，可以平分給幾個人？',
        blocks: [
          {
            type: 'text',
            text: '你有 24 顆糖果，想平分給幾個好朋友，每個人拿到的要一樣多，而且不能剩下。可以分給幾個人呢？',
          },
          {
            type: 'text',
            text: '分給 2 個人，每人 12 顆，剛好。分給 5 個人呢？24 ÷ 5 = 4 剩 4，會剩下 4 顆，不行。',
          },
          {
            type: 'callout', icon: '🤔', title: '想一想',
            text: '「剛好分完、沒有剩下」這件事，在數學上叫做「整除」。這個單元就是在研究：一個數可以被哪些數整除？',
          },
        ],
      },

      /* ── 2. 動手排長方形 ─────────────────────── */
      {
        heading: '動手排排看：哪些排法排得成長方形？',
        blocks: [
          {
            type: 'text',
            text: '下面有 12 個方塊。點上面的數字決定「每排放幾個」，看看哪些排法可以排成完整的長方形，哪些會缺角。',
          },
          { type: 'component', build: () => new ArrayBuilder({ total: 12 }) },
          {
            type: 'callout', icon: '🔑', title: '發現了嗎',
            text: '排得成完整長方形的數字（1、2、3、4、6、12），就是 12 的「因數」。排不成的（5、7、8…）就不是。因數的意思就是：可以把這個數整除的數。',
          },
        ],
      },

      /* ── 3. 有系統地找因數 ───────────────────── */
      {
        heading: '怎麼找才不會漏掉？配對法',
        blocks: [
          {
            type: 'text',
            text: '剛剛排方塊的時候，你有沒有注意到：每找到一個因數，就會同時得到另一個？12 = 2 × 6，所以 2 和 6 是一組。這叫「因數配對」。',
          },
          {
            type: 'text',
            text: '用配對法找 24 的因數：從 1 開始一個一個試，找到一個就記下一對，試到兩邊碰頭就可以停了。',
          },
          {
            type: 'component',
            build: () => new TapPairing({
              left: [
                { id: 'p1', text: '24 ÷ 1 = ?' },
                { id: 'p2', text: '24 ÷ 2 = ?' },
                { id: 'p3', text: '24 ÷ 3 = ?' },
                { id: 'p4', text: '24 ÷ 4 = ?' },
              ],
              right: [
                { id: 'p1', text: '24　→ 配對 (1, 24)' },
                { id: 'p2', text: '12　→ 配對 (2, 12)' },
                { id: 'p3', text: '8　→ 配對 (3, 8)' },
                { id: 'p4', text: '6　→ 配對 (4, 6)' },
              ],
              pairs: { p1: 'p1', p2: 'p2', p3: 'p3', p4: 'p4' },
            }),
          },
          {
            type: 'callout', icon: '✋', title: '什麼時候可以停？',
            text: '試到 4 的時候配到 6，再試 5（除不盡）、試 6 的時候會配到 4——已經出現過了，代表兩邊碰頭，可以停了。所以 24 的因數是 1、2、3、4、6、8、12、24，共 8 個。',
          },
          { type: 'component', build: () => new NumberGrid({ max: 24, target: 24, mode: 'factor' }) },
        ],
      },

      /* ── 4. 練習找因數 ───────────────────────── */
      {
        heading: '換你找：18 的因數有哪些？',
        blocks: [
          { type: 'text', text: '在下面的數字方格中，把 18 的因數全部點出來。點錯會告訴你為什麼。' },
          { type: 'component', build: () => new NumberGrid({ max: 18, target: 18, mode: 'factor', interactive: true }) },
          {
            type: 'callout', icon: '💡', title: '小技巧',
            text: '1 和它自己一定是因數，這兩個先寫下來。然後從 2 開始一個一個試：2、3、4、5……試到兩邊碰頭為止。',
          },
        ],
      },

      /* ── 5. 倍數 ─────────────────────────────── */
      {
        heading: '倍數：反過來看同一件事',
        blocks: [
          {
            type: 'text',
            text: '把 6 一直加上去：6、12、18、24、30……這些數字就是 6 的倍數。換句話說，6 的倍數就是「6 乘以 1、2、3、4……」得到的數。',
          },
          { type: 'component', build: () => new NumberGrid({ max: 36, target: 6, mode: 'multiple' }) },
          {
            type: 'callout', icon: '♾️', title: '注意',
            text: '一個數的因數有限（找得完），但倍數是無限多個（永遠找不完）。所以題目通常會限制範圍，例如「50 以內 6 的倍數」。',
          },
          { type: 'text', text: '換你點：把 30 以內、4 的倍數全部找出來。' },
          { type: 'component', build: () => new NumberGrid({ max: 30, target: 4, mode: 'multiple', interactive: true }) },
        ],
      },

      /* ── 6. 因數 vs 倍數 ─────────────────────── */
      {
        heading: '別搞混：因數和倍數的關係',
        blocks: [
          {
            type: 'text',
            text: '這兩個詞最容易搞混。關鍵是記住「誰比較大」：因數比較小（或一樣大），倍數比較大（或一樣大）。',
          },
          {
            type: 'callout', icon: '🔄', title: '同一件事的兩種說法',
            text: '因為 12 ÷ 3 = 4 整除，所以：3 是 12 的因數，同時 12 是 3 的倍數。這兩句話講的是同一件事，只是從不同角度看。',
          },
          { type: 'text', text: '把下面每張卡片放進正確的籃子：' },
          {
            type: 'component',
            build: () => new SortBuckets({
              buckets: [
                { id: 'factor', label: '🔽 是 12 的因數' },
                { id: 'multiple', label: '🔼 是 12 的倍數' },
              ],
              items: [
                { text: '3', bucket: 'factor', why: '12 ÷ 3 = 4 整除，所以 3 是 12 的因數（3 比 12 小）。' },
                { text: '4', bucket: 'factor', why: '12 ÷ 4 = 3 整除，所以 4 是 12 的因數。' },
                { text: '6', bucket: 'factor', why: '12 ÷ 6 = 2 整除，所以 6 是 12 的因數。' },
                { text: '24', bucket: 'multiple', why: '24 ÷ 12 = 2 整除，所以 24 是 12 的倍數（24 比 12 大）。' },
                { text: '36', bucket: 'multiple', why: '36 ÷ 12 = 3 整除，所以 36 是 12 的倍數。' },
                { text: '60', bucket: 'multiple', why: '60 ÷ 12 = 5 整除，所以 60 是 12 的倍數。' },
              ],
            }),
          },
          {
            type: 'callout', icon: '⚠️', title: '兩個特別的數',
            text: '12 本身既是 12 的因數，也是 12 的倍數（12 ÷ 12 = 1）。另外 1 是所有數的因數，因為任何數除以 1 都整除。',
          },
        ],
      },

      /* ── 7. 概念檢查 ─────────────────────────── */
      {
        heading: '概念檢查',
        blocks: [
          { type: 'text', text: '六題小測驗。答錯會告訴你哪裡想錯了，可以再做一次。' },
          {
            type: 'component',
            build: () => new ChoiceQuiz({
              questions: [
                {
                  question: '下面哪一個數是 20 的因數？',
                  hint: '因數就是可以把 20 整除的數。',
                  options: ['3', '5', '7', '9'],
                  answer: 1,
                  explanation: '20 ÷ 5 = 4 整除，所以 5 是 20 的因數。20 ÷ 3、÷ 7、÷ 9 都會有餘數。',
                },
                {
                  question: '15 的因數總共有幾個？',
                  hint: '用配對法：1 和 15 一組、3 和 5 一組。',
                  options: ['2 個', '3 個', '4 個', '6 個'],
                  answer: 2,
                  explanation: '15 的因數是 1、3、5、15，共 4 個。用配對法找：(1,15) 和 (3,5) 兩組，剛好 4 個。',
                },
                {
                  question: '下面哪一個數是 7 的倍數？',
                  options: ['27', '34', '42', '51'],
                  answer: 2,
                  explanation: '42 ÷ 7 = 6 整除，所以 42 是 7 的倍數。7 × 6 = 42。',
                },
                {
                  question: '「8 是 4 的倍數」，這句話還可以怎麼說？',
                  hint: '同一件事的兩種說法。',
                  options: [
                    '4 是 8 的倍數',
                    '4 是 8 的因數',
                    '8 是 4 的因數',
                    '8 和 4 沒有關係',
                  ],
                  answer: 1,
                  explanation: '8 ÷ 4 = 2 整除。從大的看小的叫「因數」，所以 4 是 8 的因數；從小的看大的叫「倍數」，所以 8 是 4 的倍數。兩句話是同一件事。',
                },
                {
                  question: '一個數的因數和倍數，哪一個找得完？',
                  options: [
                    '因數找得完，倍數找不完',
                    '倍數找得完，因數找不完',
                    '兩個都找得完',
                    '兩個都找不完',
                  ],
                  answer: 0,
                  explanation: '因數不會超過這個數本身，所以有限、找得完。倍數可以一直乘下去，有無限多個。',
                },
                {
                  question: '24 個學生要平分成幾組，每組人數一樣多且不能剩人。下面哪一種分法「不行」？',
                  hint: '想想 24 的因數有哪些。',
                  options: ['分成 4 組', '分成 6 組', '分成 5 組', '分成 8 組'],
                  answer: 2,
                  explanation: '24 ÷ 5 = 4 剩 4，會剩下 4 個人，所以不行。5 不是 24 的因數。這就是為什麼因數在生活中有用——它回答「能不能剛好分完」。',
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
