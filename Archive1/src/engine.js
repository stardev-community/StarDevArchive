/* ============================================================
   ENGINE — biasanya TIDAK perlu diedit.
   Yang diedit buat nyocokin lirik: src/scenes.js
   ============================================================ */
const W=1280,H=720,B0=0.44,P=0.4478,DUR=54.6,START=0;
/* B0 = detik beat pertama, P = jarak antar beat (detik), DUR = panjang video, START = mulai dari detik ke-berapa di file lagu (lagu.m4a sudah dipotong, jadi 0; kalau pakai mp3 penuh isi 3) */
const SC=[];
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
function rng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(s){s=String(s);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const bt=n=>B0+n*P;
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const easeOutBack=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const easeOutCubic=x=>1-Math.pow(1-x,3);

/* ---------- assets ---------- */
const IMG={};
const KEYS=['bw1','bw2','bw3','bw4','rd1','rd2','rd3','rd4','cafe','selfie','gr1','gr2'];
const loadImg=k=>new Promise(r=>{const i=new Image();i.onload=()=>{IMG[k]=i;r()};i.src='img/'+k+'.jpg'});

/* ---------- paper ---------- */
function makePaper(name,base,o){
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
  const R=rng(hash(name));
  g.fillStyle=base;g.fillRect(0,0,W,H);
  for(let i=0;i<60;i++){const x=R()*W,y=R()*H,r=60+R()*260,a=.03+R()*.06,dark=R()<.5;
    const gr=g.createRadialGradient(x,y,0,x,y,r);
    gr.addColorStop(0,dark?`rgba(${o.shade},${a})`:`rgba(255,255,255,${a})`);gr.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);}
  if(o.lines){g.strokeStyle=o.lines;g.lineWidth=1.4;for(let y=100;y<H;y+=44){g.beginPath();g.moveTo(0,y+R()*1.2);g.lineTo(W,y+R()*1.2);g.stroke()}
    g.strokeStyle='rgba(190,60,60,.35)';g.beginPath();g.moveTo(96,0);g.lineTo(96,H);g.stroke();}
  if(o.news){
    for(let col=0;col<5;col++){const x0=30+col*250;
      for(let y=120;y<H-50;y+=12){if(R()<.07)continue;const len=170+R()*40;g.fillStyle=`rgba(40,36,30,${.16+R()*.1})`;g.fillRect(x0,y,len,4.4)}}
    g.fillStyle='rgba(30,26,22,.28)';g.fillRect(30,40,1220,16);g.fillRect(30,66,620,9);
    g.fillStyle='rgba(30,26,22,.2)';g.fillRect(30,92,1220,2);}
  for(let i=0;i<1500;i++){const x=R()*W,y=R()*H,l=4+R()*16,a=R()*Math.PI;
    g.strokeStyle=R()<.5?`rgba(255,255,255,${.05+R()*.1})`:`rgba(${o.shade},${.04+R()*.09})`;
    g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();}
  if(o.ring){g.strokeStyle='rgba(90,50,20,.2)';g.lineWidth=7;g.beginPath();g.arc(o.ring[0],o.ring[1],52,0,7);g.stroke();
    g.lineWidth=2;g.strokeStyle='rgba(90,50,20,.14)';g.beginPath();g.arc(o.ring[0]+2,o.ring[1]+1,57,0.3,6);g.stroke();}
  const id=g.getImageData(0,0,W,H),d=id.data;
  for(let i=0;i<d.length;i+=4){const n=(R()-.5)*o.noise;d[i]+=n;d[i+1]+=n;d[i+2]+=n}
  g.putImageData(id,0,0);return c;
}
const BG={};
function makeBGs(){
  BG.cream=makePaper('cream','#e8dcc2',{shade:'90,60,20',noise:18,lines:'rgba(90,120,170,.28)',ring:[1130,610]});
  BG.news=makePaper('news','#cdc8ba',{shade:'40,36,30',noise:20,news:true});
  BG.kraft=makePaper('kraft','#b38d60',{shade:'60,35,10',noise:26,ring:[150,600]});
  BG.dark=makePaper('dark','#191614',{shade:'0,0,0',noise:16});
  BG.warm=makePaper('warm','#ecd3bb',{shade:'120,50,30',noise:16,ring:[1150,120]});
  BG.red=makePaper('red','#7a1812',{shade:'20,0,0',noise:22});
}
const GRAIN=[];let VIG;
function makeFX(){
  for(let k=0;k<5;k++){const c=document.createElement('canvas');c.width=640;c.height=360;const g=c.getContext('2d');const id=g.createImageData(640,360);const R=rng(900+k);
    for(let i=0;i<id.data.length;i+=4){const v=96+R()*130|0;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}
    g.putImageData(id,0,0);GRAIN.push(c)}
  VIG=document.createElement('canvas');VIG.width=W;VIG.height=H;const g=VIG.getContext('2d');
  g.translate(W/2,H/2);g.scale(1.7,1);
  const gr=g.createRadialGradient(0,0,H*.3,0,0,H*.82);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(10,6,2,.55)');
  g.fillStyle=gr;g.fillRect(-W,-H,2*W,2*H);
}

