#!/data/data/com.termux/files/usr/bin/bash
# Bikin cerita_kecil_kita.mp4 di Termux:  bash bikin-video.sh
cd "$(dirname "$0")"
command -v node   >/dev/null || pkg install -y nodejs
command -v ffmpeg >/dev/null || pkg install -y ffmpeg
command -v termux-wake-lock >/dev/null && termux-wake-lock    # biar Termux tidak tidur
node daftar.js 2>/dev/null
echo "Buka di Chrome:  http://localhost:8000/?bikin=1   (kalau tidak kebuka sendiri)"
node termux.js
