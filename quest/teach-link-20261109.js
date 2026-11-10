/**
 * 闖關站 — 每個單元上面加一條「先看教學」
 * 2026-11-09
 *
 * 為什麼要有這一份：
 *   引導式教學（星際數學探險）從頭到尾都還在，一個檔案都沒刪。
 *   問題是 11/06 改版之後首頁按年級過濾，而那些引導式 App 只做到四年級，
 *   五上就只剩題庫看得見 —— 看起來像「只剩題庫」，實際是「五上的教學還沒做」。
 *   這一份補的是另一半：小孩已經在題庫裡面、正卡在某個單元的時候，
 *   直接給他一條路回到那個單元的教學，而不是要他退回首頁自己找。
 *
 * 做法：
 *   不改殼。用 MutationObserver 看著 #view，每次畫出單元清單就把教學條插進去。
 *   殼完全不知道這一份存在，刪掉 index.html 裡那一行 <script> 就全部還原。
 *
 * 對照表怎麼來的：
 *   題庫是康軒版，引導教學當初照翰林版的單元順序做。兩邊的「單元」切法不同，
 *   但 108 課綱的觀念是同一套，所以用觀念對應，不是用單元編號對應。
 *   只有真的在教那個觀念才連 —— 寧可少連一條，也不要讓小孩點進去發現不是他要的。
 *   還沒有教學的格子就不顯示，缺口要看得見。
 */

'use strict';

