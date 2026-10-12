import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 })).newPage();
await p.goto('file://'+process.cwd()+'/v7-sky.html'); await p.waitForTimeout(5200);
await p.screenshot({path:'v7-cloudcrop.png', clip:{x:680,y:120,width:760,height:460}}); await b.close();
