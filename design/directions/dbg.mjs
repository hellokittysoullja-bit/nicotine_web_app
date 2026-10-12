import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
let moves=0; await p.exposeFunction('cnt',()=>moves++);
await p.goto('file://'+process.cwd()+'/v5-sky-live.html'); await p.waitForTimeout(2500);
await p.evaluate(()=>document.getElementById('hero').addEventListener('pointermove',()=>window.cnt()));
console.log('before', await p.evaluate(()=>window.__smog));
for (let y=250;y<=700;y+=40){ await p.mouse.move(820,y); await p.mouse.move(1380,y,{steps:14}); }
console.log('after', await p.evaluate(()=>window.__smog), 'moves seen', moves);
console.log('target at 1100,450:', await p.evaluate(()=>{const e=document.elementFromPoint(1100,450);return e.tagName+'.'+e.className}));
await b.close();
