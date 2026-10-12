import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2 });
const p = await ctx.newPage(); await p.goto('file://'+process.cwd()+'/v7-sky.html'); await p.waitForTimeout(1900);
await p.screenshot({path:'v7-typing.png', clip:{x:0,y:100,width:390,height:300}});
await p.click('#break'); await p.waitForTimeout(1600);
const c2 = await b.newContext({ viewport:{width:1440,height:900} }); const q = await c2.newPage(); await q.goto('file://'+process.cwd()+'/v7-sky.html'); await q.waitForTimeout(500); await q.click('#break'); await q.waitForTimeout(1700); await q.screenshot({path:'v7-free-desk.png'});
await b.close();
