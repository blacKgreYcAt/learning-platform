/**
 * 書架總表 — 新首頁「什麼東西存在、該擺在哪一格」的唯一定義
 * 2026-11-06
 *
 * 跟 curriculum-20260810.js 的關係：
 *   那一份記的是「某科的某個年級學期有沒有內容」，服務的是舊首頁的
 *   「選擇你的年級」小視窗。它沒有錯，但它不知道闖關站的存在，
 *   也沒有「不分年級的練習」這個概念。
 *   這一份是它的上層：先分兩個書架（跟課本走 / 隨時練），
 *   跟課本走的再按科目分列。舊檔原封不動留著，舊首頁還在用。
 *
 * 新增一個東西只要在這裡加一筆，版面會自己長出來。
 *
 * 排序規則（2026-11-09 定）：每一科「教」的放在「練」的前面。
 *   先前題庫排第一個，結果整個首頁看起來只剩題庫 —— 引導式教學明明還在，
 *   卻被擠到第二張卡，加上標籤寫「互動」看起來像小遊戲，不像「這裡有人教你」。
 *   所以教學類改標「教學」並排在最前面，題庫排後面。
 *
 *
 * item 欄位說明：
 *   title   卡片標題
 *   desc    一行說明
 *   href    連結。帶 {grade} 的會換成 '5-1' 這種字串
 *   icon    assets/ 底下的圖檔
 *   grades  ['4-2','5-1'] = 只有這些年級學期有；'any' = 不分年級
 *   tag     右上角小標籤
 *   note    額外補充，沒有就不顯示
 */

'use strict';