/* ---------- ransom letters ---------- */
const FONTS=[['Lora','700',''],['Lora','400','italic'],['Liberation Serif','700',''],['DejaVu Serif','700',''],['Poppins','700',''],['Liberation Sans','700',''],['TeX Gyre Bonum','700',''],['TeX Gyre Schola','700',''],['Liberation Mono','700',''],['Caladea','700',''],['GFS Baskerville','400',''],['Inter','900',''],['TeX Gyre Termes','700',''],['TeX Gyre Termes','700','italic']];
const PAL=[['#f3ead6','#1a1410'],['#fbfaf6','#111'],['#141210','#f3ead6'],['#b3261e','#f6e9d8'],['#c9a577','#2a1a0e'],['#d6d2c8','#222'],['#d9a526','#1d1408'],['#1f3b5c','#f3ead6'],['#fbfaf6','#b3261e']];
function makeWord(text,size,seedKey,dark){
  const R=rng(hash(text+'|'+seedKey));const letters=[];let total=0;
  for(const raw of text){
    if(raw===' '){total+=size*.3;letters.push({sp:size*.3});continue}
    const f=FONTS[R()*FONTS.length|0];const up=R()<.4;const ch=up?raw.toUpperCase():raw.toLowerCase();
    const fs=size*(.8+R()*.32);ctx.font=`${f[2]} ${f[1]} ${fs}px "${f[0]}"`;const mw=ctx.measureText(ch).width;
    let pi;do{pi=R()*PAL.length|0}while(dark&&pi===2);
    const bw=mw+size*.2,bh=size*(.95+R()*.2),j=size*.045;
    const pts=[[-bw/2+(R()-.5)*j*2,-bh/2+(R()-.5)*j*2],[bw/2+(R()-.5)*j*2,-bh/2+(R()-.5)*j*2],[bw/2+(R()-.5)*j*2,bh/2+(R()-.5)*j*2],[-bw/2+(R()-.5)*j*2,bh/2+(R()-.5)*j*2]];
    const adv=bw*.93;letters.push({ch,font:`${f[2]} ${f[1]} ${fs}px "${f[0]}"`,bw,bh,adv,rot:(R()-.5)*.2,dy:(R()-.5)*size*.13,bg:PAL[pi][0],fg:PAL[pi][1],pts});total+=adv;
  }
  return {text,letters,width:total,size};
}
function drawWord(w,cx,cy,sc,rot,alpha){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(sc,sc);ctx.globalAlpha=alpha;
  let x=-w.width/2;
  for(const l of w.letters){
    if(l.sp){x+=l.sp;continue}
    ctx.save();ctx.translate(x+l.bw/2,l.dy);ctx.rotate(l.rot);
    ctx.shadowColor='rgba(0,0,0,.42)';ctx.shadowBlur=9;ctx.shadowOffsetX=3;ctx.shadowOffsetY=5;
    ctx.fillStyle=l.bg;ctx.beginPath();ctx.moveTo(l.pts[0][0],l.pts[0][1]);for(let i=1;i<4;i++)ctx.lineTo(l.pts[i][0],l.pts[i][1]);ctx.closePath();ctx.fill();
    ctx.shadowColor='transparent';ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle=l.fg;ctx.font=l.font;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(l.ch,0,l.bh*.04);
    ctx.restore();x+=l.adv;
  }
  ctx.restore();
}

/* ---------- builders ---------- */
function tx(words,lines,cx,top,size,o={}){
  const dark=!!o.dark,maxW=o.maxW||540;const ws=words.map(([t,b])=>({w:makeWord(t,size,o.seed||'a',dark),beat:b}));
  let idx=0;const items=[];
  if(o.single){for(const w of ws){const s=Math.min(1,maxW/w.w.width);items.push({...w,x:cx,y:top,s,rot:(hash(w.w.text)%7-3)*.012})}}
  else{
    lines.forEach((n,li)=>{const row=ws.slice(idx,idx+n);idx+=n;const gap=size*.5;
      const tot=row.reduce((a,w)=>a+w.w.width,0)+gap*(row.length-1);const s=Math.min(1,maxW/tot);let x=cx-tot*s/2;
      const R=rng(hash(row.map(r=>r.w.text).join()));
      for(const w of row){const ww=w.w.width*s;items.push({...w,x:x+ww/2+(R()-.5)*14,y:top+li*size*1.22+size*.6+(R()-.5)*10,s,rot:(R()-.5)*.09});x+=ww+gap*s}
    });
  }
  return {type:'phrase',items,single:!!o.single};
}
const ph=(key,beat,cx,cy,w,o={})=>({type:'photo',key,beat,cx,cy,w,aspect:o.aspect,rot:o.rot||0,style:o.style||'plain',tape:o.tape!==false,bw:!!o.bw,fx:o.fx??.5,fy:o.fy??.4,zm:o.zm||1,cap:o.cap,tapeRot:o.tapeRot??-.12,washi:o.washi??(hash(key+cx)%4),clip:!!o.clip});
const scr=(kind,beat,x,y,w,h,color,o={})=>({type:'scribble',kind,beat,x,y,w,h,color,lw:o.lw||7,dur:o.dur||.32});
const typed=(text,beat,x,y,size,color,o={})=>({type:'typed',text,beat,x,y,size,color,cps:o.cps||20,font:o.font||'Liberation Mono',bold:o.bold!==false});
const script=(text,beat,x,y,size,color,o={})=>({type:'script',text,beat,x,y,size,color,rot:o.rot||0,shadow:o.shadow||'rgba(0,0,0,.35)'});
const strip=(beat,y,frames,speed)=>({type:'strip',beat,y,frames,speed});
const BL=(key,s,e,o={})=>({key,s,e,bw:!!o.bw,fx:o.fx??.5,fy:o.fy??.4,dim:o.dim??.42,zoom:o.zoom??.1});

