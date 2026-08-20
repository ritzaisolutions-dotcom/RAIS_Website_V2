# RAIS Website — Design- und Struktur-Report

Stand: 17.08.2026. Quelle: Code in `RAIS_Website_V2/` (nicht Brand-Docs).  
Zweck: Eine externe Person kann allein aus diesem Dokument eine Unterseite bauen, die visuell nicht von den bestehenden Multipage-Seiten zu unterscheiden ist.

Zählungen schließen `node_modules/`, `dist/`, `vendor/` (Minified), `styles/tailwind.generated.css` und `scripts/_stitch-out/` aus, sofern nicht anders vermerkt.

---

## 1. TECH STACK

| Rolle | Wert |
|---|---|
| Projektname / Version | `rais-website` `1.1.0` (`package.json`) |
| Build-Tool | Vite `^5.0.0` |
| Framework | keines (statisches Multi-HTML, Vanilla JS) |
| Styling | Vanilla CSS + CSS Custom Properties (primär). Tailwind `^3.4.17` als generiertes Artefakt |
| Routing | Datei = URL. Kein Client-Router. Registrierung in `vite.config.js` `rollupOptions.input` |
| Deployment | Vercel, `outputDirectory: dist`, `buildCommand: npm run build` |

Abhängigkeiten aus `package.json`:

```json
{
  "devDependencies": {
    "klaro": "^0.7.21",
    "tailwindcss": "^3.4.17",
    "vite": "^5.0.0"
  },
  "dependencies": {
    "@sentry/browser": "^10.51.0",
    "@supabase/supabase-js": "^2.100.1"
  }
}
```

Relevante npm-Skripte:

```json
{
  "config": "node scripts/generate-public-config.mjs",
  "pages": "node scripts/build-pages.mjs && node scripts/sync-index-shell.mjs && node scripts/build-sitemap.mjs",
  "predev": "npm run config && npm run pages",
  "prebuild": "npm run config && npm run pages",
  "dev": "vite",
  "build": "vite build && node scripts/postbuild-copy.mjs",
  "build:tailwind": "tailwindcss -i ./styles/tailwind.input.css -o ./styles/tailwind.generated.css --config ./tailwind.config.js --minify"
}
```

Pipeline: `prebuild` schreibt HTML und Sitemap → Vite bundelt nur Einträge aus `vite.config.js` → `postbuild-copy.mjs` kopiert Styles, Fonts, Vendor, Scripts nach `dist/`.

Tailwind in Produktion: `class="scroll-smooth"` auf `<html>` (12 Marketing-/Legal-Seiten). `makler.html` hat diese Klasse nicht. Utility-Klassen wie `bg-cloud` und `flex` stehen in `scripts/_stitch-out/home.html` und sind nicht an Produktionsseiten angebunden.

---

## 2. DATEISTRUKTUR

Projektwurzel: `RAIS_Website_V2/`. Git-Repo liegt dort, nicht im Workspace-Root.

```
RAIS_Website_V2/
├── index.html                    # SEITE Startseite (handgepflegt + sync-index-shell)
├── ams.html                      # SEITE generiert
├── referenzen.html               # SEITE generiert
├── zusammenarbeit.html           # SEITE generiert
├── ueber-uns.html                # SEITE generiert
├── persoenlichkeit.html          # SEITE generiert
├── system-anfragen-qualifizieren.html
├── system-support-agent.html
├── system-onboarding.html
├── system-dokumente-auslesen.html
├── system-reporting.html
├── impressum.html                # SEITE handgepflegt, noindex
├── datenschutz.html              # SEITE handgepflegt, noindex
├── makler.html                   # SEITE handgepflegt, noindex, NICHT in Vite
├── demo.html                     # Meta-Refresh → index.html, NICHT in Vite
├── favicon.svg
├── favicon.png
├── fonts.css                     # Inter + JetBrains Mono
├── klaro-config.js
├── package.json
├── vite.config.js                # Route-Registrierung
├── vercel.json
├── tailwind.config.js
├── robots.txt
├── sitemap.xml
├── fonts/                        # ASSETS woff2 + editorial-faces.css
├── images/                       # ASSETS (Vite bundled, postbuild kopiert sie nicht)
├── downloads/                    # PDF Prozesshandbuch
├── videos/
├── vendor/                       # klaro/, lucide.min.js, jspdf.umd.min.js
├── styles/                       # KOMPONENTEN-CSS
│   ├── site-multipage.css        # Tokens, Nav, Footer, Page-Hero, Pattern
│   ├── home.css                  # Home-Sektionen, Lead-Magnet, Rechner
│   ├── antigravity-polish.css    # Hover/Focus/Grain, überschreibt Nav auf Home
│   ├── booking-modal.css
│   ├── makler.css
│   ├── klaro-overrides.css
│   ├── tailwind.input.css
│   └── tailwind.generated.css
├── scripts/                      # KOMPONENTEN-FRAGMENTE + Verhalten
│   ├── page-shell.mjs            # nav/footer/head/modal (Quelle der Wahrheit)
│   ├── build-pages.mjs           # generiert Unterseiten
│   ├── sync-index-shell.mjs
│   ├── build-sitemap.mjs
│   ├── postbuild-copy.mjs
│   ├── site-nav.js
│   ├── booking-modal.js
│   ├── cal-embed.js
│   ├── lead-magnet.js
│   ├── sentry-klaro-bootstrap.js
│   ├── aqut-rechner.js
│   ├── aqut-sim.js
│   ├── makler-page.js
│   ├── makler-rechner.js
│   ├── branchen-tabs.js
│   ├── katalog-filter.js
│   ├── collab-path.js
│   ├── scroll-motion.js
│   ├── systemakte-data.mjs
│   ├── faq-data.mjs
│   ├── techstack-data.mjs
│   └── changelog-data.mjs
├── supabase/functions/submit-audit-lead/
└── docs/
```

Keine `components/`-Verzeichnisse, kein React/Vue.

### Wo eine neue Route registriert werden muss

Exakte Stelle: [`vite.config.js`](../vite.config.js) Zeilen 13–31, Objekt `build.rollupOptions.input`:

```javascript
      input: {
        main: resolve(__dirname, 'index.html'),
        impressum: resolve(__dirname, 'impressum.html'),
        datenschutz: resolve(__dirname, 'datenschutz.html'),
        aqut: resolve(__dirname, 'ams.html'),
        referenzen: resolve(__dirname, 'referenzen.html'),
        zusammenarbeit: resolve(__dirname, 'zusammenarbeit.html'),
        ueberUns: resolve(__dirname, 'ueber-uns.html'),
        persoenlichkeit: resolve(__dirname, 'persoenlichkeit.html'),
        sysAnfragen: resolve(__dirname, 'system-anfragen-qualifizieren.html'),
        sysSupport: resolve(__dirname, 'system-support-agent.html'),
        sysOnboarding: resolve(__dirname, 'system-onboarding.html'),
        sysDokumente: resolve(__dirname, 'system-dokumente-auslesen.html'),
        sysReporting: resolve(__dirname, 'system-reporting.html')
      }
```

