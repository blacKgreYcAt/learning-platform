/**
 * 五上社會（康軒）· 引導式教學
 * 2026-11-09
 *
 * 五個單元對齊闖關站 social-5a-kang-20261105.js。
 *
 * 社會科最容易變成「背一堆專有名詞和年份」。這裡刻意反過來做：
 * 每個單元都先問一個「為什麼」，名詞是回答那個為什麼的時候順便出現的。
 * 歷史的部分用排時間軸，因為小孩真正要會的是先後順序，不是默寫西元幾年。
 */

'use strict';

(function () {
  var G5 = window.G5;
  var ChoiceQuiz = G5.ChoiceQuiz, SortBuckets = G5.SortBuckets,
      TapPairing = G5.TapPairing, LabeledDiagram = G5.LabeledDiagram,
      CompareToggle = G5.CompareToggle, Timeline = G5.Timeline, El = G5.El;

  /* ══════════════════════════════════════════════
     單元 1：臺灣我的家
     ══════════════════════════════════════════════ */
  var home = {
    id: 'k5a-soc-home',
    grade: 5, semester: '上', order: 1,
    title: '單元 1　臺灣我的家',
    subtitle: '先知道自己站在地球的哪裡',
    icon: '🏝️',
    estimatedMinutes: 30,
    objectives: [
      '說得出臺灣的相對位置和範圍',
      '看得懂地圖上的方位、比例尺和圖例',
      '知道經緯線是用來做什麼的',
      '認得臺灣的主要地形分布',
      '知道北回歸線通過臺灣造成的影響',
    ],
    wrapUp: '這個單元是整個五上社會的地基。位置、地形、氣候是連在一起的 —— ' +
      '後面講產業、講歷史，都會回來用到這裡的東西。',

    sections: [
      {
        heading: '臺灣在哪裡？',
        blocks: [
          {
            type: 'text',
            text: '臺灣位於亞洲大陸的東南方、太平洋的西邊，是一座海島。' +
              '西邊隔著臺灣海峽和中國大陸相望，東邊面對廣闊的太平洋。',
          },
          {
            type: 'text',
            text: '這個位置很關鍵：它剛好卡在東亞的海上交通要道上。' +
              '後面講大航海時代為什麼大家都想要臺灣，答案就在這裡。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點點看臺灣四周的海域和鄰居',
                parts: [
                  {
                    name: '東邊：太平洋', icon: '🌊',
                    description: '世界最大的海洋。臺灣東部海岸很快就深達數千公尺，' +
                      '所以東部的海看起來特別藍。',
                  },
                  {
                    name: '西邊：臺灣海峽', icon: '⛴️',
                    description: '隔開臺灣和中國大陸，最窄的地方大約 130 公里。' +
                      '海峽較淺，是重要的漁場。',
                  },
                  {
                    name: '北邊：東海', icon: '🧭',
                    description: '往北接著日本的琉球群島。',
                  },
                  {
                    name: '南邊：巴士海峽', icon: '🏝️',
                    description: '隔開臺灣和菲律賓。這裡是颱風常走的路線之一。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '地圖上的三樣工具',
        blocks: [
          {
            type: 'text',
            text: '看地圖不是看圖畫，是讀資料。有三樣東西一定要先找到：' +
              '方位、比例尺、圖例。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點點看每一樣工具',
                parts: [
                  {
                    name: '方位', icon: '🧭',
                    description: '地圖上通常「上北下南、左西右東」。' +
                      '如果有指北針符號，就要以它為準，不能只看習慣。',
                  },
                  {
                    name: '比例尺', icon: '📏',
                    description: '圖上的距離和實際距離的比。' +
                      '例如 1:100000 表示圖上 1 公分等於實際 100000 公分，也就是 1 公里。',
                  },
                  {
                    name: '圖例', icon: '🔣',
                    description: '說明地圖上每個符號、每個顏色代表什麼。' +
                      '不看圖例就看地圖，等於不看說明書就組模型。',
                  },
                  {
                    name: '經線與緯線', icon: '🌐',
                    description: '經線（南北向）定東西位置，緯線（東西向）定南北位置。' +
                      '兩條一交叉，就能說出地球上任何一個精確的點。',
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
                    question: '地圖上比例尺 1:50000，圖上量到 2 公分，實際是多遠？',
                    hint: '2 × 50000 = 100000 公分，再換成公里。',
                    options: ['100 公尺', '1 公里', '10 公里', '100 公里'],
                    answer: 1,
                    explanation: '2 × 50000 = 100000 公分 = 1000 公尺 = 1 公里。',
                  },
                  {
                    question: '要知道地圖上的綠色代表什麼，應該看哪裡？',
                    options: ['比例尺', '圖例', '指北針', '經緯線'],
                    answer: 1,
                    explanation: '圖例就是符號和顏色的說明表。',
                  },
                  {
                    question: '緯線是用來定什麼的？',
                    options: ['東西位置', '南北位置', '海拔高度', '時間'],
                    answer: 1,
                    explanation: '緯線是東西向的線，用來表示南北位置（離赤道多遠）。經線才是定東西位置。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '北回歸線穿過臺灣',
        blocks: [
          {
            type: 'text',
            text: '北回歸線大約在北緯 23.5 度，剛好從嘉義、花蓮一帶穿過臺灣。' +
              '這條線把臺灣分成兩半，兩邊的氣候就不太一樣。',
          },
          {
            type: 'text',
            text: '北回歸線以南屬於熱帶，以北屬於副熱帶。' +
              '所以南部全年溫暖、北部冬天會比較涼，這不是巧合。',
          },
          {
            type: 'callout', icon: '☀️', title: '北回歸線是什麼',
            text: '它是太陽直射能到達的最北界線。夏至那天，太陽會直射北回歸線 —— ' +
              '那天中午站在線上，影子會短到幾乎不見。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '北回歸線大約在北緯幾度？',
                    options: ['0 度', '23.5 度', '45 度', '66.5 度'],
                    answer: 1,
                    explanation: '北緯 23.5 度。0 度是赤道，66.5 度是北極圈。',
                  },
                  {
                    question: '北回歸線以南的臺灣屬於什麼氣候帶？',
                    options: ['寒帶', '溫帶', '副熱帶', '熱帶'],
                    answer: 3,
                    explanation: '北回歸線以南是熱帶，以北是副熱帶。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '臺灣的地形：山很多',
        blocks: [
          {
            type: 'text',
            text: '臺灣有將近三分之二是山地和丘陵，平原主要集中在西部。' +
              '中央山脈像一道脊梁，從北到南把島分成東西兩半。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'm', label: '山地／丘陵' },
                  { id: 'p', label: '平原／盆地' },
                  { id: 't', label: '臺地' },
                ],
                items: [
                  { text: '中央山脈', bucket: 'm', why: '臺灣最長的山脈，南北縱貫。' },
                  { text: '嘉南平原', bucket: 'p', why: '臺灣最大的平原，在西南部，是重要的農業區。' },
                  { text: '臺北盆地', bucket: 'p', why: '四周有山圍著、中間低平，所以叫盆地。' },
                  { text: '林口臺地', bucket: 't', why: '比平原高、頂部平坦的地形。' },
                  { text: '玉山', bucket: 'm', why: '臺灣最高峰，海拔 3952 公尺。' },
                  { text: '宜蘭平原', bucket: 'p', why: '東北部的三角形平原，由蘭陽溪沖積而成。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '⛰️', title: '為什麼人都住西部',
            text: '因為西部有大片平原，地勢平坦好蓋房子、好種田、好修路。' +
              '東部被中央山脈擋著，平地少、交通難，人口就少很多。' +
              '地形決定了人往哪裡去 —— 這是社會科最常出現的因果關係。',
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
                    question: '臺灣西邊隔著什麼和中國大陸相望？',
                    options: ['巴士海峽', '臺灣海峽', '東海', '太平洋'],
                    answer: 1,
                    explanation: '臺灣海峽在西邊。巴士海峽在南邊、東海在北邊、太平洋在東邊。',
                  },
                  {
                    question: '臺灣最高的山是哪一座？',
                    options: ['雪山', '玉山', '大霸尖山', '阿里山'],
                    answer: 1,
                    explanation: '玉山，海拔 3952 公尺，也是東亞最高峰之一。',
                  },
                  {
                    question: '為什麼臺灣人口大多集中在西部？',
                    options: [
                      '因為西部比較涼快',
                      '因為西部有大片平原，適合居住和耕作',
                      '因為東部沒有水',
                      '因為西部離海比較遠',
                    ],
                    answer: 1,
                    explanation: '地形是主要原因。西部平原廣闊，東部被中央山脈阻隔、可用平地少。',
                  },
                  {
                    question: '地圖上沒有特別標示方向時，一般是怎麼定的？',
                    options: ['上東下西', '上北下南', '上南下北', '沒有規則'],
                    answer: 1,
                    explanation: '慣例是上北下南、左西右東。但如果圖上有指北針，一定要以指北針為準。',
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
     單元 2：臺灣的自然環境與生活
     ══════════════════════════════════════════════ */
  var environment = {
    id: 'k5a-soc-environment',
    grade: 5, semester: '上', order: 2,
    title: '單元 2　臺灣的自然環境與生活',
    subtitle: '氣候和地形怎麼決定了我們的生活',
    icon: '🌦️',
    estimatedMinutes: 30,
    objectives: [
      '說得出臺灣氣候的三個特色',
      '知道季風怎麼造成南北雨量的差異',
      '了解颱風帶來的災害和好處',
      '知道臺灣的河川短、急、水量變化大',
      '舉得出人們怎麼適應和改造自然環境',
    ],
    wrapUp: '自然環境不是背景板，它一直在決定人的選擇 —— ' +
      '種什麼、住哪裡、怎麼蓋房子。每次看到一個生活現象，都可以回頭問：' +
      '是什麼自然條件造成的？',

    sections: [
      {
        heading: '臺灣的氣候有三個特色',
        blocks: [
          {
            type: 'text',
            text: '一、高溫：全年平均氣溫都偏高，南部更明顯。' +
              '二、多雨：年雨量大約 2500 毫米，是世界平均的兩倍多。' +
              '三、季風明顯：冬天吹東北季風，夏天吹西南季風。',
          },
          {
            type: 'callout', icon: '🌏', title: '為什麼',
            text: '高溫是因為緯度低（靠近北回歸線）。多雨和季風是因為臺灣是海島，' +
              '又剛好在亞洲大陸和太平洋之間 —— 海陸的溫度差造成季風。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '冬天：東北季風',
                    note: '風從東北方的海面吹來，先碰到臺灣北部和東北部的山，' +
                      '雨就下在那裡。所以基隆、宜蘭冬天特別濕冷。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '風向：東北 → 西南'),
                        El('p', { class: 'lesson-text' },
                          '多雨：北部、東北部　　少雨：南部'));
                    },
                  },
                  {
                    label: '夏天：西南季風',
                    note: '風從西南方的海面吹來，南部先迎到風，' +
                      '加上颱風和午後雷陣雨，夏天南部雨量很大。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text' },
                        '風向：西南 → 東北'),
                        El('p', { class: 'lesson-text' },
                          '多雨：南部、西南部　　此時全臺大多溫熱'));
                    },
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '☔', title: '基隆為什麼叫雨港',
            text: '因為它在東北角，冬天東北季風一來就直接迎上，' +
              '又有山擋著讓空氣抬升成雲下雨。一年可以下超過兩百天。',
          },
        ],
      },

      {
        heading: '颱風：又怕又需要',
        blocks: [
          {
            type: 'text',
            text: '颱風通常在夏秋兩季形成於太平洋，往西北方向移動，' +
              '常常經過或侵襲臺灣。',
          },
          {
            type: 'text',
            text: '颱風當然會造成災害，但它同時也是臺灣重要的水源 —— ' +
              '沒有颱風的那一年，常常接著就是缺水。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'b', label: '颱風帶來的災害' },
                  { id: 'g', label: '颱風帶來的好處' },
                ],
                items: [
                  { text: '強風吹倒路樹、招牌', bucket: 'b', why: '風災是最直接的破壞。' },
                  { text: '豪雨造成淹水、土石流', bucket: 'b', why: '短時間大量降雨，排不掉就淹。' },
                  { text: '補充水庫的水量', bucket: 'g', why: '臺灣的水庫很依賴颱風帶來的雨。' },
                  { text: '農作物受損、菜價上漲', bucket: 'b', why: '這是颱風後最常見的新聞。' },
                  { text: '緩解夏季的乾旱和高溫', bucket: 'g', why: '帶來降雨也帶走熱氣。' },
                  { text: '海上船隻無法出港作業', bucket: 'b', why: '漁業和航運都會停擺。' },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '臺灣的河川：短、急、不穩定',
        blocks: [
          {
            type: 'text',
            text: '臺灣的島不大，但山很高。河川從三千公尺的山上流到海邊，' +
              '距離卻只有幾十公里 —— 所以又短又急。',
          },
          {
            type: 'text',
            text: '而且雨量集中在夏季。夏天河水暴漲、冬天幾乎乾掉，' +
              '這叫「水量變化大」。水留不住，是臺灣缺水的主因之一。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '濁水溪' },
                  { id: 'b', text: '淡水河' },
                  { id: 'c', text: '高屏溪' },
                  { id: 'd', text: '蘭陽溪' },
                ],
                right: [
                  { id: '1', text: '臺灣最長的河，流經中部' },
                  { id: '2', text: '流經臺北盆地，北部最重要' },
                  { id: '3', text: '流域面積最大，在南部' },
                  { id: '4', text: '沖積出宜蘭平原' },
                ],
                pairs: { a: '1', b: '2', c: '3', d: '4' },
              });
            },
          },
          {
            type: 'callout', icon: '💧', title: '所以才要蓋水庫',
            text: '水庫的工作就是「把夏天多出來的水存起來，留到冬天用」。' +
              '臺灣河川留不住水，水庫就變得特別重要。',
          },
        ],
      },

      {
        heading: '人怎麼適應環境',
        blocks: [
          {
            type: 'text',
            text: '面對自然條件，人有兩種做法：適應它，或者改造它。' +
              '兩種在臺灣都看得到。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'a', label: '順著環境調整（適應）' },
                  { id: 'c', label: '動手改變環境（改造）' },
                ],
                items: [
                  { text: '南部曬鹽，因為日照強、雨少', bucket: 'a', why: '利用當地的氣候條件。' },
                  { text: '在山坡地開闢梯田', bucket: 'c', why: '把坡地改成一層層的平地來耕作。' },
                  { text: '蘭嶼的半地下屋，可以擋強風', bucket: 'a', why: '順應多颱風的環境設計房子。' },
                  { text: '興建石門水庫調節水量', bucket: 'c', why: '改變河川原本的流動方式。' },
                  { text: '高山地區種茶、種高冷蔬菜', bucket: 'a', why: '利用高海拔的低溫。' },
                  { text: '西部填海造陸蓋工業區', bucket: 'c', why: '直接把海變成陸地。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '⚖️', title: '改造要付代價',
            text: '改造環境常常有副作用：山坡地過度開發會土石流、' +
              '填海造陸會破壞海岸生態。所以現在講的是「永續」—— ' +
              '用的同時也要讓它能繼續用下去。',
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
                    question: '臺灣冬天吹什麼季風？',
                    options: ['東北季風', '西南季風', '東南季風', '西北季風'],
                    answer: 0,
                    explanation: '冬季吹東北季風，夏季吹西南季風。',
                  },
                  {
                    question: '基隆冬天為什麼特別多雨？',
                    options: [
                      '因為離海最近',
                      '因為位在東北角，直接迎上東北季風又有山地抬升',
                      '因為颱風最多',
                      '因為緯度最高',
                    ],
                    answer: 1,
                    explanation: '迎風面加上地形抬升，水氣被逼著上升凝結成雨。',
                  },
                  {
                    question: '臺灣的河川有什麼特色？',
                    options: [
                      '又長又平緩，水量穩定',
                      '又短又急，水量變化很大',
                      '全年水量都很豐沛',
                      '大多往東流入太平洋',
                    ],
                    answer: 1,
                    explanation: '島小山高所以短而急；雨量集中夏季所以水量變化大。',
                  },
                  {
                    question: '颱風對臺灣只有壞處嗎？',
                    options: [
                      '是，完全沒有好處',
                      '不是，它也是重要的水源',
                      '是，因為它只帶來災害',
                      '不一定，要看風速',
                    ],
                    answer: 1,
                    explanation: '颱風帶來的雨補充水庫。沒有颱風的年份，臺灣常常接著就限水。',
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
     單元 3：尋根探源話臺灣
     ══════════════════════════════════════════════ */
  var roots = {
    id: 'k5a-soc-roots',
    grade: 5, semester: '上', order: 3,
    title: '單元 3　尋根探源話臺灣',
    subtitle: '最早的臺灣人是誰',
    icon: '🏺',
    estimatedMinutes: 30,
    objectives: [
      '知道考古學家怎麼從遺址推論古代生活',
      '說得出幾個重要的臺灣史前文化',
      '知道臺灣原住民族的分布和文化特色',
      '了解原住民族和自然環境的關係',
      '知道「南島語族」和臺灣的關聯',
    ],
    wrapUp: '歷史不是只有文字記載的那一段。臺灣有文字記錄才四百年，' +
      '但人在這裡住了幾千年 —— 那幾千年是靠石器、陶片、遺址拼出來的。',

    sections: [
      {
        heading: '沒有文字的時代，怎麼知道發生過什麼？',
        blocks: [
          {
            type: 'text',
            text: '文字出現之前的時代叫「史前時代」。沒有人寫下來，' +
              '我們怎麼知道當時的人怎麼生活？',
          },
          {
            type: 'text',
            text: '靠考古。挖出來的石器、陶器、骨頭、房屋的柱洞，' +
              '每一樣都在透露訊息 —— 他們吃什麼、用什麼工具、怎麼埋葬死者。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '挖到大量魚骨和貝殼' },
                  { id: 'b', text: '挖到磨製的石斧和石鋤' },
                  { id: 'c', text: '挖到陶罐' },
                  { id: 'd', text: '挖到玉製的裝飾品' },
                ],
                right: [
                  { id: '1', text: '靠海維生，吃海產' },
                  { id: '2', text: '已經會農耕' },
                  { id: '3', text: '會儲存食物和煮食' },
                  { id: '4', text: '有審美觀，可能也有交易' },
                ],
                pairs: { a: '1', b: '2', c: '3', d: '4' },
              });
            },
          },
          {
            type: 'callout', icon: '🔍', title: '考古學家在做什麼',
            text: '他們不是在找寶藏，是在找證據。一片破陶片本身不值錢，' +
              '但它可以告訴你那裡住過人、他們的技術到什麼程度、和誰有往來。',
          },
        ],
      },

      {
        heading: '臺灣的史前文化',
        blocks: [
          {
            type: 'text',
            text: '臺灣發現過很多史前遺址，分布在全島各地。' +
              '下面這幾個是課本一定會提到的。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點點看每一個文化',
                parts: [
                  {
                    name: '長濱文化', icon: '🪨',
                    description: '在臺東長濱的八仙洞發現，是目前臺灣已知最早的史前文化，' +
                      '大約在舊石器時代晚期。用打製石器，靠採集和漁獵維生，還不會農耕。',
                  },
                  {
                    name: '大坌坑文化', icon: '🏺',
                    description: '在新北八里發現，屬於新石器時代早期。' +
                      '開始使用磨製石器和陶器，已經懂得簡單的農耕。',
                  },
                  {
                    name: '卑南文化', icon: '💎',
                    description: '在臺東發現，新石器時代晚期。' +
                      '遺址規模很大，出土大量玉器和石板棺，顯示當時社會已經相當複雜。',
                  },
                  {
                    name: '十三行文化', icon: '⚒️',
                    description: '在新北八里發現，已經進入鐵器時代。' +
                      '會煉鐵，也找到來自中國和東南亞的物品，表示當時已經有對外貿易。',
                  },
                ],
              });
            },
          },
          {
            type: 'component',
            build: function () {
              return new Timeline({
                slots: [
                  {
                    when: '最早・舊石器',
                    answer: '長濱文化：打製石器、漁獵採集',
                    why: '還不會農耕，也還沒有陶器，是目前找到最早的。',
                  },
                  {
                    when: '接著・新石器早期',
                    answer: '大坌坑文化：磨製石器、開始有陶器',
                    why: '會磨石器、會做陶，代表定居生活開始了。',
                  },
                  {
                    when: '再來・新石器晚期',
                    answer: '卑南文化：大量玉器、石板棺',
                    why: '有餘力製作裝飾品和複雜的墓葬，社會已經分工。',
                  },
                  {
                    when: '最晚・鐵器時代',
                    answer: '十三行文化：會煉鐵、有對外貿易',
                    why: '煉鐵技術和外來物品，表示已經和外面的世界連上了。',
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🧭', title: '記順序的線索',
            text: '看工具就知道先後：打製石器 → 磨製石器 → 陶器 → 鐵器。' +
              '技術只會越來越進步，不會倒退回去。',
          },
        ],
      },

      {
        heading: '原住民族：臺灣最早的主人',
        blocks: [
          {
            type: 'text',
            text: '臺灣原住民族在漢人大量移入之前就已經住在這裡幾千年。' +
              '目前政府認定的有十六族，各自有自己的語言和文化。',
          },
          {
            type: 'text',
            text: '住的地方不同，生活方式就不同 —— 這又是「環境影響生活」的例子。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '阿美族' },
                  { id: 'b', text: '達悟族（雅美族）' },
                  { id: 'c', text: '布農族' },
                  { id: 'd', text: '排灣族' },
                ],
                right: [
                  { id: '1', text: '人口最多，豐年祭很有名' },
                  { id: '2', text: '住蘭嶼，造拼板舟、飛魚祭' },
                  { id: '3', text: '住高山，八部合音聞名' },
                  { id: '4', text: '有貴族制度，木雕和琉璃珠很精美' },
                ],
                pairs: { a: '1', b: '2', c: '3', d: '4' },
              });
            },
          },
          {
            type: 'callout', icon: '🌊', title: '南島語族',
            text: '臺灣原住民族屬於「南島語族」—— 這個語族分布從太平洋到印度洋，' +
              '範圍橫跨半個地球。很多學者認為臺灣是南島語族擴散的起點之一，' +
              '所以臺灣在世界語言史上很重要。',
          },
        ],
      },

      {
        heading: '文化和環境是連在一起的',
        blocks: [
          {
            type: 'text',
            text: '原住民族的祭典、建築、食物，幾乎都能回推到他們住的環境。' +
              '看懂這層關係，就不用死背哪一族有什麼祭典。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 's', label: '跟海洋有關' },
                  { id: 'm', label: '跟山林有關' },
                  { id: 'f', label: '跟農作有關' },
                ],
                items: [
                  { text: '達悟族的飛魚祭', bucket: 's', why: '蘭嶼四面環海，飛魚是主要的食物來源。' },
                  { text: '布農族的打耳祭', bucket: 'm', why: '高山狩獵文化，訓練和祝福獵人。' },
                  { text: '阿美族的豐年祭', bucket: 'f', why: '慶祝小米、稻作的收成。' },
                  { text: '達悟族的拼板舟', bucket: 's', why: '用來出海捕飛魚的傳統船。' },
                  { text: '賽夏族的矮靈祭', bucket: 'm', why: '山區部落的傳統祭典。' },
                  { text: '各族的小米祭', bucket: 'f', why: '小米是許多族群最重要的傳統作物。' },
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
                    question: '目前臺灣已知最早的史前文化是哪一個？',
                    options: ['大坌坑文化', '長濱文化', '卑南文化', '十三行文化'],
                    answer: 1,
                    explanation: '長濱文化在臺東八仙洞，屬於舊石器時代晚期，是目前找到最早的。',
                  },
                  {
                    question: '十三行文化最大的特色是什麼？',
                    options: ['使用打製石器', '大量玉器', '會煉鐵、有對外貿易', '還不會農耕'],
                    answer: 2,
                    explanation: '十三行已經進入鐵器時代，遺址裡找到煉鐵的證據和外來物品。',
                  },
                  {
                    question: '達悟族的飛魚祭反映了什麼？',
                    options: [
                      '他們住在高山上',
                      '他們以農耕為主',
                      '他們生活和海洋密切相關',
                      '他們擅長狩獵',
                    ],
                    answer: 2,
                    explanation: '達悟族住蘭嶼，四面環海，飛魚是重要食物，整個文化都圍繞著海。',
                  },
                  {
                    question: '臺灣原住民族屬於哪一個語族？',
                    options: ['漢藏語族', '南島語族', '印歐語族', '阿爾泰語族'],
                    answer: 1,
                    explanation: '南島語族，分布範圍從太平洋一路到印度洋，臺灣被認為是擴散起點之一。',
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
     單元 4：大航海時代的臺灣
     ══════════════════════════════════════════════ */
  var ageOfSail = {
    id: 'k5a-soc-sail',
    grade: 5, semester: '上', order: 4,
    title: '單元 4　大航海時代的臺灣',
    subtitle: '位置太好，所有人都想要',
    icon: '⛵',
    estimatedMinutes: 35,
    objectives: [
      '知道大航海時代歐洲人為什麼要來東亞',
      '說得出荷蘭、西班牙在臺灣的經營重點',
      '知道鄭成功來臺的經過和影響',
      '了解清領前期的治臺政策',
      '把這幾個時期的先後順序排對',
    ],
    wrapUp: '這個單元的每一個政權，來臺灣的理由其實都一樣 —— 位置。' +
      '把「誰、什麼時候、為了什麼來、留下了什麼」這四格填滿，整個單元就清楚了。',

    sections: [
      {
        heading: '歐洲人為什麼要出海？',
        blocks: [
          {
            type: 'text',
            text: '十五、十六世紀，歐洲人開始大規模航海，找通往亞洲的新路線。' +
              '原因很實際：他們要香料、絲綢、瓷器，而陸路被阻斷又昂貴。',
          },
          {
            type: 'text',
            text: '造船和航海技術進步之後，葡萄牙、西班牙、荷蘭陸續來到東亞。' +
              '而臺灣剛好卡在中國、日本、南洋之間的航線上。',
          },
          {
            type: 'callout', icon: '🧭', title: '一切都是位置',
            text: '臺灣本身當時沒有歐洲人想要的特產，' +
              '但它是最好的中繼站和貿易轉運點 —— 這就是所有人都想要它的原因。',
          },
        ],
      },

      {
        heading: '荷蘭人和西班牙人',
        blocks: [
          {
            type: 'text',
            text: '一六二〇年代，荷蘭人占領臺灣南部，西班牙人占領北部，' +
              '兩邊同時在臺灣。後來荷蘭人把西班牙人趕走，統治了整個西部。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '荷蘭人（南部）',
                    note: '1624 年進入大員（今臺南安平），建熱蘭遮城。' +
                      '統治約 38 年，是這個時期影響最大的政權。',
                    render: function (body) {
                      body.append(
                        El('p', { class: 'lesson-text' }, '根據地：熱蘭遮城、普羅民遮城（今臺南）'),
                        El('p', { class: 'lesson-text' }, '重點：轉口貿易、鼓勵漢人來種稻米和甘蔗、傳教、向原住民徵稅'));
                    },
                  },
                  {
                    label: '西班牙人（北部）',
                    note: '1626 年進入雞籠（今基隆）、滬尾（今淡水），' +
                      '但經營不順，1642 年被荷蘭人趕走，只待了 16 年。',
                    render: function (body) {
                      body.append(
                        El('p', { class: 'lesson-text' }, '根據地：聖薩爾瓦多城（基隆）、聖多明哥城（淡水）'),
                        El('p', { class: 'lesson-text' }, '重點：想和中國、日本貿易，也傳天主教，但收益不如預期'));
                    },
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🏰', title: '紅毛城的由來',
            text: '淡水的紅毛城原本是西班牙人蓋的聖多明哥城，' +
              '荷蘭人趕走西班牙人後重建。當時的人叫荷蘭人「紅毛」，城就跟著叫紅毛城。',
          },
        ],
      },

      {
        heading: '鄭成功來了',
        blocks: [
          {
            type: 'text',
            text: '一六六一年，鄭成功率軍從金門出發，攻打荷蘭人。' +
              '圍城將近九個月後，荷蘭人在一六六二年投降離開。',
          },
          {
            type: 'text',
            text: '鄭成功來臺灣的目的不是殖民，是要找一個基地「反清復明」。' +
              '所以他來了之後做的事，都和養兵、屯田有關。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'y', label: '鄭氏時期做的事' },
                  { id: 'n', label: '不是鄭氏時期做的' },
                ],
                items: [
                  { text: '實施屯田制，讓軍隊自己種田養活自己', bucket: 'y', why: '要長期抗清就得先能自給自足。' },
                  { text: '設立承天府，建立行政制度', bucket: 'y', why: '鄭氏開始在臺灣建立正式的管理機構。' },
                  { text: '興建孔廟、推行科舉教育', bucket: 'y', why: '陳永華建議設孔廟、辦學校，漢人教育從此扎根。' },
                  { text: '建造熱蘭遮城', bucket: 'n', why: '那是荷蘭人蓋的，鄭成功是去打下它。' },
                  { text: '頒布渡臺禁令限制移民', bucket: 'n', why: '那是後來清朝的政策。' },
                  { text: '開墾土地、招募漢人移民來臺', bucket: 'y', why: '要有人耕作才養得起軍隊。' },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '清朝來了之後',
        blocks: [
          {
            type: 'text',
            text: '一六八三年，清朝打敗鄭氏政權，隔年把臺灣納入版圖。' +
              '但清朝一開始對臺灣其實不太積極。',
          },
          {
            type: 'text',
            text: '清領前期實施「渡臺禁令」，限制人民來臺 —— ' +
              '不准帶家眷、要申請許可。原因是怕臺灣又變成反抗基地。',
          },
          {
            type: 'callout', icon: '🚢', title: '禁令造成的結果',
            text: '男人先來、女人不准跟，造成早期臺灣「男多女少」，' +
              '也留下「有唐山公，無唐山媽」這句話 —— 很多漢人男性和原住民女性通婚。' +
              '一條政策，改變了整個社會的樣子。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '清朝為什麼要實施渡臺禁令？',
                    options: [
                      '因為臺灣土地不夠',
                      '擔心臺灣再度成為反抗勢力的基地',
                      '因為航海太危險',
                      '因為臺灣沒有資源',
                    ],
                    answer: 1,
                    explanation: '鄭氏就是以臺灣為基地抗清，清朝不希望歷史重演。',
                  },
                  {
                    question: '「有唐山公，無唐山媽」在說什麼現象？',
                    options: [
                      '男性移民多、女性少，所以與原住民通婚',
                      '臺灣人都姓唐',
                      '唐山是臺灣的古名',
                      '男人都回大陸了',
                    ],
                    answer: 0,
                    explanation: '渡臺禁令不准帶家眷，來的多是單身男性，許多人和平埔族女性結婚。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '把順序排對',
        blocks: [
          {
            type: 'text',
            text: '這個單元考試最常考的就是先後順序。把下面幾件事排回正確的位置。',
          },
          {
            type: 'component',
            build: function () {
              return new Timeline({
                slots: [
                  {
                    when: '1624 年',
                    answer: '荷蘭人進入大員，建熱蘭遮城',
                    why: '荷蘭人先到南部，這是臺灣進入「有文字記載」的開始。',
                  },
                  {
                    when: '1626 年',
                    answer: '西班牙人進入雞籠和滬尾',
                    why: '比荷蘭人晚兩年，而且選的是北部。',
                  },
                  {
                    when: '1642 年',
                    answer: '荷蘭人趕走西班牙人，統治全臺西部',
                    why: '西班牙人只待了十六年就被趕走了。',
                  },
                  {
                    when: '1662 年',
                    answer: '鄭成功打敗荷蘭人，開始鄭氏治臺',
                    why: '圍城九個月後荷蘭人投降，統治權換手。',
                  },
                  {
                    when: '1683 年',
                    answer: '清朝打敗鄭氏，臺灣納入清朝版圖',
                    why: '鄭氏三代在臺灣約二十二年，之後進入清領時期。',
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '📌', title: '一句話串起來',
            text: '荷蘭人來做生意 → 西班牙人來搶一塊 → 荷蘭人把他趕走 → ' +
              '鄭成功來反清所以趕走荷蘭人 → 清朝打敗鄭氏接手。' +
              '每一次換手都有原因，不是隨機發生的。',
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
                    question: '荷蘭人在臺灣的主要根據地在哪裡？',
                    options: ['基隆', '淡水', '臺南', '高雄'],
                    answer: 2,
                    explanation: '荷蘭人在大員（今臺南安平）建熱蘭遮城，那是他們的統治中心。',
                  },
                  {
                    question: '鄭成功來臺灣的主要目的是什麼？',
                    options: [
                      '為了做生意賺錢',
                      '為了傳教',
                      '為了建立反清復明的基地',
                      '為了躲避天災',
                    ],
                    answer: 2,
                    explanation: '他要一個能長期抗清的根據地，所以來了之後重點都在屯田養兵。',
                  },
                  {
                    question: '下面哪一個順序是對的？',
                    hint: '想一想誰趕走誰。',
                    options: [
                      '鄭成功 → 荷蘭人 → 清朝',
                      '荷蘭人 → 鄭成功 → 清朝',
                      '清朝 → 荷蘭人 → 鄭成功',
                      '荷蘭人 → 清朝 → 鄭成功',
                    ],
                    answer: 1,
                    explanation: '荷蘭人 1624 來，鄭成功 1662 趕走荷蘭人，清朝 1683 打敗鄭氏。',
                  },
                  {
                    question: '為什麼這麼多國家都想要臺灣？',
                    options: [
                      '因為臺灣有很多黃金',
                      '因為臺灣的位置在東亞航線的中間，適合當貿易轉運站',
                      '因為臺灣土地最肥沃',
                      '因為臺灣人口最多',
                    ],
                    answer: 1,
                    explanation: '位置。臺灣卡在中國、日本、南洋的航線交會處，是最好的中繼站。',
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
     單元 5：主題探究與實作：守護臺灣最美的風景
     ══════════════════════════════════════════════ */
  var inquiry = {
    id: 'k5a-soc-inquiry',
    grade: 5, semester: '上', order: 5,
    title: '單元 5　守護臺灣最美的風景',
    subtitle: '自己提問、自己找答案、自己做做看',
    icon: '🔎',
    estimatedMinutes: 30,
    objectives: [
      '知道探究要從一個好問題開始',
      '會分辨可靠和不可靠的資料來源',
      '知道怎麼把蒐集到的資料整理成結論',
      '了解文化資產保存的意義和方法',
      '說得出自己可以做的具體行動',
    ],
    wrapUp: '這個單元沒有標準答案，但有標準方法：提問 → 找資料 → 判斷可信度 → ' +
      '整理 → 提出看法 → 行動。這套方法以後不管做什麼報告都用得到。',

    sections: [
      {
        heading: '探究從一個好問題開始',
        blocks: [
          {
            type: 'text',
            text: '「臺灣有哪些古蹟？」這不是好問題 —— 查一下就有答案，不用探究。' +
              '「為什麼有些古蹟保存得很好，有些卻被拆掉？」這才是好問題。',
          },
          {
            type: 'text',
            text: '好問題的特徵：不能一句話回答、需要找資料、答案可能不只一個。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'g', label: '適合探究的問題' },
                  { id: 'b', label: '查一下就有答案' },
                ],
                items: [
                  { text: '臺灣最高的山是哪一座？', bucket: 'b', why: '查一下就知道是玉山，沒有探究空間。' },
                  { text: '為什麼年輕人越來越少回鄉參加傳統祭典？', bucket: 'g', why: '原因很多，要訪談、要比較，答案也不只一個。' },
                  { text: '老街改建成商店街，對當地是好是壞？', bucket: 'g', why: '有不同立場，需要蒐集多方意見。' },
                  { text: '臺南孔廟建於哪一年？', bucket: 'b', why: '這是單一事實，查資料就有。' },
                  { text: '我們社區可以怎麼減少垃圾？', bucket: 'g', why: '要調查現況、比較方法、提出可行做法。' },
                  { text: '臺灣有幾個國家公園？', bucket: 'b', why: '單一數字，查得到。' },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '資料可不可信？',
        blocks: [
          {
            type: 'text',
            text: '網路上什麼都查得到，但不是什麼都能信。' +
              '判斷資料可靠不可靠，有幾個可以檢查的點。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點點看每一個檢查點',
                parts: [
                  {
                    name: '誰寫的？', icon: '✍️',
                    description: '政府機關、學校、研究單位寫的通常比較可靠。' +
                      '匿名的、看不出來源的，就要小心。',
                  },
                  {
                    name: '什麼時候寫的？', icon: '📅',
                    description: '資料會過時。十年前的人口統計拿來講現在的情況，就不準了。',
                  },
                  {
                    name: '有沒有其他來源說一樣的事？', icon: '🔁',
                    description: '只有一個地方這樣說，要存疑。' +
                      '查第二個、第三個來源，說法一致才比較可信。',
                  },
                  {
                    name: '是事實還是意見？', icon: '⚖️',
                    description: '「臺南孔廟建於 1665 年」是事實，可以查證。' +
                      '「臺南孔廟是全臺最美的古蹟」是意見，沒有對錯。兩種都有用，但不能混在一起。',
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
                  { id: 'f', label: '事實（可以查證）' },
                  { id: 'o', label: '意見（個人看法）' },
                ],
                items: [
                  { text: '臺灣的面積大約是 36000 平方公里', bucket: 'f', why: '有官方數據可以查。' },
                  { text: '臺灣的夜市是全世界最好吃的', bucket: 'o', why: '「最好吃」是感受，每個人不一樣。' },
                  { text: '阿里山森林鐵路在 1912 年全線通車', bucket: 'f', why: '有歷史紀錄。' },
                  { text: '古蹟應該保留下來，不應該拆掉', bucket: 'o', why: '這是立場，不同人會有不同主張。' },
                  { text: '臺灣原住民族目前有 16 族被政府認定', bucket: 'f', why: '有官方公告的數字。' },
                  { text: '搭火車比搭客運舒服', bucket: 'o', why: '舒不舒服因人而異。' },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '文化資產為什麼要保存',
        blocks: [
          {
            type: 'text',
            text: '一棟舊房子拆掉蓋大樓，可以多住很多人、可以賺錢。' +
              '那為什麼還要保存古蹟？',
          },
          {
            type: 'text',
            text: '因為那些東西一旦消失就回不來了。它們承載的是「我們是從哪裡來的」 —— ' +
              '新大樓隨時可以蓋，三百年的建築蓋不出來。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'y', label: '有形文化資產' },
                  { id: 'n', label: '無形文化資產' },
                ],
                items: [
                  { text: '臺南赤崁樓', bucket: 'y', why: '看得到摸得到的建築。' },
                  { text: '布袋戲的表演技藝', bucket: 'n', why: '是技術和表演，靠人傳承下去。' },
                  { text: '淡水紅毛城', bucket: 'y', why: '實體的古蹟建築。' },
                  { text: '原住民族的口傳神話', bucket: 'n', why: '沒有實體，靠講述保存。' },
                  { text: '阿里山森林鐵路', bucket: 'y', why: '鐵道和車輛都是實體。' },
                  { text: '傳統的製茶工法', bucket: 'n', why: '是技藝，需要師傅傳給徒弟。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🏛️', title: '保存不等於不能用',
            text: '現在的做法多半是「活化再利用」—— 老建築整修後變成書店、咖啡館、文創園區。' +
              '讓它繼續有人進出，比把它鎖起來更能保存下去。',
          },
        ],
      },

      {
        heading: '從看法到行動',
        blocks: [
          {
            type: 'text',
            text: '探究的最後一步是：你打算怎麼做？' +
              '而且要提得出具體可行的事，不能只喊口號。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'g', label: '具體可行' },
                  { id: 'v', label: '太空泛，做不出來' },
                ],
                items: [
                  { text: '我們要愛護古蹟', bucket: 'v', why: '聽起來對，但不知道要做什麼。' },
                  { text: '參觀古蹟時不觸摸、不塗鴉、不攀爬', bucket: 'g', why: '三個動作都很明確。' },
                  { text: '大家一起保護文化', bucket: 'v', why: '沒說要保護什麼、怎麼做。' },
                  { text: '訪問阿公阿嬤，把家族故事記錄下來', bucket: 'g', why: '有對象、有動作、有產出。' },
                  { text: '做一份社區老建築地圖分享給同學', bucket: 'g', why: '可以真的動手完成。' },
                  { text: '提升大家的文化意識', bucket: 'v', why: '說不出第一步要做什麼。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '✅', title: '好行動的三個條件',
            text: '一、你自己做得到（不是要別人做）。二、說得出第一步。' +
              '三、做完看得出結果。三個都成立，才是真的行動方案。',
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
                    question: '下面哪一個比較適合當成探究的問題？',
                    options: [
                      '臺灣有幾座國家公園？',
                      '為什麼有些傳統市場生意越來越差？',
                      '玉山有多高？',
                      '臺南孔廟在哪一條路上？',
                    ],
                    answer: 1,
                    explanation: '另外三個查一下就有答案，只有第二個需要蒐集資料、比較分析。',
                  },
                  {
                    question: '「臺灣的夜市是全世界最好吃的」這句話是？',
                    options: ['事實', '意見', '數據', '定義'],
                    answer: 1,
                    explanation: '「最好吃」沒辦法查證，是個人感受，屬於意見。',
                  },
                  {
                    question: '判斷網路資料可不可信，下面哪一個「最沒有幫助」？',
                    options: [
                      '看是誰寫的',
                      '看什麼時候寫的',
                      '看網頁設計好不好看',
                      '查查看其他來源怎麼說',
                    ],
                    answer: 2,
                    explanation: '網頁漂不漂亮和內容正不正確完全沒關係。',
                  },
                  {
                    question: '布袋戲的表演技藝屬於哪一種文化資產？',
                    options: ['有形文化資產', '無形文化資產', '自然資產', '都不是'],
                    answer: 1,
                    explanation: '技藝沒有實體，靠人傳承，屬於無形文化資產。',
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
    key: 'social', subject: '社會', icon: '🌏',
    grade: 5, term: '上', version: 'kang', versionName: '康軒版',
    note: '五個單元對齊闖關站的五個單元。歷史的部分有排時間軸，先後順序比年份好記。',
    units: [home, environment, roots, ageOfSail, inquiry],
  });
})();
