import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
const errs=[];
for (const [k,w,h] of [['desk',1440,900],['mob',390,844]]) for (const scheme of ['light','dark']) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:2, colorScheme:scheme });
  const p = await ctx.newPage(); p.on('pageerror',e=>errs.push(k+scheme+': '+e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto('file://'+process.cwd()+'/v5-sky-live.html',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(3000); await p.screenshot({path:`v5-${k}-${scheme}-1.png`});
  // мазки по облаку
  const box = k==='desk' ? {x0:820,x1:1380,y0:250,y1:700} : {x0:20,x1:370,y0:80,y1:330};
  const t0 = Date.now(); let n=0;
  for (let y=box.y0; y<=box.y1 && n<2; y+=26){ await p.mouse.move(box.x0,y); await p.mouse.move(box.x1,y,{steps:14});
    const free = await p.evaluate(()=>document.getElementById('hero').classList.contains('free'));
    if (y===box.y0+26*4) await p.screenshot({path:`v5-${k}-${scheme}-mid.png`});
    if (free) { n++; break; } }
  const free = await p.evaluate(()=>document.getElementById('hero').classList.contains('free'));
  await p.waitForTimeout(1800);
  if (free) await p.click('#o-pouch');
  await p.waitForTimeout(250);
  await p.screenshot({path:`v5-${k}-${scheme}-2.png`});
  const ov = await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const card = await p.evaluate(()=>{const r=document.getElementById('card').getBoundingClientRect();return Math.round(r.top)+'..'+Math.round(r.bottom)+' / '+innerHeight});
  const fps = await p.evaluate(()=>new Promise(r=>{let c=0;const s=performance.now();(function f(){c++;performance.now()-s<1000?requestAnimationFrame(f):r(c)})()}));
  console.log(k,scheme,'freed by swipe:',free,'in',Date.now()-t0,'ms; overflowX:',ov,'card:',card);
  await ctx.close();
}
// производительность облака до финала
const ctx = await b.newContext({ viewport:{width:1440,height:900} }); const p = await ctx.newPage();
await p.goto('file://'+process.cwd()+'/v5-sky-live.html'); await p.waitForTimeout(1500);
const ms = await p.evaluate(()=>new Promise(r=>{const ts=[];let l=performance.now();(function f(n){ts.push(n-l);l=n;ts.length<90?requestAnimationFrame(f):r(ts.slice(5))})(l)}));
ms.sort((a,b)=>a-b); console.log('frame ms median',ms[Math.floor(ms.length/2)].toFixed(1),'p95',ms[Math.floor(ms.length*.95)].toFixed(1));
console.log('errors:',errs.length?errs:'none'); await b.close();