Ohne Eintrag hier erzeugt Vite die HTML-Datei nicht in `dist/`. Das ist der aktuelle Zustand von `makler.html`.

Zusätzlich je nach Seitentyp:

- Generierte Multipage: `page({ file, active, title, description, path, main })` in `scripts/build-pages.mjs` (Helper Zeile 25–37).
- Sitemap (nur indexierbar): Array `PAGES` in `scripts/build-sitemap.mjs` Zeile 44–53.
- Extra-CSS, das Vite nicht bündelt: `copyTargets` in `scripts/postbuild-copy.mjs` Zeile 8–37. `styles/makler.css` steht dort nicht.

```javascript
function page({ file, active, title, description, path, main, extraScripts = '' }) {
  const html =
    headHtml({ title, description, path }) +
    navHtml(active) +
    `<main id="main">${main}</main>` +
    contactHtml +
    footerHtml +
    bookingModalHtml +
    extraScripts +
    scriptsHtml;
  writeFileSync(resolve(root, file), html, 'utf8');
  console.log('wrote', file);
}
```

---

## 3. DESIGN TOKENS

### 3.1 Canonical `:root` (Unterseiten)

Quelle: `styles/site-multipage.css` Zeile 3–68. Identischer Block liegt inline in `index.html` Zeile 67–133 und muss manuell synchron bleiben.

