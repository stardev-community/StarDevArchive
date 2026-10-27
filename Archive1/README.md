# Cerita Kecil Kita

Seluruh video sekarang satu **meja flat-lay** yang sama (polaroid, buku spiral, koran, bayangan jendela/daun, light-leak).
- Detik 0-36 (beat 0-80): huruf potongan kertas (ransom-letter) tergeletak di atas meja. Meja abu-abu = bagian hitam-putih, meja kayu hangat = bagian berwarna.
  Item di sini (tx/ph/scr/typed/script) tetap pakai koordinat LAYAR 1280x720. Tabel `OLDTABLE` di akhir `src/scenes.js` mengatur mood meja, gelap-terang, warna, dan kilatan transisi per scene.
- Detik 36+ (beat 80+): tulisan tangan, kamera bergeser, koordinat = koordinat meja.

## Struktur
- `config.js`      -> **isi `repo` GitHub kamu di sini** (satu-satunya yang wajib diedit)
- `foto/`          -> **taruh foto di sini, nama bebas** (jpg/png/webp). Otomatis kepakai, tidak perlu edit kode.
- `img/`           -> 12 foto bawaan buat scene lama (0 - 36 detik). Mau ganti? timpa file dengan **nama yang sama**.
- `src/scenes.js`  -> semua kata/lirik + beat + posisi item. Penjelasan format ada di komentar atas file.
- `src/desk.js`    -> mesin gaya meja (biasanya nggak perlu disentuh)
- `src/engine.js`, `src/photos.js`, `src/main.js` -> mesin lain

## Pakai GitHub (HTML narik semuanya dari sana)
1. Buat repo (mis. `cerita-kecil-kita`), upload **seluruh isi folder ini**.
2. Isi `repo:'usernamekamu/cerita-kecil-kita'` di `config.js`.
3. Repo -> Settings -> Pages -> Branch `main` / root -> Save. Link-nya `https://usernamekamu.github.io/cerita-kecil-kita/`.
4. **Ganti foto**: buka folder `foto/` di GitHub -> Add file -> Upload files (atau hapus yang lama). Refresh halaman, selesai.
   - Urutan foto = urutan nama file (01, 02, 03 ... atau a, b, c). Foto ke-1 dipakai di slot pertama, dst.
   - Foto lebih sedikit dari slot? Otomatis diulang. Foto banyak? Tambah `dp(16,...)`, `dp(17,...)` di scenes.js kalau mau dipakai semua.
   - Foto HP yang besar (4000px) aman, otomatis dikecilkan saat dimuat.
   - Daftar foto dibaca lewat GitHub API (batas 60x/jam per jaringan; kalau habis, pakai daftar terakhir yang tersimpan di browser).
     File di GitHub kadang butuh beberapa menit sebelum kelihatan (cache).

## Preview di laptop / Termux
    python3 -m http.server 8000     # lalu buka http://localhost:8000
Di localhost, foto dibaca dari folder `foto/` lokal (bukan GitHub). Jangan buka index.html langsung (file://).
Tekan Putar (lagu.m4a otomatis). Geser slider buat lihat frame + nomor beat (detik = 0.44 + beat*0.4478).

## Build ke mp4
    npm i playwright && npx playwright install chromium
    node render.js --out hasil.mp4
    node render.js --from 36 --to 54.6 --out cek.mp4   # cek bagian meja aja
Perlu ffmpeg. Render selalu pakai foto lokal di `foto/`. Pakai Chrome sendiri: CHROME_PATH=/path/chrome node render.js ...

## Catatan
- Meja abu-abu: foto dibuat hitam-putih (biar kayak referensi). Mau tetap berwarna: `deskBW:false` di config.js.
- Font tulisan tangan bawaan: TeX Gyre Chorus. Mau yang lebih "tanda tangan"? isi `scriptFont:'Mrs Saint Delafield', scriptScale:1.6` di config.js (di-load dari Google Fonts, butuh internet).
- Kalau panjang lagu/video beda, ubah DUR, START di baris atas src/engine.js.
