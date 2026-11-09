// Run: node tests/calc.test.js   (Node 18+; no dependencies)
'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');

// Load the copy of the maths that is actually inlined in index.html, and the source file; they must match.
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script id="calc">([\s\S]*?)<\/script>/);
assert.ok(m, 'inline calc script found in index.html');
const sandbox = {}; vm.runInNewContext(m[1], sandbox);
const C = sandbox.PFCalc;
const Csrc = require('../src/calc.js');
assert.equal(m[1].trim(), fs.readFileSync(path.join(__dirname, '..', 'src', 'calc.js'), 'utf8').trim(), 'inline calc == src/calc.js');

let passed = 0, failed = 0;
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
function t(name, fn) {
  try { fn(); passed++; console.log('  ok   ' + name); }
  catch (e) { failed++; console.log('  FAIL ' + name + '\n       ' + e.message); }
}

console.log('calc.js formula tests');

t('normaliseWeights sums to 1 and ignores negatives/NaN', () => {
  const w = C.normaliseWeights([30, 50, 20, -5, NaN]);
  assert.ok(near(w.reduce((a, b) => a + b, 0), 1));
  assert.ok(near(w[0], 0.3) && near(w[1], 0.5) && w[3] === 0 && w[4] === 0);
  assert.deepEqual(Array.from(C.normaliseWeights([0, 0])), [0, 0]);
});

t('effectiveCPI: base at zero spend, +k per €1,000', () => {
  assert.ok(near(C.effectiveCPI(6, 0, 0.1, 1), 6));
  assert.ok(near(C.effectiveCPI(6, 2000, 0.1, 1), 7.2));
  assert.ok(near(C.effectiveCPI(6, 2000, 0.1, 1.3), 9.36));
});

const plan = {
  budget: 3000, scenario: 'base', k: 0.1, signupRate: 0.3, kycRate: 0.5, buyRate: 0.55,
  channels: [
    { id: 'organic', weight: 30, enabled: true, cpi: 4, cap: 1500, quality: 1 },
    { id: 'creators', weight: 50, enabled: true, cpi: 7, cap: 4000, quality: 1.1 },
    { id: 'referral', weight: 20, enabled: true, cpi: 6, cap: 500, quality: 1.3 },
    { id: 'meta', weight: 40, enabled: false, cpi: 6, cap: Infinity, quality: 0.9 }
  ]
};
t('planner: disabled channel gets nothing; caps create unusable budget', () => {
  const r = C.planner(plan);
  assert.equal(r.rows[3].alloc, 0);
  assert.ok(near(r.rows[0].alloc, 900) && near(r.rows[1].alloc, 1500) && near(r.rows[2].alloc, 600));
  assert.ok(near(r.rows[2].used, 500) && near(r.total.unusable, 100));
  assert.ok(near(r.total.unusableShare, 100 / 3000));
});
t('planner: installs = spend / rising CPI; buyers = installs × signup × KYC × buy × quality', () => {
  const r = C.planner(plan), o = r.rows[0];
  const cpi = 4 * (1 + 0.1 * 0.9);            // 4.36
  assert.ok(near(o.cpi, cpi));
  assert.ok(near(o.installs, 900 / cpi));
  assert.ok(near(o.buyers, (900 / cpi) * 0.3 * 0.5 * 0.55));
  assert.ok(near(r.total.perBuyer, r.total.used / r.total.buyers));
});
t('planner: cautious < base < upside first buyers', () => {
  const b = n => C.planner(Object.assign({}, plan, { scenario: n })).total.buyers;
  assert.ok(b('cautious') < b('base') && b('base') < b('upside'));
});
t('planner: more budget gives fewer buyers per euro (diminishing returns)', () => {
  const one = Object.assign({}, plan, { channels: [{ id: 'meta', weight: 1, enabled: true, cpi: 6, cap: Infinity, quality: 1 }] });
  const lo = C.planner(Object.assign({}, one, { budget: 1000 })).total;
  const hi = C.planner(Object.assign({}, one, { budget: 10000 })).total;
  assert.ok(hi.perBuyer > lo.perBuyer && hi.buyers > lo.buyers);
});

