const fs=require('fs'),p=require('path');const S=p.join(__dirname,'..','src');
let h=fs.readFileSync(p.join(S,'page.html'),'utf8');
const rep=(k,f)=>{h=h.split('{{'+k+'}}').join(fs.readFileSync(p.join(S,f),'utf8').trim());};
rep('STYLE','style.css');rep('APP','app.js');rep('CALC','calc.js');
fs.writeFileSync(p.join(__dirname,'..','index.html'),h);console.log('built index.html',h.length,'bytes');
