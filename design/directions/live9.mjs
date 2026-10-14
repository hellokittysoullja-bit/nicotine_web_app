import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const url='file://'+process.cwd()+'/v9.html', errs=[];
const info = p => p.evaluate(()=>({dlg:document.getElementById('plan').open, step:[...document.querySelectorAll('.step')].findIndex(s=>!s.hidden), opened:hero.classList.contains('opened'), free:hero.classList.contains('free'), e:document.querySelector('.sun').dataset.e, char:document.documentElement.dataset.char||null}));
{ const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage(); p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto(url); await p.waitForTimeout(5000);
  await p.click('#break'); await p.waitForTimeout(900); console.log('begin:', JSON.stringify(await info(p))); await p.screenshot({path:'v9-s0.png'});
  await p.click('.step[data-step="0"] .opt >> nth=1'); await p.waitForTimeout(700); console.log('step1:', JSON.stringify(await info(p)));
  await p.keyboard.press('2'); await p.waitForTimeout(700); console.log('after key 2:', JSON.stringify(await info(p))); await p.screenshot({path:'v9-s2.png'});
  await p.evaluate(()=>{const s=document.getElementById('sl'); s.value=700; s.dispatchEvent(new Event('input',{bubbles:true}));}); await p.waitForTimeout(300);
  console.log('slider:', await p.textContent('#sl-v'), '|', await p.textContent('#sl-3y'), '| calc:', await p.textContent('#spend-v')); await p.screenshot({path:'v9-s3.png'});
  await p.click('#pl-next'); await p.waitForTimeout(400);
  console.log('if-legend:', await p.textContent('.step[data-step="3"] legend'));
  await p.keyboard.press('1'); await p.waitForTimeout(600); await p.keyboard.press('3'); await p.waitForTimeout(600); await p.screenshot({path:'v9-s5.png'});
  await p.keyboard.press('2'); await p.waitForTimeout(300); await p.click('#pl-next'); await p.waitForTimeout(1900);
  console.log('diagnosis:', JSON.stringify(await info(p)), 'tiles:', await p.locator('.tile').count(), 'year:', await p.textContent('#b-year'));
  await p.click('[data-ring="b"]'); await p.screenshot({path:'v9-diag.png'});
  await p.click('#pl-next'); await p.waitForTimeout(500); console.log('closed:', !(await p.evaluate(()=>document.getElementById('plan').open)), 'focus->', await p.evaluate(()=>document.activeElement.id||document.activeElement.className));
  await p.waitForTimeout(800); await p.screenshot({path:'v9-after.png'});
}
{ const ctx = await b.newContext({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true, deviceScaleFactor:2 }); const p = await ctx.newPage(); p.on('pageerror',e=>errs.push(e.message));
  await p.goto(url); await p.waitForTimeout(5000); const c = await ctx.newCDPSession(p);
  const tp=(type,x,y)=>c.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y,radiusX:12,radiusY:12}]});
  await tp('touchStart',60,410); for(let i=1;i<=14;i++){await tp('touchMove',60+i*22,410-i*3); await p.waitForTimeout(16);} await tp('touchEnd'); await p.waitForTimeout(900);
  console.log('mobile swipe:', JSON.stringify(await info(p))); await p.screenshot({path:'v9-mob-s0.png'});
}
console.log('errors:', errs.length?errs:'none'); await b.close();
