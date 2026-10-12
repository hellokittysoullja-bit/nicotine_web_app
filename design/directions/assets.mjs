import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let p = await (await b.newContext({ viewport:{width:1200,height:630} })).newPage();
await p.goto('file://'+process.cwd()+'/assets-src.html',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.screenshot({path:'assets/og.png'});
for (const s of [512,192,180]) { p = await (await b.newContext({ viewport:{width:512,height:512}, deviceScaleFactor:s/512 })).newPage();
  await p.goto('file://'+process.cwd()+'/icon-src.html'); await p.screenshot({path:`assets/icon-${s}.png`}); }
await b.close();
