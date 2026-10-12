import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const f=process.argv[2]||'v6-sky.html', tag=process.argv[3]||'v6';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const [k,w,h] of [['desk',1440,900],['mob',390,844]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const p = await ctx.newPage(); await p.goto('file://'+process.cwd()+'/'+f,{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
  await p.screenshot({path:`${tag}-full-${k}.png`, fullPage:true});
  console.log(k, await p.evaluate(()=>document.documentElement.scrollHeight));
  await ctx.close(); }
await b.close();
