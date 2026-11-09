'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let ok = 0, fail = 0;
function t(name, fn) {
  try { fn(); ok++; console.log('  ok   ' + name); }
  catch (e) { fail++; console.log('  FAIL ' + name + '\n       ' + e.message); }
}
console.log('site structure tests');
t('no noindex', () => assert.ok(!/name="robots" content="noindex"/.test(html)));
t('absolute og:image Pages URL', () => assert.ok(html.includes('https://kittiborissza.github.io/the-patient-funnel/og.png')));
t('SITE_CONFIG present', () => assert.ok(html.includes('SITE_CONFIG')));
t('sections present', () => {
  ['brief','education','competitors','creatives','compliance','calculators'].forEach(id => {
    assert.ok(html.includes('id="' + id + '"'), 'missing #' + id);
  });
});
t('creatives C1–C10', () => {
  for (let i = 1; i <= 10; i++) assert.ok(html.includes('id="cr-' + String(i).padStart(2,'0') + '"'));
});
t('fee 1.49% and 9.9% present; 0.49% only as discarded', () => {
  assert.ok(html.includes('1.49%'));
  assert.ok(html.includes('9.9%'));
  assert.ok(/do not use 0\.49%|0\.49% note could not/i.test(html));
  assert.ok(!/service fee[^.]{0,40}0\.49%/i.test(html));
});
t('cookie-free note', () => assert.ok(/no cookies, pixels or third-party trackers/i.test(html)));
t('chart assets exist', () => {
  ['01_competitive_landscape.png','02_mica_passport_heatmap.png','03_fees_dca_comparison.png','04_where_invity_wins.png']
    .forEach(f => assert.ok(fs.existsSync(path.join(root, 'assets', f)), f));
});
t('charts referenced locally', () => assert.ok(html.includes('assets/01_competitive_landscape.png')));
t('education assets linked', () => {
  assert.ok(html.includes('broken-money-and-the-way-out'));
  assert.ok(html.includes('Straight from Invity'));
  assert.ok(html.includes('Invity Academy'));
});
t('COMPLIANCE.md exists', () => assert.ok(fs.existsSync(path.join(root, 'COMPLIANCE.md'))));
console.log('\n' + ok + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
