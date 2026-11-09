/**
 * 星際數學探險 — 單元深連結（?unit=）
 * 2026-11-09
 *
 * 為什麼要有這一份：
 *   闖關站（題庫）現在會在每個單元上面放一個「先看教學」。
 *   按下去要直接落在對應的那個引導單元，不能只跳到單元地圖讓小孩自己找 ——
 *   他正在卡住某一個觀念，中間多一步就會放棄。
 *
 * 為什麼不直接改 index.html 裡那段 applyDeepLink：
 *   那段已經完成並上線，照慣例不覆寫。而且 openUnit 關在 IIFE 裡面，
 *   外部拿不到，所以這裡的做法是「找到那張單元卡，幫小孩按下去」——
 *   走的是跟小孩完全一樣的路徑，不繞過任何既有邏輯。
 *
 * 用法：?grade=5-1&unit=g5-u02-factors
 *   grade 由原本的 applyDeepLink 負責（它會把年級、學期選好，單元地圖才長出來）。
 *   這一份只負責最後一步。找不到就什麼都不做，停在單元地圖，不會變空畫面。
 */

'use strict';

(function () {
  var id = new URLSearchParams(location.search).get('unit');
  if (!id) return;

  var unit = window.G5_UNITS && window.G5_UNITS[id];
  if (!unit) return;                       // 單元還沒做，留在地圖上

  var list = document.getElementById('unit-list');
  if (!list || !list.children.length) return;   // 年級學期沒選到，地圖是空的

  /* 用標題文字找，不用索引（索引會被「製作中」的單元錯開）。
     單元卡的 strong 寫的是「8. 面積」—— 編號來自 index.html 裡的 CURRICULUM，
     短標題也是。單元檔自己的 title 則是「單元 8　面積」，兩邊寫法不一樣，
     所以不能直接比字串：先用編號鎖定，再確認短標題真的出現在單元檔的標題裡。 */
  var prefix = unit.order + '. ';
  var cards = list.querySelectorAll('button.unit');

  for (var i = 0; i < cards.length; i++) {
    var strong = cards[i].querySelector('strong');
    if (!strong) continue;
    var txt = strong.textContent.trim();
    if (txt.indexOf(prefix) !== 0) continue;
    if (unit.title.indexOf(txt.slice(prefix.length)) < 0) continue;   // 編號對、名字不對，不敢按
    if (cards[i].disabled) return;         // 製作中，不要硬按
    cards[i].click();
    return;
  }
})();