const fun = { impressions: 100000, cpm: 5, rates: { ctr: 0.01, install: 0.1, signup: 0.3, kyc: 0.5, first: 0.55, repeat: 0.5, autobuy: 0.7 } };
t('funnel: counts multiply through and spend = impressions × CPM / 1000', () => {
  const f = C.funnel(fun);
  assert.ok(near(f.spend, 500));
  assert.ok(near(f.stages[1].count, 1000) && near(f.stages[2].count, 100));
  assert.ok(near(f.final, 100000 * 0.01 * 0.1 * 0.3 * 0.5 * 0.55 * 0.5 * 0.7));
  assert.ok(near(f.stages[5].cost, 500 / (100 * 0.3 * 0.5 * 0.55)));
});
t('funnel sensitivity: lift = high/current − 1; biggest lever identified', () => {
  const s = C.funnelSensitivity(fun, { ctr: 0.015, install: 0.25, signup: 0.45, kyc: 0.7, first: 0.7, repeat: 0.7, autobuy: 0.85 });
  const inst = s.steps.find(x => x.key === 'install');
  assert.ok(near(inst.lift, 1.5));
  assert.equal(s.biggest, 'install');
});

t('invNorm matches known quantiles', () => {
  assert.ok(near(C.invNorm(0.975), 1.959964, 1e-6));
  assert.ok(near(C.invNorm(0.8), 0.841621, 1e-6));
  assert.ok(near(C.invNorm(0.5), 0, 1e-9));
  assert.ok(near(C.invNorm(0.01), -2.326348, 1e-6));
});
t('samplePerArm: 5% → 6% (20% lift), α 0.05, power 0.8 ≈ 8,158 per arm', () => {
  assert.equal(C.samplePerArm(0.05, 0.2, 0.05, 0.8), 8158);
});
t('samplePerArm: 10% → 12%, α 0.05, power 0.8 ≈ 3,841 per arm (textbook value)', () => {
  const n = C.samplePerArm(0.10, 0.2, 0.05, 0.8);
  assert.ok(n >= 3830 && n <= 3850, 'got ' + n);
});
t('power: runtime days = ceil(2n / daily traffic); invalid input → null', () => {
  const p = C.power({ baseline: 0.05, lift: 0.2, alpha: 0.05, power: 0.8, dailyTraffic: 500 });
  assert.equal(p.days, Math.ceil(2 * 8158 / 500));
  assert.equal(C.power({ baseline: 0.9, lift: 0.2, alpha: 0.05, power: 0.8, dailyTraffic: 1 }).perArm, null);
});

t('creator pilot: cost per attributed buyer', () => {
  const r = C.creator({ creators: 3, fee: 250, boost: 0, reach: 15000, clickRate: 0.01, installRate: 0.25, purchaseRate: 0.0825 });
  assert.ok(near(r.installs, 112.5) && near(r.cost, 750));
  assert.ok(near(r.buyers, 112.5 * 0.0825));
  assert.ok(near(r.perBuyer, 750 / (112.5 * 0.0825)));
});

t('retention curve: m1 = 1, m2 = 1 − early drop, then geometric', () => {
  assert.equal(C.retention(1, 0.3, 0.06), 1);
  assert.ok(near(C.retention(2, 0.3, 0.06), 0.7));
  assert.ok(near(C.retention(4, 0.3, 0.06), 0.7 * 0.94 * 0.94));
});
t('payback: contribution and payback month', () => {
  const r = C.payback({ avgBuy: 100, takeRate: 0.01, otherRev: 0, varCost: 0, earlyDrop: 0, churn: 0, months: 24, cac: 10 });
  assert.ok(near(r.perActiveMonth, 1));
  assert.equal(r.paybackMonth, 10);
  assert.ok(near(r.total, 24));
  const never = C.payback({ avgBuy: 100, takeRate: 0.01, otherRev: 0, varCost: 0.3, earlyDrop: 0.3, churn: 0.06, months: 24, cac: 150 });
  assert.equal(never.paybackMonth, null);
});

t('content budget: hours, localisation uplift and utilisation', () => {
  const r = C.contentBudget({ formats: [{ name: 'a', perWeek: 2, hours: 3, review: 1, localised: true }, { name: 'b', perWeek: 1, hours: 2, review: 0, localised: false }],
    fixed: 10, localisation: 0.25, capacity: 32 });
  assert.ok(near(r.make, 2 * 4 * 1.25 + 2));
  assert.ok(near(r.total, 22) && near(r.utilisation, 22 / 32));
});

t('src/calc.js (Node module) gives identical results to the inline copy', () => {
  assert.equal(Csrc.samplePerArm(0.05, 0.2, 0.05, 0.8), C.samplePerArm(0.05, 0.2, 0.05, 0.8));
  assert.ok(near(Csrc.planner(plan).total.buyers, C.planner(plan).total.buyers));
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
