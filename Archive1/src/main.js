/* ---------- start: load gambar + font, bangun scene ---------- */
const FONT_LOAD=[...FONTS.map(f=>`${f[2]} ${f[1]} 20px "${f[0]}"`),'italic 400 20px "TeX Gyre Chorus"','700 20px "Liberation Mono"','500 20px "Lora"','italic 500 20px "Lora"','italic 400 20px "Lora"','500 20px "Inter"'];
const SF=(window.CONFIG||{}).scriptFont;
if(SF){const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+encodeURIComponent(SF).replace(/%20/g,'+')+'&display=swap';document.head.appendChild(l);FONT_LOAD.push('20px "'+SF+'"')}
const Q=new URLSearchParams(location.search);
const BIKIN=Q.has('bikin'),DEBUG=Q.has('debug');          // ?bikin=1 -> render mp4 lewat termux.js | ?debug=1 -> slider + nomor beat
if(DEBUG)document.body.classList.add('debug');
if(BIKIN)document.body.classList.add('bikin');
window.ready=(async()=>{
  await Promise.all([...KEYS.map(loadImg),loadPool()]);
  await Promise.race([Promise.all(FONT_LOAD.map(f=>document.fonts.load(f).catch(()=>{}))),new Promise(r=>setTimeout(r,6000))]);
  buildScenes();   // dibangun SETELAH font siap (ukuran huruf dihitung di sini)
  makeBGs();makeCleanBGs();makeDesk();makeFX();renderFrame(2.3);return true;
})();

/* ---------- player: murni video. ketuk layar = putar / jeda ---------- */
const aud=document.getElementById('aud'),go=document.getElementById('go'),stage=document.getElementById('stage'),seek=document.getElementById('seek'),clock=document.getElementById('clock');
let ready=false,playing=false,pending=false,clockMode=false,t0=0,base=0,pausedAt=0,raf=0;
aud.src='lagu.m4a';
const nowT=()=>clockMode?base+(performance.now()-t0)/1000:aud.currentTime-START;
const showClock=t=>{if(!DEBUG)return;seek.value=t;clock.textContent='t '+t.toFixed(2)+'s | beat '+((t-B0)/P).toFixed(1)+' (scene '+(sceneAt(t)+1)+'/'+SC.length+')'};
function stop(t){playing=false;cancelAnimationFrame(raf);aud.pause();pausedAt=t;go.classList.remove('hide')}
function tick(){
  if(!playing)return;
  const t=aud.ended?DUR:Math.max(0,nowT());
  if(t>=DUR){renderFrame(DUR-.01);stop(0);return}
  renderFrame(t);showClock(t);raf=requestAnimationFrame(tick);
}
async function start(from){
  cancelAnimationFrame(raf);playing=true;clockMode=false;go.classList.add('hide');
  try{aud.currentTime=START+from}catch(e){}
  try{await aud.play()}catch(e){clockMode=true;base=from;t0=performance.now()}   // audio ditolak browser -> tetap jalan tanpa suara
  raf=requestAnimationFrame(tick);
}
function toggle(){
  if(BIKIN)return;
  if(!ready){pending=true;return}
  if(playing)stop(nowT());else start(pausedAt);
}
window.ready.then(()=>{ready=true;go.classList.add('on');showClock(2.3);if(pending){pending=false;start(0)}});
stage.addEventListener('click',toggle);
addEventListener('keydown',e=>{
  if(e.code==='Space'||e.key==='Enter'){e.preventDefault();toggle()}
  else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():stage.requestFullscreen&&stage.requestFullscreen()}
});
seek.addEventListener('input',()=>{stop(+seek.value);renderFrame(+seek.value);showClock(+seek.value)});

/* ---------- mode bikin video di Termux: ?bikin=1 (jalankan: node termux.js) ---------- */
async function bikinVideo(){
  const prog=document.getElementById('prog'),say=m=>prog.innerHTML=m;
  const fps=+Q.get('fps')||30,qual=+Q.get('q')||.92,from=+Q.get('from')||0,to=Math.min(+Q.get('to')||DUR,DUR),n=Math.round((to-from)*fps);
  try{
    try{if(navigator.wakeLock)await navigator.wakeLock.request('screen')}catch(e){}
    say('menyiapkan ffmpeg...');
    let r=await fetch('/mulai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({fps,from,to,start:START})});
    if(!r.ok)throw new Error(await r.text());
    const t00=performance.now();
    for(let i=0;i<n;i++){
      renderFrame(from+i/fps);
      const blob=await new Promise(res=>cv.toBlob(res,'image/jpeg',qual));
      r=await fetch('/frame',{method:'POST',body:blob});if(!r.ok)throw new Error(await r.text());
      if(i%10===0){const el=(performance.now()-t00)/1000,sisa=i?el/i*(n-i):0;say(`membuat video: frame ${i}/${n} (${Math.round(i/n*100)}%)<br>sisa sekitar ${Math.ceil(sisa/60)} menit<br><b>jangan tutup tab / matikan layar</b>`)}
    }
    say('menggabungkan lagu + video...');
    r=await fetch('/selesai',{method:'POST'});const j=await r.json();if(!r.ok||j.error)throw new Error(j.error||'gagal');
    say('SELESAI ✔<br>'+j.file+(j.salinan?'<br>salinan: '+j.salinan:''));
  }catch(e){say('GAGAL: '+e.message+'<br>cek terminal Termux')}
}
if(BIKIN)window.ready.then(bikinVideo);
