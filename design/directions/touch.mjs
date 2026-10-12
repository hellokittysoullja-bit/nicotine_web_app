import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const res = {};
for (const edge of [false, true]) {
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:3, isMobile:true, hasTouch:true });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+process.cwd()+'/v7-sky.html'); await p.waitForTimeout(5300);
  const cdp = await ctx.newCDPSession(p); const types=[];
  await p.evaluate(()=>{ window.__pt=[]; document.getElementById('hero').addEventListener('pointerdown',e=>window.__pt.push(e.pointerType)); });
  const t0 = Date.now(); let n = 0;
  for (let y = 180; y <= 420 && n < 12; y += 30, n++) {
    const x0 = edge ? 6 : 40, x1 = edge ? 200 : 360;
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x0,y}]});
    for (let i=1;i<=10;i++){ await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x0+(x1-x0)*i/10,y:y+i}]}); await p.waitForTimeout(16); }
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await p.waitForTimeout(120);
    if (await p.evaluate(()=>document.getElementById('hero').classList.contains('free'))) break;
  }
  await p.waitForTimeout(900);
  res[edge?'edge':'normal'] = { free: await p.evaluate(()=>document.getElementById('hero').classList.contains('free')), strokes:n+1, ms: Date.now()-t0, pointerTypes:[...new Set(await p.evaluate(()=>window.__pt))], scrollY: await p.evaluate(()=>scrollY), errs };
  if (!edge) await p.screenshot({path:'v7-touch-free.png'});
  await ctx.close();
}
console.log(JSON.stringify(res,null,1)); await b.close();
