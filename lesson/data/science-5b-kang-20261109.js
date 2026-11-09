/**
 * 五下自然（康軒）· 引導式教學
 * 2026-11-09
 *
 * 四個單元對齊闖關站 science-5b-kang-20261109.js，
 * 小孩在題庫卡住的時候，「先看教學」才連得回同一個觀念。
 *
 * 寫法跟五上那一包一樣：先給他看得到的現象，再給名詞。
 * 五下這四個單元特別容易變成背名詞 ——
 *   「摩擦力」三個字背起來很快，問他冰上為什麼滑就不會；
 *   「對流」兩個字背起來很快，問他冷氣為什麼裝高處也不會。
 * 所以每一個名詞前面都先放一個他在家裡看得到的畫面。
 *
 * 力與運動那一單元多用了兩個新元件（SpringScale、LeverBalance），
 * 放在 g5-widgets-5b-20261109.js，引擎沒有動。
 */

'use strict';

(function () {
  var G5 = window.G5;
  var ChoiceQuiz = G5.ChoiceQuiz, SortBuckets = G5.SortBuckets,
      TapPairing = G5.TapPairing, LabeledDiagram = G5.LabeledDiagram,
      CompareToggle = G5.CompareToggle, Timeline = G5.Timeline,
      SpringScale = G5.SpringScale, LeverBalance = G5.LeverBalance;

  /* ══════════════════════════════════════════════
     單元 1：力與運動
     ══════════════════════════════════════════════ */
  var force = {
    id: 'k5b-sci-force',
    grade: 5, semester: '下', order: 1,
    title: '單元 1　力與運動',
    subtitle: '力看不見，但是它留下的痕跡看得見',
    icon: '💪',
    estimatedMinutes: 40,
    objectives: [
      '說得出力作用之後會留下哪兩種痕跡',
      '分得出「要碰到才有」和「不用碰到也有」的力',
      '會用彈簧秤，也知道為什麼不能超過彈性限度',
      '知道兩力平衡是什麼意思',
      '算得出蹺蹺板要坐哪裡才會平',
    ],
    wrapUp: '這個單元只有兩句話要記牢：力會改變「形狀」或「運動」；' +
      '蹺蹺板比的是「重量 × 距離」不是比誰重。其他題目都從這兩句延伸出來。',

    sections: [
      {
        heading: '力明明看不見，怎麼知道它在？',
        blocks: [
          {
            type: 'text',
            text: '你看不到「推力」這個東西，但是你看得到門被推開了。' +
              '力就是這樣 —— 我們永遠不是直接看到力，是看到它留下的痕跡。',
          },
          {
            type: 'text',
            text: '痕跡只有兩種：東西的「形狀」變了，或者東西的「運動」變了。' +
              '捏黏土是形狀變了；踢球是運動變了；用球去撞牆，兩種都變了。',
          },
          {
            type: 'callout', icon: '🔑', title: '這一句可以解掉一半的題目',
            text: '只要形狀或運動其中一個變了，就一定有力在作用。' +
              '反過來說，顏色變了、味道變了、聲音變了，那都不是力做的。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '把彈簧壓扁，這是力造成了什麼改變？',
                    options: ['形狀改變', '運動改變', '顏色改變'],
                    answer: 0,
                    explanation: '彈簧沒有跑到別的地方，是本身被壓短了，所以是形狀改變。',
                  },
                  {
                    question: '滾過來的球被你擋住停下來，這是力造成了什麼改變？',
                    options: ['形狀改變', '運動改變', '沒有改變'],
                    answer: 1,
                    explanation: '球從「在動」變成「不動」，運動狀態改變了。停下來也是一種改變。',
                  },
                  {
                    question: '蘋果放久了從青色變成紅色，這是力造成的嗎？',
                    options: ['是，重力造成的', '不是，那是蘋果成熟的變化', '是，摩擦力造成的'],
                    answer: 1,
                    explanation: '力只會改變形狀和運動，不會換顏色。這題是常見的陷阱。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '要碰到才有的力，和不用碰也有的力',
        blocks: [
          {
            type: 'text',
            text: '力有很多名字：推力、拉力、摩擦力、彈力、浮力、重力、磁力。' +
              '與其一個一個背，不如先把它們分成兩堆。',
          },
          {
            type: 'text',
            text: '一堆是「兩個東西要碰在一起才會有」—— 手不碰到門就推不動門。' +
              '另一堆是「隔空也會有」—— 蘋果沒有碰到地球，還是會掉下來。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                buckets: [
                  { id: 'c', label: '要碰到才有' },
                  { id: 'f', label: '不碰也有' },
                ],
                items: [
                  { text: '推力', bucket: 'c', why: '手要碰到東西才推得動。' },
                  { text: '拉力', bucket: 'c', why: '繩子要接在物體上才拉得動。' },
                  { text: '摩擦力', bucket: 'c', why: '發生在兩個接觸面之間，分開就沒有了。' },
                  { text: '彈力', bucket: 'c', why: '要壓到或拉到彈簧、橡皮筋本身才會產生。' },
                  { text: '浮力', bucket: 'c', why: '物體要泡在水裡（接觸到水）才有。' },
                  { text: '重力', bucket: 'f', why: '不用碰到地球，地球照樣把你往下拉。' },
                  { text: '磁力', bucket: 'f', why: '隔著一張紙、隔著桌面都還吸得住迴紋針。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🧲', title: '為什麼要先這樣分',
            text: '題目常常問「下列哪一種力一定要接觸」。分好這兩堆，這類題目不用想。' +
              '而且摩擦力只在接觸面產生，這件事後面算「怎麼減少摩擦」的時候會再用到。',
          },
        ],
      },

      {
        heading: '把力變成數字：彈簧秤',
        blocks: [
          {
            type: 'text',
            text: '說「這個很重」沒有用，要有數字才能比較。量力的工具是彈簧秤。',
          },
          {
            type: 'text',
            text: '彈簧秤能量力，靠的是彈簧一個很乖的性質：掛得越重，伸得越長，' +
              '而且是「成比例」地長。掛 100 公克重伸 2 公分，掛 200 公克重就伸 4 公分。' +
              '正因為這麼規律，刻度才畫得出來。自己掛掛看。',
          },
          {
            type: 'component',
            build: function () {
              return new SpringScale({ stepG: 100, stepCm: 2, limitN: 5 });
            },
          },
          {
            type: 'callout', icon: '⚠️', title: '彈性限度',
            text: '上面那條彈簧掛到第六個就壞了。壞掉之後放手也回不到原長，' +
              '這叫超過「彈性限度」。所以挑彈簧秤要挑量程比待測物大的 ——' +
              '不是挑最靈敏的，是挑撐得住的。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '使用彈簧秤之前，一定要先做哪一件事？',
                    options: ['先用力拉幾下', '先歸零', '先泡水'],
                    answer: 1,
                    explanation: '沒歸零的話，後面每一次量到的數字都會固定偏多或偏少。',
                  },
                  {
                    question: '某彈簧掛 150 公克重時伸長 3 公分。在彈性限度內掛 300 公克重，會伸長多少？',
                    options: ['3 公分', '6 公分', '9 公分'],
                    answer: 1,
                    explanation: '力變成 2 倍，伸長量也變成 2 倍：3 × 2 = 6 公分。',
                  },
                  {
                    question: '要量大約 800 公克重的東西，下列哪一個彈簧秤最合適？',
                    options: ['最大 200 公克重', '最大 500 公克重', '最大 1000 公克重'],
                    answer: 2,
                    explanation: '量程要大於待測重量，不然一掛上去就超過彈性限度把秤拉壞。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '兩個力剛好打平',
        blocks: [
          {
            type: 'text',
            text: '拔河的時候繩子中間的標記一動也不動，不是因為兩邊都沒出力，' +
              '是因為兩邊出的力一樣大、方向相反，互相抵消了。這叫「兩力平衡」。',
          },
          {
            type: 'text',
            text: '一本書靜靜放在桌上也一樣：地球往下拉它（重力），桌面往上托它，' +
              '兩個力大小相等方向相反，所以書不動。如果桌面托的力比較大，書就會飛起來了。',
          },
          {
            type: 'callout', icon: '⚖️', title: '不動 ≠ 沒有力',
            text: '「東西沒有動」最常見的原因是力平衡了，不是沒有力。' +
              '這是很多人第一次就答錯的地方。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '一盞吊燈用繩子掛在天花板上靜止不動。繩子拉它的力和它的重力關係是？',
                    options: ['繩子的力比較大', '大小相等、方向相反', '重力比較大'],
                    answer: 1,
                    explanation: '燈沒有動，表示上下兩個力平衡。繩子的力比較大的話燈會往上升。',
                  },
                  {
                    question: '兩個人同時推一個箱子，箱子卻沒有動。最可能的原因是什麼？',
                    options: [
                      '兩個人推的方向相反、力一樣大',
                      '箱子壞掉了',
                      '箱子沒有重量',
                    ],
                    answer: 0,
                    explanation: '方向相反而且大小相等，兩個力就互相抵消，箱子保持不動。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '蹺蹺板到底在比什麼',
        blocks: [
          {
            type: 'text',
            text: '很多人以為蹺蹺板是「比誰重」。其實重的人只要往中間坐，' +
              '輕的人往外坐，一樣可以平。蹺蹺板比的不是重量，是「重量 × 距離」。',
          },
          {
            type: 'text',
            text: '中間不動的那一點叫「支點」。自己調調看右邊的距離和重量，' +
              '把兩邊的數字調成一樣，板子就會變成綠色的平衡狀態。',
          },
          {
            type: 'component',
            build: function () {
              return new LeverBalance({ leftW: 30, leftD: 2, rightW: 20, rightD: 1, maxD: 4, maxW: 60 });
            },
          },
          {
            type: 'callout', icon: '🔑', title: '一條式子',
            text: '左邊重量 × 左邊距離 ＝ 右邊重量 × 右邊距離，蹺蹺板就平。' +
              '所以重的人要坐近一點，輕的人要坐遠一點。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '哥哥 40 公斤坐在離支點 1 公尺處，妹妹 20 公斤要坐在離支點多遠才平衡？',
                    options: ['1 公尺', '2 公尺', '4 公尺'],
                    answer: 1,
                    explanation: '哥哥那邊是 40 × 1 = 40。妹妹要湊到 40，20 × 2 = 40，所以是 2 公尺。',
                  },
                  {
                    question: '蹺蹺板原本是平的。如果左邊的人往支點移近一點，會發生什麼事？',
                    options: ['右邊沉下去', '左邊沉下去', '還是平的'],
                    answer: 0,
                    explanation: '左邊距離變小，左邊的「重量 × 距離」就變小，右邊比較大所以右邊沉下去。',
                  },
                  {
                    question: '天平兩邊的秤盤停在一樣高，表示什麼？',
                    options: ['兩邊重量相等', '左邊比較重', '天平壞了'],
                    answer: 0,
                    explanation: '天平兩臂一樣長（距離相同），所以平衡就代表重量相等。' +
                      '這是蹺蹺板公式的特例。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '生活裡的槓桿：省力還是靈活',
        blocks: [
          {
            type: 'text',
            text: '凡是繞著一個支點轉動的工具，都是槓桿。但是槓桿不一定省力 ——' +
              '有些工具故意做成費力的，換來的是靈活好控制。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '省力槓桿',
                    note: '施力點離支點比較遠，所以用小力就能撬動大東西。' +
                      '例子：開瓶器、拔釘器、獨輪手推車。代價是手要移動比較長的距離。',
                  },
                  {
                    label: '費力槓桿',
                    note: '施力點離支點比較近，要用比較大的力。' +
                      '例子：鑷子、筷子、掃把。為什麼還要用？因為夾子尖端移動得又快又精準。',
                  },
                  {
                    label: '等臂槓桿',
                    note: '兩邊距離一樣，不省力也不費力。' +
                      '例子：天平、蹺蹺板（兩人坐一樣遠的時候）。它的用途是「比較」，不是省力。',
                  },
                ],
              });
            },
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '下列哪一個是省力的工具？',
                    options: ['鑷子', '筷子', '開瓶器'],
                    answer: 2,
                    explanation: '開瓶器的施力點離支點很遠，非常省力。鑷子和筷子都是費力槓桿，' +
                      '換來的好處是靈活。',
                  },
                  {
                    question: '在槓桿上，把施力點移到離支點更遠的地方，需要的力會怎樣？',
                    options: ['變大', '變小', '不變'],
                    answer: 1,
                    explanation: '距離變長，同樣的「力 × 距離」只要比較小的力就夠了，所以更省力。',
                  },
                  {
                    question: '掛一幅很重的畫，用兩條繩子比用一條好，為什麼？',
                    options: [
                      '兩條比較好看',
                      '每一條分擔的力只剩一半，比較不會斷',
                      '兩條繩子會讓畫變輕',
                    ],
                    answer: 1,
                    explanation: '畫的重量沒有改變，但是分給兩條之後，每一條承受的力變小了。',
                  },
                ],
              });
            },
          },
        ],
      },
    ],
  };

  /* ══════════════════════════════════════════════
     單元 2：大地的奧妙
     ══════════════════════════════════════════════ */
  var earth = {
    id: 'k5b-sci-earth',
    grade: 5, semester: '下', order: 2,
    title: '單元 2　大地的奧妙',
    subtitle: '地層是一本照時間排好的書',
    icon: '🏔️',
    estimatedMinutes: 38,
    objectives: [
      '知道地層越下面越老，看得懂沉積的先後順序',
      '說得出化石能告訴我們什麼',
      '分得清楚斷層和褶皺',
      '分得清楚地震規模和震度',
      '知道地震來的時候第一步要做什麼',
    ],
    wrapUp: '這個單元的題目幾乎都在問「這個現象是什麼造成的」。' +
      '記住三件事就夠：越下面越老、彎曲和錯開都是受力的證據、' +
      '規模只有一個而震度每個地方不一樣。',

    sections: [
      {
        heading: '地層是怎麼疊出來的',
        blocks: [
          {
            type: 'text',
            text: '河水把泥沙帶到海裡，泥沙慢慢沉下去，一層蓋一層。' +
              '幾千年幾萬年之後被壓實、膠結，就變成一層一層的岩石，這叫地層。',
          },
          {
            type: 'text',
            text: '所以地層有一個很好用的規則：沒有被翻動過的話，' +
              '越下面的那一層沉積得越早、年代越老。',
          },
          {
            type: 'component',
            build: function () {
              return new Timeline({
                hint: '還不對。想一想：哪一層是最先沉下去的？最先的在最下面。',
                doneText: '排好了！地層不用背年份，由下往上讀就是由老讀到新。',
                slots: [
                  { when: '最下面（最老）', answer: '貝殼層', why: '最先沉積，所以在最底下。' },
                  { when: '下面數來第二層', answer: '粗砂層', why: '貝殼層之後才沉積上去。' },
                  { when: '上面數來第二層', answer: '細泥層', why: '比粗砂層晚，比火山灰層早。' },
                  { when: '最上面（最新）', answer: '火山灰層', why: '最後才落下來，所以蓋在最上面。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '📖', title: '為什麼說它是一本書',
            text: '由下往上讀，就是由老讀到新。地層等於大地自己寫的記事本，' +
              '每一層都記了當時發生什麼事。',
          },
        ],
      },

      {
        heading: '化石在說什麼',
        blocks: [
          {
            type: 'text',
            text: '埋在地層裡的古代生物遺骸或痕跡叫化石。要留得下來，' +
              '通常得是堅硬的部分（骨頭、貝殼、牙齒），或是壓在泥裡留下的印子。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                buckets: [
                  { id: 'y', label: '可能變成化石' },
                  { id: 'n', label: '不可能變成化石' },
                ],
                items: [
                  { text: '貝殼', bucket: 'y', why: '堅硬，最常見的化石之一。' },
                  { text: '恐龍骨頭', bucket: 'y', why: '堅硬的骨頭被礦物取代之後保存下來。' },
                  { text: '樹葉壓在泥裡的印痕', bucket: 'y', why: '痕跡也算化石，叫印痕化石。' },
                  { text: '動物走過留下的腳印', bucket: 'y', why: '生活痕跡也是化石，叫生痕化石。' },
                  { text: '葉子上的露水', bucket: 'n', why: '蒸發掉就沒有了，留不下任何痕跡。' },
                  { text: '鳥叫的聲音', bucket: 'n', why: '聲音不是物質，不會留在地層裡。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🐚', title: '最常考的一題',
            text: '在高山上找到海洋生物的化石，代表什麼？' +
              '代表那裡以前在海底，後來地層被抬升上來。不是海洋生物爬上去的。',
          },
        ],
      },

      {
        heading: '大地在動：斷層和褶皺',
        blocks: [
          {
            type: 'text',
            text: '地層沉積的時候本來是水平的。所以只要看到它傾斜、彎曲或錯開，' +
              '就表示後來有很大的力量推過它。',
          },
          {
            type: 'text',
            text: '這個力量來自板塊。板塊一直在慢慢移動、互相推擠，岩層受不了就變形。' +
              '變形有兩種結果：',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '褶皺（彎了沒斷）',
                    note: '岩層被慢慢擠壓，像毯子被推皺一樣彎起來，但是沒有斷開。' +
                      '在公路切過的山壁上常常看得到一條一條彎彎的紋路。',
                  },
                  {
                    label: '斷層（斷了還錯開）',
                    note: '岩層受不了而斷裂，兩側還沿著裂面錯動。' +
                      '斷層錯動的瞬間就是地震。九二一地震之後，車籠埔一帶的地面被明顯抬高，' +
                      '就是斷層錯動造成的。',
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🌏', title: '臺灣為什麼地震這麼多',
            text: '臺灣就坐在歐亞板塊和菲律賓海板塊交界的地方，兩個板塊一直在推。' +
              '同一個原因也造出了中央山脈、溫泉和大屯火山群 —— 災害和禮物是同一件事來的。',
          },
        ],
      },

      {
        heading: '規模和震度不是同一件事',
        blocks: [
          {
            type: 'text',
            text: '新聞上會說「規模 6.2，臺北震度 3 級」。這兩個數字講的是完全不同的事，' +
              '很多人會搞混。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '規模',
                    note: '這一次地震總共放出多少能量。' +
                      '一次地震只有一個規模，不管你人在哪裡，數字都一樣。',
                  },
                  {
                    label: '震度',
                    note: '某一個地方實際上搖得多厲害。' +
                      '離震央近的地方震度大，遠的地方震度小，所以同一次地震' +
                      '各地的震度都不一樣。',
                  },
                ],
              });
            },
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '同一次地震，臺中震度 4 級、花蓮震度 6 級。這次地震的規模有幾個？',
                    options: ['兩個', '一個', '每個縣市各一個'],
                    answer: 1,
                    explanation: '規模是這次地震放出的總能量，只有一個。各地不同的是震度。',
                  },
                  {
                    question: '地震搖起來的時候，第一步應該做什麼？',
                    options: ['趴下、掩護、穩住', '衝去搭電梯下樓', '先打開窗戶'],
                    answer: 0,
                    explanation: '就地趴下，躲進堅固桌子底下護住頭頸，抓住桌腳等搖晃停止。' +
                      '地震時絕對不搭電梯。',
                  },
                  {
                    question: '海底發生大地震，可能引發哪一種災害？',
                    options: ['海嘯', '霜害', '沙塵暴'],
                    answer: 0,
                    explanation: '海底地震推動大量海水，形成能量很大的波浪衝上岸，就是海嘯。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '大地變動帶來的壞事和好事',
        blocks: [
          {
            type: 'text',
            text: '大地變動常常被當成只有災害。其實同一股力量也造出了我們覺得很棒的東西，' +
              '兩邊都要認得。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                buckets: [
                  { id: 'bad', label: '帶來的災害' },
                  { id: 'good', label: '帶來的好處' },
                ],
                items: [
                  { text: '房屋倒塌、橋梁斷裂', bucket: 'bad', why: '地震搖晃造成的直接破壞。' },
                  { text: '土石流沖毀村落', bucket: 'bad', why: '大雨加上鬆動的土石一起往下衝。' },
                  { text: '海嘯淹沒海岸', bucket: 'bad', why: '海底地震推動海水形成的巨浪。' },
                  { text: '溫泉', bucket: 'good', why: '地底的熱源把地下水加熱冒出來。' },
                  { text: '高山和峽谷等特殊景觀', bucket: 'good', why: '板塊推擠抬升造山，流水再切出峽谷。' },
                  { text: '火山附近肥沃的土壤', bucket: 'good', why: '火山灰風化之後養分豐富，很適合耕作。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '⛰️', title: '土石流為什麼挑那種地方',
            text: '坡度陡、土石鬆動、雨量大，三個條件湊在一起最危險。' +
              '所以保住山坡上的樹和草就是最有效的預防 —— 根抓住土，葉子擋住雨直接打在地上。',
          },
        ],
      },
    ],
  };

  /* ══════════════════════════════════════════════
     單元 3：植物世界的面面觀
     ══════════════════════════════════════════════ */
  var plants = {
    id: 'k5b-sci-plants',
    grade: 5, semester: '下', order: 3,
    title: '單元 3　植物世界的面面觀',
    subtitle: '植物不會跑，所以它得想別的辦法',
    icon: '🌱',
    estimatedMinutes: 38,
    objectives: [
      '說得出根、莖、葉各自的工作',
      '說得出光合作用需要什麼、產生什麼',
      '知道怎麼用碘液證明葉子做了澱粉',
      '認得出種子靠風、水、動物哪一種方式傳播',
      '分得出種子繁殖和營養繁殖',
    ],
    wrapUp: '植物不能移動，所以它的每一個構造幾乎都在解決同一件事：' +
      '怎麼在原地拿到陽光、水和養分，怎麼讓下一代搬到別的地方去。' +
      '看到一個奇怪的構造，先問「它在解決什麼問題」，答案通常就出來了。',

    sections: [
      {
        heading: '一棵植物的分工',
        blocks: [
          {
            type: 'text',
            text: '植物沒有嘴也沒有腳，但是它活得好好的。先看清楚每個部位在做什麼。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點一個部位，看它的工作',
                parts: [
                  {
                    icon: '🌿', name: '根',
                    description: '吸收水分和土裡的礦物質，同時把整株植物固定住。' +
                      '風吹不倒、水沖不走，靠的就是根。',
                  },
                  {
                    icon: '🌳', name: '莖',
                    description: '裡面有管子，把根吸的水往上送、把葉子做的養分往下送。' +
                      '同時把葉子撐到採得到光的高度。',
                  },
                  {
                    icon: '🍃', name: '葉',
                    description: '進行光合作用的地方，也就是植物的廚房。' +
                      '又寬又薄是為了接住更多陽光。',
                  },
                  {
                    icon: '🌸', name: '花',
                    description: '負責繁殖。雄蕊產生花粉，雌蕊接收花粉，' +
                      '鮮豔的花瓣和香味是用來吸引昆蟲來幫忙傳粉的。',
                  },
                  {
                    icon: '🍎', name: '果實和種子',
                    description: '種子是下一代，果實是種子的保護殼兼交通工具 ——' +
                      '好吃的果肉是付給動物的運費。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '植物自己做飯：光合作用',
        blocks: [
          {
            type: 'text',
            text: '動物餓了要去找東西吃，植物不行，它只能自己做。' +
              '這個「自己做飯」的過程叫光合作用，地點在葉子裡的葉綠體。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '需要什麼',
                    note: '陽光（能量）＋ 水（根吸上來）＋ 二氧化碳（葉子從空氣拿）。' +
                      '少任何一個都做不成，所以把植物關在黑暗裡就停工了。',
                  },
                  {
                    label: '產生什麼',
                    note: '養分（主要以澱粉的形式先存起來）＋ 氧氣。' +
                      '氧氣是多出來的，排到空氣中剛好是動物要呼吸的。',
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🔑', title: '一句話記起來',
            text: '陽光 ＋ 水 ＋ 二氧化碳 → 養分 ＋ 氧氣。' +
              '箭頭左邊是材料，右邊是成品，題目問的永遠是這兩邊其中一邊。',
          },
        ],
      },

      {
        heading: '怎麼證明葉子真的做了澱粉',
        blocks: [
          {
            type: 'text',
            text: '光合作用看不到，但是可以用實驗抓到它的成品。' +
              '工具是碘液 —— 碘液碰到澱粉會變成藍紫色。',
          },
          {
            type: 'text',
            text: '做法是：先把植物放在黑暗的地方幾天，把原本存的澱粉用完；' +
              '再把一片葉子用黑紙遮住一半，拿去曬太陽；最後摘下來滴碘液。' +
              '曬到光的那一半變藍紫色，被遮住的那一半沒有。',
          },
          {
            type: 'callout', icon: '🧪', title: '為什麼要先放在黑暗中',
            text: '不先把舊澱粉用掉，實驗做完也分不出那些澱粉是「本來就有的」' +
              '還是「這次曬太陽做的」。這一步叫做「去澱粉」，是這個實驗的關鍵。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '要檢驗葉子裡有沒有澱粉，應該滴哪一種藥品？',
                    options: ['碘液', '食鹽水', '沙拉油'],
                    answer: 0,
                    explanation: '碘液遇到澱粉會變藍紫色，是最常用的澱粉檢驗方法。',
                  },
                  {
                    question: '葉子被黑紙遮住的那一半，滴碘液之後會怎樣？',
                    options: ['變藍紫色', '不變色', '變紅色'],
                    answer: 1,
                    explanation: '被遮住就照不到光，沒辦法行光合作用，所以沒有澱粉，碘液不變色。',
                  },
                  {
                    question: '把白色的花插在紅色的水裡，一段時間後莖裡出現紅色的細線，這說明什麼？',
                    options: ['莖裡有運送水分的管子', '莖會自己變色', '紅色的水比較輕'],
                    answer: 0,
                    explanation: '紅色的水沿著莖裡輸送水分的管子往上走，剛好把路徑染出來給我們看。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '種子要怎麼搬家',
        blocks: [
          {
            type: 'text',
            text: '種子如果掉在媽媽腳邊，就得跟媽媽搶陽光和水。所以植物想盡辦法' +
              '把種子送遠一點。看看這些構造是為了搭哪一種「便車」。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'p1', text: '蒲公英（有白色絨毛）' },
                  { id: 'p2', text: '蒼耳（外面有鉤刺）' },
                  { id: 'p3', text: '椰子（外殼厚又能浮）' },
                  { id: 'p4', text: '鳳仙花（果實成熟會爆開）' },
                ],
                right: [
                  { id: 'w', text: '靠風吹' },
                  { id: 'a', text: '勾在動物身上' },
                  { id: 's', text: '隨水漂流' },
                  { id: 'b', text: '自己彈出去' },
                ],
                pairs: { p1: 'w', p2: 'a', p3: 's', p4: 'b' },
              });
            },
          },
          {
            type: 'callout', icon: '🔎', title: '看構造就能猜出方式',
            text: '輕又有毛 → 風。有鉤有刺或好吃 → 動物。防水又能浮 → 水。' +
              '果實會裂開彈射 → 自己來。不必背，看它長什麼樣子就推得出來。',
          },
        ],
      },

      {
        heading: '不用種子也能生下一代',
        blocks: [
          {
            type: 'text',
            text: '開花、授粉、結果、長出種子，這是一條路。' +
              '但是有些植物直接用根、莖、葉就能長出新的一株，這叫「營養繁殖」。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                buckets: [
                  { id: 'seed', label: '用種子繁殖' },
                  { id: 'veg', label: '營養繁殖' },
                ],
                items: [
                  { text: '向日葵結出瓜子再種下去', bucket: 'seed', why: '瓜子就是種子。' },
                  { text: '稻子的稻穀播到田裡', bucket: 'seed', why: '稻穀裡面是種子。' },
                  { text: '馬鈴薯切塊種下去', bucket: 'veg', why: '馬鈴薯是地下莖（塊莖），上面的芽眼會長出新株。' },
                  { text: '落地生根的葉緣長出小芽', bucket: 'veg', why: '直接從葉子長出新個體。' },
                  { text: '把玫瑰的枝條剪下來插到土裡', bucket: 'veg', why: '這叫扦插，用的是莖。' },
                  { text: '把好吃的品種接到另一棵樹上', bucket: 'veg', why: '這叫嫁接，也是營養繁殖。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🍎', title: '農夫為什麼愛用嫁接',
            text: '播種長出來的後代特徵會跑掉，可能變得不好吃。' +
              '嫁接和扦插長出來的跟母株一模一樣，而且比較快結果。' +
              '所以你吃的水果大多不是「種子種出來的」。',
          },
        ],
      },

      {
        heading: '植物的生存妙招',
        blocks: [
          {
            type: 'text',
            text: '不同環境有不同的難題。看每一種植物長成那個樣子，' +
              '是在解決什麼問題。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點一種植物，看它解決什麼問題',
                parts: [
                  {
                    icon: '🌵', name: '仙人掌',
                    description: '問題：沙漠很少下雨。解法：葉子縮成刺，減少水分散失；' +
                      '莖變得肥厚用來儲水。刺順便還能防止被動物吃掉。',
                  },
                  {
                    icon: '🪷', name: '荷花',
                    description: '問題：泥底幾乎沒有氧氣。解法：葉柄和地下莖裡有中空的通道，' +
                      '把空氣從水面上的葉子送到水底的部位。',
                  },
                  {
                    icon: '🌊', name: '水筆仔（紅樹林）',
                    description: '問題：潮間帶的爛泥又缺氧又泡著鹹水。解法：長出露出泥面的' +
                      '「呼吸根」換氣，種子還會先在母株上發芽再掉下來插進泥裡。',
                  },
                  {
                    icon: '🏔️', name: '高山植物',
                    description: '問題：風很強、溫度很低。解法：長得矮矮的貼著地面，' +
                      '避開強風也留得住一點熱。',
                  },
                  {
                    icon: '🪰', name: '捕蠅草',
                    description: '問題：土壤太貧瘠，缺氮。解法：抓蟲來補充養分。' +
                      '它還是會自己行光合作用，蟲只是補充品，不是正餐。',
                  },
                ],
              });
            },
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '植物的莖會朝著有光的方向生長，這種特性叫什麼？',
                    options: ['向光性', '向地性', '向水性'],
                    answer: 0,
                    explanation: '朝光長才採得到更多陽光，光合作用才做得多。',
                  },
                  {
                    question: '不管種子怎麼擺，根都會往下長，這是因為什麼？',
                    options: ['向光性', '向地性', '習慣'],
                    answer: 1,
                    explanation: '根感覺得到重力的方向，往下長才找得到水和土。',
                  },
                  {
                    question: '落葉樹在冬天把葉子全部落光，好處是什麼？',
                    options: [
                      '減少水分散失，熬過不適合生長的季節',
                      '讓樹變輕不會被風吹倒',
                      '讓鳥比較好停',
                    ],
                    answer: 0,
                    explanation: '冬天水不好拿，乾脆不留葉子，等春天再長新的。',
                  },
                ],
              });
            },
          },
        ],
      },
    ],
  };

  /* ══════════════════════════════════════════════
     單元 4：熱的作用與傳播
     ══════════════════════════════════════════════ */
  var heat = {
    id: 'k5b-sci-heat',
    grade: 5, semester: '下', order: 4,
    title: '單元 4　熱的作用與傳播',
    subtitle: '熱只有三條路可以走，認得出來就會了',
    icon: '🔥',
    estimatedMinutes: 36,
    objectives: [
      '說得出熱脹冷縮，也知道水結冰是例外',
      '分得出傳導、對流、輻射三種傳播方式',
      '分得出熱的良導體和不良導體',
      '講得出保溫瓶為什麼保溫',
      '看得懂生活中哪些設計是為了保溫、哪些是為了散熱',
    ],
    wrapUp: '這個單元只有兩張表：熱脹冷縮（水結冰是例外），' +
      '還有熱的三條路（傳導要接觸、對流靠流動、輻射不用介質）。' +
      '所有的題目都是在問「這是哪一條路」或「這是在擋還是在幫」。',

    sections: [
      {
        heading: '東西受熱會變大',
        blocks: [
          {
            type: 'text',
            text: '物質受熱的時候，裡面的粒子動得更厲害，彼此的距離被撐開，' +
              '所以體積變大。這叫熱脹；冷下來又縮回去，叫冷縮。',
          },
          {
            type: 'text',
            text: '你家附近就有一堆例子：鐵軌之間的縫隙、橋上的伸縮縫、' +
              '夏天比冬天下垂的電線、泡熱水就打得開的罐頭蓋。',
          },
          {
            type: 'callout', icon: '❄️', title: '水是例外，要特別記',
            text: '大部分東西冷了會縮，但是水結成冰體積反而「變大」。' +
              '所以裝滿水的瓶子冰久了會被撐破，冰塊也浮在水面上。' +
              '題目很愛考這一題。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '玻璃罐的金屬蓋轉不開，泡一下熱水就好開了，為什麼？',
                    options: [
                      '金屬受熱膨脹得比玻璃多，蓋子就鬆了',
                      '熱水把蓋子變軟了',
                      '熱水有潤滑的作用',
                    ],
                    answer: 0,
                    explanation: '兩種材料膨脹的程度不一樣，金屬撐得比較開，' +
                      '蓋子和瓶口之間就出現了空隙。',
                  },
                  {
                    question: '固體、液體、氣體三者之中，受熱膨脹最明顯的是哪一個？',
                    options: ['固體', '液體', '氣體'],
                    answer: 2,
                    explanation: '氣體粒子之間本來距離就大，一受熱變化最明顯；固體最不明顯。',
                  },
                  {
                    question: '鐵軌之間要留縫隙，目的是什麼？',
                    options: [
                      '讓鐵軌受熱變長時有空間，不會互相擠壓變形',
                      '讓雨水流掉',
                      '讓火車跑得比較快',
                    ],
                    answer: 0,
                    explanation: '夏天鐵軌受熱伸長，沒有縫隙就會擠彎，火車就危險了。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '熱的三條路',
        blocks: [
          {
            type: 'text',
            text: '熱一定從溫度高的地方往溫度低的地方跑，一直跑到兩邊一樣為止。' +
              '它只有三種跑法，認出是哪一種，這個單元就過了一大半。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '傳導',
                    note: '熱沿著固體一路傳過去，物質本身沒有跑。' +
                      '例子：湯匙放進熱湯，整支都變熱。特徵是「要碰到」。',
                  },
                  {
                    label: '對流',
                    note: '受熱的液體或氣體變輕往上跑，冷的補下來，整個循環起來。' +
                      '例子：煮水時水上下翻滾。特徵是「東西自己在流動」。',
                  },
                  {
                    label: '輻射',
                    note: '不需要任何介質，靠看不見的熱射線直接傳過來。' +
                      '例子：太陽的熱穿過太空到地球。特徵是「真空也行」。',
                  },
                ],
              });
            },
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'cond', label: '傳導' },
                  { id: 'conv', label: '對流' },
                  { id: 'rad', label: '輻射' },
                ],
                items: [
                  { text: '鐵湯匙放進熱湯，握柄也燙了', bucket: 'cond', why: '熱沿著固體的湯匙傳過去。' },
                  { text: '手握住熱水杯覺得溫溫的', bucket: 'cond', why: '杯壁和手接觸，熱直接傳到手。' },
                  { text: '煮開水時水不停上下翻滾', bucket: 'conv', why: '熱水往上、冷水往下，整鍋循環。' },
                  { text: '冷氣裝在高處，整個房間才會涼', bucket: 'conv', why: '冷空氣會下沉，形成空氣的對流。' },
                  { text: '站在太陽下覺得熱', bucket: 'rad', why: '太陽的熱穿過太空直接照過來。' },
                  { text: '靠近營火不用碰到就覺得熱', bucket: 'rad', why: '火把熱以輻射的方式送到你身上。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🔑', title: '三秒判斷法',
            text: '有碰到固體 → 傳導。東西在流動（水、空氣） → 對流。' +
              '隔著空間、沒碰到也沒流動 → 輻射。',
          },
        ],
      },

      {
        heading: '有些材料傳得快，有些傳得慢',
        blocks: [
          {
            type: 'text',
            text: '同樣是傳導，不同材料的速度差很多。傳得快的叫熱的「良導體」，' +
              '傳得慢的叫「不良導體」。鍋子就是最好的例子：' +
              '鍋身用金屬（要快點把熱送進食物），把手用塑膠（不能燙手）。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                buckets: [
                  { id: 'good', label: '熱的良導體' },
                  { id: 'bad', label: '熱的不良導體' },
                ],
                items: [
                  { text: '鐵', bucket: 'good', why: '金屬大多是熱的良導體。' },
                  { text: '銅', bucket: 'good', why: '傳熱很快，所以常拿來做鍋底。' },
                  { text: '鋁', bucket: 'good', why: '金屬，便當盒和鍋子常用。' },
                  { text: '木頭', bucket: 'bad', why: '傳熱很慢，所以鍋鏟的柄常用木頭。' },
                  { text: '塑膠', bucket: 'bad', why: '傳熱慢，拿來做把手不燙手。' },
                  { text: '空氣', bucket: 'bad', why: '不流動的空氣幾乎不傳熱，這是保暖的關鍵。' },
                  { text: '保麗龍', bucket: 'bad', why: '材料本身傳熱慢，裡面又關著很多空氣。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🧥', title: '空氣是隱形的主角',
            text: '冬天穿好幾件薄衣服常常比一件厚的暖，' +
              '因為真正保暖的是「被困在層與層之間、不會流動的空氣」。' +
              '羽絨衣、保麗龍箱、雙層玻璃，全都是同一招。',
          },
        ],
      },

      {
        heading: '保溫瓶怎麼把三條路全部堵住',
        blocks: [
          {
            type: 'text',
            text: '熱只有三條路，所以要保溫就把三條都擋掉。' +
              '保溫瓶就是照這個邏輯做出來的 —— 它的每一個設計都在擋一條路。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點一個部位，看它在擋哪一條路',
                parts: [
                  {
                    icon: '✨', name: '內層鍍成亮銀色',
                    description: '擋輻射。光亮的表面會把熱射線反射回去，熱就不容易以輻射的方式跑掉。',
                  },
                  {
                    icon: '🫙', name: '夾層抽成真空',
                    description: '擋傳導和對流。這兩條路都需要介質，夾層裡幾乎沒有空氣，' +
                      '熱就過不去。',
                  },
                  {
                    icon: '🧢', name: '瓶蓋旋緊',
                    description: '擋對流。熱空氣和水蒸氣跑掉就等於把熱帶走，蓋好可以減少這種損失。',
                  },
                  {
                    icon: '🧱', name: '外殼用塑膠',
                    description: '擋傳導。塑膠是不良導體，手拿著不燙，熱也不容易從外殼傳出去。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '要保溫，還是要散熱？',
        blocks: [
          {
            type: 'text',
            text: '同樣的道理反過來用就是散熱：想讓熱快點跑掉，就把三條路通通打開。' +
              '電腦的散熱片做成一片一片的，就是為了增加接觸空氣的面積。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'keep', label: '為了保溫（留住熱）' },
                  { id: 'lose', label: '為了散熱（趕走熱）' },
                ],
                items: [
                  { text: '煮湯的時候蓋上鍋蓋', bucket: 'keep', why: '減少熱和水蒸氣跑掉。' },
                  { text: '把冰塊用棉被包起來', bucket: 'keep', why: '棉被擋住外面的熱傳進去，冰塊融得比較慢。' },
                  { text: '冬天戴毛帽', bucket: 'keep', why: '毛線裡困住空氣，減少頭部散熱。' },
                  { text: '把熱湯倒在大盤子上攤開', bucket: 'lose', why: '表面積變大，散熱變快，湯涼得快。' },
                  { text: '電腦裝風扇和鰭狀散熱片', bucket: 'lose', why: '加大面積又帶動空氣流動，把熱快點帶走。' },
                  { text: '狗熱的時候伸舌頭喘氣', bucket: 'lose', why: '靠舌頭上的水分蒸發帶走熱量。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🧊', title: '棉被不是只會保暖',
            text: '很多人以為棉被是「製造溫暖」。其實棉被只是不良導體，' +
              '它做的事是「擋住熱的進出」。所以包冰塊它就讓冰塊撐得更久。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '大太陽底下穿深色衣服比淺色熱，為什麼？',
                    options: ['深色吸收比較多輻射熱', '深色比較厚', '深色比較重'],
                    answer: 0,
                    explanation: '深色表面吸收輻射熱的能力強，淺色會反射掉比較多，所以夏天穿淺色涼。',
                  },
                  {
                    question: '冷氣機裝在房間高處、暖氣裝在低處，是利用什麼？',
                    options: ['空氣的對流', '熱的傳導', '熱的輻射'],
                    answer: 0,
                    explanation: '冷空氣下沉、熱空氣上升，順著對流的方向裝，整個房間才會均勻。',
                  },
                  {
                    question: '散熱片為什麼要做成一片一片的鰭狀？',
                    options: ['增加和空氣接觸的面積', '比較省材料', '為了好拆'],
                    answer: 0,
                    explanation: '接觸空氣的面積越大，同樣時間能散掉的熱就越多。',
                  },
                ],
              });
            },
          },
        ],
      },
    ],
  };

  window.LESSON_PACKS = window.LESSON_PACKS || [];
  window.LESSON_PACKS.push({
    key: 'science', subject: '自然', icon: '🔬',
    grade: 5, term: '下', version: 'kang', versionName: '康軒版',
    note: '四個單元對齊闖關站五下自然的題庫，卡住的時候可以互相跳。',
    units: [force, earth, plants, heat],
  });
})();