window.SHELF = {

  /** 書架上要出現的年級。三年級目前整個是空的，但刻意留著，缺口要看得見。 */
  grades: [3, 4, 5, 6],

  terms: [[1, '上學期'], [2, '下學期']],

  /** 課本版本。目前只有闖關站吃這個值，其他 App 不分版本。 */
  versions: [['kang', '康軒版'], ['nani', '南一版'], ['han', '翰林版']],

  /* ══ 書架一：跟著課本走 ══════════════════════════════ */
  subjects: [
    {
      key: 'science', name: '自然', icon: '🔬', color: 'var(--ink-lime)',
      items: [
        {
          title: '引導式教學',
          desc: '一段一段帶著弄懂：五上動物聲光天空燃燒，五下力大地植物熱',
          href: 'lesson/index.html?subject=science',
          icon: 'assets/icon-natural-20261104.png',
          carriesSetup: true,
          grades: { '5-1': '4 個單元・康軒版', '5-2': '4 個單元・康軒版' },
          tag: '教學',
        },
        {
          title: '自然科綜合版',
          desc: '推力拉力、電路、導體、節能，動手操作的關卡',
          href: 'natural-science-app/?grade={grade}',
          icon: 'assets/icon-natural-20261104.png',
          grades: { '4-1': '', '4-2': '' },
          tag: '教學',
        },
        {
          title: '心智圖牆',
          desc: '一課一張，整課重點畫在同一張圖上，考前翻一遍',
          href: 'mindmap/index.html?set=science',
          icon: 'assets/icon-natural-20261104.png',
          carriesSetup: true,
          grades: { '4-2': '13 張・不分版本' },
          tag: '圖解',
        },
        {
          title: '課程闖關站',
          desc: '照課本單元分的題庫，答錯自動進錯題本',
          href: 'quest/index.html',
          icon: 'assets/icon-compass-20261106.png',
          // 闖關站看得懂 ?g/?t/?v，首頁把選好的設定直接帶過去
          carriesSetup: true,
          grades: { '4-2': '144 題・不分版本', '5-1': '110 題・康軒版', '5-2': '120 題・康軒版' },
          tag: '題庫',
        },
        {
          title: '能源電力廠',
          desc: '找出家裡的吃電怪，學會怎麼節能',
          href: 'energy-lab-app/',
          icon: 'assets/icon-energy-20261104.png',
          grades: 'any',
          tag: '遊戲',
          note: '不分年級',
        },
      ],
    },
    {
      key: 'social', name: '社會', icon: '🌏', color: 'var(--ink-gold)',
      items: [
        {
          title: '引導式教學',
          desc: '五上地理氣候史前大航海，五下經濟活動與清帝國到日治',
          href: 'lesson/index.html?subject=social',
          icon: 'assets/icon-social-20261104.png',
          carriesSetup: true,
          grades: { '5-1': '5 個單元・康軒版', '5-2': '4 個單元・康軒版' },
          tag: '教學',
        },
        {
          title: '社會科探險',
          desc: '大地觀測、水資源、家鄉踏查',
          href: 'social-studies-app/?grade={grade}',
          icon: 'assets/icon-social-20261104.png',
          grades: { '4-1': '', '4-2': '' },
          tag: '教學',
        },
        {
          title: '心智圖牆',
          desc: '一課一張，整課重點畫在同一張圖上，考前翻一遍',
          href: 'mindmap/index.html?set=social',
          icon: 'assets/icon-social-20261104.png',
          carriesSetup: true,
          grades: { '4-2': '12 張・不分版本' },
          tag: '圖解',
        },
        {
          title: '課程闖關站',
          desc: '照課本單元分的題庫，答錯自動進錯題本',
          href: 'quest/index.html',
          icon: 'assets/icon-compass-20261106.png',
          // 闖關站看得懂 ?g/?t/?v，首頁把選好的設定直接帶過去
          carriesSetup: true,
          grades: { '4-2': '66 題・不分版本', '5-1': '120 題・康軒版', '5-2': '100 題・康軒版' },
          tag: '題庫',
        },
      ],
    },
    {
      key: 'math', name: '數學', icon: '🚀', color: 'var(--ink-cyan)',
      items: [
        {
          title: '星際數學探險',
          desc: '引導式教學，先帶你想通，再一步一步算',
          href: 'math-science-app/?grade={grade}',
          icon: 'assets/icon-mathscience-20261104.png',
          // 課本版本要寫在格子裡，不要寫 note —— note 只有 grades:'any' 的項目讀得到。
          // 翰林兩個字不能省：兒子用的是康軒，點進去看到翰林的單元順序要先有心理準備。
          grades: { '4-2': '含時間換算', '5-1': '10 個單元・翰林版順序，康軒同觀念' },
          tag: '教學',
        },
        {
          title: '康軒補充三課',
          desc: '小數乘法、容積與容量、線對稱 —— 星際數學探險沒教到的那三塊',
          href: 'lesson/index.html?subject=math',
          icon: 'assets/icon-mathscience-20261104.png',
          carriesSetup: true,
          grades: { '5-1': '3 個單元・康軒版' },
          tag: '教學',
        },
        {
          title: '課程闖關站',
          desc: '照課本單元分的題庫，答錯自動進錯題本',
          href: 'quest/index.html',
          icon: 'assets/icon-compass-20261106.png',
          // 闖關站看得懂 ?g/?t/?v，首頁把選好的設定直接帶過去
          carriesSetup: true,
          grades: { '5-1': '140 題・康軒版' },
          tag: '題庫',
        },
      ],
    },
    {
      key: 'chinese', name: '國語', icon: '📚', color: 'var(--ink-orange)',
      items: [
        {
          title: '引導式教學',
          desc: '字詞、成語、修辭、閱讀理解，按能力分不按課文分',
          href: 'lesson/index.html?subject=chinese',
          icon: 'assets/icon-chinese-20261104.png',
          carriesSetup: true,
          grades: { '5-1': '4 個單元・各版本通用' },
          tag: '教學',
        },
        {
          title: '語文閣樓',
          desc: '課文理解、詞語和修辭',
          href: 'chinese-language-app/?grade={grade}',
          icon: 'assets/icon-chinese-20261104.png',
          grades: { '4-1': '', '4-2': '' },
          tag: '教學',
        },
        {
          title: '課程闖關站',
          desc: '照課本單元分的題庫，答錯自動進錯題本',
          href: 'quest/index.html',
          icon: 'assets/icon-compass-20261106.png',
          // 闖關站看得懂 ?g/?t/?v，首頁把選好的設定直接帶過去
          carriesSetup: true,
          grades: { '5-1': '100 題・各版本通用' },
          tag: '題庫',
        },
      ],
    },
  ],

  /* ══ 書架二：隨時練（不綁年級）══════════════════════ */
  anytime: [
    {
      title: '經典大作戰', desc: '論語、世說新語，不按年級編',
      href: 'classics-splat-app/', icon: 'assets/icon-classics-20261104.png', tag: '國學',
    },
    {
      title: '數感邏輯', desc: '數字規律與推理，練腦不練課本',
      href: 'math-logic-app/', icon: 'assets/icon-mathlogic-20261104.png', tag: '邏輯',
    },
    {
      title: '英文千詞營', desc: '單字量累積，分級闖關',
      href: 'english-app/', icon: 'assets/icon-english-20261104.png', tag: '英文',
    },
    {
      title: '舒爾特方格', desc: '專注力和視覺搜尋速度訓練',
      href: 'schulte-grid-app/', icon: 'assets/icon-schulte-20261104.png', tag: '專注力',
    },
  ],

  /* ── 查詢用 ── */

  /** 這個 item 在 grade-term（'5-1'）這一格有沒有東西？回傳說明字串或 null */
  slotOf(item, key) {
    if (item.grades === 'any') return item.note || '不分年級';
    return Object.prototype.hasOwnProperty.call(item.grades, key)
      ? (item.grades[key] || '')
      : null;
  },

  /** 這一科在這一格有幾個能點的東西 */
  liveItems(subject, key) {
    return subject.items.filter((it) => this.slotOf(it, key) !== null);
  },

  /**
   * 這一格「真正屬於這個年級」的東西有幾個。
   *
   * 刻意不算 grades:'any' 的項目（例如能源電力廠）。
   * 它們每個年級都看得到，如果算進來，三年級和六年級明明一課都還沒做，
   * 年級按鈕卻會亮起來、空狀態也不會出現，等於騙自己進度。
   */
  countAt(key) {
    return this.subjects.reduce((n, s) => n + this.liveItems(s, key)
      .filter((it) => it.grades !== 'any').length, 0);
  },

  /** 連結換掉 {grade} */
  hrefOf(item, key) {
    return item.href.replace('{grade}', key);
  },
};
