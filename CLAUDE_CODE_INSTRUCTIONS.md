# CLAUDE CODE INSTRUCTIONS — RAIS Website

*Kontextdatei für Claude Code. Liegt im Repo-Root.*

---

## Projekt

| Feld | Wert |
|------|------|
| Website | https://ritz-ai.solutions |
| Repo | RAIS_Website_V2 |
| Stack | Vanilla HTML, CSS, JavaScript (kein Framework) |
| Deployment | **Vercel** (`vercel.json`, Build → `dist/`) |
| Hauptdatei | `index.html` (+ `prozesshandbuch.html` Lead-Magnet) |

---

## Positionierung (Stand 2026)

RAIS (Ritz AI Solutions) ist eine **KI- und Prozessautomatisierungs-Agentur** mit **dezentem Schwerpunkt auf Makler und Hausverwaltungen**.

- Kein Rebranding zu „nur Immobilien“. RAIS bleibt technologie- und ergebnisorientiert.
- Zielgruppe in Copy klar benennen, ohne andere Branchen auszuschließen (z. B. „für Makler, Hausverwaltungen und kleine Teams“).
- **ImmoScout24** nur als Integrations-/Portal-Beispiel, kein Partner-Claim, kein Logo ohne Lizenz.
- Keine erfundenen KPIs oder Garantien ohne Beleg.

---

## Seitenstruktur (`index.html`)

Reihenfolge der Sektionen:

1. `#hero` — Claim, CTAs, Proof-Strip
2. `#ticker` — Tech-Stack (n8n, Supabase, …)
3. `#leistungen` — drei Säulen (Prozessautomatisierung, KI-Agenten, Digitale Präsenz)
4. `#projekte` — drei expanding Use-Case-Karten
5. `#zusammenarbeit-prozess` — 7-Schritte-Collab-Path (`scripts/collab-path.js`, Styles in `styles/antigravity-polish.css`)
6. `#contact` — Über uns, Booking-Modal, Calendly

**Navigation:** Leistungen · Projekte · Kontakt · CTA „Kostenlosen Audit buchen“

**Entfernt / Legacy (nicht mehr im Repo):**
- `landingpage.html`, `demo.html`, Branchenseiten (`fliesenleger`, `elektriker`, `maler`) — gelöscht, keine Redirects mehr nötig

---

## Aktuelle Copy-Leitplanken

### Meta
- **Title:** `RAIS: Automatisierung und KI für Makler und Hausverwaltungen`
- Meta/OG/Twitter-Beschreibung: Portal-Anfragen, Objektakten, Team-Kommunikation, Workflows, internes GPT, eigene Datenbanken

### Hero
- H1: Manuelle Admin-Arbeit automatisieren für Makler und Hausverwaltungen. Messbar und ohne SaaS-Ballast.
- Sub: n8n, KI, eigene Datenbanken
- CTAs: „Kostenlosen Audit buchen“ · „Use Cases ansehen“ (`#projekte`)
- Proof-Strip: &lt;5 Min. Inseratsanfragen · 0 Anfragen ohne Follow-up · 24/7 internes Wissen aus Objektdaten

### Use Cases (`#projekte`)
1. Automatische Beantwortung von Inseratsanfragen (E-Mail/n8n, Gradient-Visual)
2. Wissensassistent für Objekte und Prozesse (internes GPT/RAG, CRM-Screenshot)
3. Objektakte und Übergabe automatisieren (Workflow-Screenshot)

### Booking-Modal (Schritt 2, Labels)
- Inseratsanfragen / Portale
- Objektakten & Dokumente
- Mieter-/Eigentümerkommunikation
- Internes Dokumentenmanagement
- Anderes

`data-value`-Keys **nicht ändern** (Supabase-Backend).

### Schreibstil
- Deutsch auf der Website
- **Keine Gedankenstriche (—)** in sichtbarer Copy. Punkte oder Kommas stattdessen.
- Kein AI-Hype, keine leeren Versprechen
- Ergebnisse vor Technologie-Buzzwords

