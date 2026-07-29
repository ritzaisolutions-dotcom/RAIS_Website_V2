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
| Home (`index.html`) | RAIS als Unternehmen, Trust, Haller-Teaser, gewichtetes Live-Systeme-Portfolio, ICP, Kontakt |
| AQuT (`aqut.html`) | Verkaufsseite für das System inkl. Orientierungsclaim und client-only Rechner |
| Referenzen (`referenzen.html`) | Case Studies, aktuell Haller |
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
- Orientierungsclaim 30 Std/Monat nur mit Formel aus `brand.md`; Rechner nur aus Nutzereingaben
- Rechner sammelt keine Kontaktdaten und submitet nichts an CRM/Supabase

## Rechner-Regeln (AQuT)

- Inputs: Anfragevolumen, Zeitaufwand/Anfrage, Stundensatz; CRM nur Textbotschaft
- Ausgabe: Stunden/Woche und Euro/Monat „nach Ihren eigenen Angaben“
- Keine Erfolgsgarantie, keine RAIS-Umsatzquote ohne Nutzereingabe

## Persönlichkeit

- Kein Auto-Latest vom YouTube-Kanal kevin_ritz
- Lokales Thumbnail + Link-out (kein ytimg vor Consent)
- Kein Eckstein Podcast

## File Priorities

- `index.html`, `aqut.html`, `referenzen.html`, `zusammenarbeit.html`, `ueber-uns.html`, `persoenlichkeit.html`
- `styles/site-multipage.css`, `styles/booking-modal.css`, `styles/antigravity-polish.css`
- `scripts/booking-modal.js`, `scripts/aqut-rechner.js`, `scripts/site-nav.js`, `scripts/collab-path.js`
- `impressum.html`, `datenschutz.html`

## Was nicht beiläufig ändern

- Legal/Klaro ohne Grund
- `data-value`-Keys im Booking-Modal
- Secrets nicht committen; nur Publishables in `public-config.js`
