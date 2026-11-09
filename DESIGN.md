# Design note: The Patient Funnel

**Intent:** a clearly separate sibling of Invity's look. The same rhythm (purple vertical gradient header, white rounded cards, bold purple pills, round translucent action buttons, thin line icons, a small progress card) under its own name and mark, with no Invity logo, wordmark, fonts or screenshots.

## Where the values come from
- **Colours:** read from the CSS custom properties in invity.io's HTML (`--color-invity-purple-*`, `--color-invity-gray-*`, `--color-invity-red-*`, 9 Nov 2026). The site also uses `linear-gradient(165deg,#8b3eda 0%,#a855f7 50%,#6d28d9 100%)` for some purple panels. I used the token scale and built my own vertical gradient from it.
- **Fonts:** invity.io uses **Lufga** (headings, `--font-heading`) and **TT Hoves Pro** (body, `--font-sans`), self-hosted as TTF. Both are commercial typefaces, so this page **does not copy them**. It uses the system UI stack (San Francisco / Segoe UI / Roboto / Noto Sans) at heavier weights (700–800) with tight tracking (−0.02em) to keep the same rounded, confident feel without the brand fonts. No web fonts are loaded.
- **Radii:** invity.io tokens go up to `--radius-3xl: 1.5rem` (24px). Cards here use 24px, inner fields 14–16px, pills 999px.
- **App screenshot:** the reference screenshot path in the brief was **not present on the box** (the attachments folder only held PDFs/MD), so the app-specific cues (gradient header, round translucent action buttons, "Finish account setup"-style progress card, thin icons) follow the brief's description, not a pixel check.

## Palette used
| Role | Hex | Token origin |
|---|---|---|
| Hero gradient (top → bottom, 180°) | `#8c3fff → #781cff → #6016cc → #4d11a3` | Invity purple 400/500/600/700 |
| Primary button / links | `#6016cc` (hover `#4d11a3`) | purple-600 / 700 |
| Hero primary button | white with `#4d11a3` text | — |
| Dark surfaces (top bar, results panels, footer) | `#24084c` | purple-900 |
| Tints (tags, soft buttons, slider track) | `#f1e8ff`, `#e4d1ff`, `#c9a3ff` | purple-50 / 100 / 200 |
| Page background | `#f7f7f8` | gray-50 |
| Body text / muted text | `#0f1018` / `#4e4f55` | gray-800 / 500 |
| Lines | `#ededef`, `#d9d9da` | gray-100 / 200 |
| Own accent (charts, warnings on dark, hero focus ring) | `#ffd27a` | mine: separates the sibling from the brand |
| Status tags | ok `#1f7a3f`/`#e6f4ea`, warn `#8a4b00`/`#fff3df`, risk `#b0001a`/`#ffe9ec`, team `#0b4fb3`/`#e7f0ff` | mine (Invity's red `#ff283d` fails contrast as text) |

## Contrast (WCAG 2.1, computed)
White on `#8c3fff` 4.92 · white on `#781cff` 6.16 · white on `#6016cc` 8.45 · `#4d11a3` on white 10.9 · `#4e4f55` on `#f7f7f8` 7.6 · warn tag 6.2 · ok tag 4.7 · amber on `#24084c` 12.2. All text pairs ≥ 4.5:1.

## Components
- **Top bar:** sticky, `#24084c` at 92% with blur; mark (three stacked rounded bars = a funnel) + "The Patient Funnel"; mini-nav Plan · Calculators · Experiments · Content · Evidence with `aria-current`; the **Five-minute walkthrough** switch (`aria-pressed`) shows a six-line Kawasaki-style pitch, hides `.deep` blocks, and raises the type size.
- **Hero:** eyebrow pill, 800-weight headline, two pills ("See the 30-day plan", "Open the calculators"), illustrative-numbers note, four round translucent icon buttons, and a white "Your five minutes" progress card (sibling of the app's "Finish account setup" card) that fills as Plan, Calculators and Evidence of work scroll into view.
- **Cards:** white, 24px radius, soft purple-tinted shadow; tinted cards for the trust ladder and work sample.
- **Calculators:** grey field tiles (label + "?" tooltip + slider + numeric field + "Assumption:" line), dark `#24084c` results panel (sticky on desktop) with KPI tiles and inline SVG charts.
- **Motion:** one subtle fade-up on scroll (IntersectionObserver), switched off under `prefers-reduced-motion`.
- **Print:** white background, no nav/sliders/tooltips, cards unbroken, link URLs printed, all sections expanded.
