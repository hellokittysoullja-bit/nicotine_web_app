import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let p = await (await b.newContext({ viewport:{width:1200,height:630}, deviceScaleFactor:1 })).newPage();
await p.goto('file://'+process.cwd()+'/v8.html',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
await p.addStyleTag({content:'.hint,.actions,.lead{display:none!important}.copy{align-self:center}'});
await p.waitForTimeout(5200); await p.screenshot({path:'assets/og.png'});
for (const s of [512,192,180]) { p = await (await b.newContext({ viewport:{width:512,height:512}, deviceScaleFactor:s/512 })).newPage();
  await p.goto('file://'+process.cwd()+'/icon-src.html'); await p.screenshot({path:`assets/icon-${s}.png`}); }
await b.close();
