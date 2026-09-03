# RAIS site: foerderung.de inspiration (motion + 3D glass)

Working brief for bringing live [ritz-ai.solutions](https://ritz-ai.solutions/) into this repo and restyling with motion/structure inspired by [foerderung.de](https://foerderung.de/), adapted to RAIS brand.

## Decisions

- Full visual restyle inspired by foerderung.de, **adapted to RAIS brand**.
- Take **motion and section structure**, keep RAIS colors, type, and editorial tone (no teal SaaS clone, no dark-tech startup look).
- Treat **live ritz-ai.solutions as source of truth** and import it into this git repo.
- 3D glass symbols: **Spline scenes** with slight tilt/float, not CSS fakes; self-hosted with static fallbacks.
- `/ai-roadmap` stays a separate conversion landing, reachable from the main page.

## Live vs local gap (verified)

Local was behind live. Live home sells “System-Problem”, a system catalog, four automation stages, a live pipeline simulation, and a Prozesshandbuch magnet. `/ai-roadmap` is live and converting; it was missing from this repo.

Live pages to keep in sync:

- `/` (homepage)
- `/ai-roadmap` (pretty URL → `ai-roadmap.html`)
- `/aqut.html` (AMS system page)
- `/referenzen.html` (Systemkatalog)
- `/ueber-uns.html` and remaining inner pages

## What we take from foerderung.de

### A. Crystal 3D objects

Thick translucent glass icons (shield, bars, speech bubble) on a dark green band. Technique: Spline WebGL (or static WebP fallback), RAIS Racing Green / Sage glass, orange only as accent.

### B. Glowing chart graphics

Tubular gradient strokes and soft glow inside a product-UI theater. Technique: SVG + CSS, used in the AMS pipeline demo.

### Structure patterns

- Tech marquee
- Pinned product theater (steps + swapping mock)
- Scroll reveals
- Dual-path cards (Audit vs Roadmap)
- Comparison column (Tool-first vs Prozess-first)
- FAQ accordion and sticky primary CTA

### Explicitly not copied

- Fake or unearned proof / inventing numbers
- Lenis smooth-scroll / scroll-jacking
- Teal palette or glassmorphism as whole-page look
- Next.js / Framer rebuild (stay vanilla HTML, Vite, Tailwind)

## `/ai-roadmap` on the main page

Keep as a separate landing. Homepage entry points:

1. Nav item `KI-Roadmap` → `/ai-roadmap`
2. Hero secondary CTA “KI-Roadmap ansehen”
3. Mid-page dual-path: Audit buchen | Schriftliche KI-Roadmap ansehen

Routing: Vite input `ai-roadmap.html`, Vercel rewrite `/ai-roadmap` → `/ai-roadmap.html`, sitemap entry.

## Spline glass shipping rules

- Export `.splinecode` + `@splinetool/runtime`, self-host on same origin (no Spline iframe CDN).
- Lazy-load on IntersectionObserver; pause off-screen.
- Static WebP/PNG fallback for reduced motion, no WebGL, and small phones.
- Cap: three scenes on Home + reuse on `/ai-roadmap`.
- If runtime phones home to `spline.design`, stop and choose Klaro service or static-only before shipping.
- Confirm Spline plan allows commercial use before production WebGL.

## Motion stack

- `scripts/motion.js` on top of existing `.reveal` / IntersectionObserver
- CSS marquees with pause on hover and `prefers-reduced-motion`
- Sticky AMS theater without GSAP unless IntersectionObserver + CSS is insufficient
- No count-ups unless the number is already brand-approved

## Implementation phases

0. This brief in git  
1. Import live HTML/CSS/JS into maintainable source  
2. First-class `/ai-roadmap`  
3. Restyle with foerderung.de structure (glass band, dual-path, theater)  
4. Spline glass + SVG charts  
5. Browser verify Home and Roadmap (desktop + mobile)

## Implementation status (03.09.2026)

- Live HTML imported into this repo (Home, AMS/`ams.html`, Systemkatalog, Über uns, Persönlichkeit, Zusammenarbeit, `/ai-roadmap`).
- `/ai-roadmap` is a Vite input with Vercel rewrite; homepage nav, hero secondary CTA, and `#zwei-wege` dual-path link to it.
- Glass band `#glass-claims` ships with **SVG glass fallbacks** in `images/glass/`. Drop `.splinecode` + `vendor/spline/runtime.js` to upgrade to WebGL without changing markup.
- AMS pipeline has SVG glow charts synced to `data-step` via `scripts/motion.js`.
- `scripts/build-pages.mjs` no longer overwrites live-managed HTML; Home shell sync remains via `sync-index-shell.mjs`.
- Smoke: `node scripts/_smoke-foerderung.mjs` against local Vite.

