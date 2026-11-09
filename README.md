# Make Bitcoin feel within reach

Kitti Borissza's independent application proposal for the Social Media Lead role at Invity. Not an official Invity page and not endorsed by Invity.

## What's here

- `index.html`: the whole page. Static HTML with inline CSS and one small inline script (the A/B check in “How I’d know if it’s working”; the page works without it), no web fonts, no cookies, trackers or analytics. Works on GitHub Pages from the repo root.
- `strategy.html`: “The plan behind it”, linked from the main page: a channel planner (budget slider, one share slider per channel that rebalances to 100%, Cautious/Base/Upside, referral cap) on synthetic numbers, seven testable creatives, first 30 days, and what Invity data would replace the assumptions. Inline vanilla JS; works without it (explanation shown).
- `og.png`: 1200×630 share image (matches the page headline). Meta tags point at `https://kittiborissza.github.io/the-patient-funnel/og.png`.
- `cv/`: Kitti's CV as a PDF, linked from the "About me" section.
- `archive/v1.1.0/`: the previous version of the site ("The Patient Funnel", v1.1.0), kept so it can be recovered. Marked `noindex` and not linked from the main page.
- `archive/notes/`: research moved off the main page (competitor pack and charts, compliance notes and sources, creative inventory, calculator assumptions, the old plan sections, a MiCA wording note and open questions). See `archive/notes/README.md`.
- `CHANGELOG.md`: what changed and why.

Build tooling and screenshot tests are kept outside the public folder; nothing needs building to deploy.
