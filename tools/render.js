const puppeteer = require('puppeteer-core');
const path = require('path');
const URL0 = 'file://' + path.resolve(__dirname, '..', 'index.html');
const out = path.resolve(__dirname, '..', 'screens');
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-gpu'], headless: 'new' });
  const report = { errors: [], checks: [] };
  for (const vp of [{ n: 'mobile', w: 390, h: 844, m: true }, { n: 'desktop', w: 1440, h: 900, m: false }]) {
    const p = await b.newPage();
    p.on('console', m => { if (['error', 'warning'].includes(m.type())) report.errors.push(vp.n + ' console ' + m.type() + ': ' + m.text()); });
    p.on('pageerror', e => report.errors.push(vp.n + ' pageerror: ' + e.message));
    await p.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: vp.m ? 2 : 1, isMobile: vp.m, hasTouch: vp.m });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.goto(URL0, { waitUntil: 'load' });
    const sw = await p.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    report.checks.push(`${vp.n}: scrollWidth ${sw[0]} vs viewport ${sw[1]} ${sw[0] <= sw[1] ? 'OK (no horizontal overflow)' : 'OVERFLOW'}`);
    // overflow offenders
    const off = await p.evaluate(() => { const W = innerWidth; return [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > W + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.tablewrap') && !e.closest('.mininav'); }).slice(0, 8).map(e => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right)); });
    if (off.length) report.checks.push(vp.n + ' offenders: ' + off.join(' | '));
    await p.screenshot({ path: `${out}/${vp.n}-hero.png` });
    // slider keyboard behaviour: budget
    const before = await p.$eval('#p_kpis', e => e.innerText);
    await p.focus('#p_budget_r');
    for (let i = 0; i < 10; i++) await p.keyboard.press('ArrowRight');
    const after = await p.evaluate(() => ({ v: document.querySelector('#p_budget_r').value, n: document.querySelector('#p_budget_n').value, k: document.querySelector('#p_kpis').innerText, url: location.search }));
    await new Promise(r => setTimeout(r, 300));
    const url = await p.evaluate(() => location.search);
    report.checks.push(`${vp.n}: budget slider ArrowRight×10 → ${after.v} (number field ${after.n}); results changed: ${before !== after.k}; URL: ${url}`);
    // numeric field typing
    await p.$eval('#f_ctr_n', e => { e.focus(); e.select(); }); await p.keyboard.type('1.5');
    const fk = await p.$eval('#f_ctr_r', e => e.value);
    report.checks.push(`${vp.n}: typed 1.5 in CTR number → slider ${fk}`);
    // approve Meta
    await p.click('#p_meta_ok');
    const meta = await p.evaluate(() => [document.querySelector('#p_meta_w').disabled, document.querySelector('#p_meta_share').textContent]);
    report.checks.push(`${vp.n}: Meta approved → slider disabled=${meta[0]}, share ${meta[1]}`);
    // reset
    await p.click('[data-reset="planner"]');
    const rs = await p.evaluate(() => [document.querySelector('#p_budget_n').value, document.querySelector('#p_meta_ok').checked]);
    report.checks.push(`${vp.n}: reset planner → budget ${rs[0]}, meta approved ${rs[1]}`);
    // calculator screenshot (sticky header made static so it does not overlay element shots)
    await p.addStyleTag({ content: '.topbar{position:static!important}' });
    const el = await p.$('#c-planner');
    await el.screenshot({ path: `${out}/${vp.n}-calculator-planner.png` });
    const el2 = await p.$('#c-funnel'); await el2.screenshot({ path: `${out}/${vp.n}-calculator-funnel.png` });
    const ev = await p.$('#evidence'); await ev.screenshot({ path: `${out}/${vp.n}-evidence-full.png` });
    await p.evaluate(() => document.querySelector('#benchTable').closest('.card').scrollIntoView()); await p.screenshot({ path: `${out}/${vp.n}-evidence.png` });
    const dn = await p.$('#done'); await dn.screenshot({ path: `${out}/${vp.n}-done.png` });
    // walkthrough
    await p.click('#walkToggle');
    const walk = await p.evaluate(() => ({ on: document.body.classList.contains('walk'), pitch: getComputedStyle(document.querySelector('#pitch')).display, funnel: getComputedStyle(document.querySelector('#c-funnel')).display, planner: getComputedStyle(document.querySelector('#c-planner')).display }));
    report.checks.push(`${vp.n}: walkthrough on=${walk.on} pitch=${walk.pitch} planner=${walk.planner} funnel=${walk.funnel}`);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({ path: `${out}/${vp.n}-walkthrough.png`, fullPage: false, clip: undefined });
    try { const pitch = await p.$("#pitch"); await pitch.screenshot({ path: `${out}/${vp.n}-walkthrough-pitch.png` }); } catch (e) { report.checks.push(vp.n + " pitch shot failed: " + e.message); }
    await p.click('#walkToggle');
    if (!vp.m) await p.screenshot({ path: `${out}/desktop-fullpage.png`, fullPage: true });
    await p.close();
  }
  // URL state restore
  const p = await b.newPage();
  p.on('pageerror', e => report.errors.push('url pageerror: ' + e.message));
  await p.goto(URL0 + '?p.budget=8000&p.ok_meta=1&p.w_meta=40&x.base=2&walk=1', { waitUntil: 'load' });
  const st = await p.evaluate(() => [document.querySelector('#p_budget_n').value, document.querySelector('#p_meta_ok').checked, document.querySelector('#x_base_n').value, document.body.classList.contains('walk'), document.querySelector('#x_kpis').innerText.replace(/\n/g, ' ')]);
  report.checks.push('URL restore: ' + JSON.stringify(st));
  // print
  await p.goto(URL0, { waitUntil: 'load' });
  await p.pdf({ path: path.resolve(__dirname, '..', 'screens', 'print-preview.pdf'), format: 'A4', printBackground: true });
  report.checks.push('print PDF generated');
  // OG image
  const og = await b.newPage(); await og.setViewport({ width: 1200, height: 630 });
  await og.goto('file://' + path.resolve(__dirname, 'og.html'), { waitUntil: 'load' });
  await og.screenshot({ path: path.resolve(__dirname, '..', 'og.png') });
  report.checks.push('og.png generated');
  await b.close();
  console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
