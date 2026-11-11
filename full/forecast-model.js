/* Forecast maths for the Strategy Lab and the homepage preview. Exposed as PlanCalc (window) or module.exports (tests). */
(function (root) {
  var P = {};
  // Invity's home market plus the host states in ESMA's MiCA register (checked 9 Nov 2026); Hungary is to confirm.
  P.MARKETS = [
    { id: 'cz', name: 'Czechia', langShort: 'CS, EN', langNote: 'Marketing in Czech. The public app UI lists Czech and English.' },
    { id: 'at', name: 'Austria', langShort: 'DE, EN', langNote: 'Marketing in German. The public app UI lists German and English.' },
    { id: 'de', name: 'Germany', langShort: 'DE, EN', langNote: 'Marketing in German. The public app UI lists German and English.' },
    { id: 'it', name: 'Italy', langShort: 'IT, EN', langNote: 'Marketing in Italian. Italian is not listed in the public app UI languages, so the app may show English until that is confirmed.' },
    { id: 'sk', name: 'Slovakia', langShort: 'SK, EN', langNote: 'Marketing in Slovak. Slovak is not listed in the public app UI languages, so the app may show English or Czech until that is confirmed.' },
    { id: 'es', name: 'Spain', langShort: 'ES, EN', langNote: 'Marketing in Spanish. The public app UI lists Spanish and English.' },
    { id: 'nl', name: 'Netherlands', langShort: 'NL, EN', langNote: 'Marketing in Dutch. Dutch is not listed in the public app UI languages, so the app may show English until that is confirmed.' },
    { id: 'pl', name: 'Poland', langShort: 'PL, EN', langNote: 'Marketing in Polish. Polish is not listed in the public app UI languages, and should be confirmed before an in-app recording is planned.' },
    { id: 'hu', name: 'Hungary', toConfirm: true, langShort: 'HU, EN', langNote: 'Marketing in Hungarian, which I can check myself. Whether Hungary is served, and whether the app has a Hungarian UI, is to confirm with Invity.' }
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
    id: 'reels', name: 'Meta Reels video', unit: 'views past the opening', share: 50, estimate: viaCpm(HOLD),
    fit: 'Cost from country Meta CPMs, 2026. The 20–30% view rate past the opening is my assumption.', fitLevel: 'close'
  },
  {
    id: 'meta-link', name: 'Meta link ads', unit: 'link clicks', share: 25, clicks: true,
    estimate: viaCpm({ lo: model.BENCH.euDtcCtrLo / 100, hi: model.BENCH.euDtcCtrHi / 100 }),
    fit: 'Country Meta CPMs with European e-commerce link CTR. Right region and platform, different sector.', fitLevel: 'partial'
  },
  {
    id: 'search', name: 'Google Search', unit: 'clicks', share: 25, clicks: true, estimate: perUnit({ lo: 0.5, hi: 3 }),
    fit: 'Proxy: European ecommerce search median (€0.46) to the US finance median ($3.39). No EU fintech or crypto benchmark exists; crypto keywords likely cost more and need MiCA and Google certification.', fitLevel: 'proxy'
  },
  {
    id: 'youtube', name: 'YouTube in-stream', unit: 'views', share: 0, estimate: perUnit({ lo: 0.02, hi: 0.05 }),
    fit: 'Global vendor estimate, no credible EU benchmark. Left out of the default split; add a share to include it.', fitLevel: 'loose'
  }
];

const hookTest = { baseline: 0.25, lift: 0.03, allocation: 0.5, alpha: 0.05, power: 0.8 };
const hookSample = model.sampleSize(hookTest).a;
const sampleFormat = new Intl.NumberFormat('en-GB');

model.testDecision = function (channelId, spend, markets) {
  if (!(spend > 0)) return { label: 'No paid test', text: 'Organic publishing and listening still run.' };
  if (channelId === 'reels') {
    const highestCpm = Math.max(...markets.map(id => model.BENCH.cpm[id].hi));
    const projectedPerVersion = Math.floor(spend * 1000 / highestCpm / 1.2 / 2 / markets.length);
    return {
      label: projectedPerVersion >= hookSample ? 'Potentially enough for a hook test' : 'Below the hook-test sample target',
      text: `Target ${sampleFormat.format(hookSample)} reached people per version per market. The low-end estimate is ${sampleFormat.format(projectedPerVersion)} per version in the highest-cost market. Check actual unique reach and random assignment.`
    };
  }
  if (channelId === 'youtube') return {
    label: 'Directional video check',
    text: 'Use view and retention data to spot drop-off. Size a separate test before comparing versions.'
  };
  return {
    label: 'Directional traffic check',
    text: 'Use click data to check traffic. Size a separate test before comparing messages.'
  };
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
    const decision = model.testDecision(channel.id, spend, markets);
    if (channel.clicks && spend > 0 && !purchases) decision.text += ' First purchases need a conversion assumption.';
    return { id: channel.id, name: channel.name, unit: channel.unit, fit: channel.fit, fitLevel: channel.fitLevel,
      spend, perMarket: spend / markets.length, ...range, purchases,
      decision };
  };
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const spread = channels.map((channel, i) => line(channel, total * weights[i] / sum));
  return {
    total,
    focused: line(channels.find(channel => channel.id === focus), total),
    spread,
    // Each market gets an even share of every line; Meta estimates use that market's own CPM.
    byMarket: markets.map(id => ({
      id,
      lines: channels.map((channel, i) => ({ id: channel.id, spend: spread[i].perMarket, ...channel.estimate(spread[i].perMarket, id) }))
    }))
  };
};
