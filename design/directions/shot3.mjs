import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errs = [];
const runs = [['desk',1440,900,'light'],['desk',1440,900,'dark'],['mob',390,844,'light'],['mob',390,844,'dark'],['narrow',320,640,'light']];
for (const [k,w,h,scheme] of runs) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:2, colorScheme:scheme });
  const p = await ctx.newPage(); p.on('pageerror', e=>errs.push(e.message)); p.on('console', m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto('file://'+process.cwd()+'/v3-breakup.html',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
  const fsBefore = await p.evaluate(()=>document.querySelector('h1').getBoundingClientRect().top);
  const base = `v3-${k}-${scheme}`;
  await p.screenshot({path:base+'.png'});
  await p.click('label[for="p-pouch"]'); await p.waitForTimeout(1900);
  const fsAfter = await p.evaluate(()=>document.querySelector('h1').getBoundingClientRect().top + scrollY);
  const cta = await p.evaluate(()=>{const r=document.getElementById('start').getBoundingClientRect();return {top:Math.round(r.top),bottom:Math.round(r.bottom),vh:innerHeight}});
  const ov = await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await p.screenshot({path:base+'-tap.png'});
  console.log(base,'h1 shift px:',Math.round(fsAfter-fsBefore),'cta in view:',cta.bottom<=cta.vh&&cta.top>=0,'overflowX:',ov);
  await ctx.close();
}
console.log('errors:',errs.length?errs:'none'); await b.close();
