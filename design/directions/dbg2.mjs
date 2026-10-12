import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [w,h,box] of [[1440,900,[820,1380,250,700]],[390,844,[20,370,80,330]]]) {
  const p = await (await b.newContext({ viewport:{width:w,height:h} })).newPage();
  await p.goto('file://'+process.cwd()+'/v5-sky-live.html'); await p.waitForTimeout(2500);
  let strokes=0, t0=Date.now();
  for (let y=box[2]; y<=box[3]; y+=40){ strokes++; await p.mouse.move(box[0],y); await p.mouse.move(box[1],y,{steps:10});
    if (await p.evaluate(()=>document.getElementById('hero').classList.contains('free'))) break; }
  console.log(w, 'freed:', await p.evaluate(()=>document.getElementById('hero').classList.contains('free')), 'after strokes:', strokes, 'ratio', (await p.evaluate(()=>window.__smog)).ratio.toFixed(2));
}
await b.close();
