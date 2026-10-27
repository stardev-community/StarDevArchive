# Cerita Kecil Kita

Video murni (tanpa tombol / slider / teks di layar). **Ketuk layar = putar / jeda.** Lagu `lagu.m4a` otomatis dipakai.
Seluruh video satu gaya: **meja flat-lay** santai (polaroid, buku spiral, koran, bayangan jendela/daun), tulisan tangan, kamera bergeser pelan.
- Detik 0-14.7 (beat 0-32): meja abu-abu / hitam-putih = kenangan "dulu".
- Detik 14.7+ (beat 32+): meja kayu hangat berwarna = "hidup mulai berwarna".
- Tidak ada lagi getar layar / confetti / huruf potongan kertas.

## Struktur
- `config.js`   -> isi `repo` GitHub (kalau foto mau ditarik dari GitHub)
- `foto/`       -> **taruh foto di sini, nama bebas** (jpg/png/webp). Otomatis kepakai. Urutan = urutan nama file.
  - Bagian awal (hitam-putih) pakai foto ke-7, 9, 11, 12 (slot 6,8,10,11) — foto hitam-putih paling cocok di situ.
- `src/scenes.js` -> semua kata/lirik + beat + posisi item (format dijelaskan di komentar atas file). `dp(slot,...)` = foto ke-(slot+1).
- `src/desk.js`, `src/engine.js`, `src/photos.js`, `src/main.js` -> mesin
- `termux.js` + `bikin-video.sh` -> bikin mp4 di Termux · `render.js` -> bikin mp4 di laptop (playwright)

## Deploy (Vercel / GitHub Pages)
Upload seluruh isi folder. Di Vercel, `vercel.json` otomatis menjalankan `node daftar.js` waktu build (membuat `foto/daftar.json`),
jadi tambah / ganti foto di `foto/` lalu push = beres. Di GitHub Pages foto dibaca lewat GitHub API (isi `repo` di `config.js`).

## Bikin video mp4 di Termux
    pkg install nodejs ffmpeg
    bash bikin-video.sh          # atau: node termux.js
Lalu buka di Chrome: `http://localhost:8000/?bikin=1` (kebuka sendiri kalau `termux-api` terpasang).
Biarkan layar nyala dan Chrome di depan sampai muncul **SELESAI** (sekitar beberapa menit). Hasil: `cerita_kecil_kita.mp4`
(disalin ke folder Download kalau sudah `termux-setup-storage`).
Pilihan di link: `&fps=24` · `&q=.85` (kualitas JPEG) · `&from=36&to=54.6` (render sebagian buat cek).

## Bikin video di laptop
    npm i playwright && npx playwright install chromium
    node render.js --out hasil.mp4            # perlu ffmpeg
    node render.js --from 0 --to 20 --out cek.mp4

## Mengatur waktu / cek frame
Buka `index.html?debug=1` -> muncul slider + nomor beat (detik = 0.44 + beat*0.4478). Tanpa `?debug=1` layar bersih.
Preview lokal: `python3 -m http.server 8000` atau `node termux.js` (jangan buka lewat file://).

## Catatan
- Meja abu-abu: foto jadi hitam-putih. Mau tetap berwarna: `deskBW:false` di `config.js`.
- Font tulisan tangan: TeX Gyre Chorus. Mau lebih "tanda tangan"? `scriptFont:'Mrs Saint Delafield', scriptScale:1.6` di `config.js` (butuh internet).
- Panjang lagu/video beda? ubah `DUR`, `START` di baris atas `src/engine.js`.
