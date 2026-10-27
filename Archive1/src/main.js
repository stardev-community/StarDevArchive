/* ---------- start: load gambar + font, bangun scene ---------- */
const FONT_LOAD=[...FONTS.map(f=>`${f[2]} ${f[1]} 20px "${f[0]}"`),'italic 400 20px "TeX Gyre Chorus"','700 20px "Liberation Mono"','500 20px "Lora"','italic 500 20px "Lora"','italic 400 20px "Lora"','500 20px "Inter"'];
const SF=(window.CONFIG||{}).scriptFont;
if(SF){const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+encodeURIComponent(SF).replace(/%20/g,'+')+'&display=swap';document.head.appendChild(l);FONT_LOAD.push('20px "'+SF+'"')}
const RENDER=/render=1/.test(location.search);if(RENDER)document.body.classList.add('render');
window.ready=(async()=>{
  await Promise.all([...KEYS.map(loadImg),loadPool()]);
  await Promise.race([Promise.all(FONT_LOAD.map(f=>document.fonts.load(f).catch(()=>{}))),new Promise(r=>setTimeout(r,6000))]);
  buildScenes();   // dibangun SETELAH font siap (ukuran huruf dihitung di sini)
  makeBGs();makeCleanBGs();makeDesk();makeFX();renderFrame(1.0);return true;
})();

/* ---------- player ---------- */
const aud=document.getElementById('aud'),btn=document.getElementById('play'),fin=document.getElementById('f'),msg=document.getElementById('msg'),seek=document.getElementById('seek'),clock=document.getElementById('clock');
let hasAudio=true,playing=false,t0=0,raf=0;
aud.src='lagu.m4a';
const showClock=t=>{seek.value=t;clock.textContent='t '+t.toFixed(2)+'s | beat '+((t-B0)/P).toFixed(1)+'  (scene '+(sceneAt(t)+1)+'/'+SC.length+')'};
window.ready.then(()=>{btn.disabled=false;renderFrame(1.0);showClock(1.0)});
fin.addEventListener('change',()=>{const f=fin.files[0];if(!f)return;aud.src=URL.createObjectURL(f);hasAudio=true;msg.textContent='Lagu siap: '+f.name});
seek.addEventListener('input',()=>{playing=false;cancelAnimationFrame(raf);aud.pause();btn.textContent='Putar';const t=+seek.value;renderFrame(t);showClock(t)});
function tick(){
  if(!playing)return;
  let t;
  if(hasAudio&&!aud.paused)t=aud.currentTime-START;else t=(performance.now()-t0)/1000;
  if(t>=DUR){playing=false;aud.pause();btn.textContent='Putar lagi';renderFrame(DUR-.01);return}
  t=Math.max(0,t);renderFrame(t);showClock(t);raf=requestAnimationFrame(tick);
}
btn.addEventListener('click',async()=>{
  cancelAnimationFrame(raf);playing=true;btn.textContent='Ulang';t0=performance.now();
  if(hasAudio){aud.currentTime=START;try{await aud.play();}catch(e){msg.textContent='Browser menolak memutar audio.'}}
  raf=requestAnimationFrame(tick);
});
