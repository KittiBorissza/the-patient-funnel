# Changelog

## 2.7.0 · 11 Nov 2026

The homepage now leads with the 100-day commitment, and the Strategy Lab opens with a Budget Forecast Calculator.

- **Hero.** Same headline and Auto Send artwork. The intro states the 100-day commitment; the main button goes to the plan, the second to the creative work. A three-step summary (listen daily, publish continuously, decide weekly) follows the hero.
- **100 days.** Starts with what would be running by day 100, then walks one wallet question through listen → brief → create → decide, naming what Kitti does, what AI speeds up and who decides. The approval process sits under the channel and market plans.
- **Funnel and work samples.** The four-stage funnel is now a creative index that opens each piece in the Ad Gallery. Creative Performance sits beside its next decision and the GamerHours measurement case. The gallery and calendar show work sooner, and every page has the same menu.
- **Budget Forecast Calculator.** Four presets per market (Minimum €250, Medium €500, Optimum €1,000, Growth Machine €1,500; €0 allowed). Total spend is always shown. One budget, two scenarios: one focused channel or a spread across four. Each channel estimates only what it has a benchmark for, as a range, with a source-fit label and the decision it supports. First purchases appear only with a stated conversion assumption. The homepage preview and the Strategy Lab use the same model in `forecast-model.js`.
- **Motion and scroll.** Every tab, disclosure, picker, preview, filter and calculator choice fades its new content in and scrolls to it when it would land below the fold. In-page links scroll smoothly, buttons give a slight press. All of it switches off under reduced motion.
- **Fixes.** The gallery’s fees-versus-custody hook cards were white on white, and the gallery widgets turned dark (and unreadable) under OS dark mode; wide tables now show a scroll cue; heading levels no longer skip.
- **Labels.** Past results are marked “Actual result”; the fees-versus-custody comparison is marked as a planned test; the dashboard stays illustrative.

## 2.6.0 · 10 Nov 2026

One forecast instead of two: the “What can I learn with this budget?” Meta test planner and the multi-market planning forecast are now a single tool on `strategy.html#forecast`.

**What can I learn with this budget?**
- The section opens with the concrete question — should the first-purchase walkthrough open on fees or on custody? — and the tool asks one thing: what can I learn with this budget?
- Choose what you want to learn: which opening keeps people watching, how many completed first purchases the budget could support, or a controlled comparison between two openings or two markets. Each choice says what decision it informs.
- The market selector is shared by the whole forecast and still shows each market’s language version. The monthly Meta budget has four example budgets (Small €500, Medium €1,500, Large €5,000, Growth €15,000) and a field to type your own.
- One result panel answers in three lines: estimated volume, what you could learn, and the next move, with impressions, link clicks and implied CPC from that market’s planning CPM and CTR. With the defaults, €1,500 at an assumed €60 per first purchase is about 25 first purchases a month, or about 12–13 in each of two equal test groups; the even split is stated as an assumption.
- A short campaign-structure recommendation: start with one market and one acquisition ad set, and add a second only for a separate market, a controlled comparison, or a distinct objective. “Adjust setup” lets you set one to three ad sets and the budget split (even by default).
- “Assumptions” separates published benchmarks (AdSpendSpy 2026 country CPMs; adtribute’s September 2026 European DTC Meta medians; Adjust’s finance app insights report 2025, quoted in US dollars as context only, not as Invity’s cost per install), illustrative inputs (€60 per first purchase, hook-hold, click-to-install and install-to-first-purchase rates), and what you have typed. You can switch between a direct cost per first purchase and a funnel breakdown.
- “Budget needed” keeps Meta delivery volume (how much budget buys a number of first purchases) apart from experimental sample size (how large each group needs to be for a controlled A/B test at 80% power and 5% significance). If an input is missing, it lists what is needed instead of calculating.

**Kept from 2.5.0**
- Multi-market thinking, editable planning CPM and CTR with the published ranges and caveats, the five channel sliders with synthetic costs per install, Cautious/Base/Upside, and the all-markets table now sit under “From one test to the full month, market by market”. That section explains how the Meta test budget relates to each market’s paid-social share.
- Still labelled a planning forecast. No number on the page is Invity data. No cookies, trackers, analytics or external scripts; works without JavaScript (an explanation is shown), and every control is keyboard accessible.


## 2.5.0 · 10 Nov 2026

A tightening of the application around one idea, and an upgrade of the multi-market plan into a planning forecast that senior readers can measure against.

