/**
 * 五上 · 單元 1：折線圖（翰林版）
 * 2026-08-07
 *
 * 教學順序刻意設計成：先有生活情境的疑問 → 看見答案 → 認識工具 → 自己動手 → 檢查理解
 * 不先給定義。小孩要先感覺到「長條圖不好用」，才會理解折線圖存在的理由。
 */

'use strict';

(function () {
  const { El, LineChartBuilder, TapPairing, ChoiceQuiz, LabeledDiagram, CompareToggle } = window.G5;

  // 一天當中每 2 小時量一次的氣溫，貫穿整個單元的例子
  const HOURS = ['6點', '8點', '10點', '12點', '14點', '16點', '18點'];
  const TEMPS = [22, 24, 27, 30, 32, 29, 25];

  const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const RAIN = [8, 12, 20, 28, 34, 30];

  /** 畫一個唯讀的折線圖，當作示範圖用 */
  const staticChart = (labels, values, opts = {}) =>
    new LineChartBuilder({
      labels, target: values, initial: values,
      yMin: opts.yMin ?? 0, yMax: opts.yMax ?? 40, step: opts.step ?? 1,
      unit: opts.unit ?? '', readOnly: true,
    });

  /** 用 SVG 畫長條圖，只當對比用，不需要互動 */
  const barChart = (labels, values, max) => ({
    mount(container) {
      const wrap = El('div', { class: 'bar-chart' });
      labels.forEach((label, i) => {
        const h = (values[i] / max) * 100;
        wrap.append(
          El('div', { class: 'bar-col' },
            El('span', { class: 'bar-value' }, String(values[i])),
            El('div', { class: 'bar', style: `height:${h}%` }),
            El('span', { class: 'bar-label' }, label))
        );
      });
      container.append(wrap);
      return this;
    },
    destroy() {},
  });

  const unit = {
    id: 'g5-u01-linechart',
    grade: 5,
    semester: '上',
    order: 1,
    title: '單元 1　折線圖',
    subtitle: '看懂變化，也看懂趨勢',
    icon: '📈',
    estimatedMinutes: 25,
    objectives: [
      '知道折線圖適合用來看「隨時間的變化」',
      '認得折線圖的橫軸、縱軸、刻度、資料點、折線',
      '會從折線圖讀出某個時間點的數值',
      '會判斷上升、下降、持平，以及哪一段變化最大',
      '會自己把資料點放到正確位置，畫出折線圖',
    ],
    wrapUp: '接下來在單元 2 會學倍數與因數。折線圖之後在自然科的觀測紀錄也會一直用到，記得「看趨勢就用折線圖」。',

    sections: [
      /* ── 1. 情境導入 ───────────────────────────── */
      {
        heading: '一天當中，氣溫是怎麼變的？',
        blocks: [
          { type: 'text', text: '夏天的一天，從早上 6 點到傍晚 6 點，每隔 2 小時量一次氣溫，記錄成下面這張表。' },
          {
            type: 'component',
            build: () => ({
              mount(container) {
                const table = El('table', { class: 'data-table' });
                table.append(
                  El('tr', {}, El('th', {}, '時間'), ...HOURS.map((h) => El('th', {}, h))),
                  El('tr', {}, El('th', {}, '氣溫(℃)'), ...TEMPS.map((t) => El('td', {}, String(t))))
                );
                container.append(table);
                return this;
              },
              destroy() {},
            }),
          },
          {
            type: 'callout', icon: '🤔', title: '想一想',
            text: '看這張表，你能馬上說出「氣溫一直在升高嗎？」「哪一段升得最快？」嗎？數字排在一起，其實不太好看出來。',
          },
        ],
      },

      /* ── 2. 長條圖 vs 折線圖 ────────────────────── */
      {
        heading: '同樣的資料，換兩種畫法看看',
        blocks: [
          { type: 'text', text: '下面兩個按鈕，切換看看同一組氣溫資料畫成長條圖和折線圖有什麼不一樣。' },
          {
            type: 'component',
            build: () => new CompareToggle({
              options: [
                {
                  label: '📊 長條圖',
                  note: '長條圖很適合「比高低」：一眼就知道 14 點最熱。但要看「怎麼變的」就沒那麼直接。',
                  render: (body) => barChart(HOURS, TEMPS, 40).mount(body),
                },
                {
                  label: '📈 折線圖',
                  note: '折線把每個點連起來，「先升高、到 14 點最高、然後下降」的過程一看就懂。這就是折線圖的強項。',
                  render: (body) => staticChart(HOURS, TEMPS, { yMax: 40, unit: '' }).mount(body),
                },
              ],
            }),
          },
          {
            type: 'callout', icon: '🔑', title: '關鍵差別',
            text: '長條圖看「誰比較多」，折線圖看「怎麼變化」。資料跟時間有關的時候，用折線圖。',
          },
        ],
      },

      /* ── 3. 認識各部位 ──────────────────────────── */
      {
        heading: '折線圖是由哪些部分組成的？',
        blocks: [
          { type: 'text', text: '點點看下面每個名稱，認識折線圖的各個部位。' },
          {
            type: 'component',
            build: () => staticChart(HOURS, TEMPS, { yMax: 40 }),
          },
          {
            type: 'component',
            build: () => new LabeledDiagram({
              caption: '點下面任何一個部位，看它的說明',
              parts: [
                { icon: '↔️', name: '橫軸（X 軸）', description: '橫著的那條線，通常放「時間」——這張圖上是 6 點、8 點、10 點……' },
                { icon: '↕️', name: '縱軸（Y 軸）', description: '直著的那條線，放我們要測量的東西——這張圖上是氣溫，單位是 ℃。' },
                { icon: '📏', name: '刻度', description: '軸上等距離的數字。刻度一定要「等距」，不然圖會騙人：同樣一格代表的量必須一樣多。' },
                { icon: '⚫', name: '資料點', description: '每一筆資料的位置。往下對到橫軸看時間，往左對到縱軸看數值。' },
                { icon: '📈', name: '折線', description: '把相鄰的資料點連起來的線。線往上代表增加，往下代表減少，越陡代表變化越大。' },
              ],
            }),
          },
        ],
      },

      /* ── 4. 讀圖練習 ────────────────────────────── */
      {
        heading: '練習：從圖上把數字讀出來',
        blocks: [
          { type: 'text', text: '這是某地 1 月到 6 月的下雨天數。先看圖，再回答下面的問題。' },
          { type: 'component', build: () => staticChart(MONTHS, RAIN, { yMax: 40 }) },
          {
            type: 'component',
            build: () => new ChoiceQuiz({
              questions: [
                {
                  question: '3 月有幾天下雨？',
                  hint: '找到橫軸的「3月」，往上看到資料點，再往左對到縱軸。',
                  options: ['12 天', '20 天', '28 天', '34 天'],
                  answer: 1,
                  explanation: '3 月的資料點對到縱軸是 20，所以是 20 天。',
                },
                {
                  question: '哪一個月下雨天數最多？',
                  hint: '找位置最高的那個點。',
                  options: ['3月', '4月', '5月', '6月'],
                  answer: 2,
                  explanation: '5 月的點最高，是 34 天。折線圖看最高點很直接，這就是它方便的地方。',
                },
                {
                  question: '從 5 月到 6 月，下雨天數是增加還是減少？',
                  hint: '看這兩點之間的線是往上還是往下。',
                  options: ['增加', '減少', '沒有變', '看不出來'],
                  answer: 1,
                  explanation: '5 月是 34 天、6 月是 30 天，線往下走，所以是減少了 4 天。',
                },
              ],
            }),
          },
        ],
      },

      /* ── 5. 趨勢與變化量 ────────────────────────── */
      {
        heading: '哪一段變化最大？',
        blocks: [
          {
            type: 'text',
            text: '折線的「陡不陡」就代表變化的大小。線越斜，那段時間變化越多；線越平，變化越少。',
          },
          { type: 'component', build: () => staticChart(MONTHS, RAIN, { yMax: 40 }) },
          {
            type: 'component',
            build: () => new TapPairing({
              left: [
                { id: 'a', text: '1月 → 2月' },
                { id: 'b', text: '3月 → 4月' },
                { id: 'c', text: '5月 → 6月' },
              ],
              right: [
                { id: 'a', text: '增加 4 天' },
                { id: 'b', text: '增加 8 天' },
                { id: 'c', text: '減少 4 天' },
              ],
              pairs: { a: 'a', b: 'b', c: 'c' },
            }),
          },
          {
            type: 'callout', icon: '📐', title: '算變化量',
            text: '用後面的數減前面的數。結果是正的就是增加，負的就是減少。例如 3 月 20 天、4 月 28 天，28 − 20 = 8，增加 8 天。',
          },
        ],
      },

      /* ── 6. 動手畫 ──────────────────────────────── */
      {
        heading: '換你畫：把點放到正確的位置',
        blocks: [
          {
            type: 'text',
            text: '下面是空白的折線圖。用手指把每個圓點拖到正確的高度（拖不動的話，先點一下圓點，再用下面的 ＋ − 按鈕調整）。',
          },
          {
            type: 'component',
            build: () => {
              const chart = new LineChartBuilder({
                labels: HOURS,
                target: TEMPS,
                initial: HOURS.map(() => 20),
                yMin: 20, yMax: 34, step: 1, unit: '℃',
                onSolved: () => {
                  const el = document.querySelector('.builder-status');
                  if (el) el.textContent = '🎉 全部放對了！這就是一天的氣溫變化。';
                },
              });
              return {
                mount(container) {
                  chart.mount(container);
                  const controls = El('div', { class: 'builder-controls' },
                    El('button', { class: 'btn btn--round', type: 'button', onClick: () => chart.nudge(-1) }, '−'),
                    El('span', { class: 'builder-status' }, '目標：6點22℃、8點24℃、10點27℃、12點30℃、14點32℃、16點29℃、18點25℃'),
                    El('button', { class: 'btn btn--round', type: 'button', onClick: () => chart.nudge(1) }, '＋')
                  );
                  container.append(controls);
                  return this;
                },
                destroy() { chart.destroy(); },
              };
            },
          },
          {
            type: 'callout', icon: '✅', title: '畫折線圖的步驟',
            text: '① 決定橫軸放什麼、縱軸放什麼　② 看資料的最大最小值，決定刻度範圍　③ 一個一個標出資料點　④ 把相鄰的點連起來。',
          },
        ],
      },

      /* ── 7. 綜合檢查 ────────────────────────────── */
      {
        heading: '概念檢查',
        blocks: [
          { type: 'text', text: '五題小測驗，確認這個單元的概念都懂了。答錯也沒關係，會告訴你為什麼。' },
          {
            type: 'component',
            build: () => new ChoiceQuiz({
              questions: [
                {
                  question: '下面哪一種資料最適合用折線圖？',
                  options: [
                    '全班每個人的身高',
                    '一週七天每天的最高溫',
                    '班上同學最喜歡的水果種類',
                    '三個班級的人數',
                  ],
                  answer: 1,
                  explanation: '折線圖用來看「隨時間的變化」。一週七天的溫度跟時間有關，適合折線圖；比較不同人或不同種類，用長條圖比較好。',
                },
                {
                  question: '折線圖上，線往右上方走代表什麼？',
                  options: ['數值減少', '數值增加', '數值沒變', '資料錯誤'],
                  answer: 1,
                  explanation: '往上代表數值變大，也就是增加；往下代表減少；水平代表沒變。',
                },
                {
                  question: '兩個點之間的線特別陡，代表？',
                  options: ['那段時間變化特別大', '那段時間變化特別小', '那段沒有資料', '圖畫錯了'],
                  answer: 0,
                  explanation: '線的陡峭程度代表變化量。越陡表示在同樣的時間內變化越多。',
                },
                {
                  question: '畫折線圖時，縱軸的刻度要注意什麼？',
                  options: ['數字越大越好', '每一格代表的量要一樣', '一定要從 0 開始', '可以隨便標'],
                  answer: 1,
                  explanation: '刻度必須等距，每一格代表同樣的量，圖才不會誤導人。（從 0 開始不是硬性規定，但不從 0 開始時要看清楚刻度。）',
                },
                {
                  question: '某天氣溫：早上 8 點 24℃、中午 12 點 30℃。這段時間的變化量是多少？',
                  options: ['增加 6℃', '減少 6℃', '增加 54℃', '增加 4℃'],
                  answer: 0,
                  explanation: '用後面減前面：30 − 24 = 6，結果是正的，所以是增加 6℃。',
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
