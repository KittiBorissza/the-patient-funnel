/* Forecast maths for the channel planner. Exposed as PlanCalc (window) or module.exports (tests).
   Model from the original Growth Desk planner; scenario factor 0.7 / 1 / 1.3; referral installs capped. */
(function (root) {
  var P = {};
  P.SCENARIOS = { cautious: 0.7, base: 1, upside: 1.3 };
  P.K = 0.15; // CPI rise per €1,000 of channel spend
  P.CHANNELS = [
    { id: 'search', name: 'Search ads', share: 30, cpi: 8, buy: 15 },
    { id: 'social', name: 'Paid social', share: 30, cpi: 5, buy: 8 },
    { id: 'creators', name: 'Creators and podcasts', share: 15, cpi: 6, buy: 12 },
    { id: 'referral', name: 'Referrals', share: 15, cpi: 3, buy: 22, capInstalls: 150 },
    { id: 'community', name: 'Newsletter and community', share: 10, cpi: 4, buy: 18 }
  ];
  // Integer split of `total` in proportion to raw weights (largest remainder). Always sums to total.
  P.distribute = function (raw, total) {
    var clean = raw.map(function (v) { return Number.isFinite(v) && v > 0 ? v : 0; });
    var sum = clean.reduce(function (a, b) { return a + b; }, 0);
    if (!(sum > 0)) clean = clean.map(function () { return 1; }), sum = clean.length;
    var exact = clean.map(function (v) { return v * total / sum; });
    var fl = exact.map(function (x) { return Math.floor(x + 1e-9); }), left = total - fl.reduce(function (a, b) { return a + b; }, 0);
    var order = exact.map(function (x, k) { return [x - fl[k], k]; }).sort(function (a, b) { return b[0] - a[0] || a[1] - b[1]; });
    for (var k = 0; k < left; k++) fl[order[k][1]]++;
    return fl;
  };
  // Set channel i to v (0–100). The others keep their exact proportions and fill the rest,
  // so shares always sum to 100. Kept as decimals internally to avoid rounding drift;
  // P.display() gives whole percentages that also sum to 100.
  P.rebalance = function (shares, i, v) {
    v = Math.max(0, Math.min(100, Math.round(Number(v) || 0)));
    var rest = 100 - v, osum = 0, n = 0, j;
    for (j = 0; j < shares.length; j++) if (j !== i) { osum += Math.max(0, shares[j]); n++; }
    var out = shares.slice();
    for (j = 0; j < shares.length; j++) {
      if (j === i) out[j] = v;
      else out[j] = osum > 0 ? Math.max(0, shares[j]) * rest / osum : rest / n;
    }
    return out;
  };
  P.display = function (shares) { return P.distribute(shares, 100); };
  P.model = function (budget, shares, factor, channels) {
    channels = channels || P.CHANNELS; factor = factor || 1;
    var rows = channels.map(function (c, i) {
      var allocated = budget * (shares[i] || 0) / 100;
      var cpi = c.cpi * (1 + P.K * allocated / 1000) / factor;
      var installs = allocated > 0 ? allocated / cpi : 0;
      var capped = false;
      if (c.capInstalls != null && installs > c.capInstalls) { installs = c.capInstalls; capped = true; }
      var spend = installs * cpi;
      var buyers = installs * Math.min(c.buy * factor / 100, 1);
      return { id: c.id, allocated: allocated, cpi: cpi, installs: installs, spend: spend, unused: allocated - spend, buyers: buyers, capped: capped };
    });
    var t = rows.reduce(function (a, r) { a.spend += r.spend; a.installs += r.installs; a.buyers += r.buyers; a.unused += r.unused; return a; }, { spend: 0, installs: 0, buyers: 0, unused: 0 });
    t.perBuyer = t.buyers > 0 ? t.spend / t.buyers : null;
    return { rows: rows, total: t };
  };
  // Markets: Invity's home market plus the host states listed for it in ESMA's MiCA register (checked 9 Nov 2026),
  // and Hungary, added for local knowledge and to be confirmed with Invity.
  // cost = synthetic cost index applied to every channel's base cost per install; refCap = synthetic referral cap
  // (installs a month); budget = synthetic starting budget. None of these are Invity data.
  P.MARKETS = [
    { id: 'cz', name: 'Czechia', cost: 1.0, refCap: 150, budget: 2000, langShort: 'CS, EN', langNote: 'Marketing in Czech. The public app UI lists Czech and English.' },
    { id: 'at', name: 'Austria', cost: 1.4, refCap: 40, budget: 1000, langShort: 'DE, EN', langNote: 'Marketing in German. The public app UI lists German and English.' },
    { id: 'de', name: 'Germany', cost: 1.5, refCap: 80, budget: 2000, langShort: 'DE, EN', langNote: 'Marketing in German. The public app UI lists German and English.' },
    { id: 'it', name: 'Italy', cost: 1.2, refCap: 50, budget: 1000, langShort: 'IT, EN', langNote: 'Marketing in Italian. Italian is not listed in the public app UI languages, so the app may show English until that is confirmed.' },
    { id: 'sk', name: 'Slovakia', cost: 0.9, refCap: 40, budget: 750, langShort: 'SK, EN', langNote: 'Marketing in Slovak. Slovak is not listed in the public app UI languages, so the app may show English or Czech until that is confirmed.' },
    { id: 'es', name: 'Spain', cost: 1.1, refCap: 60, budget: 1000, langShort: 'ES, EN', langNote: 'Marketing in Spanish. The public app UI lists Spanish and English.' },
    { id: 'nl', name: 'Netherlands', cost: 1.5, refCap: 40, budget: 1000, langShort: 'NL, EN', langNote: 'Marketing in Dutch. Dutch is not listed in the public app UI languages, so the app may show English until that is confirmed.' },
    { id: 'pl', name: 'Poland', cost: 0.9, refCap: 60, budget: 1000, langShort: 'PL, EN', langNote: 'Marketing in Polish. Polish is not listed in the public app UI languages, and should be confirmed before an in-app recording is planned.' },
    { id: 'hu', name: 'Hungary', cost: 0.9, refCap: 30, budget: 750, toConfirm: true, langShort: 'HU, EN', langNote: 'Marketing in Hungarian, which I can check myself. Whether Hungary is served, and whether the app has a Hungarian UI, is to confirm with Invity.' }
  ];
  // Country CPMs: AdSpendSpy 2026 estimates for a standard Meta campaign (EUR).
  // European DTC medians: adtribute, September 2026.
  P.BENCH = {
    cpm: {
      cz: { mid: 6.04, lo: 5.02, hi: 6.72 },
      at: { mid: 8.09, lo: 6.73, hi: 9.01 },
      de: { mid: 9.37, lo: 7.79, hi: 10.43 },
      it: { mid: 6.96, lo: 5.78, hi: 7.74 },
      sk: { mid: 5.25, lo: 4.37, hi: 5.85 },
      es: { mid: 7.10, lo: 5.90, hi: 7.90 },
      nl: { mid: 8.52, lo: 7.08, hi: 9.48 },
      pl: { mid: 5.33, lo: 4.43, hi: 5.93 },
      hu: { mid: 5.11, lo: 4.25, hi: 5.69 }
    },
    euDtcCpm: 12.76, euDtcCpmLo: 9.19, euDtcCpmHi: 16.56,
    euDtcCtr: 1.19, euDtcCtrLo: 0.92, euDtcCtrHi: 1.48
  };
  P.socialForecast = function (spend, cpm, ctrPct) {
    if (!(spend > 0) || !(cpm > 0)) return { impressions: 0, clicks: 0, cpc: null };
    var impressions = spend * 1000 / cpm;
    var clicks = impressions * (ctrPct / 100);
    return { impressions: impressions, clicks: clicks, cpc: clicks > 0 ? spend / clicks : null };
  };
  // The five channels for one market: base CPI × market cost index; the referral cap is the market's own.
  P.marketChannels = function (m) {
    return P.CHANNELS.map(function (c) {
      var o = { id: c.id, name: c.name, share: c.share, cpi: c.cpi * m.cost, buy: c.buy };
      if (c.capInstalls != null) o.capInstalls = m.refCap;
      return o;
    });
  };
  // Fresh, independent plan per market: its own budget and its own channel shares.
  P.initialPlans = function () {
    var out = {};
    P.MARKETS.forEach(function (m) { out[m.id] = { budget: m.budget, shares: P.CHANNELS.map(function (c) { return c.share; }), cpm: P.BENCH.cpm[m.id].mid, ctr: P.BENCH.euDtcCtr }; });
    return out;
  };
  // Every market modelled separately with the same maths, plus the sum across markets.
  P.portfolio = function (plans, factor) {
    var rows = P.MARKETS.map(function (m) {
      var pl = plans[m.id], r = P.model(pl.budget, pl.shares, factor, P.marketChannels(m));
      return { id: m.id, name: m.name, budget: pl.budget, total: r.total, rows: r.rows };
    });
    var t = rows.reduce(function (a, r) { a.budget += r.budget; a.spend += r.total.spend; a.installs += r.total.installs; a.buyers += r.total.buyers; a.unused += r.total.unused; return a; }, { budget: 0, spend: 0, installs: 0, buyers: 0, unused: 0 });
    t.perBuyer = t.buyers > 0 ? t.spend / t.buyers : null;
    return { markets: rows, total: t };
  };
  root.PlanCalc = P;
  if (typeof module !== 'undefined' && module.exports) module.exports = P;
})(typeof window !== 'undefined' ? window : this);