```css
:root {
  /* Editorial Text-Serif fuer Headings (brand_steer): bewusst KEINE Display-Serif */
  --serif: 'Source Serif 4', 'Iowan Old Style', Georgia, serif;
  /* Fliesstext: neutrale Grotesk, ausdruecklich nicht geometrisch (brand_steer) */
  --sans: 'Instrument Sans', 'Inter', system-ui, -apple-system, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;

  --orange: #EC6A37;
  --orange-hover: #F37A48;
  /* Schrift auf Mandarin. Weiss ergab nur 3.14:1 und riss die
     4.5:1 auf jedem primaeren CTA. Charcoal kommt auf 4.52:1,
     im Hover auf --orange-hover sogar auf 5.20:1.
     Achtung: 4.52 ist knapp. Wird --orange je aufgehellt, muss
     dieser Wert neu gerechnet werden. */
  --on-orange: #2F2A24;
  --background: #F5F2EC;
  --surface: #FBF8F3;
  --sage: #789464;
  --racing-green: #004225;
  --pistachio: var(--racing-green); /* Alt-Alias, Dark Pistachio ersetzt */
  --charcoal: #2F2A24;
  --stone: #7B746B;
  --border: #D9D1C7;
  --nav-h: 72px;

  /* Racing Green als zweite Tinte: Linien-, Label- und Markenrollen */
  --green-ink: #004225;
  --green-rule: rgba(0, 66, 37, 0.22);
  --green-rule-soft: rgba(0, 66, 37, 0.10);
  --green-wash: rgba(0, 66, 37, 0.04);

  /* Racing Green als LEITFLAECHE (Amendment brand_steer, 05.08.2026).
     Muss mit dem :root-Block in index.html synchron bleiben, die Tokens
     liegen dupliziert. Auf den Unterseiten bisher ungenutzt, hier nur
     definiert damit index und Unterseiten nicht divergieren. */
  --green-900: #002A18;
  --green-800: #004225;
  --green-700: #0A5231;
  --linen-on-green: #FBF8F3;
  --sage-light: #9FB88C;   /* --sage haette auf Gruen nur 2.8:1 */
  --rule-on-green: rgba(251, 248, 243, 0.14);
  --fill-on-green: rgba(251, 248, 243, 0.06);
  --focus-on-green: rgba(159, 184, 140, 0.55);

  /* Skalen */
  --radius-sm: 0.7rem;
  --radius-md: 1.1rem;
  --radius-lg: 1.5rem;
  --radius-pill: 999px;

  --shadow-sm: 0 1px 2px rgba(47, 42, 36, 0.05);
  --shadow-md: 0 6px 20px rgba(47, 42, 36, 0.08);
  --shadow-lg: 0 14px 34px rgba(47, 42, 36, 0.14);

  --space-2xs: 0.35rem;
  --space-xs: 0.6rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: clamp(3rem, 6vw, 4.5rem);
  --space-band: clamp(4.5rem, 8vw, 7.5rem);

  --dur-fast: 0.2s;
  --dur-mid: 0.32s;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 3.2 `tailwind.config.js` vollständig

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      /* Die Tokens sind Hex, nicht HSL-Tripel. hsl(var(--x)) hat hier nie aufgeloest. */
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        charcoal: 'var(--charcoal)',
        stone: 'var(--stone)',
        orange: 'var(--orange)',
        'orange-hover': 'var(--orange-hover)',
        sage: 'var(--sage)',
        'sage-light': 'var(--sage-light)',
        'racing-green': 'var(--racing-green)',
        'green-900': 'var(--green-900)',
        'green-800': 'var(--green-800)',
        'green-700': 'var(--green-700)',
        'linen-on-green': 'var(--linen-on-green)',
      },
      fontFamily: {
        display: ['Source Serif 4', 'Iowan Old Style', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        sans: ['Instrument Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### 3.3 Farben (Hex) mit Zweck und Literal-Häufigkeit

Häufigkeit = Vorkommen des Hex-Literals in `styles/*.css` (ohne generated) + `index.html` + `zusammenarbeit.html` + `scripts/cal-embed.js`. Token-Nutzung über `var(--orange)` und Geschwister ist deutlich häufiger als Literale.

| Hex | Token | Zweck | Literale |
|---|---|---|---:|
| `#2F2A24` | `--charcoal`, `--on-orange` | Fließtext, CTA-Text auf Orange | 57 |
| `#004225` | `--racing-green`, `--green-ink`, `--green-800` | Grüne Tinte, Leitfläche | 57 |
| `#7B746B` | `--stone` | Sekundärtext | häufig via `var(--stone)` |
| `#D9D1C7` | `--border` | Haarlinien | häufig via `var(--border)` |
| `#FBF8F3` | `--surface`, `--linen-on-green` | Karten, Text auf Grün | häufig via Token |
| `#EC6A37` | `--orange` | Primär-CTA | 22 |
| `#9FB88C` | `--sage-light` | Labels/Links auf Grün | häufig via Token |
| `#F37A48` | `--orange-hover` | CTA Hover | 7-Bereich |
| `#002A18` | `--green-900` | Verlaufsränder grüner Bänder | 7-Bereich |
| `#F5F2EC` | `--background` | Seitenhintergrund Cloud | :root + Klaro |
| `#789464` | `--sage` | Sage-Vollfläche, SVG-Verläufe | selten als Literal |
| `#0A5231` | `--green-700` | definiert, praktisch ungenutzt | :root |
| `#EBE1D7` | Fallback `--surface-variant` | `home.css` Zeile 137; Token in `:root` **nicht** definiert | 1 |
| `#FFFFFF` / `#fff` | — | Outline-Buttons auf Grün, Hero-Text | Hero/Outline |

Cal.com-Brandfarbe in `scripts/cal-embed.js`: `'cal-brand': '#EC6A37'`.

### 3.4 Zweites Farbsystem: Legal-Seiten

`datenschutz.html` und `impressum.html` nutzen **nicht** die Hex-Tokens, sondern HSL-Tripel + Baskerville:

```css
        :root {
            --background: 40 29% 94%;
            --foreground: 24 13% 16%;
            --border: 36 21% 83%;
            --industrial-orange: 18 83% 57%;
            --dark-pistachio: 95 28% 26%;
            --muted-stone: 31 8% 42%;
        }
```

Body: `font-family: 'Inter', sans-serif;` und `background: hsl(var(--background));`. Für Marketing-Unterseiten **nicht** kopieren.

### 3.5 Makler-Tokens

`styles/makler.css`, gültig unter `.page-makler`:

```css
.page-makler {
  --mandarin: var(--orange, #EC6A37);
  --mandarin-hover: var(--orange-hover, #F37A48);
  --cloud: var(--background, #F5F2EC);
  --linen: var(--surface, #FBF8F3);
  --step--1: clamp(0.83rem, 0.8rem + 0.15vw, 0.9rem);
  --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.13rem);
  --step-1: clamp(1.33rem, 1.2rem + 0.6vw, 1.6rem);
  --step-2: clamp(1.78rem, 1.5rem + 1.4vw, 2.4rem);
  --step-3: clamp(2.37rem, 1.9rem + 2.4vw, 3.6rem);
  --step-4: clamp(3.16rem, 2.2rem + 4.8vw, 5.6rem);
```

### 3.6 Polish-Tokens

`styles/antigravity-polish.css`:

```css
:root {
    --ag-ease: cubic-bezier(0.16, 1, 0.3, 1);
    --ag-fast: 0.26s;
    --ag-medium: 0.45s;
    --ag-reveal-distance: 24px;
    --ag-grain-opacity: 0.06;
    --ag-focus-ring: rgba(236, 106, 55, 0.38);
}
```

### 3.7 Schriften und Ladeweg

| Familie | Rolle | Datei | Format |
|---|---|---|---|
| Instrument Sans | `--sans` Fließtext, Variable 400–700 | `fonts/editorial-faces.css` | woff2 self-hosted |
| Source Serif 4 | `--serif` Überschriften, 400/500/600/700 | `fonts/editorial-faces.css` | woff2 self-hosted |
| JetBrains Mono | `--mono` Labels | `fonts.css` | woff2, Gewicht 400–700 |
| Inter | Fallback in `--sans` | `fonts.css` | woff2, Gewicht 300–700 |

Import in `site-multipage.css` Zeile 2:

```css
@import url('../fonts/editorial-faces.css'); /* Source Serif 4 (Headings) + Instrument Sans, self-hosted */
```

Jede Produktionsseite lädt zusätzlich `<link rel="stylesheet" href="fonts.css">`. Kein Google-Fonts-`<link>` in Produktions-HTML. CSP in `vercel.json` erlaubt `fonts.googleapis.com` / `fonts.gstatic.com`, wird aber von den Seiten nicht genutzt.

Klaro überschreibt `font-family: Inter, system-ui, sans-serif !important` statt `var(--sans)`.

### 3.8 Spacing, Radius, Schatten

Spacing-Tokens: `--space-sm` bis `--space-band` werden in CSS referenziert. **`--space-2xs` und `--space-xs`: 0 Treffer** auf `var(--space-2xs)` / `var(--space-xs)`.

**`--shadow-sm`, `--shadow-md`, `--shadow-lg`: 0 Treffer** auf die jeweiligen `var()`-Referenzen. Schatten sind hardcodiert, wiederkehrend:

- `0 8px 28px rgba(47, 42, 36, 0.1)` Navbar Home
- `0 14px 34px rgba(47, 42, 36, 0.14)` Navbar scrolled / `--shadow-lg`-Wert
- `0 8px 24px rgba(47,42,36,0.08)` Navbar Unterseiten (`.scrolled`)
- `0 6px 20px rgba(47, 42, 36, 0.08)` Karten

Radius: Tokens existieren, Buttons nutzen hart `0.55rem` (`.btn-primary`) bzw. `10px` (`.hero-btn-primary` in `index.html`). `home.css` Fallbacks weichen ab: `var(--radius-sm, 0.55rem)` statt Token `0.7rem`; `var(--radius-lg, 1rem)` statt `1.5rem`.

### 3.9 Breakpoints

Keine zentrale Breakpoint-Map. Ad-hoc `@media`. Häufigste `max-width`-Werte in `styles/`:

| Wert | Vorkommen (Auswahl) |
|---|---|
| 900px | Nav-Hamburger, mehrere Home-Grids |
| 860px | Home-Navbar inline, `.principle-grid` |
| 720px | Home, Multipage, Legal |
| 560px | Home-Grids einspaltig |
| 800px | `.contact-grid` → 1 Spalte |
| 901px | Sticky-CTA ausblenden (`min-width`) |

Weitere Einzelfälle: 430, 480, 500, 520, 600, 620, 640, 700, 760, 767, 768, 820, 840, 980, 1000. Tailwind-`sm/md/lg` werden in Produktions-HTML nicht verwendet.

Zusätzlich: `@media (prefers-reduced-motion: reduce)`, `@media (hover: none), (pointer: coarse)`.

---

## 4. TYPOGRAFIE-HIERARCHIE

Body-Default (`site-multipage.css`):

```css
body {
  margin: 0;
  font-family: var(--sans);
  background: var(--background);
  color: var(--charcoal);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
```

Gewichte auf Marketing-Seiten: 400, 500, 600, 700. Makler zusätzlich 450, 550, 650 (Variable Font Instrument Sans).

### h1 — drei Varianten (nicht mischen)

**A. Unterseiten (häufiger, 11 generierte HTML-Dateien).** Klasse am Wrapper, `h1` unklassiert.

```css
.page-hero h1 {
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(2.1rem, 4.2vw, 3.2rem);
  line-height: 1.14;
  letter-spacing: -0.018em;
  margin: 0.5rem 0 0.85rem;
  max-width: 18ch;
  color: var(--linen-on-green, #FBF8F3);
}
```

Markup aus `zusammenarbeit.html`:

```html
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Zusammenarbeit</span>
    <h1>Fünf Schritte. Kein Projektchaos.</h1>
    <p>Vom ersten Termin bis zum laufenden System. Jeder Schritt hat ein klares Ergebnis.</p>
  </div>
</section>
```

**B. Startseite (eine Datei).** Inline in `index.html`:

```css
        .hero-h1 {
            font-family: var(--serif);
            font-size: clamp(2.2rem, 5.8vw, 4.55rem);
            font-weight: 700;
            line-height: 1.08;
            letter-spacing: -0.025em;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.05em;
            text-shadow: 0 2px 14px rgba(0, 0, 0, 0.25);
        }
```

**C. Makler-LP.** `.makler-hero__h1`: Serif, `font-weight: 600`, `font-size: var(--step-3)`, Charcoal auf hellem Grund (kein grüner Hero).

Für eine neue **kanonische Unterseite** Variante A verwenden.

### h2

Kanonisch `.section-h2` — 67 Treffer in HTML (häufigste Überschriftenklasse):

```css
.section-h2 {
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(1.75rem, 3vw, 2.4rem);
  line-height: 1.2;
  color: var(--charcoal);
  margin: 0.5rem 0 0.75rem;
}
```

Auf `.surface-green` / `.home-band--green` / `#contact` wird die Farbe auf `--linen-on-green` überschrieben.

### h3

Kein globales `h3`. Häufigste Marketing-Variante: Karten-Titel in Sans 600 ~1rem.

`home.css` Diagnose-Karten (Startseite):

```css
.diagnose__card h3 {
  margin: 0 0 0.5rem;
  font-family: var(--sans);
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--charcoal, #2F2A24);
}
```

`site-multipage.css` Prinzip-Karten (Unterseite Über uns / Zusammenarbeit):

```css
.principle-card h3 {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  font-family: var(--serif, 'Source Serif 4', Georgia, serif);
}
```

Sans-600 ist auf der Startseite häufiger; Serif-h3 ist das Unterseiten-Kartenmuster.

### h4

Kein gemeinsames Pattern auf Marketing-Seiten. `<h4>` kommt nur in `datenschutz.html` (2×, importiertes Legal-HTML) vor.

### Fließtext

```css
.section-sub {
  color: var(--stone);
  max-width: 36rem;
  margin: 0;
  font-size: 1.05rem;
}
```

(Zweite Regel setzt `max-width: 40rem` und wird von `36rem` überschrieben.)

`.page-hero p`: `color: rgba(251, 248, 243, 0.78); max-width: 38rem; font-size: 1.08rem;`

### Kleintext / Eyebrow

```css
.mono-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: none;
  color: var(--green-ink);
  font-weight: 500;
}
.mono-label::before {
  content: "";
  width: 1.35rem;
  height: 1px;
  background: var(--green-rule);
}
```

Auf Grün: Farbe und Strich `--sage-light`.

### Buttons (Typo)

| Klasse | Size | Weight | Familie |
|---|---|---|---|
| `.btn-primary` | `0.95rem` | 700 | inherit (`--sans`) |
| `.hero-btn-primary` (index) | `1rem` | 500 | `--sans` |
| `.hero-btn-secondary` | `0.95rem` | 500 | inherit |
| `.akte__cta-btn` | `0.76rem` | inherit | `--mono` |
| `.makler-cta__label` | `1rem` | 650 | `--sans` |

Beispiel Unterseiten-CTA:

```html
<button type="button" class="btn-primary js-open-booking" data-source="aqut-hero">Kostenlosen KI-Audit buchen</button>
```

Beispiel Home-Hero:

```html
                <div class="hero-ctas">
                    <button type="button" class="hero-btn-primary js-open-booking" id="hero-work-btn" data-source="hero">Kostenlosen KI-Audit buchen</button>
                    <a class="hero-btn-secondary" href="#handbuch">Erst das Prozesshandbuch lesen</a>
                </div>
```

---

## 5. LAYOUT-PATTERNS

### Container

Kanonisch für Inhalt:

```css
.section-wrap {
  width: min(1100px, calc(100% - 2.5rem));
  margin: 0 auto;
  padding: clamp(4rem, 9vw, 7.5rem) 0; /* >=120px Desktop-Rhythmus (brand_steer) */
}
```

`.page-hero__inner` und `.footer-inner` dieselbe Breite `min(1100px, calc(100% - 2.5rem))` ohne das große Vertikal-Padding.

Nav: `site-multipage.css` `.nav-inner` = `min(1100px, calc(100% - 2rem))`. `antigravity-polish.css` überschreibt auf `max-width: 1200px; padding: 0 2rem`. Home gewinnt durch Ladereihenfolge (polish vor site-multipage, aber Home-Inline-CSS im `<style>` von `index.html` setzt die schwebende Leiste).

Makler: `.makler-wrap` / `.makler-header__inner` `max-width: 72rem`, Padding `0 1.25rem`.

Horizontales Padding Mobile/Desktop: aus der Formel `calc(100% - 2.5rem)` → **1.25rem je Seite** bei `.section-wrap`. Nav-Multipage: **1rem je Seite**.

### Vertikal

| Klasse | Padding |
|---|---|
| `.section-wrap` | `clamp(4rem, 9vw, 7.5rem) 0` |
| `.home-band` | `clamp(4.5rem, 8vw, 7rem) 0` |
| `.page-hero` | `calc(var(--nav-h) + 4rem) 0 clamp(3rem, 6vw, 4.5rem)` |
| `--space-band` | `clamp(4.5rem, 8vw, 7.5rem)` |

### Grids

```css
.contact-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
  align-items: start;
}
@media (max-width: 800px) {
  .contact-grid { grid-template-columns: 1fr; }
}
```

```css
.systeme-bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
  margin-top: 2rem;
}
```

```css
.team-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.75rem;
}
```

```css
.diagnose__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}
```

### Vollständiger Section-Wrapper (typische helle Sektion)

Wrapper aus `index.html` `#zielgruppe`. Der Block darunter (Diagnose-Karten, ICP-Raster) ist seiten-spezifisch; der Rahmen ist das wiederkehrende Muster:

```html
        <section id="zielgruppe" class="home-band home-band--cloud" aria-labelledby="zielgruppe-title">
            <div class="section-wrap">
                <span class="mono-label">Mit wem wir arbeiten</span>
                <h2 class="section-h2" id="zielgruppe-title">Fokussiert auf Maklerbüros mit Anfragevolumen</h2>
                <p class="section-sub">Wiederkehrende Anfragen, spürbares Volumen, kein internes KI-Team.</p>
            </div>
        </section>
```

Band-Hintergründe:

```css
.home-band--cloud {
  background: var(--background, #F5F2EC);
}

.home-band--linen {
  background: var(--surface, #FBF8F3);
}
```

### Vollständiger Wrapper grüne Leitfläche

Aus `system-anfragen-qualifizieren.html` (gleiche Klasse `.surface-green` auf den fünf Systemseiten und `referenzen.html`):

```html
<section class="surface-green" aria-labelledby="sys-grenze-title">
  <div class="section-wrap">
    <span class="mono-label">Nicht im Zug</span>
    <h2 class="section-h2" id="sys-grenze-title">Was dieses System ausdrücklich nicht tut</h2>
    <p class="section-sub">Keine Preiszusagen, keine Vertragsauskünfte, keine Absage an Interessenten ohne menschliche Freigabe.</p>
    <p class="sys-grenze-note">Ein System, das seine Grenze nicht kennt, gehört nicht in Ihren Betrieb. Deshalb steht sie hier und nicht im Kleingedruckten.</p>
    <p style="margin-top:2rem;"><a class="home-cta-link" href="referenzen.html">Alle 12 Systeme im Katalog</a></p>
  </div>
</section>
```

Home nutzt denselben Look als `.home-band.home-band--green` (`#sicherheit` in `index.html`). `.surface-green` und `.home-band--green` teilen die CSS-Regeln (Racing-Green-Verlauf plus Isolation für Höhenlinien).

### Page-Hero (Unterseiten-Öffnung)

```css
.page-hero {
  padding: calc(var(--nav-h) + 4rem) 0 clamp(3rem, 6vw, 4.5rem);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  color: var(--linen-on-green, #FBF8F3);
  background:
    linear-gradient(180deg, var(--green-900, #002A18) 0%, transparent 22%),
    linear-gradient(0deg, var(--green-900, #002A18) 0%, transparent 18%),
    var(--green-800, #004225);
}
.page-hero__inner { width: min(1100px, calc(100% - 2.5rem)); margin: 0 auto; }
```

Neue Unterseiten öffnen und schließen auf Grün (`#contact` ist ebenfalls grün). Dazwischen helle Bänder.

---

## 6. KOMPONENTEN-INVENTAR

Kein Framework. „Props“ = HTML-Attribute / `data-*`. Canonical-Quelle für Shell: `scripts/page-shell.mjs`. Nach Änderung: `npm run pages`.

### 6.1 Navigation

Funktion `navHtml(active)` in `page-shell.mjs`. `active` ist einer der Keys `systeme`, `methodik`, `referenzen`, `ueber-uns` oder weggelassen. Setzt `aria-current="page"`. Gerendertes Markup (Unterseite ohne aktiven Key):

```html
<a class="skip-link" href="#main">Zum Inhalt springen</a>
<nav id="navbar" aria-label="Hauptnavigation">
  <div class="nav-inner">
    <a href="/" class="nav-brand" aria-label="RAIS zur Startseite">
      <img src="favicon.svg" alt="" width="44" height="44" aria-hidden="true">
      <div class="nav-brand-words">
        <span class="nav-wordmark">RAIS</span>
        <span class="nav-submark">Ritz AI Solutions</span>
      </div>
    </a>
    <div class="nav-center" role="none">
      <ul class="nav-list" role="list">
        <li><a href="/#systeme">Systeme</a></li>
        <li><a href="/#methodik">Methode</a></li>
        <li><a href="referenzen.html">Systemkatalog</a></li>
        <li><a href="ueber-uns.html">Über uns</a></li>
      </ul>
    </div>
    <div class="nav-right">
      <button type="button" class="btn-primary js-open-booking" id="nav-demo-btn" data-source="nav">Kostenlosen KI-Audit buchen</button>
      <button class="nav-hamburger" id="hamburger-btn" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="mobile-overlay">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  </div>
</nav>
<div id="mobile-overlay" role="dialog" aria-label="Navigation" aria-modal="true">
  <div class="mobile-nav-inner">
    <a href="/#systeme" class="mobile-link" data-close-menu>Systeme</a>
    <a href="/#methodik" class="mobile-link" data-close-menu>Methode</a>
    <a href="referenzen.html" class="mobile-link" data-close-menu>Systemkatalog</a>
    <a href="ueber-uns.html" class="mobile-link" data-close-menu>Über uns</a>
    <a href="zusammenarbeit.html" class="mobile-link" data-close-menu>So arbeiten wir</a>
    <a href="persoenlichkeit.html" class="mobile-link" data-close-menu>Persönlichkeit</a>
    <hr class="mobile-hr">
    <button type="button" class="mobile-cta js-open-booking" id="mobile-demo-btn" data-source="mobile-nav">Kostenlosen KI-Audit buchen</button>
  </div>
</div>
```

**Zwei visuelle Navbar-Systeme:**

| | Home `index.html` inline | Unterseiten `site-multipage.css` |
|---|---|---|
| Position | `inset: 12px 20px auto 20px` (schwebend) | `inset: 0 0 auto 0` (volle Breite) |
| Höhe | `64px` | `--nav-h: 72px` |
| Radius | `16px` | keiner |
| Häufigkeit | 1 Datei | alle generierten Unterseiten + Legal nicht |

JS: `scripts/site-nav.js` (Scroll-Schatten, Hamburger, Sticky-CTA). Home behält zusätzlich Inline-Hamburger-JS.

`makler.html` blendet `#navbar` und `#mobile-overlay` mit `display: none !important` aus und nutzt `.makler-header`.

### 6.2 Footer + Sticky-CTA

`footerHtml` in `page-shell.mjs`:

```html
<div id="sticky-cta" aria-hidden="true">
  <button type="button" class="sticky-cta-btn js-open-booking" id="sticky-demo-btn" data-source="sticky">KI-Audit buchen</button>
</div>
<footer id="footer">
  <div class="footer-inner">
    <a href="/" class="footer-brand" aria-label="RAIS Startseite">
      <img src="favicon.svg" alt="" width="40" height="40" aria-hidden="true">
      <span>RAIS</span>
    </a>
    <nav class="footer-legal" aria-label="Seitenlinks">
      <a href="/#systeme">Systeme</a>
      <a href="/#methodik">Methode</a>
      <a href="zusammenarbeit.html">So arbeiten wir</a>
      <a href="referenzen.html">Systemkatalog</a>
      <a href="ams.html">AMS Beispielsystem</a>
      <a href="persoenlichkeit.html">Persönlichkeit</a>
      <a href="#contact">Kontakt</a>
      <a href="impressum.html">Impressum</a>
      <a href="datenschutz.html">Datenschutz</a>
      <a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </nav>
    <span class="footer-copy">© 2026 Ritz AI Solutions · RAIS · Koblenz</span>
  </div>
</footer>
```

Sticky-CTA nur `< 901px` (`.is-visible` per `site-nav.js`).

### 6.3 Buttons

`.btn-primary` — 37 HTML-Treffer, häufigste CTA-Klasse:

```css
.btn-primary,
.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.7rem 1.35rem;
  background: var(--orange);
  color: var(--on-orange);
  border: none;
  border-radius: 0.55rem;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
}
.btn-primary:hover,
.hero-btn-primary:hover { background: var(--orange-hover); }
```

Attribute:

- `class="js-open-booking"` öffnet das Buchungsmodal (`booking-modal.js`)
- `data-source` Werte im Code u. a. `nav`, `hero`, `sticky`, `mobile-nav`, `aqut-hero`, `systemakte`, `home-aqut`, `home-rechner`
- optional `data-icp`

Outline:

```css
.btn-outline,
.hero-btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.7rem 1.25rem;
  border: 1.5px solid rgba(255,255,255,0.55);
  border-radius: 0.55rem;
  color: inherit;
  text-decoration: none;
  font-weight: 600;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
}
.page-btn-outline {
  border-color: var(--border);
  color: var(--charcoal);
}
```

Katalog-Pille `.akte__cta-btn`: Mono, `--radius-pill`, Hover füllt `--green-ink`.

Makler: `.makler-cta.makler-cta--primary` und `.makler-cta--ghost` (nicht mit `.btn-primary` mischen).

### 6.4 Cards

**Grün (auf Leitfläche, kein Schatten):**

```css
.card-green {
  background: var(--fill-on-green, rgba(251, 248, 243, 0.06));
  border: 1px solid var(--rule-on-green, rgba(251, 248, 243, 0.14));
  border-radius: var(--radius-md, 1.1rem);
  padding: 1.1rem 1.15rem;
  box-shadow: none;
  color: rgba(251, 248, 243, 0.84);
}
```

`--lead` genau einmal pro Gruppe: `.card-green.card-green--lead`.

**Hell:** `.principle-card` (weiß, `border-radius: 0.85rem`), `.ref-card` (`1rem`, Hover `translateY(-3px)`), `.diagnose__card` (`border-radius: 4px` — härter als Tokens), `.sys-cell` (`0.75rem`).

### 6.5 Formularfelder

Nur Lead-Magnet (siehe Abschnitt 8). Styles `home.css`:

```css
.lm-field input[type="text"],
.lm-field input[type="email"] {
  width: 100%;
  min-height: 46px;
  padding: 0.65rem 0.85rem;
  font-family: inherit;
  font-size: 1rem;
  color: var(--charcoal, #2F2A24);
  background: var(--surface, #FBF8F3);
  border: 1px solid var(--border, #D9D1C7);
  border-radius: var(--radius-sm, 0.55rem);
}

.lm-field input:focus-visible {
  outline: 2px solid var(--green-ink, #004225);
  outline-offset: 1px;
  border-color: var(--green-ink, #004225);
}
```

Label: Mono `0.7rem`, `--green-ink`.

### 6.6 Booking-Modal

```javascript
export const bookingModalHtml = `
<div id="booking-modal" role="dialog" aria-modal="true" aria-label="Kostenlosen KI-Audit buchen">
  <div class="bm-backdrop" id="bm-backdrop"></div>
  <div class="bm-box">
    <button class="bm-close" id="bm-close" type="button" aria-label="Schließen">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="bm-step is-active" id="bm-step-0">
      <h2 class="bm-title">Wählen Sie Ihren Termin</h2>
      <p class="bm-sub">20 Minuten, kostenlos. Sie geben Ihre Angaben direkt im Kalender ein, ein zweites Formular gibt es nicht.</p>
      <div class="bm-cal-wrap" id="bm-cal-wrap"></div>
    </div>
  </div>
</div>
`;
```

### 6.7 Contact-Band

`contactHtml` in `page-shell.mjs`: Sektion `#contact` mit `.section-wrap` > `.contact-grid` (Copy + `.cal-inline` `data-cal-inline`) + Mail/Tel. Wird **unter** `<main>` eingehängt, nicht darin.

### 6.8 Scripts-Footer

```javascript
export const scriptsHtml = `
<script src="scripts/site-nav.js"></script>
<script src="scripts/cal-embed.js"></script>
<script src="scripts/booking-modal.js"></script>
</body>
</html>
`;
```

Icons auf Unterseiten: Inline-Sprite `spriteHtml`, Nutzung `<svg class="ico" aria-hidden="true"><use href="#i-mail"></use></svg>`. `vendor/lucide.min.js` nur auf `index.html`.

---

## 7. INTERAKTION

### Dauer und Easing

| Token | Wert | Nutzung |
|---|---|---|
| `--dur-fast` | `0.2s` | z. B. `.akte__cta-btn` |
| `--dur-mid` | `0.32s` | definiert |
| `--ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | Standard |
| `--ag-fast` | `0.26s` | Button-Hover-Lift |
| `--ag-medium` | `0.45s` | Reveal |
| Home-Navbar | `0.4s` `cubic-bezier(0.16, 1, 0.3, 1)` | inline `index.html` |

### Hover

`.btn-primary:hover` → `--orange-hover`. Zusätzlich `antigravity-polish.css`: `translateY(-1px)`, Schatten `0 8px 16px rgba(236, 106, 55, 0.18)`, Pfeil `→` per `::after`, `padding-right: 2.25rem`. Home `.hero-btn-primary:hover`: `translateY(-2px)`. Auf Touch (`hover: none`) ist der Lift abgeschaltet.

`.ref-card:hover`: `translateY(-3px)`. Nav-Links: Farbe `--charcoal`.

### Focus

Global:

```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role='button']:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ag-focus-ring), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
    border-radius: 10px;
}
```

Auf Grün / `#hero`: Ring `--focus-on-green`. `.page-hero :focus-visible`: `outline: 2px solid var(--focus-on-green)`.

