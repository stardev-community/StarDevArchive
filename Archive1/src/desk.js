/* ============================================================
   DESK — gaya "meja flat-lay" (dilihat dari atas), dipakai scene
   yang punya  desk:{...}  di scenes.js  (mulai beat 80 / detik ~36)
   Biasanya TIDAK perlu diedit; yang diedit: src/scenes.js

   Builder (dipakai di scenes.js, koordinat = koordinat MEJA, bukan layar;
   titik (0,0) = tengah meja, kamera menentukan bagian mana yang kelihatan):
     dp(slot,beat,x,y,lebar,{rot,aspect,fx,fy,zm,cap,bw})   polaroid / foto berbingkai putih
     dnb(beat,x,y,lebar,tinggi,{rot})                        buku spiral
     dnews(beat,x,y,lebar,tinggi,{rot,head,slot})            koran
     dpen(beat,x,y,panjang,{rot})   dleaf(beat,x,y,ukuran,{rot,tone:'orange'|'brown'|'olive'})
     dvinyl(beat,x,y,diameter)      ddand(beat,x,y,ukuran,{rot})  (dandelion)
     dtx([['kata',beat,{red:1,circle:1}],...],[kata per baris],x,y,ukuran,{rot,color,dur})
        -> tulisan tangan "nulis" dari kiri ke kanan; red = merah, circle = dilingkari
   ============================================================ */
const DW=2600,DH=1700;
const DESK={};
const CFGD=()=>window.CONFIG||{};
const SCRIPT_FAM=()=>{const c=CFGD();return (c.scriptFont?`"${c.scriptFont}",`:'')+'"TeX Gyre Chorus",cursive'};
const SCRIPT_SCALE=()=>CFGD().scriptFont?(CFGD().scriptScale||1):1;

/* ---------- tekstur meja ---------- */
function makeWood(mood){
  const c=document.createElement('canvas');c.width=DW;c.height=DH;const g=c.getContext('2d');
  const R=rng(hash('wood'+mood)),warm=mood==='warm';
  const base=warm?[196,150,100]:[92,92,95],ph=236;
  for(let y=0;y<DH;y+=ph){
    const v=(R()-.5)*(warm?30:24);
    g.fillStyle=`rgb(${base[0]+v|0},${base[1]+v|0},${base[2]+v|0})`;g.fillRect(0,y,DW,ph);
    for(let k=0;k<170;k++){
      const yy=y+R()*ph,x0=R()*DW,len=200+R()*1000,dark=R()<.55;
      g.strokeStyle=dark?`rgba(${warm?'80,44,16':'0,0,0'},${.05+R()*.13})`:`rgba(255,255,255,${.03+R()*.08})`;
      g.lineWidth=.6+R()*1.8;g.beginPath();g.moveTo(x0,yy);
      for(let s=1;s<=6;s++)g.lineTo(x0+len*s/6,yy+Math.sin(s*1.3+k)*3+(R()-.5)*1.6);
      g.stroke();
    }
    if(R()<.65){const kx=R()*DW,ky=y+40+R()*(ph-80);for(let r=4;r<34;r+=5){g.strokeStyle=`rgba(${warm?'70,38,12':'0,0,0'},${.16-r/300})`;g.lineWidth=2;g.beginPath();g.ellipse(kx,ky,r*1.9,r*.8,0,0,7);g.stroke()}}
    g.fillStyle='rgba(0,0,0,.5)';g.fillRect(0,y,DW,3);g.fillStyle='rgba(255,255,255,.07)';g.fillRect(0,y+3,DW,2);
  }
  for(let i=0;i<9000;i++){g.fillStyle=R()<.5?'rgba(255,255,255,.05)':'rgba(0,0,0,.06)';g.fillRect(R()*DW,R()*DH,1+R()*2,1+R()*2)}
  const gr=g.createRadialGradient(DW/2,DH/2,200,DW/2,DH/2,DW*.62);gr.addColorStop(0,'rgba(255,255,255,.05)');gr.addColorStop(1,'rgba(0,0,0,.22)');g.fillStyle=gr;g.fillRect(0,0,DW,DH);
  return c;
}
function leafShape(q,x,y,len,wd,ang){q.save();q.translate(x,y);q.rotate(ang);q.beginPath();q.moveTo(-len/2,0);q.quadraticCurveTo(0,-wd,len/2,0);q.quadraticCurveTo(0,wd,-len/2,0);q.fill();q.restore()}
function makeLeafShadow(){   // bayangan ranting + daun
  const c=document.createElement('canvas');c.width=DW;c.height=DH;const t=document.createElement('canvas');t.width=DW;t.height=DH;
  const q=t.getContext('2d'),R=rng(31);q.fillStyle=q.strokeStyle='rgba(14,7,2,.66)';
  const br=[[DW*.98,-40,DW*.46,DH*.58],[DW*1.03,DH*.34,DW*.60,DH*.98],[DW*.58,-60,DW*.14,DH*.40],[DW*.08,DH*1.02,DW*.34,DH*.62]];
  for(const[x0,y0,x1,y1]of br){
    const mx=(x0+x1)/2+90,my=(y0+y1)/2-130;q.lineWidth=13;q.beginPath();q.moveTo(x0,y0);q.quadraticCurveTo(mx,my,x1,y1);q.stroke();
    const base=Math.atan2(y1-y0,x1-x0);
    for(let i=0;i<30;i++){const u=i/30,px=(1-u)*(1-u)*x0+2*u*(1-u)*mx+u*u*x1,py=(1-u)*(1-u)*y0+2*u*(1-u)*my+u*u*y1;
      for(const side of[-1,1]){if(R()<.22)continue;const ang=base+side*(.65+R()*.8),len=90+R()*110,wd=28+R()*36;
        leafShape(q,px+Math.cos(ang)*len*.5,py+Math.sin(ang)*len*.5,len,wd,ang)}}
  }
  const g=c.getContext('2d');g.filter='blur(3px)';g.drawImage(t,0,0);g.filter='none';return c;
}
function makeWindowShadow(){   // bayangan jendela 2x2 miring
  const t=document.createElement('canvas');t.width=DW;t.height=DH;const q=t.getContext('2d');
  q.fillStyle='rgba(4,4,7,.68)';q.fillRect(0,0,DW,DH);q.globalCompositeOperation='destination-out';q.fillStyle='#000';
  q.translate(DW*.5,DH*.48);q.rotate(-.62);const pw=600,ph=540,gap=74;
  for(let i=0;i<2;i++)for(let j=0;j<2;j++)q.fillRect(-pw-gap/2+i*(pw+gap),-ph-gap/2+j*(ph+gap),pw,ph);
  const c=document.createElement('canvas');c.width=DW;c.height=DH;const g=c.getContext('2d');g.filter='blur(7px)';g.drawImage(t,0,0);g.filter='none';return c;
}
function makeDesk(){DESK.warm=makeWood('warm');DESK.grey=makeWood('grey');DESK.leaf=makeLeafShadow();DESK.window=makeWindowShadow()}

