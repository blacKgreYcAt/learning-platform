/**
 * 學習設定 — 全站共用的「孩子目前幾年級、哪個版本、哪個學期」
 * 2026-11-06
 *
 * 為什麼需要這個檔案：
 *   這件事本來同時存在兩個地方，而且格式還不一樣 ——
 *     首頁      localStorage['shelf-setup-20261106']  term 用 1 / 2
 *     闖關站    localStorage['quest-20261105'].setup  term 用 '上' / '下'
 *   兩邊各記各的，所以在首頁選了五上、進闖關站可能還停在四下，
 *   使用者等於被問了兩次同一個問題，答案還可能互相矛盾。
 *
 *   現在集中在這裡。term 一律用數字 1 / 2 存，要中文的自己 termCh()。
 *
 * 優先順序：網址參數 > 已存設定 > 預設值。
 *   網址參數讓首頁可以把選擇直接帶過去（quest/index.html?g=5&t=1&v=kang），
 *   就算 localStorage 被鎖住（無痕模式）也還是會對。
 *
 * 每一次讀寫都包 try —— 無痕視窗存取 localStorage 會丟例外，
 * 不能讓設定讀取失敗就整頁壞掉。
 */

'use strict';

window.StudySetup = (function () {

  var KEY = 'study-setup-20261106';
  var GRADES = [3, 4, 5, 6];
  var VERSIONS = ['kang', 'nani', 'han'];
  var DEFAULTS = { grade: 5, term: 1, version: 'kang' };

  function clean(o) {
    o = o || {};
    return {
      grade: GRADES.indexOf(+o.grade) >= 0 ? +o.grade : DEFAULTS.grade,
      term: (+o.term === 1 || +o.term === 2) ? +o.term : DEFAULTS.term,
      version: VERSIONS.indexOf(o.version) >= 0 ? o.version : DEFAULTS.version,
    };
  }

  function read() {
    try { return clean(JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return clean(null); }
  }

  function write(o) {
    var c = clean(o);
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    return c;
  }

  /** 網址帶的設定，沒帶就回 null。?g=5&t=1&v=kang */
  function fromURL() {
    var p;
    try { p = new URLSearchParams(location.search); } catch (e) { return null; }
    if (!p.get('g') && !p.get('t') && !p.get('v')) return null;
    var cur = read();
    return clean({
      grade: p.get('g') || cur.grade,
      term: p.get('t') || cur.term,
      version: p.get('v') || cur.version,
    });
  }

  /**
   * 這一頁該用的設定。網址有帶就用網址的，並且寫回去
   * （這樣從首頁點進來之後，之後直接開子頁也會記得）。
   */
  function resolve() {
    var u = fromURL();
    return u ? write(u) : read();
  }

  /** 接在連結後面的查詢字串，例如 '?g=5&t=1&v=kang' */
  function query(o) {
    var c = clean(o || read());
    return '?g=' + c.grade + '&t=' + c.term + '&v=' + c.version;
  }

  function termCh(t) { return (+t === 2) ? '下' : '上'; }
  function termNum(ch) { return ch === '下' ? 2 : 1; }

  return {
    KEY: KEY,
    GRADES: GRADES,
    VERSIONS: VERSIONS,
    read: read,
    write: write,
    fromURL: fromURL,
    resolve: resolve,
    query: query,
    termCh: termCh,
    termNum: termNum,
  };
})();
