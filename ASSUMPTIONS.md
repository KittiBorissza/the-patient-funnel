# ASSUMPTIONS: The Patient Funnel (site-v2)

Everything the calculators assume, where it comes from, and the formulas. All sources were read on **9 Nov 2026** (Europe/Budapest) unless a different date is shown.
**None of these numbers are Invity data, and none is a forecast.** Each one is a public benchmark, a value derived from one, or an *analyst estimate* (my own conservative guess, labelled as such on the page).

Currency: USD is converted at the **ECB reference rate of 9 Nov 2026: €1 = $1.1193 = 24.365 CZK** (S14). On the page, numbers are formatted in EUR using the reader's browser locale (`Intl.NumberFormat`).

## 1. Sources

| ID | Source | Date · region · scope | URL |
|---|---|---|---|
| S1 | WordStream / LocaliQ, *Facebook Ads Benchmarks 2025* (PDF) | Sep 2025 · US · 1,180 campaigns, Apr 2024–Jun 2025, medians | https://www.wordstream.com/wp-content/uploads/2025/09/ws-guide-2025-fb-benchmarks.pdf |
| S2 | WordStream, *Facebook Ads Benchmarks 2026* | 2026 · US | https://www.wordstream.com/blog/facebook-ads-benchmarks-2026 |
| S3 | Emplifi, *Worldwide Social Media Benchmarks: Finance Q2 2026* | 22 Jul 2026 · worldwide · Apr–Jun 2026 | https://emplifi.io/resources/q2-2026-finance-worldwide-benchmarks/ |
| S4 | Pantheon Meta CPM estimates, via TransparencyAds *Meta Ads Cost in Europe: CPM by EU Country (2026)* | generated 17 Oct 2026 · EU · Aug 2025–Jul 2026 · all categories | https://www.transparencyads.com/meta-ads-cost-europe.html |
| S5 | Business of Apps, *App User Acquisition Costs (2025)*, incl. AppsFlyer finance CPI | 2025 · Europe/global · **read via search index; direct fetch returned 403** | https://www.businessofapps.com/marketplace/user-acquisition/research/user-acquisition-costs/ |
| S6 | Adjust, *The finance app insights report: 2025 edition* (press release) | 29 Oct 2025 · global · H1 2025 | https://www.businesswire.com/news/home/20251029280342/en/New-Adjust-Report-Finds-Global-Finance-App-Market-Shifting-From-Rapid-Expansion-to-Sustainable-Growth-In-2025 |
| S7 | Promodo, *Fintech Marketing Benchmarks 2026* (citing Adjust) | 2026 · global | https://www.promodo.com/blog/fintech-marketing-benchmarks |
| S8 | Hootsuite, *X (Twitter) ads: the practical 2025 guide* (citing AgencyAnalytics, 7,000 agencies; plus Hootsuite's own account) | 2025 · global | https://blog.hootsuite.com/twitter-ads/ |
| S9 | CleverTap fintech benchmark report (press release) | **undated on page, likely pre-2021** · global | https://clevertap.com/news/press-release/clevertaps-fintech-benchmark-report-1-in-5-users-that-install-fintech-apps-sign-up-within-week-one/ |
| S10 | Signicat, *The onboarding advantage* (citing *Battle to Onboard* 2022) | 21 Mar 2025 (data 2022) · Europe | https://www.signicat.com/blog/the-onboarding-advantage-how-operational-efficiency-boosts-conversion |
| S11 | Sumsub, *How Sumsub's Reusable KYC Unlocks Smarter and Compliant Onboarding* (vendor) | 2025 · Europe | https://sumsub.com/customers/reusable-kyc-case/ |
| S12 | NIL Club, crypto exchange case study (vendor; quotes an "industry" sign-up→funded rate) | undated · US | https://nilclub.com/business/case-studies/crypto-exchange |
| S13 | Spojly, *Transparentní ceny v influencer marketingu* (Czech rate card) | 22 Nov 2025 · Czechia · not finance-specific | https://www.spojly.cz/blog/transparentni-ceny-influencer-marketingu |
| S14 | European Central Bank, euro reference rates (API) | 9 Nov 2026 | https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html |
| S15 | Google Ads policy help, *Cryptocurrencies and related products* (+ CoinDesk 14 Apr 2025 on the 23 Apr 2025 EU enforcement) | read 9 Nov 2026 · EU | https://support.google.com/adspolicy/answer/14009787?hl=en |
| S16 | Meta Transparency Center, *Cryptocurrency products and services* | read 9 Nov 2026 | https://transparency.meta.com/policies/ad-standards/restricted-goods-services/cryptocurrency-products-and-services/ |
| S17 | adbench.io, *Crypto Ads on Meta, X, TikTok and Reddit: Rules, Checked* (secondary) | read 9 Nov 2026 | https://adbench.io/crypto-ads-on-meta-x-tiktok-reddit/ |
| S18 | Crypto Economy, *X Paid Partnership Rules Bar Crypto Promos in EU, UK, AU* (citing X Help Center) | 2 Mar 2026 · **X Help still 403 on 9 Nov 2026 re-check; secondary only — verify in-account. Distinguishes X Ads (certification) from Paid Partnerships (EU/UK/AU financial ineligibility reported)** | https://crypto-economy.com/x-paid-partnership-rules-bar-crypto-promos/ |
| S19 | Invity home page | read 9 Nov 2026 | https://invity.io/ |
| S20 | Invity Turbo Buy page | read 9 Nov 2026 | https://invity.io/turbo-buy |
| S21 | Invity blog, Turbo Buy fee update | 13 Jun 2026 | https://invity.io/blog/turbo-buy-lower-fees |
| S22 | Invity Social Media Lead job ad (StartupJobs) | posted 22 Oct 2026 | https://www.startupjobs.cz/nabidka/108781/social-media-lead |
| S23 | Bitvocation blog, *POW Lab October recap* (Builder Calls hosted by Kitti; meme quiz) | Nov 2026 | https://blog.bitvocation.com/p/pow-lab-october-recap-less-waiting |
| S24 | Invity About us (Academy, Straight from Invity, Broken Money eBook) | read 9 Nov 2026 | https://www.invity.io/about-us |
| S25 | Invity blog, How to Bitcoin directory | 9 Jan 2025 · read 9 Nov 2026 | https://www.invity.io/blog/how-to-bitcoin-everything-you-wanted-to-know-about-crypto |
| S26 | Invity blog, Turbo Buy fee → 9.9% p.a. | 13 Jun 2026 | https://www.invity.io/blog/turbo-buy-lower-fees |
| S27 | Invity blog, MiCA July 1, 2026 deadline | 24 Jun 2026 | https://www.invity.io/blog/mica-july-2026-deadline-what-it-means-for-your-bitcoin |
| S28 | ESMA MiCA Art. 66 | read 9 Nov 2026 | https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-66-obligation-act-honestly-fairly |
| S29 | ESMA MiCA Art. 7 | read 9 Nov 2026 | https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-7-marketing-communications |
| S30 | Broken Money eBook landing + PDF | read 9 Nov 2026 | https://www.invity.io/broken-money-and-the-way-out |
| S31 | Market Researcher: MiCA Bitcoin-only pack + invity-viz charts | 9 Nov 2026 | research canvas + /workspace/invity-viz/ |
| S32 | Secondary: X Paid Partnerships crypto ineligible EU/UK/AU (X Help 403) | 2–3 Mar 2026 | https://crypto-economy.com/x-paid-partnership-rules-bar-crypto-promos/ |
| Own | Kitti's email records and reports (read-only verification, `/workspace/invity/verification.md`, 9 Nov 2026), masterfile | — | not public |

Not used: Statista (paywalled; the CPM-by-country chart could not be read). Meta and Google don't publish official CPM/CPC benchmark pages for crypto or fintech, so their policy pages are cited and their numbers aren't.

## 2. Benchmark table (low / base / high)

| Input | Low | Base | High | Basis |
|---|---|---|---|---|
| Meta CPM, Czechia | €4.47 | **€5.54** | €6.70 | S4 ($6.20; range $5.00–7.50). All categories; finance may differ |
| Meta CPM, Germany | €7.15 | **€8.98** | €10.72 | S4 ($10.05). DE/CZ ratio **1.62** = Germany multiplier for paid CPIs |
| Meta CPM, finance advertisers (context only) | — | €1.32 | — | S3 $1.48 worldwide finance median, Q2 2026 (global mix; not a default) |
| Meta link CTR, finance | 0.40% | **1.0%** | 1.46% | S3 IG feed ~0.40%; S1 0.98% (US 2025); S3 1.22% (finance worldwide); S7 crypto apps 1.2%; S2 1.46% (US 2026) |
| Meta CPC, finance | €0.12 | €0.55 | €1.09 | S3 $0.13; base implied by €5.54 CPM ÷ 1% CTR; S1 $1.22 US |
| X ads CPC | €0.16 | — | €0.66 | S8 median $0.18 (AgencyAnalytics); $0.74 Hootsuite's own |
| X ads CPM | — | €1.87 | — | S8 $2.09 (Hootsuite's own) |
| Cost per install, finance/crypto app, Meta, CZ | €2.59 | **€6.00** | €9.56 | Low S7 crypto CPI $2.90 (global H1 2025). Base: S5 Europe finance CPI $7.40 = €6.61 × CZ CPM index (5.54/6.32 EU avg = 0.88) ≈ €5.8, rounded to €6. High: S5 AppsFlyer finance iOS social & search $10.70 |
| Cost per install, Germany | €4.20 | €9.70 | €15.50 | CZ × 1.62. **Derived, not a published German figure** |
| Click → install | 5% | **10%** | 15% | S7 crypto IPM 0.97 ÷ (1.2% × 1,000 = 12 clicks per mille) ≈ 8%; range **analyst estimate** |
| Install → sign-up | 21% | **30%** | 45% | Low S9 (21% in week 1, old); base/high **analyst estimate** |
| Sign-up → KYC completed | 30% | **50%** | 70% | S11 "drop-off exceeding 50%, sometimes 70%"; S10 68% abandoned a financial application (2022); high **analyst estimate** (Czech Bank iD could help) |
| KYC completed → first purchase | 25% | **55%** | 70% | **Analyst estimate.** Low implied by S12 "industry" sign-up→funded 12.4% at 50% KYC |
| Repeat buy within 30 days (of first buyers) | 15% | **50%** | 70% | **Analyst estimate.** S9: 15% of new fintech sign-ups transact more than once in week 1 (different base) |
| Auto Buy active at 30 days (of repeat buyers) | 50% | **70%** | 85% | **Analyst estimate. No public benchmark found** |
| Creator fee, Czech micro creator (10–50k), one Reel | €123 | **€250** | €410 | S13: 3,000–10,000 CZK. Nano 800–2,500 CZK (€33–103); mid-tier 10,000–25,000 CZK (€410–1,026). **No Bitcoin/finance-specific Czech rate card found** |
| Creator views per creator · view→click · click→install | — | 15,000 · 1.0% · 25% | — | **Analyst estimate. No public benchmark found** |
| Instagram / Facebook engagement, finance brands (context) | — | 2.85% / 1.35% | — | S3 |
| Day-30 app retention, finance (context only) | — | 2% | — | S7 citing Adjust: app opens, not purchase-plan retention, so not used |
| Day-1 retention, crypto apps (context) | — | 15.7% | — | S6 |
| Referral reward | — | up to €20 each side | — | S19, Invity's public offer (€2 per buy for the first 10 buys, each side) |
| Invity take rate | 0.25% | **1.0%** | 2.0% | **Analyst range for contribution margin** (not the list fee). Public list fee resolved (S20, S26, 9 Nov 2026): **1.49% service fee per transaction** + **9.9% p.a. only on Turbo's extra 60%** (cut effective 13 Jun 2026). Unverified earlier 0.49% discarded. |
| Early drop after month 1 · monthly churn · variable cost per active plan | — | 30% · 5% · €0.30 | — | **Analyst estimate. No public benchmark found** |

## 3. Calculator defaults, by input

### 1 · Acquisition scenario planner
| Input | Default | Range | Source |
|---|---|---|---|
| Monthly budget | €3,000 | €500–20,000 | planning input (media, creator fees, referral rewards only) |
| Scenario | Base | cautious / base / upside | cautious = CPI ×1.30, conversion ×0.80; upside = CPI ×0.85, conversion ×1.15. **Analyst estimate** |
| Market | Czechia | CZ / DE | DE multiplies **paid** CPIs (Meta, X) by 1.62 (S4) |
| Diminishing-returns k | 0.10 | 0–0.5 | **analyst estimate**, editable curve |
| Install → sign-up / Sign-up → KYC / KYC → first purchase | 30% / 50% / 55% | see table | S9 / S10, S11 / S12 + **analyst estimate** |
| Organic & community | weight 30, CPI €4, cap €1,500/mo, quality 1.0 | | **analyst estimate** (production cost per install) |
| Creators | weight 50, CPI €7, cap €4,000/mo, quality 1.1 | | CPI derived from Calculator 4 defaults (€250 ÷ 37.5 installs ≈ €6.70); cap and quality **analyst estimate** |
| Referral | weight 20, CPI €6, cap €1,000/mo, quality 1.3 | | reward from S19 × assumed buy rate + operations; **analyst estimate** |
| Paid social · Meta | weight 0, **locked until "approved"**, CPI €6, cap €20,000, quality 0.9 | | S5, S7, S4 |
| X ads | weight 0, **locked until "approved"**, CPI €6, cap €2,000, quality 0.9 | | **analyst estimate** from S8 CPC; no public X finance CPI found |

### 2 · Funnel
Impressions 200,000 · CPM €5.54 (S4) · CTR 1.0% · click→install 10% · install→sign-up 30% · sign-up→KYC 50% · KYC→first purchase 55% · first buyer→repeat in 30 days 50% · repeat→Auto Buy active 70%. The "benchmark high" used for sensitivity: CTR 1.46%, install 15%, sign-up 45%, KYC 70%, first purchase 70%, repeat 70%, Auto Buy 85%.

### 3 · Experiment power
Baseline 4% (**analyst estimate**, e.g. 14-day first-purchase rate of non-buying sign-ups) · relative lift 20% · power 80% · α 5% two-sided · 300 eligible users/day (**analyst estimate**).

### 4 · Creator pilot
3 creators · €250 fee each (S13, S14) · €0 boost · 15,000 views each · 1.0% view→click · 25% click→install · 8.25% install→first purchase (= 30% × 50% × 55%, Calculator 2 defaults). All reach and rate inputs are **analyst estimates**.

### 5 · Payback / contribution
Average monthly buy €100 (Invity's own *illustration* on S20, not user data) · take rate 1.0% (**analyst range 0.25–2.0%; fee must come from Invity**) · other revenue €0 · variable cost €0.30/plan/month · 30% drop after month 1 · 5% monthly churn after · 24 months · acquisition cost €80 (or pull the planner's spend per first buyer). All **analyst estimates**.

### 6 · Content time budget
| Format | Per week | Hours to make | Review hours | Second-language uplift |
|---|---|---|---|---|
| One Question carousel | 1 | 4 | 1 | yes |
| Under the Hood clip | 1 | 5 | 1 | yes |
| Stack Habits post | 1 | 2 | 0.5 | yes |
| Ask Invity Live (monthly) | 0.25 | 8 | 2 | yes |
| Meme Decoder | 0.5 | 2 | 0.5 | yes |
| Short X posts and reply threads | 5 | 0.5 | 0.25 | no |

Fixed per week: moderation 5 h, creator coordination 3 h, reporting 3 h, meetings 3 h. Second-language uplift 25%. Capacity 40 h. Result at defaults: **39.3 h/week, 98% of one person**. All **analyst estimates**.

## 4. Formulas (as implemented in `src/calc.js`, inlined in `index.html`)

**Planner**
- Weights: `share_i = max(w_i,0) / Σ max(w_j,0)`; disabled (unapproved) channels count as 0.
- Allocation: `alloc_i = budget × share_i`; `used_i = min(alloc_i, cap_i)`; `unusable_i = alloc_i − used_i`; unusable share `= Σ unusable / budget`.
- Rising cost: `CPI_i = baseCPI_i × marketMult(paid only) × scenarioCPI × (1 + k × used_i / 1000)` (average CPI at that spend).
- `installs_i = used_i / CPI_i`
- `KYC_i = installs_i × signup × KYC × scenarioConv` (capped at 100%)
- `firstBuyers_i = KYC_i × min(1, buyRate × scenarioConv × quality_i)`
- Spend per first buyer `= Σ used / Σ firstBuyers`. The budget curve repeats this for €500–€20,000 at the current mix.

**Funnel**
- `spend = impressions × CPM / 1000`; each stage `count_n = count_(n−1) × rate_n`; `cost per stage = spend / count_n`.
- Sensitivity: for each step separately, set its rate to the benchmark high (if higher) and report `final_new / final_base − 1`. The largest is the "biggest lever".

**Power** (two-proportion z-test, normal approximation, equal allocation, two-sided)
- `p2 = p1 × (1 + lift)`, `p̄ = (p1 + p2)/2`
- `n per arm = ⌈ [z(1−α/2)·√(2p̄(1−p̄)) + z(1−β)·√(p1(1−p1) + p2(1−p2))]² / (p2 − p1)² ⌉`
- `runtime days = ⌈ 2n / eligible users per day ⌉`. z via Acklam's inverse-normal approximation. Plan once, no peeking.

**Creator pilot**
- `cost = creators × (fee + boost)`; `views = creators × reach`; `clicks = views × clickRate`; `installs = clicks × installRate`; `attributed buyers = installs × purchaseRate`; `cost per attributed buyer = cost / buyers`. Attribution ≠ incrementality.

**Payback**
- `active(1) = 1`; `active(2) = 1 − earlyDrop`; `active(m) = (1 − earlyDrop) × (1 − churn)^(m−2)` for m ≥ 2.
- `contribution per active plan per month = avgBuy × takeRate + otherRevenue − variableCost`
- `cumulative(M) = Σ_{m=1..M} active(m) × contribution`; payback month = first m with cumulative ≥ CAC (else "not within horizon"); ratio = cumulative(horizon) / CAC.

**Content time budget**
- `hours_f = perWeek_f × (make_f + review_f) × (1 + uplift if localised)`; `total = Σ hours_f + moderation + creator coordination + reporting + meetings`; `utilisation = total / capacity`.

## 5. Shareable state
Every input that differs from its default is written to the query string as `calc.key=value` (`p.` planner, `f.` funnel, `x.` power, `c.` creator, `y.` payback, `t.` content time), plus `walk=1` for the walkthrough view. Example: `index.html?p.budget=8000&p.ok_meta=1&p.w_meta=40&x.base=2&walk=1`.


## 6. v1.1 additions (9 Nov 2026 evening)
- Competitive charts copied to `assets/` from Market Researcher pack; caveats on page.
- Education engine: Academy / blog / Straight from Invity / Broken Money — no invented Academy lesson titles.
- Fee conflict resolved to 1.49% + 9.9% p.a. boost (S20, S26).
- Compliance: Meta, X (Ads vs partnerships), MiCA Arts 6/7/66, MNB, DSA/GDPR/ePrivacy/UCPD notes — see COMPLIANCE.md.
- Cookie-free microsite; absolute OG URL placeholder; noindex removed.
