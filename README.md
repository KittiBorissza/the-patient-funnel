# Make Bitcoin feel within reach

Kitti Borissza's independent application proposal for the Social Media Lead role at Invity. Not an official Invity page and not endorsed by Invity.

## What's here

- `index.html`: the whole page. Static HTML with inline CSS and one small inline script (the A/B check in “How I’d know if it’s working”, run per market and per test; the page works without it), no web fonts, no cookies, trackers or analytics. Works on GitHub Pages from the repo root.
- `strategy.html`: “The plan behind it”, linked from the main page: a per-market channel planner (market selector; each market has its own budget slider and channel shares that rebalance to 100%; Cautious/Base/Upside; synthetic cost index and referral cap per market; an all-markets table, Hungary marked to confirm) on synthetic numbers, seven testable creatives, first 30 days, and what Invity data would replace the assumptions. Inline vanilla JS; works without it (explanation shown).
- `og.png`: 1200×630 share image (matches the page headline). Meta tags point at `https://kittiborissza.github.io/the-patient-funnel/og.png`.
- `cv/`: Kitti's CV as a PDF, linked from the "About me" section.
- `archive/v1.1.0/`: the previous version of the site ("The Patient Funnel", v1.1.0), kept so it can be recovered. Marked `noindex` and not linked from the main page.
- `archive/notes/`: research moved off the main page (competitor pack and charts, compliance notes and sources, creative inventory, calculator assumptions, the old plan sections, a MiCA wording note and open questions). See `archive/notes/README.md`.
- `CHANGELOG.md`: what changed and why.

Build tooling and screenshot tests are kept outside the public folder; nothing needs building to deploy.

## Markets (checked 9 Nov 2026)

The market list comes from ESMA's interim MiCA register (CASP file, last updated 1 Sep 2026): Invity Finance s.r.o., authorised by the Czech National Bank on 11 Feb 2026, with cross-border services listed for AT, DE, IT, SK, ES, NL and PL. Invity's FAQ says the current country list is shown during sign-up, so that list is the one to confirm. Hungary is not on the register's list; it is included as Kitti's addition and marked "to confirm".
