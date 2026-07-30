# CLAUDE.md

Version 3, Stand 25.07.2026. Ersetzt Version 2. Kevin-Hierarchy: RAIS = Marke, AQuT = Systemname im Portfolio.

## Project Goal

RAIS als praktischen, hochwertigen Partner für Prozessautomatisierung und interne KI-Systeme für unabhängige Immobilienmaklerbüros positionieren.

Die Website verkauft messbare Entlastung. **RAIS** ist der Absender. **AQuT** ist ein benanntes Angebotssystem unter RAIS, keine eigene Brand.

## Primäre Einschränkung

Bestehendes Fundament wiederverwenden. Vanilla HTML, Vite, Tailwind. Gezielte Edits vor Rebuilds.

## Site-Struktur

| Seite | Job |
|---|---|
| Home (`index.html`) | Landingpage / Lead-Magnet: Hero, Tech-Stack-Ticker, ICP, Warum RAIS, AQuT-Flaggschiff, Use-Case-Spotlight-Cards (`#systeme`), Multi-Step-Rechner, Ablauf, Trust (ohne Kundenbeweis bis Freigabe), Kontakt |
| AQuT (`aqut.html`) | Verkaufsseite für das System inkl. Orientierungsclaim und client-only Multi-Step-Rechner |
| Referenzen (`referenzen.html`) | Case Studies; Haller-Teaser auf Home ausgeblendet bis Freigabe |
| So arbeiten wir (`zusammenarbeit.html`) | Prozess Discovery bis Betrieb (Footer-Nav, nicht primäre Nav) |
| Über uns (`ueber-uns.html`) | Kevin, externer Spezialist, Infrastruktur |
| Persönlichkeit (`persoenlichkeit.html`) | LinkedIn und YouTube, kuratiert, lokales Thumbnail |

Kontakt/Audit ist ein Modul auf jeder Seite. Primäre Nav: Systeme · Referenzen · Über uns · Persönlichkeit · Audit. Zusammenarbeit im Footer.

## Design Authority

1. `brand.md`
2. `brand_steer.md`
3. Projekt-Skills `.cursor/skills/frontend-design` und `.cursor/skills/cyber-security`
4. Seitendateien / CSS

## Content Rules

- Deutsch, glaubwürdig, ohne Gedankenstriche (—)
- Keine erfundenen Beweise
- Orientierungsclaim 20–35 Std/Woche und Speed-to-Lead 15 Std → 2 Min nur mit Formel aus `brand.md`; Rechner nur aus Nutzereingaben
- Rechner sammelt keine Kontaktdaten und submitet nichts an CRM/Supabase
- Haller-Teaser auf Home ausgeblendet bis Freigabe

## Rechner-Regeln (Home und AQuT)

- Multi-Step: Volumen → Telefon-Nacharbeit → Kostensatz → Ergebnis
- Inputs: Anfragevolumen, Minuten pro Mail-Anfrage, Anteil Mailbox-Nachtelefonat (%), Minuten pro Mailbox-Nein-Anruf, Stundensatz
- Formel: `emailHours + phoneHours` → Std/Woche und Euro/Monat „nach Ihren eigenen Angaben“; Aufschlüsselung Mail vs. Telefon
- Kein CRM-Feld im Rechner (CRM wird im Discovery-Call geklärt)
- Keine Erfolgsgarantie, keine RAIS-Umsatzquote ohne Nutzereingabe
- Auch auf der Home-Landingpage einsetzbar (gleiche IDs, `aqut-rechner.js`)
- British Racing Green (`#004225`) ist der Grün-Token; `--pistachio` ist nur noch Alias

## Persönlichkeit

- Kein Auto-Latest vom YouTube-Kanal kevin_ritz
- Lokales Thumbnail + Link-out (kein ytimg vor Consent)
- Kein Eckstein Podcast

## File Priorities

- `index.html`, `aqut.html`, `referenzen.html`, `zusammenarbeit.html`, `ueber-uns.html`, `persoenlichkeit.html`
- `styles/site-multipage.css`, `styles/home.css`, `styles/booking-modal.css`, `styles/antigravity-polish.css`
- `scripts/booking-modal.js`, `scripts/aqut-rechner.js`, `scripts/site-nav.js`, `scripts/collab-path.js`
- `impressum.html`, `datenschutz.html`

## Was nicht beiläufig ändern

- Legal/Klaro ohne Grund
- `data-value`-Keys im Booking-Modal
- Secrets nicht committen; nur Publishables in `public-config.js`
