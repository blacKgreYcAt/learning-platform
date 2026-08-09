#!/bin/bash
# 五上數學引導式教學 — iPad 用的本機伺服器
# 用法：在 Finder 裡點兩下這個檔案就好
# 2026-08-07

cd "$(dirname "$0")" || exit 1

PORT=8899
PAGE="g5-math-guided-20260807.html"

# 如果已經有一個在跑，先停掉，避免佔用埠號
if pgrep -f "http.server $PORT" >/dev/null; then
  echo "偵測到舊的伺服器還在跑，先關掉它…"
  pkill -f "http.server $PORT"
  sleep 1
fi

# IP 每次連 Wi-Fi 都可能不一樣，所以在這裡即時查，不要寫死
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
if [ -z "$IP" ]; then
  echo "⚠️  找不到 Wi-Fi 的 IP，請確認 Mac 有連上網路"
  echo "按 Enter 關閉"
  read -r
  exit 1
fi

echo "════════════════════════════════════════════"
echo "  iPad 請開這個網址（要跟 Mac 同一個 Wi-Fi）"
echo
echo "     http://$IP:$PORT/$PAGE"
echo
echo "  建議在 Safari 按「分享 → 加入主畫面」，"
echo "  之後從主畫面圖示打開就是全螢幕。"
echo "════════════════════════════════════════════"
echo
echo "⚠️  這個視窗要保持開著。關掉視窗＝伺服器停止。"
echo

# 伺服器跑著的時候不要讓 Mac 睡著，睡著 iPad 就連不上
caffeinate -d &
CAFFEINE_PID=$!
trap 'kill $CAFFEINE_PID 2>/dev/null' EXIT

python3 -m http.server "$PORT" --bind 0.0.0.0
