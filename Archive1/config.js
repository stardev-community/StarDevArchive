/* ============================================================
   CONFIG — satu-satunya file yang perlu kamu isi biar HTML
   narik foto dari GitHub.
   ------------------------------------------------------------
   1. Upload SELURUH isi folder ini ke repo GitHub kamu.
   2. Isi `repo` di bawah (format: username/nama-repo).
   3. Taruh foto di folder  foto/  di repo itu (nama bebas, jpg/png/webp).
      Mau ganti foto? tinggal hapus / ganti / tambah file di folder foto/.
      Tidak perlu edit kode sama sekali.
   ============================================================ */
window.CONFIG={
  repo:'ytlulu/cerita-kecil-kita',  // <-- username/repo GitHub
  branch:'main',
  folder:'foto',                    // folder foto buat gaya meja (beat 80+)
  source:'auto',                    // 'auto' | 'github' | 'local'
                                    //  auto  = di laptop/Termux (localhost) pakai file lokal dulu,
                                    //          di tempat lain (github.io dll) pakai GitHub
  deskBW:true,                      // meja abu-abu: foto jadi hitam-putih (biar kayak referensi)
  scriptFont:'',                    // opsional, mis. 'Mrs Saint Delafield' (di-load dari Google Fonts)
  scriptScale:1                     // kalau scriptFont diisi, besar-kecil hurufnya, mis. 1.5
};
