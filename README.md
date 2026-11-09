# The Patient Funnel (site-v2)

Kitti Borissza's independent application microsite for Invity's Social Media Lead role. Static folder: open `index.html` or host on GitHub Pages.

- `index.html`: built page (CSS, maths and UI inlined). Rebuild: `node tools/build.js`.
- `og.png`: 1200×630 share image. Meta tags already point at the Pages absolute URL `https://kittiborissza.github.io/the-patient-funnel/og.png` (`SITE_CONFIG.baseUrl` in `src/page.html`).
- `assets/`: competitive chart PNGs (self-hosted; no remote requests).
- `src/`: `page.html`, `style.css`, `calc.js`, `app.js`.
- `tests/calc.test.js`: formula tests (`node tests/calc.test.js`).
- `tools/render.js`: headless Chrome screenshots (needs puppeteer-core + Chrome).
- `ASSUMPTIONS.md`, `DESIGN.md`, `CHANGELOG.md`, **`COMPLIANCE.md`** (policy sources, dates, open sign-offs).

**Privacy:** no cookies, pixels or third-party trackers on this microsite.

**Not published from this folder automatically** — push / Pages enablement is a separate step.

Live at https://kittiborissza.github.io/the-patient-funnel/
