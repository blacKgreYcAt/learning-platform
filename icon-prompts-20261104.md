# 圖示生圖規格 — 2026-11-04

全站共有 537 個 emoji、122 種，但**不需要全部換**。實際量過每一顆的算繪尺寸後，
真正「大到看得出風格不對」的只有 **20 種**，集中在各 App 的首頁卡片上。
其餘的是夾在句子裡的 ✓ ✅ ⚠️ 💡 🔑（12–16px），換成圖片反而會壞掉
（對不齊基線、無法跟著文字變色、檔案數量爆掉）——那些另有做法，見文末。

---

## 一、共用的風格指令（每次都貼這段）

```
Flat 2D vector icon, single centered object, Splatoon-inspired ink style.
Thick uniform black outline (6-8px at 1024px), bold simple silhouette,
cel-shaded with 2 flat tones only, no gradients, no glow, no drop shadow.
Shading indicated by halftone dot clusters. Slightly hand-painted irregular
edges, as if cut from ink. Bright saturated palette limited to:
cyan #16D0F0, orange #FF7A1A, lime #A9D636, navy #3A709D, gold #F6AA43.
Pure white background (#FFFFFF), object fully inside frame with 10% margin
on all sides. Square 1:1, 1024x1024. No text, no letters, no numbers,
no border, no frame, no watermark, single object only.
```

### 三個一定要照做的點

1. **背景寫「pure white #FFFFFF」，不要寫 transparent。**
   上次做主角時踩過：模型把「透明背景」理解成「要畫出棋盤格圖案」，
   產出的檔案根本沒有 alpha 通道。去背由我這邊用腳本做。

2. **線要粗、形狀要簡單。**
   最小的使用場合是首頁功能卡的 32px。細節在那個尺寸會糊成一團。
   判斷方式：把圖縮到指甲大小還認得出來，就過關。

3. **一張一個物件、置中、留 10% 邊。**
   貼邊的話去背後裁切會把輪廓線切掉。

---

## 二、要生的 20 張

### A. 首頁大卡片圖示（80px 顯示，最顯眼，優先做）

| # | 檔名 | 取代 | 主體指令（接在共用指令後面） |
|---|------|------|------|
| 1 | `icon-classics-20261104.png` | 📜 | `An unrolled bamboo scroll, ancient Chinese style, cyan and gold.` |
| 2 | `icon-mathlogic-20261104.png` | 🧮 | `An abacus with chunky round beads, orange frame, cyan beads.` |
| 3 | `icon-schulte-20261104.png` | 🎯 | `A concentric target with a dart stuck off-center, orange and cyan rings.` |
| 4 | `icon-mathscience-20261104.png` | 🔢 | `A stack of three chunky dice showing dots, cyan and orange faces.` |
| 5 | `icon-natural-20261104.png` | 🌿 | `A single bold leaf sprig with three leaves, lime green, thick stem.` |
| 6 | `icon-social-20261104.png` | 🏛 | `A classical temple facade with four columns and a triangular pediment, navy and gold.` |
| 7 | `icon-chinese-20261104.png` | 📚 | `Three stacked hardcover books seen from the side, orange cyan and lime covers.` |
| 8 | `icon-energy-20261104.png` | ⚡ | `A single bold lightning bolt, gold and orange, sharp angular zigzag.` |
| 9 | `icon-english-20261104.png` | 🎤 | `A handheld microphone with a round mesh head, cyan body, orange grille.` |

### B. 首頁功能卡圖示（32px 顯示 — 線要最粗）

| # | 檔名 | 取代 | 主體指令 |
|---|------|------|------|
| 10 | `icon-game-20261104.png` | 🎮 | `A game controller with two round buttons and a d-pad, orange body.` |
| 11 | `icon-device-20261104.png` | 📱 | `A tablet and a phone overlapping, cyan screens, navy bezels.` |
| 12 | `icon-brain-20261104.png` | 🧠 | `A simplified brain in profile with two bold folds, orange, no wrinkle detail.` |
| 13 | `icon-rocket-20261104.png` | 🚀 | `A stubby rocket pointing up-right with a triangular fin, cyan body orange nose.` |

### C. 章節圖示（45px 顯示 — 自然科、社會科、能源）

| # | 檔名 | 取代 | 主體指令 |
|---|------|------|------|
| 14 | `icon-force-20261104.png` | 💪 | `A flexed cartoon arm, bold bicep curve, orange, no hand detail.` |
| 15 | `icon-water-20261104.png` | 💧 | `A single fat water droplet, cyan, one white highlight blob.` |
| 16 | `icon-earth-20261104.png` | 🌍 | `A globe with two simplified continent blobs, cyan ocean lime land.` |
| 17 | `icon-sun-20261104.png` | ☀️ | `A sun with eight chunky triangular rays, gold center orange rays.` |
| 18 | `icon-gear-20261104.png` | ⚙️ | `A single cog with six square teeth and a round hole, navy and cyan.` |
| 19 | `icon-microscope-20261104.png` | 🔬 | `A microscope in side view, bold angular body, cyan and orange.` |
| 20 | `icon-crop-20261104.png` | 🌾 | `A bundle of three wheat stalks with fat grain heads, gold and lime.` |

