import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:3, isMobile:true, hasTouch:true });
const p = await ctx.newPage(); await p.goto('file://'+process.cwd()+'/v7-sky.html'); await p.waitForTimeout(5300);
await p.evaluate(()=>{ window.__ev={}; for (const t of ['pointerdown','pointermove','pointerup','pointercancel','pointerleave']) document.getElementById('hero').addEventListener(t,e=>{window.__ev[t]=(window.__ev[t]||0)+1}); });
const cdp = await ctx.newCDPSession(p);
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:40,y:300}]});
for (let i=1;i<=10;i++){ await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:40+32*i,y:300}]}); await p.waitForTimeout(16); }
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
await p.waitForTimeout(500);
console.log(await p.evaluate(()=>window.__ev));
await b.close();
