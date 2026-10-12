import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [w,h,scheme]=[+(process.argv[2]||1440),+(process.argv[3]||900),process.argv[4]||'light'];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport:{width:w,height:h}, colorScheme:scheme })).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/v7-sky.html',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
const ids=['m-h','w-h','b-h','s-h','p-h','f-h']; let i=0;
for (const id of ids) { await p.evaluate(id=>{const e=document.getElementById(id); scrollTo(0, e.getBoundingClientRect().top+scrollY-innerHeight*.3);}, id); await p.waitForTimeout(1500);
  const sky = await p.evaluate(()=>document.documentElement.dataset.sky); await p.screenshot({path:`v7v-${w}-${scheme}-${++i}.png`}); console.log(id, sky); }
console.log('errors', errs); await b.close();
