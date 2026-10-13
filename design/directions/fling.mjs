import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/v7-sky.html'); await p.waitForTimeout(5300);
await p.click('#break'); for (const t of [150,350,700]) { await p.waitForTimeout(t===150?150:t-(t===350?150:350)); await p.screenshot({path:`v7-fling-${t}.png`}); }
console.log(errs); await b.close();