// Standard-normal quantile by bisection with an erf approximation.
// The allowed significance and power inputs stay well inside these bounds.
function normalQuantile(probability) {
  let lower = -8;
  let upper = 8;
  for (let i = 0; i < 50; i++) {
    const midpoint = (lower + upper) / 2;
    const x = Math.abs(midpoint) / Math.SQRT2;
    const t = 1 / (1 + 0.3275911 * x);
    const polynomial = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t
      - 0.284496736) * t + 0.254829592) * t;
    const erf = Math.sign(midpoint) * (1 - polynomial * Math.exp(-x * x));
    if ((1 + erf) / 2 < probability) lower = midpoint;
    else upper = midpoint;
  }
  return (lower + upper) / 2;
}

const model = typeof module !== 'undefined' ? module.exports : window.PlanCalc;

model.delivery = function (spend, cpm, ctr, hold, cost, funnelRates) {
  const media = model.socialForecast(spend, cpm, ctr);
  const installs = funnelRates ? media.clicks * funnelRates.clickInstall : null;
  const purchases = funnelRates ? installs * funnelRates.installBuy : spend / cost;
  return {
    ...media, spend, installs, purchases,
    watches: media.impressions * hold,
    cpa: purchases > 0 ? spend / purchases : null
  };
};

// Normal approximation for the difference in two proportions at fixed
// allocation. Variance under H0 uses the pooled rate, and H1 uses arm rates.
model.sampleSize = function ({ baseline, lift, allocation, alpha, power }) {
  const alternative = baseline + lift;
  const b = 1 - allocation;
  if (!(baseline > 0 && lift > 0 && alternative < 1 && allocation > 0 && b > 0
    && alpha > 0 && alpha < 1 && power > 0 && power < 1)) return null;
  const pooled = allocation * baseline + b * alternative;
  const nullVariance = pooled * (1 - pooled) * (1 / allocation + 1 / b);
  const altVariance = baseline * (1 - baseline) / allocation + alternative * (1 - alternative) / b;
  const critical = normalQuantile(1 - alpha / 2) * Math.sqrt(nullVariance);
  const sensitivity = normalQuantile(power) * Math.sqrt(altVariance);
  const total = ((critical + sensitivity) / lift) ** 2;
  return { a: Math.ceil(total * allocation), b: Math.ceil(total * b) };
};

