#!/usr/bin/env node
/* Render project -> mp4 (1280x720, 30fps)
   Perlu: node, ffmpeg, dan  npm i playwright && npx playwright install chromium
   (atau pakai Chrome/Chromium sendiri:  CHROME_PATH=/path/ke/chrome node render.js ...)

   node render.js --audio lagu.mp3 --out hasil.mp4
   opsi:  --start 0      offset di file lagu (default 0, lagu.m4a sudah terpotong)
          --from 36 --to 54.6   render sebagian aja (buat cek cepat)
          --fps 30   --crf 20
          --frames dir   simpan juga frame jpg (opsional)                                  */
const http=require('http'),fs=require('fs'),path=require('path'),{spawn}=require('child_process');
let pw;try{pw=require('playwright')}catch(e){try{pw=require('playwright-core')}catch(e2){console.error('Install dulu: npm i playwright && npx playwright install chromium');process.exit(1)}}
const a=process.argv.slice(2),opt=(k,d)=>{const i=a.indexOf('--'+k);return i>=0?a[i+1]:d};
const AUDIO=opt('audio','lagu.m4a'),START=+opt('start',0),FPS=+opt('fps',30),CRF=opt('crf','20'),OUT=opt('out','cerita_kecil_kita.mp4'),FRAMES=opt('frames',null);
const ROOT=__dirname,MIME={'.html':'text/html','.js':'text/javascript','.jpg':'image/jpeg','.ttf':'font/ttf','.otf':'font/otf','.png':'image/png','.webp':'image/webp','.json':'application/json'};
const srv=http.createServer((q,r)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]==='/'?'/index.html':q.url.split('?')[0]));
  if(!f.startsWith(ROOT)||!fs.existsSync(f)){r.writeHead(404);return r.end()}
  if(fs.statSync(f).isDirectory()){r.writeHead(200,{'content-type':'text/html'});return r.end(fs.readdirSync(f).map(n=>`<a href="${encodeURIComponent(n)}">${n}</a>`).join('\n'))}
  r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)});
(async()=>{
  await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port;
  const br=await pw.chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH,args:['--no-sandbox']}:{});
  const pg=await br.newPage({viewport:{width:1280,height:720}});
  pg.on('pageerror',e=>console.error('page error:',e.message));
  await pg.goto(`http://127.0.0.1:${port}/index.html?render=1`);await pg.evaluate(()=>window.ready);
  const DUR=await pg.evaluate(()=>DUR),from=+opt('from',0),to=Math.min(+opt('to',DUR),DUR);
  const n=Math.round((to-from)*FPS);
  const args=['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-'];
  if(AUDIO)args.push('-ss',String(START+from),'-t',String(to-from),'-i',AUDIO);
  args.push('-map','0:v');if(AUDIO)args.push('-map','1:a','-af',`afade=t=out:st=${Math.max(0,to-from-1.4)}:d=1.4`,'-c:a','aac','-b:a','192k');
  args.push('-c:v','libx264','-preset','veryfast','-crf',CRF,'-pix_fmt','yuv420p','-r',String(FPS),'-shortest',OUT);
  const ff=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});
  if(FRAMES)fs.mkdirSync(FRAMES,{recursive:true});
  for(let i=0;i<n;i++){
    const t=from+i/FPS;const d=await pg.evaluate(t=>window.grab(t),t);const buf=Buffer.from(d.split(',')[1],'base64');
    if(FRAMES)fs.writeFileSync(path.join(FRAMES,'f'+String(i).padStart(5,'0')+'.jpg'),buf);
    if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
    if(i%60===0)process.stdout.write(`\rframe ${i}/${n}`);
  }
  ff.stdin.end();await new Promise(r=>ff.on('close',r));await br.close();srv.close();console.log(`\rselesai -> ${OUT}`);
})();
