# CLAUDE.md

Version 4, Stand 09.08.2026. Ersetzt Version 3. Kevin-Hierarchy: RAIS = Marke, AMS = Systemname im Portfolio.

## Project Goal

RAIS als praktischen, hochwertigen Partner für Prozessautomatisierung und interne KI-Systeme für den operativen Mittelstand positionieren, mit der Immobilienwirtschaft als Referenzbranche.

Version 3 forderte hier noch Immobilienmaklerbüros als einzige Nische und stand damit im Widerspruch zu `brand.md` (Entscheidung vom 04.08.2026) und zur Live-Seite. Verbindlich ist:

- ICP ist der operative Mittelstand, die Seite führt vier Branchen
- Innerhalb der Referenzbranche ist die verkaufende Copy auf Maklerbüros ausgerichtet
- Hausverwaltung ist kein Ausschluss, sondern erscheint im Systemkatalog als Use Case (Mieteranfragen bei Beschwerden, Ticketing, Support über WhatsApp und E-Mail parallel)
- Auf der Startseite sprechen Hero und `#zielgruppe` seit 09.08.2026 ausdrücklich Maklerbüros an. Branchen-Tabs, Systemakte und Rechner bleiben branchenoffen. Details und Begründung in `brand.md`

Die Website verkauft messbare Entlastung. **RAIS** ist der Absender. **AMS** ist ein benanntes Angebotssystem unter RAIS, keine eigene Brand.

## Primäre Einschränkung

Bestehendes Fundament wiederverwenden. Vanilla HTML, Vite, Tailwind. Gezielte Edits vor Rebuilds.

## Site-Struktur

| Seite | Job |
|---|---|
| Home (`index.html`) | Landingpage / Lead-Magnet: Hero, Tech-Stack-Ticker, ICP, Warum RAIS, AMS-Flaggschiff, Use-Case-Spotlight-Cards (`#systeme`), Multi-Step-Rechner, Ablauf, Trust (ohne Kundenbeweis bis Freigabe), Kontakt |
| AMS (`ams.html`) | Verkaufsseite für das System inkl. Orientierungsclaim und client-only Multi-Step-Rechner |
| Referenzen (`referenzen.html`) | Case Studies; Haller-Teaser auf Home ausgeblendet bis Freigabe |
| So arbeiten wir (`zusammenarbeit.html`) | Prozess Discovery bis Betrieb (Footer-Nav, nicht primäre Nav) |
| Über uns (`ueber-uns.html`) | Kevin, externer Spezialist, Infrastruktur |
| Persönlichkeit (`persoenlichkeit.html`) | LinkedIn und YouTube, kuratiert, lokales Thumbnail |

Kontakt/Audit ist ein Modul auf jeder Seite. Primäre Nav: Systeme · Referenzen · Über uns · Persönlichkeit · Audit. Zusammenarbeit im Footer.

## Buchungsstrecke (Stand 09.08.2026)

Kein vorgeschaltetes Formular mehr. Der Cal-Kalender ist inline eingebettet, in `#contact` auf jeder Seite und im einstufigen Buchungsmodal. Regeln:

- Dauer des Erstgesprächs ist überall **20 Minuten**. Die 60 Minuten gehören ausschließlich zum Discovery Call im Ablauf-Abschnitt
- Der Embed lädt erst nach Einwilligung über den Klaro-Service `cal`, vorher steht ein Platzhalter
- Die Qualifizierungsfragen sind Pflichtfelder in der Cal-Buchungsmaske, nicht auf der Website. Identifier und Wertebereiche stehen im Kopf von `scripts/cal-embed.js`
- Der Lead entsteht erst nach bestätigter Buchung über `bookingSuccessful`. Abbrecher werden bewusst nicht erfasst
- Ziel-URL kommt aus `CAL_COM_URL`, lokal aus `.env`, in Produktion aus den Vercel-Umgebungsvariablen

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

## Rechner-Regeln (Home und AMS)

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
