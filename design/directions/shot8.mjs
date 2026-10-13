import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errs=[]; const url='file://'+process.cwd()+'/v8.html'; const only=process.argv[2];
for (const [k,w,h] of [['desk',1440,900],['mob',390,844]]) for (const scheme of ['light','dark']) {
  if (only && only!==k+scheme) continue;
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1, colorScheme:scheme });
  const p = await ctx.newPage(); p.on('pageerror',e=>errs.push(k+scheme+': '+e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto(url,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(5200); await p.screenshot({path:`v8-${k}-${scheme}-1.png`});
  await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,90));} });
  await p.waitForTimeout(1200); await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(300);
  await p.screenshot({path:`v8-${k}-${scheme}-full.png`, fullPage:true});
  await ctx.close();
}
console.log('errors:',errs.length?errs:'none'); await b.close();
