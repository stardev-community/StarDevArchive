#!/usr/bin/env node
/* ============================================================
   TERMUX — bikin video mp4 langsung di HP (tanpa playwright / laptop)
   Server kecil + ffmpeg. Browser HP kamu yang menggambar tiap frame,
   server ini yang menyusunnya jadi mp4 bareng lagu.m4a.

   Persiapan (sekali):   pkg install nodejs ffmpeg
   Jalankan:             node termux.js            (atau: bash bikin-video.sh)
   Lalu buka di Chrome:  http://localhost:8000/?bikin=1
   Hasil:                cerita_kecil_kita.mp4  (+ disalin ke folder Download kalau bisa)

   Pilihan di link:  &fps=24  &q=.85  &from=36 &to=54.6   (render sebagian buat cek)
   Biar tab tetap hidup: biarkan layar nyala & Chrome tetap di depan sampai SELESAI.
   Cuma mau lihat (preview) tanpa bikin video?  buka  http://localhost:8000/
   ============================================================ */
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn,spawnSync}=require('child_process');
const PORT=+process.env.PORT||8000,ROOT=__dirname,OUT=path.join(ROOT,process.env.OUT||'cerita_kecil_kita.mp4'),AUDIO=path.join(ROOT,'lagu.m4a');
const MIME={'.html':'text/html;charset=utf-8','.js':'text/javascript','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.otf':'font/otf','.m4a':'audio/mp4','.mp3':'audio/mpeg','.mp4':'video/mp4','.css':'text/css'};
let ff=null,ffErr='',ffDone=null;

function serve(q,r){
  const u=decodeURIComponent(q.url.split('?')[0]),f=path.join(ROOT,u==='/'?'index.html':u);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)){r.writeHead(404);return r.end()}
  const st=fs.statSync(f);
  if(st.isDirectory()){r.writeHead(200,{'content-type':'text/html'});return r.end(fs.readdirSync(f).map(n=>`<a href="${encodeURIComponent(n)}">${n}</a>`).join('\n'))}
  const h={'content-type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream','accept-ranges':'bytes','cache-control':'no-store'},m=/bytes=(\d*)-(\d*)/.exec(q.headers.range||'');
  if(m){const a=m[1]?+m[1]:0,b=m[2]?+m[2]:st.size-1;h['content-range']=`bytes ${a}-${b}/${st.size}`;h['content-length']=b-a+1;r.writeHead(206,h);return fs.createReadStream(f,{start:a,end:b}).pipe(r)}
  h['content-length']=st.size;r.writeHead(200,h);fs.createReadStream(f).pipe(r);
}
const body=q=>new Promise(res=>{const c=[];q.on('data',d=>c.push(d));q.on('end',()=>res(Buffer.concat(c)))});
const json=(r,code,o)=>{r.writeHead(code,{'content-type':'application/json'});r.end(JSON.stringify(o))};

async function mulai(q,r){
  const o=JSON.parse((await body(q)).toString()||'{}'),fps=o.fps||30,from=o.from||0,to=o.to,start=o.start||0,dur=to-from;
  try{fs.unlinkSync(OUT)}catch(e){}
  const a=['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-'];
  const hasA=fs.existsSync(AUDIO);
  if(hasA)a.push('-ss',String(start+from),'-t',String(dur),'-i',AUDIO);
  a.push('-map','0:v');if(hasA)a.push('-map','1:a','-af',`afade=t=out:st=${Math.max(0,dur-1.4)}:d=1.4`,'-c:a','aac','-b:a','192k');
  a.push('-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-r',String(fps),'-movflags','+faststart','-shortest',OUT);
  ffErr='';ff=spawn('ffmpeg',a,{stdio:['pipe','ignore','pipe']});
  ff.stderr.on('data',d=>ffErr+=d);
  ffDone=new Promise(res=>{ff.on('error',e=>{ffErr='ffmpeg tidak ketemu — jalankan: pkg install ffmpeg';res(1)});ff.on('close',c=>res(c))});
  ff.stdin.on('error',()=>{});
  await new Promise(res=>setTimeout(res,300));
  if(ff.exitCode!==null||ffErr.includes('tidak ketemu')){return json(r,500,{error:ffErr||'ffmpeg gagal mulai'})}
  console.log(`\nmulai: ${dur.toFixed(1)} detik @ ${fps}fps  (${hasA?'+ lagu.m4a':'tanpa lagu'})`);
  json(r,200,{ok:1});
}
async function frame(q,r){
  if(!ff||ff.exitCode!==null)return json(r,500,{error:'ffmpeg tidak jalan: '+ffErr});
  const b=await body(q);const ok=ff.stdin.write(b);
  if(!ok)await new Promise(res=>ff.stdin.once('drain',res));
  frame.n=(frame.n||0)+1;if(frame.n%60===0)process.stdout.write(`\rframe ${frame.n}`);
  json(r,200,{ok:1});
}
async function selesai(q,r){
  if(!ff)return json(r,500,{error:'belum mulai'});
  ff.stdin.end();const code=await ffDone;frame.n=0;
  if(code!==0||!fs.existsSync(OUT))return json(r,500,{error:'ffmpeg gagal: '+ffErr.slice(-300)});
  let salinan='';
  for(const d of [path.join(os.homedir(),'storage','downloads'),'/sdcard/Download','/storage/emulated/0/Download']){
    try{if(fs.existsSync(d)){fs.copyFileSync(OUT,path.join(d,path.basename(OUT)));salinan=path.join(d,path.basename(OUT));break}}catch(e){}
  }
  console.log(`\n\nSELESAI -> ${OUT}${salinan?'\nsalinan  -> '+salinan:'\n(biar muncul di galeri/Download: jalankan sekali  termux-setup-storage  lalu ulangi)'}`);
  json(r,200,{file:path.basename(OUT),salinan});
}
http.createServer(async(q,r)=>{
  try{
    if(q.method==='POST'&&q.url==='/mulai')return await mulai(q,r);
    if(q.method==='POST'&&q.url==='/frame')return await frame(q,r);
    if(q.method==='POST'&&q.url==='/selesai')return await selesai(q,r);
    serve(q,r);
  }catch(e){json(r,500,{error:String(e&&e.message||e)})}
}).listen(PORT,'127.0.0.1',()=>{
  const url=`http://localhost:${PORT}/?bikin=1`;
  console.log(`Server jalan.\n  bikin video : ${url}\n  preview     : http://localhost:${PORT}/\n(Ctrl+C untuk berhenti)`);
  try{spawnSync('termux-open-url',[url],{stdio:'ignore'})}catch(e){}   // kalau termux-api ada, Chrome kebuka sendiri
});
