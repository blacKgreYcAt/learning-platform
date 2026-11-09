/**
 * 五上自然（康軒）· 引導式教學
 * 2026-11-09
 *
 * 四個單元對齊闖關站 science-5a-kang-20261105.js 的四個單元，
 * 小孩在題庫卡住的時候，「先看教學」才連得回同一個觀念。
 *
 * 寫法：先給現象，再給名詞。自然科最容易變成背名詞 ——
 * 「恆溫動物」四個字背起來很快，但問他企鵝是不是恆溫就不會了，
 * 因為他背的是詞，不是那件事。所以每個名詞前面都先放一個他看得到的現象。
 */

'use strict';

(function () {
  var G5 = window.G5;
  var ChoiceQuiz = G5.ChoiceQuiz, SortBuckets = G5.SortBuckets,
      TapPairing = G5.TapPairing, LabeledDiagram = G5.LabeledDiagram,
      CompareToggle = G5.CompareToggle, MirrorFold = G5.MirrorFold, El = G5.El;

  /* ══════════════════════════════════════════════
     單元 1：動物世界
     ══════════════════════════════════════════════ */
  var animals = {
    id: 'k5a-sci-animals',
    grade: 5, semester: '上', order: 1,
    title: '單元 1　動物世界',
    subtitle: '先學會怎麼分，才記得住誰是誰',
    icon: '🐾',
    estimatedMinutes: 35,
    objectives: [
      '知道分類的依據是「特徵」，不是外表像不像',
      '分得出脊椎動物和無脊椎動物',
      '說得出脊椎動物五大類的特徵',
      '分得清楚卵生和胎生、恆溫和變溫',
      '不會被鯨魚、蝙蝠、企鵝這幾個「長得不像」的動物騙到',
    ],
    wrapUp: '這個單元的題目幾乎都在考「依據」。看到一題先問自己：它是用什麼特徵在分？' +
      '是脊椎？是繁殖方式？還是呼吸方式？抓對依據，答案就出來了。',

    sections: [
      {
        heading: '為什麼要把動物分類？',
        blocks: [
          {
            type: 'text',
            text: '地球上的動物超過一百萬種。如果沒有分類，每認識一種就要從頭記一次，' +
              '誰都記不完。',
          },
          {
            type: 'text',
            text: '分類的好處是：知道一隻動物屬於哪一類，就等於一次知道了牠的很多事 —— ' +
              '怎麼呼吸、怎麼生小孩、體溫會不會變。',
          },
          {
            type: 'callout', icon: '🔑', title: '最重要的一句',
            text: '分類要看「特徵」，不是看「長得像不像」。' +
              '海豚長得很像魚，但牠是哺乳類；蝙蝠會飛，但牠不是鳥。' +
              '這個單元的陷阱題全部都從這裡來。',
          },
        ],
      },

      {
        heading: '第一刀：有沒有脊椎',
        blocks: [
          {
            type: 'text',
            text: '摸摸自己的背，中間那一條硬硬的骨頭就是脊椎。' +
              '動物最大的一次分類，就是看牠有沒有這條骨頭。',
          },
          {
            type: 'text',
            text: '有脊椎的叫脊椎動物，沒有的叫無脊椎動物。' +
              '地球上其實絕大多數動物都是無脊椎動物 —— 昆蟲就佔了一大半。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                buckets: [
                  { id: 'y', label: '脊椎動物' },
                  { id: 'n', label: '無脊椎動物' },
                ],
                items: [
                  { text: '青蛙', bucket: 'y', why: '兩生類，有脊椎。' },
                  { text: '蝴蝶', bucket: 'n', why: '昆蟲，身體外面是外骨骼，裡面沒有脊椎。' },
                  { text: '鯊魚', bucket: 'y', why: '魚類，有脊椎。' },
                  { text: '蚯蚓', bucket: 'n', why: '身體軟軟的，沒有骨頭。' },
                  { text: '麻雀', bucket: 'y', why: '鳥類，有脊椎。' },
                  { text: '螃蟹', bucket: 'n', why: '硬殼在外面，那是外骨骼不是脊椎。' },
                  { text: '蝙蝠', bucket: 'y', why: '哺乳類，有脊椎。會飛跟有沒有脊椎沒關係。' },
                  { text: '水母', bucket: 'n', why: '身體幾乎都是水，連骨頭都沒有。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🦀', title: '容易搞混',
            text: '螃蟹、蝦子、昆蟲身上都有硬殼，但那是長在外面的「外骨骼」。' +
              '脊椎是長在身體裡面的。判斷方法：硬的在外面還是在裡面？',
          },
        ],
      },

      {
        heading: '脊椎動物的五大類',
        blocks: [
          {
            type: 'text',
            text: '有脊椎的動物再分成五類。點點看每一類，注意牠們的「身體表面」、' +
              '「呼吸方式」和「怎麼生小孩」—— 考試考的就是這三件事。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點一類看看牠的特徵',
                parts: [
                  {
                    name: '魚類', icon: '🐟',
                    description: '身體表面有鱗片，用鰓呼吸，卵生，變溫動物。' +
                      '一輩子都住在水裡。例如：鯉魚、鯊魚、鮪魚。',
                  },
                  {
                    name: '兩生類', icon: '🐸',
                    description: '皮膚裸露潮濕，小時候住水裡用鰓呼吸，長大用肺和皮膚呼吸，' +
                      '卵生，變溫動物。例如：青蛙、蟾蜍、山椒魚。',
                  },
                  {
                    name: '爬蟲類', icon: '🦎',
                    description: '身體表面有鱗片或硬殼，用肺呼吸，大多卵生，變溫動物。' +
                      '例如：蛇、蜥蜴、烏龜、鱷魚。',
                  },
                  {
                    name: '鳥類', icon: '🐦',
                    description: '身體表面有羽毛，用肺呼吸，卵生，恆溫動物。' +
                      '例如：麻雀、老鷹、企鵝、鴕鳥。',
                  },
                  {
                    name: '哺乳類', icon: '🐘',
                    description: '身體表面有毛，用肺呼吸，胎生而且餵母奶，恆溫動物。' +
                      '例如：人、狗、鯨魚、蝙蝠。',
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '📌', title: '一句話抓重點',
            text: '身體表面是最好認的線索：鱗片（魚、爬蟲）、濕皮膚（兩生）、' +
              '羽毛（鳥）、毛（哺乳）。先看表面，再看其他。',
          },
        ],
      },

      {
        heading: '卵生還是胎生？',
        blocks: [
          {
            type: 'text',
            text: '生小孩的方式分兩種：媽媽生蛋、小寶寶從蛋裡孵出來，叫「卵生」；' +
              '小寶寶在媽媽肚子裡長好才生出來，叫「胎生」。',
          },
          {
            type: 'text',
            text: '五大類裡面，只有哺乳類是胎生的，其他四類都是卵生。' +
              '所以看到「胎生」兩個字，幾乎可以直接想到哺乳類。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                buckets: [
                  { id: 'e', label: '卵生' },
                  { id: 'v', label: '胎生' },
                ],
                items: [
                  { text: '企鵝', bucket: 'e', why: '鳥類，會下蛋孵蛋。住在南極跟卵生沒關係。' },
                  { text: '海豚', bucket: 'v', why: '哺乳類，在水裡生寶寶、餵母奶。' },
                  { text: '烏龜', bucket: 'e', why: '爬蟲類，會上岸挖洞下蛋。' },
                  { text: '蝙蝠', bucket: 'v', why: '哺乳類，會飛但一樣是胎生、餵母奶。' },
                  { text: '青蛙', bucket: 'e', why: '兩生類，在水裡產卵。' },
                  { text: '鯨魚', bucket: 'v', why: '哺乳類。名字裡有「魚」，但牠是胎生、用肺呼吸。' },
                  { text: '鴨嘴獸', bucket: 'e', why: '這是哺乳類裡的大例外 —— 牠會下蛋，但也餵母奶。考試不常考，但知道一下很酷。' },
                  { text: '鴕鳥', bucket: 'e', why: '鳥類，而且下的是世界上最大的蛋。' },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '呼吸和體溫',
        blocks: [
          {
            type: 'text',
            text: '呼吸看的是「從哪裡拿到氧氣」：住水裡的多半用鰓，住陸地的用肺。' +
              '兩生類很特別，一生用過兩種。',
          },
          {
            type: 'text',
            text: '體溫分兩種。體溫會跟著環境一起變的叫「變溫動物」，' +
              '體溫自己維持得住、不太受環境影響的叫「恆溫動物」。',
          },
          {
            type: 'callout', icon: '🌡️', title: '為什麼蛇要曬太陽',
            text: '因為蛇是變溫動物，天冷的時候體溫就低、動不了，只好靠太陽加溫。' +
              '人是恆溫動物，再冷體溫都維持在 37 度左右，所以我們不用曬太陽取暖。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '魚類' },
                  { id: 'b', text: '鳥類' },
                  { id: 'c', text: '哺乳類' },
                  { id: 'd', text: '爬蟲類' },
                  { id: 'e', text: '兩生類' },
                ],
                right: [
                  { id: '1', text: '鰓呼吸・變溫' },
                  { id: '2', text: '肺呼吸・恆溫・卵生' },
                  { id: '3', text: '肺呼吸・恆溫・胎生' },
                  { id: '4', text: '肺呼吸・變溫・有鱗片' },
                  { id: '5', text: '小時候鰓、長大肺和皮膚' },
                ],
                pairs: { a: '1', b: '2', c: '3', d: '4', e: '5' },
              });
            },
          },
        ],
      },

      {
        heading: '最會騙人的那幾隻',
        blocks: [
          {
            type: 'text',
            text: '這個單元考試最常錯的，就是那些「長得不像自己那一類」的動物。' +
              '下面七隻全部都是考古題常客。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'f', label: '魚類' },
                  { id: 'b', label: '鳥類' },
                  { id: 'm', label: '哺乳類' },
                  { id: 'r', label: '爬蟲類' },
                ],
                items: [
                  { text: '鯨魚：住海裡，但用肺呼吸、胎生、餵母奶', bucket: 'm', why: '名字騙人。牠要浮上水面換氣，就是用肺的證據。' },
                  { text: '海豚：住海裡，會換氣，生寶寶餵奶', bucket: 'm', why: '跟鯨魚同一類，不是魚。' },
                  { text: '蝙蝠：會飛，身上有毛，胎生餵奶', bucket: 'm', why: '會飛的不一定是鳥。有毛、胎生、餵奶就是哺乳類。' },
                  { text: '企鵝：不會飛，住南極，身上有羽毛，會下蛋', bucket: 'b', why: '有羽毛、卵生，就是鳥。會不會飛不是判斷依據。' },
                  { text: '鴕鳥：不會飛，跑很快，會下蛋，有羽毛', bucket: 'b', why: '一樣，有羽毛就是鳥類。' },
                  { text: '鯊魚：住海裡，用鰓呼吸，身上有鱗片', bucket: 'f', why: '這隻是真的魚。' },
                  { text: '海龜：住海裡，但要浮上來換氣，會上岸下蛋', bucket: 'r', why: '用肺呼吸、有硬殼，是爬蟲類不是魚。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🎯', title: '一招破解',
            text: '遇到不確定的動物，問三個問題：牠用什麼呼吸？牠怎麼生小孩？牠身體表面長什麼？' +
              '三個答案合起來就知道是哪一類。千萬不要用「牠住哪裡」或「會不會飛」來判斷。',
          },
        ],
      },

      {
        heading: '最後檢查一次',
        blocks: [
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '下面哪一隻是哺乳類？',
                    hint: '想想看誰會餵母奶。',
                    options: ['企鵝', '海豚', '海龜', '鯊魚'],
                    answer: 1,
                    explanation: '海豚用肺呼吸、胎生、餵母奶，是哺乳類。其他三隻分別是鳥類、爬蟲類、魚類。',
                  },
                  {
                    question: '青蛙小時候和長大後的呼吸方式有什麼不同？',
                    options: [
                      '一直都用肺',
                      '一直都用鰓',
                      '小時候用鰓，長大用肺和皮膚',
                      '小時候用肺，長大用鰓',
                    ],
                    answer: 2,
                    explanation: '蝌蚪住在水裡用鰓，變成青蛙上岸後改用肺，皮膚也能幫忙吸收氧氣。這是兩生類最大的特色。',
                  },
                  {
                    question: '螃蟹身上硬硬的殼，是不是脊椎？',
                    options: [
                      '是，那就是牠的脊椎',
                      '不是，那是長在外面的外骨骼',
                      '是，只是長在外面',
                      '不一定',
                    ],
                    answer: 1,
                    explanation: '脊椎長在身體裡面。螃蟹的殼在外面，叫外骨骼，所以牠是無脊椎動物。',
                  },
                  {
                    question: '為什麼冬天很少看到蛇？',
                    hint: '蛇是變溫動物。',
                    options: [
                      '因為蛇冬天會死掉',
                      '因為蛇是變溫動物，天冷體溫降低就不太活動',
                      '因為蛇冬天改成水裡生活',
                      '因為蛇冬天改用鰓呼吸',
                    ],
                    answer: 1,
                    explanation: '變溫動物的體溫跟著環境走。天冷時體溫低、行動變慢，所以會躲起來過冬。',
                  },
                  {
                    question: '分類動物的時候，下面哪一個「不能」當作依據？',
                    options: ['有沒有脊椎', '怎麼呼吸', '住在哪裡', '身體表面長什麼'],
                    answer: 2,
                    explanation: '住哪裡不能當依據 —— 海裡有魚類（鯊魚）、哺乳類（鯨魚）、爬蟲類（海龜），三類都有。',
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
     單元 2：探索聲光世界
     ══════════════════════════════════════════════ */
  var soundLight = {
    id: 'k5a-sci-soundlight',
    grade: 5, semester: '上', order: 2,
    title: '單元 2　探索聲光世界',
    subtitle: '聲音要有東西才傳得出去，光只走直線',
    icon: '🎺',
    estimatedMinutes: 35,
    objectives: [
      '知道聲音是物體振動產生的',
      '知道聲音需要介質，真空中傳不出去',
      '分得清楚音量（大小聲）和音調（高低音）',
      '知道光沿直線前進，所以會有影子',
      '知道鏡子成像是左右相反的',
      '知道光從一種物質進到另一種會折射',
    ],
    wrapUp: '聲音和光最大的差別：聲音一定要有東西幫忙傳，光不用 —— ' +
      '太陽光可以穿過真空來到地球，但太陽爆炸的聲音永遠傳不過來。記住這一條，半個單元就通了。',

    sections: [
      {
        heading: '把手放在喉嚨上說話',
        blocks: [
          {
            type: 'text',
            text: '把手輕輕放在喉嚨上，然後說「啊——」。你會感覺到麻麻的、抖抖的。',
          },
          {
            type: 'text',
            text: '那個抖動就是「振動」。聲音就是這樣來的：物體振動，帶動旁邊的空氣一起抖，' +
              '一路抖到你的耳朵。',
          },
          {
            type: 'callout', icon: '🔔', title: '反過來也成立',
            text: '想讓聲音停下來，就讓它停止振動。敲完的鐘用手按住就不響了 —— ' +
              '不是因為你擋住聲音，是因為你讓它不能再振動。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '敲鼓的時候，鼓面上的紙屑會怎麼樣？',
                    options: ['不動', '跳起來', '被吸住', '融化'],
                    answer: 1,
                    explanation: '鼓面在振動，所以紙屑會跳動。這是「聲音來自振動」最好的證據。',
                  },
                  {
                    question: '下面哪一個「不是」靠振動發出聲音的？',
                    hint: '仔細想，其實全部都是。',
                    options: ['吉他的弦', '人的聲帶', '鼓面', '以上都是靠振動'],
                    answer: 3,
                    explanation: '所有的聲音都來自振動，沒有例外。這是這個單元最根本的一句話。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '聲音需要有人幫它傳',
        blocks: [
          {
            type: 'text',
            text: '振動要傳到你的耳朵，中間必須有東西幫忙接力。這個「幫忙的東西」叫做介質。',
          },
          {
            type: 'text',
            text: '空氣可以當介質，水也可以，固體更好 —— 把耳朵貼在桌面上，' +
              '另一端輕輕敲，你會聽得比用空氣傳還清楚。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'y', label: '聲音傳得過去' },
                  { id: 'n', label: '聲音傳不過去' },
                ],
                items: [
                  { text: '在教室裡講話（空氣）', bucket: 'y', why: '空氣是最常見的介質。' },
                  { text: '在游泳池裡聽到有人敲池壁（水）', bucket: 'y', why: '液體也可以傳聲，而且傳得比空氣快。' },
                  { text: '耳朵貼著桌子，聽另一端的敲擊（固體）', bucket: 'y', why: '固體傳聲最快也最清楚。' },
                  { text: '在月球表面上講話（沒有空氣）', bucket: 'n', why: '月球上幾乎是真空，沒有介質，聲音傳不出去。' },
                  { text: '太空中兩艘太空船互相喊話', bucket: 'n', why: '太空是真空，所以太空人要用無線電，那是電磁波不是聲音。' },
                  { text: '抽成真空的玻璃罩裡放鬧鐘', bucket: 'n', why: '看得到指針在動，但聽不到聲音 —— 這是課本上的經典實驗。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🌙', title: '電影騙了你',
            text: '電影裡太空船爆炸轟隆隆很熱鬧，但真實的太空是完全安靜的。' +
              '沒有介質，再大的爆炸也傳不出一點聲音。',
          },
        ],
      },

      {
        heading: '大小聲 ≠ 高低音',
        blocks: [
          {
            type: 'text',
            text: '這兩個很容易混在一起。它們是完全不同的兩件事，由不同的原因決定。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '音量（大小聲）',
                    note: '由「振動的幅度」決定。用力敲，振幅大，聲音就大。' +
                      '單位是分貝（dB）。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '輕輕敲鼓 → 鼓面抖動的範圍小 → 小聲'),
                        El('p', { class: 'lesson-text' },
                          '用力敲鼓 → 鼓面抖動的範圍大 → 大聲'));
                    },
                  },
                  {
                    label: '音調（高低音）',
                    note: '由「振動的快慢」決定。振動得越快，音越高。' +
                      '跟你用多大力氣完全沒關係。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '弦拉緊、弦比較短、弦比較細 → 振動快 → 高音'),
                        El('p', { class: 'lesson-text' },
                          '弦放鬆、弦比較長、弦比較粗 → 振動慢 → 低音'));
                    },
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
                  { id: 'v', label: '改變的是音量' },
                  { id: 'p', label: '改變的是音調' },
                ],
                items: [
                  { text: '更用力地敲木琴', bucket: 'v', why: '力氣大小影響振幅，也就是音量。' },
                  { text: '敲木琴比較短的那一根', bucket: 'p', why: '短的振動快，音比較高。' },
                  { text: '把吉他的弦調得更緊', bucket: 'p', why: '越緊振動越快，音越高。' },
                  { text: '把電視音量轉大', bucket: 'v', why: '這是標準的音量。' },
                  { text: '水瓶裡的水裝多一點再吹瓶口', bucket: 'p', why: '空氣柱變短、振動變快，音變高。' },
                  { text: '離講話的人更近一點', bucket: 'v', why: '聽起來比較大聲，但音高沒變。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🎸', title: '三個字記住音調',
            text: '緊、短、細 → 高音。鬆、長、粗 → 低音。' +
              '看看吉他：最細的那條弦音最高，最粗的那條最低。',
          },
        ],
      },

      {
        heading: '光只會走直線',
        blocks: [
          {
            type: 'text',
            text: '光從光源射出來之後，只會筆直地走，不會自己轉彎。' +
              '這一句話就能解釋影子、日食，還有為什麼躲在牆後面看不到外面。',
          },
          {
            type: 'text',
            text: '影子怎麼來的：光直直往前走，遇到不透光的東西被擋住，' +
              '後面那一塊照不到光的地方就是影子。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '牆和玩具的位置都不動，把手電筒往玩具靠近，牆上的影子會？',
                    hint: '光是從一點散開的，越靠近擋住它的東西，散開的角度就吃掉越大一片牆。',
                    options: ['變大', '變小', '不變', '會消失'],
                    answer: 0,
                    explanation: '光源越靠近物體，影子越大；越遠離，影子越小、越接近物體本身的大小。' +
                      '拿手電筒和一隻手實際試一次最快。',
                  },
                  {
                    question: '下面哪一個東西「會」產生清楚的影子？',
                    options: ['透明玻璃', '清水', '木板', '空氣'],
                    answer: 2,
                    explanation: '木板不透光，會完全擋住光線，所以影子清楚。透明的東西光會穿過去。',
                  },
                  {
                    question: '為什麼在一面牆後面就看不見牆另一邊的東西？',
                    options: [
                      '因為光被牆吸收了',
                      '因為光只走直線，不會繞過牆',
                      '因為牆會把光變暗',
                      '因為距離太遠',
                    ],
                    answer: 1,
                    explanation: '光沿直線前進，碰到牆就停住，不會自己轉彎繞過去。聲音反而可以繞過牆，所以聽得到。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '鏡子裡的你，左右是相反的',
        blocks: [
          {
            type: 'text',
            text: '光碰到光滑的表面會彈回來，這叫「反射」。鏡子就是靠反射成像的。',
          },
          {
            type: 'text',
            text: '鏡子裡的像有三個特點：大小一樣、左右相反、看起來在鏡子後面一樣遠的地方。',
          },
          {
            type: 'text',
            text: '下面這個練習跟數學的線對稱是同一件事 —— 把中間的線當成鏡面，' +
              '點出右邊「鏡子裡」會看到的樣子。',
          },
          {
            type: 'component',
            build: function () {
              return new MirrorFold({
                cols: 8, rows: 6,
                shape: [
                  [1, 1], [2, 1], [3, 1],
                  [1, 2],
                  [1, 3], [2, 3],
                  [1, 4],
                  [1, 5], [2, 5], [3, 5],
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🚑', title: '救護車為什麼把字反過來寫',
            text: '救護車前面寫的是反過來的「護救」，' +
              '因為前車的駕駛是從後照鏡看到它的 —— 鏡子裡左右相反，剛好轉正。',
          },
        ],
      },

      {
        heading: '水裡的筷子為什麼斷掉',
        blocks: [
          {
            type: 'text',
            text: '把筷子斜插進水杯裡，從旁邊看會發現它好像在水面的地方折斷了。' +
              '筷子當然沒斷，是光轉彎了。',
          },
          {
            type: 'text',
            text: '光從一種物質進到另一種物質（例如從水進到空氣），' +
              '在交界處會轉個彎再繼續走。這叫「折射」。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '反射',
                    note: '光「彈回來」，還留在原來的那一邊。鏡子、平靜的水面都是。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '光 → 碰到鏡面 → 彈回原來那一邊'));
                    },
                  },
                  {
                    label: '折射',
                    note: '光「穿過去」，但在交界處轉了個彎。筷子看起來斷掉、' +
                      '水看起來比較淺，都是折射。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '光 → 從水進到空氣 → 轉個彎繼續走'));
                    },
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🏊', title: '所以游泳池看起來比較淺',
            text: '池底反射的光從水進到空氣時折射了，讓你覺得池底比實際位置高。' +
              '這就是為什麼「看起來不深」的水，下去才發現踩不到底 —— 很危險，要小心。',
          },
        ],
      },

      {
        heading: '最後檢查一次',
        blocks: [
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '在月球上，太空人能不能直接聽到對方說話？',
                    options: [
                      '可以，跟地球一樣',
                      '不行，月球上沒有空氣當介質',
                      '可以，但要很大聲',
                      '不行，因為月球太冷',
                    ],
                    answer: 1,
                    explanation: '聲音要靠介質傳播，月球表面幾乎真空，所以只能用無線電。',
                  },
                  {
                    question: '把吉他弦調緊一點，彈出來的聲音會？',
                    options: ['變大聲', '變小聲', '音變高', '音變低'],
                    answer: 2,
                    explanation: '緊 → 振動快 → 音調高。鬆緊改變的是音調，不是音量。',
                  },
                  {
                    question: '下面哪一個現象是「折射」？',
                    options: [
                      '照鏡子看到自己',
                      '筷子插在水裡看起來斷掉',
                      '牆上出現手的影子',
                      '在山谷裡大喊有回音',
                    ],
                    answer: 1,
                    explanation: '光穿過水和空氣的交界處轉彎，所以筷子看起來斷了。照鏡子是反射，影子是直線前進，回音是聲音的反射。',
                  },
                  {
                    question: '鏡子裡看到的自己，和真實的自己比起來？',
                    options: [
                      '比較小',
                      '上下顛倒',
                      '左右相反，大小一樣',
                      '完全一樣，沒有差別',
                    ],
                    answer: 2,
                    explanation: '平面鏡成像大小相同、左右相反。舉右手時，鏡中的人舉的是你看起來的左邊那隻手。',
                  },
                  {
                    question: '為什麼聽得到牆後面的人說話，卻看不到他？',
                    hint: '聲音和光的傳播方式不一樣。',
                    options: [
                      '因為聲音比較大聲',
                      '因為聲音可以繞過障礙物，光只走直線',
                      '因為牆會擋住聲音',
                      '因為光跑得比較慢',
                    ],
                    answer: 1,
                    explanation: '聲音會繞過障礙物（繞射），光幾乎不會，只直直前進。這是聲和光最明顯的差別之一。',
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
     單元 3：神祕的天空
     ══════════════════════════════════════════════ */
  var sky = {
    id: 'k5a-sci-sky',
    grade: 5, semester: '上', order: 3,
    title: '單元 3　神祕的天空',
    subtitle: '太陽、月亮、星星，都在照自己的規律走',
    icon: '🌌',
    estimatedMinutes: 35,
    objectives: [
      '知道太陽東升西落，一天中影子的方向和長短怎麼變',
      '會用影子判斷方位和大概的時間',
      '說得出月相變化的順序和週期',
      '知道月相改變是因為日、地、月的相對位置改變',
      '會用北斗七星找到北極星',
    ],
    wrapUp: '天文的東西看起來很遠，但規律都很固定。' +
      '太陽一天走一圈、月亮一個月變一輪、星空一年轉一圈 —— ' +
      '把週期記住，題目就只是在問你「現在走到哪裡」。',

    sections: [
      {
        heading: '太陽的一天',
        blocks: [
          {
            type: 'text',
            text: '太陽從東邊升起，中午升到最高，然後往西邊落下。' +
              '這件事每天都一樣，不管哪個季節。',
          },
          {
            type: 'text',
            text: '因為太陽在動，影子也跟著動 —— 而且影子的方向，永遠跟太陽相反。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '早上　太陽在東邊' },
                  { id: 'b', text: '中午　太陽在正上方（偏南）' },
                  { id: 'c', text: '傍晚　太陽在西邊' },
                ],
                right: [
                  { id: '1', text: '影子朝西，而且很長' },
                  { id: '2', text: '影子朝北，而且最短' },
                  { id: '3', text: '影子朝東，而且很長' },
                ],
                pairs: { a: '1', b: '2', c: '3' },
              });
            },
          },
          {
            type: 'callout', icon: '☀️', title: '兩條規律',
            text: '一、影子和太陽方向相反。二、太陽越高，影子越短；太陽越低，影子越長。' +
              '所以一天之中，中午的影子最短。',
          },
        ],
      },

      {
        heading: '用影子找方向',
        blocks: [
          {
            type: 'text',
            text: '在臺灣，中午的太陽大致在南方偏高的位置，所以中午的影子會指向北方。' +
              '只要知道這一件事，在野外沒有指南針也不會迷路。',
          },
          {
            type: 'text',
            text: '找到北方之後，其他三個方位就出來了：面向北方，右手邊是東，' +
              '左手邊是西，背後是南。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '在臺灣，中午竿子的影子指向哪個方位？',
                    options: ['東', '西', '南', '北'],
                    answer: 3,
                    explanation: '中午太陽在南邊，影子跟太陽相反，所以指向北方。',
                  },
                  {
                    question: '早上七點，你的影子會在你的哪一邊？',
                    hint: '早上太陽在東邊。',
                    options: ['東邊', '西邊', '南邊', '北邊'],
                    answer: 1,
                    explanation: '太陽在東，影子就在西。',
                  },
                  {
                    question: '一天之中，影子最短的時候大約是幾點？',
                    options: ['早上 6 點', '中午 12 點左右', '下午 3 點', '傍晚 6 點'],
                    answer: 1,
                    explanation: '中午太陽最高，影子最短。早晚太陽低，影子拉得很長。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '月亮為什麼會變臉',
        blocks: [
          {
            type: 'text',
            text: '月亮本身不會發光，我們看到的是它反射的太陽光。' +
              '月亮繞著地球轉，三者的相對位置一直在變，' +
              '所以我們看到「被照亮的那一面」有多少也一直在變。',
          },
          {
            type: 'callout', icon: '🌔', title: '關鍵觀念',
            text: '月亮的形狀沒有真的改變，改變的是我們看得到多少被照亮的部分。' +
              '月亮永遠有一半是亮的，只是我們的角度不同。',
          },
          {
            type: 'text',
            text: '月相變化的週期大約是 29.5 天，差不多一個月，所以叫「月」。' +
              '順序是固定的，不會跳著來。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '新月（朔）' },
                  { id: 'b', text: '上弦月' },
                  { id: 'c', text: '滿月（望）' },
                  { id: 'd', text: '下弦月' },
                ],
                right: [
                  { id: '1', text: '農曆初一・幾乎看不到' },
                  { id: '2', text: '農曆初七、初八・右半邊亮' },
                  { id: '3', text: '農曆十五、十六・整個圓' },
                  { id: '4', text: '農曆廿二、廿三・左半邊亮' },
                ],
                pairs: { a: '1', b: '2', c: '3', d: '4' },
              });
            },
          },
          {
            type: 'callout', icon: '📅', title: '記順序的小訣竅',
            text: '新月 → 上弦 → 滿月 → 下弦 → 新月，' +
              '亮的部分「由無到有、再由有到無」。' +
              '上弦月亮右邊、下弦月亮左邊 —— 上右下左，四個字。',
          },
        ],
      },

      {
        heading: '月亮什麼時候看得到',
        blocks: [
          {
            type: 'text',
            text: '很多人以為月亮只有晚上才出現，其實不是。' +
              '月相不同，升起和落下的時間也不同。',
          },
          {
            type: 'text',
            text: '滿月的時候，太陽下山月亮就升起，整個晚上都看得到，天亮時落下 —— ' +
              '因為它剛好在地球的另一邊。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '滿月大約在什麼時候升起？',
                    hint: '滿月時，太陽和月亮在地球的兩邊。',
                    options: ['中午', '傍晚太陽下山時', '半夜', '清晨'],
                    answer: 1,
                    explanation: '滿月時日、地、月排成一線，太陽一落下月亮就升起，所以整夜都看得到。',
                  },
                  {
                    question: '新月（農曆初一）為什麼幾乎看不到月亮？',
                    options: [
                      '因為月亮跑掉了',
                      '因為月亮被地球擋住',
                      '因為被照亮的那一面背對著我們',
                      '因為月亮那天不發光',
                    ],
                    answer: 2,
                    explanation: '新月時月亮在太陽和地球之間，被照亮的那一面朝著太陽、背對我們，所以看不到。',
                  },
                  {
                    question: '月相變化一個完整的週期大約幾天？',
                    options: ['7 天', '15 天', '30 天左右', '365 天'],
                    answer: 2,
                    explanation: '大約 29.5 天，所以農曆一個月差不多 29 或 30 天。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '找到北極星',
        blocks: [
          {
            type: 'text',
            text: '天上的星星每晚都在移動，但有一顆幾乎不動 —— 北極星。' +
              '因為它剛好在地球自轉軸的正上方，所有星星都繞著它轉。',
          },
          {
            type: 'text',
            text: '找法：先找到北斗七星（像一個勺子），' +
              '把勺口前面那兩顆星連成一條線，往勺口方向延長大約五倍，就會碰到北極星。',
          },
          {
            type: 'callout', icon: '⭐', title: '北極星的用處',
            text: '北極星的方向就是正北方，而且整晚都不會變。' +
              '古時候航海和趕路都靠它 —— 它是天上的指南針。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '北極星在天空中的哪個方位？',
                    options: ['東方', '西方', '南方', '北方'],
                    answer: 3,
                    explanation: '北極星指的就是正北方，這也是它名字的由來。',
                  },
                  {
                    question: '為什麼北極星看起來幾乎不動？',
                    options: [
                      '因為它離地球最近',
                      '因為它最亮',
                      '因為它剛好在地球自轉軸的正上方',
                      '因為它不是星星',
                    ],
                    answer: 2,
                    explanation: '地球自轉的軸正好指向它，所以它看起來固定在原地，其他星星繞著它轉。',
                  },
                  {
                    question: '用北斗七星找北極星，要用哪兩顆星？',
                    options: [
                      '勺柄最末端的兩顆',
                      '勺口前端的兩顆',
                      '最亮的兩顆',
                      '中間的兩顆',
                    ],
                    answer: 1,
                    explanation: '勺口前端那兩顆連線延長約五倍距離，就是北極星。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '星空一年轉一圈',
        blocks: [
          {
            type: 'text',
            text: '夏天的晚上和冬天的晚上，看到的星座完全不一樣。' +
              '夏天有天琴座、天鵝座、天鷹座；冬天有獵戶座。',
          },
          {
            type: 'text',
            text: '原因是地球繞著太陽公轉。走到不同位置，晚上背對太陽的那一面，' +
              '面向的宇宙方向就不同，看到的星星自然不同。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                buckets: [
                  { id: 's', label: '夏天的星空' },
                  { id: 'w', label: '冬天的星空' },
                  { id: 'a', label: '一年四季都看得到' },
                ],
                items: [
                  { text: '獵戶座', bucket: 'w', why: '冬天最明顯的星座，腰帶三顆星排成一直線。' },
                  { text: '天鵝座', bucket: 's', why: '夏季大三角的成員之一。' },
                  { text: '北斗七星', bucket: 'a', why: '在北方天空繞著北極星轉，整年都看得到。' },
                  { text: '天琴座（織女星）', bucket: 's', why: '夏季大三角，七夕的故事就是它。' },
                  { text: '北極星', bucket: 'a', why: '固定在正北方，不會因季節消失。' },
                  { text: '天鷹座（牛郎星）', bucket: 's', why: '夏季大三角的另一個成員。' },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '最後檢查一次',
        blocks: [
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '下午三點，太陽在西南方，影子會指向哪裡？',
                    hint: '影子和太陽方向相反。',
                    options: ['西南方', '東北方', '正北方', '正南方'],
                    answer: 1,
                    explanation: '影子永遠和太陽方向相反，太陽在西南，影子就朝東北。',
                  },
                  {
                    question: '農曆十五的月亮是什麼形狀？',
                    options: ['看不到', '右半邊亮', '整個圓的', '左半邊亮'],
                    answer: 2,
                    explanation: '農曆十五、十六是滿月，整個圓的。',
                  },
                  {
                    question: '月亮自己會不會發光？',
                    options: [
                      '會，所以晚上很亮',
                      '不會，我們看到的是它反射的太陽光',
                      '白天會，晚上不會',
                      '滿月時會，其他時候不會',
                    ],
                    answer: 1,
                    explanation: '月亮不發光，靠反射太陽光。這也是月相會變化的根本原因。',
                  },
                  {
                    question: '為什麼夏天和冬天看到的星座不一樣？',
                    options: [
                      '因為星星會搬家',
                      '因為地球繞太陽公轉，晚上面對的宇宙方向不同',
                      '因為夏天天氣比較好',
                      '因為冬天星星比較亮',
                    ],
                    answer: 1,
                    explanation: '地球公轉到不同位置，夜晚朝向的宇宙方向就不同，所以看到的星座會換。',
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
     單元 4：燃燒與生鏽
     ══════════════════════════════════════════════ */
  var burning = {
    id: 'k5a-sci-burning',
    grade: 5, semester: '上', order: 4,
    title: '單元 4　燃燒與生鏽',
    subtitle: '都是跟氧氣作用，只是一個快一個慢',
    icon: '🔥',
    estimatedMinutes: 35,
    objectives: [
      '說得出燃燒的三個要素',
      '知道滅火就是拿掉其中一個要素',
      '知道氧氣助燃、二氧化碳不助燃',
      '知道生鏽需要水和氧氣同時存在',
      '會說出幾種防鏽的方法和它們的原理',
    ],
    wrapUp: '燃燒和生鏽看起來完全不同，其實是同一件事的快慢版本 —— ' +
      '都是物質和氧氣作用。想通這一點，兩邊的題目就會互相幫忙。',

    sections: [
      {
        heading: '蠟燭為什麼會熄掉？',
        blocks: [
          {
            type: 'text',
            text: '點一根蠟燭，拿杯子罩住它。過一下子，火就熄了。為什麼？',
          },
          {
            type: 'text',
            text: '因為杯子裡的氧氣被燒完了。蠟燭還在、溫度也還夠，' +
              '但少了氧氣，燃燒就停下來。',
          },
          {
            type: 'callout', icon: '🔥', title: '燃燒的三個要素',
            text: '可燃物（有東西可以燒）、氧氣（助燃）、溫度達到燃點。' +
              '三個缺一不可 —— 這是整個單元的核心。',
          },
        ],
      },

      {
        heading: '三個要素，一個都不能少',
        blocks: [
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點點看每一個要素',
                parts: [
                  {
                    name: '可燃物', icon: '🪵',
                    description: '會燒的東西，例如木頭、紙、蠟、瓦斯。' +
                      '石頭和鐵塊在一般情況下不會燒，所以不是可燃物。',
                  },
                  {
                    name: '氧氣', icon: '💨',
                    description: '空氣中大約有 21% 的氧氣。氧氣本身不會燒，' +
                      '但它會「幫助」別的東西燒，所以叫助燃物。',
                  },
                  {
                    name: '燃點', icon: '🌡️',
                    description: '每種東西都有一個開始燃燒的最低溫度，叫燃點。' +
                      '溫度沒到燃點，就算有可燃物和氧氣也燒不起來 —— ' +
                      '所以點火的時候要先給它熱。',
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
                    question: '用杯子罩住蠟燭讓它熄滅，是拿掉了哪一個要素？',
                    options: ['可燃物', '氧氣', '溫度', '三個都拿掉了'],
                    answer: 1,
                    explanation: '蠟還在、溫度還夠，只有氧氣用完了。',
                  },
                  {
                    question: '為什麼紙放在桌上不會自己燒起來？',
                    hint: '三個要素裡面，少了哪一個？',
                    options: [
                      '因為沒有可燃物',
                      '因為沒有氧氣',
                      '因為溫度沒有達到燃點',
                      '因為紙不會燒',
                    ],
                    answer: 2,
                    explanation: '紙是可燃物、空氣裡也有氧氣，只差溫度。用火柴加熱到燃點，它就燒起來了。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '滅火：破壞其中一個就好',
        blocks: [
          {
            type: 'text',
            text: '既然三個要素缺一不可，滅火就簡單了 —— 拿掉任何一個都行。' +
              '不同的火災要用不同的方法，就是因為拿掉的東西不一樣。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'f', label: '移除可燃物' },
                  { id: 'o', label: '隔絕氧氣' },
                  { id: 't', label: '降低溫度' },
                ],
                items: [
                  { text: '用水澆熄營火', bucket: 't', why: '水會吸熱，把溫度降到燃點以下。' },
                  { text: '用鍋蓋蓋住燒起來的油鍋', bucket: 'o', why: '蓋住就沒有氧氣進得去。這也是為什麼油鍋起火千萬不能澆水。' },
                  { text: '關掉瓦斯爐的開關', bucket: 'f', why: '不再供應瓦斯，可燃物沒了。' },
                  { text: '森林大火時先砍出一條無樹的防火線', bucket: 'f', why: '讓火前面沒有東西可以燒。' },
                  { text: '用濕棉被壓住火源', bucket: 'o', why: '主要是隔絕空氣，濕的還能順便降溫。' },
                  { text: '二氧化碳滅火器噴向火源', bucket: 'o', why: '二氧化碳比空氣重，會蓋住火源把氧氣擠開。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '⚠️', title: '油鍋起火不能澆水',
            text: '水比油重，倒進去會沉到底部瞬間變成水蒸氣，' +
              '把燃燒的油噴得到處都是，反而更危險。要用鍋蓋悶住。',
          },
        ],
      },

      {
        heading: '氧氣和二氧化碳',
        blocks: [
          {
            type: 'text',
            text: '這兩種氣體在這個單元裡是一對。一個幫助燃燒，一個阻止燃燒。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '氧氣',
                    note: '助燃。把快熄的線香伸進裝滿氧氣的瓶子，會重新燒旺起來 —— ' +
                      '這是檢驗氧氣的標準方法。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '檢驗方法：帶火星的線香 → 伸進去 → 復燃'));
                    },
                  },
                  {
                    label: '二氧化碳',
                    note: '不助燃，而且比空氣重。把燃燒的蠟燭伸進去會馬上熄掉。' +
                      '通入澄清石灰水會變混濁，這是檢驗二氧化碳的方法。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '檢驗方法：通入澄清石灰水 → 變混濁'));
                    },
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
                    question: '要檢驗一瓶氣體是不是氧氣，可以怎麼做？',
                    options: [
                      '聞聞看有沒有味道',
                      '把帶火星的線香伸進去，看會不會復燃',
                      '倒水進去看會不會冒泡',
                      '搖一搖聽聲音',
                    ],
                    answer: 1,
                    explanation: '氧氣助燃，帶火星的線香伸進去會重新燒起來。',
                  },
                  {
                    question: '二氧化碳滅火器為什麼有效？',
                    hint: '二氧化碳有兩個特性。',
                    options: [
                      '因為它很冷',
                      '因為它不助燃，而且比空氣重會蓋住火源',
                      '因為它會吸收可燃物',
                      '因為它會變成水',
                    ],
                    answer: 1,
                    explanation: '不助燃 + 比空氣重，所以會沉下去把氧氣擠開，火就熄了。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '鐵為什麼會生鏽',
        blocks: [
          {
            type: 'text',
            text: '生鏽也是鐵和氧氣作用，只是它慢到你看不見 —— ' +
              '要好幾天甚至好幾個月才看得出來。',
          },
          {
            type: 'text',
            text: '課本上有個經典實驗：三根鐵釘分別放在三種環境裡，過幾天比較誰生鏽。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '乾燥空氣中',
                    note: '只有氧氣、沒有水 → 幾乎不生鏽。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '鐵釘 + 乾燥劑 + 密封 → 結果：沒生鏽'));
                    },
                  },
                  {
                    label: '完全浸在煮沸過的水裡',
                    note: '有水、但煮沸過的水幾乎沒有溶氧，而且上面封油隔絕空氣 → 幾乎不生鏽。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '鐵釘 + 煮沸冷卻的水 + 表面封油 → 結果：沒生鏽'));
                    },
                  },
                  {
                    label: '一半泡水、一半露在空氣中',
                    note: '水和氧氣同時碰得到 → 生鏽最嚴重，而且在水面附近最明顯。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '鐵釘 + 一般的水 + 接觸空氣 → 結果：生鏽'));
                    },
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '💧', title: '實驗告訴我們',
            text: '生鏽要「水」和「氧氣」同時存在，少一個都不會生鏽。' +
              '所以防鏽的方法，全部都是在想辦法擋掉其中一個。',
          },
        ],
      },

      {
        heading: '防鏽的各種方法',
        blocks: [
          {
            type: 'text',
            text: '既然知道條件，防鏽就是把鐵和「水 + 氧氣」隔開。' +
              '下面每一種方法都是同一個原理的不同做法。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'c', label: '在表面蓋一層東西' },
                  { id: 'd', label: '讓環境沒有水氣' },
                  { id: 'm', label: '換成不容易生鏽的材料' },
                ],
                items: [
                  { text: '鐵欄杆上油漆', bucket: 'c', why: '油漆隔開空氣和水。' },
                  { text: '腳踏車鏈條上油', bucket: 'c', why: '油膜隔絕水氣。' },
                  { text: '餅乾盒裡放乾燥劑', bucket: 'd', why: '吸掉水氣，鐵盒就不容易鏽。' },
                  { text: '水龍頭鍍上一層鉻', bucket: 'c', why: '電鍍也是蓋一層保護膜。' },
                  { text: '廚房用不鏽鋼鍋具', bucket: 'm', why: '不鏽鋼裡加了鉻，表面會形成保護層。' },
                  { text: '鐵製工具用完擦乾收好', bucket: 'd', why: '把水擦掉，條件就不成立了。' },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '最後檢查一次',
        blocks: [
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '燃燒的三個要素是什麼？',
                    options: [
                      '可燃物、氧氣、溫度達到燃點',
                      '可燃物、二氧化碳、水',
                      '氧氣、水、溫度',
                      '火柴、木頭、空氣',
                    ],
                    answer: 0,
                    explanation: '可燃物、氧氣、燃點，三個缺一不可。',
                  },
                  {
                    question: '鐵釘在下面哪一種情況下最容易生鏽？',
                    options: [
                      '放在乾燥的密封罐裡',
                      '完全泡在煮沸過並封油的水裡',
                      '一半泡在水裡、一半露在空氣中',
                      '放在冷凍庫裡',
                    ],
                    answer: 2,
                    explanation: '水和氧氣同時碰得到的地方最容易生鏽，所以水面附近鏽得最嚴重。',
                  },
                  {
                    question: '油鍋起火時，正確的處理方式是？',
                    hint: '想想哪一個要素最好拿掉。',
                    options: [
                      '立刻倒一大盆水',
                      '用鍋蓋蓋住，隔絕氧氣',
                      '用扇子搧熄',
                      '把鍋子端起來往外跑',
                    ],
                    answer: 1,
                    explanation: '蓋鍋蓋隔絕氧氣。倒水會讓熱油噴濺，搧風反而送進更多氧氣，端鍋子會燙傷又可能引燃別處。',
                  },
                  {
                    question: '燃燒和生鏽有什麼共同點？',
                    options: [
                      '都會產生火焰',
                      '都是物質和氧氣作用',
                      '都需要很高的溫度',
                      '都會變成二氧化碳',
                    ],
                    answer: 1,
                    explanation: '兩個都是跟氧氣作用，差別只在速度：燃燒很快而且放出光和熱，生鏽很慢。',
                  },
                  {
                    question: '把快熄的線香伸進某瓶氣體，線香燒得更旺。這瓶是什麼氣體？',
                    options: ['二氧化碳', '氮氣', '氧氣', '水蒸氣'],
                    answer: 2,
                    explanation: '氧氣助燃，所以會讓線香復燃。二氧化碳和氮氣都會讓它熄滅。',
                  },
                ],
              });
            },
          },
        ],
      },
    ],
  };

  /* ── 註冊 ── */
  window.LESSON_PACKS = window.LESSON_PACKS || [];
  window.LESSON_PACKS.push({
    key: 'science', subject: '自然', icon: '🔬',
    grade: 5, term: '上', version: 'kang', versionName: '康軒版',
    note: '四個單元對齊闖關站的四個單元。先在這裡弄懂，再去闖關站練。',
    units: [animals, soundLight, sky, burning],
  });
})();