/* ============================================================
   GAYA "CLEAN" (dipakai scene yang punya  clean:1 )
   builder: ct (kata per beat), cl (satu baris), cp (foto), cstrip (deretan foto jalan)
   ============================================================ */
const CLEAN_FONT='Lora';
function makeCleanBGs(){
  const mk=(top,bot,glow,gy)=>{const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
    const a=g.createLinearGradient(0,0,0,H);a.addColorStop(0,top);a.addColorStop(1,bot);g.fillStyle=a;g.fillRect(0,0,W,H);
    const r=g.createRadialGradient(W/2,H*gy,0,W/2,H*gy,W*.62);r.addColorStop(0,glow);r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,W,H);return c};
  BG.navy=mk('#111a27','#080b11','rgba(222,176,112,.11)',.5);
  BG.ink =mk('#1a1310','#0a0706','rgba(179,60,40,.14)',.45);
}
/* ct(words,lines,cx,top,size,opts) — sama kayak tx() tapi gaya clean.
   words: [['kata',beat],['kata',beat,{accent:1}]]  accent = emas + miring
   lines: jumlah kata per baris, mis [2,2]
   opts : single:true (satu kata tampil bergantian di tengah), end:beat (hilang di beat itu), maxW, color, accent, weight */
function ct(words,lines,cx,top,size,o={}){
  const maxW=o.maxW||1100,col=o.color||'#f3ead6',acc=o.accent||'#e0b062';
  const fnt=a=>`${a?'italic ':''}${o.weight||500} ${size}px "${CLEAN_FONT}"`;
  const ws=words.map(([text,beat,op])=>{const accent=!!(op&&op.accent);ctx.font=fnt(accent);return{text,beat,accent,font:fnt(accent),w:ctx.measureText(text).width,color:accent?acc:col}});
  const items=[];
  if(o.single){for(const w of ws){const s=Math.min(1,maxW/w.w);items.push({...w,x:cx,y:top,s})}}
  else{let idx=0;lines.forEach((n,li)=>{const row=ws.slice(idx,idx+n);idx+=n;const gap=size*.3;
    const tot=row.reduce((a,w)=>a+w.w,0)+gap*(row.length-1);const s=Math.min(1,maxW/tot);let x=cx-tot*s/2;
    for(const w of row){const ww=w.w*s;items.push({...w,x:x+ww/2,y:top+li*size*1.3+size*.6,s});x+=ww+gap*s}})}
  return{type:'cphrase',items,single:!!o.single,size,end:o.end};
}
/* cl(text,beat,x,y,size,opts) — satu baris teks. opts: italic, caps (huruf kecil lebar, font Inter), color, weight */
const cl=(text,beat,x,y,size,o={})=>({type:'cline',text,beat,x,y,size,color:o.color||'#f3ead6',italic:!!o.italic,caps:!!o.caps,weight:o.weight||(o.caps?500:400),maxW:o.maxW||1150});
/* cp(key,beat,x,y,w,h,opts) — foto bingkai tipis. opts: fx,fy (titik fokus crop 0..1), zm (zoom), cap (keterangan di bawah) */
const cp=(key,beat,x,y,w,h,o={})=>({type:'cphoto',key,beat,x,y,w,h,fx:o.fx??.5,fy:o.fy??.4,zm:o.zm||1,cap:o.cap,rot:o.rot||0});
/* cstrip(beat,y,frames,speed,h) — deretan foto berjalan pelan */
const cstrip=(beat,y,frames,speed,h=230,o={})=>({type:'cstrip',beat,y,frames,speed,h,fade:o.fade||'10,8,7'});

