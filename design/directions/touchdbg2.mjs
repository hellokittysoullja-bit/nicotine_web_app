import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const mobileMode of [true,false]) {
const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:3, isMobile:mobileMode, hasTouch:true });
const p = await ctx.newPage(); await p.goto('file://'+process.cwd()+'/v7-sky.html'); await p.waitForTimeout(5300);
const cdp = await ctx.newCDPSession(p);
const info = () => p.evaluate(()=>{ const r=document.getElementById('hero').getBoundingClientRect(); const cs=[...document.querySelectorAll('#smog .l-main circle')]; const moved=cs.filter(c=>c.getAttribute('transform')&&c.getAttribute('transform')!=='translate(0.0 0.0)').length; const faded=cs.filter(c=>c.getAttribute('opacity')!==null).length; return {rectW:r.width, circles:cs.length, moved, faded, inner:innerWidth}; });
for (let y=200;y<=380;y+=30){ await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:40,y}]});
for (let i=1;i<=10;i++){ await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:40+32*i,y}]}); await p.waitForTimeout(16); }
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await p.waitForTimeout(60); }
await p.waitForTimeout(300);
console.log(mobileMode, await info());
await ctx.close(); }
await b.close();
