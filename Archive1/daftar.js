// Bikin foto/daftar.json (cadangan kalau folder foto/ nggak bisa dibaca otomatis). Jalankan: node daftar.js
const fs=require('fs');const l=fs.readdirSync('foto').filter(n=>/\.(jpe?g|png|webp|avif)$/i.test(n)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
fs.writeFileSync('foto/daftar.json',JSON.stringify(l,null,1));console.log(l.length+' foto ->foto/daftar.json');
