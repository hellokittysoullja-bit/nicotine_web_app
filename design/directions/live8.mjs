import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const url='file://'+process.cwd()+'/v8.html', errs=[];
// 1. Desktop button release + dialog
{ const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage(); p.on('pageerror',e=>errs.push(e.message));
  await p.goto(url); await p.waitForTimeout(5000); await p.click('#break');
  for (const t of [200,450,1100]) { await p.waitForTimeout(t===200?200:t===450?250:650); await p.screenshot({path:`v8-rel-${t}.png`}); }
  await p.click('#plan-open'); await p.waitForTimeout(400);
  const st = await p.evaluate(()=>({open:document.getElementById('plan').open, focus:document.activeElement.textContent.trim().slice(0,30), sun:document.querySelector('.sun').getBoundingClientRect().toJSON()}));
  console.log('after button:', JSON.stringify(st));
  // walk the quiz with keyboard
  await p.click('.step[data-step="0"] .opt >> nth=0'); await p.waitForTimeout(300);
  await p.click('.step[data-step="1"] .opt >> nth=1'); await p.waitForTimeout(300);
  await p.click('.step[data-step="2"] .opt >> nth=0'); await p.click('.step[data-step="2"] .opt >> nth=3'); await p.click('#pl-next');
  await p.click('.step[data-step="3"] .opt >> nth=1'); await p.waitForTimeout(300);
  await p.screenshot({path:'v8-plan-desk.png'});
  await p.click('#pl-next'); console.log('pay msg:', await p.textContent('#pl-msg'));
  await p.keyboard.press('Escape'); await p.waitForTimeout(400); console.log('closed:', !(await p.evaluate(()=>document.getElementById('plan').open)), 'focus->', await p.evaluate(()=>document.activeElement.id));
}
// 1b. keyboard path
{ const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage(); p.on('pageerror',e=>errs.push(e.message));
  await p.goto(url); await p.waitForTimeout(4500); await p.focus('#break'); await p.keyboard.press('Enter'); await p.waitForTimeout(1500); await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const a = await p.evaluate(()=>document.activeElement.textContent.trim()); await p.keyboard.press('ArrowDown'); const bb = await p.evaluate(()=>document.activeElement.textContent.trim()+' '+document.activeElement.getAttribute('aria-checked'));
  console.log('kbd focus:', a, '| after ArrowDown:', bb); }
// 2. Mobile touch swipe
{ const ctx = await b.newContext({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true, deviceScaleFactor:2 }); const p = await ctx.newPage(); p.on('pageerror',e=>errs.push(e.message));
  await p.goto(url); await p.waitForTimeout(5000); const c = await ctx.newCDPSession(p);
  const tp=(type,x,y)=>c.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y,radiusX:12,radiusY:12}]});
  await tp('touchStart',60,330); for(let i=1;i<=14;i++){await tp('touchMove',60+i*22,330-i*3); await p.waitForTimeout(16);}
  console.log('freed before up:', await p.evaluate(()=>document.getElementById('hero').classList.contains('free')));
  await tp('touchEnd'); await p.waitForTimeout(450); await p.screenshot({path:'v8-swipe-450.png'});
  await p.waitForTimeout(900); await p.screenshot({path:'v8-swipe-1350.png'});
  console.log('freed after up:', await p.evaluate(()=>document.getElementById('hero').classList.contains('free')));
  await p.click('#plan-open'); await p.waitForTimeout(450); await p.screenshot({path:'v8-plan-mob.png'});
}
console.log('errors:', errs.length?errs:'none'); await b.close();