function cover(img,dx,dy,dw,dh,fx,fy,z){
  const A=dw/dh,a=img.width/img.height;let sw,sh;
  if(a>A){sh=img.height;sw=sh*A}else{sw=img.width;sh=sw/A}
  sw/=z;sh/=z;ctx.drawImage(img,(img.width-sw)*fx,(img.height-sh)*fy,sw,sh,dx,dy,dw,dh);
}
function drawCPhrase(ph,t){
  if(ph.end!=null&&t>=bt(ph.end))return;   // opts.end = beat kapan teks ini hilang
  if(ph.single){let cur=null;for(const w of ph.items){if(t>=bt(w.beat))cur=w}if(cur)drawCOne(cur,t);return}
  for(const w of ph.items){if(t>=bt(w.beat))drawCOne(w,t)}
}
function drawCOne(w,t){
  const age=t-bt(w.beat),p=clamp(age/.5),e=easeOutCubic(p);
  ctx.save();ctx.translate(w.x,w.y+(1-e)*20);ctx.scale(w.s*(.97+.03*e),w.s*(.97+.03*e));ctx.globalAlpha=clamp(p*1.6);
  ctx.font=w.font;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=22;ctx.shadowOffsetY=4;ctx.fillStyle=w.color;ctx.fillText(w.text,0,0);ctx.restore();
}
function drawCLine(it,t){
  const age=t-bt(it.beat);if(age<0)return;const p=clamp(age/.6),e=easeOutCubic(p);
  ctx.save();ctx.translate(it.x,it.y+(1-e)*14);ctx.globalAlpha=clamp(p*1.5);
  const fam=it.caps?'Inter':CLEAN_FONT;ctx.font=`${it.italic?'italic ':''}${it.weight} ${it.size}px "${fam}"`;
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=it.color;ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=14;ctx.shadowOffsetY=3;
  if(it.caps&&'letterSpacing' in ctx)ctx.letterSpacing=(it.size*.22)+'px';
  const m=ctx.measureText(it.text).width;if(m>it.maxW){const s=it.maxW/m;ctx.scale(s,s)}
  ctx.fillText(it.text,0,0);ctx.restore();
}
function drawCPhoto(it,t){
  const age=t-bt(it.beat);if(age<0)return;const img=IMG[it.key];
  const p=clamp(age/.45),e=easeOutCubic(p),fr=7;
  ctx.save();ctx.globalAlpha=clamp(p*1.6);ctx.translate(it.x,it.y);ctx.rotate(it.rot*Math.PI/180);const sc=.93+.07*e;ctx.scale(sc,sc);
  const w=it.w,h=it.h;
  ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=30;ctx.shadowOffsetY=10;
  ctx.fillStyle='#f4efe6';ctx.beginPath();ctx.roundRect(-w/2-fr,-h/2-fr,w+fr*2,h+fr*2+(it.cap?44:0),6);ctx.fill();
  ctx.shadowColor='transparent';
  ctx.save();ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,3);ctx.clip();
  cover(img,-w/2,-h/2,w,h,it.fx,it.fy,it.zm*(1+.06*clamp(age/6)));ctx.restore();
  if(it.cap){ctx.fillStyle='#2a2622';ctx.font='italic 400 26px "'+CLEAN_FONT+'"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(it.cap,0,h/2+fr+20)}
  ctx.restore();
}
function drawCStrip(it,t){
  const age=t-bt(it.beat);if(age<0)return;const fw=it.h*1.25,gap=22,period=fw+gap,total=it.frames.length*period;
  const base=(((age*it.speed)%total)+total)%total;
  ctx.save();ctx.globalAlpha=clamp(age/.5);
  for(let k=-1;k<3;k++)for(let i=0;i<it.frames.length;i++){
    const x=i*period-base+k*total;if(x>W||x+fw<0)continue;
    ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;ctx.fillStyle='#f4efe6';ctx.beginPath();ctx.roundRect(x-5,it.y-it.h/2-5,fw+10,it.h+10,5);ctx.fill();ctx.restore();
    ctx.save();ctx.beginPath();ctx.roundRect(x,it.y-it.h/2,fw,it.h,3);ctx.clip();cover(IMG[it.frames[i]],x,it.y-it.h/2,fw,it.h,.5,.35,1);ctx.restore();
  }
  for(const [x0,x1] of [[0,160],[W,W-160]]){const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,`rgba(${it.fade},1)`);g.addColorStop(1,`rgba(${it.fade},0)`);ctx.fillStyle=g;ctx.fillRect(Math.min(x0,x1),it.y-it.h/2-30,160,it.h+60)}
  ctx.restore();
}
/* cscroll(key,beat,x,y,w,h,opts) — foto keluar dari GULUNGAN, membuka pelan dari atas ke bawah.
   beat = mulai muncul (masih tergulung), opts.open = beat mulai membuka (default = beat), opts.dur = detik buka (default 1.1)
   opts: fx,fy,zm (crop), cap (keterangan) */
