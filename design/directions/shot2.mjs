import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const sizes = { desk:{width:1440,height:900}, mob:{width:390,height:844} };
const errs = [];
for (const [f, click] of [['v2-a-plain-pack.html','#p-pouch'],['v2-b-0147.html','#n2']]) {
  for (const [k, vp] of Object.entries(sizes)) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2 });
    const p = await ctx.newPage(); p.on('console', m => m.type()==='error' && errs.push(f+': '+m.text())); p.on('pageerror', e => errs.push(f+': '+e.message));
    await p.clock.install({ time: new Date('2026-10-14T01:47:00') });
    await p.goto('file://' + process.cwd() + '/' + f, { waitUntil: 'networkidle' });
    await p.clock.resume(); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(3600);
    const base = f.replace('.html','') + '-' + k;
    await p.screenshot({ path: base + '.png' });
    const ow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    await p.click(click); await p.waitForTimeout(1200);
    await p.screenshot({ path: base + '-tap.png', fullPage: k === 'mob' });
    console.log(base, 'overflowX:', ow);
    await ctx.close();
  }
}
console.log('errors:', errs.length ? errs : 'none');
await b.close();