---

## Technik & Integrationen

| Bereich | Details |
|---------|---------|
| Consent | Klaro (`klaro-config.js`) |
| Booking | Modal + Calendly-Embed |
| Lead-Speicher | Supabase (fire-and-forget aus Modal) |
| Sentry | Error-Monitoring (CSP in `.htaccess`) |
| Fonts | Baskerville/Palatino (Headlines), System/Mono für Labels |
| Farben | CSS-Variablen, Palette siehe `brand.md` |

**Wichtige Dateien:**
- `index.html` — gesamte Marketing-Seite inkl. inline CSS/JS-Anteile
- `styles/antigravity-polish.css` — Collab-Path, Process-Polish
- `scripts/collab-path.js` — interaktiver 7-Schritte-Pfad
- `impressum.html`, `datenschutz.html` — rechtliche Seiten, nur bei echten Datenfluss-Änderungen anpassen

---

## Constraints für Änderungen

- **Kein Framework** — Vanilla HTML/CSS/JS
- **Scope:** Copy- und Präsentationsänderungen bevorzugt; kein unnötiger Strukturumbau
- **Rechtliches:** Impressum/Datenschutz nicht ohne Grund anfassen; bei neuen Integrationen in Marketing-Text keine falschen Drittland-/Partner-Aussagen
- **Externe Links:** `target="_blank" rel="noopener noreferrer"`
- **Commits:** nur auf ausdrückliche Anfrage
- **Nicht ohne Grund ändern:** `#collab-path` Logik, Hero-Bild (`images/mark-koch-hero.webp`), Ticker-Inhalt

---

## Typische Aufgaben

| Aufgabe | Vorgehen |
|---------|----------|
| Copy anpassen | Nur `index.html`, Stilregeln oben beachten |
| Neuer Use Case | Expanding-Card-HTML in `#projekte`, bestehendes JS (`mouseenter`/`click`) nutzt `.expanding-card` |
| Prozess-Schritte | Text in `#zusammenarbeit-prozess`; Logik in `collab-path.js` nur bei Bedarf |
| Mobile | 375px prüfen, kein horizontaler Scroll, konsistentes `padding-inline` |
| Legal-Sync | `docs/legal-sync-workflow.md`, Skill `legal-website-de` bei DSGVO-Fragen |

---

## Verwandte Kontextdateien

| Datei | Rolle |
|-------|-------|
| `Claude_and_brand.md/CLAUDE.md` | Workflow- und Projektregeln |
| `Claude_and_brand.md/brand.md` | Positionierung, Messaging, Palette |
| `Claude_and_brand.md/brand_steer.md` | Visuelle Umsetzung |
| `RAIS_Website_Repositionierung.md` | Referenz der Live-Copy (Sektion für Sektion) |

---

## Deployment (Vercel)

**Production:** `ritz-ai.solutions` auf **Vercel**. Push auf `main` → automatischer Build (`npm run build` → `dist/`).

### Domain umziehen (VPS → Vercel)

1. [vercel.com](https://vercel.com) → Projekt mit GitHub-Repo `RAIS_Website_V2` verknüpfen
2. **Settings → Domains** → `ritz-ai.solutions` und `www.ritz-ai.solutions` hinzufügen
3. DNS beim Domain-Registrar anpassen (Vercel zeigt die exakten Records):
   - **Empfohlen:** A-Record `@` → `76.76.21.21` und CNAME `www` → `cname.vercel-dns.com`
   - Oder Nameserver auf Vercel umstellen
4. Warten bis SSL-Zertifikat aktiv (grün in Vercel)
5. **VPS:** nginx-Site für `ritz-ai.solutions` deaktivieren (nur noch n8n & Co. auf dem VPS)

### Routing

Clean-URL `/prozesshandbuch` → Rewrite in `vercel.json` (kein nginx nötig).

### Assets

Video und PDF nur unter `videos/` bzw. `downloads/`. `.htaccess` nur noch Legacy-Referenz für Apache.