const cscroll=(key,beat,x,y,w,h,o={})=>({type:'cscroll',key,beat,open:o.open??beat,x,y,w,h,fx:o.fx??.5,fy:o.fy??.4,zm:o.zm||1,dur:o.dur||1.1,cap:o.cap});
const easeIO=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
function woodRod(cx,cy,len,r){   // batang kayu horizontal
  const g=ctx.createLinearGradient(0,cy-r,0,cy+r);g.addColorStop(0,'#3d2412');g.addColorStop(.35,'#a06a3c');g.addColorStop(.55,'#c28a55');g.addColorStop(1,'#3a2211');
  ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(cx-len/2,cy-r,len,r*2,r);ctx.fill();
  ctx.fillStyle='#2f1b0d';for(const sx of[-1,1]){ctx.beginPath();ctx.arc(cx+sx*(len/2+1),cy,r*1.15,0,7);ctx.fill();ctx.fillStyle='#7a4d28';ctx.beginPath();ctx.arc(cx+sx*(len/2+1),cy,r*.55,0,7);ctx.fill();ctx.fillStyle='#2f1b0d'}
}
function paperRoll(cx,cy,len,r){ // gulungan kertas (silinder horizontal)
  const g=ctx.createLinearGradient(0,cy-r,0,cy+r);g.addColorStop(0,'#8d7f62');g.addColorStop(.3,'#f3ead2');g.addColorStop(.55,'#fff7e2');g.addColorStop(1,'#7d6f55');
  ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(cx-len/2,cy-r,len,r*2,Math.min(r,10));ctx.fill();
  ctx.strokeStyle='rgba(90,70,40,.35)';ctx.lineWidth=1.2;for(const sx of[-1,1]){ctx.beginPath();ctx.ellipse(cx+sx*(len/2-3),cy,Math.max(2,r*.28),r*.92,0,0,7);ctx.stroke();ctx.beginPath();ctx.ellipse(cx+sx*(len/2-3),cy,Math.max(1,r*.12),r*.45,0,0,7);ctx.stroke()}
}
function drawCScroll(it,t){
  const age=t-bt(it.beat);if(age<0)return;const img=IMG[it.key];
  const ao=t-bt(it.open),raw=clamp(ao/it.dur),p=easeIO(raw),w=it.w,h=it.h;
  const amp=clamp(age/.3)*Math.exp(-Math.max(0,ao-it.dur)*4)*.03,sl=Math.sin(ao*12)*amp*(ao<0?0:1);
  const rt=7+17*(1-p),y0=-h/2,yb=y0+h*p,len=w+12;
  ctx.save();ctx.globalAlpha=clamp(age/.15);ctx.translate(it.x,it.y);
  // kertas + foto (terbuka sebagian)
  if(p>.002){
    ctx.save();ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=28;ctx.shadowOffsetY=10;ctx.fillStyle='#f1e8d2';
    ctx.beginPath();ctx.moveTo(-w/2-5,y0);ctx.lineTo(w/2+5,y0);ctx.lineTo(w/2+5,yb+sl*w/2);ctx.lineTo(-w/2-5,yb-sl*w/2);ctx.closePath();ctx.fill();ctx.restore();
    ctx.save();ctx.beginPath();ctx.moveTo(-w/2,y0);ctx.lineTo(w/2,y0);ctx.lineTo(w/2,yb+sl*w/2);ctx.lineTo(-w/2,yb-sl*w/2);ctx.closePath();ctx.clip();
    cover(img,-w/2,y0,w,h,it.fx,it.fy,it.zm*(1+.05*clamp(ao/5)));
    let g=ctx.createLinearGradient(0,y0,0,y0+46);g.addColorStop(0,'rgba(0,0,0,.45)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(-w/2,y0,w,46);
    g=ctx.createLinearGradient(0,yb-34,0,yb+8);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.4)');ctx.fillStyle=g;ctx.fillRect(-w/2,yb-34,w,50);
    ctx.restore();
  }
  // gulungan atas (mengecil saat kertas keluar) + batang bawah (jatuh membuka)
  paperRoll(0,y0-rt+5,len,rt);
  ctx.save();ctx.translate(0,yb);ctx.rotate(Math.atan(sl));woodRod(0,0,len+4,6);ctx.restore();
  if(it.cap&&raw>=1){ctx.globalAlpha*=clamp((ao-it.dur)/.4);ctx.fillStyle='#f3ead6';ctx.font='italic 400 26px "'+CLEAN_FONT+'"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(it.cap,0,yb+34)}
  ctx.restore();
}
/* partikel debu emas (dust:1) dan cincin denyut tiap 2 beat (rings:1) — hanya scene clean */
function drawDust(t,col='235,190,110'){
  const n=Math.floor((t-B0)/P),ph0=t<B0?1:(t-bt(n))/P,pulse=Math.exp(-ph0*7),R=rng(777);
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=0;i<46;i++){const x0=R()*W,y0=R()*H,sz=1.5+R()*4,sp=8+R()*26,ph=R()*6.28;
    const x=x0+Math.sin(t*.6+ph)*22,y=((y0-t*sp)%H+H)%H,a=(.14+.22*(.5+.5*Math.sin(t*1.3+ph)))+pulse*.35*(sz/5.5),r=sz*(1+pulse*.9);
    const g=ctx.createRadialGradient(x,y,0,x,y,r*3);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*3,0,7);ctx.fill()}
  ctx.restore();
}
function drawRings(t,sc){
  ctx.save();ctx.strokeStyle='#e0b062';ctx.lineWidth=2;
  for(let b=sc.s;b<sc.e;b+=2){const age=t-bt(b);if(age<0||age>1.4)continue;ctx.globalAlpha=.28*(1-age/1.4);ctx.beginPath();ctx.arc(W/2,H/2,60+age*520,0,7);ctx.stroke()}
  ctx.restore();
}

