/* ============================================================
   SCENES.JS — INI FILE YANG KAMU EDIT BUAT NYOCOKIN LIRIK
   Waktu pakai BEAT, bukan detik:   detik = 0.44 + beat * 0.4478    (beat 80 = 36.3s)
   Buka index.html?debug=1 -> geser slider, nomor beat tampil live.

   SEMUA scene sekarang gaya meja (koordinat = koordinat MEJA, (0,0) = tengah meja):
     deskScene(beatMulai, beatSelesai, 'grey'|'warm', [[x,y,zoom,derajat],[x,y,zoom,derajat]], [item,...], {flash,amp,dim})
        cam = posisi kamera awal -> akhir scene. grey = hitam-putih, warm = kayu berwarna. flash = kilatan cahaya (0..1)
     dp(slot,beat,x,y,lebar,{rot,aspect,fx,fy,zm,cap})   foto polaroid (slot 0 = foto pertama di folder foto/)
     dtx([['kata',beat,{red:1,circle:1,cb:beatLingkar}],...],[kata per baris],x,y,ukuran,{rot,color,dur})   tulisan tangan
     dnb / dnews / dpen / dleaf / dvinyl / ddand   buku spiral, koran, pulpen, daun, piringan hitam, dandelion
     scr('heart'|'star'|'sparkle'|'underline'|'arrow', beat, x,y,w,h, warna)   coretan   (x,y = koordinat layar 1280x720)
     typed(teks,beat,x,y,ukuran,warna)   teks ketik (koordinat layar)
   Jumlah kata di [..] harus pas dengan jumlah angka di array baris. Scene berurutan: s scene berikutnya = e scene sebelumnya.
   ============================================================ */
