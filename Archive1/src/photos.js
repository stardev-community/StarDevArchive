/* ============================================================
   PHOTOS — ambil daftar foto di folder foto/ (GitHub atau lokal)
   dan simpan di POOL. Scene gaya meja (beat 80+) ngambil foto dari
   sini secara berurutan: slot 0,1,2,... dan muter kalau foto kurang.
   Biasanya TIDAK perlu diedit. Atur lewat config.js.
   ============================================================ */
const POOL=[];            // key gambar di IMG: 'p0','p1',...
const POOL_NAMES=[];      // nama file asli (buat info/debug)
const slot=i=>POOL.length?POOL[((i%POOL.length)+POOL.length)%POOL.length]:KEYS[((i%KEYS.length)+KEYS.length)%KEYS.length];

function shrinkImg(img,max=1500){
  const m=Math.max(img.naturalWidth||img.width,img.naturalHeight||img.height);
  if(m<=max)return img;
  const k=max/m,c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
  c.getContext('2d').drawImage(img,0,0,c.width,c.height);return c;
}
const BWC=new WeakMap();
function bwOf(img){   // versi hitam-putih (di-cache)
  let c=BWC.get(img);if(c)return c;
  c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');
  if('filter' in g){g.filter='grayscale(1) contrast(1.08) brightness(1.03)';g.drawImage(img,0,0);g.filter='none'}
  else{g.drawImage(img,0,0);const d=g.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){const v=p[i]*.3+p[i+1]*.59+p[i+2]*.11;p[i]=p[i+1]=p[i+2]=v}g.putImageData(d,0,0)}
  BWC.set(img,c);return c;
}

async function listPhotoFiles(){
  const C=window.CONFIG||{},folder=C.folder||'foto',branch=C.branch||'main';
  const isImg=n=>/\.(jpe?g|png|webp|avif)$/i.test(n);
  const nat=(a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true});
  const host=location.protocol==='file:'?'file':location.hostname;
  const LOCAL=(typeof RENDER!=='undefined'&&RENDER)||C.source==='local'||(C.source!=='github'&&/^(file|localhost|127\.|192\.168\.|10\.|\[::1\])/.test(host));
  const raw=n=>`https://raw.githubusercontent.com/${C.repo}/${branch}/${folder}/${encodeURIComponent(n)}`;
  const viaGithub=async()=>{
    if(!C.repo)return[];
    const KEY='ckk_list_'+C.repo+branch+folder;
    try{
      const r=await fetch(`https://api.github.com/repos/${C.repo}/contents/${folder}?ref=${branch}`);
      if(!r.ok)throw 0;const j=await r.json();
      const l=j.filter(f=>f.type==='file'&&isImg(f.name)).map(f=>({name:f.name,url:raw(f.name)}));
      try{localStorage.setItem(KEY,JSON.stringify(l))}catch(e){}return l;
    }catch(e){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e2){return[]}}   // limit API habis -> pakai daftar terakhir
  };
  const viaDir=async()=>{   // python3 -m http.server menampilkan isi folder sebagai halaman HTML
    try{const r=await fetch(folder+'/');if(!r.ok)return[];const h=await r.text();
      const out=[];h.replace(/href="([^"?#]+)"/g,(m,a)=>{const n=decodeURIComponent(a.split('/').pop());if(isImg(n))out.push({name:n,url:folder+'/'+encodeURIComponent(n)})});return out}catch(e){return[]}
  };
  const viaManifest=async()=>{   // foto/daftar.json = ["a.jpg","b.jpg"]  (dibuat otomatis: node daftar.js)
    try{const r=await fetch(folder+'/daftar.json');if(!r.ok)return[];const j=await r.json();return j.filter(isImg).map(n=>({name:n,url:folder+'/'+encodeURIComponent(n)}))}catch(e){return[]}
  };
  for(const fn of(LOCAL?[viaDir,viaManifest,viaGithub]:[viaGithub,viaManifest,viaDir])){
    const l=await fn();if(l.length)return l.sort(nat).slice(0,80);
  }
  return[];
}
async function loadPool(){
  const files=await listPhotoFiles();
  const res=await Promise.all(files.map(f=>new Promise(r=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>r({f,i});i.onerror=()=>r(null);i.src=f.url})));
  res.filter(Boolean).forEach(({f,i})=>{const k='p'+POOL.length;IMG[k]=shrinkImg(i);POOL.push(k);POOL_NAMES.push(f.name)});
  console.log('[foto] dimuat dari folder foto/:',POOL.length?POOL_NAMES.join(', '):'(kosong -> pakai foto bawaan img/)');
}
