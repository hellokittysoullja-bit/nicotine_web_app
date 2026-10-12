import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1.5 })).newPage();
for (const f of process.argv.slice(2)) {
  await p.goto('file://' + process.cwd() + '/' + f, { waitUntil:'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const fams = await p.evaluate(() => [...document.fonts].filter(x=>x.status==='loaded').map(x=>x.family).join(','));
  await p.screenshot({ path: f.replace('.html','.png') }); console.log(f, 'fonts:', fams);
}
await b.close();