---

## 三、不用生圖、我直接畫的

| 項目 | 原本 | 做法 |
|------|------|------|
| 舒爾特難度圓點 | 🟢 🟡 🔴 | 純色圓形，CSS 就能畫成墨點，不值得生圖 |
| 句中的對錯標記 | ✓ ✗ ✅ ❌ | 內嵌 SVG，會跟著文字顏色走 |
| 句中的提示標記 | 💡 🔑 ⚠️ 📍 | 內嵌 SVG，同上 |

後面兩列共 200 多處，散在各課的內容檔裡。要改得動 JS 內容檔，
不是改 CSS 就好，所以**先不動**，等你確認要不要再說。

---

## 四、生完以後

1. 全部丟進 `~/Documents/個人Claude Code開發專案/SR 圖片庫`
2. 跟我說一聲
3. 我用既有的 `debg-white-20261104.py` 去背 → 量化成 PNG-128 → 放進
   `learning-platform/assets/`，再把各 App 的 emoji 換成 `<img>` 或 CSS 背景

一張一張生也可以，生幾張就先換幾張，不必等齊。
前 9 張（A 組）換完視覺差異最大，建議先做那組。

---

# 第二批：任務卡圖示（補盤點缺口）

**這是我第一次盤點漏掉的。** 當初只量了各 App 的首頁，
但自然科和社會科「進入篇章之後」還有一層任務卡，
`.mission-icon` 以 2.4rem（約 38px）顯示，共 26 格。
首頁的圖示換成墨水風之後，點進篇章會看到還是蘋果 emoji。

26 格裡面有 11 格可以直接重用第一批的圖，**實際要新生的是 15 張**。

## 自然科（9 張新圖）

| 檔名 | 取代 | 用在 | 主體指令 |
|------|------|------|------|
| `icon-ruler-20261104.png` | 📏 | 力的測量 | `A ruler with bold tick marks, orange body, navy markings.` |
| `icon-crane-20261104.png` | 🏗 | 生活應用設計 | `A tower crane with a hook, bold angular frame, gold and navy.` |
| `icon-wave-20261104.png` | 🌊 | 虹吸現象 | `A single curling ocean wave with a foam crest, cyan and white.` |
| `icon-splash-20261104.png` | 💦 | 引水裝置 | `Three water droplets splashing outward, cyan, with motion flecks.` |
| `icon-rock-20261104.png` | 🪨 | 認識大地 | `A chunky faceted boulder, navy and gray-blue, two flat tones.` |
| `icon-pickaxe-20261104.png` | ⛏ | 地殼的變化 | `A pickaxe crossing diagonally, gold handle, cyan steel head.` |
| `icon-bulb-20261104.png` | 💡 | 電與電路 | `A lightbulb with a visible filament loop, gold glass, navy base.` |
| `icon-house-20261104.png` | 🏠 | 家庭電路 | `A simple house with a pitched roof and one window, orange roof cyan walls.` |
| `icon-recycle-20261104.png` | ♻️ | 節約能源 | `Three chunky arrows forming a triangular recycling loop, lime green.` |

可重用：⚡→energy（力的特性、串聯與並聯）、🚀→rocket、💪→force、
🔬→microscope、💧→water、🌍→earth、☀️→sun、⚙️→gear

## 社會科（6 張新圖）

| 檔名 | 取代 | 用在 | 主體指令 |
|------|------|------|------|
| `icon-tree-20261104.png` | 🌲 | 山林演變故事 | `A single conifer pine tree with layered branches, lime and navy trunk.` |
| `icon-fish-20261104.png` | 🐟 | 漁業轉型挑戰 | `A plump fish in side view with a fan tail, cyan body orange fin.` |
| `icon-tractor-20261104.png` | 🚜 | 農耕時光機 | `A farm tractor in side view with one big rear wheel, orange body.` |
| `icon-veg-20261104.png` | 🥬 | 食安衛士 | `A leafy cabbage with curling outer leaves, lime green, pale core.` |
| `icon-mask-20261104.png` | 🎭 | 民俗文化祭典 | `Two overlapping theatre masks, one orange one cyan, bold eye holes.` |
| `icon-star-20261104.png` | 🌟 | 社區故事工坊 | `A five-pointed star with a sparkle, gold, thick outline.` |

可重用：💧→water、🏛→social

## 還有一處要動程式碼

社會科的答題畫面 `.quiz-icon`（3rem）是 JS 依題號輪播同一組 8 個 emoji
（`index.html` 第 984 行附近），emoji 寫在 `textContent` 裡，
CSS 抓不到，**沒辦法用現在這套純 CSS 的方式換**。
要換得改那一行 JS。上面社會科那 8 張生完之後我再處理，先問過你。

（自然科也有 `.quiz-icon` 的 CSS，但整支沒有用到，是死樣式，不用管。）

## 風格指令照舊

共用指令、三個注意事項、交付方式都跟第一批一樣，往上翻。