**The idea**
- The distinctive point is now unmistakable: Invity can earn attention by showing people the parts they need to see before they decide. The first audience is the Bitcoin-curious person who has not made a first purchase; Auto Buy is treated as a second decision.
- A point-of-view sentence sits near the top of the homepage: the fee screen, the custody explanation, and the way out.
- About me leads with the work (agency and freelance social, startups and technology communities, POW Lab Builder Calls, blockchain developer programmes), then the motivation, including that AI tools have made making enjoyable again. It does not lead with a gap in full-time social, and it does not add claims that were not already on the page.

**Planning forecast** (`strategy.html#forecast`)
- The €2,000-per-market tool stays in the application and is labelled a planning forecast, not a prediction of Invity’s results. Assumptions can be typed over and should be replaced with Invity data.
- Paid social starts from average CPM and CTR. Country CPM defaults are 2026 AdSpendSpy estimates for a standard Meta campaign; the default CTR is adtribute’s September 2026 European DTC median of 1.19%. Both sources are cited, with the caveat that they are not a Bitcoin or regulated-finance panel, and that mixing a country CPM with a European DTC CTR can imply a cheaper click than adtribute’s median CPC.
- Each market shows its language version, with a note where marketing language and the public app UI may differ.
- The all-markets table puts budget, languages, social CPM, CTR, clicks, installs and first buyers in one view.
- The first 30 days and the creatives still plan across every market; the forecast is how to see where a first comparison has enough volume, not a promise to switch every market on at once.
- The homepage significance calculator has been removed so it no longer interrupts the story; the forecast is linked from “How I’d know if it’s working”.

**Content Calendar and Ad Gallery**
- 17 November is now “What should you check before buying your first bitcoin?” 19 November is a proposed Instagram Story poll (Fees / ID / Where it’s held / Something else). The WAGMI standby piece is unchanged.
- Gallery cards lead with the mock-up, headline and short copy. Who it is for and what we want to learn sit immediately under that; production notes are behind a disclosure.
- The A/B pair is described as a wording-only test if the opening visual stays the same, and as a package test if the first screen also changes.
- A short “If someone wants more, let them choose” note sits before the stages: read the guide, ask a question, subscribe, or stop there.
- The fees-first typographic mock-up now uses the same risk line as the site copy: “Bitcoin can lose value. Make sure you understand the risks before deciding whether to buy.” Unsupported product phrasing (including unconditional “any time” withdrawal, and “only buy what you can hold through that”) has been softened on the public pages, with public-page claims flagged for Invity to check.

**Also**
- On smaller screens, the top navigation is a single horizontally scrollable row, so it no longer wraps over the hero.
- No cookies, trackers or analytics. Product details still pending verification.


## 2.4.1 · 10 Nov 2026

A standby WAGMI piece for red-market days, added to the Content Calendar.

- A new “When the market is red” section, undated on purpose: there is no verified WAGMI anniversary the way there is for “I AM HODLING”.
- A typographic 4:5 looping GIF (`assets/wagmi-4x5.gif`) that opens on an abstract red chart, slams into WAGMI, then settles on the fine print: a gym phrase crypto borrowed, not a promise about the price. A still of the last frame is saved as `assets/wagmi-still-4x5.png`. Labelled as an independent concept, not an Invity ad.
- A seventh ready-to-review example: caption, spoken cut-down, and sources. The origin is reported by Vice (Ekin Genç, 4 May 2022); Aziz “Zyzz” Shavershian’s death was reported by the Sydney Morning Herald (11 August 2011). The piece does not treat the phrase as a forecast or a reason to buy.
- Cross-links from the December 28 volatility carousel, the month navigation, and the how-to section.

## 2.4.0 · 10 Nov 2026

Two new pages for the social application: a four-month Content Calendar and a Funnel Ad Gallery, written as independent concepts, in the same look and voice as the main site.

**Content Calendar** (`content-calendar.html`)
- Plan from 10 November 2026 to the end of February 2027, starting with a realistic partial first month (listening days, then one pre-written Taproot note).
- A theme and a marked “if I only had time for one” piece each month; most weeks have two or three entries.
- Each entry has a date, primary channel, opening line, the question it answers, one metric, and flags for product review, local adaptation, or an approved app recording.
- Six ready-to-review examples written in full (first-purchase walkthrough with fees-first and custody-first openings, first halving, withdrawal FAQ, I AM HODLING, Genesis Block and Proof of Keys, Auto Buy without the sales pitch).
- Culture dates only when verified, with sources; unsourced meme days and generic holidays left out. Newsletter angles only from editions actually read (April, July, August and September 2026, plus the 17 August 2026 bear-market article).
- A few Czech, German, Spanish and Polish localisation notes, only where the product language or a documented extra step (Bank iD in Czechia) makes them real. Market-specific claims stay pending verification.

