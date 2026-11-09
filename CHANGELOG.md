# Changelog

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
