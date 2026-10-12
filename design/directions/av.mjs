import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:3 })).newPage();
await p.goto('file://'+process.cwd()+'/v7-sky.html'); await p.waitForTimeout(5200);
await (await p.$('.thread')).screenshot({path:'v7-thread.png'}); await b.close();