### Active

Kein `:active`-Pseudo in `styles/*.css`. Zustand über `.is-active`, `[aria-selected="true"]`, `[aria-current="page"]`.

### Animationen

| Name | Trigger |
|---|---|
| `.reveal` → `.reveal.active` | `IntersectionObserver` **nur in `index.html`**, threshold `0.14` |
| Marquee `@keyframes marquee-scroll` | CSS infinite; Pause bei Hover/Focus; aus bei `prefers-reduced-motion` |
| AQUT-Sim Pulse | `scripts/aqut-sim.js` setzt `.is-active` auf Nodes |
| Arch/Kontrakt | `scripts/scroll-motion.js` |
| Hero-Scroll-Cue bounce | CSS infinite auf Home |

Reveal-Observer (index):

```javascript
        if ('IntersectionObserver' in window) {
            var revealObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.14, rootMargin: '0px 0px -4% 0px' });

            document.querySelectorAll('.reveal').forEach(function(el) {
                revealObserver.observe(el);
            });
```

Unterseiten haben diesen Observer nicht. `class="reveal"` nicht von Hand ins Markup neuer Unterseiten schreiben, solange das Script fehlt.

---

## 8. FORMULARE UND DATENFLUSS

Kein klassisches Kontaktformular (kein `POST` an ein eigenes PHP/Node-Backend für „Nachricht senden“).

