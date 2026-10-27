/* ============================================================
   SCENES.JS — INI FILE YANG KAMU EDIT BUAT NYOCOKIN LIRIK
   ------------------------------------------------------------
   Waktu pakai BEAT, bukan detik:
        detik = 0.44 + beat * 0.4478        (beat 0 = 0.44s, beat 80 = 36.3s)
        beat  = (detik - 0.44) / 0.4478
   Lagu dimulai dari detik 3 mp3-nya (START), jadi detik video 0 = detik 3 lagu.
   Biar gampang: buka index.html?debug=1 (atau geser slider), angka beat tampil live.

   GAYA LAMA (scene 0..79, scrapbook / ransom-letter):
     tx([['kata',beat],['kata',beat],...], [kata per baris,...], cx, top, ukuran, {seed:'x', dark:true, single:true, maxW:..})
       -> teks guntingan huruf. Ganti kata / beat-nya sesuai lirik. Jumlah kata di [..] harus pas.
     ph(key,beat,cx,cy,lebar,{...})   foto polaroid (key = nama file di img/, tanpa .jpg)
     scr('heart'|'star'|'sparkle'|'underline'|'arrow', beat, x,y,w,h, warna)   coretan
     typed(teks,beat,x,y,ukuran,warna)   teks ketik     script(teks,beat,x,y,ukuran,warna)  tulisan tangan

   BEAT BOLEH PECAHAN: 84.5, 83.3, dst (slider di preview nampilin beat 1 angka desimal).

   GAYA BARU (scene yang ada clean:1 — dari beat 80 / detik ~36 sampai akhir):
     ct([['kata',beat],['kata',beat,{accent:1}]], [kata per baris], cx, top, ukuran, {single:true})
     cl('teks', beat, x, y, ukuran, {italic:1, caps:1, color:'#...'})
     cp('key', beat, x, y, lebar, tinggi, {fx,fy,zm,cap})     foto bingkai tipis
     cstrip(beat, y, ['key',...], kecepatan)                   foto jalan pelan
     cscroll('key', beat, x, y, lebar, tinggi, {open:beat_mulai_buka, dur:detik_buka, fx,fy,zm,cap})   foto keluar dari gulungan lalu membuka
     di scene: dust:1 (debu emas berdenyut tiap beat), rings:1 (cincin denyut tiap 2 beat)
   Mau scene lama jadi gaya baru (atau sebaliknya)? tambah/hapus  clean:1  + bg:'navy'/'ink' di scene-nya.
   Scene = {s:beat_mulai, e:beat_selesai, bg:..., amp:getar_beat, items:[...]}  — urut, s scene berikutnya = e scene sebelumnya.
   ============================================================ */