// Budget Forecast Calculator: one monthly budget per market, two ways to spend it.
model.PRESETS = [
  { name: 'Minimum', amount: 250 },
  { name: 'Medium', amount: 500 },
  { name: 'Optimum', amount: 1000 },
  { name: 'Growth Machine', amount: 1500 }
];
model.DEFAULT_MARKETS = ['cz', 'de', 'es', 'pl'];
const HOLD = { lo: 0.2, hi: 0.3 };
const viaCpm = rate => (spend, id) => {
  const cpm = model.BENCH.cpm[id];
  return { lo: spend * 1000 / cpm.hi * rate.lo, hi: spend * 1000 / cpm.lo * rate.hi };
};
const perUnit = cost => spend => ({ lo: spend / cost.hi, hi: spend / cost.lo });
model.TEST_CHANNELS = [
  {
    id: 'reels', name: 'Meta Reels video', unit: 'views past the opening', share: 40, estimate: viaCpm(HOLD),
    fit: 'Cost from country Meta CPMs, 2026. The 20–30% view rate past the opening is my assumption.', fitLevel: 'close'
  },
  {
    id: 'meta-link', name: 'Meta link ads', unit: 'link clicks', share: 20, clicks: true,
    estimate: viaCpm({ lo: model.BENCH.euDtcCtrLo / 100, hi: model.BENCH.euDtcCtrHi / 100 }),
    fit: 'Country Meta CPMs with European e-commerce link CTR. Right region and platform, different sector.', fitLevel: 'partial'
  },
  {
    id: 'search', name: 'Google Search', unit: 'clicks', share: 20, clicks: true, estimate: perUnit({ lo: 3, hi: 7 }),
    fit: 'US finance and insurance search CPCs (about $3–$7), used as a €3–€7 planning range.', fitLevel: 'loose'
  },
  {
    id: 'youtube', name: 'YouTube in-stream', unit: 'views', share: 20, estimate: perUnit({ lo: 0.01, hi: 0.05 }),
    fit: 'Global vendor estimates of about $0.01–$0.03 per view, widened to €0.01–€0.05.', fitLevel: 'loose'
  }
];