### A. Lead-Magnet (Prozesshandbuch)

Seiten: `index.html`, `makler.html`. Script: `scripts/lead-magnet.js`.

Markup (`index.html`):

```html
                        <form id="lm-form" class="lm-form" novalidate>
                            <div class="lm-field">
                                <label for="lm-name">Ihr Name</label>
                                <input type="text" id="lm-name" name="name" autocomplete="name" maxlength="200" required>
                            </div>
                            <div class="lm-field">
                                <label for="lm-email">E-Mail-Adresse</label>
                                <input type="email" id="lm-email" name="email" autocomplete="email" maxlength="254" required>
                            </div>
                            <div class="lm-field lm-honeypot" aria-hidden="true">
                                <label for="lm-website">Website</label>
                                <input type="text" id="lm-website" name="website" tabindex="-1" autocomplete="off">
                            </div>
                            <label class="lm-check" for="lm-privacy">
                                <input type="checkbox" id="lm-privacy" required>
                                <span>Ich habe die <a href="datenschutz.html" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a> gelesen.</span>
                            </label>
                            <label class="lm-check" for="lm-marketing">
                                <input type="checkbox" id="lm-marketing">
                                <span>Ich möchte gelegentlich Hinweise zu neuen Systemen erhalten. Jederzeit widerrufbar.</span>
                            </label>
                            <button type="submit" id="lm-submit" class="btn-primary lm-submit">Prozesshandbuch herunterladen</button>
                            <p class="lm-note">Kein Verkaufsanruf. Sie bekommen das PDF und sonst nichts, solange Sie nichts anderes ankreuzen.</p>
                        </form>
```