function buildScenes(){
  SC.length=0;
  const WARM_SHADE='rgba(40,16,2,.85)';   // bayangan teks di meja hangat (biar putihnya kebaca)
  // A — hitam putih
  SC.push({s:0,e:4,bg:'cream',amp:.006,items:[
    tx([['cerita',0],['kecil',1],['kita',2]],[3],640,170,150,{seed:'t1',maxW:1100}),
    scr('underline',3,640,430,860,26,'#b3261e'),
    typed('side A  /  vol. 01',3,640,540,32,'#2b2118',{cps:30}),
    ph('bw4',3,1090,520,210,{style:'polaroid',aspect:1,fy:.3,rot:6,cap:'dulu.'}),
    ph('bw1',3,190,520,210,{style:'polaroid',aspect:1,fy:.3,rot:-5}),
    scr('sparkle',3,1150,150,80,80,'#d9a526'),scr('heart',3,150,130,60,60,'#b3261e'),
  ]});
  SC.push({s:4,e:12,bg:'news',amp:.006,items:[
    ph('bw1',4,230,330,300,{aspect:.78,fy:.4,rot:-3,style:'polaroid',clip:1}),
    ph('bw2',8,480,350,300,{aspect:.78,fy:.4,rot:4,style:'polaroid'}),
    tx([['tawa',5],['yang',6],['tak',7],['pernah',9],['minta',10],['alasan',11]],[2,2,2],940,130,92,{seed:'a2'}),
    scr('star',9,780,90,70,70,'#b3261e'),
  ]});
  SC.push({s:12,e:20,bg:'dark',amp:.006,items:[
    tx([['hal-hal',13],['kecil',14],['yang',15],['dulu',17],['terasa',18],['biasa',19]],[2,2,2],340,130,92,{seed:'a3',dark:true}),
    ph('bw3',12,880,330,360,{aspect:.78,fy:.4,rot:-2,style:'polaroid'}),
    ph('bw4',16,1080,470,220,{aspect:1,fy:.3,rot:5,style:'polaroid',cap:'tertawa'}),
    scr('sparkle',18,640,90,70,70,'#f3ead6'),
  ]});
  SC.push({s:20,e:28,bg:'kraft',amp:.007,items:[
    ph('bw1',20,200,235,230,{aspect:1,fy:.3,rot:-4,style:'polaroid'}),
    ph('bw2',21,470,250,230,{aspect:1,fy:.3,rot:3,style:'polaroid'}),
    ph('bw3',22,745,235,230,{aspect:1,fy:.3,rot:-3,style:'polaroid'}),
    ph('bw4',23,1020,250,230,{aspect:1,fy:.3,rot:4,style:'polaroid'}),
    tx([['ternyata',24],['itulah',25],['yang',26],['dirindukan',27]],[4],640,440,105,{seed:'a4',maxW:1140}),
    scr('heart',27,1190,420,70,70,'#b3261e'),
  ]});
  SC.push({s:28,e:32,bg:'dark',amp:.012,items:[
    tx([['lalu',28],['waktu',29],['berlari',30]],[3],640,230,160,{seed:'a5',dark:true,maxW:1150}),
    scr('arrow',31,640,520,520,120,'#f3ead6',{lw:10}),
    scr('sparkle',29,170,140,80,80,'#f3ead6'),scr('star',30,1120,600,70,70,'#b3261e'),
  ]});
  // B — berwarna
  SC.push({s:32,e:40,bg:'warm',amp:.01,items:[
    ph('rd1',32,290,340,360,{aspect:.78,fy:.4,rot:-3,style:'polaroid',clip:1}),
    ph('rd2',36,540,390,250,{aspect:1,fy:.3,rot:5,style:'polaroid',cap:'pelan-pelan'}),
    tx([['hidup',33],['mulai',34],['berwarna',35]],[2,1],940,190,104,{seed:'b1'}),
    scr('underline',38,940,490,460,30,'#b3261e'),
    scr('sparkle',37,1170,110,80,80,'#d9a526'),scr('heart',39,780,130,60,60,'#b3261e'),
  ]});
  SC.push({s:40,e:48,bg:'kraft',amp:.01,items:[
    tx([['hari',41],['sederhana',42],['jadi',45],['favorit',46]],[2,2],350,170,100,{seed:'b2'}),
    ph('cafe',40,860,330,250,{aspect:.62,fy:.5,rot:-3,style:'polaroid'}),
    ph('selfie',44,1060,420,340,{aspect:1.33,fx:.5,fy:.5,rot:4,style:'polaroid',cap:'warung'}),
    scr('star',46,650,90,70,70,'#b3261e'),
  ]});
  SC.push({s:48,e:56,bg:'red',amp:.012,items:[
    ph('rd3',48,220,340,300,{aspect:.78,fy:.4,rot:-4,style:'polaroid'}),
    ph('rd4',52,470,390,300,{aspect:.78,fy:.4,rot:4,style:'polaroid',clip:1}),
    tx([['seolah',49],['waktu',50],['tak',53],['punya',54],['akhir',55]],[2,3],940,150,92,{seed:'b3',dark:true}),
    scr('sparkle',55,1180,600,80,80,'#f3ead6'),
  ]});
  SC.push({s:56,e:61,bg:'dark',amp:.014,items:[
    tx([['tapi',56],['tiap',57],['bab',58],['ada',59],['akhirnya',60]],[3,2],640,170,130,{seed:'b4',dark:true,maxW:1100}),
    scr('sparkle',58,1140,130,80,80,'#f3ead6'),scr('heart',59,150,600,70,70,'#b3261e'),scr('underline',60,640,590,640,26,'#d9a526'),
  ]});
  SC.push({s:61,e:64,bg:'dark',amp:.025,items:[
    tx([['3',61],['2',62],['1',63]],[1],640,360,470,{single:true,seed:'cnt',dark:true,maxW:400}),
    scr('star',61,150,130,90,90,'#b3261e'),scr('sparkle',62,1130,590,90,90,'#d9a526'),scr('heart',63,1130,130,90,90,'#b3261e'),
  ]});
  // C — drop  (tanpa teks: cuma foto + coretan, biar tetap kerasa "drop" tapi nggak ada kata "bab selesai")
  SC.push({s:64,e:72,bg:'kraft',amp:.024,confetti:'burst',items:[
    ph('gr1',64,270,350,360,{aspect:.75,fx:.45,fy:.8,zm:1.8,rot:-3,style:'polaroid',clip:1}),
    ph('gr2',66,640,375,360,{aspect:.75,fx:.5,fy:.9,zm:1.8,rot:4,style:'polaroid'}),
    ph('cafe',68,1000,350,290,{aspect:.62,fy:.5,rot:-3,style:'polaroid'}),
    scr('star',70,1160,130,110,110,'#d9a526'),scr('sparkle',70,640,110,90,90,'#b3261e'),scr('heart',71,150,620,90,90,'#b3261e'),
  ]});
  SC.push({s:72,e:80,bg:'dark',amp:.024,items:[
    ph('selfie',72,360,330,560,{aspect:1.33,rot:-2,style:'polaroid'}),
    tx([['tetap',73],['di',74],['sebelahmu',75]],[2,1],950,130,110,{seed:'c2',dark:true}),
    script('dari dulu',77,950,440,84,'#f3ead6',{rot:-.05}),
    script('sampai nanti',79,950,540,84,'#f3ead6',{rot:.04}),
    scr('heart',79,1180,610,80,80,'#b3261e'),
  ]});

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
    dtx([['by',110.5],[':',110.8],['LuluNext',111.1],["you'r",112],['Uda',112.5],['now',113]],[6],290,245,52,{rot:-3,dur:.4,color:'#efe6d2'}),   // kredit di bawah "terima kasih"
    dp(10,109,-660,-290,290,{rot:8}),
    dp(11,111,-250,340,300,{rot:-6,aspect:.85}),
    dp(12,113,820,320,260,{rot:5}),
    dp(13,115,-60,-410,280,{rot:-4,aspect:1.2}),
    dp(14,117,470,-420,270,{rot:7}),
    dp(15,119,800,-30,250,{rot:-7,aspect:.85}),
  ],{dust:1}));

  // ===== SCENE LAMA (beat 0-80) DIPINDAH KE MEJA YANG SAMA =====
  // Item lama (tx/ph/scr/typed/script) tetap pakai koordinat LAYAR 1280x720 dan tetap diedit seperti biasa.
  // Tabel di bawah cuma mengatur "mejanya": mood ('grey' = hitam-putih, 'warm' = berwarna), dim (gelapkan), tint (warna), flash (kilatan transisi 0..1), cam.
  const OLDTABLE={
    0:{mood:'grey',flash:0},   4:{mood:'grey'},   12:{mood:'grey',dim:.28},  20:{mood:'grey'},  28:{mood:'grey',dim:.4,flash:.4},
    32:{mood:'warm',flash:.9}, 40:{mood:'warm'},  48:{mood:'warm',tint:'rgb(190,70,62)'},
    56:{mood:'warm',dim:.5,flash:.35}, 61:{mood:'warm',dim:.62,flash:.2}, 64:{mood:'warm',flash:1}, 72:{mood:'warm',dim:.38,flash:.35}
  };
  SC.forEach(sc=>{
    if(sc.desk)return;const o=OLDTABLE[sc.s]||{mood:'grey'};
    sc.desk={mood:o.mood,cam:o.cam||[[0,0,1,0],[0,0,1.045,0]],shadow:o.mood==='warm'?'leaf':'window',dim:o.dim||0,tint:o.tint||null};
    sc.flash=o.flash??.25;sc.dust=1;
  });
  // benda di meja untuk scene pembuka (taruh di bawah semua item lain)
  SC[0].items.unshift(dnb(0,0,10,880,620,{rot:-2}));
  SC[1].items.unshift(dnews(4,130,230,640,470,{rot:3,head:'CERITA KECIL KITA',sub:'side A / vol. 01',slot:0}));
  SC[3].items.unshift(dleaf(20,-600,-250,56,{rot:-30,tone:'brown'}),dpen(20,580,-300,300,{rot:35}));
}
