# CHANGELOG: The Patient Funnel (site-v2)

## 1.1.0 · 9 Nov 2026 (evening)
Kitti asked to integrate Market Researcher competitive pack, answer the Social Media Lead brief, ship test-ready creatives, and harden Meta/X/EU compliance. Education assets (Academy, blog, newsletter, eBook) added as the growth engine.

**New sections**
- Client brief answered (job-ad requirement → plan mapping).
- Education as the growth engine (Academy / Straight from Invity / Broken Money / blog hooks; Academy completion as activation metric; no invented lesson titles).
- Competitive context with four local chart PNGs (`assets/01`–`04`) + counter-moves + research caveats.
- Test-ready creatives C1–C11 (Meta feed/Reels, X thread/post, carousels, creator brief, newsletter, CZ/DE drafts).
- Compliance notes (Meta, X Ads vs Paid Partnerships, MiCA Art. 66/7/6, MNB, DSA/GDPR/ePrivacy/UCPD) + `COMPLIANCE.md`.

**Corrections**
- Fee conflict **resolved**: public Turbo FAQ + 13 Jun 2026 blog → **1.49% service fee/trx** + **9.9% p.a. on boost only**. Discard unverified 0.49%. Calculator take-rate remains analyst contribution-margin range.
- X policy wording split: X Ads (certification) vs Paid Partnerships (EU/UK/AU financial ineligibility per secondary sources; X Help 403 — verify in-account). Creator pilot still prefers IG/YouTube for EU paid KOL.
- Meta: note that CNB MiCA is not explicitly on Meta’s published accepted-licence list — open sign-off item.
- MiCA July 1, 2026 transitional messaging linked to Invity’s own blog (calm, not scare).

**Technical**
- Removed `noindex`. Absolute `og:image` / `twitter:image` → `https://kittiborissza.github.io/the-patient-funnel/og.png` via `SITE_CONFIG.baseUrl`.
- Cookie-free footer note; charts as local assets (no remote hotlink).
- Nav expanded; sources S24–S32 in `app.js` / ASSUMPTIONS.

## 1.0.0 · 9 Nov 2026
New standalone microsite, separate from the earlier Growth Desk (https://invity-growth-desk-kitti.borisszakitti.chatgpt.site/, not modified).

**Name and framing**
- New project name, **The Patient Funnel**, instead of "Growth Desk". Alternates considered: *Smallest Viable Stack*, *Permission to Stack*.
- Framed throughout as an independent application. Footer: "Independent application proposal. Not an official Invity page." No Invity logo, wordmark or screenshots.

**Content changes vs Growth Desk**
- One pilot market (Czechia, Germany second) instead of four markets (CZ/DE/ES/PL).
- The plan opens with three Godin-style questions (who, what change, what they'd tell a friend), then the smallest viable audience, the trust ladder, one remarkable thing per sprint, and a permission-first CRM and community section.
- Claims are tagged *public evidence / my inference / needs internal data*. "What would change my mind" boxes on the major assumptions.
- One experiment list (E1–E4 from the revised plan PDF); the older "Habit vs first-step / Creator / Referral" lab is gone. Each brief now has a minimum viable test, owner and dependencies.
- Removed unsupported claims flagged in `out/website_changes.md`: no "first CNB MiCA registration" or "MiCA pioneer" (page uses invity.io's wording, "licensed under MiCA by the Czech National Bank"), no Blocktrainer partnership, no "30k+ users / $2B brokered", **no service-fee figure** (later resolved in 1.1.0).
- Evidence of work uses only verified items, with team results labelled.
- Not included: KINCS, the Artemisszió HUF 400,000 claim, "In Bitcoin since 2017".
- Creator pilot noted X paid-partnership limits for crypto in the EU (policy reported Mar 2026); runs on Instagram/YouTube.

**Calculators (6)**
- Acquisition planner, Funnel, Experiment power, Creator pilot, Payback/contribution, Content time budget.
- Pure maths in `src/calc.js` with tests in `tests/calc.test.js`.

**Technical**
- One built `index.html` (CSS/JS inlined) plus local `og.png` / later `assets/` charts; system fonts; mobile-first; print stylesheet.
