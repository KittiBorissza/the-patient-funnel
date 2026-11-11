'use strict';

// One illustrative reporting week for the Before you hit Buy hook test. Every value is synthetic.
const dashboardData = {
  label: 'Illustrative data',
  week: { start: '2026-12-07', end: '2026-12-13', market: 'One eligible market', placement: 'Instagram Reels', note: 'Synthetic week for the portfolio. None of these figures is Invity data.' },
  metrics: [
    { key: 'spend', name: 'Spend', unit: 'EUR', definition: 'Media spend for the week, before agency or production costs.' },
    { key: 'reach', name: 'Reach', unit: 'people', definition: 'Unique people who saw the ad at least once. Versions are randomly assigned, so their audiences do not overlap and reach adds up.' },
    { key: 'plays', name: 'Video plays', unit: 'plays', definition: 'Plays of at least one frame. Denominator for hook hold rate.' },
    { key: 'holds', name: 'Held past the hook', unit: 'plays', definition: 'Plays that continued past the opening line, at 3 seconds.' },
    { key: 'holdRate', name: 'Hook hold rate', unit: '%', definition: 'Held past the hook ÷ video plays.', numerator: 'holds', denominator: 'plays' },
    { key: 'guideVisits', name: 'Guide visits', unit: 'sessions', definition: 'Sessions on the first-buy walkthrough from this ad’s tracked link.' },
    { key: 'firstBuys', name: 'Attributed first buys', unit: 'purchases', definition: 'First purchases attributed to the ad through consented tracking. Not available until that tracking exists.' }
  ],
  // Like-for-like: same week, market, placement, audience, budget and destination; only the opening line differs.
  rows: [
    { hook: 'Before you hit Buy, read this screen.', spend: 150, reach: 2140, plays: 2610, holds: 860, guideVisits: 41, firstBuys: null },
    { hook: 'What will your first Bitcoin purchase cost?', spend: 150, reach: 2080, plays: 2550, holds: 905, guideVisits: 47, firstBuys: null }
  ],
  totals: { spend: 300, reach: 4220, plays: 5160, holds: 1765, guideVisits: 88, firstBuys: null },
  missing: 'Not available',
  sampleTarget: { reachPerVersion: 3400, source: 'strategy.html#sample' },
  decision: {
    title: 'Keep both hooks running for another week. No winner yet.',
    why: 'Each version reached about 2,100 people, below the planned 3,400 per version, and the hold rates are 2.5 points apart (33.0% and 35.5%).',
    next: 'Read hook hold rate again once each version passes the planned sample. Add first buys only once consented attribution is available.',
    creative: 'ad-gallery.html#fees-ai'
  }
};

globalThis.dashboardData = dashboardData;

// Self-check: summed counts reconcile with the totals (run with node dashboard-data.js).
console.assert(['spend', 'reach', 'plays', 'holds', 'guideVisits'].every(key => dashboardData.rows.reduce((sum, row) => sum + row[key], 0) === dashboardData.totals[key]), 'dashboard-data: totals do not reconcile');