**Funnel Ad Gallery** (`ad-gallery.html`)
- Eight independent ad concepts across four stages: cold, engaged, high intent, and after a first purchase.
- One genuine A/B pair: the same first-purchase film, fees hook versus custody hook, with the measurement rule already on the homepage.
- A non-personalised high-intent version of the confirm-screen message, and an Auto Buy card that prefers newsletter or in-app over paid social.
- Three typographic 4:5 mock-ups (`assets/mock-hodl-4x5.png`, `assets/mock-withdraw-4x5.png`, `assets/mock-fees-4x5.png`), labelled as independent concepts, because no campaign images were supplied. Production briefs for each. No invented app screens.
- Remarketing and event audiences described as proposed setups, not as audiences Invity already runs.

**Also**
- Nav links and a short cross-link from the homepage `#make` section, and nav links from the strategy page. The two new pages link to each other.
- No cookies, trackers or analytics. Product details still pending verification.


## 2.0.0 · 9 Nov 2026 (draft, not published)

A rewrite to make the page shorter, more personal and easier to judge in a few minutes.

**The page now says**
- Who Kitti is and why Invity, in her own voice, with one line stating this is an independent proposal.
- The idea: start with Bitcoin-aware people without a buying routine, possibly in Czechia, with both the market and the Auto Buy vs single-purchase question framed as hypotheses to check with Invity.
- Three things she would make: a real first-purchase walkthrough (storyboard), a "questions people actually ask" series (sample carousel from Invity's public FAQ), and a monthly "meme, decoded" built on her Bitcoin Meme Quiz (sample script).
- A realistic first month, what depends on other teams, and what 30 days can and cannot show.
- How she would tell whether it's working, including attributed vs incremental purchases and one simple experiment with an explicit "inconclusive" rule.
- A short About paragraph, CV link and contact.

**Removed from the main page** (useful parts moved to `archive/notes/`)
- All six calculators and their benchmark tables.
- The job-ad mapping table, the 11-asset creative inventory, the two-week publishing rhythm.
- Competitive charts and fee comparisons; Turbo Buy discussion.
- The compliance section, source badges and evidence labels; repeated disclaimers.
- The "What I've actually done" campaign section with budgets and spend (this belongs in the CV).
- The five-minute walkthrough toggle, progress card and all JavaScript.

**Corrections**
- Withdrawn: "Small amounts over time beat one dramatic bet." Regular buying is not presented as better or suitable for everyone.
- The MiCA 1 July 2026 claim is no longer on the page. See `archive/notes/mica-note.md` for what ESMA says and the more careful wording.
- No comparison of an eBook opt-in with an app download as one conversion; the experiment now compares two versions of the same video.
- Custody uncertainty is no longer presented as a cause of KYC drop-off.
- No fixed creator counts or other unexplained thresholds.
- "Ten assets" vs eleven listed: fixed by moving the inventory to notes with a correction.
- No local workspace paths in public files (also removed from the archived copy).
- Product statements limited to what invity.io says (fees shown before confirming; BitGo custody; withdraw any time; Auto Send; Auto Buy) and flagged for Invity's review.
- No Czech or German copy on the page.

**Design**
- Calm editorial layout: purple gradient hero (Invity-like token scale), off-white reading column, one dark About block with a single amber CV button. System fonts only. Skip link, visible focus, semantic headings, reduced-motion support, print styles.

## 1.1.0 · 9 Nov 2026
Previous version ("The Patient Funnel"). Preserved in `archive/v1.1.0/`; its changelog is in `archive/notes/changelog-v1.md`.

## 2.0.1 · 9 Nov 2026 (draft, not published)
- About paragraph rewritten to match the CV: 15+ years in communications and marketing overall; social media and paid-social grounding from agency and freelance years (roughly 2009–2016); openly says she hasn't had a full-time hands-on social role for several years and is coming back because AI tools made the work enjoyable again and Invity is a Bitcoin company. Bitcoin (POW Lab) now comes before the earlier blockchain developer programmes; "Tezos" no longer named.
- No "web3" and no Wasabi mention on the page. The Wasabi card was also removed from the archived v1.1.0 page and from `archive/notes/plan-v1-sections.md`.
- Small copy trims elsewhere to keep the page at about 1,450 words.

## 2.1.0 · 9 Nov 2026 (not pushed)
- One calculator back, at Kitti’s request: “Is the gap real? A quick check” inside “How I’d know if it’s working”. Inputs: visits and first purchases for two walkthrough versions (opens on fees vs opens on custody). Output: rate per version and a plain verdict (“Too early to say”, “Too close to call”, “Leaning towards A/B”, never “winner”), the 95% range for the gap (Newcombe/Wilson), and roughly how many visits per version would be needed (80% power, 5% significance; formula reused from the v1 calculators). Fewer than 5 purchases in a version counts as too early, because one or two sales then swing the rate.
- Inline vanilla JS, no requests; labelled inputs, aria-live result; without JavaScript a short explanation shows instead.
- A few copy trims to keep the page near 1,450 words.

## 2.2.0 · 9 Nov 2026 (not pushed)
- New `strategy.html`, “The plan behind it”, written to a Guy Kawasaki-style brief (meaning first, bottom-up numbers, test then scale). Same look as the main page.
- Channel planner, simplified from the original Growth Desk “Acquisition scenario planner”: monthly budget slider (€1,000–€20,000), Cautious / Base / Upside, five channels for Czechia (search ads, paid social, creators and podcasts, referrals, newsletter and community), each with a share slider; moving one rebalances the others in proportion so shares always total 100% (kept as decimals internally, shown as whole percentages). Same formula as the original: CPI = base × (1 + 0.15 × spend ÷ €1,000) ÷ scenario factor; buyers = installs × buy rate × factor (max 100%); referral installs capped at 150 a month with unused money reported. Every number labelled “Synthetic example”.
- Seven creative cards (first-purchase walkthrough, questions people ask, I AM HODLING meme, custody explainer, five scams, Auto Buy does/doesn’t, Czech creator setup), each with format, idea, hook, call to action, hypothesis and one metric; risk line where a purchase is mentioned.
- First 30 days (five lines) and a table of what Invity would need to share to replace each assumption.
- Main page: nav link and one line pointing to the new page; A/B check unchanged.
- No Turbo Buy, no fee figures, no “web3”, no requests to other sites.

## 2.3.0 · 9 Nov 2026 (not pushed)

Kitti's feedback on the live page: no single-country focus, results read per market, significance testing as routine.

**Main page**
- The Czechia-first paragraph is gone. "The idea" now lists the markets on Invity's MiCA register entry (licence from the Czech National Bank; listed in Austria, Germany, Italy, Slovakia, Spain, the Netherlands and Poland), treats each as its own market, and adds Hungary with one sentence on why (Kitti is Hungarian and knows that market first-hand), conditional on Invity being able to serve it.
- First month: the same few pieces published in every market, localised, so results compare. "Native speakers for any Czech or German content" became native speakers in each market (Kitti can check Hungarian herself).
- "How I'd know if it's working": new paragraph saying significance tests run for every creative test in every market, separately; small samples stay "too close to call"; many tests across many markets make a fluke likelier, so promising results are repeated before acting.
- A/B check: market selector (labels the result; maths unchanged), note "One market, one test at a time", and the "Leaning" verdict now says flukes happen across many tests, so repeat before changing anything.

**The plan behind it**
- "The meaning" rewritten for every market Invity serves.
- Channel planner is per market: market selector, each market with its own budget and channel mix (state kept when switching), a synthetic cost index per market applied to every channel's cost per install, and a synthetic referral cap per market. Hungary included and marked "to confirm". New "All markets side by side" table (budget, installs, first buyers, spend per first buyer, totals). Same maths as 2.2.0; shares still sum to 100% in every market.
- Creatives: intro says each runs in every market with the same test; each card has a "Localising" line; card 7 is now "A local creator's first setup" (one creator per market).
- First month rewritten: same measurement in every market at once, same tests in parallel, significance check per market per test.
- "What would replace the assumptions": adds live market list (and Hungary), per-market ad approvals, per-market compliance and local marketing rules, per-market referral caps and costs.

**Tests**
- `plan.test.js`: 15 → 23 tests (markets list, per-market channels and caps, independence of plans, portfolio totals, cost index effect).
- `test4.js`: market switching, plan kept per market, all-markets table, no-JS state.
