/* 引導式教學 — 國語 五年級下學期（2026-11-10，2026-11-11 補註課本目錄）
 *
 * version 標 any，這一份教的是能力，不是課文。四個單元對齊闖關站五下國語的題庫。
 *
 * 2026-11-11 拿到康軒五下國語的課本目錄了（民國114年6月再版，十二課，
 * 完整清單抄在 quest/data/chinese-5b-20261110.js 的檔頭）。
 * 看過之後決定這一份不動 —— 課本自己把「句型示例」「修辭示例」放在
 * 全書最前面當共用參考頁，等於課本也是「課文歸課文、語文能力獨立一塊」。
 * 要做課文題得看得到課文本身，光有課名就出題是照標題猜內容，猜錯比不出還糟。
 *
 * 跟五上刻意不重複：
 *   五上 字詞基本功（部首筆畫造詞）→ 五下 字音字形（分辨形近同音多音）
 *   五上 成語與俗諺               → 五下 詞語辨析（近義反義量詞關聯詞）
 *   五上 句子與修辭（譬喻擬人）    → 五下 句子與標點（標點句型改病句）
 *   五上 閱讀理解（找主旨找訊息）  → 五下 文體與閱讀策略（分辨文體摘要推論）
 */
'use strict';

(function () {
  var G5 = window.G5;
  var TapPairing = G5.TapPairing, ChoiceQuiz = G5.ChoiceQuiz,
      LabeledDiagram = G5.LabeledDiagram, CompareToggle = G5.CompareToggle,
      SortBuckets = G5.SortBuckets;

  /* ══════════════ 單元 1：字音字形 ══════════════ */
  var shape = {
    id: 'k5b-chi-shape', grade: 5, semester: 2, order: 1,
    title: '單元 1　字音字形',
    subtitle: '長得像、唸起來一樣、或是一個字兩種唸法 —— 三種陷阱一次解決',
    icon: '🔤', estimatedMinutes: 22,
    objectives: [
      '用部首分辨形近字，而不是靠眼睛的印象',
      '遇到同音字時，知道要從詞語的意思去判斷用哪一個',
      '說得出多音字的唸法為什麼會變，並能放回句子裡判斷',
      '寫完一段話之後，會自己回頭檢查錯別字',
    ],
    wrapUp: '這一課只有一個核心方法：不要用眼睛記字，要用意思記字。' +
      '部首是意思的線索，詞語是用法的線索，句子是唸法的線索。' +
      '三個線索都用上，錯別字會少掉一大半。',
    sections: [

      { heading: '為什麼會寫錯字？', blocks: [
        { type: 'text', text: '先分清楚三種不同的錯，因為解法不一樣。' },
        { type: 'component', build: function () {
          return new LabeledDiagram({
            caption: '三種錯字，三種解法',
            parts: [
              { icon: '👀', name: '形近字',
                description: '字長得像，差一個部件。例如「睛」和「晴」、「既」和「即」。\n' +
                  '解法：看部首。部首告訴你這個字屬於哪一類意思。' },
              { icon: '🔊', name: '同音異字',
                description: '唸起來一模一樣，寫法完全不同。例如「視」「試」「市」。\n' +
                  '解法：想整個詞語在講什麼，再看哪個字的意思對得上。' },
              { icon: '🎭', name: '多音字',
                description: '同一個字，兩種以上的唸法。例如「樂」可以唸ㄩㄝˋ也可以唸ㄌㄜˋ。\n' +
                  '解法：放回句子裡，看它是什麼意思、當什麼詞性。' },
            ],
          });
        } },
      ]},

      { heading: '形近字：部首就是答案', blocks: [
        { type: 'text', text: '「睛」和「晴」只差一個部件，但是那個部件就是全部的答案。' +
          '「睛」是「目」部 —— 跟眼睛有關。「晴」是「日」部 —— 跟天氣有關。' },
        { type: 'text', text: '這不是巧合。中文的字大部分都是「一半表示意思，一半表示讀音」。' +
          '所以看到不認識的字，先找部首，意思就猜到一半了。' },
        { type: 'component', build: function () {
          return new TapPairing({
            left: [
              { id: 'c1', text: '睛（目部）' },
              { id: 'c2', text: '晴（日部）' },
              { id: 'c3', text: '避（走部）' },
              { id: 'c4', text: '壁（土部）' },
              { id: 'c5', text: '協（十部，共同）' },
              { id: 'c6', text: '脅（肉部，威嚇）' },
            ],
            right: [
              { id: 'd1', text: '眼　　' },
              { id: 'd2', text: '　　天' },
              { id: 'd3', text: '　　免受傷' },
              { id: 'd4', text: '牆　　' },
              { id: 'd5', text: '　　力合作' },
              { id: 'd6', text: '威　　' },
            ],
            pairs: { c1: 'd1', c2: 'd2', c3: 'd3', c4: 'd4', c5: 'd5', c6: 'd6' },
          });
        } },
        { type: 'callout', title: '一個很好用的習慣', text:
          '寫完一個不太確定的字，問自己一句：「這個字的部首，跟我想講的意思有關係嗎？」\n' +
          '寫「晴天」的時候想到「日」，很合理。寫「眼晴」的時候想到「日」，就知道錯了。' },
      ]},

      { heading: '同音字：音幫不了你，意思才行', blocks: [
        { type: 'text', text: '同音字的麻煩在於：唸出來完全一樣，耳朵救不了你。' +
          '唯一的辦法是想「這個詞在講什麼」。' },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'shi4', label: '用「視」（跟看有關）' },
              { id: 'shi4b', label: '用「試」（跟嘗試有關）' },
              { id: 'shi4c', label: '用「市」（跟市場有關）' },
            ],
            items: [
              { text: '　　力檢查', bucket: 'shi4', why: '視力是看的能力，用目字旁的視。' },
              { text: '注　　著他', bucket: 'shi4', why: '注視是集中去看。' },
              { text: '電　　節目', bucket: 'shi4', why: '電視是用來看的，所以也是視。' },
              { text: '考　　成績', bucket: 'shi4b', why: '考試是試著檢驗，用試。' },
              { text: '　　穿看看', bucket: 'shi4b', why: '試穿是嘗試，用試。' },
              { text: '菜　　場', bucket: 'shi4c', why: '市場的市，跟買賣的地方有關。' },
              { text: '台北　　', bucket: 'shi4c', why: '城市的市，也是這個字。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '「老師　　勵我們多閱讀。」應該填哪個字？',
                options: ['鼓', '古', '股'],
                answer: 0,
                explanation: '「鼓勵」本來就有打鼓助陣、替人加油的意思，所以是鼓。' },
              { question: '「他很　　力地練習。」應該填哪個字？',
                options: ['努', '怒', '奴'],
                answer: 0,
                explanation: '「努」下面就是「力」，本義就是出力。看字形就看出來了。' },
              { question: '「打預防針可以　　防生病。」應該填哪個字？',
                options: ['預', '遇', '與'],
                answer: 0,
                explanation: '「預」是事先：預防、預習、預報。「遇」是已經碰到了，意思剛好相反。' },
              { question: '遇到同音字不確定的時候，最有效的做法是什麼？',
                options: ['想整個詞語的意思，再挑意思對得上的那個字', '選筆畫最少的', '憑感覺'],
                answer: 0,
                explanation: '音分不出來，意思一定分得出來。這是同音字唯一的解法。' },
            ],
          });
        } },
      ]},

      { heading: '多音字：看它在句子裡做什麼', blocks: [
        { type: 'text', text: '多音字有一個很常見的規則：當動詞一種唸法，當名詞另一種唸法。' },
        { type: 'component', build: function () {
          return new CompareToggle({
            options: [
              { label: '種：ㄓㄨㄥˋ 還是 ㄓㄨㄥˇ', note:
                '當動詞（栽種）唸ㄓㄨㄥˋ：種樹、種花。\n' +
                '當名詞（種子、種類）唸ㄓㄨㄥˇ：種子、品種、三種。' },
              { label: '量：ㄌㄧㄤˊ 還是 ㄌㄧㄤˋ', note:
                '當動詞（測量）唸ㄌㄧㄤˊ：量體溫、量身高。\n' +
                '當名詞（數量）唸ㄌㄧㄤˋ：重量、數量、力量。' },
              { label: '長：ㄔㄤˊ 還是 ㄓㄤˇ', note:
                '講長短唸ㄔㄤˊ：長度、很長、長方形。\n' +
                '講生長或領導的人唸ㄓㄤˇ：長高、校長、班長。' },
              { label: '樂：ㄩㄝˋ 還是 ㄌㄜˋ', note:
                '跟音樂、樂器有關唸ㄩㄝˋ：音樂、樂隊、樂器。\n' +
                '跟快樂、高興有關唸ㄌㄜˋ：快樂、歡樂、樂觀。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '「銀行」的「行」要唸什麼？',
                options: ['ㄏㄤˊ', 'ㄒㄧㄥˊ', '兩個都可以'],
                answer: 0,
                explanation: '行業、行列唸ㄏㄤˊ。走路、進行唸ㄒㄧㄥˊ，例如「行走」「行動」。' },
              { question: '「重複」的「重」要唸什麼？',
                options: ['ㄔㄨㄥˊ', 'ㄓㄨㄥˋ', '兩個都可以'],
                answer: 0,
                explanation: '「再一次」的意思唸ㄔㄨㄥˊ：重複、重新、重來。重量的重唸ㄓㄨㄥˋ。' },
              { question: '「好學」（喜歡學習）的「好」要唸什麼？',
                options: ['ㄏㄠˋ', 'ㄏㄠˇ', '兩個都可以'],
                answer: 0,
                explanation: '「喜愛」的意思唸ㄏㄠˋ：好學、好奇、愛好。「優良」的意思唸ㄏㄠˇ。' },
              { question: '判斷多音字唸法的方法是什麼？',
                options: ['看它在句子裡是什麼意思、當什麼詞性', '背下來，沒有規則', '一律唸第一聲'],
                answer: 0,
                explanation: '永遠連著整個句子一起看。單獨一個字拿出來問，常常答不了。' },
            ],
          });
        } },
      ]},
    ],
  };

  /* ══════════════ 單元 2：詞語辨析與運用 ══════════════ */
  var words = {
    id: 'k5b-chi-words2', grade: 5, semester: 2, order: 2,
    title: '單元 2　詞語辨析與運用',
    subtitle: '近義詞、反義詞、量詞、關聯詞 —— 把話說得剛剛好',
    icon: '🧩', estimatedMinutes: 20,
    objectives: [
      '分得出近義詞之間的語氣差異，知道什麼場合用哪一個',
      '找反義詞時知道要在同一個面向上相反',
      '用對常見的量詞，並說出量詞跟形狀的關係',
      '用關聯詞把兩個短句接成邏輯通順的一句',
    ],
    wrapUp: '詞彙量不是用來炫耀的，是用來把想說的話說得剛剛好。' +
      '同樣一件事，用「堅持」或用「固執」，聽的人感受完全不同 —— ' +
      '會挑詞，就是會表達。',
    sections: [

      { heading: '近義詞：像，但是不一樣', blocks: [
        { type: 'text', text: '「他的個性很堅持」和「他的個性很固執」—— 意思很接近，' +
          '可是一句是稱讚，一句是批評。' },
        { type: 'text', text: '近義詞的差別通常在三個地方：語氣的輕重、搭配的對象、使用的場合。' },
        { type: 'component', build: function () {
          return new CompareToggle({
            options: [
              { label: '語氣輕重', note: '「生氣」和「憤怒」：都在講不高興，但是憤怒重多了。\n' +
                '「喜歡」和「熱愛」：也是同一個方向，程度不同。' },
              { label: '稱讚或批評', note: '「堅持」偏稱讚，「固執」偏批評。\n' +
                '「節省」偏稱讚，「小氣」偏批評。\n' +
                '意思像，但是站的立場不一樣。' },
              { label: '口語或書面', note: '「好吃」和「美味」：聊天用好吃，寫作文用美味比較合。\n' +
                '沒有對錯，只有合不合場合。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new SortBuckets({
            buckets: [
              { id: 'good', label: '偏稱讚' },
              { id: 'bad', label: '偏批評' },
            ],
            items: [
              { text: '堅持', bucket: 'good', why: '認定目標不放棄，是正面的評價。' },
              { text: '固執', bucket: 'bad', why: '不聽別人的意見，是負面的評價。' },
              { text: '節省', bucket: 'good', why: '該花的花，不該花的不花。' },
              { text: '小氣', bucket: 'bad', why: '該花的也不花，讓別人不舒服。' },
              { text: '謹慎', bucket: 'good', why: '做事小心周到。' },
              { text: '膽小', bucket: 'bad', why: '該做的事也不敢做。' },
            ],
          });
        } },
      ]},

      { heading: '反義詞：要在同一個面向上相反', blocks: [
        { type: 'text', text: '「安靜」的反義詞是「吵鬧」，不是「乾淨」。' +
          '因為安靜和吵鬧都在講聲音，而乾淨講的是另一件事。' },
        { type: 'component', build: function () {
          return new TapPairing({
            left: [
              { id: 'a1', text: '安靜' },
              { id: 'a2', text: '節省' },
              { id: 'a3', text: '堅強' },
              { id: 'a4', text: '偶爾' },
              { id: 'a5', text: '困難' },
            ],
            right: [
              { id: 'b1', text: '吵鬧' },
              { id: 'b2', text: '浪費' },
              { id: 'b3', text: '脆弱' },
              { id: 'b4', text: '經常' },
              { id: 'b5', text: '容易' },
            ],
            pairs: { a1: 'b1', a2: 'b2', a3: 'b3', a4: 'b4', a5: 'b5' },
          });
        } },
        { type: 'callout', title: '檢查的方法', text:
          '找到一組之後，問自己：「這兩個詞是在比同一件事嗎？」\n' +
          '安靜對吵鬧 —— 都在比聲音，對。\n' +
          '堅強對柔軟 —— 一個在比面對困難的能力，一個在比質地，不對。' },
      ]},

      { heading: '量詞：大多跟形狀有關', blocks: [
        { type: 'text', text: '「一輪明月」為什麼是輪？因為月亮圓圓的像輪子。' +
          '「一股清泉」為什麼是股？因為水是流動的一條。' },
        { type: 'text', text: '量詞不是隨便配的，大部分都在描述那個東西的樣子。' +
          '知道這件事，就不用硬背了。' },
        { type: 'component', build: function () {
          return new TapPairing({
            left: [
              { id: 'm1', text: '一輪' },
              { id: 'm2', text: '一股' },
              { id: 'm3', text: '一封' },
              { id: 'm4', text: '一匹' },
              { id: 'm5', text: '一首' },
              { id: 'm6', text: '一片' },
            ],
            right: [
              { id: 'n1', text: '明月（圓的）' },
              { id: 'n2', text: '清泉（流動的）' },
              { id: 'n3', text: '信（要封起來）' },
              { id: 'n4', text: '馬' },
              { id: 'n5', text: '歌' },
              { id: 'n6', text: '草地（平鋪的）' },
            ],
            pairs: { m1: 'n1', m2: 'n2', m3: 'n3', m4: 'n4', m5: 'n5', m6: 'n6' },
          });
        } },
        { type: 'callout', title: '疊詞也是同一個道理', text:
          '「綠油油」比「很綠」有畫面，因為它讓你感覺到那個發亮的樣子。\n' +
          '「慢慢地走」比「慢走」有過程感。\n' +
          '疊詞的作用就是把抽象的描述變具體。寫作文的時候很好用，但是不要整篇都用。' },
      ]},

      { heading: '關聯詞：句子的骨架', blocks: [
        { type: 'text', text: '關聯詞接錯，整句話的邏輯就垮了。' +
          '「因為下雨，所以我沒有帶傘」—— 詞用對了，道理不通。' },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'turn', label: '轉折（前後相反）' },
              { id: 'cause', label: '因果（前面造成後面）' },
              { id: 'more', label: '遞進（後面更進一步）' },
              { id: 'pick', label: '選擇（二選一）' },
            ],
            items: [
              { text: '雖然……但是……', bucket: 'turn', why: '前面一個方向，後面轉過來。' },
              { text: '儘管……還是……', bucket: 'turn', why: '也是轉折，語氣比雖然更強。' },
              { text: '因為……所以……', bucket: 'cause', why: '前面是原因，後面是結果。' },
              { text: '既然……就……', bucket: 'cause', why: '前面成立，後面順著做結論。' },
              { text: '不但……而且……', bucket: 'more', why: '後面是加碼，不是轉彎。' },
              { text: '不僅……還……', bucket: 'more', why: '也是遞進，意思往上疊。' },
              { text: '不是……就是……', bucket: 'pick', why: '兩個裡面一定有一個。' },
              { text: '或者……或者……', bucket: 'pick', why: '列出可以選的項目。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '「　　天氣很冷，　　他還是去運動。」該填哪一組？',
                options: ['雖然……但是……', '因為……所以……', '不但……而且……'],
                answer: 0,
                explanation: '天氣冷照常理不該去，他去了 —— 前後相反，要用轉折。' },
              { question: '「他　　成績好，　　很樂於幫忙。」該填哪一組？',
                options: ['不但……而且……', '雖然……但是……', '不是……就是……'],
                answer: 0,
                explanation: '兩件事都是優點，後面是加碼，所以用遞進。' },
              { question: '用錯關聯詞會造成什麼問題？',
                options: ['句子的邏輯就錯了，意思會變得不通', '只是不好聽', '沒什麼影響'],
                answer: 0,
                explanation: '關聯詞是句子的骨架。骨架接錯，再漂亮的詞語都站不起來。' },
              { question: '寫完一個長句子，怎麼檢查關聯詞有沒有用對？',
                options: ['把前後兩半的意思各講一遍，看關係對不對', '數字數', '看有沒有錯字'],
                answer: 0,
                explanation: '先問「前面在說什麼、後面在說什麼」，再問「這兩件事是相反、是因果、還是加碼」。' },
            ],
          });
        } },
      ]},
    ],
  };

  /* ══════════════ 單元 3：句子與標點 ══════════════ */
  var sentence = {
    id: 'k5b-chi-sentence', grade: 5, semester: 2, order: 3,
    title: '單元 3　句子與標點',
    subtitle: '標點符號、句型變換，還有把寫壞的句子修回來',
    icon: '✏️', estimatedMinutes: 24,
    objectives: [
      '說得出常用標點符號各自的作用，特別是頓號和逗號的差別',
      '把同一件事用陳述、疑問、感嘆、被動等不同句型說出來',
      '會縮句和擴句，並用縮句檢查自己的句子寫完整了沒有',
      '認得出常見的病句類型，並說出為什麼不通',
    ],
    wrapUp: '這一課真正要練的是一個動作：寫完回頭唸一遍。' +
      '標點該停的地方會自己冒出來，句子哪裡卡住耳朵也會告訴你。' +
      '會唸自己寫的句子，比記住十條文法規則有用。',
    sections: [

      { heading: '標點符號不是裝飾品', blocks: [
        { type: 'text', text: '標點符號負責交代三件事：句子在哪裡停、哪些東西是一組的、' +
          '還有說話的語氣。' },
        { type: 'component', build: function () {
          return new LabeledDiagram({
            caption: '最常用的幾個，各有各的工作',
            parts: [
              { icon: '、', name: '頓號',
                description: '分開同類並列的詞語：「桌上有筆、橡皮擦、尺和筆記本」。\n' +
                  '只用在詞語之間，不用在句子之間。' },
              { icon: '，', name: '逗號',
                description: '句子裡的停頓：「我喜歡蘋果和芒果，但是不喜歡榴槤」。\n' +
                  '頓號管詞語，逗號管句子，這是最容易混的一組。' },
              { icon: '？', name: '問號',
                description: '疑問句結尾。注意：反問句雖然不是真的在問，也要用問號。' },
              { icon: '！', name: '驚嘆號',
                description: '強烈的情緒或語氣：驚訝、提醒、感嘆。用太多就沒有力道了。' },
              { icon: '：', name: '冒號',
                description: '後面要舉例、說明或引出說話的內容。' },
              { icon: '—', name: '破折號',
                description: '插進補充說明，也可以表示語氣轉折或聲音延長。' },
              { icon: '…', name: '刪節號',
                description: '話沒說完、語氣延續，或是省略了一部分內容。六個點。' },
            ],
          });
        } },
        { type: 'callout', title: '為什麼標點可以改變意思', text:
          '同一串字，停頓的位置不同，意思就不同。\n' +
          '「下雨天留客天留我不留」—— 可以斷成「下雨天，留客天，留我不？留！」' +
          '也可以斷成「下雨天，留客天，留我不留。」兩個意思剛好相反。\n' +
          '所以標點不是加上去好看的，它本身就是意思的一部分。' },
      ]},

      { heading: '同一件事，換個說法', blocks: [
        { type: 'text', text: '句型變換的規則只有一條：換說法，不換意思。' +
          '改完一定要回頭對一次。' },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'say', label: '陳述句' },
              { id: 'ask', label: '疑問句或反問句' },
              { id: 'wow', label: '感嘆句' },
            ],
            items: [
              { text: '明天要上學。', bucket: 'say', why: '平鋪直敘地說一件事，結尾句號。' },
              { text: '作業被他寫完了。', bucket: 'say', why: '被動的說法，但還是陳述句。' },
              { text: '明天要上學嗎？', bucket: 'ask', why: '真的在問，結尾問號。' },
              { text: '難道你不知道嗎？', bucket: 'ask', why: '反問句：形式在問，答案已經在裡面了。' },
              { text: '這本書真好看！', bucket: 'wow', why: '強烈的情緒，結尾驚嘆號。' },
              { text: '多美的夕陽啊！', bucket: 'wow', why: '感嘆句常有「多……啊」這種結構。' },
            ],
          });
        } },
        { type: 'callout', title: '「把」字句和「被」字句', text:
          '「他把作業寫完了。」→ 重點在他（做的人）。\n' +
          '「作業被他寫完了。」→ 重點在作業（被做的那一方）。\n' +
          '意思一樣，強調的東西不一樣。寫作時想突顯誰，就用哪一種。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '把「操場上，幾個穿紅衣服的小朋友正開心地打球。」縮到最短，剩下什麼？',
                options: ['小朋友打球。', '穿紅衣服的小朋友打球。', '操場上打球。'],
                answer: 0,
                explanation: '縮句就是只留主語和動作。這也是檢查句子完整的好方法 —— ' +
                  '縮完之後如果缺主語或缺動作，原句就有問題。' },
              { question: '把「花開了。」擴寫，下列哪一句最恰當？',
                options: ['院子裡的玫瑰花悄悄地開了。', '花花開了開了。', '花開了嗎？'],
                answer: 0,
                explanation: '擴句是加上「誰的」「什麼樣的」「怎麼樣地」，主幹不能變。' +
                  '第三個選項把句型也換了，那是另一回事。' },
              { question: '把「他很累。他還是把書讀完了。」合成一句，最好的說法是什麼？',
                options: ['他雖然很累，但是還是把書讀完了。', '他很累，他讀完書。', '他很累還是讀完書因為。'],
                answer: 0,
                explanation: '兩個短句合併，要用對的關聯詞把邏輯接起來。這裡前後相反，所以用轉折。' },
              { question: '做句型變換的時候，什麼絕對不能變？',
                options: ['原本要表達的意思', '句子的長度', '用字'],
                answer: 0,
                explanation: '換說法不是換意思。這是句型變換唯一的紅線。' },
            ],
          });
        } },
      ]},

      { heading: '病句：哪裡卡住了？', blocks: [
        { type: 'text', text: '病句不是錯字的問題，是結構和邏輯的問題。' +
          '常見的有五種，認得出來就改得掉。' },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'dup', label: '重複贅餘' },
              { id: 'conflict', label: '前後矛盾' },
              { id: 'nosubj', label: '缺少主語' },
              { id: 'logic', label: '邏輯不通' },
            ],
            items: [
              { text: '他大約十歲左右。', bucket: 'dup',
                why: '「大約」和「左右」意思重複，留一個就好。' },
              { text: '我的理想是當一位醫生的工作。', bucket: 'dup',
                why: '「當醫生」和「醫生的工作」疊在一起了。' },
              { text: '我一定會盡量把事情做好。', bucket: 'conflict',
                why: '「一定」是肯定，「盡量」是保留，語氣自己打自己。' },
              { text: '全班同學都到了，只有小明沒來。', bucket: 'conflict',
                why: '「都到了」和「只有小明沒來」互相抵觸。' },
              { text: '經過老師的講解，使我明白了這個道理。', bucket: 'nosubj',
                why: '「使」字多餘，整句找不到主語。拿掉「使」就通了。' },
              { text: '通過這次比賽，讓大家變得更團結。', bucket: 'nosubj',
                why: '同樣的毛病：「讓」字多餘，主語不見了。' },
              { text: '因為下雨，所以我才沒有遲到。', bucket: 'logic',
                why: '關聯詞用對了，可是下雨不會讓人不遲到。' },
              { text: '我們要防止類似的事件不再發生。', bucket: 'logic',
                why: '「防止」加「不再」變成雙重否定，意思反過來了。' },
            ],
          });
        } },
        { type: 'callout', title: '檢查病句最快的方法', text:
          '把句子從頭唸一遍。哪裡唸起來卡住，那裡就有問題。\n' +
          '耳朵比眼睛敏感得多 —— 眼睛會自動補上缺的字，耳朵不會。\n' +
          '另外一招：縮句。縮到只剩主語和動作，缺哪個就馬上看得出來。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '「這本書我看了三次，每次都有新的收穫。」這句有問題嗎？',
                options: ['沒有問題，這是正確的句子', '有重複的詞', '缺少主語'],
                answer: 0,
                explanation: '主語清楚、邏輯通順、沒有贅詞。不是每一題都有錯 —— ' +
                  '要敢說「這一句是對的」。' },
              { question: '「他的身高大概一百五十公分左右。」要怎麼改？',
                options: ['拿掉「大概」或拿掉「左右」，留一個', '改成「非常一百五十公分」', '不用改'],
                answer: 0,
                explanation: '兩個都在表示不確定，重複了。這是最常見的贅餘。' },
              { question: '下列哪一項不是病句的類型？',
                options: ['字寫得不好看', '前後矛盾', '缺少主語'],
                answer: 0,
                explanation: '病句講的是句子的結構和邏輯，跟字跡漂不漂亮無關。' },
              { question: '為什麼要練習改病句？',
                options: ['練會了，自己寫作文的時候就不容易犯同樣的錯', '為了挑別人的毛病', '為了考試'],
                answer: 0,
                explanation: '改別人的句子是在訓練自己的眼光。看得出別人的毛病，才看得出自己的。' },
            ],
          });
        } },
      ]},

      { heading: '寫完之後的三道檢查', blocks: [
        { type: 'text', text: '這一課學的東西，真正發揮作用的時機是「寫完之後」。' +
          '三道檢查，照順序做一遍，大部分的毛病都會自己浮出來。' },
        { type: 'component', build: function () {
          return new LabeledDiagram({
            caption: '照這個順序檢查，每一道只看一件事',
            parts: [
              { icon: '👄', name: '第一道：唸出來',
                description: '從頭唸一遍，不要默讀。哪裡唸起來卡住、哪裡換不了氣，' +
                  '那裡就是標點或結構有問題。耳朵比眼睛敏感，' +
                  '因為眼睛會自動幫你補上缺掉的字。' },
              { icon: '✂️', name: '第二道：縮句',
                description: '把修飾語全部拿掉，只留主語和動作。' +
                  '縮完之後如果找不到主語，或是找不到在做什麼，原句就是病句。' +
                  '這一道專門抓「缺主語」。' },
              { icon: '🔗', name: '第三道：對關聯詞',
                description: '長句子裡只要有關聯詞，就把前後兩半的意思各講一遍，' +
                  '再問這兩件事是相反、是因果、還是加碼。' +
                  '這一道專門抓「邏輯不通」和「前後矛盾」。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '「我們班的同學每天早上都會，一起打掃教室。」這個逗號有什麼問題？',
                options: ['放錯位置了，把「都會」和後面的動作硬切開', '少了一個頓號', '沒有問題'],
                answer: 0,
                explanation: '唸出來就發現了：「都會」後面不該停。標點要放在語氣真的會停的地方。' },
              { question: '哪一道檢查最適合用來抓「缺少主語」？',
                options: ['縮句', '唸出來', '對關聯詞'],
                answer: 0,
                explanation: '縮到只剩主語和動作，缺哪一個馬上現形。' },
              { question: '為什麼建議唸出來，而不是用眼睛看？',
                options: ['眼睛會自動補上缺掉的字，耳朵不會', '唸出來比較快', '為了練發音'],
                answer: 0,
                explanation: '自己寫的句子，眼睛早就知道你想說什麼，所以會「看到」其實沒寫的字。' },
              { question: '這三道檢查最好在什麼時候做？',
                options: ['寫完之後，而且最好隔一下再看', '寫的時候一邊檢查', '不用做'],
                answer: 0,
                explanation: '一邊寫一邊檢查會打斷思緒。寫完先放一下，再用陌生的眼光看一遍。' },
            ],
          });
        } },
      ]},
    ],
  };

  /* ══════════════ 單元 4：文體與閱讀策略 ══════════════ */
  var reading = {
    id: 'k5b-chi-reading2', grade: 5, semester: 2, order: 4,
    title: '單元 4　文體與閱讀策略',
    subtitle: '先認出作者想對你做什麼，再決定怎麼讀',
    icon: '📖', estimatedMinutes: 23,
    objectives: [
      '分得出記敘文、說明文、議論文，並說出各自的目的',
      '依照文體選對讀法：找事件、找原理，還是找主張和理由',
      '做出一段文字的摘要，說得出摘要和心得的差別',
      '做推論時能指出文章裡的依據，不憑想像',
    ],
    wrapUp: '讀一篇文章之前先問一句：作者是在講故事、在解釋，還是在說服我？' +
      '答對了這一句，後面怎麼讀就都對了。摘要練的是分辨什麼重要，' +
      '推論練的是從線索推出沒寫出來的事 —— 兩個都不只用在國語課。',
    sections: [

      { heading: '三種文體，三個目的', blocks: [
        { type: 'text', text: '文體不是為了考試才分的。分清楚文體，' +
          '是因為不同的文章要用不同的方式讀。' },
        { type: 'component', build: function () {
          return new CompareToggle({
            options: [
              { label: '記敘文（讓你知道發生了什麼）', note:
                '記人、記事、記遊。通常有時間、地點、人物。\n' +
                '讀法：先抓住時間地點人物，再順著事情的發展看下去。\n' +
                '例子：「我的爺爺」「一次難忘的旅行」。' },
              { label: '說明文（讓你懂）', note:
                '說明事物的特徵、原理或方法。常用舉例、比較、分類、數據。\n' +
                '讀法：找它在解釋什麼，還有它用什麼方法解釋。\n' +
                '例子：「如何做好垃圾分類」「蜜蜂怎麼找到花」。' },
              { label: '議論文（讓你同意）', note:
                '提出主張，並說出支持的理由。三個部分：論點、論據、結論。\n' +
                '讀法：先找主張，再檢查理由站不站得住腳。\n' +
                '例子：「我認為小學生應該學做家事」。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'story', label: '記敘文' },
              { id: 'explain', label: '說明文' },
              { id: 'argue', label: '議論文' },
            ],
            items: [
              { text: '我的爺爺', bucket: 'story', why: '寫一個人、寫跟他相處的事。' },
              { text: '一次難忘的畢業旅行', bucket: 'story', why: '記一件事情的經過。' },
              { text: '如何做好垃圾分類', bucket: 'explain', why: '在講方法和步驟，目的是讓你學會。' },
              { text: '蜜蜂是怎麼找到花的', bucket: 'explain', why: '在解釋原理。' },
              { text: '我認為小學生應該學做家事', bucket: 'argue', why: '「我認為……應該……」就是主張。' },
              { text: '手機該不該帶到學校', bucket: 'argue', why: '提出立場，然後講理由。' },
            ],
          });
        } },
        { type: 'callout', title: '最快的判斷法', text:
          '問自己一句：作者是在講故事、在解釋，還是在說服我？\n' +
          '記敘文 → 講故事。說明文 → 解釋。議論文 → 說服。\n' +
          '這一句問完，文體就出來了，讀的策略也跟著定了。' },
      ]},

      { heading: '摘要：留下骨頭，丟掉肉', blocks: [
        { type: 'text', text: '摘要是壓縮，不是改寫，也不是心得。' +
          '規則：留下主要訊息，刪掉細節和重複的部分。' },
        { type: 'callout', title: '三個步驟', text:
          '一、先找每一段的主旨句。常在段落的第一句或最後一句。\n' +
          '二、把細節、例子、重複的說法拿掉。\n' +
          '三、把剩下的用自己的話串成通順的幾句。\n' +
          '檢查方式：拿掉這一句，別人還懂不懂？懂，就可以拿掉。' },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '要找一個段落的主旨，通常先看哪裡？',
                options: ['段落的第一句或最後一句', '段落的正中間', '最長的那一句'],
                answer: 0,
                explanation: '主旨句常放在段首（先講結論）或段尾（最後收起來）。先看這兩個位置效率最高。' },
              { question: '摘要和心得有什麼不同？',
                options: ['摘要寫文章說了什麼，心得寫自己的想法', '完全一樣', '摘要比較長'],
                answer: 0,
                explanation: '摘要裡出現「我覺得」就跑掉了；心得裡只有複述沒有想法也不算心得。' },
              { question: '一篇文章的主旨通常跟什麼有關？',
                options: ['標題，還有反覆出現的重點', '最後一個字', '作者的名字'],
                answer: 0,
                explanation: '作者會用標題暗示方向，也會把重要的意思說好幾次。重複就是強調。' },
              { question: '為什麼要練習摘要？',
                options: ['練的是分辨什麼重要，再長的文章都抓得住重點', '為了寫得少一點', '為了考試'],
                answer: 0,
                explanation: '這個能力到了國中、高中、甚至工作以後都還在用。' },
            ],
          });
        } },
      ]},

      { heading: '推論：讀出沒寫出來的事', blocks: [
        { type: 'text', text: '推論是用文章裡的線索，推出作者沒有直接寫出來的事。' +
          '關鍵在「線索」兩個字 —— 沒有根據的叫猜測，不叫推論。' },
        { type: 'component', build: function () {
          return new CompareToggle({
            options: [
              { label: '這是推論', note:
                '文章：「他一走進教室，同學們立刻停止說話。」\n' +
                '推論：他可能是老師，或是一個讓同學有壓力的人。\n' +
                '依據：「立刻停止說話」這個反應，指向他有某種權威。' },
              { label: '這是猜測', note:
                '同一段文章。\n' +
                '猜測：他個子很高、他姓王、他心情不好。\n' +
                '問題：文章裡一個字都沒提到這些。想像不算推論。' },
            ],
          });
        } },
        { type: 'component', build: function () {
          return new ChoiceQuiz({
            questions: [
              { question: '「窗外的樹枝劇烈搖晃，路上的招牌都倒了。」可以推論什麼？',
                options: ['風非常大，可能有颱風', '有人在搖樹', '招牌品質不好'],
                answer: 0,
                explanation: '兩個現象指向同一個原因。推論就是把分散的線索串成一個解釋。' },
              { question: '「她把便當盒收進書包，看了一眼時鐘，加快腳步往門口走。」可以推論什麼？',
                options: ['她快要來不及，急著出門', '她很餓', '她不喜歡那個便當'],
                answer: 0,
                explanation: '看時鐘、加快腳步，兩個動作合起來就是趕時間。線索要一起看。' },
              { question: '做推論的時候要特別注意什麼？',
                options: ['一定要在文章裡找得到根據', '要大膽一點', '越特別越好'],
                answer: 0,
                explanation: '考試問「可以推論出什麼」，答案一定能在文章裡指出依據。指不出來就是錯的。' },
              { question: '讀到不懂的詞語，最好的做法是什麼？',
                options: ['先看前後文猜意思，再查字典確認', '直接跳過', '放棄這篇文章'],
                answer: 0,
                explanation: '先猜再查，印象會比直接查深很多，而且猜的過程本身就是在練推論。' },
            ],
          });
        } },
      ]},

      { heading: '認出文體之後，讀法要跟著換', blocks: [
        { type: 'text', text: '分辨文體不是為了填空格，是為了決定接下來怎麼讀。' +
          '三種文體，三套不同的動作。' },
        { type: 'component', build: function () {
          return new TapPairing({
            left: [
              { id: 'g1', text: '讀到記敘文' },
              { id: 'g2', text: '讀到說明文' },
              { id: 'g3', text: '讀到議論文' },
              { id: 'g4', text: '讀到新詩' },
            ],
            right: [
              { id: 'h1', text: '先找時間、地點、人物，再順著事情發展看' },
              { id: 'h2', text: '先找它在解釋什麼，再看它用舉例、比較還是分類' },
              { id: 'h3', text: '先找主張，再檢查理由站不站得住腳' },
              { id: 'h4', text: '先感受節奏和畫面，再想它想傳達什麼' },
            ],
            pairs: { g1: 'h1', g2: 'h2', g3: 'h3', g4: 'h4' },
          });
        } },
        { type: 'component', build: function () {
          return new SortBuckets({
            wide: true,
            buckets: [
              { id: 'q1', label: '記敘文會問的問題' },
              { id: 'q2', label: '說明文會問的問題' },
              { id: 'q3', label: '議論文會問的問題' },
            ],
            items: [
              { text: '這件事發生的先後順序是什麼？', bucket: 'q1',
                why: '記敘文的核心是事情怎麼發展的。' },
              { text: '作者對這個人的感情是什麼？', bucket: 'q1',
                why: '記人的文章常常藏著作者的態度。' },
              { text: '這段用了什麼方法來說明？', bucket: 'q2',
                why: '舉例、比較、分類、數據 —— 說明文的題目常考這個。' },
              { text: '這個原理可以用在哪裡？', bucket: 'q2',
                why: '說明文的目的是讓你懂，懂了就要能用。' },
              { text: '作者的主張是什麼？', bucket: 'q3',
                why: '議論文一定有立場，先把它找出來。' },
              { text: '他舉的例子真的能支持他的說法嗎？', bucket: 'q3',
                why: '讀議論文最重要的動作：不只看他說什麼，還要看他憑什麼這樣說。' },
            ],
          });
        } },
        { type: 'callout', title: '為什麼這件事值得練', text:
          '同一篇文章，用錯的方式讀，會讀得很累又抓不到重點。' +
          '把議論文當故事讀，就會只記得例子、忘了主張。' +
          '把說明文當故事讀，就會覺得這篇好無聊 —— 其實是讀法不對。' +
          '先認文體，再決定動作。這是整個單元最實用的一句。' },
      ]},
    ],
  };

  window.LESSON_PACKS = window.LESSON_PACKS || [];
  window.LESSON_PACKS.push({
    key: 'chinese', subject: '國語', icon: '📚',
    grade: 5, term: '下', version: 'any', versionName: '各版本通用',
    note: '按能力分不按課文分，四個單元對齊闖關站五下國語的題庫。',
    units: [shape, words, sentence, reading],
  });
})();