(function () {
  if (!window.QUEST) return;

  /* 教學有兩個家：
       M  星際數學探險（math-science-app）—— 五上翰林數學那十個單元
       L  引導式教學共用殼（lesson/）—— 11/09 之後新寫的，四科都在裡面
     兩邊都吃 ?unit=，所以對照表只記 home 和 unit，網址在要畫的時候才組。

     為什麼不把網址寫死：lesson/ 會依年級學期版本過濾教學包，
     寫死 v=kang 會蓋掉小孩自己選的版本，不帶又可能讀到舊的存檔值。
     所以照闖關站「現在正在看的那個設定」去帶，三邊永遠一致。 */
  function hrefOf(t) {
    var s = window.QUEST.DB.setup;
    var term = s.term === '上' ? 1 : 2;
    if (t.home === 'M') {
      return '../math-science-app/?grade=' + s.grade + '-' + term + '&unit=' + t.unit;
    }
    return '../lesson/index.html?g=' + s.grade + '&t=' + term +
      '&v=' + s.version + '&unit=' + t.unit;
  }

  /**
   * 科目|年級|學期 → 單元名 → 教學連結
   *
   * label 寫的是「那份教學實際在教什麼」，不是題庫單元的名字。
   * 名字不一樣是刻意的：小孩點進去看到的標題會跟 label 對得上。
   *
   * 這是一張對照表，本來就會長大 —— 之後補了哪一科哪一個學期，就在這裡加一格。
   */
  var TEACH = {
    '數學|5|上': {
      '因數與倍數': [
        { label: '倍數與因數', home: 'M', unit: 'g5-u02-factors' },
        { label: '公因數與公倍數', home: 'M', unit: 'g5-u04-common' },
      ],
      '分數的加減': [
        { label: '擴分、約分與異分母加減', home: 'M', unit: 'g5-u07-fractions' },
      ],
      '整數的四則運算與小數乘法': [
        { label: '四則運算的順序與併式', home: 'M', unit: 'g5-u06-operations' },
        { label: '小數乘法', home: 'L', unit: 'k5a-decimal-multiply' },
      ],
      '多邊形與面積': [
        { label: '角、三角形與四邊形', home: 'M', unit: 'g5-u03-plane' },
        { label: '面積公式是怎麼來的', home: 'M', unit: 'g5-u08-area' },
      ],
      '容積、容量與線對稱': [
        // 立體形體不等於容積，但是容積的先備觀念，標籤要講清楚是哪一個。
        { label: '立體形體（容積的先備觀念）', home: 'M', unit: 'g5-u05-solids' },
        { label: '容積與容量', home: 'L', unit: 'k5a-volume' },
        { label: '線對稱', home: 'L', unit: 'k5a-symmetry' },
      ],
    },

    '數學|5|下': {
      '分數的乘法與除法': [{ label: '分數的乘法與除法', home: 'L', unit: 'k5b-math-frac' }],
      '小數的除法': [{ label: '小數的除法', home: 'L', unit: 'k5b-math-decdiv' }],
      '體積與生活中的大單位': [
        { label: '體積與大單位（含堆積木）', home: 'L', unit: 'k5b-math-volume' },
      ],
      '比率與百分率': [{ label: '比率與百分率', home: 'L', unit: 'k5b-math-percent' }],
    },

    '自然|5|上': {
      '動物世界': [{ label: '動物世界', home: 'L', unit: 'k5a-sci-animals' }],
      '探索聲光世界': [{ label: '探索聲光世界', home: 'L', unit: 'k5a-sci-soundlight' }],
      '神祕的天空': [{ label: '神祕的天空', home: 'L', unit: 'k5a-sci-sky' }],
      '燃燒與生鏽': [{ label: '燃燒與生鏽', home: 'L', unit: 'k5a-sci-burning' }],
    },

    '自然|5|下': {
      '力與運動': [{ label: '力與運動（含彈簧秤、蹺蹺板）', home: 'L', unit: 'k5b-sci-force' }],
      '大地的奧妙': [{ label: '大地的奧妙（含排地層順序）', home: 'L', unit: 'k5b-sci-earth' }],
      '植物世界的面面觀': [{ label: '植物世界的面面觀', home: 'L', unit: 'k5b-sci-plants' }],
      '熱的作用與傳播': [{ label: '熱的作用與傳播', home: 'L', unit: 'k5b-sci-heat' }],
    },

    '社會|5|下': {
      '我們的經濟活動': [{ label: '我們的經濟活動', home: 'L', unit: 'k5b-soc-economy' }],
      '清帝國時期臺灣發展重心的變化': [
        { label: '清帝國時期的臺灣（含排時間軸）', home: 'L', unit: 'k5b-soc-qing' },
      ],
      '日治時期人民與政府的關係': [
        { label: '日治時期人民與政府（含排抗爭方式）', home: 'L', unit: 'k5b-soc-rule' },
      ],
      '日治時期的建設、社會文化與生活的關係': [
        { label: '日治時期的建設與生活', home: 'L', unit: 'k5b-soc-life' },
      ],
    },

    '社會|5|上': {
      '臺灣我的家': [{ label: '臺灣我的家', home: 'L', unit: 'k5a-soc-home' }],
      '臺灣的自然環境與生活': [{ label: '自然環境與生活', home: 'L', unit: 'k5a-soc-environment' }],
      '尋根探源話臺灣': [{ label: '尋根探源話臺灣', home: 'L', unit: 'k5a-soc-roots' }],
      '大航海時代的臺灣': [{ label: '大航海時代（含排時間軸）', home: 'L', unit: 'k5a-soc-sail' }],
      '主題探究與實作：守護臺灣最美的風景': [
        { label: '守護臺灣最美的風景', home: 'L', unit: 'k5a-soc-inquiry' },
      ],
    },

    '國語|5|下': {
      '字音字形': [{ label: '字音字形（形近、同音、多音）', home: 'L', unit: 'k5b-chi-shape' }],
      '詞語辨析與運用': [{ label: '詞語辨析與運用', home: 'L', unit: 'k5b-chi-words2' }],
      '句子與標點': [{ label: '句子與標點（含改病句）', home: 'L', unit: 'k5b-chi-sentence' }],
      '文體與閱讀策略': [{ label: '文體與閱讀策略', home: 'L', unit: 'k5b-chi-reading2' }],
    },

    '國語|5|上': {
      '字詞基本功': [{ label: '字詞基本功', home: 'L', unit: 'k5a-chi-words' }],
      '成語與俗諺': [{ label: '成語與俗諺', home: 'L', unit: 'k5a-chi-idioms' }],
      '句子與修辭': [{ label: '句子與修辭', home: 'L', unit: 'k5a-chi-rhetoric' }],
      '閱讀理解': [{ label: '閱讀理解', home: 'L', unit: 'k5a-chi-reading' }],
    },
  };

  var crumb = document.getElementById('crumb');
  var view = document.getElementById('view');
  if (!crumb || !view) return;

  /** 現在畫面上是哪一科？麵包屑的 <b> 就是科目名。 */
  function scopeKey() {
    var b = crumb.querySelector('b');
    var s = window.QUEST.DB && window.QUEST.DB.setup;
    if (!b || !s) return null;
    return b.textContent.trim() + '|' + s.grade + '|' + s.term;
  }

  function strip(list) {
    var html = '<div class="teach-strip"><span class="teach-lead">先看教學</span>' +
      list.map(function (t) {
        return '<a class="teach-link" href="' + hrefOf(t) + '">' +
          t.label.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</a>';
      }).join('') + '</div>';
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.firstChild;
  }

  function decorate() {
    var map = TEACH[scopeKey()];
    if (!map) return;

    var hs = view.querySelectorAll('h2');
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i];
      // 單元標題長這樣：「🔢 單元 1　因數與倍數」。對不上就不是單元清單，跳過。
      var m = /單元\s*\d+[\s　]+(.+)$/.exec(h.textContent.trim());
      if (!m) continue;

      var list = map[m[1].trim()];
      if (!list) continue;

      var next = h.nextElementSibling;
      if (next && next.classList.contains('teach-strip')) continue;   // 已經插過了
      h.parentNode.insertBefore(strip(list), next);
    }
  }

  /* 殼每次換畫面都是重寫 #view.innerHTML，所以看 childList 就夠。
     decorate 自己會跳過插過的，重複觸發不會長出兩條。 */
  new MutationObserver(decorate).observe(view, { childList: true });
  decorate();
})();