/* ---------- builder ---------- */
const rotPt=(cx,cy,lx,ly,deg)=>{const a=deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return[cx+lx*c-ly*s,cy+lx*s+ly*c]};
const dp=(sl,beat,x,y,w,o={})=>({type:'dpol',key:slot(sl),beat,x,y,w,rot:o.rot||0,aspect:o.aspect||1,fx:o.fx??.5,fy:o.fy??.35,zm:o.zm||1,cap:o.cap,bw:o.bw});
const dnb=(beat,x,y,w,h,o={})=>({type:'dnb',beat,x,y,w,h,rot:o.rot||0});
const dnews=(beat,x,y,w,h,o={})=>({type:'dnews',beat,x,y,w,h,rot:o.rot||0,head:o.head||'KORAN KITA',key:slot(o.slot??0),sub:o.sub||''});
const dpen=(beat,x,y,len,o={})=>({type:'dpen',beat,x,y,len,rot:o.rot||0});
const dleaf=(beat,x,y,s,o={})=>({type:'dleaf',beat,x,y,s,rot:o.rot||0,tone:o.tone||'orange'});
const dvinyl=(beat,x,y,d)=>({type:'dvinyl',beat,x,y,d});
const ddand=(beat,x,y,s,o={})=>({type:'ddand',beat,x,y,s,rot:o.rot||0});
function dtx(words,lines,x,y,size,o={}){
  const sz=size*SCRIPT_SCALE(),fnt=`${sz}px ${SCRIPT_FAM()}`;ctx.font=fnt;
  const ws=words.map(([text,beat,op])=>({text,beat,w:ctx.measureText(text).width,red:!!(op&&op.red),circle:!!(op&&op.circle),cb:op&&op.cb,color:op&&op.color}));
  const gap=sz*.3,lh=sz*1.05;let idx=0;const out=[];
  const nl=lines.length;
  lines.forEach((n,li)=>{const row=ws.slice(idx,idx+n);idx+=n;const tot=row.reduce((a,w)=>a+w.w,0)+gap*(row.length-1);let lx=-tot/2;
    for(const w of row){w.lx=lx+w.w/2;w.ly=(li-(nl-1)/2)*lh;lx+=w.w+gap;out.push(w)}});
  return{type:'dtx',x,y,rot:o.rot||0,size:sz,font:fnt,color:o.color||'#f7f0e1',dur:o.dur||.5,words:out,shade:o.shade||'rgba(0,0,0,.5)'};
}
/* deskScene: s,e = beat; mood 'warm'|'grey'; cam:[[x,y,zoom,derajat],[x,y,zoom,derajat]] */
const deskScene=(s,e,mood,cam,items,o={})=>({s,e,bg:'dark',desk:{mood,cam,shadow:o.shadow||(mood==='warm'?'leaf':'window'),dim:o.dim||0,tint:o.tint||null},dust:o.dust??1,amp:o.amp??.004,flash:o.flash??1,confetti:o.confetti,items});

