import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errs=[];
for (const [k,w,h] of [['desk',1440,900],['mob',390,844]]) for (const scheme of ['light','dark']) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:2, colorScheme:scheme });
  const p = await ctx.newPage(); p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto('file://'+process.cwd()+'/v4-sky.html',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
  const okFont = await p.evaluate(()=>document.fonts.check('800 40px Geologica','Пора'));
  await p.waitForTimeout(2200); await p.screenshot({path:`v4-${k}-${scheme}-1.png`});
  await p.click('#break'); await p.waitForTimeout(2000); await p.click('#o-pouch'); await p.waitForTimeout(300);
  await p.screenshot({path:`v4-${k}-${scheme}-2.png`});
  const ov = await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const after = await p.evaluate(()=>{const r=document.getElementById('after').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight});
  if (scheme==='light') await p.screenshot({path:`v4-${k}-full.png`, fullPage:true});
  console.log(k,scheme,'Geologica cyr:',okFont,'overflowX:',ov,'question card in view:',after); await ctx.close();
}
console.log('errors:',errs.length?errs:'none'); await b.close();
