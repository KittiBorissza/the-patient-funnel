# Make Bitcoin feel within reach

Kitti Borissza's independent application proposal for the Social Media Lead role at Invity. Not an official Invity page and not endorsed by Invity.

## What's here

- `index.html`: the whole page. Static HTML with inline CSS, no scripts, no web fonts, no cookies, trackers or analytics. Works on GitHub Pages from the repo root. The distinctive idea is that Invity can earn attention by showing people the parts they need to see before they decide, starting with the Bitcoin-curious person who has not bought yet. The multi-market planning forecast lives on the strategy page.
- `strategy.html`: “The plan behind it”, linked from the main page. Its planning forecast (`#forecast`) is one tool that starts from “What can I learn with this budget?”: pick what to learn (which opening keeps people watching, how many first purchases a budget could support, or a controlled comparison between two openings or two markets), a market and a monthly Meta budget (example budgets €500–€15,000 or typed), and get estimated volume, what you could learn and a next move, with impressions, clicks and implied CPC, a campaign-structure recommendation, separated assumptions (published benchmarks from AdSpendSpy, adtribute and Adjust; illustrative inputs; what you typed) and a “Budget needed” panel that keeps delivery volume apart from A/B sample size. Below it, the same market sits in the full monthly plan: editable CPM/CTR against published ranges, channel shares that rebalance to 100%, Cautious/Base/Upside and an all-markets table with language versions (Hungary marked to confirm). Then seven testable creatives, first 30 days, and what Invity data would replace the assumptions. Inline vanilla JS with the maths as pure functions (`window.PlanCalc`); works without it (explanation shown).
- `content-calendar.html`: a four-month Content Calendar (10 November 2026 to the end of February 2027) with monthly themes, flagged entries, verified culture-date sources, and seven ready-to-review examples, including a standby WAGMI piece for red-market days. Linked from the homepage and from the Funnel Ad Gallery.
- `ad-gallery.html`: a Funnel Ad Gallery of eight independent paid-social concepts across four stages. Each card leads with the creative (mock-up, headline and short copy), then who it is for and what we want to learn; production notes sit behind a disclosure. Includes a fees-versus-custody A/B pair, typographic 4:5 mock-ups, and a short note on letting someone choose what happens after they engage. Linked from the homepage and from the Content Calendar.
- `assets/`: typographic 4:5 mock-ups used on the Ad Gallery (`mock-hodl-4x5.png`, `mock-withdraw-4x5.png`, `mock-fees-4x5.png`), and a typographic 4:5 WAGMI GIF plus still for the Content Calendar (`wagmi-4x5.gif`, `wagmi-still-4x5.png`), all labelled as independent concepts.
- `og.png`: 1200×630 share image (matches the page headline). Meta tags point at `https://kittiborissza.github.io/the-patient-funnel/og.png`.
- `cv/`: Kitti's CV as a PDF, linked from the "About me" section.
- `archive/v1.1.0/`: the previous version of the site ("The Patient Funnel", v1.1.0), kept so it can be recovered. Marked `noindex` and not linked from the main page.
- `archive/notes/`: research moved off the main page (competitor pack and charts, compliance notes and sources, creative inventory, calculator assumptions, the old plan sections, a MiCA wording note and open questions). See `archive/notes/README.md`.
- `CHANGELOG.md`: what changed and why.

Build tooling and screenshot tests are kept outside the public folder; nothing needs building to deploy.

## Markets (checked 9 Nov 2026)

The market list comes from ESMA's interim MiCA register (CASP file, last updated 1 Sep 2026): Invity Finance s.r.o., authorised by the Czech National Bank on 11 Feb 2026, with cross-border services listed for AT, DE, IT, SK, ES, NL and PL. Invity's FAQ says the current country list is shown during sign-up, so that list is the one to confirm. Hungary is not on the register's list; it is included as Kitti's addition and marked "to confirm".