Validierung (JS, nicht Native Constraint API trotz `required`): Name nicht leer, E-Mail enthält `@`, Privacy angehakt. Honeypot `#lm-website` muss leer sein. Fehlerklasse `.bm-error`.

Submit:

1. `POST {supabaseUrl}/rest/v1/lead_magnet_downloads` mit Anon-Key
2. Optional `POST` an `form[data-n8n-webhook]` im n8n-Insert-Shape

Payload: `name`, `email`, `magnet_slug: 'prozesshandbuch-2026'`, `source` (UTM/Referrer/`direct`), `privacy_ack`, `marketing_consent`, `consent_timestamp`. Erfolg: Formular `.is-hidden`, PDF `downloads/rais-prozesshandbuch-2026.pdf`.

### B. Terminbuchung (kein HTML-Formular)

Cal.com-iframe in `#contact` (`.cal-inline`) und im Modal (`#bm-cal-wrap`). Script lädt erst nach Klaro-Consent `cal` von `https://app.cal.com/embed/embed.js` (oder Org-Domain).

Nach `bookingSuccessful`:

```javascript
    fetch(SUPABASE_URL + '/functions/v1/submit-audit-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': 'Bearer ' + SUPABASE_ANON
      },
      body: JSON.stringify({
        name: name.slice(0, 200),
        email: email.slice(0, 254),
        phone: phone.slice(0, 40),
        inquiry_volume: inquiryVolume,
        pain_point: PAIN_POINTS.indexOf(painPoint) === -1 ? null : painPoint,
        icp_segment: entry.icpSegment || null,
        source: entry.source || null,
        privacy_ack: true,
        form_opened_at: openedAt(entry)
      })
    })
```

