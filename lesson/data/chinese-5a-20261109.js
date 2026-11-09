/**
 * 五上國語 · 引導式教學
 * 2026-11-09
 *
 * 跟闖關站的國語題庫一樣標成「各版本通用」。
 * 原因跟題庫那邊一樣：國語的單元名稱就是課文篇名，各家版本選的課文不同，
 * 沒看到課本目錄就對不齊。但「字詞、成語、修辭、閱讀理解」這四項能力
 * 是各版本共同要練的，所以照能力分，不照課文分。
 *
 * 裡面所有的例句、短文都是為了這份教材自己寫的，
 * 沒有引用任何課本或參考書的內容。
 */

'use strict';

(function () {
  var G5 = window.G5;
  var ChoiceQuiz = G5.ChoiceQuiz, SortBuckets = G5.SortBuckets,
      TapPairing = G5.TapPairing, LabeledDiagram = G5.LabeledDiagram,
      CompareToggle = G5.CompareToggle, El = G5.El;

  /* 短文區塊的小工具：把一段文章排得像文章，而不是像題目 */
  function passage(title, paras) {
    return {
      type: 'component',
      build: function () {
        return {
          mount: function (c) {
            c.append(El('div', { class: 'read-box' },
              El('h4', { class: 'read-title' }, title),
              paras.map(function (p) { return El('p', { class: 'read-p' }, p); })));
            return this;
          },
          destroy: function () {},
        };
      },
    };
  }

  /* ══════════════════════════════════════════════
     單元 1：字詞基本功
     ══════════════════════════════════════════════ */
  var words = {
    id: 'k5a-chi-words',
    grade: 5, semester: '上', order: 1,
    title: '單元 1　字詞基本功',
    subtitle: '錯字不是粗心，是字沒認清楚',
    icon: '✏️',
    estimatedMinutes: 30,
    objectives: [
      '知道錯別字主要來自形近和同音',
      '分得出常見的形近字',
      '會用字義判斷該用哪一個同音字',
      '認得常見的多音字並會依詞判讀音',
      '知道怎麼用部首查字典',
    ],
    wrapUp: '寫錯字幾乎都不是手滑，是腦中那個字本來就模糊。' +
      '所以改錯字的方法不是多抄幾遍，是弄清楚「這個字為什麼長這樣」—— ' +
      '部首通常就是答案。',

    sections: [
      {
        heading: '錯別字是怎麼來的',
        blocks: [
          {
            type: 'text',
            text: '寫錯字的原因幾乎只有兩個：長得太像（形近），或是唸起來一樣（同音）。' +
              '知道是哪一種，就知道該怎麼防。',
          },
          {
            type: 'callout', icon: '🔑', title: '最有效的一招',
            text: '看部首。部首通常就是這個字的「類別」—— ' +
              '「請」是言部，所以跟說話有關；「清」是水部，所以跟水有關；' +
              '「晴」是日部，所以跟天氣有關。弄懂部首，就不會亂用。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '請（言部）' },
                  { id: 'b', text: '清（水部）' },
                  { id: 'c', text: '晴（日部）' },
                  { id: 'd', text: '情（心部）' },
                  { id: 'e', text: '睛（目部）' },
                ],
                right: [
                  { id: '1', text: '請問、邀請 —— 跟說話有關' },
                  { id: '2', text: '清水、清楚 —— 跟水有關' },
                  { id: '3', text: '晴天、放晴 —— 跟太陽有關' },
                  { id: '4', text: '心情、感情 —— 跟內心有關' },
                  { id: '5', text: '眼睛、目不轉睛 —— 跟眼睛有關' },
                ],
                pairs: { a: '1', b: '2', c: '3', d: '4', e: '5' },
              });
            },
          },
        ],
      },

      {
        heading: '形近字：差一筆，意思差很多',
        blocks: [
          {
            type: 'text',
            text: '有些字長得很像，但部首不同，意思完全不一樣。' +
              '下面這幾組是最常被寫錯的。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'a', label: '用「辨」（辛字旁，分辨）' },
                  { id: 'b', label: '用「辯」（言字旁，說話）' },
                  { id: 'c', label: '用「辮」（糸字旁，繩子）' },
                ],
                items: [
                  { text: '分○是非', bucket: 'a', why: '分辨是非 —— 用眼睛和頭腦去分，是「辨」。' },
                  { text: '○論比賽', bucket: 'b', why: '辯論要用嘴巴講，中間是「言」。' },
                  { text: '綁一條○子', bucket: 'c', why: '辮子是頭髮編的，中間是「糸」（絲線）。' },
                  { text: '○別真假', bucket: 'a', why: '辨別，一樣是用分的。' },
                  { text: '他很會狡○', bucket: 'b', why: '狡辯是用講的。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '👀', title: '看中間',
            text: '辨、辯、辮三個字左右都是「辛」，差別全在中間：' +
              '中間一點一撇是用分的，中間是「言」要用講的，中間是「糸」跟繩線有關。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '「他做事一絲不○，非常認真。」應該填哪一個字？',
                    hint: '苟 = 隨便；狗是動物。',
                    options: ['狗', '苟', '夠', '購'],
                    answer: 1,
                    explanation: '一絲不苟。「苟」有「隨便、馬虎」的意思，一絲不苟就是一點都不馬虎。',
                  },
                  {
                    question: '「天氣很熱，我喝了一杯○水。」應該用哪一個？',
                    options: ['請', '清', '晴', '情'],
                    answer: 1,
                    explanation: '清水，跟水有關所以用水部的「清」。',
                  },
                  {
                    question: '「這件事的來龍去○我都知道。」',
                    options: ['脈', '脉', '賣', '買'],
                    answer: 0,
                    explanation: '來龍去脈。「脈」原本指血管，引申為事情的前後經過。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '同音字：用意思選，不要用耳朵選',
        blocks: [
          {
            type: 'text',
            text: '同音字唸起來一模一樣，只能靠意思分。' +
              '遇到不確定的時候，把整個詞的意思想一遍，通常就有答案。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'z', label: '用「再」（又一次）' },
                  { id: 'y', label: '用「在」（位置、正在）' },
                ],
                items: [
                  { text: '我們明天○見', bucket: 'z', why: '再見 = 下次又見面，是「又一次」。' },
                  { text: '他○教室裡寫功課', bucket: 'y', why: '表示位置，用「在」。' },
                  { text: '請你○說一次', bucket: 'z', why: '又說一次。' },
                  { text: '媽媽正○煮飯', bucket: 'y', why: '正在做某件事。' },
                  { text: '吃完飯○去玩', bucket: 'z', why: '先吃飯，然後又去做下一件事。' },
                  { text: '答案就○這一頁', bucket: 'y', why: '表示位置。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '💡', title: '一秒分辨「再」和「在」',
            text: '可以換成「又」的，用「再」。可以換成「位於」或「正」的，用「在」。' +
              '把句子唸一遍換換看，馬上就知道。',
          },
        ],
      },

      {
        heading: '多音字：同一個字，兩種唸法',
        blocks: [
          {
            type: 'text',
            text: '有些字不只一個讀音，讀音不同意思也不同。' +
              '判斷的方法是看它在哪個詞裡面。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '行　ㄒㄧㄥˊ' },
                  { id: 'b', text: '行　ㄏㄤˊ' },
                  { id: 'c', text: '重　ㄓㄨㄥˋ' },
                  { id: 'd', text: '重　ㄔㄨㄥˊ' },
                  { id: 'e', text: '長　ㄔㄤˊ' },
                  { id: 'f', text: '長　ㄓㄤˇ' },
                ],
                right: [
                  { id: '1', text: '行走、旅行、行動' },
                  { id: '2', text: '銀行、行列、同行' },
                  { id: '3', text: '重量、重要、嚴重' },
                  { id: '4', text: '重新、重複、重來' },
                  { id: '5', text: '長短、長度、很長' },
                  { id: '6', text: '長大、校長、成長' },
                ],
                pairs: { a: '1', b: '2', c: '3', d: '4', e: '5', f: '6' },
              });
            },
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '「這本書我要重新再看一次」的「重」要怎麼唸？',
                    options: ['ㄓㄨㄥˋ', 'ㄔㄨㄥˊ', '兩個都可以', '都不對'],
                    answer: 1,
                    explanation: '重新、重複、重來的「重」唸 ㄔㄨㄥˊ，意思是「再一次」。',
                  },
                  {
                    question: '「爸爸在銀行上班」的「行」要怎麼唸？',
                    options: ['ㄒㄧㄥˊ', 'ㄏㄤˊ', 'ㄒㄧㄥˋ', 'ㄏㄥˊ'],
                    answer: 1,
                    explanation: '銀行的「行」唸 ㄏㄤˊ。跟「走」有關才唸 ㄒㄧㄥˊ。',
                  },
                  {
                    question: '「他長大以後想當醫生」的「長」怎麼唸？',
                    options: ['ㄔㄤˊ', 'ㄓㄤˇ', 'ㄔㄤˇ', 'ㄓㄤˋ'],
                    answer: 1,
                    explanation: '長大、生長的「長」唸 ㄓㄤˇ。講長度才唸 ㄔㄤˊ。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '查字典：部首怎麼找',
        blocks: [
          {
            type: 'text',
            text: '不會唸的字，只能用部首查。步驟其實很固定。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點點看查字典的每一步',
                parts: [
                  {
                    name: '第一步：找部首', icon: '🔎',
                    description: '先判斷這個字屬於哪一部。通常在左邊、上面或外面。' +
                      '例如「湖」的部首是「氵」（水部）。',
                  },
                  {
                    name: '第二步：數部首筆畫', icon: '✍️',
                    description: '「氵」是 3 畫。先到部首索引裡找 3 畫的部首。',
                  },
                  {
                    name: '第三步：數剩下的筆畫', icon: '🔢',
                    description: '「湖」扣掉部首「氵」，剩下「胡」是 9 畫。' +
                      '所以要在水部的 9 畫裡面找。',
                  },
                  {
                    name: '第四步：翻到那一頁', icon: '📖',
                    description: '照索引給的頁數翻過去，就找得到了。' +
                      '順便把讀音和其他解釋一起看完，比較划算。',
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
                    question: '「想」這個字的部首是什麼？',
                    hint: '它跟什麼有關？',
                    options: ['木', '目', '心', '相'],
                    answer: 2,
                    explanation: '「想」是心部。想事情是用心、用腦，所以歸在心部。',
                  },
                  {
                    question: '「問」這個字的部首是什麼？',
                    hint: '部首不一定在左邊。',
                    options: ['門', '口', '日', '人'],
                    answer: 1,
                    explanation: '「問」的部首是「口」，因為問要用嘴巴。「門」在這裡只是表示讀音。',
                  },
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
                    question: '下面哪一個詞「沒有」錯字？',
                    options: ['一慕了然', '一目了然', '一木了然', '一幕了然'],
                    answer: 1,
                    explanation: '一目了然 —— 用眼睛看一下就清楚，所以是「目」。',
                  },
                  {
                    question: '「我們下次○見」應該填？',
                    options: ['在', '再', '載', '栽'],
                    answer: 1,
                    explanation: '再見 = 又見面一次，用「再」。',
                  },
                  {
                    question: '「他做事情很認真，一絲不苟」的「苟」是什麼意思？',
                    options: ['像狗一樣', '隨便、馬虎', '足夠', '勾住'],
                    answer: 1,
                    explanation: '「苟」有隨便、馬虎的意思，一絲不苟就是一點都不馬虎。',
                  },
                  {
                    question: '「行」在「三百六十行」裡怎麼唸？',
                    hint: '這裡的「行」是指職業的種類。',
                    options: ['ㄒㄧㄥˊ', 'ㄏㄤˊ', 'ㄒㄧㄥˋ', 'ㄏㄥˋ'],
                    answer: 1,
                    explanation: '指行業、種類時唸 ㄏㄤˊ，跟「銀行」一樣。',
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
     單元 2：成語與俗諺
     ══════════════════════════════════════════════ */
  var idioms = {
    id: 'k5a-chi-idioms',
    grade: 5, semester: '上', order: 2,
    title: '單元 2　成語與俗諺',
    subtitle: '四個字背後都有一個故事',
    icon: '🀄',
    estimatedMinutes: 30,
    objectives: [
      '知道成語大多來自歷史故事或寓言',
      '了解成語要用在對的場合，不能只看字面',
      '分得清楚褒義和貶義的成語',
      '知道成語和俗諺的差別',
      '認得幾句常用的臺灣俗諺',
    ],
    wrapUp: '成語不是用來讓文章看起來厲害的裝飾品。' +
      '用對了，一句話就說完別人要說三句的事；用錯了，反而讓人看出你沒懂。' +
      '所以每學一個成語，一定要連它的故事和場合一起記。',

    sections: [
      {
        heading: '成語是壓縮過的故事',
        blocks: [
          {
            type: 'text',
            text: '「守株待兔」四個字，背後是一個完整的故事：' +
              '農夫看到兔子撞死在樹樁上，從此天天守著樹樁等兔子，田也不種了。',
          },
          {
            type: 'text',
            text: '所以這四個字的意思不是「守著樹等兔子」，而是' +
              '「死守著僥倖得來的經驗，不肯努力」。' +
              '知道故事，就知道該用在哪裡。',
          },
          {
            type: 'callout', icon: '📜', title: '成語的兩大來源',
            text: '一、歷史故事（臥薪嘗膽、三顧茅廬）。' +
              '二、寓言故事（守株待兔、揠苗助長、亡羊補牢）。' +
              '記成語最快的方法，就是記那個故事。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '守株待兔' },
                  { id: 'b', text: '揠苗助長' },
                  { id: 'c', text: '亡羊補牢' },
                  { id: 'd', text: '畫蛇添足' },
                  { id: 'e', text: '刻舟求劍' },
                ],
                right: [
                  { id: '1', text: '死守僥倖的經驗，不肯努力' },
                  { id: '2', text: '急著求好，反而把事情弄壞' },
                  { id: '3', text: '出了問題馬上補救，還來得及' },
                  { id: '4', text: '多做了不必要的事，反而壞事' },
                  { id: '5', text: '情況已經變了還用舊方法' },
                ],
                pairs: { a: '1', b: '2', c: '3', d: '4', e: '5' },
              });
            },
          },
        ],
      },

      {
        heading: '褒義還是貶義？',
        blocks: [
          {
            type: 'text',
            text: '成語有「情緒」。有些是稱讚人的（褒義），有些是批評人的（貶義）。' +
              '用錯邊，意思就整個反過來了。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'p', label: '褒義（稱讚）' },
                  { id: 'n', label: '貶義（批評）' },
                ],
                items: [
                  { text: '廢寢忘食', bucket: 'p', why: '形容非常專注努力，連吃飯睡覺都忘了。' },
                  { text: '好高騖遠', bucket: 'n', why: '批評人不切實際，只想做大事卻不打基礎。' },
                  { text: '精益求精', bucket: 'p', why: '已經很好了還要更好，是稱讚。' },
                  { text: '半途而廢', bucket: 'n', why: '做到一半就放棄，是批評。' },
                  { text: '鍥而不捨', bucket: 'p', why: '一直努力不放棄，很正面。' },
                  { text: '自以為是', bucket: 'n', why: '覺得自己一定對、聽不進別人的話。' },
                  { text: '虛懷若谷', bucket: 'p', why: '心胸像山谷一樣寬，形容謙虛。' },
                  { text: '斤斤計較', bucket: 'n', why: '為了小事一直算，是批評。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '⚠️', title: '用錯邊的下場',
            text: '想稱讚同學努力，寫成「他好高騖遠地念書」，' +
              '老師看了會知道你沒懂這個成語。' +
              '不確定是褒是貶的時候，寧可用簡單的話講清楚。',
          },
        ],
      },

      {
        heading: '最容易用錯的幾個',
        blocks: [
          {
            type: 'text',
            text: '有些成語光看字面會猜錯意思。下面這幾個是考試的常客。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '「差強人意」是什麼意思？',
                    hint: '很多人以為是「不好」，其實不是。',
                    options: [
                      '讓人非常失望',
                      '勉強還可以，大致讓人滿意',
                      '完全不能接受',
                      '非常優秀',
                    ],
                    answer: 1,
                    explanation: '「差」在這裡是「稍微」的意思，差強人意 = 勉強讓人滿意。' +
                      '不是在罵人，只是說「還行」。',
                  },
                  {
                    question: '「首當其衝」是什麼意思？',
                    options: [
                      '第一個衝出去的人',
                      '最先受到攻擊或影響的',
                      '跑得最快的',
                      '帶頭的人',
                    ],
                    answer: 1,
                    explanation: '「衝」是要道、受衝擊的位置，指最先受到影響，' +
                      '不是「衝第一個」。例如：颱風來襲，沿海地區首當其衝。',
                  },
                  {
                    question: '「炙手可熱」用來形容什麼？',
                    options: [
                      '東西很燙',
                      '天氣很熱',
                      '權勢大或很受歡迎',
                      '脾氣暴躁',
                    ],
                    answer: 2,
                    explanation: '原意是手一靠近就覺得燙，比喻氣焰或聲勢很盛。' +
                      '現在也常用來說某人或某物非常搶手。',
                  },
                  {
                    question: '「七手八腳」是形容？',
                    options: [
                      '人很多很忙亂',
                      '手腳受傷',
                      '動作很慢',
                      '做事很整齊',
                    ],
                    answer: 0,
                    explanation: '形容大家一起動手，場面忙亂。不是真的有七隻手八隻腳。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '成語和俗諺差在哪',
        blocks: [
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '成語',
                    note: '大多四個字，來自書上的典故，用在書面語比較多，' +
                      '形式固定不能隨便改。',
                    render: function (body) {
                      body.append(
                        El('p', { class: 'lesson-text' }, '例：守株待兔、亡羊補牢、一箭雙鵰'),
                        El('p', { class: 'lesson-text' }, '特點：精簡、文雅、有出處'));
                    },
                  },
                  {
                    label: '俗諺',
                    note: '字數不固定，來自一般人的生活經驗，口語得多，' +
                      '常常押韻好記。',
                    render: function (body) {
                      body.append(
                        El('p', { class: 'lesson-text' }, '例：一枝草一點露、吃果子拜樹頭、戲棚下站久了就是你的'),
                        El('p', { class: 'lesson-text' }, '特點：生活化、口語、常押韻'));
                    },
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🏡', title: '兩個都很厲害',
            text: '成語不比俗諺高級。俗諺是好幾代人生活下來累積的智慧，' +
              '常常一句話就說到骨子裡。兩種都值得學。',
          },
        ],
      },

      {
        heading: '臺灣俗諺怎麼說',
        blocks: [
          {
            type: 'text',
            text: '這些話你可能聽阿公阿嬤說過。每一句都是從真實的生活裡長出來的。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '一枝草，一點露' },
                  { id: 'b', text: '吃果子，拜樹頭' },
                  { id: 'c', text: '戲棚下站久了就是你的' },
                  { id: 'd', text: '近水知魚性，近山識鳥音' },
                  { id: 'e', text: '做雞著筅，做人著翻' },
                ],
                right: [
                  { id: '1', text: '每個人都有自己的一條活路，不用絕望' },
                  { id: '2', text: '受人恩惠要懂得感謝根本' },
                  { id: '3', text: '堅持夠久，機會就會輪到你' },
                  { id: '4', text: '常接觸就會懂，環境會教人' },
                  { id: '5', text: '做人要像雞刨地一樣勤勞打拚' },
                ],
                pairs: { a: '1', b: '2', c: '3', d: '4', e: '5' },
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
                    question: '「亡羊補牢」比較接近下面哪一句的意思？',
                    options: [
                      '已經來不及了',
                      '出了問題趕快補救，還不算太晚',
                      '羊丟了要賠錢',
                      '預防勝於治療',
                    ],
                    answer: 1,
                    explanation: '完整的說法是「亡羊補牢，猶未晚也」—— 補救還來得及。',
                  },
                  {
                    question: '要稱讚一個同學很認真，下面哪一個成語最合適？',
                    options: ['好高騖遠', '半途而廢', '廢寢忘食', '自以為是'],
                    answer: 2,
                    explanation: '廢寢忘食是褒義，形容非常投入。其他三個都是貶義。',
                  },
                  {
                    question: '「差強人意」的意思是？',
                    options: ['非常糟糕', '勉強還可以', '非常優秀', '差別很大'],
                    answer: 1,
                    explanation: '「差」是稍微的意思，所以是「大致上還讓人滿意」。',
                  },
                  {
                    question: '「吃果子，拜樹頭」在教我們什麼？',
                    options: [
                      '吃水果前要洗手',
                      '要懂得感謝根本、飲水思源',
                      '種樹很重要',
                      '拜拜要誠心',
                    ],
                    answer: 1,
                    explanation: '吃到果子要感謝那棵樹，比喻受人恩惠要知道感恩。',
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
     單元 3：句子與修辭
     ══════════════════════════════════════════════ */
  var rhetoric = {
    id: 'k5a-chi-rhetoric',
    grade: 5, semester: '上', order: 3,
    title: '單元 3　句子與修辭',
    subtitle: '同一件事，換個說法就活了',
    icon: '🖋️',
    estimatedMinutes: 35,
    objectives: [
      '知道句子的基本結構：誰、做什麼',
      '會用修飾語把句子寫得具體',
      '認得並會用譬喻、擬人、誇飾',
      '認得排比、設問、映襯',
      '分辨得出一個句子用了哪一種修辭',
    ],
    wrapUp: '修辭不是為了讓句子變漂亮，是為了讓讀的人「看得到」你腦中的畫面。' +
      '寫完一句話可以問自己：別人讀了，腦中會浮出什麼？如果什麼都沒有，就再改一次。',

    sections: [
      {
        heading: '一個句子最少要有兩件事',
        blocks: [
          {
            type: 'text',
            text: '「誰」加上「做什麼」，就是一個完整的句子。' +
              '例如：小狗跑。四個字就成立了。',
          },
          {
            type: 'text',
            text: '但「小狗跑」很空。讀的人不知道是什麼樣的小狗、怎麼跑、跑去哪裡。' +
              '所以我們要加東西進去。',
          },
          {
            type: 'component',
            build: function () {
              return new CompareToggle({
                options: [
                  {
                    label: '只有骨架',
                    note: '意思完整，但讀的人腦中沒有畫面。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text read-sample' }, '小狗跑。'));
                    },
                  },
                  {
                    label: '加上修飾',
                    note: '加了「什麼樣的」「怎麼樣地」「往哪裡」，畫面就出來了。',
                    render: function (body) {
                      body.append(El('p', { class: 'lesson-text read-sample' },
                        '那隻白色的小狗，搖著尾巴，一路衝向巷口的阿婆。'));
                    },
                  },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🔧', title: '三個好用的問題',
            text: '句子太乾的時候問自己：什麼樣的？（形容）怎麼樣地？（動作的樣子）' +
              '在哪裡、什麼時候？（情境）。回答其中一兩個，句子就活了。',
          },
        ],
      },

      {
        heading: '譬喻：拿熟悉的東西來說',
        blocks: [
          {
            type: 'text',
            text: '譬喻就是「把 A 說成 B」，用大家熟悉的 B 來讓人懂 A。' +
              '它是最常用的修辭，也是考最多的。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點點看三種譬喻',
                parts: [
                  {
                    name: '明喻', icon: '🔗',
                    description: '有「像、好像、如、彷彿、似」這類詞把兩邊接起來。' +
                      '例：她的笑容像春天的陽光。三樣東西都在：本體（笑容）、喻詞（像）、喻體（陽光）。',
                  },
                  {
                    name: '暗喻', icon: '🟰',
                    description: '不用「像」，改用「是、成為、變成」。' +
                      '例：書是人類的階梯。語氣比明喻更肯定。',
                  },
                  {
                    name: '借喻', icon: '🫥',
                    description: '本體和喻詞都不出現，直接用喻體代替。' +
                      '例：別再當縮頭烏龜了（直接用烏龜代替那個害怕的人）。',
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
                  { id: 'm', label: '明喻（有「像」）' },
                  { id: 'a', label: '暗喻（用「是」）' },
                  { id: 'j', label: '借喻（直接拿來代替）' },
                ],
                items: [
                  { text: '月亮像一艘銀色的小船。', bucket: 'm', why: '有「像」，本體喻體都在。' },
                  { text: '時間是最公平的裁判。', bucket: 'a', why: '用「是」把時間和裁判等同起來。' },
                  { text: '他彷彿一隻受驚的小鹿。', bucket: 'm', why: '「彷彿」也是喻詞。' },
                  { text: '教室裡的那群小麻雀又吵起來了。', bucket: 'j', why: '直接用「小麻雀」代替學生，本體沒出現。' },
                  { text: '知識就是力量。', bucket: 'a', why: '用「就是」連接。' },
                  { text: '她的心如同一池靜水。', bucket: 'm', why: '「如同」是喻詞。' },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '擬人和誇飾',
        blocks: [
          {
            type: 'text',
            text: '擬人：把不是人的東西，寫得像人一樣會動作、會有感情。',
          },
          {
            type: 'text',
            text: '誇飾：故意把事情說得比實際更大或更小，讓感覺更強烈。' +
              '注意是「故意」—— 讀的人知道那不是真的。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'p', label: '擬人' },
                  { id: 'h', label: '誇飾' },
                ],
                items: [
                  { text: '風輕輕地拍著我的肩膀。', bucket: 'p', why: '風會「拍肩膀」，那是人的動作。' },
                  { text: '我餓得可以吞下一頭牛。', bucket: 'h', why: '故意說得很誇張，讓人感覺到真的很餓。' },
                  { text: '小溪一路唱著歌跑向大海。', bucket: 'p', why: '小溪會唱歌、會跑，是人的行為。' },
                  { text: '他的房間亂得連腳都放不下。', bucket: 'h', why: '誇張的說法，強調很亂。' },
                  { text: '老樹彎著腰，守著這個村子好幾十年了。', bucket: 'p', why: '彎腰、守著，都是擬人。' },
                  { text: '這題我想破了頭也想不出來。', bucket: 'h', why: '頭當然不會破，是誇飾。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🤔', title: '怎麼分擬人和譬喻',
            text: '譬喻是「A 像 B」，兩邊都在。擬人是直接讓 A 做人的事，沒有 B。' +
              '「小溪像在唱歌」是譬喻（有「像」），「小溪唱著歌」是擬人。',
          },
        ],
      },

      {
        heading: '排比、設問、映襯',
        blocks: [
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點點看這三種',
                parts: [
                  {
                    name: '排比', icon: '📶',
                    description: '用三個或三個以上結構相似的句子接在一起，' +
                      '讓語氣變強、節奏變明顯。' +
                      '例：風吹過山谷，吹過田野，吹過我的窗前。',
                  },
                  {
                    name: '設問', icon: '❓',
                    description: '明明知道答案，還是先問一句，再自己回答，' +
                      '目的是讓讀的人跟著想。' +
                      '例：為什麼他能做到？因為他每天都比別人多練一個小時。',
                  },
                  {
                    name: '映襯', icon: '⚫',
                    description: '把相反的兩件事放在一起，互相襯托，差別就被放大了。' +
                      '例：他在人群中笑著，心裡卻下著雨。',
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
                  { id: 'b', label: '排比' },
                  { id: 's', label: '設問' },
                  { id: 'y', label: '映襯' },
                ],
                items: [
                  { text: '讀書要用心，做事要用心，待人也要用心。', bucket: 'b', why: '三個結構一樣的句子排在一起。' },
                  { text: '什麼是勇敢？勇敢就是害怕的時候還願意往前走。', bucket: 's', why: '自問自答。' },
                  { text: '教室裡熱鬧得像市場，走廊上卻安靜得聽得見呼吸。', bucket: 'y', why: '熱鬧和安靜放在一起對比。' },
                  { text: '春天播種，夏天成長，秋天收穫。', bucket: 'b', why: '三句同構，節奏整齊。' },
                  { text: '誰說失敗不好？失敗讓我們知道哪裡要改。', bucket: 's', why: '先問再答。' },
                  { text: '他擁有很多東西，卻沒有一個真正的朋友。', bucket: 'y', why: '「很多」和「沒有」形成對比。' },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '實際判斷看看',
        blocks: [
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '「太陽公公把棉被曬得暖呼呼的。」用了什麼修辭？',
                    options: ['譬喻', '擬人', '誇飾', '排比'],
                    answer: 1,
                    explanation: '把太陽叫成「公公」、讓它會曬棉被，是擬人。',
                  },
                  {
                    question: '「他的聲音大得整棟樓都在搖。」用了什麼修辭？',
                    options: ['擬人', '譬喻', '誇飾', '設問'],
                    answer: 2,
                    explanation: '樓當然不會搖，故意說得很誇張來強調聲音大，是誇飾。',
                  },
                  {
                    question: '「月光像一層薄薄的霜，鋪在院子裡。」用了什麼修辭？',
                    options: ['明喻', '暗喻', '借喻', '擬人'],
                    answer: 0,
                    explanation: '有「像」，本體（月光）和喻體（霜）都出現，是明喻。',
                  },
                  {
                    question: '「他是我們班的小太陽。」用了什麼修辭？',
                    hint: '注意用的是「是」還是「像」。',
                    options: ['明喻', '暗喻', '誇飾', '映襯'],
                    answer: 1,
                    explanation: '用「是」把人和太陽等同起來，是暗喻。如果寫「他像小太陽」才是明喻。',
                  },
                  {
                    question: '「牆裡開花牆外香，屋內冷清屋外熱鬧。」主要用了什麼修辭？',
                    options: ['設問', '誇飾', '映襯', '擬人'],
                    answer: 2,
                    explanation: '裡和外、冷清和熱鬧，相反的放在一起互相襯托，是映襯。',
                  },
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
            type: 'text',
            text: '辨認修辭有一套固定的檢查順序，照著走幾乎不會錯。',
          },
          {
            type: 'callout', icon: '🧭', title: '四步檢查法',
            text: '一、有沒有「像、好像、彷彿、如」？有 → 明喻。' +
              '二、有沒有「是、成為、變成」把兩個不同的東西等同？有 → 暗喻。' +
              '三、有沒有讓東西做人的動作？有 → 擬人。' +
              '四、是不是明顯不可能的誇張？是 → 誇飾。',
          },
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '「小草從土裡探出頭來，好奇地張望。」用了什麼修辭？',
                    options: ['譬喻', '擬人', '排比', '設問'],
                    answer: 1,
                    explanation: '探頭、張望、好奇都是人的動作和情緒，是擬人。',
                  },
                  {
                    question: '下面哪一句「沒有」用譬喻？',
                    options: [
                      '時間像流水一樣',
                      '他的笑容如陽光般溫暖',
                      '他跑得很快',
                      '書是知識的翅膀',
                    ],
                    answer: 2,
                    explanation: '「他跑得很快」只是單純的敘述，沒有拿別的東西來比。',
                  },
                  {
                    question: '用排比至少要幾個結構相似的句子？',
                    options: ['兩個', '三個', '四個', '沒有規定'],
                    answer: 1,
                    explanation: '一般認為要三個或三個以上才算排比。兩個通常叫對偶。',
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
     單元 4：閱讀理解
     ══════════════════════════════════════════════ */
  var reading = {
    id: 'k5a-chi-reading',
    grade: 5, semester: '上', order: 4,
    title: '單元 4　閱讀理解',
    subtitle: '讀完要說得出「他到底想講什麼」',
    icon: '🔍',
    estimatedMinutes: 35,
    objectives: [
      '找得出一段文字的主旨',
      '認得出段落裡的主題句',
      '分辨文章裡的事實和意見',
      '會從線索推論文章沒有直接說的事',
      '看得出文章的組織方式',
    ],
    wrapUp: '閱讀測驗錯的人，多半不是看不懂字，是沒有回頭確認。' +
      '養成一個習慣：選好答案之後，回文章裡找出「哪一句話支持我」。' +
      '找不到那一句，答案通常就錯了。',

    sections: [
      {
        heading: '主旨：作者到底想說什麼',
        blocks: [
          {
            type: 'text',
            text: '主旨不是「這篇在講什麼東西」，是「作者想透過這些東西告訴你什麼」。' +
              '這兩個差很多。',
          },
          passage('先讀一段', [
            '阿明剛開始學游泳的時候，連把臉放進水裡都會怕。' +
            '教練沒有催他，只是每天陪他在池邊練習憋氣，一次只要求多撐一秒。',
            '三個月後，阿明已經能游完整個二十五公尺。' +
            '他回頭看才發現，自己並不是突然變厲害的 —— ' +
            '是那些每天多撐的一秒，一秒一秒疊起來的。',
          ]),
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '這段文字的主旨最接近下面哪一個？',
                    hint: '問的是「作者想告訴你什麼」，不是「發生了什麼事」。',
                    options: [
                      '阿明學會了游泳',
                      '游泳要先學會憋氣',
                      '進步是每天一點點累積出來的',
                      '教練很有耐心',
                    ],
                    answer: 2,
                    explanation: '「阿明學會游泳」只是事件，「每天多撐一秒疊起來」才是作者想說的道理。' +
                      '最後一句就是主旨所在。',
                  },
                  {
                    question: '找主旨的時候，最值得注意的通常是哪裡？',
                    options: [
                      '文章最長的那一段',
                      '開頭第一句或結尾最後一句',
                      '有數字的地方',
                      '有對話的地方',
                    ],
                    answer: 1,
                    explanation: '主旨常常放在開頭（先講結論）或結尾（最後總結）。' +
                      '先看這兩個位置，命中率最高。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '主題句：一段話的骨頭',
        blocks: [
          {
            type: 'text',
            text: '一個段落通常有一句話扛起整段的意思，叫「主題句」。' +
              '其他句子都在支持它、解釋它、舉例說明它。',
          },
          passage('找找看哪一句是骨頭', [
            '夜市是認識一個城市最快的方式。' +
            '在那裡你聞得到當地人每天吃什麼，' +
            '聽得到他們用什麼腔調殺價，' +
            '也看得到他們晚上幾點才願意回家。' +
            '一碗麵的價錢，就說出了這個地方的生活水平。',
          ]),
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '這一段的主題句是哪一句？',
                    options: [
                      '夜市是認識一個城市最快的方式。',
                      '在那裡你聞得到當地人每天吃什麼。',
                      '聽得到他們用什麼腔調殺價。',
                      '一碗麵的價錢，就說出了這個地方的生活水平。',
                    ],
                    answer: 0,
                    explanation: '第一句講出整段的核心主張，後面全部都在舉例支持它。' +
                      '這就是典型的「主題句在段首」。',
                  },
                  {
                    question: '主題句和其他句子的關係是？',
                    options: [
                      '沒有關係',
                      '其他句子在支持、說明主題句',
                      '主題句一定最長',
                      '主題句一定在最後',
                    ],
                    answer: 1,
                    explanation: '主題句提出主張，其他句子負責舉例、解釋、補充。' +
                      '位置可能在開頭、結尾，偶爾在中間。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '事實還是意見',
        blocks: [
          {
            type: 'text',
            text: '事實可以查證，意見不行。讀文章的時候分清楚這兩種，' +
              '才不會把別人的看法當成真理。',
          },
          {
            type: 'component',
            build: function () {
              return new SortBuckets({
                wide: true,
                buckets: [
                  { id: 'f', label: '事實' },
                  { id: 'o', label: '意見' },
                ],
                items: [
                  { text: '這本書總共有兩百四十頁。', bucket: 'f', why: '翻一下就能確認。' },
                  { text: '這本書是我今年讀過最好看的。', bucket: 'o', why: '「最好看」是個人感受。' },
                  { text: '玉山的海拔是 3952 公尺。', bucket: 'f', why: '有測量數據。' },
                  { text: '爬山比游泳有趣多了。', bucket: 'o', why: '有不有趣因人而異。' },
                  { text: '這家店開了三十年。', bucket: 'f', why: '可以查證。' },
                  { text: '這家店的老闆人很好。', bucket: 'o', why: '「人很好」是主觀評價。' },
                ],
              });
            },
          },
          {
            type: 'callout', icon: '🔍', title: '一個測試',
            text: '問自己：「如果有人說不是這樣，我能拿出證據嗎？」' +
              '能 → 事實。不能，只能說「我覺得」 → 意見。',
          },
        ],
      },

      {
        heading: '推論：文章沒說，但看得出來',
        blocks: [
          {
            type: 'text',
            text: '好的閱讀不只讀出字面，還能從線索推出沒寫出來的事。' +
              '但推論要有根據，不能用猜的。',
          },
          passage('讀完推推看', [
            '她把傘留在玄關，自己淋著雨走出門。' +
            '鄰居問她要去哪，她只搖搖頭，腳步沒有停。',
            '桌上那碗麵還冒著熱氣，筷子整齊地擺在旁邊，一口都沒動。',
          ]),
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '從這段文字，最合理的推論是什麼？',
                    hint: '留著傘不用、麵一口沒動、腳步不停。',
                    options: [
                      '她很喜歡淋雨',
                      '她發生了急事或心情很亂，所以顧不得這些',
                      '她討厭吃麵',
                      '她要去買新的傘',
                    ],
                    answer: 1,
                    explanation: '三個細節都指向同一件事：她沒有心思照顧自己。' +
                      '文章沒有明說，但線索一致。',
                  },
                  {
                    question: '下面哪一個「不是」合理的推論？',
                    options: [
                      '她出門很匆忙',
                      '那碗麵是剛煮好的',
                      '她和鄰居吵架了',
                      '她當時沒有心情說話',
                    ],
                    answer: 2,
                    explanation: '文章只說鄰居問她、她搖頭，完全沒有吵架的線索。' +
                      '推論要有文字根據，不能自己加劇情。',
                  },
                  {
                    question: '推論和亂猜的差別在哪裡？',
                    options: [
                      '推論比較長',
                      '推論要能在文章裡找到支持的線索',
                      '推論一定正確',
                      '沒有差別',
                    ],
                    answer: 1,
                    explanation: '推論必須回得到文章。說得出「因為文章寫了某某」，才叫推論。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '文章是怎麼組織的',
        blocks: [
          {
            type: 'text',
            text: '看出作者的組織方式，閱讀速度會快很多 —— ' +
              '因為你會知道下一段大概要講什麼。',
          },
          {
            type: 'component',
            build: function () {
              return new TapPairing({
                left: [
                  { id: 'a', text: '時間順序' },
                  { id: 'b', text: '因果關係' },
                  { id: 'c', text: '比較對照' },
                  { id: 'd', text: '總分總' },
                ],
                right: [
                  { id: '1', text: '先說早上，再說中午，最後說晚上' },
                  { id: '2', text: '因為下大雨，所以球賽取消了' },
                  { id: '3', text: '城市生活很方便，鄉下生活很安靜' },
                  { id: '4', text: '先講結論 → 舉三個例子 → 再講一次結論' },
                ],
                pairs: { a: '1', b: '2', c: '3', d: '4' },
              });
            },
          },
          {
            type: 'callout', icon: '🔤', title: '看關鍵詞就知道',
            text: '「首先、接著、最後」→ 時間或步驟。' +
              '「因為、所以、因此」→ 因果。' +
              '「相反地、但是、而」→ 比較對照。' +
              '「總之、由此可見」→ 要下結論了。',
          },
        ],
      },

      {
        heading: '做閱讀測驗的方法',
        blocks: [
          {
            type: 'text',
            text: '很多人閱讀測驗錯，不是看不懂，是方法不對。' +
              '下面這個順序可以明顯減少錯誤。',
          },
          {
            type: 'component',
            build: function () {
              return new LabeledDiagram({
                caption: '點點看每一步',
                parts: [
                  {
                    name: '一、先看題目', icon: '👀',
                    description: '知道等一下要找什麼，讀文章的時候眼睛才有方向。' +
                      '不然讀完一遍還要再讀一遍。',
                  },
                  {
                    name: '二、讀文章時做記號', icon: '✏️',
                    description: '看到和題目有關的句子就畫線。' +
                      '這樣回來找的時候不用重頭看。',
                  },
                  {
                    name: '三、回文章找根據', icon: '📌',
                    description: '每選一個答案，都要能指出「文章第幾行支持我」。' +
                      '找不到就代表那是你自己想的，不是文章說的。',
                  },
                  {
                    name: '四、小心「絕對」的選項', icon: '⚠️',
                    description: '出現「一定、全部、永遠、絕對不」的選項要特別檢查。' +
                      '文章很少把話說得那麼滿，這類選項常常是錯的。',
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
                    question: '做閱讀測驗時，先看題目再讀文章有什麼好處？',
                    options: [
                      '可以少讀一點',
                      '讀文章時知道要找什麼，比較有方向',
                      '可以不用讀文章',
                      '沒有差別',
                    ],
                    answer: 1,
                    explanation: '帶著問題讀，重點會自己跳出來，也不用讀第二遍。',
                  },
                  {
                    question: '選好答案之後，最重要的一步是？',
                    options: [
                      '趕快寫下一題',
                      '回文章找出支持這個答案的句子',
                      '問同學',
                      '重新讀一次全文',
                    ],
                    answer: 1,
                    explanation: '找得到根據，答案才站得住。這一步最能減少錯誤。',
                  },
                ],
              });
            },
          },
        ],
      },

      {
        heading: '最後檢查一次',
        blocks: [
          passage('綜合練習', [
            '阿嬤的縫紉機放在客廳角落，已經很多年沒有響過了。' +
            '以前每到換季，整個晚上都聽得見那個規律的聲音。',
            '現在衣服破了，媽媽會直接買新的。她說修一件的時間，' +
            '可以加班賺到三件的錢。這話沒有錯。',
            '只是那台機器還在那裡，蓋著一塊布。偶爾我會掀開來看一眼，' +
            '覺得它好像還在等誰。',
          ]),
          {
            type: 'component',
            build: function () {
              return new ChoiceQuiz({
                questions: [
                  {
                    question: '這篇文章的主旨最接近？',
                    options: [
                      '縫紉機壞掉了',
                      '媽媽很會賺錢',
                      '時代改變了，有些東西被留在原地',
                      '買新衣服比較划算',
                    ],
                    answer: 2,
                    explanation: '文章用縫紉機的沉默，寫出生活方式的改變和一種說不出口的失落。' +
                      '「買新的比較划算」只是文中的一個理由，不是主旨。',
                  },
                  {
                    question: '「這話沒有錯」這一句，透露出作者什麼態度？',
                    hint: '他說「沒有錯」，但後面還有一個「只是」。',
                    options: [
                      '完全同意媽媽，沒有別的想法',
                      '道理上接受，但情感上還是捨不得',
                      '覺得媽媽說錯了',
                      '不在乎這件事',
                    ],
                    answer: 1,
                    explanation: '「沒有錯」是理智上的承認，接著用「只是」轉折，' +
                      '後面寫的全是感情。這個轉折就是答案。',
                  },
                  {
                    question: '「覺得它好像還在等誰」用了什麼修辭？',
                    options: ['譬喻', '擬人', '誇飾', '排比'],
                    answer: 1,
                    explanation: '機器不會等人，「等」是人的行為，所以是擬人。',
                  },
                  {
                    question: '下面哪一句是文章裡的「事實」而不是「意見」？',
                    options: [
                      '縫紉機好像還在等誰',
                      '修一件的時間可以賺到三件的錢',
                      '縫紉機放在客廳角落，蓋著一塊布',
                      '那個聲音很規律很好聽',
                    ],
                    answer: 2,
                    explanation: '位置和狀態可以直接查證，是事實。其他幾個都帶有感受或推估。',
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
    key: 'chinese', subject: '國語', icon: '📚',
    grade: 5, term: '上', version: 'any', versionName: '各版本通用',
    note: '照語文能力分，不照課文分 —— 各家版本選的課文不同，但要練的能力一樣。' +
      '裡面的例句和短文都是為這份教材寫的。',
    units: [words, idioms, rhetoric, reading],
  });
})();
