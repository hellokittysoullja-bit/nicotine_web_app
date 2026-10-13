import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const scheme of ['light','dark']) for (const free of [false,true]) {
  const ctx = await b.newContext({ viewport:{width:1440,height:900}, colorScheme:scheme });
  const p = await ctx.newPage(); await p.goto('file://'+process.cwd()+'/v8.html'); await p.waitForTimeout(5500);
  await p.evaluate(()=>document.querySelectorAll('.rv').forEach(e=>e.classList.add('seen'))); await p.waitForTimeout(900);
  if (free) { await p.click('#break'); await p.waitForTimeout(1500); }
  try { await p.addScriptTag({path:'/tmp/claude-0/-home-user/fee4f221-3949-527e-8c59-c6bf3beba1c8/scratchpad/axe/package/axe.min.js'}); } catch(e){ console.log('noaxe',e.message); process.exit(); }
  const r = await p.evaluate(async()=>{ const res = await axe.run(document,{resultTypes:['violations']}); return res.violations.map(v=>v.id+' ('+v.impact+'): '+v.nodes.slice(0,4).map(n=>n.target.join(' ')+' '+(n.any[0]?.message||'')).join(' | ')); });
  console.log(scheme, free?'free':'start', r.length? r : 'clean');
  await ctx.close(); }
await b.close();