/* ---------- drawing ---------- */
function drawBleed(b,t){
  const img=IMG[b.key];const age=t-bt(b.s),dur=bt(b.e)-bt(b.s);
  const z=1+b.zoom*clamp(Math.floor(age*12)/12/dur);
  const A=W/H,a=img.width/img.height;let sw,sh;
  if(a>A){sh=img.height;sw=sh*A}else{sw=img.width;sh=sw/A}
  sw/=z;sh/=z;const sx=(img.width-sw)*b.fx,sy=(img.height-sh)*b.fy;
  ctx.save();if(b.bw)ctx.filter='grayscale(1) contrast(1.1)';
  ctx.drawImage(img,sx,sy,sw,sh,0,0,W,H);ctx.restore();
  ctx.fillStyle=`rgba(12,8,5,${b.dim})`;ctx.fillRect(0,0,W,H);
}
const WASHI=[['rgba(232,214,160,.8)','rgba(255,255,255,.0)'],['rgba(238,160,172,.82)','rgba(255,255,255,.4)'],['rgba(160,205,170,.82)','rgba(255,255,255,.4)'],['rgba(150,185,225,.82)','rgba(255,255,255,.4)']];
function drawPhoto(it,t){
  const age=t-bt(it.beat);if(age<0)return;
  const img=IMG[it.key];const p=clamp(age/.2),e=easeOutBack(p);
  const sc=1+(1-e)*.38,rot=it.rot*Math.PI/180+(1-e)*.16;
  const stp=Math.floor(t*12),R=rng(hash(it.key+it.beat)+stp);
  const jx=(R()-.5)*3,jy=(R()-.5)*3,jr=(R()-.5)*.012;
  const A=it.aspect||(img.width/img.height);const pw=it.w,phh=pw/A;
  const bd=it.style==='polaroid'?14:9,bot=it.style==='polaroid'?(it.cap?58:46):9;
  const cw=pw+bd*2,ch=phh+bd+bot;
  const a=img.width/img.height;let sw,sh;
  if(a>A){sh=img.height;sw=sh*A}else{sw=img.width;sh=sw/A}
  const z=(it.zm||1)*(1+.06*clamp(age/4));sw/=z;sh/=z;
  const sx=(img.width-sw)*it.fx,sy=(img.height-sh)*it.fy;
  ctx.save();ctx.globalAlpha=clamp(age/.05);
  ctx.translate(it.cx+jx,it.cy+jy);ctx.rotate(rot+jr);ctx.scale(sc,sc);
  ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=26;ctx.shadowOffsetX=6;ctx.shadowOffsetY=12;
  ctx.fillStyle='#f6f1e6';ctx.fillRect(-cw/2,-ch/2,cw,ch);
  ctx.shadowColor='transparent';
  if(it.bw)ctx.filter='grayscale(1) contrast(1.08)';
  ctx.drawImage(img,sx,sy,sw,sh,-cw/2+bd,-ch/2+bd,pw,phh);ctx.filter='none';
  ctx.fillStyle='rgba(110,80,40,.07)';ctx.fillRect(-cw/2+bd,-ch/2+bd,pw,phh);
  if(it.cap){ctx.fillStyle='#2a2622';ctx.font='italic 400 34px "TeX Gyre Chorus"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(it.cap,0,ch/2-30)}
  if(it.tape){const w=WASHI[it.washi%4];ctx.save();ctx.translate(0,-ch/2+2);ctx.rotate(it.tapeRot);
    ctx.fillStyle=w[0];ctx.beginPath();const tw=118,th=34;
    ctx.moveTo(-tw/2,-th/2);for(let i=0;i<=4;i++)ctx.lineTo(-tw/2+(i%2?-3:3),-th/2+i*th/4);
    ctx.lineTo(tw/2,th/2);for(let i=4;i>=0;i--)ctx.lineTo(tw/2+(i%2?3:-3),-th/2+i*th/4);ctx.closePath();ctx.fill();
    if(w[1]!=='rgba(255,255,255,.0)'){ctx.save();ctx.clip();ctx.strokeStyle=w[1];ctx.lineWidth=5;for(let x=-tw;x<tw;x+=14){ctx.beginPath();ctx.moveTo(x,-th);ctx.lineTo(x+th*2,th);ctx.stroke()}ctx.restore()}
    ctx.restore()}
  if(it.clip){ctx.strokeStyle='#8f949a';ctx.lineWidth=4;ctx.lineJoin='round';ctx.beginPath();ctx.roundRect(cw/2-60,-ch/2-26,26,64,12);ctx.stroke();
    ctx.beginPath();ctx.roundRect(cw/2-54,-ch/2-14,14,56,7);ctx.stroke()}
  ctx.restore();
}
function drawPhrase(ph,t){
  if(ph.single){let cur=null;for(const w of ph.items){if(t>=bt(w.beat))cur=w}if(cur)drawOne(cur,t);return}
  for(const w of ph.items){if(t>=bt(w.beat))drawOne(w,t)}
}
function drawOne(w,t){
  const age=t-bt(w.beat);const p=clamp(age/.16),e=easeOutBack(p);
  const sc=w.s*(1+(1-e)*.5);const stp=Math.floor(t*12);const R=rng(hash(w.w.text)+stp);
  drawWord(w.w,w.x+(R()-.5)*2.4,w.y+(R()-.5)*2.4,sc,w.rot+(1-e)*.14+(R()-.5)*.012,clamp(p*5));
}
function drawScribble(it,t){
  const age=t-bt(it.beat);if(age<0)return;const p=clamp(age/it.dur);
  const R=rng(hash(it.kind+it.beat+it.x));
  ctx.save();ctx.strokeStyle=it.color;ctx.fillStyle=it.color;ctx.lineWidth=it.lw;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.shadowColor='rgba(0,0,0,.3)';ctx.shadowBlur=4;ctx.shadowOffsetY=2;
  const pop=easeOutBack(clamp(age/.2));
  if(it.kind==='underline'){const n=30;ctx.beginPath();const k=Math.floor(p*n);for(let i=0;i<=k;i++){const x=it.x-it.w/2+i/n*it.w,y=it.y+Math.sin(i*.9)*it.h*.3+(R()-.5)*3;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
  else if(it.kind==='arrow'){const n=30;ctx.beginPath();const k=Math.floor(p*n);let lx,ly;for(let i=0;i<=k;i++){const u=i/n;const x=it.x-it.w/2+u*it.w,y=it.y+Math.sin(u*Math.PI)*-it.h*.5;lx=x;ly=y;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
    if(p>.95){ctx.beginPath();ctx.moveTo(lx-30,ly-28);ctx.lineTo(lx+4,ly+2);ctx.lineTo(lx-34,ly+22);ctx.stroke()}}
  else if(it.kind==='star'){ctx.translate(it.x,it.y);ctx.rotate(.3+(1-pop)*1.2);ctx.scale(pop,pop);
    ctx.beginPath();for(let i=0;i<16;i++){const r=i%2?it.w*.28:it.w*.5,a=i/16*Math.PI*2;i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill()}
  else if(it.kind==='sparkle'){ctx.translate(it.x,it.y);ctx.rotate((1-pop)*1.5+Math.sin(t*3+it.x)*.1);ctx.scale(pop,pop);const r=it.w/2;
    ctx.beginPath();ctx.moveTo(0,-r);ctx.quadraticCurveTo(0,0,r,0);ctx.quadraticCurveTo(0,0,0,r);ctx.quadraticCurveTo(0,0,-r,0);ctx.quadraticCurveTo(0,0,0,-r);ctx.fill()}
  else if(it.kind==='heart'){ctx.translate(it.x,it.y);ctx.rotate(-.2+(1-pop)*.8);const s=pop*(1+.06*Math.sin(t*8));ctx.scale(s,s);const r=it.w/2;
    ctx.beginPath();ctx.moveTo(0,r*.9);ctx.bezierCurveTo(-r*1.6,-r*.1,-r*.7,-r*1.2,0,-r*.4);ctx.bezierCurveTo(r*.7,-r*1.2,r*1.6,-r*.1,0,r*.9);ctx.fill()}
  ctx.restore();
}
function drawTyped(it,t){
  const age=t-bt(it.beat);if(age<0)return;const n=Math.min(it.text.length,Math.floor(age*it.cps));
  const s=it.text.slice(0,n);const caret=(n<it.text.length||age<it.text.length/it.cps+.8)&&Math.floor(age*3)%2===0?'▌':'';
  ctx.save();ctx.font=`${it.bold?'700':'400'} ${it.size}px "${it.font}"`;ctx.fillStyle=it.color;ctx.textBaseline='middle';
  const full=ctx.measureText(it.text).width;ctx.textAlign='left';ctx.fillText(s+caret,it.x-full/2,it.y);ctx.restore();
}
function drawScript(it,t){
  const age=t-bt(it.beat);if(age<0)return;const p=clamp(age/.18),e=easeOutBack(p);
  ctx.save();ctx.translate(it.x,it.y);ctx.rotate(it.rot+(1-e)*.12);const s=1+(1-e)*.5;ctx.scale(s,s);ctx.globalAlpha=clamp(p*5);
  ctx.font=`italic 400 ${it.size}px "TeX Gyre Chorus"`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.shadowColor=it.shadow;ctx.shadowBlur=8;ctx.shadowOffsetX=3;ctx.shadowOffsetY=4;ctx.fillStyle=it.color;ctx.fillText(it.text,0,0);ctx.restore();
}
function drawStrip(it,t){
  const age=t-bt(it.beat);if(age<0)return;const fw=300,gap=26,period=fw+gap,total=it.frames.length*period;
  const off=Math.floor(age*12)/12*it.speed;const bandH=360;
  ctx.save();ctx.translate(W/2,it.y);ctx.rotate(-.02);
  ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=24;ctx.shadowOffsetY=10;ctx.fillStyle='#0b0a09';ctx.fillRect(-W,-bandH/2,W*2,bandH);ctx.shadowColor='transparent';
  const base=((off%total)+total)%total;
  for(let k=-1;k<3;k++)for(let i=0;i<it.frames.length;i++){
    const x=-W/2+i*period-base+k*total;if(x>W||x+fw<-W)continue;
    const key=it.frames[i];const img=IMG[key];const bw=key.startsWith('bw');
    const sy=(img.height-img.width)*.32;ctx.drawImage(img,0,sy,img.width,img.width,x,-fw/2,fw,fw);
    if(!bw){ctx.fillStyle='rgba(120,70,30,.12)';ctx.fillRect(x,-fw/2,fw,fw)}
  }
  ctx.fillStyle='rgba(240,232,212,.92)';
  for(let x=-W;x<W;x+=46){const xx=x-(off%46);for(const yy of[-bandH/2+14,bandH/2-40]){ctx.beginPath();ctx.roundRect(xx,yy,24,26,5);ctx.fill()}}
  ctx.restore();
}function drawConfetti(t,mode){
  const R=rng(4242);const cols=['#b3261e','#d9a526','#1f3b5c','#fbfaf6','#c9a577'];const age=t-bt(64);
  ctx.save();
  for(let i=0;i<80;i++){
    const x0=R()*W,y0=R()*H,sp=50+R()*110,r0=R()*6,sz=6+R()*9,a=R()*Math.PI*2,v=300+R()*800;const c=cols[i%5];
    let x,y;
    if(mode==='burst'){if(age<0||age>2.2)continue;x=W/2+Math.cos(a)*v*age;y=H/2+Math.sin(a)*v*age+900*age*age}
    else{x=x0+Math.sin(t*2+i)*24;y=(y0+t*sp)%H}
    ctx.save();ctx.translate(x,y);ctx.rotate(r0+t*(2+i%3));ctx.fillStyle=c;ctx.globalAlpha=mode==='burst'?clamp(1-age/2.2):.85;ctx.fillRect(-sz/2,-sz/4,sz,sz/2);ctx.restore();
  }
  ctx.restore();
}

/* ---------- frame ---------- */
function sceneAt(t){let cur=0;SC.forEach((s,i)=>{if(t>=bt(s.s))cur=i});return cur}
function renderFrame(t){
  const si=sceneAt(t),sc=SC[si],cln=!!sc.clean||!!sc.desk;
  const n=Math.floor((t-B0)/P);const ph0=t<B0?1:(t-bt(n))/P;const pulse=Math.exp(-ph0*7);
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='none';ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  ctx.save();
  const z=1+pulse*sc.amp;ctx.translate(W/2,H/2);
  const dropAge=t-bt(64);const shk=(dropAge>=0&&dropAge<.5)?(1-dropAge/.5)*16:(sc.amp>.02?pulse*3:0);
  const SR=rng(Math.floor(t*24)*7+3);ctx.translate((SR()-.5)*shk,(SR()-.5)*shk);ctx.scale(z,z);ctx.translate(-W/2,-H/2);
  if(sc.desk){drawDesk(sc,t)}else{
  ctx.drawImage(BG[sc.bg],0,0);
  if(cln&&sc.rings)drawRings(t,sc);
  if(cln&&sc.dust)drawDust(t);
  if(sc.bleeds)for(const b of sc.bleeds){if(t>=bt(b.s)&&t<bt(b.e))drawBleed(b,t)}   // (bleed foto-per-beat sudah tidak dipakai di scenes.js)
  for(const it of sc.items){
    if(it.type==='photo')drawPhoto(it,t);else if(it.type==='phrase')drawPhrase(it,t);else if(it.type==='scribble')drawScribble(it,t);
    else if(it.type==='typed')drawTyped(it,t);else if(it.type==='script')drawScript(it,t);else if(it.type==='strip')drawStrip(it,t);
    else if(it.type==='cphrase')drawCPhrase(it,t);else if(it.type==='cline')drawCLine(it,t);else if(it.type==='cphoto')drawCPhoto(it,t);else if(it.type==='cstrip')drawCStrip(it,t);else if(it.type==='cscroll')drawCScroll(it,t);
  }
  if(sc.confetti)drawConfetti(t,sc.confetti);
  }
  ctx.restore();
  if(t>=bt(64)&&t<bt(112)&&!cln){const R=rng(n*13+1);const x=R()<.5?0:W,y=R()*H*.6;const gr=ctx.createRadialGradient(x,y,0,x,y,620);
    ctx.save();ctx.globalCompositeOperation='screen';gr.addColorStop(0,`rgba(255,120,60,${.32*pulse})`);gr.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);ctx.restore()}
  const sa=t-bt(sc.s);const big=sc.s===64;const fd=cln?.32:(big?.3:.14),fa=cln?.2:(big?.9:.5);
  if(!sc.desk&&sa>=0&&sa<fd&&sc.s>0){ctx.fillStyle=`rgba(255,250,235,${fa*(1-sa/fd)})`;ctx.fillRect(0,0,W,H)}
  const stp=Math.floor(t*24),GR=rng(stp*31+5);
  ctx.save();ctx.globalCompositeOperation='overlay';ctx.globalAlpha=cln?.16:.34;
  ctx.drawImage(GRAIN[stp%5],-(GR()*40|0),-(GR()*40|0),W+40,H+40);ctx.restore();
  if(!cln){const DR=rng(Math.floor(t*12)*17+9);ctx.save();
    for(let i=0;i<20;i++){const x=DR()*W,y=DR()*H,r=.6+DR()*1.6;ctx.fillStyle=DR()<.5?'rgba(255,255,255,.55)':'rgba(10,8,5,.5)';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
    if(DR()<.3){const x=DR()*W;ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+(DR()-.5)*8,H);ctx.stroke()}
    ctx.restore()}
  drawDeskFlash(t);
  ctx.drawImage(VIG,0,0);
  if(t<.25){ctx.fillStyle=`rgba(0,0,0,${1-t/.25})`;ctx.fillRect(0,0,W,H)}
  if(t>DUR-1.4){const a=clamp((t-(DUR-1.4))/1.4);ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.fillRect(0,0,W,H)}
}
window.renderFrame=renderFrame;
window.grab=(t)=>{renderFrame(t);return cv.toDataURL('image/jpeg',0.93)};