// What a result of this size lets the team decide, judged on the low end of the range.
// shortcut: fixed volume thresholds for clicks and views, replace with Invity's own test history.
model.testDecision = function (channelId, spend, markets, low) {
  if (!(spend > 0)) return { enough: false, text: 'No paid test. Organic publishing and listening still run.' };
  if (channelId === 'reels') {
    const reachedPerArm = spend * 1000 / Math.max(...markets.map(id => model.BENCH.cpm[id].hi)) / 1.2 / 2 / markets.length;
    const needed = model.sampleSize({ baseline: 0.25, lift: 0.03, allocation: 0.5, alpha: 0.05, power: 0.8 }).a;
    return reachedPerArm >= needed
      ? { enough: true, text: 'Shows which opening holds attention better in each market. Comparing first purchases needs more data.' }
      : { enough: false, text: 'Shows where viewers drop off, but not which opening wins in each market. Run one version or pool markets.' };
  }
  if (channelId === 'youtube') return low >= 2000
    ? { enough: true, text: 'Shows whether a walkthrough keeps viewers to the fee screen.' }
    : { enough: false, text: 'A format check only: too few views to compare versions.' };
  return low >= 300
    ? { enough: true, text: 'Shows which messages bring people to the app page.' }
    : { enough: false, text: 'A landing-page check only: too few clicks to compare messages.' };
};

model.budgetForecast = function ({ perMarket, markets, focus = 'reels', shares, purchaseRate }) {
  const total = perMarket * markets.length;
  const channels = model.TEST_CHANNELS;
  const weights = shares || channels.map(channel => channel.share);
  const line = (channel, spend) => {
    const range = { lo: 0, hi: 0 };
    for (const id of markets) {
      const one = channel.estimate(spend / markets.length, id);
      range.lo += one.lo;
      range.hi += one.hi;
    }
    const purchases = channel.clicks && purchaseRate > 0 ? { lo: range.lo * purchaseRate, hi: range.hi * purchaseRate } : null;
    const decision = model.testDecision(channel.id, spend, markets, range.lo);
    if (channel.clicks && spend > 0 && !purchases) decision.text += ' First purchases need a conversion assumption.';
    return { id: channel.id, name: channel.name, unit: channel.unit, fit: channel.fit, fitLevel: channel.fitLevel,
      spend, perMarket: spend / markets.length, ...range, purchases,
      decision };
  };
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  return {
    total,
    focused: line(channels.find(channel => channel.id === focus), total),
    spread: channels.map((channel, i) => line(channel, total * weights[i] / sum))
  };
};