/* ---------- gambar ---------- */
function land(it,t,dur=.3){
  const age=t-bt(it.beat);if(age<0)return null;const p=clamp(age/dur),e=easeOutCubic(p);
  return{age,p,e,sc:1+.15*(1-e),al:clamp(p*2.6),sb:9+30*(1-e),so:4+16*(1-e)};
}
function placeIt(it,L,rx=0){
  ctx.translate(it.x,it.y);ctx.rotate((it.rot||0)*Math.PI/180+(1-L.e)*.05);ctx.scale(L.sc,L.sc);ctx.globalAlpha=L.al;
  ctx.shadowColor='rgba(0,0,0,.52)';ctx.shadowBlur=L.sb;ctx.shadowOffsetX=2;ctx.shadowOffsetY=L.so;
}
function drawDPol(it,t,sc){
  const L=land(it,t);if(!L)return;const img0=IMG[it.key];if(!img0)return;
  const bw=it.bw??((CFGD().deskBW!==false)&&sc.desk.mood==='grey'),img=bw?bwOf(img0):img0;
  const pw=it.w,phh=pw/it.aspect,bd=Math.max(9,pw*.05),bot=it.cap?pw*.2:bd,cw=pw+bd*2,ch=phh+bd+bot;
  ctx.save();placeIt(it,L);
  ctx.fillStyle='#f3f1eb';ctx.fillRect(-cw/2,-ch/2,cw,ch);ctx.shadowColor='transparent';
  const gx=-pw/2,gy=-ch/2+bd;
  ctx.save();ctx.beginPath();ctx.rect(gx,gy,pw,phh);ctx.clip();cover(img,gx,gy,pw,phh,it.fx,it.fy,it.zm*(1+.05*clamp(L.age/6)));
  const sh=ctx.createLinearGradient(gx,gy,gx,gy+phh);sh.addColorStop(0,'rgba(0,0,0,.16)');sh.addColorStop(.12,'rgba(0,0,0,0)');sh.addColorStop(.88,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.14)');ctx.fillStyle=sh;ctx.fillRect(gx,gy,pw,phh);ctx.restore();
  ctx.strokeStyle='rgba(0,0,0,.28)';ctx.lineWidth=1.6;ctx.strokeRect(gx,gy,pw,phh);
  ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=1.2;ctx.strokeRect(-cw/2+.6,-ch/2+.6,cw-1.2,ch-1.2);
  if(it.cap){ctx.fillStyle='#2a2622';ctx.font=`${pw*.1*SCRIPT_SCALE()}px ${SCRIPT_FAM()}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(it.cap,0,ch/2-bot/2)}
  ctx.restore();
}
function drawDNb(it,t){
  const L=land(it,t);if(!L)return;const w=it.w,h=it.h;ctx.save();placeIt(it,L);
  ctx.fillStyle='#f5f3ed';ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,8);ctx.fill();ctx.shadowColor='transparent';
  const g=ctx.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,'rgba(0,0,0,.10)');g.addColorStop(.12,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.05)');ctx.fillStyle=g;ctx.fillRect(-w/2,-h/2,w,h);
  ctx.strokeStyle='rgba(110,125,150,.2)';ctx.lineWidth=1.3;for(let y=-h/2+86;y<h/2-26;y+=38){ctx.beginPath();ctx.moveTo(-w/2+38,y);ctx.lineTo(w/2-20,y);ctx.stroke()}
  for(let y=-h/2+26;y<h/2-14;y+=30){
    ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(-w/2+14,y,6.5,4.6,0,0,7);ctx.fill();
    ctx.lineCap='round';ctx.strokeStyle='#17171a';ctx.lineWidth=5.2;ctx.beginPath();ctx.moveTo(-w/2-13,y+4);ctx.quadraticCurveTo(-w/2-4,y-12,-w/2+17,y-2);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-w/2-9,y+1.5);ctx.quadraticCurveTo(-w/2-3,y-8,-w/2+10,y-3);ctx.stroke();
  }
  ctx.restore();
}
function drawDNews(it,t){
  const L=land(it,t);if(!L)return;const w=it.w,h=it.h,R=rng(hash(it.head+it.x));ctx.save();placeIt(it,L);
  ctx.fillStyle='#e7e1d1';ctx.fillRect(-w/2,-h/2,w,h);ctx.shadowColor='transparent';
  const g=ctx.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(120,90,40,.12)');ctx.fillStyle=g;ctx.fillRect(-w/2,-h/2,w,h);
  const ink='rgba(30,26,22,.78)',x0=-w/2+24,iw=w-48;ctx.fillStyle=ink;ctx.textAlign='center';ctx.textBaseline='middle';
  let fs=w*.095;ctx.font=`700 ${fs}px "Liberation Serif"`;const mw=ctx.measureText(it.head).width;if(mw>iw){fs*=iw/mw;ctx.font=`700 ${fs}px "Liberation Serif"`}ctx.fillText(it.head,0,-h/2+w*.095);
  ctx.fillRect(x0,-h/2+w*.17,iw,3);ctx.fillRect(x0,-h/2+w*.17+7,iw,1.2);
  if(it.sub){ctx.font=`400 ${w*.034}px "Liberation Mono"`;ctx.fillText(it.sub,0,-h/2+w*.225)}
  const py=-h/2+w*.27,pw=iw*.56,ph=h*.27,img=IMG[it.key];
  if(img){ctx.save();ctx.beginPath();ctx.rect(x0,py,pw,ph);ctx.clip();cover(bwOf(img),x0,py,pw,ph,.5,.35,1);ctx.fillStyle='rgba(150,115,60,.2)';ctx.fillRect(x0,py,pw,ph);ctx.restore();ctx.strokeStyle=ink;ctx.lineWidth=1.4;ctx.strokeRect(x0,py,pw,ph)}
  for(let i=0;i<4;i++){ctx.fillStyle=ink;ctx.fillRect(x0+pw+16,py+4+i*17,iw-pw-16-(i%2)*18,i?5:9)}
  const cy=py+ph+22,cw=(iw-28)/3;ctx.fillStyle='rgba(30,26,22,.4)';
  for(let c=0;c<3;c++)for(let y=cy;y<h/2-26;y+=9.5){if(R()<.06)continue;ctx.fillRect(x0+c*(cw+14),y,cw*(.82+R()*.18),3.6)}
  ctx.restore();
}
function drawDPen(it,t){
  const L=land(it,t);if(!L)return;const n=it.len;ctx.save();placeIt(it,L);ctx.lineCap='round';
  const g=ctx.createLinearGradient(0,-9,0,9);g.addColorStop(0,'#3a3a3f');g.addColorStop(.35,'#0c0c0e');g.addColorStop(1,'#000');
  ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(-n/2,-9,n*.78,18,9);ctx.fill();ctx.shadowColor='transparent';
  ctx.fillStyle='#c9a455';ctx.fillRect(-n/2+n*.2,-9.5,7,19);ctx.fillRect(-n/2+n*.52,-9.5,5,19);
  ctx.fillRect(-n/2+n*.06,-7,n*.2,3.4);
  ctx.fillStyle='#17171a';ctx.beginPath();ctx.moveTo(n*.28,-8);ctx.lineTo(n/2,0);ctx.lineTo(n*.28,8);ctx.closePath();ctx.fill();
  ctx.fillStyle='#d6b565';ctx.beginPath();ctx.moveTo(n*.4,-3.6);ctx.lineTo(n/2,0);ctx.lineTo(n*.4,3.6);ctx.closePath();ctx.fill();
  ctx.restore();
}
const LEAFC={orange:['#e0892b','#9c4a12'],brown:['#9a5a2a','#5a2c10'],olive:['#9a8a3a','#5a4a18']};
function drawDLeaf(it,t){
  const L=land(it,t,.4);if(!L)return;const s=it.s,c=LEAFC[it.tone]||LEAFC.orange;ctx.save();placeIt(it,L);
  const g=ctx.createLinearGradient(-s*.6,-s,s*.6,s);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(0,-s);ctx.bezierCurveTo(s*.95,-s*.35,s*.8,s*.55,0,s);ctx.bezierCurveTo(-s*.8,s*.55,-s*.95,-s*.35,0,-s);ctx.fill();ctx.shadowColor='transparent';
  ctx.strokeStyle='rgba(60,25,5,.55)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,-s*.95);ctx.lineTo(0,s*1.08);ctx.stroke();
  ctx.lineWidth=1;for(let k=-3;k<=3;k++){if(!k)continue;ctx.beginPath();ctx.moveTo(0,k*s*.2+s*.1);ctx.lineTo(Math.sign(k)*s*.5,k*s*.2-s*.12);ctx.stroke();ctx.beginPath();ctx.moveTo(0,k*s*.2+s*.1);ctx.lineTo(-Math.sign(k)*s*.5,k*s*.2-s*.12);ctx.stroke()}
  ctx.restore();
}
function drawDVinyl(it,t){
  const L=land(it,t,.45);if(!L)return;const r=it.d/2;ctx.save();placeIt({x:it.x,y:it.y,rot:0},L);
  ctx.fillStyle='#0b0b0c';ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.shadowColor='transparent';
  ctx.strokeStyle='rgba(255,255,255,.055)';ctx.lineWidth=1;for(let k=r*.4;k<r-4;k+=4){ctx.beginPath();ctx.arc(0,0,k,0,7);ctx.stroke()}
  const sh=ctx.createConicGradient?ctx.createConicGradient(.6,0,0):null;if(sh){sh.addColorStop(0,'rgba(255,255,255,.0)');sh.addColorStop(.1,'rgba(255,255,255,.12)');sh.addColorStop(.25,'rgba(255,255,255,0)');sh.addColorStop(.6,'rgba(255,255,255,0)');sh.addColorStop(.75,'rgba(255,255,255,.1)');sh.addColorStop(.9,'rgba(255,255,255,0)');ctx.fillStyle=sh;ctx.beginPath();ctx.arc(0,0,r-2,0,7);ctx.fill()}
  ctx.fillStyle='#a8452c';ctx.beginPath();ctx.arc(0,0,r*.3,0,7);ctx.fill();ctx.fillStyle='#e9d9b8';ctx.beginPath();ctx.arc(0,0,r*.06,0,7);ctx.fill();
  ctx.restore();
}
function drawDDand(it,t){
  const L=land(it,t,.5);if(!L)return;const s=it.s,R=rng(77);ctx.save();placeIt(it,L);ctx.lineCap='round';
  ctx.strokeStyle='rgba(235,235,225,.9)';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(s*.8,s*.9,s*1.9,s*1.1);ctx.stroke();ctx.shadowColor='transparent';
  for(let i=0;i<70;i++){const a=R()*Math.PI*2,l=s*(.7+R()*.35);ctx.strokeStyle=`rgba(255,255,250,${.5+R()*.4})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*l,Math.sin(a)*l);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(Math.cos(a)*l,Math.sin(a)*l,2,0,7);ctx.fill()}
  ctx.fillStyle='rgba(230,230,220,.9)';ctx.beginPath();ctx.arc(0,0,s*.14,0,7);ctx.fill();
  ctx.restore();
}
function drawDTx(it,t){
  ctx.save();ctx.translate(it.x,it.y);ctx.rotate(it.rot*Math.PI/180);ctx.font=it.font;ctx.textBaseline='middle';ctx.textAlign='center';ctx.lineCap='round';
  for(const w of it.words){
    const age=t-bt(w.beat);if(age<0)continue;const p=easeOutCubic(clamp(age/it.dur));
    const col=w.red?'#d3262d':(w.color||it.color);
    ctx.save();ctx.translate(w.lx,w.ly);
    ctx.beginPath();ctx.rect(-w.w/2-10,-it.size,(w.w+20)*p,it.size*2.2);ctx.clip();
    ctx.shadowColor=it.shade;ctx.shadowBlur=w.red?5:9;ctx.shadowOffsetY=2;ctx.fillStyle=col;ctx.fillText(w.text,0,0);ctx.restore();
    if(w.circle){
      const ca=t-(w.cb!=null?bt(w.cb):bt(w.beat)+it.dur+.12),q=clamp(ca/.55);
      if(q>0){ctx.save();ctx.translate(w.lx,w.ly);ctx.rotate(-.07);ctx.strokeStyle='#d3262d';ctx.lineWidth=Math.max(3,it.size*.034);ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=4;
        const rx=w.w*.6+it.size*.2,ry=it.size*.58,N=64,tot=Math.PI*2.28;ctx.beginPath();
        for(let i=0;i<=N;i++){const s=i/N*easeOutCubic(q),ang=-Math.PI*.62+s*tot,k=1+.04*Math.sin(ang*2.3)+s*.07;const x=Math.cos(ang)*rx*k,y=Math.sin(ang)*ry*k;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
        ctx.stroke();ctx.restore()}
    }
  }
  ctx.restore();
}
function drawDeskItem(it,t,sc){
  switch(it.type){
    case'dpol':return drawDPol(it,t,sc);case'dnb':return drawDNb(it,t);case'dnews':return drawDNews(it,t);case'dpen':return drawDPen(it,t);
    case'photo':case'phrase':case'scribble':case'typed':case'script':{   // item gaya lama: koordinat layar 1280x720 (tengah meja = tengah layar)
      ctx.save();ctx.translate(-W/2,-H/2);
      if(it.type==='photo')drawPhoto(it,t);else if(it.type==='phrase')drawPhrase(it,t);else if(it.type==='scribble')drawScribble(it,t);else if(it.type==='typed')drawTyped(it,t);else drawScript(it,t);
      ctx.restore();return}
    case'dleaf':return drawDLeaf(it,t);case'dvinyl':return drawDVinyl(it,t);case'ddand':return drawDDand(it,t);case'dtx':return drawDTx(it,t);
  }
}

/* ---------- kamera + adegan ---------- */
function drawDesk(sc,t){
  const d=sc.desk,dur=bt(sc.e)-bt(sc.s),u=clamp((t-bt(sc.s))/dur);
  const e=.5*u+.5*(u*u*(3-2*u)),a=d.cam[0],b=d.cam[1],L=i=>a[i]+(b[i]-a[i])*e;
  const cx=L(0)+Math.sin(t*.9)*5,cy=L(1)+Math.cos(t*.7)*4,z=L(2),r=(L(3)+Math.sin(t*.55)*.2)*Math.PI/180;
  ctx.save();ctx.translate(W/2,H/2);ctx.rotate(r);ctx.scale(z,z);ctx.translate(-cx,-cy);
  ctx.drawImage(DESK[d.mood],-DW/2,-DH/2);
  if(d.tint){ctx.save();ctx.globalCompositeOperation='multiply';ctx.fillStyle=d.tint;ctx.fillRect(-DW/2,-DH/2,DW,DH);ctx.restore()}
  if(d.dim){ctx.fillStyle=`rgba(4,3,3,${d.dim})`;ctx.fillRect(-DW/2,-DH/2,DW,DH)}
  for(const it of sc.items)drawDeskItem(it,t,sc);
  ctx.save();ctx.translate(Math.sin(t*.45)*18,Math.cos(t*.38)*11);ctx.rotate(Math.sin(t*.6)*.004);ctx.drawImage(DESK[d.shadow],-DW/2,-DH/2);ctx.restore();
  ctx.restore();
  if(sc.dust)drawDust(t,d.mood==='grey'?'235,235,240':'240,200,130');
  if(sc.confetti)drawConfetti(t,sc.confetti);
}
/* light-leak putih-oranye di tiap pergantian scene desk */
function drawDeskFlash(t){
  let f=0,side=0;
  SC.forEach((sc,i)=>{if(!sc.desk)return;const ts=bt(sc.s),dt=t-ts;
    let v=0;if(dt<0)v=Math.pow(clamp(1-(-dt)/.2),2);else v=Math.pow(clamp(1-dt/.85),1.7);v*=(sc.flash??1);
    if(v>f){f=v;side=i%2}});
  if(f<=.003)return;
  const x0=side?W*.95:W*.05,y0=H*.22;
  ctx.save();ctx.globalCompositeOperation='screen';
  const g=ctx.createRadialGradient(x0,y0,0,x0,y0,W*.95);g.addColorStop(0,`rgba(255,255,255,${f})`);g.addColorStop(.3,`rgba(255,222,184,${f*.88})`);g.addColorStop(1,`rgba(255,140,90,${f*.38})`);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(f>.65){ctx.fillStyle=`rgba(255,248,236,${(f-.65)/.35*.92})`;ctx.fillRect(0,0,W,H)}
  ctx.restore();
}