Edge Function `supabase/functions/submit-audit-lead/index.ts`: `inbound_leads`, Notion-Seite, Notify-Mail. Öffnet nur, wenn Name, E-Mail, Telefon und Anfragevolumen gesetzt sind.

### C. Keine HTTP-Submits

- ROI-Rechner `scripts/aqut-rechner.js` → finaler Button `.js-open-booking`
- Katalogsuche `scripts/katalog-filter.js` → clientseitig

---

## 9. SEO UND META

### Unterseiten (häufiger Muster)

`headHtml({ title, description, path })` in `page-shell.mjs` schreibt Title, Description, Favicons und Open Graph. Kein `twitter:card`, kein JSON-LD, kein `og:image`, kein `<link rel="canonical">` auf generierten Seiten.

Beispiel gerendert (`zusammenarbeit.html`):

```html
  <title>So arbeiten wir | RAIS</title>
  <meta name="description" content="Zusammenarbeit mit RAIS in fünf klaren Schritten: Erstkontakt, Discovery, Sales, Onboarding, Go-Live.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="icon" type="image/png" href="favicon.png?v=3">
  <meta property="og:title" content="So arbeiten wir | RAIS">
  <meta property="og:description" content="Zusammenarbeit mit RAIS in fünf klaren Schritten: Erstkontakt, Discovery, Sales, Onboarding, Go-Live.">
  <meta property="og:url" content="https://ritz-ai.solutions/zusammenarbeit.html">
  <meta property="og:type" content="website">
```

### Home

`index.html` zusätzlich Twitter-Tags, `google-site-verification`, Schema.org `ProfessionalService` und FAQPage JSON-LD (`renderFaqSchema()` aus `scripts/faq-data.mjs`, eingehängt durch `sync-index-shell.mjs`).

```html
    <title>RAIS | KI-Systeme für Maklerbüros mit Anfragevolumen</title>
    <meta name="description" content="KI-Systeme für Maklerbüros: Portalanfragen qualifizieren, Termine buchen, CRM pflegen. Live in Ihrer Infrastruktur, DSGVO-konform, ohne Vendor-Lock-in. Kostenlosen KI-Audit buchen.">
    <meta name="google-site-verification" content="A6q1zlZLweKSa1vIxp-owVoxpEXPyIW-gPWdY6N79ZI">
    <meta property="og:title" content="RAIS | KI-Systeme für Maklerbüros mit Anfragevolumen">
    <meta property="og:description" content="KI-Systeme für Maklerbüros: Portalanfragen qualifizieren, Termine buchen, CRM pflegen. Live in Ihrer Infrastruktur, DSGVO-konform, ohne Vendor-Lock-in.">
    <meta property="og:url" content="https://ritz-ai.solutions">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="RAIS | KI-Systeme für Maklerbüros mit Anfragevolumen">
    <meta name="twitter:description" content="KI-Systeme für Maklerbüros: Portalanfragen qualifizieren, Termine buchen, CRM pflegen. Live in Ihrer Infrastruktur, DSGVO-konform, ohne Vendor-Lock-in.">
```

```html
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "RAIS (Ritz AI Solutions)",
      "url": "https://ritz-ai.solutions",
      "description": "Prozessautomatisierung und KI-Systeme für Maklerbüros im deutschsprachigen Raum. Live in Ihrer Infrastruktur, DSGVO-konform, ohne Vendor-Lock-in.",
      "brand": { "@type": "Brand", "name": "RAIS" },
      "areaServed": ["DE", "AT", "CH"]
    }
    </script>
```

### Robots

| Seite | robots |
|---|---|
| Marketing-Unterseiten | kein robots-Meta (indexierbar), in Sitemap |
| `makler.html` | `noindex,nofollow` |
| `impressum.html`, `datenschutz.html` | `noindex, follow`; `robots.txt` Disallow |
| `demo.html` | Redirect; einziges `<link rel="canonical">` im Repo (zeigt auf `/`) |

`og:image` / `twitter:image`: **nicht vorhanden**.

---

## 10. RECHTLICHES UND TRACKING

### Consent: Klaro

Dateien: `klaro-config.js`, `vendor/klaro/klaro.js`, `vendor/klaro/klaro.min.css`, `styles/klaro-overrides.css`. Auf jeder Marketing-Seite im `<head>` (Reihenfolge: `public-config.js` → `sentry-klaro-bootstrap.js` → `klaro-config.js` → `klaro.js`).

```javascript
var klaroConfig = {
  version: 1,
  elementID: 'klaro',
  storageMethod: 'localStorage',
  storageName: 'klaro',
  cookieExpiresAfterDays: 365,
  lang: 'de',
  mustConsent: true,
  acceptAll: true,
  hideDeclineAll: false,
  privacyPolicy: '/datenschutz.html',
```

