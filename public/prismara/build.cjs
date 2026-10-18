// Package only public game files; deployment excludes tests and workspace helpers.
const fs=require('node:fs'),path=require('node:path');
const root=__dirname,dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});
fs.copyFileSync(path.join(root,'index.html'),path.join(dist,'index.html'));
for(const folder of ['js','css','assets','webfonts'])fs.cpSync(path.join(root,folder),path.join(dist,folder),{recursive:true});
fs.writeFileSync(path.join(dist,'_headers'),'/*\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n');
console.log('Packaged Prismara public assets in '+dist);
