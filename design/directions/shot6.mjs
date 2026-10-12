import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
const errs=[]; const url='file://'+process.cwd()+'/v6-sky.html';
const fr = p=>p.evaluate(()=>document.getElementById('hero').classList.contains('free'));
for (const [k,w,h] of [['desk',1440,900],['mob',390,844],['small',320,568]]) for (const scheme of ['light','dark']) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:2, colorScheme:scheme, hasTouch:k!=='desk' });
  const p = await ctx.newPage(); p.on('pageerror',e=>errs.push(k+scheme+': '+e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto(url,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(2500); await p.screenshot({path:`v6-${k}-${scheme}-1.png`});
  const h1a = await p.evaluate(()=>Math.round(document.getElementById('h').getBoundingClientRect().top));
  const box = k==='desk' ? {x0:820,x1:1380,y0:250,y1:700} : {x0:20,x1:w-20,y0:Math.round(h*.1),y1:Math.round(h*.45)};
  // hover-only stroke must NOT release
  await p.mouse.move(box.x0,box.y0); await p.mouse.move(box.x1,box.y1,{steps:20}); await p.waitForTimeout(300);
  const hoverFree = await fr(p);
  const t0=Date.now(); let strokes=0;
  for (let y=box.y0; y<=box.y1 && !(await fr(p)); y+=24){ strokes++;
    await p.mouse.move(box.x0,y); await p.mouse.down(); await p.mouse.move(box.x1,y,{steps:14}); await p.mouse.up();
    if (strokes===3) await p.screenshot({path:`v6-${k}-${scheme}-mid.png`}); }
  const free = await fr(p); await p.waitForTimeout(1200);
  const h1b = await p.evaluate(()=>Math.round(document.getElementById('h').getBoundingClientRect().top));
  await p.screenshot({path:`v6-${k}-${scheme}-2.png`});
  const st = await p.evaluate(()=>{const c=document.getElementById('card').getBoundingClientRect();return {card:Math.round(c.top)+'..'+Math.round(c.bottom)+'/'+innerHeight, focus:document.activeElement?.id, ov:document.documentElement.scrollWidth>innerWidth, status:document.getElementById('status').textContent}});
  console.log(k,scheme,{hoverFree,free,strokes,ms:Date.now()-t0,h1:h1a+'->'+h1b,...st});
  await ctx.close();
}
// keyboard
{ const ctx = await b.newContext({ viewport:{width:390,height:844}}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push('kb: '+e.message));
  await p.goto(url); await p.waitForTimeout(800);
  const order=[]; for(let i=0;i<4;i++){await p.keyboard.press('Tab'); order.push(await p.evaluate(()=>document.activeElement.id||document.activeElement.textContent.trim().slice(0,20)));}
  await p.focus('#break'); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  const f1 = await p.evaluate(()=>document.activeElement.id);
  await p.keyboard.press('Tab'); const f2=await p.evaluate(()=>document.activeElement.id);
  await p.click('#next'); const err=await p.evaluate(()=>document.getElementById('err').textContent);
  await p.focus('#o-cig'); await p.keyboard.press('ArrowDown'); await p.keyboard.press('ArrowDown');
  const sel=await p.evaluate(()=>[...document.querySelectorAll('.opt')].map(o=>o.getAttribute('aria-checked')+o.tabIndex).join(' '));
  await p.screenshot({path:'v6-kb-focus.png'});
  await p.click('#next'); await p.waitForTimeout(900); const f3=await p.evaluate(()=>document.activeElement.id);
  await p.keyboard.press('ArrowRight'); const sv=await p.evaluate(()=>[document.getElementById('spend-v').textContent,document.getElementById('year').textContent,document.getElementById('spend').getAttribute('aria-valuetext')]);
  await p.screenshot({path:'v6-kb-calc.png'});
  console.log('keyboard',{order,afterBreak:f1,tab:f2,err,sel,afterNext:f3,sv}); await ctx.close(); }
// reduced motion
{ const ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce'}); const p=await ctx.newPage();
  await p.goto(url); await p.waitForTimeout(1500);
  const n = await p.evaluate(()=>new Promise(r=>{let c=0;const o=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(...a){c++;return o.apply(this,a)};setTimeout(()=>r(c),1500)}));
  await p.screenshot({path:'v6-reduced.png'}); console.log('reduced motion drawImage calls idle 1.5s:',n); await ctx.close(); }
// zoom 200% ~ 720px wide at same CSS
{ const ctx = await b.newContext({ viewport:{width:720,height:450}, deviceScaleFactor:2}); const p=await ctx.newPage();
  await p.goto(url); await p.waitForTimeout(1500); await p.screenshot({path:'v6-zoom200.png'});
  console.log('zoom200 overflow:',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)); await ctx.close(); }
// perf
{ const ctx = await b.newContext({ viewport:{width:1440,height:900} }); const p = await ctx.newPage();
  await p.goto(url); await p.waitForTimeout(1500);
  await p.mouse.move(900,400);
  const ms = await p.evaluate(()=>new Promise(r=>{const ts=[];let l=performance.now();(function f(n){ts.push(n-l);l=n;ts.length<90?requestAnimationFrame(f):r(ts.slice(5))})(l)}));
  ms.sort((a,b)=>a-b); console.log('frame ms median',ms[Math.floor(ms.length/2)].toFixed(1),'p95',ms[Math.floor(ms.length*.95)].toFixed(1)); await ctx.close(); }
console.log('errors:',errs.length?errs:'none'); await b.close();
