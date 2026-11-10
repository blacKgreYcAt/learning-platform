/* 引導式教學 — 數學 五年級下學期．康軒版（2026-11-10）
 *
 * 單元怎麼來的，跟題庫檔一樣（詳細理由寫在 quest/data/math-5b-kang-20261110.js 檔頭）：
 * 網路上找不到康軒五下數學的目錄，所以取翰林和南一「兩版都放五下」的主題，
 * 再扣掉康軒五上已經教過的（小數乘法、容積與容量、線對稱）。
 * 主題應該是對的，編號待課本目錄確認。
 *
 * VolumeStack 是 11/09 寫的堆積木元件，原本給五上立體形體用，
 * 這裡拿來讓小孩自己堆出「長乘寬乘高」—— 公式不是背的，是數出來的。
 */
'use strict';

(function () {
  var G5 = window.G5;
  var TapPairing = G5.TapPairing, ChoiceQuiz = G5.ChoiceQuiz,
      LabeledDiagram = G5.LabeledDiagram, CompareToggle = G5.CompareToggle,
      SortBuckets = G5.SortBuckets, VolumeStack = G5.VolumeStack;

  /* ══════════════ 單元 1：分數的乘法與除法 ══════════════ */
  var frac = {
    id: 'k5b-math-frac', grade: 5, semester: 2, order: 1,
    title: '單元 1　分數的乘法與除法',
    subtitle: '乘不一定變大，除不一定變小 —— 先弄懂為什麼',
    icon: '🍰', estimatedMinutes: 26,
    objectives: [
      '說得出分數乘分數為什麼是「分子乘分子、分母乘分母」',
      '知道乘以小於 1 的數會變小，除以小於 1 的數會變大，並解釋原因',
      '會用倒數把分數除法改成乘法',
      '拿到應用題時，先判斷答案該變大還是變小，再決定用乘還是用除',
    ],
    wrapUp: '這個單元最值錢的一句話是：先想答案該變大還是變小。' +
      '想清楚了，乘和除就不會搞混；想不清楚，公式背得再熟也會選錯。',
    sections: [

      { heading: '分數乘分數：為什麼分母要相乘', blocks: [
        { type: 'text', text: '先別急著套公式。想一塊蛋糕：二分之一 的 三分之一 是多少？' },
        { type: 'text', text: '先把蛋糕切成兩半，拿一半。再把那一半切成三份，拿一份。' +
          '這一塊相當於原本整塊蛋糕的幾分之幾？整塊被切成了 2 乘 3 等於 6 份，你拿了 1 份。' +
          '所以答案是 六分之一。' },
        { type: 'callout', title: '所以公式就是這樣來的', text:
          '分母相乘 = 整體被切成幾份（先切 2 刀方向，再切 3 刀方向）。\n' +
          '分子相乘 = 你拿到幾份。\n' +
          '不是規定要這樣算，是算出來本來就是這樣。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '四分之三 乘 五分之二 等於多少？',
                options: ['十分之三', '二十分之五', '九分之四'],
                answer: 0,
                explanation: '分子 3 乘 2 等於 6，分母 4 乘 5 等於 20，二十分之六 約分成 十分之三。' },
              { question: '三分之二 乘 6 等於多少？',
                options: ['4', '12', '3'],
                answer: 0,
                explanation: '整數可以看成 一分之六。分子 2 乘 6 等於 12，分母還是 3，答案 4。' },
              { question: '一盒巧克力有 12 顆，吃掉 四分之一，吃了幾顆？',
                options: ['3 顆', '4 顆', '6 顆'],
                answer: 0,
                explanation: '「某數的幾分之幾」就是乘法。12 乘 四分之一 等於 3。' },
              { question: '做分數乘法時，什麼時候約分最省力？',
                options: ['乘之前先把分子分母的公因數約掉', '一定要乘完才能約', '不可以約分'],
                answer: 0,
                explanation: '先約，數字變小，後面的乘法不容易算錯。這是考試省時間的關鍵。' },
            ],
          });
        } },
      ]},

      { heading: '乘法會變大嗎？看那個數跟 1 比', blocks: [
        { type: 'text', text: '很多人卡在這裡：明明是乘法，答案怎麼變小了？' +
          '問題出在一個舊的印象 —— 「乘就是變大」。那只在乘大於 1 的數時成立。' },
        { type: 'component', build: function () {
          return new CompareToggle({
            options: [
              { label: '乘以大於 1 的數 → 變大', note:
                '6 乘 2 等於 12。6 乘 二分之三 等於 9。\n' +
                '因為你拿到的「超過一份」，所以變多。' },
              { label: '乘以 1 → 不變', note:
                '6 乘 1 等於 6。六分之六 也是 1，乘它也不變。\n' +
                '1 就是分界線。' },
              { label: '乘以小於 1 的數 → 變小', note:
                '6 乘 二分之一 等於 3。二分之一 乘 二分之一 等於 四分之一。\n' +
                '因為你只拿到「一份的一部分」，所以變少。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'up', label: '答案會變大' },
              { id: 'same', label: '答案不變' },
              { id: 'down', label: '答案會變小' },
            ],
            items: [
              { text: '8 乘 二分之三', bucket: 'up', why: '二分之三 等於 1.5，比 1 大，所以變大。' },
              { text: '8 乘 4', bucket: 'up', why: '乘大於 1 的整數，一定變大。' },
              { text: '8 乘 1', bucket: 'same', why: '乘 1 什麼都不動。' },
              { text: '8 乘 五分之五', bucket: 'same', why: '五分之五 就是 1。看到分子分母相同要先反應過來。' },
              { text: '8 乘 四分之三', bucket: 'down', why: '四分之三 比 1 小，所以變小。' },
              { text: '8 乘 0.2', bucket: 'down', why: '0.2 比 1 小，一樣會變小。' },
            ],
          });
        } },
      ]},

      { heading: '分數除法：倒數是怎麼回事', blocks: [
        { type: 'text', text: '規則很短：除以一個數，等於乘它的倒數。' +
          '倒數就是分子分母交換。那為什麼可以這樣？' },
        { type: 'text', text: '想一個問題：二分之一 裡面可以放進幾個 四分之一？' +
          '畫出來看，答案是 2 個。而 二分之一 乘 4 也正好是 2。' +
          '「裡面有幾個」這件事，用乘倒數算出來的結果一模一樣。' },
        { type: 'component', build: function () {
          return new TapPairing({
            left: [
              { id: 'r1', text: '三分之二 的倒數' },
              { id: 'r2', text: '5 的倒數' },
              { id: 'r3', text: '1 的倒數' },
              { id: 'r4', text: '八分之一 的倒數' },
              { id: 'r5', text: '0 的倒數' },
            ],
            right: [
              { id: 's1', text: '二分之三' },
              { id: 's2', text: '五分之一' },
              { id: 's3', text: '1' },
              { id: 's4', text: '8' },
              { id: 's5', text: '沒有倒數' },
            ],
            pairs: { r1: 's1', r2: 's2', r3: 's3', r4: 's4', r5: 's5' },
          });
        } },
        { type: 'callout', title: '兩個要記住的特例', text:
          '1 的倒數是 1（因為 1 乘 1 等於 1）。\n' +
          '0 沒有倒數（因為沒有任何數乘 0 可以等於 1）。\n' +
          '整數的倒數就是 1 除以它：5 的倒數是 五分之一。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '6 除以 三分之二 等於多少？',
                options: ['9', '4', '三分之四'],
                answer: 0,
                explanation: '6 乘 二分之三 等於 9。意思是：6 裡面有 9 個 三分之二。' },
              { question: '四分之三 除以 3 等於多少？',
                options: ['四分之一', '四分之九', '12'],
                answer: 0,
                explanation: '除以 3 等於乘 三分之一。四分之三 乘 三分之一 等於 十二分之三，約成 四分之一。' },
              { question: '為什麼除以一個比 1 小的數，答案會變大？',
                options: ['每一份變小了，所以可以分出更多份', '因為除法一定變大', '因為算錯了'],
                answer: 0,
                explanation: '一條繩子每段剪短一點，段數當然變多。除以小於 1 的數就是這個意思。' },
              { question: '除以 二分之一 和乘以 2，結果一樣嗎？',
                options: ['一樣', '不一樣', '看數字大小'],
                answer: 0,
                explanation: '二分之一 的倒數正好是 2，所以兩種算法完全等價。' },
            ],
          });
        } },
      ]},

      { heading: '應用題：先判斷大小，再選運算', blocks: [
        { type: 'text', text: '應用題最常錯的不是計算，是選錯運算。' +
          '有一招很好用：先問自己「答案應該比原來大還是小？」' },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'mul', label: '用乘法' },
              { id: 'div', label: '用除法' },
              { id: 'sub', label: '用減法' },
            ],
            items: [
              { text: '一塊地 三分之二 公頃，其中 四分之三 種菜，種菜多少公頃？', bucket: 'mul',
                why: '「其中的幾分之幾」是取一部分 → 乘法，答案會變小。' },
              { text: '一桶水 五分之四 公升，倒掉一半，剩下幾公升？', bucket: 'mul',
                why: '剩下的是原來的 二分之一 → 乘法。' },
              { text: '三分之二 公斤的糖平分給 4 個人，每人幾公斤？', bucket: 'div',
                why: '「平分給」是除法。' },
              { text: '一杯果汁 三分之一 公升，要裝滿 2 公升需要幾杯？', bucket: 'div',
                why: '問「裡面有幾個」是除法，答案會變大。' },
              { text: '一根鐵絲 六分之五 公尺，用掉 三分之一 公尺，剩下幾公尺？', bucket: 'sub',
                why: '陷阱題。「用掉幾公尺」是具體的量，不是比例，所以是減法。' },
            ],
          });
        } },
        { type: 'callout', title: '兩個關鍵字', text:
          '「某數的幾分之幾」、「其中的幾分之幾」→ 乘法。\n' +
          '「平均分成」、「每一份多少」、「裡面有幾個」→ 除法。\n' +
          '「用掉幾公尺」、「少了幾公斤」（帶單位的具體量）→ 減法，不是乘除。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '一本書 120 頁，第一天看 四分之一，第二天看「剩下的」三分之一，第二天看幾頁？',
                options: ['30 頁', '40 頁', '10 頁'],
                answer: 0,
                explanation: '第一天 30 頁，剩 90 頁。90 乘 三分之一 等於 30 頁。' +
                  '關鍵是「剩下的」換了基準量，不能拿 120 去乘。' },
              { question: '小明有 四分之三 小時寫功課，平均分給 3 科，每科幾小時？',
                options: ['四分之一 小時', '四分之九 小時', '2 小時'],
                answer: 0,
                explanation: '四分之三 除以 3 等於 四分之一 小時，也就是 15 分鐘。' },
              { question: '不確定該乘還是該除，最可靠的檢查方法是什麼？',
                options: ['先想答案應該變大還是變小', '一律用乘法', '隨便選一個試'],
                answer: 0,
                explanation: '取一部分 → 變小 → 乘小於 1 的數。問裡面有幾個 → 變大 → 除小於 1 的數。' },
              { question: '算完之後最值得做的一件事是什麼？',
                options: ['看答案的大小合不合理', '把式子重寫一遍', '不用檢查'],
                answer: 0,
                explanation: '「一塊地的一部分」算出來比整塊地還大，一定錯了。這種檢查三秒鐘就能做。' },
            ],
          });
        } },
      ]},
    ],
  };

  /* ══════════════ 單元 2：小數的除法 ══════════════ */
  var dec = {
    id: 'k5b-math-decdiv', grade: 5, semester: 2, order: 2,
    title: '單元 2　小數的除法',
    subtitle: '小數點該放哪裡，以及為什麼可以兩邊一起移',
    icon: '🔸', estimatedMinutes: 22,
    objectives: [
      '小數除以整數時，知道商的小數點要對齊被除數',
      '小數除以小數時，會先把除數變成整數',
      '解釋得出為什麼除數和被除數同時乘 10，答案不會變',
      '知道除以小於 1 的數為什麼答案會變大',
    ],
    wrapUp: '小數除法只有兩個動作：把除數變整數，然後小數點對齊。' +
      '為什麼可以把除數變整數？因為除法就是分數，上下同乘一個數，值不變。' +
      '懂了這一句，就不用記一堆口訣。',
    sections: [

      { heading: '小數除以整數：小數點對齊', blocks: [
        { type: 'text', text: '6.4 除以 2。先不管小數點，當成 64 除以 2 等於 32。' +
          '然後把小數點對齊回來 —— 被除數的小數點在哪，商的小數點就在正上方。答案 3.2。' },
        { type: 'callout', title: '兩個常見的坑', text:
          '坑一：整數部分不夠除的時候，商的個位要先寫 0。\n' +
          '　　　1.2 除以 4，個位 1 除不了 4，所以答案是 0.3 不是 3。\n' +
          '坑二：除不盡的時候，在被除數後面補 0 繼續除。\n' +
          '　　　9 除以 4，補 0 變成 90、100，算出 2.25。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '7.5 除以 5 等於多少？',
                options: ['1.5', '15', '0.15'],
                answer: 0,
                explanation: '75 除以 5 等於 15，對回小數點是 1.5。' },
              { question: '1.2 除以 4 等於多少？',
                options: ['0.3', '3', '0.03'],
                answer: 0,
                explanation: '個位不夠除，所以商的個位寫 0，答案 0.3。' },
              { question: '9 除以 4 等於多少？',
                options: ['2.25', '2.5', '2.4'],
                answer: 0,
                explanation: '除不盡時補 0 繼續除。4 乘 2.25 等於 9，可以回頭驗算。' },
              { question: '0.36 除以 6 等於多少？',
                options: ['0.06', '0.6', '6'],
                answer: 0,
                explanation: '36 除以 6 等於 6，小數點往回對兩位，答案 0.06。' },
            ],
          });
        } },
      ]},

      { heading: '小數除以小數：先把除數變整數', blocks: [
        { type: 'text', text: '1.2 除以 0.4 要怎麼算？除數有小數點很麻煩，' +
          '所以第一步：把 0.4 乘 10 變成 4。' },
        { type: 'text', text: '但是只動除數不行 —— 被除數也要乘 10，變成 12。' +
          '於是 12 除以 4 等於 3。' },
        { type: 'callout', title: '為什麼兩邊一起乘，答案不會變', text:
          '因為除法就是分數。1.2 除以 0.4 可以寫成「0.4 分之 1.2」。\n' +
          '分子分母同乘 10，變成「4 分之 12」—— 值完全沒變，只是比較好算。\n' +
          '這不是規定，是分數的基本性質。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '6 除以 0.5 等於多少？',
                options: ['12', '3', '1.2'],
                answer: 0,
                explanation: '兩邊都乘 10 變成 60 除以 5 等於 12。意思是 6 裡面有 12 個 0.5。' },
              { question: '7.2 除以 0.9 等於多少？',
                options: ['8', '0.8', '80'],
                answer: 0,
                explanation: '兩邊都乘 10 變成 72 除以 9 等於 8。' },
              { question: '2.4 除以 0.8 等於多少？',
                options: ['3', '0.3', '30'],
                answer: 0,
                explanation: '兩邊都乘 10 變成 24 除以 8 等於 3。' },
              { question: '小數除以小數的第一步是什麼？',
                options: ['把除數的小數點移到最後，被除數移動一樣多位', '只把被除數變整數', '直接相除'],
                answer: 0,
                explanation: '一定要兩邊移一樣多位。只移一邊答案就錯了。' },
            ],
          });
        } },
      ]},

      { heading: '除以小於 1 的數，答案為什麼變大', blocks: [
        { type: 'text', text: '6 除以 0.5 等於 12 —— 除完比原來還大，很多人會以為算錯。' +
          '其實這才是對的。' },
        { type: 'text', text: '把它讀成一句話：「6 裡面有幾個 0.5？」' +
          '每一份只有 0.5 那麼小，當然可以分出很多份。12 份。' },
        { type: 'component', build: function () {
          return new CompareToggle({
            options: [
              { label: '除以大於 1 的數 → 變小', note:
                '6 除以 2 等於 3。每一份比較大，所以份數比 6 少。' },
              { label: '除以 1 → 不變', note:
                '6 除以 1 等於 6。1 永遠是分界線。' },
              { label: '除以小於 1 的數 → 變大', note:
                '6 除以 0.5 等於 12。6 除以 0.1 等於 60。\n' +
                '每一份越小，份數就越多。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'big', label: '答案比 10 大' },
              { id: 'small', label: '答案比 10 小' },
            ],
            items: [
              { text: '10 除以 0.5', bucket: 'big', why: '除以小於 1 的數，答案變大（等於 20）。' },
              { text: '10 除以 0.2', bucket: 'big', why: '除數更小，答案更大（等於 50）。' },
              { text: '10 除以 0.1', bucket: 'big', why: '除以 0.1 跟乘以 10 一樣（等於 100）。' },
              { text: '10 除以 2', bucket: 'small', why: '除以大於 1 的數，答案變小（等於 5）。' },
              { text: '10 除以 4', bucket: 'small', why: '等於 2.5。' },
              { text: '10 除以 1.25', bucket: 'small', why: '1.25 比 1 大，所以答案比 10 小（等於 8）。' },
            ],
          });
        } },
        { type: 'callout', title: '一個三秒鐘的檢查', text:
          '算完之後，看一眼除數跟 1 比大還是小，再看自己的答案是變大還是變小。\n' +
          '方向對不上，一定有地方算錯了。這招對小數和分數都有效。' },
      ]},

      { heading: '小數除法在生活裡做什麼', blocks: [
        { type: 'text', text: '小數除法最常用的地方是比價：哪一包比較划算？' +
          '光看價錢沒有用，要算「一單位多少錢」。' },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'divv', label: '要用除法' },
              { id: 'mulv', label: '要用乘法' },
            ],
            items: [
              { text: '3 瓶果汁 4.5 公升，每瓶幾公升？', bucket: 'divv',
                why: '總量除以瓶數，問的是「每一份」。' },
              { text: '一包 2.5 公斤賣 125 元，每公斤多少錢？', bucket: 'divv',
                why: '總價除以重量，問的是「單價」。' },
              { text: '4.5 公尺的繩子每 1.5 公尺剪一段，剪幾段？', bucket: 'divv',
                why: '問「裡面有幾個」，也是除法。' },
              { text: '每公斤 50 元，買 2.5 公斤要多少錢？', bucket: 'mulv',
                why: '已知單價求總價，是乘法。' },
              { text: '每瓶 1.5 公升，3 瓶共幾公升？', bucket: 'mulv',
                why: '已知每一份求總量，是乘法。' },
            ],
          });
        } },
        { type: 'callout', title: '比價的標準動作', text:
          '把兩包都換算成「每 100 公克多少錢」或「每公斤多少錢」，再比。\n' +
          '例：A 包 2.5 公斤賣 125 元 → 125 除以 2.5 等於每公斤 50 元。\n' +
          '　　B 包 1.8 公斤賣 99 元 → 99 除以 1.8 等於每公斤 55 元。\n' +
          'A 包便宜。注意 B 包的標價比較低，但其實比較貴 —— 這就是為什麼要算單價。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '一包 2.5 公斤的米賣 125 元，每公斤多少錢？',
                options: ['50 元', '312.5 元', '5 元'],
                answer: 0,
                explanation: '125 除以 2.5：兩邊乘 10 變成 1250 除以 25 等於 50 元。' },
              { question: '一條 4.5 公尺的繩子，每 1.5 公尺剪一段，可以剪幾段？',
                options: ['3 段', '6 段', '3.5 段'],
                answer: 0,
                explanation: '4.5 除以 1.5 等於 3 段。' },
              { question: '比價的時候為什麼要算成「每一公斤多少錢」？',
                options: ['因為包裝重量不同，只有換成同一個基準才比得出來', '因為比較好看', '因為老師說的'],
                answer: 0,
                explanation: '這跟後面要學的比率是同一個道理：基準統一了才能比較。' },
              { question: '除不盡的時候應該怎麼辦？',
                options: ['照題目要求四捨五入到指定位數', '隨便停', '寫除不盡'],
                answer: 0,
                explanation: '要多除一位才判斷得出該捨還是該進。比價題通常算到小數第一或第二位就夠了。' },
            ],
          });
        } },
      ]},
    ],
  };

  /* ══════════════ 單元 3：體積與生活中的大單位 ══════════════ */
  var vol = {
    id: 'k5b-math-volume', grade: 5, semester: 2, order: 3,
    title: '單元 3　體積與生活中的大單位',
    subtitle: '長乘寬乘高不是背的，是數出來的',
    icon: '🧊', estimatedMinutes: 25,
    objectives: [
      '用堆積木解釋長方體的體積公式為什麼是長乘寬乘高',
      '分得出體積、容積和表面積問的是不同的東西',
      '會換算立方公分、毫升、公升，也知道立方公尺為什麼差一百萬倍',
      '說得出公里、公噸、公頃這些大單位各自管什麼',
    ],
    wrapUp: '這個單元有一個貫穿的道理：換算要看「幾個方向」。' +
      '長度換一次，面積換兩次，體積換三次。' +
      '1 公尺等於 100 公分，但是 1 立方公尺等於一百萬立方公分 —— 就是這個原因。',
    sections: [

      { heading: '自己堆一個長方體', blocks: [
        { type: 'text', text: '先別看公式。下面可以用小積木堆出一個長方體，' +
          '每一塊積木就是 1 立方公分。堆完之後數一數總共用了幾塊。' },
        { type: 'component', build: function () {
          return new VolumeStack({ L: 4, W: 3, H: 3, max: 5 });
        } },
        { type: 'callout', title: '公式是數出來的', text:
          '底面排了「長乘寬」塊積木。這樣的一層，疊「高」層。\n' +
          '所以總共是 長乘寬乘高 塊 —— 這就是體積公式。\n' +
          '它不是誰規定的，是數積木數出來的結果。' },
        { type: 'text', text: '正方體的長寬高都一樣，所以公式變成「邊長乘邊長乘邊長」。' +
          '另外還有一個更通用的寫法：底面積乘高。這個公式連圓柱都適用。' },
      ]},

      { heading: '體積、容積、表面積：問的是三件事', blocks: [
        { type: 'text', text: '這三個很容易混，但是它們回答的問題完全不同。' },
        { type: 'component', build: function () {
          return new LabeledDiagram({
            caption: '先認出題目在問哪一個，公式才用得對',
            parts: [
              { icon: '🧊', name: '體積',
                description: '這個物體自己占了多少空間？\n' +
                  '公式：長乘寬乘高，或底面積乘高。單位：立方公分、立方公尺。' },
              { icon: '🥤', name: '容積',
                description: '這個容器裡面裝得下多少？\n' +
                  '算法跟體積一樣，但是長寬高要量「內側」。' +
                  '一個厚壁的杯子，容積會比體積小。單位常用毫升、公升。' },
              { icon: '🎁', name: '表面積',
                description: '要用多少紙才包得住它？\n' +
                  '把六個面的面積加起來。單位：平方公分（不是立方）。' +
                  '包禮物算表面積，裝東西算體積。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'v', label: '要算體積' },
              { id: 'c', label: '要算容積' },
              { id: 's', label: '要算表面積' },
            ],
            items: [
              { text: '一塊木頭占多少空間？', bucket: 'v', why: '問物體本身占的空間，是體積。' },
              { text: '這個鐵塊丟進水裡會讓水面上升多少？', bucket: 'v', why: '排開的水等於鐵塊的體積。' },
              { text: '這個水壺可以裝幾公升的水？', bucket: 'c', why: '問裝得下多少，是容積，要量內側。' },
              { text: '這個魚缸最多能放多少水？', bucket: 'c', why: '也是容積。' },
              { text: '包這個禮物盒要多少包裝紙？', bucket: 's', why: '包住外面，是表面積。' },
              { text: '這個箱子要漆多少油漆？', bucket: 's', why: '漆的是外皮，所以是表面積。' },
            ],
          });
        } },
      ]},

      { heading: '單位換算：看幾個方向', blocks: [
        { type: 'text', text: '最好用的一條橋：1 立方公分 就等於 1 毫升。' +
          '記住這一條，體積和容積就接起來了。' },
        { type: 'component', build: function () {
          return new TapPairing({
            left: [
              { id: 'u1', text: '1 立方公分' },
              { id: 'u2', text: '1 公升' },
              { id: 'u3', text: '1 立方公尺' },
              { id: 'u4', text: '1 平方公尺' },
              { id: 'u5', text: '1 公尺' },
            ],
            right: [
              { id: 'w1', text: '1 毫升' },
              { id: 'w2', text: '1000 立方公分' },
              { id: 'w3', text: '一百萬 立方公分' },
              { id: 'w4', text: '一萬 平方公分' },
              { id: 'w5', text: '100 公分' },
            ],
            pairs: { u1: 'w1', u2: 'w2', u3: 'w3', u4: 'w4', u5: 'w5' },
          });
        } },
        { type: 'callout', title: '為什麼差那麼多倍', text:
          '1 公尺等於 100 公分 —— 這是長度，換一次。\n' +
          '1 平方公尺等於 100 乘 100 等於一萬 平方公分 —— 面積，換兩次。\n' +
          '1 立方公尺等於 100 乘 100 乘 100 等於一百萬 立方公分 —— 體積，換三次。\n' +
          '所以單位換算不要死背數字，看它是幾個方向就好。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '一個長 10 公分、寬 10 公分、高 10 公分的盒子，可以裝幾公升水？',
                options: ['1 公升', '10 公升', '100 公升'],
                answer: 0,
                explanation: '體積 1000 立方公分，等於 1000 毫升，等於 1 公升。' },
              { question: '2.5 公升等於幾毫升？',
                options: ['2500 毫升', '250 毫升', '25 毫升'],
                answer: 0,
                explanation: '乘 1000，小數點往右移三位。' },
              { question: '計算容積的時候，長寬高要量哪裡？',
                options: ['容器的內部', '容器的外部', '隨便'],
                answer: 0,
                explanation: '容積問的是裝得下多少，所以量內側。這是容積題最常被扣分的地方。' },
              { question: '長、寬、高都變成 2 倍，體積會變成幾倍？',
                options: ['8 倍', '2 倍', '6 倍'],
                answer: 0,
                explanation: '2 乘 2 乘 2 等於 8。三個方向都變 2 倍，所以是 8 倍，不是 6 倍。' },
            ],
          });
        } },
      ]},

      { heading: '生活中的大單位', blocks: [
        { type: 'text', text: '數字太長不好讀也不好比較，所以才需要大單位。' +
          '「2300 萬人」比「23000000 人」好懂太多了。' },
        { type: 'component', build: function () {
          return new TapPairing({
            left: [
              { id: 'b1', text: '1 公里' },
              { id: 'b2', text: '1 公噸' },
              { id: 'b3', text: '1 公頃' },
              { id: 'b4', text: '1 億' },
            ],
            right: [
              { id: 'e1', text: '1000 公尺（量距離）' },
              { id: 'e2', text: '1000 公斤（量很重的東西）' },
              { id: 'e3', text: '一萬 平方公尺（量土地）' },
              { id: 'e4', text: '一萬個一萬（量很大的數）' },
            ],
            pairs: { b1: 'e1', b2: 'e2', b3: 'e3', b4: 'e4' },
          });
        } },
        { type: 'callout', title: '中文的大數是四位一節', text:
          '個、十、百、千，然後進到「萬」。\n' +
          '萬、十萬、百萬、千萬，然後進到「億」。\n' +
          '所以讀大數要從右邊每四位切一刀。英文是三位一節，兩套切法不一樣，' +
          '這就是為什麼看英文新聞的數字常常要換算。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '1 公頃等於幾平方公尺？',
                options: ['一萬 平方公尺', '1000 平方公尺', '100 平方公尺'],
                answer: 0,
                explanation: '1 公頃就是邊長 100 公尺的正方形，100 乘 100 等於一萬。' },
              { question: '3 公里 500 公尺等於幾公尺？',
                options: ['3500 公尺', '350 公尺', '3005 公尺'],
                answer: 0,
                explanation: '3 公里是 3000 公尺，加上 500 公尺。' },
              { question: '臺灣人口大約 2300 萬，換成「億」大約是多少？',
                options: ['0.23 億', '2.3 億', '23 億'],
                answer: 0,
                explanation: '1 億等於一萬萬，2300 萬除以一萬萬等於 0.23 億。' },
              { question: '為什麼要有大單位？',
                options: ['數字太長不好讀也不好比較', '為了讓題目變難', '沒什麼原因'],
                answer: 0,
                explanation: '單位是為了讓數字落在好讀的範圍。所以量螞蟻用毫米，量國土用平方公里。' },
            ],
          });
        } },
      ]},
    ],
  };

  /* ══════════════ 單元 4：比率與百分率 ══════════════ */
  var pct = {
    id: 'k5b-math-percent', grade: 5, semester: 2, order: 4,
    title: '單元 4　比率與百分率',
    subtitle: '誰當分母決定了一切，還有打折到底怎麼算',
    icon: '📊', estimatedMinutes: 23,
    objectives: [
      '說得出比率是「比較量除以基準量」，並能指出題目裡誰是基準量',
      '在小數、分數、百分率三種寫法之間自由轉換',
      '算得出折扣後的價錢和漲價後的價錢',
      '解釋為什麼用比率比較，比直接比人數公平',
    ],
    wrapUp: '比率和百分率是同一件事的兩種寫法。' +
      '百分率把分母統一成 100，所以不同的比率可以直接比大小 —— ' +
      '這就是生活上到處都用百分比的原因。算的時候只要記住一句：先找出誰是基準量。',
    sections: [

      { heading: '比率：先找出誰是基準量', blocks: [
        { type: 'text', text: '班上 20 人，女生 8 人。女生占全班的比率是 8 除以 20 等於 0.4。' },
        { type: 'text', text: '但如果問的是「女生占男生的比率」，分母就換成男生 12 人，' +
          '答案變成 0.666…。同樣的兩個數字，問法不同，答案完全不同。' },
        { type: 'callout', title: '比率的公式只有一條', text:
          '比率 = 比較量 除以 基準量。\n' +
          '「甲占乙的比率」→ 乙是基準量，放在分母。\n' +
          '「甲是乙的幾倍」→ 一樣是乙當分母。\n' +
          '算錯比率，九成是分母放錯。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '10 顆球裡面有 3 顆紅球，紅球的比率是多少？',
                options: ['0.3', '3', '0.7'],
                answer: 0,
                explanation: '3 除以 10 等於 0.3。基準量是全部 10 顆。' },
              { question: '棒球選手打擊率 0.300 是什麼意思？',
                options: ['平均每 10 次打擊有 3 次安打', '一共打了 300 支安打', '成功 300 次'],
                answer: 0,
                explanation: '安打數除以打擊數。所以打擊次數不同的選手也可以互相比較。' },
              { question: '比率可以超過 1 嗎？',
                options: ['可以，當比較量大於基準量的時候', '不可以', '只能等於 1'],
                answer: 0,
                explanation: '今年人數是去年的 1.2 倍，比率就是 1.2。只有「部分占全體」才一定不超過 1。' },
              { question: '為什麼用比率比直接比人數公平？',
                options: ['總人數不一樣的團體，用比率才比得出高低', '因為數字比較小', '因為比較難算'],
                answer: 0,
                explanation: '甲班 10 人中 5 人及格，乙班 40 人中 16 人及格。' +
                  '人數乙班多，但比率甲班 0.5 高於乙班 0.4。' },
            ],
          });
        } },
      ]},

      { heading: '三種寫法，同一件事', blocks: [
        { type: 'text', text: '小數、分數、百分率講的是同一個比率，只是穿不同的衣服。' +
          '換來換去要很熟，因為題目會混著出。' },
        { type: 'component', build: function () {
          return new TapPairing({
            left: [
              { id: 'p1', text: '0.4' },
              { id: 'p2', text: '0.25' },
              { id: 'p3', text: '0.5' },
              { id: 'p4', text: '0.75' },
              { id: 'p5', text: '1.2' },
            ],
            right: [
              { id: 'o1', text: '百分之 40　（五分之二）' },
              { id: 'o2', text: '百分之 25　（四分之一）' },
              { id: 'o3', text: '百分之 50　（二分之一）' },
              { id: 'o4', text: '百分之 75　（四分之三）' },
              { id: 'o5', text: '百分之 120　（五分之六）' },
            ],
            pairs: { p1: 'o1', p2: 'o2', p3: 'o3', p4: 'o4', p5: 'o5' },
          });
        } },
        { type: 'callout', title: '換算方向記一次就好', text:
          '小數 → 百分率：乘 100（小數點往右移兩位）。\n' +
          '百分率 → 小數：除以 100（小數點往左移兩位）。\n' +
          '百分率 → 分數：寫成 100 分之幾，再約分。' },
      ]},

      { heading: '打折和漲價', blocks: [
        { type: 'text', text: '這是百分率在生活裡最常出現的地方，也最容易算錯。' +
          '關鍵是先想清楚：折後價是原價的百分之幾？' },
        { type: 'component', build: function () {
          return new CompareToggle({
            options: [
              { label: '打折（算剩下多少）', note:
                '「八折」= 原價的十分之八 = 百分之 80。\n' +
                '800 元打八折 → 800 乘 0.8 等於 640 元。\n' +
                '常見錯誤：算成「便宜了 800 乘 0.8」。八折是付八成，不是打掉八成。' },
              { label: '漲價（算變成多少）', note:
                '「漲價百分之 20」= 變成原價的百分之 120。\n' +
                '500 元漲價百分之 20 → 500 乘 1.2 等於 600 元。\n' +
                '要先把「漲多少」換成「變成百分之幾」，再乘一次就好。' },
              { label: '折扣了多少錢', note:
                '如果問的是「省了多少」，那就算差額。\n' +
                '800 元打八折，省了 800 減 640 等於 160 元。\n' +
                '也可以直接算：800 乘 0.2 等於 160 元。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '一件 800 元的衣服打八折，要付多少錢？',
                options: ['640 元', '160 元', '720 元'],
                answer: 0,
                explanation: '八折就是付原價的百分之 80。800 乘 0.8 等於 640 元。' },
              { question: '打七折等於原價的百分之幾？',
                options: ['百分之 70', '百分之 30', '百分之 7'],
                answer: 0,
                explanation: '幾折就是十分之幾。七折等於十分之七，也就是百分之 70。' },
              { question: '一件 500 元的商品漲價百分之 20，變成多少錢？',
                options: ['600 元', '520 元', '400 元'],
                answer: 0,
                explanation: '漲價後是原價的百分之 120。500 乘 1.2 等於 600 元。' },
              { question: '全班 40 人，有 30 人參加校外教學，參加率是百分之幾？',
                options: ['百分之 75', '百分之 30', '百分之 40'],
                answer: 0,
                explanation: '30 除以 40 等於 0.75，乘 100 等於百分之 75。' },
            ],
          });
        } },
        { type: 'callout', title: '一個檢查的習慣', text:
          '算完折扣，問自己：這個答案比原價小嗎？打折當然要變便宜。\n' +
          '算完漲價，問自己：這個答案比原價大嗎？\n' +
          '方向不對就一定算錯了，不必檢查過程。' },
      ]},

      { heading: '用比率看懂生活裡的數字', blocks: [
        { type: 'text', text: '新聞和廣告裡到處都是百分比。學會這一課，' +
          '最大的收穫是看得出哪些數字在誤導人。' },
        { type: 'component', build: function () {
          return new CompareToggle({
            options: [
              { label: '「八成的人都說有效」', note:
                '要問的第一句話是：總共問了幾個人？\n' +
                '問 10 個人有 8 個說有效，和問 10000 個人有 8000 個說有效，' +
                '同樣是百分之 80，可信度差很多。\n' +
                '百分率藏住了基準量的大小，這是它最容易被利用的地方。' },
              { label: '「銷量成長百分之 200」', note:
                '成長百分之 200 表示變成原來的 3 倍（原來的 100 加上成長的 200）。\n' +
                '但如果原來一個月只賣 2 個，變成 6 個 —— 聽起來很厲害，實際上沒什麼。\n' +
                '成長率要配著原本的數字一起看。' },
              { label: '「先漲百分之 20，再打八折」', note:
                '原價 100 元 → 漲價後 120 元 → 打八折 120 乘 0.8 等於 96 元。\n' +
                '結果比原價便宜 4 元，不是回到 100 元。\n' +
                '因為兩次的基準量不一樣：漲價以 100 為基準，打折以 120 為基準。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '甲班 10 人中 5 人及格，乙班 40 人中 16 人及格，哪一班及格率高？',
                options: ['甲班（0.5 比 0.4 高）', '乙班（人數比較多）', '一樣高'],
                answer: 0,
                explanation: '5 除以 10 等於 0.5，16 除以 40 等於 0.4。' +
                  '及格人數乙班多，及格率甲班高 —— 問的是哪一個要看清楚。' },
              { question: '原價 100 元的東西先漲價百分之 20，再打八折，最後多少錢？',
                options: ['96 元', '100 元', '104 元'],
                answer: 0,
                explanation: '100 乘 1.2 等於 120，120 乘 0.8 等於 96 元。' +
                  '兩次的基準量不同，所以不會剛好抵銷。' },
              { question: '看到「成長百分之 200」，第一個該問的問題是什麼？',
                options: ['原本的數字是多少', '這是誰說的', '有沒有打折'],
                answer: 0,
                explanation: '成長率沒有基準量就沒有意義。從 2 變 6 和從 2000 變 6000 差很多。' },
              { question: '為什麼百分率容易被用來誤導人？',
                options: ['它把基準量藏起來了，只看百分比看不出樣本有多大', '因為它很難算', '因為它不準確'],
                answer: 0,
                explanation: '百分率本身沒有錯，問題在於只給百分率、不給基準量。' +
                  '學數學最實用的一部分，就是知道該追問什麼。' },
            ],
          });
        } },
      ]},
    ],
  };

  window.LESSON_PACKS = window.LESSON_PACKS || [];
  window.LESSON_PACKS.push({
    key: 'math', subject: '數學', icon: '🚀',
    grade: 5, term: '下', version: 'kang', versionName: '康軒版',
    note: '四個單元對齊闖關站五下數學的題庫。單元是推出來的，編號待課本確認。',
    units: [frac, dec, vol, pct],
  });
})();
