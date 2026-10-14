import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const scheme = process.argv[2] || 'light', out = process.argv[3] || 'ser', H = +(process.argv[4] || 844);
const ctx = await b.newContext({ viewport: { width: 390, height: H }, deviceScaleFactor: 1, colorScheme: scheme, hasTouch: true });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + process.cwd() + '/v9.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500);
await p.screenshot({ path: `${out}-${scheme}-0first.png` });
await p.click('#break'); await p.waitForTimeout(1800);
const stepNow = () => p.evaluate(() => [...document.querySelectorAll('#pl-form .step, dialog.plan fieldset, dialog.plan .step')].findIndex(s => !s.hidden));
for (let i = 0; i <= 6; i++) {
  await p.screenshot({ path: `${out}-${scheme}-${i+1}s${i}.png` });
  if (i === 6) break;
  if (i !== 2) { await p.keyboard.press('1'); await p.waitForTimeout(500); }
  const nx = await p.$('#pl-next'); if (nx && await nx.isVisible() && i !== 5 || i === 2 || i === 5) { await p.click('#pl-next', { timeout: 1500 }).catch(()=>{}); }
  await p.waitForTimeout(1700);
}
console.log('errors:', errs.join('|') || 'none'); await b.close();
