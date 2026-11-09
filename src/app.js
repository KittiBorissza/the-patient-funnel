(function () {
  'use strict';
  var C = window.PFCalc;
  var LOC = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-IE';
  function nf(o) { try { return new Intl.NumberFormat(LOC, o); } catch (e) { return new Intl.NumberFormat('en-IE', o); } }
  function fmtE(x, d) { if (x == null || !isFinite(x)) return '—'; d = d == null ? (Math.abs(x) < 100 ? 2 : 0) : d; return nf({ style: 'currency', currency: 'EUR', minimumFractionDigits: d, maximumFractionDigits: d }).format(x); }
  function fmtN(x, d) { if (x == null || !isFinite(x)) return '—'; d = d == null ? (Math.abs(x) < 10 ? 1 : 0) : d; return nf({ minimumFractionDigits: d, maximumFractionDigits: d }).format(x); }
  function fmtP(x, d) { if (x == null || !isFinite(x)) return '—'; return nf({ style: 'percent', minimumFractionDigits: d == null ? 0 : d, maximumFractionDigits: d == null ? 1 : d }).format(x); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------------- Sources ---------------- */
  var SOURCES = {
    S1: ['WordStream / LocaliQ, “Facebook Ads Benchmarks 2025” (PDF)', 'Sep 2025; 1,180 US campaigns, Apr 2024–Jun 2025', 'https://www.wordstream.com/wp-content/uploads/2025/09/ws-guide-2025-fb-benchmarks.pdf'],
    S2: ['WordStream, “Facebook Ads Benchmarks 2026”', '2026; US', 'https://www.wordstream.com/blog/facebook-ads-benchmarks-2026'],
    S3: ['Emplifi, “Worldwide Social Media Benchmarks: Finance Q2 2026”', '22 Jul 2026; worldwide; Apr–Jun 2026', 'https://emplifi.io/resources/q2-2026-finance-worldwide-benchmarks/'],
    S4: ['Pantheon Meta CPM estimates, via TransparencyAds “Meta Ads Cost in Europe: CPM by EU Country (2026)”', 'generated 17 Oct 2026; EU; Aug 2025–Jul 2026; all categories', 'https://www.transparencyads.com/meta-ads-cost-europe.html'],
    S5: ['Business of Apps, “App User Acquisition Costs (2025)”, incl. AppsFlyer finance CPI', '2025; Europe and global; read via search index 9 Nov 2026 (direct fetch blocked)', 'https://www.businessofapps.com/marketplace/user-acquisition/research/user-acquisition-costs/'],
    S6: ['Adjust, “The finance app insights report: 2025 edition” (press release)', '29 Oct 2025; global; H1 2025', 'https://www.businesswire.com/news/home/20251029280342/en/New-Adjust-Report-Finds-Global-Finance-App-Market-Shifting-From-Rapid-Expansion-to-Sustainable-Growth-In-2025'],
    S7: ['Promodo, “Fintech Marketing Benchmarks 2026” (citing Adjust)', '2026; global; crypto-app CPI, CPC, CPM, IPM, CTR; finance D30 retention', 'https://www.promodo.com/blog/fintech-marketing-benchmarks'],
    S8: ['Hootsuite, “X (Twitter) ads: the practical 2025 guide” (citing AgencyAnalytics, 7,000 agencies)', '2025; global', 'https://blog.hootsuite.com/twitter-ads/'],
    S9: ['CleverTap, fintech benchmark report (press release)', 'undated on page, likely pre-2021; global', 'https://clevertap.com/news/press-release/clevertaps-fintech-benchmark-report-1-in-5-users-that-install-fintech-apps-sign-up-within-week-one/'],
    S10: ['Signicat, “The onboarding advantage” (citing Battle to Onboard 2022)', '21 Mar 2025 (data 2022); Europe', 'https://www.signicat.com/blog/the-onboarding-advantage-how-operational-efficiency-boosts-conversion'],
    S11: ['Sumsub, “How Sumsub’s Reusable KYC Unlocks Smarter and Compliant Onboarding”', '2025; Europe', 'https://sumsub.com/customers/reusable-kyc-case/'],
    S12: ['NIL Club, crypto exchange case study (vendor; “industry” sign-up→funded figure)', 'undated; US', 'https://nilclub.com/business/case-studies/crypto-exchange'],
    S13: ['Spojly, “Transparentní ceny v influencer marketingu” (Czech rate card)', '22 Nov 2025; Czechia; not finance-specific', 'https://www.spojly.cz/blog/transparentni-ceny-influencer-marketingu'],
    S14: ['European Central Bank, euro foreign exchange reference rates', '9 Nov 2026: €1 = $1.1193 = 24.365 CZK', 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'],
    S15: ['Google Ads policy help, “Cryptocurrencies and related products”', 'read 9 Nov 2026; EU rule enforced from 23 Apr 2025', 'https://support.google.com/adspolicy/answer/14009787?hl=en'],
    S16: ['Meta Transparency Center, “Cryptocurrency products and services”', 'read 9 Nov 2026', 'https://transparency.meta.com/policies/ad-standards/restricted-goods-services/cryptocurrency-products-and-services/'],
    S17: ['adbench.io, “Crypto Ads on Meta, X, TikTok and Reddit: Rules, Checked” (secondary)', 'read 9 Nov 2026', 'https://adbench.io/crypto-ads-on-meta-x-tiktok-reddit/'],
    S18: ['Crypto Economy, “X Paid Partnership Rules Bar Crypto Promos in EU, UK, AU” (citing X Help Center)', '2 Mar 2026', 'https://crypto-economy.com/x-paid-partnership-rules-bar-crypto-promos/'],
    S19: ['Invity, home page', 'read 9 Nov 2026', 'https://invity.io/'],
    S20: ['Invity, Turbo Buy page', 'read 9 Nov 2026', 'https://invity.io/turbo-buy'],
    S21: ['Invity blog, Turbo Buy fee update', '13 Jun 2026', 'https://invity.io/blog/turbo-buy-lower-fees'],
    S22: ['Invity, Social Media Lead job ad (StartupJobs)', 'posted 22 Oct 2026', 'https://www.startupjobs.cz/nabidka/108781/social-media-lead'],
    S23: ['Bitvocation blog, “POW Lab October recap”', 'Nov 2026', 'https://blog.bitvocation.com/p/pow-lab-october-recap-less-waiting'],
    S24: ['Invity About us (Academy, Straight from Invity newsletter, Broken Money eBook)', 'read 9 Nov 2026', 'https://www.invity.io/about-us'],
    S25: ['Invity blog, “How to Bitcoin” directory', '9 Jan 2025; read 9 Nov 2026', 'https://www.invity.io/blog/how-to-bitcoin-everything-you-wanted-to-know-about-crypto'],
    S26: ['Invity blog, “We’re Lowering Our Turbo Buy Fees to 9.9%!”', '13 Jun 2026', 'https://www.invity.io/blog/turbo-buy-lower-fees'],
    S27: ['Invity blog, “MiCA and the July 1, 2026 deadline”', '24 Jun 2026', 'https://www.invity.io/blog/mica-july-2026-deadline-what-it-means-for-your-bitcoin'],
    S28: ['ESMA interactive rulebook, MiCA Art. 66', 'read 9 Nov 2026', 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-66-obligation-act-honestly-fairly'],
    S29: ['ESMA interactive rulebook, MiCA Art. 7 Marketing communications', 'read 9 Nov 2026', 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-7-marketing-communications'],
    S30: ['Broken Money and the Way Out (eBook landing)', 'read 9 Nov 2026', 'https://www.invity.io/broken-money-and-the-way-out'],
    S31: ['Market Researcher pack: Invity MiCA Bitcoin-only piackutatás + /workspace/invity-viz charts', '9 Nov 2026', 'https://cursor.com/canvas/store-80cd9fe5-2995-4eb2-83ad-cd77dc344452/53a3b53f-6d2c-4bc1-a00c-e0e28ffdedea'],
    S32: ['Cointelegraph / Crypto Economy on X Paid Partnerships crypto rules in EU/UK/AU (secondary; X Help 403)', '2–3 Mar 2026', 'https://crypto-economy.com/x-paid-partnership-rules-bar-crypto-promos/']
  };

  /* Benchmark table (also mirrored in ASSUMPTIONS.md) */
  var BENCH = [
    ['Meta CPM, Czechia', '€4.47', '€5.54', '€6.70', 'S4 · Pantheon estimate, all categories; finance may differ'],
    ['Meta CPM, Germany', '€7.15', '€8.98', '€10.72', 'S4 · same; DE/CZ ratio 1.62 used as the Germany multiplier'],
    ['Meta CPM, finance advertisers (context)', '—', '€1.32', '—', 'S3 · Emplifi worldwide finance median $1.48, Q2 2026; global mix, not used as default'],
    ['Meta link CTR, finance', '0.40%', '1.0%', '1.46%', 'S3 IG feed ~0.40%; S1 0.98% (US 2025); S3 1.22% (finance, worldwide); S7 crypto apps 1.2%; S2 1.46% (US 2026)'],
    ['Meta CPC, finance', '€0.12', '€0.55', '€1.09', 'S3 $0.13 worldwide; base implied by CZ CPM ÷ 1% CTR; S1 $1.22 US'],
    ['X ads CPC', '€0.16', '—', '€0.66', 'S8 · median $0.18 (AgencyAnalytics); $0.74 Hootsuite’s own account'],
    ['X ads CPM', '—', '€1.87', '—', 'S8 · $2.09, Hootsuite’s own account'],
    ['Cost per install, finance/crypto app (Meta, CZ)', '€2.59', '€6.00', '€9.56', 'Low S7 crypto CPI $2.90 (global H1 2025); base S5 Europe finance CPI $7.40 = €6.61 × CZ CPM index 0.88 ≈ €5.8, rounded; high S5 AppsFlyer finance iOS social & search $10.70'],
    ['Cost per install, Germany', '€4.20', '€9.70', '€15.50', 'CZ values × 1.62 (S4 CPM ratio). Derived, not a published DE figure'],
    ['Click → install', '5%', '10%', '15%', 'S7 crypto IPM 0.97 ÷ (CTR 1.2% × 1,000) ≈ 8%; range is analyst estimate'],
    ['Install → sign-up', '21%', '30%', '45%', 'Low S9 (21% within first week, fintech, old); base and high analyst estimate'],
    ['Sign-up → KYC completed', '30%', '50%', '70%', 'S11 KYC drop-off “exceeding 50%, sometimes 70%”; S10 68% abandoned a financial application (2022); high analyst estimate'],
    ['KYC completed → first purchase', '25%', '55%', '70%', 'Analyst estimate. Low implied by S12 “industry” sign-up→funded 12.4% at 50% KYC'],
    ['Repeat buy within 30 days (of first buyers)', '15%', '50%', '70%', 'Analyst estimate. S9: 15% of new fintech sign-ups transact more than once in week 1 (different base)'],
    ['Auto Buy still active (of repeat buyers)', '50%', '70%', '85%', 'Analyst estimate. No public benchmark found'],
    ['Creator fee, Czech micro (10–50k), one Reel', '€123', '€250', '€410', 'S13 · 3,000–10,000 CZK; nano €33–103; mid-tier €410–1,026. No Bitcoin-specific Czech rate card found'],
    ['Creator views per post, click rate, install rate', '—', '15,000 · 1.0% · 25%', '—', 'Analyst estimate. No public benchmark found'],
    ['Instagram / Facebook engagement, finance brands (context)', '—', '2.85% / 1.35%', '—', 'S3 · median post engagement, Q2 2026'],
    ['Day-30 app retention, finance (context)', '—', '2%', '—', 'S7 citing Adjust; app opens, not purchase-plan retention, so not used'],
    ['Day-1 retention, crypto apps (context)', '—', '15.7%', '—', 'S6 · H1 2025, global'],
    ['Referral reward', '—', 'up to €20 each side', '—', 'S19 · Invity public referral offer'],
    ['Invity take rate', '0.25%', '1.0%', '2.0%', 'Analyst range for contribution margin. Public list fee (S20/S26): 1.49% service fee/trx + 9.9% p.a. on Turbo boost only — not used as take rate'],
    ['Plan churn, variable cost, early drop', '—', '5%/mo · €0.30 · 30%', '—', 'Analyst estimate. No public benchmark found']
  ];

  /* ---------------- State + URL ---------------- */
  var REG = {}; // calcId -> {fields: {key: cfg}, onChange}
  var STATE = {};
  var params = new URLSearchParams(location.search);
  function getInit(calc, key, def) {
    var v = params.get(calc + '.' + key);
    if (v === null) return def;
    var n = parseFloat(v); return isFinite(n) ? n : def;
  }
  var urlTimer;
  function writeURL() {
    clearTimeout(urlTimer);
    urlTimer = setTimeout(function () {
      var p = new URLSearchParams();
      Object.keys(REG).forEach(function (c) {
        var f = REG[c].fields;
        Object.keys(f).forEach(function (k) {
          if (STATE[c][k] !== f[k].def) p.set(c + '.' + k, String(+STATE[c][k].toFixed(6)));
        });
      });
      if (document.body.classList.contains('walk')) p.set('walk', '1');
      var q = p.toString();
      history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
    }, 150);
  }
  var live = document.createElement('div'); live.className = 'sr-only'; live.setAttribute('aria-live', 'polite'); document.body.appendChild(live);
  function announce(t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30); }

  function register(calc, cfgs, onChange) {
    REG[calc] = REG[calc] || { fields: {}, onChange: onChange };
    STATE[calc] = STATE[calc] || {};
    cfgs.forEach(function (c) { REG[calc].fields[c.key] = c; STATE[calc][c.key] = clampCfg(c, getInit(calc, c.key, c.def)); });
    REG[calc].onChange = onChange;
  }
  function clampCfg(c, v) { if (c.free) return v; return Math.min(c.max, Math.max(c.min, v)); }

  function srcHTML(c) {
    return 'Assumption: ' + (c.ae ? '<span class="ae">analyst estimate</span>' + (c.src ? ' · ' : '') : '') + (c.src ? '<b>' + c.src + '</b>' : '');
  }
  function fieldHTML(calc, c) {
    var id = calc + '_' + c.key;
    return '<div class="field" data-calc="' + calc + '" data-key="' + c.key + '">' +
      '<div class="field-top"><label for="' + id + '_n">' + esc(c.label) + '</label>' +
      (c.tip ? '<details class="tip"><summary aria-label="About: ' + esc(c.label) + '">?</summary><div class="tipbox" role="note">' + c.tip + '</div></details>' : '') + '</div>' +
      '<div class="ctl"><input type="range" id="' + id + '_r" min="' + c.min + '" max="' + c.max + '" step="' + c.step + '" aria-label="' + esc(c.label) + ' slider" aria-describedby="' + id + '_s">' +
      '<input type="number" id="' + id + '_n" min="' + c.min + '" max="' + c.max + '" step="' + c.step + '" inputmode="decimal" aria-describedby="' + id + '_s">' +
      '<span class="unit" aria-hidden="true">' + (c.unit || '') + '</span></div>' +
      '<span class="src" id="' + id + '_s">' + srcHTML(c) + '</span></div>';
  }
  function setFill(r) { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty('--fill', p + '%'); }
  function bindFields(root) {
    $$('.field[data-key]', root).forEach(function (el) {
      var calc = el.dataset.calc, key = el.dataset.key, c = REG[calc].fields[key];
      var r = $('input[type=range]', el), n = $('input[type=number]', el);
      function show() { r.value = STATE[calc][key]; n.value = STATE[calc][key]; setFill(r); r.setAttribute('aria-valuetext', STATE[calc][key] + ' ' + (c.unitText || c.unit || '')); }
      el._show = show; show();
      r.addEventListener('input', function () { STATE[calc][key] = parseFloat(r.value); n.value = r.value; setFill(r); r.setAttribute('aria-valuetext', r.value + ' ' + (c.unitText || c.unit || '')); changed(calc); });
      n.addEventListener('input', function () { var v = parseFloat(n.value); if (!isFinite(v)) return; v = clampCfg(c, v); STATE[calc][key] = v; r.value = v; setFill(r); changed(calc); });
      n.addEventListener('change', function () { show(); });
    });
  }
  function changed(calc) { REG[calc].onChange(); writeURL(); }
  function resetCalc(calc) {
    var f = REG[calc].fields; Object.keys(f).forEach(function (k) { STATE[calc][k] = f[k].def; });
    $$('[data-calc="' + calc + '"]').forEach(function (el) { if (el._show) el._show(); });
    REG[calc].onChange(); writeURL(); announce('Defaults restored');
  }
  function copyLink() {
    var url = location.href;
    function ok() { announce('Link copied'); flash('Link copied'); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(ok, function () { prompt('Copy this link', url); });
    else { prompt('Copy this link', url); }
  }
  function flash(t) { var b = document.activeElement; if (b && b.classList.contains('btn-soft')) { var o = b.textContent; b.textContent = t; setTimeout(function () { b.textContent = o; }, 1400); } }

  function calcCard(id, num, title, intro, inner, deep) {
    return '<article class="card calc reveal' + (deep ? ' deep' : '') + '" id="c-' + id + '" aria-labelledby="c-' + id + '-t">' +
      '<div class="calc-head"><div><span class="kicker">Calculator ' + num + '</span><h3 id="c-' + id + '-t">' + title + '</h3></div>' +
      '<div class="calc-tools"><button type="button" class="btn btn-soft" data-reset="' + id + '">Reset to defaults</button><button type="button" class="btn btn-soft" data-copy>Copy share link</button></div></div>' +
      '<p class="method" style="margin-top:6px">' + intro + '</p>' + inner + '</article>';
  }

  /* ---------------- SVG helpers ---------------- */
  var CH = { organic: '#c9a3ff', creators: '#ffd27a', referral: '#7fe0c0', meta: '#8fb6ff', x: '#f2f2f5' };
  function stacked(parts, label) {
    var tot = parts.reduce(function (a, p) { return a + p.v; }, 0), x = 0, s = '';
    parts.forEach(function (p) { if (tot <= 0 || p.v <= 0) return; var w = p.v / tot * 100; s += '<rect x="' + x + '%" y="0" width="' + w + '%" height="22" fill="' + p.c + '"><title>' + esc(p.l) + ': ' + fmtP(p.v / tot) + '</title></rect>'; x += w; });
    if (!s) s = '<rect x="0" y="0" width="100%" height="22" fill="rgba(255,255,255,.15)"/>';
    return '<svg width="100%" height="22" role="img" aria-label="' + esc(label) + '" preserveAspectRatio="none" style="border-radius:8px;overflow:hidden;display:block">' + s + '</svg>';
  }
  function lineChart(pts, opts) { // pts [{x,y}], opts {w,h,xfmt,yfmt,marker,hline,label}
    var w = 460, h = 180, pl = 46, pr = 10, pt = 22, pb = 26;
    var xs = pts.map(function (p) { return p.x; }), ys = pts.map(function (p) { return p.y; });
    if (opts.hline != null) ys.push(opts.hline);
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min(0, Math.min.apply(null, ys)), y1 = Math.max.apply(null, ys) || 1;
    function X(v) { return pl + (v - x0) / ((x1 - x0) || 1) * (w - pl - pr); }
    function Y(v) { return pt + (1 - (v - y0) / ((y1 - y0) || 1)) * (h - pt - pb); }
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + X(p.x).toFixed(1) + ' ' + Y(p.y).toFixed(1); }).join(' ');
    var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + esc(opts.label) + '">';
    s += '<line x1="' + pl + '" y1="' + Y(y0) + '" x2="' + (w - pr) + '" y2="' + Y(y0) + '" stroke="rgba(255,255,255,.35)"/>';
    s += '<text x="' + (pl - 6) + '" y="' + (Y(y1) + 4) + '" font-size="11" text-anchor="end">' + opts.yfmt(y1) + '</text>';
    s += '<text x="' + (pl - 6) + '" y="' + (Y(y0) + 4) + '" font-size="11" text-anchor="end">' + opts.yfmt(y0) + '</text>';
    s += '<text x="' + pl + '" y="' + (h - 6) + '" font-size="11">' + opts.xfmt(x0) + '</text><text x="' + (w - pr) + '" y="' + (h - 6) + '" font-size="11" text-anchor="end">' + opts.xfmt(x1) + '</text>';
    if (opts.hline != null) s += '<line x1="' + pl + '" x2="' + (w - pr) + '" y1="' + Y(opts.hline) + '" y2="' + Y(opts.hline) + '" stroke="#ffd27a" stroke-dasharray="5 4"/><text x="' + (w - pr) + '" y="' + Math.max(12, Y(opts.hline) - 6) + '" font-size="11" text-anchor="end" style="fill:#ffd27a">' + esc(opts.hlabel) + '</text>';
    s += '<path d="' + d + '" fill="none" stroke="#c9a3ff" stroke-width="2.5"/>';
    if (opts.marker) s += '<circle cx="' + X(opts.marker.x) + '" cy="' + Y(opts.marker.y) + '" r="5" fill="#fff" stroke="#8c3fff" stroke-width="2"/>';
    return s + '</svg>';
  }
  function hbars(rows, opts) { // rows [{l, v, t, hi}], v 0..1 width
    var s = '<div role="list" aria-label="' + esc(opts.label) + '">';
    rows.forEach(function (r) {
      s += '<div role="listitem" style="margin:6px 0"><div style="display:flex;justify-content:space-between;gap:8px;font-size:.78rem"><span>' + r.l + '</span><span class="tnum" style="font-weight:700">' + r.t + '</span></div>' +
        '<div style="height:10px;border-radius:5px;background:rgba(255,255,255,.12);overflow:hidden"><i style="display:block;height:100%;width:' + Math.max(0.5, Math.min(100, r.v * 100)).toFixed(1) + '%;background:' + (r.hi ? '#ffd27a' : '#c9a3ff') + ';border-radius:5px"></i></div></div>';
    });
    return s + '</div>';
  }
  function kpi(l, v, warn) { return '<div class="kpi' + (warn ? ' warn' : '') + '"><span class="l">' + l + '</span><span class="v">' + v + '</span></div>'; }

  /* ---------------- 1 · Acquisition planner ---------------- */
  var CHANNELS = [
    { id: 'organic', label: 'Organic & community', paid: false, w: 30, cpi: 4, cap: 1500, q: 1.0, note: 'Content production, meetups, small boosts of own posts.', src: 'cost per install, cap and quality: analyst estimate' },
    { id: 'creators', label: 'Creators (Czech Bitcoin / finance)', paid: false, w: 50, cpi: 7, cap: 4000, q: 1.1, note: 'Fee per post ÷ installs from Calculator 4 defaults (€250 ÷ 37.5 ≈ €6.70). Cap reflects a small Czech creator pool.', src: 'S13 fee · reach, cap, quality: analyst estimate' },
    { id: 'referral', label: 'Referral', paid: false, w: 20, cpi: 6, cap: 1000, q: 1.3, note: 'Public reward: up to €20 each side, paid on buys (S19). Cost per install ≈ reward per buyer × buy rate + operations.', src: 'S19 reward · cap, quality: analyst estimate' },
    { id: 'meta', label: 'Paid social · Meta', paid: true, w: 0, cpi: 6, cap: 20000, q: 0.9, note: 'Only where approved. Needs Meta’s prior written permission (S16).', src: 'S5, S7, S4 (see benchmark table)' },
    { id: 'x', label: 'X ads', paid: true, w: 0, cpi: 6, cap: 2000, q: 0.9, note: 'Only where eligible and certified (S17). No public X CPI benchmark for finance apps found.', src: 'analyst estimate from S8 CPC' }
  ];
  var plannerFields = [
    { key: 'budget', label: 'Monthly budget', min: 500, max: 20000, step: 100, def: 3000, unit: '€', unitText: 'euros', tip: 'Media, creator fees and referral rewards only. Salaries and production staff are excluded.', src: 'my planning input', ae: false },
    { key: 'k', label: 'Diminishing returns: CPI rise per €1,000 in a channel', min: 0, max: 0.5, step: 0.01, def: 0.10, unit: '×', tip: 'Average cost per install = base CPI × scenario × (1 + k × channel spend ÷ €1,000). At k = 0.10, a channel spending €3,000 pays 30% more per install than its first euro.', ae: true },
    { key: 'signup', label: 'Install → sign-up', min: 10, max: 70, step: 1, def: 30, unit: '%', tip: 'Share of installs that create an account.', src: 'S9 low 21%', ae: true },
    { key: 'kyc', label: 'Sign-up → KYC completed', min: 20, max: 85, step: 1, def: 50, unit: '%', tip: 'Identity verification is required before buying. Public reports put drop-off above 50%.', src: 'S11, S10', ae: true },
    { key: 'buy', label: 'KYC completed → first purchase', min: 20, max: 90, step: 1, def: 55, unit: '%', tip: 'Multiplied by each channel’s quality index below (e.g. referral 1.3×).', src: 'S12 low', ae: true }
  ];
  var chanFields = [];
  CHANNELS.forEach(function (ch) {
    chanFields.push({ key: 'w_' + ch.id, def: ch.w, min: 0, max: 100, step: 1 });
    chanFields.push({ key: 'cpi_' + ch.id, def: ch.cpi, min: 0.5, max: 50, step: 0.1 });
    chanFields.push({ key: 'cap_' + ch.id, def: ch.cap, min: 0, max: 20000, step: 100 });
    chanFields.push({ key: 'q_' + ch.id, def: ch.q, min: 0.2, max: 3, step: 0.05 });
    if (ch.paid) chanFields.push({ key: 'ok_' + ch.id, def: 0, min: 0, max: 1, step: 1 });
  });
  chanFields.push({ key: 'scen', def: 1, min: 0, max: 2, step: 1 });
  chanFields.push({ key: 'mkt', def: 0, min: 0, max: 1, step: 1 });
  var SCN = ['cautious', 'base', 'upside'];
  var DE_MULT = 1.62;

  function plannerInputs() {
    var s = STATE.p, mult = s.mkt === 1 ? DE_MULT : 1;
    return {
      budget: s.budget, scenario: SCN[s.scen], k: s.k, signupRate: s.signup / 100, kycRate: s.kyc / 100, buyRate: s.buy / 100,
      channels: CHANNELS.map(function (ch) {
        return { id: ch.id, weight: s['w_' + ch.id], enabled: ch.paid ? s['ok_' + ch.id] === 1 : true,
                 cpi: s['cpi_' + ch.id] * (ch.paid ? mult : 1), cap: s['cap_' + ch.id], quality: s['q_' + ch.id] };
      })
    };
  }
  function renderPlannerHTML() {
    var segs = '<div class="field"><div class="field-top"><span id="scn-l" style="font-weight:700;font-size:.92rem">Scenario</span><details class="tip"><summary aria-label="About: scenario">?</summary><div class="tipbox" role="note">Cautious: CPI ×1.30 and conversion ×0.80. Base: as entered. Upside: CPI ×0.85 and conversion ×1.15. Analyst estimates.</div></details></div>' +
      '<div class="seg" role="radiogroup" aria-labelledby="scn-l" style="margin-top:6px">' + SCN.map(function (n, i) { return '<label><input type="radio" name="p_scen" value="' + i + '"><span>' + n.charAt(0).toUpperCase() + n.slice(1) + '</span></label>'; }).join('') + '</div>' +
      '<span class="src">Assumption: <span class="ae">analyst estimate</span></span></div>' +
      '<div class="field"><div class="field-top"><span id="mkt-l" style="font-weight:700;font-size:.92rem">Market</span><details class="tip"><summary aria-label="About: market">?</summary><div class="tipbox" role="note">Germany multiplies paid-channel CPIs by 1.62, the ratio of estimated Meta CPMs (DE €8.98 vs CZ €5.54). Creator, referral and organic costs are left unchanged: no German benchmark found.</div></details></div>' +
      '<div class="seg" role="radiogroup" aria-labelledby="mkt-l" style="margin-top:6px"><label><input type="radio" name="p_mkt" value="0"><span>Czechia (pilot)</span></label><label><input type="radio" name="p_mkt" value="1"><span>Germany (second)</span></label></div>' +
      '<span class="src">Assumption: <b>S4</b> CPM ratio</span></div>';
    var f = plannerFields.map(function (c) { return fieldHTML('p', c); });
    var chans = '<fieldset style="border:0;padding:0;margin:0"><legend style="font-weight:800;margin-bottom:6px">Channel mix <span class="method" style="font-weight:400">(weights normalise automatically)</span></legend><div class="inputs">' +
      CHANNELS.map(function (ch) {
        var id = 'p_' + ch.id;
        return '<div class="chan" data-ch="' + ch.id + '"><div class="chan-top"><label for="' + id + '_w">' + esc(ch.label) + '</label>' +
          (ch.paid ? '<span class="chip" id="' + id + '_chip">only where approved</span><label class="approve"><input type="checkbox" id="' + id + '_ok"> approved for this market</label>' : '') +
          '<span class="tnum" id="' + id + '_share" style="font-weight:700;font-size:.85rem"></span></div>' +
          '<div class="ctl" style="display:flex;gap:12px;align-items:center;margin-top:6px"><input type="range" id="' + id + '_w" min="0" max="100" step="1" aria-describedby="' + id + '_note"><input type="number" id="' + id + '_wn" min="0" max="100" step="1" aria-label="' + esc(ch.label) + ' weight" style="width:70px;font:inherit;padding:6px;border:1.5px solid var(--g200);border-radius:10px;text-align:right"></div>' +
          '<div class="sub"><div><label for="' + id + '_cpi">Base CPI €</label><input type="number" id="' + id + '_cpi" min="0.5" max="50" step="0.1"></div>' +
          '<div><label for="' + id + '_cap">Usable cap €/mo</label><input type="number" id="' + id + '_cap" min="0" max="20000" step="100"></div>' +
          '<div><label for="' + id + '_q">Buyer quality ×</label><input type="number" id="' + id + '_q" min="0.2" max="3" step="0.05"></div></div>' +
          '<span class="src" id="' + id + '_note">' + esc(ch.note) + ' Assumption: ' + esc(ch.src) + '.</span></div>';
      }).join('') + '</div></fieldset>';
    var res = '<div class="results" aria-live="polite" aria-atomic="false"><h4>Results this month</h4><div class="kpis" id="p_kpis"></div>' +
      '<div class="chart-title">Spend by channel</div><div id="p_bar1"></div><div class="chart-title">First buyers by channel</div><div id="p_bar2"></div>' +
      '<div class="legend">' + CHANNELS.map(function (c) { return '<span><i style="background:' + CH[c.id] + '"></i>' + esc(c.label.replace(' (Czech Bitcoin / finance)', '')) + '</span>'; }).join('') + '</div>' +
      '<div class="chart-title">First buyers as budget grows (current mix)</div><div id="p_curve"></div>' +
      '<div id="p_unused"></div><p class="explain">Media, fees and rewards only. Attributed first buyers, not incremental ones. CPI rises with spend in each channel; capped budget is shown as unusable, not spent.</p></div>';
    return calcCard('planner', 1, 'Acquisition scenario planner', 'Where the money goes, and what it might buy. Paid channels start at zero and stay locked until you tick “approved”.',
      '<div class="calc-body"><div class="inputs">' + f[0] + segs + chans + f[1] + f[2] + f[3] + f[4] + '</div>' + res + '</div>' +
      '<div class="tablewrap deep" style="margin-top:16px"><table><caption>By channel</caption><thead><tr><th scope="col">Channel</th><th class="r" scope="col">Share</th><th class="r" scope="col">Spend</th><th class="r" scope="col">Unusable</th><th class="r" scope="col">Avg CPI</th><th class="r" scope="col">Installs</th><th class="r" scope="col">KYC done</th><th class="r" scope="col">First buyers</th><th class="r" scope="col">€ / first buyer</th></tr></thead><tbody id="p_rows"></tbody></table></div>', false);
  }
  function bindPlanner() {
    CHANNELS.forEach(function (ch) {
      var id = 'p_' + ch.id, s = STATE.p;
      var r = $('#' + id + '_w'), n = $('#' + id + '_wn'), cpi = $('#' + id + '_cpi'), cap = $('#' + id + '_cap'), q = $('#' + id + '_q'), ok = $('#' + id + '_ok');
      function show() {
        r.value = s['w_' + ch.id]; n.value = s['w_' + ch.id]; setFill(r); cpi.value = s['cpi_' + ch.id]; cap.value = s['cap_' + ch.id]; q.value = s['q_' + ch.id];
        if (ok) { ok.checked = s['ok_' + ch.id] === 1; r.disabled = n.disabled = !ok.checked; var chip = $('#' + id + '_chip'); chip.textContent = ok.checked ? 'approved (your assumption)' : 'only where approved'; chip.className = 'chip' + (ok.checked ? ' ok' : ''); }
      }
      var wrap = r.closest('.chan'); wrap.dataset.calc = 'p'; wrap._show = show; show();
      r.addEventListener('input', function () { s['w_' + ch.id] = +r.value; n.value = r.value; setFill(r); changed('p'); });
      n.addEventListener('input', function () { var v = +n.value; if (!isFinite(v)) return; s['w_' + ch.id] = Math.max(0, Math.min(100, v)); r.value = s['w_' + ch.id]; setFill(r); changed('p'); });
      [[cpi, 'cpi_', 0.5, 50], [cap, 'cap_', 0, 20000], [q, 'q_', 0.2, 3]].forEach(function (a) {
        a[0].addEventListener('input', function () { var v = parseFloat(a[0].value); if (!isFinite(v)) return; s[a[1] + ch.id] = Math.max(a[2], Math.min(a[3], v)); changed('p'); });
        a[0].addEventListener('change', show);
      });
      if (ok) ok.addEventListener('change', function () {
        s['ok_' + ch.id] = ok.checked ? 1 : 0;
        if (ok.checked && s['w_' + ch.id] === 0) s['w_' + ch.id] = 20;
        show(); changed('p');
      });
    });
    ['scen', 'mkt'].forEach(function (k) {
      $$('input[name=p_' + k + ']').forEach(function (i) {
        i.addEventListener('change', function () { STATE.p[k] = +i.value; changed('p'); });
      });
      var holder = $('input[name=p_' + k + ']').closest('.field'); holder.dataset.calc = 'p';
      holder._show = function () { $$('input[name=p_' + k + ']').forEach(function (i) { i.checked = +i.value === STATE.p[k]; }); };
      holder._show();
    });
  }
  var lastPlannerPerBuyer = null;
  function updatePlanner() {
    var inp = plannerInputs(), r = C.planner(inp), t = r.total;
    lastPlannerPerBuyer = t.perBuyer;
    r.rows.forEach(function (row) { var el = $('#p_' + row.id + '_share'); if (el) el.textContent = fmtP(row.share); });
    $('#p_kpis').innerHTML = kpi('Installs', fmtN(t.installs, 0)) + kpi('KYC-completed users', fmtN(t.kyc, 0)) + kpi('First buyers', fmtN(t.buyers, 0)) + kpi('Spend per first buyer', fmtE(t.perBuyer, 0)) +
      kpi('Budget used', fmtE(t.used, 0)) + kpi('Unusable budget share', fmtP(t.unusableShare), t.unusableShare > 0.005);
    $('#p_bar1').innerHTML = stacked(r.rows.map(function (x) { return { v: x.used, c: CH[x.id], l: x.id }; }), 'Spend by channel');
    $('#p_bar2').innerHTML = stacked(r.rows.map(function (x) { return { v: x.buyers, c: CH[x.id], l: x.id }; }), 'First buyers by channel');
    var pts = [];
    for (var b = 500; b <= 20000; b += 500) { var o = Object.assign({}, inp, { budget: b }); pts.push({ x: b, y: C.planner(o).total.buyers }); }
    $('#p_curve').innerHTML = lineChart(pts, { label: 'First buyers versus monthly budget at the current mix', xfmt: function (v) { return fmtE(v, 0); }, yfmt: function (v) { return fmtN(v, 0); }, marker: { x: inp.budget, y: t.buyers } });
    var capped = r.rows.filter(function (x) { return x.unusable > 0.5; }).map(function (x) { return CHANNELS.filter(function (c) { return c.id === x.id; })[0].label + ' (' + fmtE(x.unusable, 0) + ')'; });
    $('#p_unused').innerHTML = capped.length ? '<div class="model-warn">' + fmtE(t.unusable, 0) + ' of the budget cannot be used this month: ' + esc(capped.join(', ')) + ' hit the usable cap. Move weight elsewhere, or treat it as savings.</div>' : '';
    $('#p_rows').innerHTML = r.rows.map(function (x) {
      var lab = CHANNELS.filter(function (c) { return c.id === x.id; })[0].label;
      return '<tr><td>' + esc(lab) + '</td><td class="r tnum">' + fmtP(x.share) + '</td><td class="r tnum">' + fmtE(x.used, 0) + '</td><td class="r tnum">' + fmtE(x.unusable, 0) + '</td><td class="r tnum">' + (x.used > 0 ? fmtE(x.cpi, 2) : '—') + '</td><td class="r tnum">' + fmtN(x.installs, 0) + '</td><td class="r tnum">' + fmtN(x.kyc, 0) + '</td><td class="r tnum">' + fmtN(x.buyers, 1) + '</td><td class="r tnum">' + fmtE(x.perBuyer, 0) + '</td></tr>';
    }).join('') + '<tr><th scope="row">Total</th><td></td><td class="r tnum"><b>' + fmtE(t.used, 0) + '</b></td><td class="r tnum">' + fmtE(t.unusable, 0) + '</td><td></td><td class="r tnum"><b>' + fmtN(t.installs, 0) + '</b></td><td class="r tnum">' + fmtN(t.kyc, 0) + '</td><td class="r tnum"><b>' + fmtN(t.buyers, 1) + '</b></td><td class="r tnum"><b>' + fmtE(t.perBuyer, 0) + '</b></td></tr>';
  }

  /* ---------------- 2 · Funnel ---------------- */
  var funnelFields = [
    { key: 'imp', label: 'Impressions', min: 10000, max: 2000000, step: 10000, def: 200000, unit: '', tip: 'Paid or organic impressions in the period you want to model.', src: 'planning input' },
    { key: 'cpm', label: 'Cost per 1,000 impressions (CPM)', min: 0, max: 15, step: 0.01, def: 5.54, unit: '€', tip: 'Set to 0 for purely organic reach. Czech Meta estimate €5.54 (range €4.47–€6.70); Germany €8.98.', src: 'S4' },
    { key: 'ctr', label: 'Impression → click (CTR)', min: 0.1, max: 3, step: 0.05, def: 1.0, unit: '%', hi: 1.46, tip: 'Finance link CTR on Meta: 0.98% (US 2025), 1.22% (worldwide finance, Q2 2026), 1.46% (US 2026). Crypto apps 1.2%.', src: 'S1, S2, S3, S7' },
    { key: 'install', label: 'Click → install', min: 1, max: 40, step: 0.5, def: 10, unit: '%', hi: 15, tip: 'Derived: crypto-app installs per mille 0.97 ÷ 12 clicks per mille ≈ 8%.', src: 'S7 derived', ae: true },
    { key: 'signup', label: 'Install → sign-up', min: 10, max: 70, step: 1, def: 30, unit: '%', hi: 45, tip: 'CleverTap reported 21% of fintech installs signing up within the first week.', src: 'S9 low', ae: true },
    { key: 'kyc', label: 'Sign-up → KYC completed', min: 20, max: 85, step: 1, def: 50, unit: '%', hi: 70, tip: 'Sumsub: KYC drop-off often above 50%, sometimes 70%. Signicat: 68% abandoned a financial application in 2022.', src: 'S10, S11', ae: true },
    { key: 'first', label: 'KYC completed → first purchase', min: 10, max: 90, step: 1, def: 55, unit: '%', hi: 70, tip: 'No reliable public crypto benchmark. A vendor case study cites 12.4% sign-up → funded as an “industry” figure.', src: 'S12 low', ae: true },
    { key: 'repeat', label: 'First buyer → repeat buy within 30 days', min: 5, max: 95, step: 1, def: 50, unit: '%', hi: 70, tip: 'For Auto Buy users the second buy happens automatically, so this is close to “set up a schedule”.', src: 'S9 context', ae: true },
    { key: 'autobuy', label: 'Repeat buyer → Auto Buy still active', min: 20, max: 100, step: 1, def: 70, unit: '%', hi: 85, tip: 'Share of repeat buyers with an active Auto Buy plan at day 30. No public benchmark found.', ae: true }
  ];
  function renderFunnelHTML() {
    return calcCard('funnel', 2, 'Funnel calculator', 'From impression to an Auto Buy plan that is still on after 30 days. Cost at each stage, and which step is the biggest lever.',
      '<div class="calc-body"><div class="inputs">' + funnelFields.map(function (c) { return fieldHTML('f', c); }).join('') + '</div>' +
      '<div class="results" aria-live="polite"><h4>Results</h4><div class="kpis" id="f_kpis"></div><div class="chart-title">Funnel (bar length on a log scale) · count · cost per stage</div><div id="f_chart"></div>' +
      '<div class="chart-title">Biggest lever: Auto Buy plans gained if one step reached its benchmark high</div><div id="f_sens"></div><p class="explain" id="f_lever"></p></div></div>', true);
  }
  function funnelRates() { var s = STATE.f; return { ctr: s.ctr / 100, install: s.install / 100, signup: s.signup / 100, kyc: s.kyc / 100, first: s.first / 100, repeat: s.repeat / 100, autobuy: s.autobuy / 100 }; }
  function updateFunnel() {
    var s = STATE.f, o = { impressions: s.imp, cpm: s.cpm, rates: funnelRates() };
    var highs = {}; funnelFields.forEach(function (c) { if (c.hi != null) highs[c.key] = c.hi / 100; });
    var sens = C.funnelSensitivity(o, highs), f = sens.base;
    var first = f.stages[5];
    $('#f_kpis').innerHTML = kpi('Media spend', fmtE(f.spend, 0)) + kpi('First purchases', fmtN(first.count, 1)) + kpi('Cost per first purchase', fmtE(first.cost, 0)) + kpi('Auto Buy active (30 days)', fmtN(f.final, 1)) + kpi('Cost per active Auto Buy plan', fmtE(f.costPerFinal, 0));
    var maxL = Math.log10(Math.max(10, s.imp));
    $('#f_chart').innerHTML = hbars(f.stages.map(function (st) { return { l: st.name, v: st.count > 1 ? Math.log10(st.count) / maxL : 0.01, t: fmtN(st.count, st.count < 10 ? 1 : 0) + ' · ' + (st.name === 'Impressions' ? fmtE(s.cpm, 2) + ' CPM' : fmtE(st.cost, st.cost < 10 ? 2 : 0) + ' each') }; }), { label: 'Funnel stages' });
    var maxLift = Math.max.apply(null, sens.steps.map(function (x) { return x.lift; })) || 1;
    var labels = {}; funnelFields.forEach(function (c) { labels[c.key] = c.label; });
    $('#f_sens').innerHTML = hbars(sens.steps.map(function (x) { return { l: esc(labels[x.key]) + ' → ' + fmtN(x.to * 100, 1) + '%', v: x.lift / maxLift, t: '+' + fmtP(x.lift), hi: x.key === sens.biggest }; }), { label: 'Sensitivity by step' });
    $('#f_lever').textContent = sens.steps.every(function (x) { return x.lift <= 0; }) ? 'Every step is already at or above its benchmark high.' : 'Biggest lever right now: ' + labels[sens.biggest] + '. In a chain of multiplied rates, the weakest step relative to its realistic best moves the result most.';
  }

  /* ---------------- 3 · Power ---------------- */
  var powerFields = [
    { key: 'base', label: 'Baseline conversion', min: 0.5, max: 30, step: 0.1, def: 4, unit: '%', tip: 'E.g. first-purchase rate within 14 days among sign-ups who have not bought. Replace with Invity’s real rate.', ae: true },
    { key: 'lift', label: 'Relative lift to detect', min: 5, max: 100, step: 1, def: 20, unit: '%', tip: '20% means 4.0% → 4.8%. Smaller lifts need far more users.', src: 'planning input' },
    { key: 'power', label: 'Power (1 − β)', min: 70, max: 95, step: 1, def: 80, unit: '%', tip: 'Chance of detecting the lift if it is real. 80% is the usual minimum.', src: 'convention' },
    { key: 'alpha', label: 'Significance level (α, two-sided)', min: 1, max: 10, step: 0.5, def: 5, unit: '%', tip: 'False-positive rate you accept. 5% is conventional.', src: 'convention' },
    { key: 'traffic', label: 'Eligible users entering the test per day (both arms)', min: 10, max: 5000, step: 10, def: 300, unit: '', tip: 'For a CRM holdout: new sign-ups without a purchase per day.', ae: true }
  ];
  function renderPowerHTML() {
    return calcCard('power', 3, 'Experiment power calculator', 'How many users each arm needs before a result means anything, and how long that takes.',
      '<div class="calc-body"><div class="inputs">' + powerFields.map(function (c) { return fieldHTML('x', c); }).join('') + '</div>' +
      '<div class="results" aria-live="polite"><h4>Results</h4><div class="kpis" id="x_kpis"></div><p class="explain" id="x_note"></p>' +
      '<p class="explain"><b>Method:</b> two-proportion test, normal approximation, equal allocation, two-sided. Plan the sample once before launch and read the result once at the end. No peeking.</p></div></div>', true);
  }
  function updatePower() {
    var s = STATE.x, r = C.power({ baseline: s.base / 100, lift: s.lift / 100, alpha: s.alpha / 100, power: s.power / 100, dailyTraffic: s.traffic });
    var p2 = s.base / 100 * (1 + s.lift / 100);
    $('#x_kpis').innerHTML = kpi('Users per arm', fmtN(r.perArm, 0)) + kpi('Users in total', fmtN(r.total, 0)) + kpi('Runtime', r.days == null ? '—' : fmtN(r.days, 0) + (r.days === 1 ? ' day' : ' days'), r.days > 28) + kpi('Conversions per arm (baseline)', fmtN(r.conversionsPerArm, 0));
    $('#x_note').textContent = r.perArm == null ? 'Lift pushes the rate above 100%. Lower the lift or the baseline.' :
      'Detecting ' + fmtP(s.base / 100, 1) + ' → ' + fmtP(p2, 2) + '. ' + (r.days > 28 ? 'Longer than four weeks: test a bigger change, pool markets, or accept a directional read and say so.' : 'Fits inside a month at this traffic.');
  }

  /* ---------------- 4 · Creator pilot ---------------- */
  var creatorFields = [
    { key: 'n', label: 'Creators', min: 1, max: 10, step: 1, def: 3, unit: '', tip: 'Three is enough to compare and small enough to manage by hand.', src: 'planning input' },
    { key: 'fee', label: 'Fee per creator (one video + one post)', min: 30, max: 1500, step: 10, def: 250, unit: '€', tip: 'Czech micro creators (10–50k followers): 3,000–10,000 CZK per Reel ≈ €123–€410. Not finance-specific.', src: 'S13, S14' },
    { key: 'boost', label: 'Paid boost per creator post', min: 0, max: 1000, step: 10, def: 0, unit: '€', tip: 'Only where paid boosting of crypto content is approved.', src: 'planning input' },
    { key: 'reach', label: 'Views per creator', min: 1000, max: 100000, step: 500, def: 15000, unit: '', tip: 'Ask each creator for the median views of their last ten posts.', ae: true },
    { key: 'ctr', label: 'View → link click', min: 0.1, max: 5, step: 0.1, def: 1.0, unit: '%', tip: 'Stories and description links usually click far less than people hope.', ae: true },
    { key: 'inst', label: 'Click → install', min: 5, max: 60, step: 1, def: 25, unit: '%', tip: 'Higher than paid traffic because the viewer was warmed up by someone they follow. An assumption to test.', ae: true },
    { key: 'buy', label: 'Install → first purchase', min: 1, max: 30, step: 0.25, def: 8.25, unit: '%', tip: 'Funnel defaults chained: 30% sign-up × 50% KYC × 55% first purchase ≈ 8.25%.', src: 'Calculator 2 defaults', ae: true }
  ];
  function renderCreatorHTML() {
    return calcCard('creator', 4, 'Creator pilot calculator', 'Three Czech creators, one brief, one tracked link each.',
      '<div class="calc-body"><div class="inputs">' + creatorFields.map(function (c) { return fieldHTML('c', c); }).join('') + '</div>' +
      '<div class="results" aria-live="polite"><h4>Results for the pilot</h4><div class="kpis" id="c_kpis"></div>' +
      '<div class="model-warn">Attribution is not incrementality. A tracked link shows who came through the link, not who would not have bought anyway. Claim lift only with a holdout or a geo test.</div></div></div>', true);
  }
  function updateCreator() {
    var s = STATE.c, r = C.creator({ creators: s.n, fee: s.fee, boost: s.boost, reach: s.reach, clickRate: s.ctr / 100, installRate: s.inst / 100, purchaseRate: s.buy / 100 });
    $('#c_kpis').innerHTML = kpi('Total cost', fmtE(r.cost, 0)) + kpi('Views', fmtN(r.views, 0)) + kpi('Clicks', fmtN(r.clicks, 0)) + kpi('Installs', fmtN(r.installs, 0)) + kpi('Attributed first buyers', fmtN(r.buyers, 1), r.buyers < 10) + kpi('Cost per attributed buyer', fmtE(r.perBuyer, 0)) + kpi('Cost per install', fmtE(r.perInstall, 2));
  }

  /* ---------------- 5 · Payback ---------------- */
  var paybackFields = [
    { key: 'buy', label: 'Average monthly buy per active plan', min: 10, max: 1000, step: 5, def: 100, unit: '€', tip: '€100 a month is the example Invity uses on its Turbo Buy page. It is an illustration, not user data.', src: 'S20 example', ae: true },
    { key: 'take', label: 'Invity take rate per buy', min: 0.25, max: 2, step: 0.05, def: 1.0, unit: '%', tip: 'Analyst contribution-margin range, not the public list fee. Public Turbo FAQ (9 Nov 2026): 1.49% service fee per transaction + 9.9% p.a. only on the Turbo boost (S20, S26). Finance must supply the real take rate.', src: 'S20, S26 list fee; take rate analyst', ae: true },
    { key: 'other', label: 'Other revenue per active plan per month', min: 0, max: 5, step: 0.05, def: 0, unit: '€', tip: 'E.g. Turbo Buy fees or spread. Left at zero: needs internal data.', ae: true },
    { key: 'cost', label: 'Variable cost per active plan per month', min: 0, max: 3, step: 0.05, def: 0.30, unit: '€', tip: 'Payments, custody, KYC re-checks, support. Needs finance data.', ae: true },
    { key: 'drop', label: 'Drop after month 1', min: 0, max: 80, step: 1, def: 30, unit: '%', tip: 'Share of first buyers without an active plan in month 2.', ae: true },
    { key: 'churn', label: 'Monthly churn after that', min: 0, max: 30, step: 0.5, def: 5, unit: '%', tip: 'Applied every month from month 3.', ae: true },
    { key: 'months', label: 'Horizon', min: 6, max: 60, step: 1, def: 24, unit: 'mo', unitText: 'months', tip: 'How long you are willing to wait for payback.', src: 'planning input' },
    { key: 'cac', label: 'Acquisition cost per first buyer', min: 5, max: 500, step: 1, def: 80, unit: '€', tip: 'Use the button to pull the planner’s spend per first buyer.', src: 'Calculator 1 or your input' }
  ];
  function renderPaybackHTML() {
    return calcCard('payback', 5, 'Payback and contribution calculator', 'Per customer, bottom-up: what one active plan contributes each month, and when it pays back its acquisition cost.',
      '<div class="calc-body"><div class="inputs">' + paybackFields.map(function (c) { return fieldHTML('y', c); }).join('') + '<button type="button" class="btn btn-soft" id="y_pull">Use the planner’s spend per first buyer</button></div>' +
      '<div class="results" aria-live="polite"><h4>Results per first buyer</h4><div class="kpis" id="y_kpis"></div><div class="chart-title">Cumulative contribution vs acquisition cost</div><div id="y_chart"></div>' +
      '<p class="explain" id="y_note"></p><div class="model-warn">Model warning: a toy model with a made-up take rate. Fee revenue on small monthly buys is tiny, so payback depends heavily on numbers only Invity has. Do not read it as a business case.</div></div></div>', true);
  }
  function updatePayback() {
    var s = STATE.y, r = C.payback({ avgBuy: s.buy, takeRate: s.take / 100, otherRev: s.other, varCost: s.cost, earlyDrop: s.drop / 100, churn: s.churn / 100, months: s.months, cac: s.cac });
    $('#y_kpis').innerHTML = kpi('Contribution per active plan / month', fmtE(r.perActiveMonth, 2)) + kpi('Contribution over ' + s.months + ' months', fmtE(r.total, 2)) + kpi('Payback month', r.paybackMonth ? 'Month ' + r.paybackMonth : 'Not within ' + s.months + ' months', !r.paybackMonth) + kpi('Contribution ÷ acquisition cost', r.ratio == null ? '—' : fmtN(r.ratio, 2) + '×', r.ratio < 1);
    $('#y_note').textContent = r.paybackMonth ? 'Pays back in month ' + r.paybackMonth + ' on these assumptions.' : 'On these assumptions one first buyer never earns back its acquisition cost. That is the useful finding: fee income on small monthly buys is thin, so growth needs cheap acquisition (organic, creators, referral), larger or longer-lived plans, or other revenue. Invity\u2019s real numbers decide which.';
    $('#y_chart').innerHTML = lineChart(r.series.map(function (p) { return { x: p.month, y: p.cumulative }; }), { label: 'Cumulative contribution per first buyer by month', xfmt: function (v) { return 'month ' + v; }, yfmt: function (v) { return fmtE(v, 0); }, hline: s.cac, hlabel: 'acquisition cost ' + fmtE(s.cac, 0) });
  }

  /* ---------------- 6 · Content time ---------------- */
  var FORMATS = [
    { id: 'oq', name: 'One Question carousel', per: 1, h: 4, r: 1, loc: true },
    { id: 'uh', name: 'Under the Hood clip', per: 1, h: 5, r: 1, loc: true },
    { id: 'sh', name: 'Stack Habits post', per: 1, h: 2, r: 0.5, loc: true },
    { id: 'live', name: 'Ask Invity Live (monthly)', per: 0.25, h: 8, r: 2, loc: true },
    { id: 'meme', name: 'Meme Decoder', per: 0.5, h: 2, r: 0.5, loc: true },
    { id: 'xp', name: 'Short X posts and reply threads', per: 5, h: 0.5, r: 0.25, loc: false }
  ];
  var contentFields = [];
  FORMATS.forEach(function (f) {
    contentFields.push({ key: 'per_' + f.id, label: f.name + ': per week', min: 0, max: 10, step: 0.25, def: f.per, unit: '/wk', unitText: 'per week', tip: 'Posts or assets per week. Monthly formats are 0.25.', ae: true, src: '' });
    contentFields.push({ key: 'h_' + f.id, label: f.name + ': hours to make', min: 0, max: 12, step: 0.25, def: f.h, unit: 'h', unitText: 'hours', ae: true, tip: 'Writing, design, filming, editing, scheduling.' });
    contentFields.push({ key: 'r_' + f.id, label: f.name + ': review hours', min: 0, max: 5, step: 0.25, def: f.r, unit: 'h', unitText: 'hours', ae: true, tip: 'Fact-check, compliance and native-language review, including waiting and fixes.' });
  });
  contentFields = contentFields.concat([
    { key: 'mod', label: 'Community moderation, hours per week', min: 0, max: 20, step: 0.5, def: 5, unit: 'h', unitText: 'hours', tip: 'Comments and DMs twice a day.', ae: true },
    { key: 'cre', label: 'Creator coordination, hours per week', min: 0, max: 10, step: 0.5, def: 3, unit: 'h', unitText: 'hours', ae: true, tip: 'Briefs, contracts, fact-checks, tracking codes.' },
    { key: 'rep', label: 'Reporting and analysis, hours per week', min: 0, max: 10, step: 0.5, def: 3, unit: 'h', unitText: 'hours', ae: true, tip: 'Weekly three-line note, monthly report, test reads.' },
    { key: 'meet', label: 'Meetings, hours per week', min: 0, max: 10, step: 0.5, def: 3, unit: 'h', unitText: 'hours', ae: true, tip: 'Product, compliance, CRM, marketing lead.' },
    { key: 'loc', label: 'Second language uplift (CZ + EN)', min: 0, max: 80, step: 5, def: 25, unit: '%', tip: 'Extra time for a second language version on localised formats.', ae: true },
    { key: 'cap', label: 'Hours available per week', min: 20, max: 50, step: 1, def: 40, unit: 'h', unitText: 'hours', tip: 'One person, full time.', src: 'planning input' }
  ]);
  function renderContentHTML() {
    var fmtBlocks = FORMATS.map(function (f) {
      return '<fieldset class="chan" style="margin:0"><legend style="font-weight:800;font-size:.92rem;padding:0 4px">' + esc(f.name) + '</legend>' + fieldHTML('t', contentFields.filter(function (c) { return c.key === 'per_' + f.id; })[0]) +
        '<div class="grid g2" style="margin-top:8px">' + fieldHTML('t', contentFields.filter(function (c) { return c.key === 'h_' + f.id; })[0]) + fieldHTML('t', contentFields.filter(function (c) { return c.key === 'r_' + f.id; })[0]) + '</div></fieldset>';
    }).join('');
    var fixed = ['mod', 'cre', 'rep', 'meet', 'loc', 'cap'].map(function (k) { return fieldHTML('t', contentFields.filter(function (c) { return c.key === k; })[0]); }).join('');
    return calcCard('content', 6, 'Content time budget', 'Is the plan doable by one person? Hours per week by format, plus review, moderation and meetings.',
      '<div class="calc-body"><div class="inputs">' + fmtBlocks + fixed + '</div><div class="results" aria-live="polite"><h4>One person’s week</h4><div class="kpis" id="t_kpis"></div><div class="chart-title">Hours by activity</div><div id="t_chart"></div><p class="explain" id="t_note"></p></div></div>', true);
  }
  function updateContent() {
    var s = STATE.t;
    var r = C.contentBudget({ formats: FORMATS.map(function (f) { return { name: f.name, perWeek: s['per_' + f.id], hours: s['h_' + f.id], review: s['r_' + f.id], localised: f.loc }; }), fixed: s.mod + s.cre + s.rep + s.meet, localisation: s.loc / 100, capacity: s.cap });
    var rows = r.rows.concat([{ name: 'Moderation', hours: s.mod }, { name: 'Creator coordination', hours: s.cre }, { name: 'Reporting', hours: s.rep }, { name: 'Meetings', hours: s.meet }]);
    var mx = Math.max.apply(null, rows.map(function (x) { return x.hours; })) || 1;
    var u = r.utilisation;
    $('#t_kpis').innerHTML = kpi('Making content', fmtN(r.make, 1) + ' h') + kpi('Total per week', fmtN(r.total, 1) + ' h') + kpi('Share of capacity', fmtP(u), u > 0.9) + kpi('Posts per week', fmtN(FORMATS.reduce(function (a, f) { return a + s['per_' + f.id]; }, 0), 2));
    $('#t_chart').innerHTML = hbars(rows.map(function (x) { return { l: esc(x.name), v: x.hours / mx, t: fmtN(x.hours, 1) + ' h' }; }), { label: 'Hours by activity' });
    $('#t_note').textContent = u > 1 ? 'Over capacity. Cut a format, slow the rhythm, or get design or video help. Keep moderation.' : u > 0.9 ? 'Tight. Leave about 10% slack for news days and compliance loops.' : 'Fits one person with room for the sprint’s remarkable thing.';
  }

  /* ---------------- Experiments ---------------- */
  var EXP = [
    { n: 'E1', t: 'Auto Buy: practical walkthrough vs feature post', h: 'A step-by-step post (amount, schedule, fee shown before you confirm, where the bitcoin is held, risk line) earns more first purchases than a benefit-led “set it and forget it” post.',
      mvt: 'Two Czech posts on X and Instagram, same slot, same destination and offer. Organic first; then an equal small boost for each where the platform allows a split test and crypto ads are approved.',
      m: 'Attributed first purchases; cost per attributed first purchase. Guardrails: KYC completion, failed transactions, Auto Buy active at 30 days, complaints.', w: '14–21 days after click.',
      d: 'Keep the walkthrough if it is clearly better (e.g. ≥20% lower cost per first purchase at usable volume); iterate the loser once. At low volume, call it a directional read and size the next round with Calculator 3.',
      o: 'Me (Social Media Lead).', dep: 'Compliance review of both versions; tagged links tested end to end; product sign-off on the “first completed purchase” event.' },
    { n: 'E2', t: 'Czech creator pilot', h: 'Three local Bitcoin educators showing their own Auto Buy setup bring first purchases at a cost competitive with paid social, and those buyers keep Auto Buy on.',
      mvt: 'Three creators, one brief, one video and one post each, a unique link or code each. Instagram or YouTube: X treats crypto as ineligible for paid partnerships in the EU.',
      m: 'Attributed first purchases; cost per attributed first purchase (fee plus any boost); share with Auto Buy active at 30 days. Reported as attributed, not as lift.', w: '21–28 days.',
      d: 'Renew creators whose buyers stay active and whose cost per attributed buyer is within the benchmark agreed in week 1. Drop low-volume or off-brand partnerships.',
      o: 'Me, with a Czech colleague for language review.', dep: 'Creator contracts with disclosure and tracking terms; codes live in the attribution system; branded-content rules checked per platform.' },
    { n: 'E3', t: 'Paid amplification of proven assets, where approved', h: 'A post or creator clip that already worked organically beats the current paid creative on cost per first purchase.',
      mvt: 'One proven asset against the current paid creative: same audience, same budget split, creative is the only change. Only on platforms and in markets where Invity’s crypto ads are approved.',
      m: 'Cost per attributed first purchase.', w: '14 days.',
      d: 'Scale the winner, pause the loser, refresh before re-testing.',
      o: 'Me, with whoever owns paid media and the MMP.', dep: 'Platform approvals (Google certification, Meta written permission, X certification); MMP or pixel events firing; compliance sign-off.' },
    { n: 'E4', t: 'CRM activation with a holdout', h: 'A plain explainer (what happens on your first Auto Buy, what it costs, where the bitcoin sits) raises the first-purchase rate among people who signed up but never bought.',
      mvt: 'Sign-ups without a purchase, randomly split into treatment and holdout. Two messages, no incentives, a visible “send me less” link.',
      m: 'First-purchase rate vs holdout. Guardrails: unsubscribes, complaints, “send less” clicks.', w: '14–21 days.',
      d: 'Roll out only if the lift reaches the minimum set in advance with Calculator 3, and guardrails stay within the holdout plus an agreed margin.',
      o: 'CRM owner and me.', dep: 'Consent basis and audience rules; random assignment and holdout reporting; enough eligible sign-ups.' }
  ];
  function renderExperiments() {
    $('#expRoot').innerHTML = EXP.map(function (e) {
      return '<article class="card brief reveal"><h3><span class="badge">' + e.n + '</span>' + esc(e.t) + '</h3><dl>' +
        '<dt>Hypothesis</dt><dd>' + esc(e.h) + '</dd>' +
        '<dt class="deep">Minimum viable test</dt><dd class="deep">' + esc(e.mvt) + '</dd>' +
        '<dt>Metric</dt><dd>' + esc(e.m) + '</dd>' +
        '<dt class="deep">Window</dt><dd class="deep">' + esc(e.w) + '</dd>' +
        '<dt>Decision rule</dt><dd>' + esc(e.d) + '</dd>' +
        '<dt class="deep">Owner</dt><dd class="deep">' + esc(e.o) + '</dd>' +
        '<dt class="deep">Depends on</dt><dd class="deep">' + esc(e.dep) + '</dd></dl></article>';
    }).join('');
  }

  /* ---------------- Evidence tables ---------------- */
  function renderEvidence() {
    $('#benchTable tbody').innerHTML = BENCH.map(function (b) {
      var src = esc(b[4]).replace(/analyst estimate/gi, '<span class="tag int">analyst estimate</span>').replace(/No public benchmark found/g, '<b>No public benchmark found</b>');
      return '<tr><td>' + esc(b[0]) + '</td><td class="r tnum">' + esc(b[1]) + '</td><td class="r tnum"><b>' + esc(b[2]) + '</b></td><td class="r tnum">' + esc(b[3]) + '</td><td>' + src + '</td></tr>';
    }).join('');
    $('#sourceList').innerHTML = Object.keys(SOURCES).map(function (k) {
      var s = SOURCES[k]; return '<li id="src-' + k + '"><b>' + k + '</b> · <a href="' + s[2] + '" rel="noopener" target="_blank">' + esc(s[0]) + '</a> · ' + esc(s[1]) + '</li>';
    }).join('') + '<li><b>Own evidence</b> · Kitti’s email records and reports (read-only check, 9 Nov 2026); available on request.</li>';
  }

  /* ---------------- Boot ---------------- */
  register('p', plannerFields.concat(chanFields), updatePlanner);
  register('f', funnelFields, updateFunnel);
  register('x', powerFields, updatePower);
  register('c', creatorFields, updateCreator);
  register('y', paybackFields, updatePayback);
  register('t', contentFields, updateContent);

  $('#calcRoot').innerHTML = renderPlannerHTML() + renderFunnelHTML() + renderPowerHTML() + renderCreatorHTML() + renderPaybackHTML() + renderContentHTML();
  bindFields($('#calcRoot'));
  bindPlanner();
  updatePlanner(); updateFunnel(); updatePower(); updateCreator(); updatePayback(); updateContent();
  renderExperiments(); renderEvidence();
  $$('.tablewrap').forEach(function (w, i) {
    var t = $('caption', w), h = w.closest('.card') && $('h3', w.closest('.card'));
    w.setAttribute('role', 'region'); w.setAttribute('tabindex', '0');
    w.setAttribute('aria-label', (t ? t.textContent : h ? h.textContent : 'Table ' + (i + 1)) + ' (scrolls sideways)');
  });

  document.addEventListener('click', function (e) {
    var r = e.target.closest('[data-reset]'); if (r) { resetCalc(r.dataset.reset === 'planner' ? 'p' : { funnel: 'f', power: 'x', creator: 'c', payback: 'y', content: 't' }[r.dataset.reset]); return; }
    if (e.target.closest('[data-copy]')) { copyLink(); return; }
    if (e.target.closest('#y_pull')) {
      if (lastPlannerPerBuyer && isFinite(lastPlannerPerBuyer)) { STATE.y.cac = Math.round(Math.min(500, Math.max(5, lastPlannerPerBuyer))); $$('[data-calc="y"]').forEach(function (el) { if (el._show) el._show(); }); changed('y'); announce('Acquisition cost set to ' + fmtE(STATE.y.cac, 0)); }
    }
  });
  // close open tooltips with Escape or outside click
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $$('details.tip[open]').forEach(function (d) { d.open = false; var s = $('summary', d); if (d.contains(document.activeElement)) s.focus(); }); });
  document.addEventListener('click', function (e) { $$('details.tip[open]').forEach(function (d) { if (!d.contains(e.target)) d.open = false; }); });

  /* Walkthrough toggle */
  var wt = $('#walkToggle');
  function setWalk(on) { document.body.classList.toggle('walk', on); wt.setAttribute('aria-pressed', on ? 'true' : 'false'); writeURL(); }
  wt.addEventListener('click', function () { var on = !document.body.classList.contains('walk'); setWalk(on); announce(on ? 'Five-minute walkthrough on: key sections only' : 'Full page'); if (on) $('#pitch').scrollIntoView(); });
  if (params.get('walk') === '1') setWalk(true);

  /* Reveal + nav + reading progress */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  var navMap = { plan: 'plan', days30: 'plan', brief: 'brief', education: 'education', competitors: 'competitors', calculators: 'calculators', experiments: 'experiments', content: 'content', creatives: 'creatives', compliance: 'compliance', done: 'evidence', evidence: 'evidence' };
  var seen = {};
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        $$('.mininav a').forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + navMap[id] ? 'true' : 'false'); });
        if (['plan', 'calculators', 'done'].indexOf(id) > -1 && !seen[id]) {
          seen[id] = 1; var li = $('[data-watch="' + id + '"]'); if (li) li.classList.add('done');
          var n = Object.keys(seen).length, bar = $('#readBar'); bar.setAttribute('aria-valuenow', n); $('i', bar).style.width = (n / 3 * 100) + '%';
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(navMap).forEach(function (id) { var el = document.getElementById(id); if (el) so.observe(el); });
  }
})();
