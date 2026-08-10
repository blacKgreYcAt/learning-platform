/**
 * 課程總表 — 全站唯一的「什麼東西存在」的定義
 * 2026-08-10
 *
 * 為什麼需要這個檔案：
 *   之前「哪個科目的哪個年級學期有內容」這件事，同時寫在兩個地方——
 *   首頁的 SUBJECT_AVAILABLE 和數學 App 的 CURRICULUM。
 *   兩邊各改各的，遲早會對不起來（首頁說有、點進去卻是空的）。
 *   現在集中在這裡，首頁和各科 App 都讀同一份。
 *
 * 要新增一個學期的內容，只改這個檔案的一行，不用動介面程式。
 *
 * status 的意思：
 *   'ready'   已完成，可以點進去
 *   'legacy'  舊版做的，還能用但不是新架構（之後重寫時再換掉）
 *   （沒寫）  還沒做，介面上顯示灰色的「製作中」
 */

'use strict';

window.CURRICULUM = {

  /** 科目的顯示資訊與入口。path 是相對於網站根目錄。 */
  subjects: {
    math: {
      name: '數學',
      icon: '🚀',
      title: '星際數學探險',
      path: 'math-science-app/',
    },
    chinese: {
      name: '國語',
      icon: '📚',
      title: '語文閣樓',
      path: 'chinese-language-app/',
    },
    natural: {
      name: '自然',
      icon: '🔬',
      title: '自然科學探險',
      path: 'natural-science-app/',
    },
    social: {
      name: '社會',
      icon: '🌏',
      title: '社會科統合平臺',
      path: 'social-studies-app/',
    },
    classics: {
      name: '國學',
      icon: '📜',
      title: '經典大作戰',
      path: 'classics-splat-app/',
      // 論語和世說新語不是按年級編的，所以不走年級/學期那一套，首頁直接連過去
      byGrade: false,
    },
  },

  /**
   * 各科目 × 年級 × 學期。
   * 學期用 1（上）和 2（下）表示，跟網址參數 ?grade=5-1 一致。
   */
  content: {
    math: {
      '4-2': { status: 'legacy', note: '四下互動闖關（含時間換算）' },
      '5-1': { status: 'ready',  note: '翰林版 10 個單元，引導式教學' },
    },
    chinese: {
      '4-1': { status: 'legacy' },
      '4-2': { status: 'legacy' },
    },
    natural: {
      '4-1': { status: 'legacy' },
      '4-2': { status: 'legacy' },
    },
    social: {
      '4-1': { status: 'legacy' },
      '4-2': { status: 'legacy' },
    },
  },

  /* ── 給介面用的查詢函式，兩邊共用同一套判斷邏輯 ── */

  /** 這個科目的這個年級學期有沒有內容？key 格式 '5-1' */
  has(subject, key) {
    return Boolean(this.content[subject]?.[key]);
  },

  /** 這個科目的這個年級，上下學期任一有內容嗎？ */
  hasGrade(subject, grade) {
    return this.has(subject, `${grade}-1`) || this.has(subject, `${grade}-2`);
  },

  /** 取得說明文字，沒有就回空字串 */
  noteOf(subject, key) {
    return this.content[subject]?.[key]?.note || '';
  },

  /** 這個科目全部可用的年級學期，例如 ['4-2', '5-1'] */
  availableKeys(subject) {
    return Object.keys(this.content[subject] || {}).sort();
  },
};