Services: `sentry` (purpose `security`), `cal` (purpose `booking`). Beide `required: false`. Consent-Log: `POST {supabaseUrl}/rest/v1/cookie_consents`.

Klaro-Primary-Button: **weiß auf Orange** (`color: #ffffff !important`), abweichend von `--on-orange` `#2F2A24`.

### Sentry

`scripts/sentry-klaro-bootstrap.js` injiziert Scripts `type="text/plain" data-name="sentry"`:

```javascript
  loader.src = 'https://js-de.sentry-cdn.com/' + cfg.sentryLoaderKey + '.min.js';
```

Klaro wandelt sie nach Consent in ausführbares JS.

### Cal.com

Skript `https://app.cal.com/embed/embed.js` nach Consent. CSP (`vercel.json`): `script-src` enthält `js-de.sentry-cdn.com app.cal.com`; `frame-src cal.com *.cal.com app.cal.com`; `connect-src` enthält `*.ingest.de.sentry.io`, Supabase-Host, `cal.com *.cal.com`.

### Nicht vorhanden

Keine Treffer für Google Analytics, GTM, Meta Pixel, Hotjar in HTML/JS (außer Zufallstreffer in vendor jsPDF).

### Legal-Pfade

- Impressum: `/impressum.html` (Datei `impressum.html`)
- Datenschutz: `/datenschutz.html` (Datei `datenschutz.html`)

Footer und Klaro `privacyPolicy` verlinken darauf.

---

## 11. ANLEITUNG NEUE SEITE `/makler`

### Ist-Stand (nicht raten)

`makler.html` existiert als handgeschriebene Landingpage: Mini-Header statt Hauptnav, `styles/makler.css`, `noindex,nofollow`, Lead-Magnet + Inline-Buchung. Sie steht **nicht** in `vite.config.js` `input` und **nicht** in `postbuild-copy.mjs` `copyTargets`. `npm run build` legt sie daher **nicht** in `dist/` ab.

Zwei Wege: (A) die bestehende LP deploybar machen, (B) eine kanonische Multipage-Unterseite wie `zusammenarbeit.html`. Für visuelle Einheit mit dem Rest der Website ist **B** der passende Weg. A bleibt dokumentiert, weil die Datei schon da ist.

### A. Bestehende `makler.html` in den Build holen

1. In `vite.config.js` innerhalb `build.rollupOptions.input` (nach Zeile 30) ergänzen:

```javascript
        makler: resolve(__dirname, 'makler.html'),
```

2. In `scripts/postbuild-copy.mjs` `copyTargets` ergänzen:

```javascript
  { from: 'styles/makler.css', to: 'styles/makler.css' },
```

3. Sitemap: nicht eintragen, solange `noindex` gilt (`build-sitemap.mjs` `PAGES` bleibt unverändert).
4. `npm run build` — URL: `https://ritz-ai.solutions/makler.html` (nicht `/makler` ohne Rewrite; Vercel serviert die HTML-Datei).
5. Keinen Nav-Link in `page-shell.mjs` ergänzen, wenn die Seite ein Funnel ohne Abwege bleiben soll (aktuelles Markup hat keine Hauptnav).

### B. Kanonische Unterseite `/makler.html` im Site-Look (empfohlen für „nicht von bestehenden Seiten zu unterscheiden“)

Nicht `makler.css` / `.makler-*` verwenden. Stattdessen page-shell.

**Schritt 1.** In `scripts/build-pages.mjs` nach dem Helper `page()` einen Aufruf anlegen:

```javascript
page({
  file: 'makler.html',
  active: null,
  title: 'Titel | RAIS',
  description: 'Eine Zeile, analog zu den anderen Unterseiten.',
  path: 'makler.html',
  main: `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Eyebrow</span>
    <h1>Überschrift im Serif-Schnitt der Unterseiten.</h1>
    <p>Lead, max. etwa 38rem Breite durch .page-hero p.</p>
    <button type="button" class="btn-primary js-open-booking" data-source="makler-hero">Kostenlosen KI-Audit buchen</button>
  </div>
</section>
<section class="home-band home-band--cloud" aria-labelledby="makler-body-title">
  <div class="section-wrap">
    <span class="mono-label">Abschnitt</span>
    <h2 class="section-h2" id="makler-body-title">Abschnittsüberschrift.</h2>
    <p class="section-sub">Fließtext in Stone.</p>
  </div>
</section>
`
});
```

Hinweis: `build-pages.mjs` schreibt `makler.html` **überschreibend**. Die heutige Funnel-Datei wäre damit weg. Vorher umbenennen oder Inhalt mergen.

**Schritt 2.** Dieselbe Vite-Zeile wie in A:

```javascript
        makler: resolve(__dirname, 'makler.html'),
```

Das ist die Registrierungsstelle (Datei `vite.config.js`, Block `input`).

**Schritt 3.** Optional Nav: `scripts/page-shell.mjs` `navHtml()` Desktop-`<ul>` (Zeilen 37–42) und Mobile-Links (Zeilen 54–59). Footer analog `footerHtml`. Dann `npm run pages`.

**Schritt 4.** Wenn die Seite indexierbar sein soll, in `scripts/build-sitemap.mjs` `PAGES`:

```javascript
  { file: 'makler.html', priority: '0.7' },
```

**Schritt 5.** Stylesheet-Kette nicht anfassen — `headHtml()` lädt bereits:

`fonts.css` → `antigravity-polish.css` → `tailwind.generated.css` → `site-multipage.css` → `home.css` → `booking-modal.css`.

**Schritt 6.** `npm run pages && npm run build`.

**Schritt 7.** Checkliste visuell:

- Grüner `.page-hero` mit `.mono-label` + Serif-h1 Gewicht 400, nicht Home-h1 Gewicht 700
- Helle Sektionen `.section-wrap` 1100px / 1.25rem Seitenabstand
- CTA `.btn-primary` Charcoal auf `#EC6A37`, Hover `#F37A48`, min-height 44px, Radius `0.55rem`
- Abschluss `#contact` (kommt aus `contactHtml`, nicht selbst bauen)
- Footer + Klaro + Booking-Modal aus der Shell
- `html lang="de" class="scroll-smooth"`
- Keine Tailwind-Utilities, keine Legal-HSL-Tokens, keine `.makler-*` Klassen

Vercel-Redirects: `/landingpage.html` zeigt aktuell auf `/`. Kein bestehender Redirect für `/makler`.

---

## Kurz: Was eine neue Unterseite laden muss

Head (aus `headHtml`): Charset, Viewport, Title, Description, Favicons, OG title/description/url/type, public-config, sentry-klaro-bootstrap, klaro-config, klaro.js + CSS, fonts.css, antigravity-polish, tailwind.generated, site-multipage, home, booking-modal.

Body: Sprite → Nav → `<main id="main">` (Hero + Bänder) → Contact → Footer + Sticky → Booking-Modal → `site-nav.js`, `cal-embed.js`, `booking-modal.js`.
