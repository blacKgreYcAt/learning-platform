/**
 * 五上 · 單元 3：平面圖形（翰林版）
 * 2026-08-07
 *
 * 設計重點：角度的分類（銳角/直角/鈍角）和三角形／四邊形的內角和，
 * 課本用文字定義，小孩背了容易忘。這裡改成「自己拖出角度看它變化」——
 * GeoBoard 讓小孩親手拖動頂點，看到角度數字即時跳動，但內角和永遠不變，
 * 這個「不變」本身就是最有說服力的證明，比背公式好記。
 * 分類（三角形按角/按邊、四邊形家族）則用 SortBuckets／TapPairing 練習，
 * 避免小孩只會畫圖但認不出應用題裡描述的圖形。
 */

'use strict';

(function () {
  const { TapPairing, ChoiceQuiz, SortBuckets, GeoBoard } = window.G5;

  const unit = {
    id: 'g5-u03-plane-shapes',
    grade: 5,
    semester: '上',
    order: 3,
    title: '單元 3　平面圖形',
    subtitle: '角度、三角形與四邊形的分類',
    icon: '📐',
    estimatedMinutes: 35,
    objectives: [
      '知道角可以分成銳角、直角、鈍角、平角，會判斷一個角度屬於哪一種',
      '知道三角形的內角和永遠是 180°',
      '會依角的大小把三角形分成銳角、直角、鈍角三角形',
      '會依邊長把三角形分成正三角形、等腰三角形、不等邊三角形',
      '知道四邊形的內角和永遠是 360°',
      '認識正方形、長方形、平行四邊形、梯形、菱形的特徵，並能分辨',
    ],
    wrapUp: '這個單元的角度與分類，是後面「面積」單元推導公式的基礎——三角形、平行四邊形的面積公式都要先認得圖形的角和邊。「立體形體」單元也會用到這裡認識的平面圖形，因為每個立體的每一面都是它們。',

    sections: [
      /* ── 1. 角的種類 ─────────────────────────── */
      {
        heading: '角，先分成四種',
        blocks: [
          {
            type: 'text',
            text: '時鐘的指針、打開的扇子、書本的封面掀開一半——生活裡到處都是角。角的大小用「度」來量，一個完整的圓是 360°。',
          },
          {
            type: 'callout', icon: '📏', title: '四種角',
            text: '銳角：比 90° 小（0° 到 90° 之間）。直角：剛好 90°。鈍角：比 90° 大、比 180° 小。平角：剛好 180°，是一條直線。',
          },
          { type: 'text', text: '把角的名字和它的度數範圍配對起來：' },
          {
            type: 'component',
            build: () => new TapPairing({
              left: [
                { id: 'acute', text: '銳角' },
                { id: 'right', text: '直角' },
                { id: 'obtuse', text: '鈍角' },
                { id: 'straight', text: '平角' },
              ],
              right: [
                { id: 'acute', text: '比 90° 小' },
                { id: 'right', text: '剛好 90°' },
                { id: 'obtuse', text: '比 90° 大、比 180° 小' },
                { id: 'straight', text: '剛好 180°' },
              ],
              pairs: { acute: 'acute', right: 'right', obtuse: 'obtuse', straight: 'straight' },
            }),
          },
        ],
      },

      /* ── 2. 三角形的內角和 ───────────────────── */
      {
        heading: '三角形的內角和，永遠是 180°',
        blocks: [
          {
            type: 'text',
            text: '下面是一個可以拖動的三角形。拖任何一個角，形狀會跟著變，三個角的度數也會跟著變——但把三個角加起來，看看會發生什麼事。',
          },
          { type: 'component', build: () => new GeoBoard({ points: [{ x: 2, y: 1 }, { x: 9, y: 1 }, { x: 5, y: 6 }] }) },
          {
            type: 'callout', icon: '🔑', title: '發現了嗎？',
            text: '不管拖成什麼形狀，三個角加起來永遠是 180°。這不是巧合，是三角形的固定性質：任何三角形的內角和都是 180°。',
          },
        ],
      },

      /* ── 3. 三角形分類：看角 ─────────────────── */
      {
        heading: '三角形分類（一）：看角的大小',
        blocks: [
          {
            type: 'text',
            text: '知道內角和是 180° 之後，可以用「角」把三角形分成三種。',
          },
          {
            type: 'callout', icon: '🔽', title: '按角分類',
            text: '銳角三角形：三個角都是銳角。直角三角形：其中一個角剛好是 90°。鈍角三角形：其中一個角是鈍角（一個角變大，另外兩個角一定都要是銳角，不然加起來會超過 180°）。',
          },
          { type: 'text', text: '把下面的三個角度組合放進正確的籃子：' },
          {
            type: 'component',
            build: () => new SortBuckets({
              buckets: [
                { id: 'acute', label: '銳角三角形' },
                { id: 'right', label: '直角三角形' },
                { id: 'obtuse', label: '鈍角三角形' },
              ],
              items: [
                { text: '70°、60°、50°', bucket: 'acute', why: '三個角都比 90° 小，是銳角三角形。' },
                { text: '60°、60°、60°', bucket: 'acute', why: '三個角都是 60°，都比 90° 小，是銳角三角形（也是正三角形）。' },
                { text: '90°、60°、30°', bucket: 'right', why: '有一個角剛好 90°，是直角三角形。' },
                { text: '90°、45°、45°', bucket: 'right', why: '有一個角剛好 90°，是直角三角形。' },
                { text: '120°、40°、20°', bucket: 'obtuse', why: '有一個角是 120°，超過 90°，是鈍角三角形。' },
                { text: '100°、50°、30°', bucket: 'obtuse', why: '有一個角是 100°，超過 90°，是鈍角三角形。' },
              ],
            }),
          },
        ],
      },

      /* ── 4. 三角形分類：看邊 ─────────────────── */
      {
        heading: '三角形分類（二）：看邊的長度',
        blocks: [
          {
            type: 'text',
            text: '同一個三角形，也可以換一個角度分類——這次不看角，改看三邊的長度。',
          },
          {
            type: 'callout', icon: '📐', title: '按邊分類',
            text: '正三角形：三邊都一樣長（角度也都一樣，是 60°）。等腰三角形：剛好兩邊一樣長。不等邊三角形：三邊長度都不一樣。',
          },
          { type: 'text', text: '把下面的邊長組合放進正確的籃子：' },
          {
            type: 'component',
            build: () => new SortBuckets({
              buckets: [
                { id: 'equilateral', label: '正三角形' },
                { id: 'isosceles', label: '等腰三角形' },
                { id: 'scalene', label: '不等邊三角形' },
              ],
              items: [
                { text: '三邊都是 5 公分', bucket: 'equilateral', why: '三邊一樣長，是正三角形。' },
                { text: '三邊都是 8 公分', bucket: 'equilateral', why: '三邊一樣長，是正三角形。' },
                { text: '兩邊是 6 公分，另一邊是 4 公分', bucket: 'isosceles', why: '剛好兩邊一樣長，是等腰三角形。' },
                { text: '兩邊是 9 公分，另一邊是 5 公分', bucket: 'isosceles', why: '剛好兩邊一樣長，是等腰三角形。' },
                { text: '三邊分別是 3、4、5 公分', bucket: 'scalene', why: '三邊長度都不同，是不等邊三角形。' },
                { text: '三邊分別是 5、6、7 公分', bucket: 'scalene', why: '三邊長度都不同，是不等邊三角形。' },
              ],
            }),
          },
        ],
      },

      /* ── 5. 四邊形的內角和 ───────────────────── */
      {
        heading: '四邊形的內角和，永遠是 360°',
        blocks: [
          {
            type: 'text',
            text: '四邊形也一樣可以拖拖看。這次是四個角，一樣把它們加起來看看。',
          },
          { type: 'component', build: () => new GeoBoard({ points: [{ x: 2, y: 1 }, { x: 10, y: 1 }, { x: 9, y: 6 }, { x: 3, y: 6 }] }) },
          {
            type: 'callout', icon: '🔑', title: '360° 從哪裡來？',
            text: '四邊形的內角和永遠是 360°。原因其實跟三角形有關：從四邊形的一個角拉一條對角線，可以把它切成兩個三角形，180° + 180° = 360°。',
          },
        ],
      },

      /* ── 6. 認識四邊形家族 ───────────────────── */
      {
        heading: '認識四邊形家族',
        blocks: [
          {
            type: 'text',
            text: '四邊形不是只有「正方形」和「長方形」。把下面五種四邊形和它們的特徵配對起來：',
          },
          {
            type: 'component',
            build: () => new TapPairing({
              left: [
                { id: 'square', text: '正方形' },
                { id: 'rect', text: '長方形' },
                { id: 'para', text: '平行四邊形' },
                { id: 'trap', text: '梯形' },
                { id: 'rhom', text: '菱形' },
              ],
              right: [
                { id: 'square', text: '四邊都一樣長、四個角都是直角' },
                { id: 'rect', text: '兩兩對邊一樣長、四個角都是直角' },
                { id: 'para', text: '兩組對邊分別平行且一樣長，角不一定是直角' },
                { id: 'trap', text: '只有一組對邊平行' },
                { id: 'rhom', text: '四邊都一樣長，角不一定是直角' },
              ],
              pairs: { square: 'square', rect: 'rect', para: 'para', trap: 'trap', rhom: 'rhom' },
            }),
          },
          {
            type: 'callout', icon: '💡', title: '正方形其實很特別',
            text: '正方形同時符合長方形的條件（四個角都是直角）和菱形的條件（四邊都一樣長）。正方形是長方形，也是菱形，只是更特殊的那一種。',
          },
        ],
      },

      /* ── 7. 四邊形分類練習 ───────────────────── */
      {
        heading: '看描述，判斷是哪一種四邊形',
        blocks: [
          { type: 'text', text: '換你判斷：把下面的描述放進正確的籃子。' },
          {
            type: 'component',
            build: () => new SortBuckets({
              wide: true,
              buckets: [
                { id: 'square', label: '正方形' },
                { id: 'rect', label: '長方形' },
                { id: 'para', label: '平行四邊形' },
                { id: 'trap', label: '梯形' },
                { id: 'rhom', label: '菱形' },
              ],
              items: [
                { text: '四邊都是 5 公分，四個角都是 90°', bucket: 'square',
                  why: '四邊相等又都是直角，是正方形。' },
                { text: '對邊分別是 8 公分和 5 公分，四個角都是 90°，但四邊不全部相等', bucket: 'rect',
                  why: '兩兩對邊相等、都是直角，但邊長不是四邊都一樣，是長方形。' },
                { text: '兩組對邊分別平行且相等，角是 70° 和 110°，不是直角', bucket: 'para',
                  why: '對邊平行相等，但角不是 90°，是平行四邊形。' },
                { text: '只有上下兩邊互相平行，左右兩邊不平行', bucket: 'trap',
                  why: '只有一組對邊平行，是梯形。' },
                { text: '四邊都是 6 公分，角是 60° 和 120°，不是直角', bucket: 'rhom',
                  why: '四邊相等但角不是 90°，是菱形。' },
              ],
            }),
          },
        ],
      },

      /* ── 8. 概念檢查 ─────────────────────────── */
      {
        heading: '概念檢查',
        blocks: [
          { type: 'text', text: '七題小測驗，涵蓋角的種類、三角形和四邊形的性質與分類。' },
          {
            type: 'component',
            build: () => new ChoiceQuiz({
              questions: [
                {
                  question: '一個角是 115°，是哪一種角？',
                  hint: '比 90° 大、比 180° 小的角是哪一種？',
                  options: ['銳角', '直角', '鈍角', '平角'],
                  answer: 2,
                  explanation: '115° 比 90° 大、比 180° 小，是鈍角。',
                },
                {
                  question: '一個三角形其中兩個角是 50° 和 70°，第三個角是多少度？',
                  hint: '三角形內角和是 180°，180 − 50 − 70 = ?',
                  options: ['50°', '60°', '70°', '120°'],
                  answer: 1,
                  explanation: '180° − 50° − 70° = 60°。',
                },
                {
                  question: '一個三角形三個角分別是 90°、45°、45°，按角分類是什麼三角形？',
                  hint: '有一個角剛好是 90°。',
                  options: ['銳角三角形', '直角三角形', '鈍角三角形', '以上皆非'],
                  answer: 1,
                  explanation: '有一個角剛好 90°，是直角三角形。',
                },
                {
                  question: '三邊長度都是 7 公分的三角形，按邊分類叫做什麼？',
                  hint: '三邊都一樣長。',
                  options: ['等腰三角形', '不等邊三角形', '正三角形', '直角三角形'],
                  answer: 2,
                  explanation: '三邊都一樣長，是正三角形。',
                },
                {
                  question: '一個四邊形四個角分別是 100°、80°、95° 和一個未知角，第四個角是多少度？',
                  hint: '四邊形內角和是 360°，360 − 100 − 80 − 95 = ?',
                  options: ['75°', '80°', '85°', '90°'],
                  answer: 2,
                  explanation: '360° − 100° − 80° − 95° = 85°。',
                },
                {
                  question: '四邊都一樣長，但角不是直角，這是什麼四邊形？',
                  hint: '邊都相等，但不符合正方形（需要角也是直角）。',
                  options: ['正方形', '長方形', '菱形', '梯形'],
                  answer: 2,
                  explanation: '四邊相等但角不是 90°，是菱形。四邊相等又角是 90° 才是正方形。',
                },
                {
                  question: '下面哪一句正確描述「梯形」的特徵？',
                  options: ['兩組對邊都平行', '只有一組對邊平行', '四個角都是直角', '四邊都一樣長'],
                  answer: 1,
                  explanation: '梯形只有一組對邊平行；兩組對邊都平行的是平行四邊形（包含長方形、菱形、正方形）。',
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
