import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport:{width:1440,height:900}})).newPage();
for (const f of process.argv.slice(2)) { await p.goto('file://'+process.cwd()+'/'+f,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
 const r = await p.evaluate(async()=>{const out={};for(const el of document.querySelectorAll('h1,.big,.nick,.time,.count,.btn')){const fam=getComputedStyle(el).fontFamily.split(',')[0].replace(/"/g,'');out[fam]=await document.fonts.check(`16px "${fam}"`,'Привет');}return out});
 console.log(f, JSON.stringify(r)); }
await b.close();