function buildScenes(){
  SC.length=0;
  const WARM_SHADE='rgba(40,16,2,.85)';   // bayangan teks di meja hangat (biar putihnya kebaca)
  // ===== BAGIAN AWAL (beat 0-80 / detik 0-36) — SEKARANG SATU GAYA DENGAN BAGIAN AKHIR: meja flat-lay, tulisan tangan, kamera pelan =====
  // Meja abu-abu (hitam-putih) = kenangan "dulu" (beat 0-32).  Meja kayu hangat = hidup mulai berwarna (beat 32-80).
  // Foto: slot 6,8,10,11 = foto hitam-putih di folder foto/ (cocok buat bagian "dulu"); slot 0-5,7,9 = foto berwarna.
  // Koordinat = koordinat MEJA (0,0 = tengah meja). flash = kilatan cahaya di pergantian scene (kecil biar santai).
  const SOFT={flash:.45,amp:.003};
  const INK='#1d1d22',INKS='rgba(0,0,0,.14)';

  // 1 — buku spiral, judul ditulis pelan  |  "cerita kecil kita"
  SC.push(deskScene(0,4,'grey',[[0,0,1.0,-.4],[12,8,1.06,.3]],[
    dnb(0,0,10,900,650,{rot:-2}),
    dtx([['cerita',0],['kecil',1],['kita',2,{red:1,circle:1,cb:3}]],[1,1,1],40,-35,128,{rot:-2,color:INK,shade:INKS,dur:.55}),
    typed('side A  /  vol. 01',3,640+30,360+215,30,'#3a3a42',{cps:26}),
    dpen(.5,470,225,310,{rot:-38}),
    dp(6,3,-560,-240,210,{rot:-8}),
    dp(8,3.5,545,-235,200,{rot:7,cap:'dulu.'}),
  ],{...SOFT,flash:.25}));

  // 2 — koran + dua foto  |  "tawa yang tak pernah minta alasan"
  SC.push(deskScene(4,12,'grey',[[-10,0,1.0,.5],[25,-20,1.07,-.4]],[
    dnews(4,-100,40,560,680,{rot:-4,head:'KENANGAN',sub:'edisi dulu',slot:6}),
    dp(8,4.2,-420,-120,300,{rot:-6,aspect:.85}),
    dp(10,8,-60,215,250,{rot:5}),
    dtx([['tawa',5],['yang',6],['tak',7],['pernah',9],['minta',10],['alasan',11,{red:1,circle:1,cb:11.4}]],[2,2,2],400,-20,100,{rot:-3}),
    dpen(8.5,560,300,300,{rot:28}),
  ],SOFT));

  // 3 — meja agak gelap, foto besar  |  "hal-hal kecil yang dulu terasa biasa"
  SC.push(deskScene(12,20,'grey',[[20,0,1.0,-.4],[-15,15,1.07,.4]],[
    dp(11,12,360,-25,380,{rot:-2,aspect:.85}),
    dp(6,16,590,235,230,{rot:5,cap:'tertawa'}),
    dtx([['hal-hal',13],['kecil',14],['yang',15],['dulu',17],['terasa',18],['biasa',19,{red:1,circle:1,cb:19.3}]],[2,2,2],-300,-10,98,{rot:-3}),
  ],{...SOFT,dim:.22}));

  // 4 — empat foto berjajar  |  "ternyata itulah yang dirindukan"
  SC.push(deskScene(20,28,'grey',[[0,-10,1.0,.3],[0,20,1.06,-.3]],[
    dp(6,20,-460,-190,235,{rot:-4}),
    dp(8,21,-160,-205,235,{rot:3}),
    dp(10,22,150,-190,235,{rot:-3}),
    dp(11,23,455,-205,235,{rot:4}),
    dtx([['ternyata',24],['itulah',25],['yang',26],['dirindukan',27,{red:1,circle:1,cb:27.6}]],[2,2],0,185,110,{rot:-2}),
    dpen(24,-520,290,300,{rot:-20}),
  ],SOFT));

  // 5 — gelap, tenang  |  "lalu waktu berlari"
  SC.push(deskScene(28,32,'grey',[[0,0,1.0,.4],[-20,10,1.1,-.4]],[
    dp(10,28,-470,200,230,{rot:-7,aspect:.85}),
    dtx([['lalu',28],['waktu',29],['berlari',30,{red:1}]],[2,1],80,-10,150,{rot:-3,dur:.6}),
    scr('arrow',31,640+80,360+190,420,90,'#f3ead6',{lw:7}),
  ],{...SOFT,dim:.34,flash:.35}));

  // 6 — meja kayu hangat, berwarna  |  "hidup mulai berwarna"
  SC.push(deskScene(32,40,'warm',[[-15,0,1.0,-.5],[20,-15,1.08,.5]],[
    dleaf(32,-600,-270,60,{rot:-40,tone:'brown'}),dleaf(32.5,600,300,56,{rot:35}),
    dp(0,32,-330,-30,400,{rot:-3,aspect:1.2}),
    dp(1,36,-80,215,250,{rot:5,aspect:.85,cap:'pelan-pelan'}),
    dtx([['hidup',33],['mulai',34],['berwarna',35,{red:1,circle:1,cb:37.5}]],[2,1],330,-30,112,{rot:-3,shade:WARM_SHADE}),
    scr('sparkle',38,640+560,360-230,70,70,'#f3ead6'),
  ],{...SOFT,flash:1}));

  // 7 — foto warung  |  "hari sederhana jadi favorit"
  SC.push(deskScene(40,48,'warm',[[10,0,1.0,.4],[-25,10,1.07,-.5]],[
    dleaf(40,570,-300,56,{rot:20,tone:'olive'}),
    dp(3,40,350,-20,290,{rot:-3,aspect:.62,cap:'warung'}),
    dp(5,44,-560,250,200,{rot:6,aspect:.85}),
    dtx([['hari',41],['sederhana',42],['jadi',45],['favorit',46,{red:1,circle:1,cb:46.6}]],[2,2],-290,-20,104,{rot:-3,shade:WARM_SHADE}),
    ddand(41,-560,250,40,{rot:-15}),
  ],SOFT));

  // 8 — dua foto, teks di kanan  |  "seolah waktu tak punya akhir"
  SC.push(deskScene(48,56,'warm',[[-20,0,1.0,-.4],[15,12,1.07,.4]],[
    dp(4,48,-440,-30,290,{rot:-4,aspect:.8}),
    dp(5,52,-170,200,250,{rot:5}),
    dtx([['seolah',49],['waktu',50],['tak',53],['punya',54],['akhir',55,{red:1,circle:1,cb:55.4}]],[2,3],275,-10,92,{rot:-3,shade:WARM_SHADE}),
    dleaf(49,600,-300,54,{rot:-60,tone:'brown'}),dpen(50,-560,290,300,{rot:-15}),
  ],SOFT));

  // 9 — meja gelap, kalimat besar  |  "tapi tiap bab ada akhirnya"
  SC.push(deskScene(56,61,'warm',[[0,0,1.0,.3],[10,-10,1.08,-.3]],[
    dtx([['tapi',56],['tiap',57],['bab',58],['ada',59],['akhirnya',60,{red:1,circle:1,cb:60.4}]],[3,2],0,-10,128,{rot:-2}),
    dleaf(57,-590,-280,56,{rot:25,tone:'brown'}),
  ],{...SOFT,dim:.5,flash:.35}));

  // 10 — hitung mundur, ditulis tangan  |  "3 2 1"
  SC.push(deskScene(61,64,'warm',[[0,0,1.0,0],[0,0,1.12,.3]],[
    dtx([['3',61],['2',62],['1',63,{red:1}]],[3],0,0,300,{rot:-2,dur:.35}),
  ],{...SOFT,dim:.58,flash:.2}));

  // 11 — "drop" yang lembut: foto berjatuhan satu-satu, tanpa teks
  SC.push(deskScene(64,72,'warm',[[0,0,1.0,-.3],[-15,10,1.08,.4]],[
    dleaf(64,-600,-280,60,{rot:20,tone:'brown'}),dleaf(65,610,310,58,{rot:-70}),
    dp(4,64,-410,-20,320,{rot:-3,aspect:.8}),
    dp(1,66,-60,-10,320,{rot:4,aspect:.8}),
    dp(3,68,320,-20,290,{rot:-3,aspect:.62}),
    ddand(70,-120,260,42,{rot:10}),
  ],{...SOFT,flash:.9}));

  // 12 — foto besar + penutup bagian awal  |  "tetap di sebelahmu / dari dulu / sampai nanti"
  SC.push(deskScene(72,80,'warm',[[-10,0,1.0,.4],[20,-10,1.06,-.4]],[
    dp(0,72,-330,-10,520,{rot:-2,aspect:1.33}),
    dtx([['tetap',73],['di',74],['sebelahmu',75,{circle:1,cb:76}]],[2,1],350,-170,104,{rot:-3,shade:WARM_SHADE}),
    dtx([['dari',77],['dulu',77.5],['sampai',79],['nanti',79.5]],[2,2],350,75,84,{rot:-3,shade:WARM_SHADE,dur:.45}),
    scr('heart',79.4,640+590,360+270,60,60,'#d3262d'),
  ],{...SOFT,dim:.3,flash:.35}));

  // ===== GAYA MEJA / FLAT-LAY (referensi: PMV preset) — mulai beat 80 (detik ~36.3) sampai akhir =====
  // Koordinat = koordinat MEJA (0,0 = tengah meja), bukan layar. Kamera = cam:[[x,y,zoom,derajat],[x,y,zoom,derajat]]
  // (awal scene -> akhir scene). Foto diambil dari folder foto/ berurutan: dp(0,...) = foto ke-1, dp(1,...) = foto ke-2, dst.
  // Gaya "clean" lama (gulungan foto) masih ada di engine.js kalau mau dipakai lagi.

  // A — meja kayu hangat + bayangan daun  |  "semua ini berharga"
  SC.push(deskScene(80,88,'warm',[[10,-10,1.0,-.8],[-30,25,1.1,.8]],[
    dvinyl(80,-500,300,380),
    dleaf(80,-600,-270,60,{rot:-40,tone:'brown'}),dleaf(80.5,560,-290,56,{rot:35}),dleaf(81,60,300,48,{rot:110,tone:'olive'}),
    dp(0,80,-400,-120,280,{rot:-8,aspect:.85}),
    dp(1,81,-120,-210,250,{rot:6}),
    dp(2,82,-240,140,300,{rot:-3,aspect:1.25}),
    dp(3,83,-570,170,220,{rot:9,aspect:.8}),
    dtx([['semua',84],['ini',85],['berharga',87,{red:1,circle:1}]],[2,1],300,-20,112,{rot:-4,shade:WARM_SHADE}),
  ]));

  // B — meja abu-abu + bayangan jendela, buku spiral  |  "kalau suatu hari lupa, buka lagi halaman ini."
  const nb=[-300,-150,-5];   // x,y,rot buku — teks di buku ikut miring
  const onNb=(lx,ly)=>rotPt(nb[0],nb[1],lx,ly,nb[2]);
  SC.push(deskScene(88,96,'grey',[[-10,-120,1.0,.8],[30,150,1.06,-.5]],[
    dnb(88,nb[0],nb[1],410,560,{rot:nb[2]}),
    dpen(88.5,-170,40,340,{rot:-62}),
    (()=>{const[x,y]=onNb(10,-130);return dtx([['kalau',88],['suatu',88.7],['hari',89.4],['lupa,',90.1]],[2,2],x,y,62,{rot:nb[2],color:'#1d1d22',shade:'rgba(0,0,0,.18)',dur:.45})})(),
    dp(4,90,330,-130,330,{rot:4}),
    dp(5,91,300,250,300,{rot:-7}),
    dtx([['buka',92],['lagi',93],['halaman',94,{red:1,circle:1}],['ini.',95]],[2,2],-210,330,104,{rot:-3}),
  ]));

  // C — meja hangat lagi, koran  |  "cerita kecil kita"
  SC.push(deskScene(96,104,'warm',[[-70,10,1.0,.6],[40,-30,1.12,-.6]],[
    dleaf(96,-560,-330,60,{rot:20,tone:'brown'}),dleaf(96.5,640,300,56,{rot:-70}),
    dnews(96,-190,-20,520,670,{rot:-6,head:'CERITA KECIL KITA',sub:'side A / vol. 01',slot:6}),
    dp(7,97,-590,240,280,{rot:10,aspect:.85}),
    dp(8,98,300,-250,250,{rot:-6}),
    ddand(98.5,-60,-250,42,{rot:-20}),
    dtx([['cerita',99],['kecil',100],['kita',101,{red:1,circle:1}]],[1,1,1],340,90,104,{rot:-5,shade:WARM_SHADE}),
  ]));

  // D — penutup, meja abu-abu, kamera pelan menjauh  |  "terima kasih" (+ foto-foto berjatuhan sampai video habis)
  SC.push(deskScene(104,130,'grey',[[10,0,1.0,-.4],[40,-30,.78,.6]],[
    dp(9,104,-330,-40,430,{rot:-3}),
    dtx([['terima',104],['kasih',106,{red:1,circle:1,cb:108}]],[1,1],300,-20,170,{rot:-3,dur:.7}),
    dtx([['by',110.5],[':',110.8],['LuluNext',111.1],["you'r",112],['Uda',112.5],['now',113]],[6],290,245,58,{rot:-3,dur:.4,color:'#fff6e2'}),   // kredit di bawah "terima kasih"
    dp(10,109,-660,-290,290,{rot:8}),
    dp(11,111,-250,340,300,{rot:-6,aspect:.85}),
    dp(12,113,820,320,260,{rot:5}),
    dp(13,115,-60,-410,280,{rot:-4,aspect:1.2}),
    dp(14,117,470,-420,270,{rot:7}),
    dp(15,119,800,-30,250,{rot:-7,aspect:.85}),
  ],{dust:1}));

}
