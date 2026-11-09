/* The Patient Funnel: calculator maths. Pure functions, no DOM.
   Used inline by index.html and by tests/calc.test.js (Node). */
(function (root) {
  'use strict';
  var C = {};

  C.clamp = function (x, lo, hi) { return Math.min(hi, Math.max(lo, x)); };
  C.safeDiv = function (a, b) { return b > 0 ? a / b : null; };

  /* ---------- 1. Acquisition scenario planner ---------- */
  C.SCENARIOS = {
    cautious: { cpi: 1.30, conv: 0.80 },
    base:     { cpi: 1.00, conv: 1.00 },
    upside:   { cpi: 0.85, conv: 1.15 }
  };

  // Weights -> fractions summing to 1. Disabled or negative weights count as 0.
  C.normaliseWeights = function (ws) {
    var clean = ws.map(function (w) { return (isFinite(w) && w > 0) ? w : 0; });
    var sum = clean.reduce(function (a, b) { return a + b; }, 0);
    return clean.map(function (w) { return sum > 0 ? w / sum : 0; });
  };

  // Average cost per install at a given monthly spend in one channel.
  // Diminishing returns: CPI rises linearly with spend.  k = rise per €1,000.
  C.effectiveCPI = function (baseCPI, spend, k, scenarioCpi) {
    return baseCPI * (scenarioCpi || 1) * (1 + k * spend / 1000);
  };

  /* opts: { budget, scenario, k, signupRate, kycRate, buyRate,
             channels: [{id, weight, enabled, cpi, cap, quality}] }
     rates are fractions (0.30 = 30%). cap = max usable spend per month (€). */
  C.planner = function (o) {
    var sc = C.SCENARIOS[o.scenario] || C.SCENARIOS.base;
    var ws = C.normaliseWeights(o.channels.map(function (c) { return c.enabled ? c.weight : 0; }));
    var installToKyc = C.clamp(o.signupRate * o.kycRate * sc.conv, 0, 1);
    var rows = o.channels.map(function (c, i) {
      var alloc = o.budget * ws[i];
      var cap = (c.cap == null || !isFinite(c.cap)) ? Infinity : Math.max(0, c.cap);
      var used = Math.min(alloc, cap);
      var cpi = C.effectiveCPI(c.cpi, used, o.k, sc.cpi);
      var installs = used > 0 && cpi > 0 ? used / cpi : 0;
      var kyc = installs * installToKyc;
      var buyRate = C.clamp(o.buyRate * sc.conv * (c.quality || 1), 0, 1);
      var buyers = kyc * buyRate;
      return { id: c.id, share: ws[i], alloc: alloc, used: used, unusable: alloc - used,
               cpi: cpi, installs: installs, kyc: kyc, buyers: buyers,
               perBuyer: C.safeDiv(used, buyers) };
    });
    var t = rows.reduce(function (a, r) {
      a.used += r.used; a.unusable += r.unusable; a.installs += r.installs;
      a.kyc += r.kyc; a.buyers += r.buyers; return a;
    }, { used: 0, unusable: 0, installs: 0, kyc: 0, buyers: 0 });
    t.perBuyer = C.safeDiv(t.used, t.buyers);
    t.unusableShare = o.budget > 0 ? t.unusable / o.budget : 0;
    return { rows: rows, total: t };
  };

  /* ---------- 2. Funnel calculator ---------- */
  C.FUNNEL_STEPS = ['ctr', 'install', 'signup', 'kyc', 'first', 'repeat', 'autobuy'];
  C.FUNNEL_LABELS = ['Clicks', 'Installs', 'Sign-ups', 'KYC completed', 'First purchase', 'Repeat buy (30 days)', 'Auto Buy active'];

  // o: { impressions, cpm, rates: {ctr, install, signup, kyc, first, repeat, autobuy} } (fractions)
  C.funnel = function (o) {
    var spend = o.impressions * o.cpm / 1000;
    var stages = [{ name: 'Impressions', count: o.impressions, cost: C.safeDiv(spend, o.impressions) }];
    var n = o.impressions;
    C.FUNNEL_STEPS.forEach(function (k, i) {
      n = n * C.clamp(o.rates[k], 0, 1);
      stages.push({ name: C.FUNNEL_LABELS[i], key: k, count: n, cost: C.safeDiv(spend, n) });
    });
    return { spend: spend, stages: stages, final: n, costPerFinal: C.safeDiv(spend, n) };
  };

  // Sensitivity: move one step at a time to its benchmark-high value.
  C.funnelSensitivity = function (o, highs) {
    var base = C.funnel(o);
    var out = C.FUNNEL_STEPS.map(function (k) {
      var r = {}; for (var j in o.rates) r[j] = o.rates[j];
      r[k] = Math.max(o.rates[k], highs[k]);
      var f = C.funnel({ impressions: o.impressions, cpm: o.cpm, rates: r });
      return { key: k, to: r[k], final: f.final,
               lift: base.final > 0 ? f.final / base.final - 1 : 0,
               costPerFinal: f.costPerFinal };
    });
    var best = out.reduce(function (a, b) { return b.lift > a.lift ? b : a; }, out[0]);
    return { base: base, steps: out, biggest: best.key };
  };

  /* ---------- 3. Experiment power ---------- */
  // Inverse standard normal CDF (Acklam's rational approximation, |rel err| < 1.2e-9 after refinement-free use).
  C.invNorm = function (p) {
    if (p <= 0 || p >= 1) throw new RangeError('p must be in (0,1)');
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    var b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    var d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    var pl = 0.02425, q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
    q = p - 0.5; r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q / (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  };

  // Two-proportion z-test sample size per arm, equal allocation, two-sided.
  // n = [z(1-a/2)*sqrt(2*pbar*(1-pbar)) + z(1-b)*sqrt(p1(1-p1)+p2(1-p2))]^2 / (p2-p1)^2
  C.samplePerArm = function (p1, relLift, alpha, power) {
    var p2 = p1 * (1 + relLift);
    if (!(p1 > 0 && p1 < 1 && p2 > 0 && p2 < 1 && p2 !== p1)) return null;
    var za = C.invNorm(1 - alpha / 2), zb = C.invNorm(power), pbar = (p1 + p2) / 2;
    var num = za * Math.sqrt(2 * pbar * (1 - pbar)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
    return Math.ceil(num * num / ((p2 - p1) * (p2 - p1)));
  };

  C.power = function (o) { // {baseline, lift, alpha, power, dailyTraffic}
    var n = C.samplePerArm(o.baseline, o.lift, o.alpha, o.power);
    if (n == null) return { perArm: null, total: null, days: null, conversionsPerArm: null };
    return { perArm: n, total: 2 * n,
             days: o.dailyTraffic > 0 ? Math.ceil(2 * n / o.dailyTraffic) : null,
             conversionsPerArm: n * o.baseline };
  };

  /* ---------- 4. Creator pilot ---------- */
  // {creators, fee, boost, reach, clickRate, installRate, purchaseRate}
  C.creator = function (o) {
    var cost = o.creators * (o.fee + (o.boost || 0));
    var views = o.creators * o.reach;
    var clicks = views * o.clickRate;
    var installs = clicks * o.installRate;
    var buyers = installs * o.purchaseRate;
    return { cost: cost, views: views, clicks: clicks, installs: installs, buyers: buyers,
             perInstall: C.safeDiv(cost, installs), perBuyer: C.safeDiv(cost, buyers) };
  };

  /* ---------- 5. Payback / contribution ---------- */
  // Retention: month 1 = 100% of first buyers; month 2 = 1 - earlyDrop; then x (1 - churn) each month.
  C.retention = function (m, earlyDrop, churn) {
    if (m <= 1) return 1;
    return (1 - earlyDrop) * Math.pow(1 - churn, m - 2);
  };
  // {avgBuy, takeRate, otherRev, varCost, earlyDrop, churn, months, cac}
  C.payback = function (o) {
    var perActive = o.avgBuy * o.takeRate + (o.otherRev || 0) - (o.varCost || 0);
    var cum = 0, series = [], paybackMonth = null;
    for (var m = 1; m <= o.months; m++) {
      var act = C.retention(m, o.earlyDrop, o.churn);
      var c = act * perActive;
      cum += c;
      series.push({ month: m, active: act, contribution: c, cumulative: cum });
      if (paybackMonth === null && cum >= o.cac && o.cac >= 0) paybackMonth = m;
    }
    return { perActiveMonth: perActive, total: cum, series: series, paybackMonth: paybackMonth,
             ratio: o.cac > 0 ? cum / o.cac : null };
  };

  /* ---------- 6. Content time budget ---------- */
  // formats: [{perWeek, hours, review}], fixed: hours/week, localisation: extra share (0.3 = +30%), capacity: hours/week
  C.contentBudget = function (o) {
    var rows = o.formats.map(function (f) {
      var h = f.perWeek * (f.hours + f.review) * (1 + (f.localised ? o.localisation : 0));
      return { name: f.name, hours: h };
    });
    var make = rows.reduce(function (a, r) { return a + r.hours; }, 0);
    var total = make + o.fixed;
    return { rows: rows, make: make, total: total, capacity: o.capacity,
             utilisation: o.capacity > 0 ? total / o.capacity : null };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = C;
  else root.PFCalc = C;
})(this);
