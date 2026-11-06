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
          title: '課程闖關站',
          desc: '照課本單元分的題庫，答錯自動進錯題本',
          href: 'quest/index.html',
          icon: 'assets/icon-compass-20261106.png',
          // 闖關站看得懂 ?g/?t/?v，首頁把選好的設定直接帶過去
          carriesSetup: true,
          grades: { '4-2': '144 題・不分版本', '5-1': '110 題・康軒版' },
          tag: '題庫',
        },
        {
          title: '自然科綜合版',
          desc: '推力拉力、電路、導體、節能，動手操作的關卡',
          href: 'natural-science-app/?grade={grade}',
          icon: 'assets/icon-natural-20261104.png',
          grades: { '4-1': '', '4-2': '' },
          tag: '互動',
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
          title: '課程闖關站',
          desc: '照課本單元分的題庫，答錯自動進錯題本',
          href: 'quest/index.html',
          icon: 'assets/icon-compass-20261106.png',
          // 闖關站看得懂 ?g/?t/?v，首頁把選好的設定直接帶過去
          carriesSetup: true,
          grades: { '4-2': '66 題・不分版本', '5-1': '120 題・康軒版' },
          tag: '題庫',
        },
        {
          title: '社會科探險',
          desc: '大地觀測、水資源、家鄉踏查',
          href: 'social-studies-app/?grade={grade}',
          icon: 'assets/icon-social-20261104.png',
          grades: { '4-1': '', '4-2': '' },
          tag: '互動',
        },
      ],
    },
    {
      key: 'math', name: '數學', icon: '🚀', color: 'var(--ink-cyan)',
      items: [
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
        {
          title: '星際數學探險',
          desc: '引導式教學，一步一步帶著算',
          href: 'math-science-app/?grade={grade}',
          icon: 'assets/icon-mathscience-20261104.png',
          grades: { '4-2': '含時間換算', '5-1': '翰林版 10 單元' },
          tag: '互動',
        },
      ],
    },
    {
      key: 'chinese', name: '國語', icon: '📚', color: 'var(--ink-orange)',
      items: [
        {
          title: '課程闖關站',
          desc: '照課本單元分的題庫，答錯自動進錯題本',
          href: 'quest/index.html',
          icon: 'assets/icon-compass-20261106.png',
          // 闖關站看得懂 ?g/?t/?v，首頁把選好的設定直接帶過去
          carriesSetup: true,
          grades: { '5-1': '100 題・不分版本' },
          tag: '題庫',
        },
        {
          title: '語文閣樓',
          desc: '課文理解、詞語和修辭',
          href: 'chinese-language-app/?grade={grade}',
          icon: 'assets/icon-chinese-20261104.png',
          grades: { '4-1': '', '4-2': '' },
          tag: '互動',
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
