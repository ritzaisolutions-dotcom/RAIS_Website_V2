# RAIS Website — Live-Copy-Referenz

*Stand: Immobilien-Schwerpunkt (dezent), Single-Page `index.html`. Sektion für Sektion.*

---

## META / HEAD

**Title:**
`RAIS: Automatisierung und KI für Makler und Hausverwaltungen`

**Meta Description:**
`RAIS automatisiert Anfragen von Immobilienportalen, Objektakten und Team-Kommunikation für Makler und Hausverwaltungen, mit Workflows, internem GPT und eigenen Datenbanken.`

**OG / Twitter Title:**
`RAIS: Automatisierung für Makler und Hausverwaltungen`

**JSON-LD description:**
`Prozessautomatisierung und KI für Makler und Hausverwaltungen: Portal-Anfragen, Objektakten, internes Wissen. Messbar, direkt, ohne Umweg.`

---

## NAVIGATION

- Leistungen (`#leistungen`)
- Projekte (`#projekte`)
- Kontakt (`#contact`)
- CTA: Kostenlosen Audit buchen

Kein Branchen-Dropdown. Keine separaten Nischen-HTML-Seiten im Repo.

---

## HERO

**Headline:**
> Manuelle Admin-Arbeit automatisieren für Makler und Hausverwaltungen. Messbar und ohne SaaS-Ballast.

**Subheadline:**
> Anfragen von Portalen, Objektakten und wiederkehrende Mieter- oder Eigentümerkommunikation kosten täglich Zeit. RAIS baut maßgeschneiderte Systeme mit n8n, KI und eigenen Datenbanken, ohne teure Software-Abos.

**CTA Primary:** Kostenlosen Audit buchen  
**CTA Secondary:** Use Cases ansehen (`#projekte`)

**Proof-Strip:**
- &lt;5 Min. erste Antwort auf Inseratsanfragen
- 0 Anfragen ohne Follow-up
- 24/7 internes Wissen aus Objektdaten

---

## TECH TICKER (`#ticker`)

n8n · Supabase · Google Cloud · Microsoft 365 · Make · HubSpot · Python · TypeScript · OpenAI · Claude · Vercel · PostgreSQL

---

## LEISTUNGEN (`#leistungen`)

**Label:** Was wir tun  
**Headline:** Drei Hebel. Ein Ziel: weniger manuelle Arbeit.  
**Sub:** Je nach Situation greifen wir dort ein, wo der größte Zeitverlust entsteht. Besonders relevant, wenn täglich Anfragen, Akten und Kommunikation parallel laufen.

### Säule 1 — Prozessautomatisierung (Hauptleistung)

> Von der Portal-E-Mail bis zur Aktenanlage und Team-Übergabe: wir automatisieren die Abläufe, die Makler und Verwaltungen täglich ausbremsen.

- ImmoScout24 und Portal-Anfragen per E-Mail erfassen und beantworten
- Objektakte, Ordner und CRM/Tabellen synchron halten
- Besichtigungs- und Rückfrage-Follow-ups
- Anbindung Outlook, Google Workspace, PropStack u. a.

### Säule 2 — KI-Agenten (Erweiterung)

> Internes GPT auf Objektdaten, Exposés, Hausordnung und Vertrags-FAQ. Antworten für Ihr Team, nicht für die Öffentlichkeit.

- Vorqualifizierung von Interessenten
- Antwortentwürfe für Makler und Verwaltung
- Wissen aus eigener Datenbank (RAG)
- DSGVO-konform konfigurierbar

### Säule 3 — Digitale Präsenz (Erweiterung)

> Exposé-Landingpages, Anfrageformulare und Besichtigungstermine, digital aufgesetzt und direkt an Ihre Workflows angebunden.

- Exposé-Landing und Anfrageformular
- Terminbuchung für Besichtigungen
- Direkte Anbindung an Ihre Automatisierungen
- Schnell live, ohne langen Entwicklungsprozess

---

## USE CASES (`#projekte`)

**Label:** Use Cases  
**Headline:** Was wir für Immobilienteams gebaut haben.  
**Sub:** Konkrete Abläufe, keine Konzeptfolien. Jedes System löst einen echten Engpass im Tagesgeschäft.

### Karte 1 — Inseratsanfragen

- Badge: E-Mail-Automation · n8n
- Titel: Automatische Beantwortung von Inseratsanfragen
- Eingehende Anfragen von ImmoScout24 per E-Mail werden erfasst, vorqualifiziert und mit passender Erstantwort beantwortet, inklusive Weiterleitung im Team.
- Visual: Gradient-Placeholder (kein Portal-Logo)

### Karte 2 — Wissensassistent

- Badge: Internes GPT · RAG
- Titel: Wissensassistent für Objekte und Prozesse
- Teaminternes GPT mit Anbindung an Datenbank und Dokumente. Antworten zu Objekten, Mietern und Abläufen ohne Tabellenchaos.
- Visual: `images/RAIS CRM Screenshot.png`

### Karte 3 — Objektakte

- Badge: Workflow · Dokumente
- Titel: Objektakte & Übergabe automatisieren
- Bei Neuvermietung oder Eigentümerwechsel: Ordner, Checklisten, E-Mails und Status, ohne manuelles Copy-Paste zwischen Tools.
- Visual: `images/automatisches Onboarding system Screenshot.png`

**CTA unter Karussell:** Use Cases ansehen

---

## ZUSAMMENARBEIT (`#zusammenarbeit-prozess`)

7 Schritte, interaktiver Collab-Path, Tagline: „Der Weg einer Zusammenarbeit“

1. Erstgespräch
2. Bottlenecks in Prozessen identifizieren (Anfragen- und Akten-Engpässe)
3. Strategien entwickeln
4. Umsetzung
5. Test & Abnahme
6. Live-Betrieb
7. Betreuung & Optimierung

---

## KONTAKT (`#contact`)

**Headline:** Direkt. Kein Umweg.

**Über uns:**
> RAIS steht für Ritz AI Solutions, Kevin Ritz aus Koblenz. Ich konzipiere und baue Automatisierungslösungen für Makler, Hausverwaltungen und kleine Teams, von der ersten Analyse bis zum laufenden System. Kein Account-Manager, kein Wiederverkäufer.

**Booking Modal Schritt 2 (Labels):**
- Inseratsanfragen / Portale (`onboarding`)
- Objektakten & Dokumente (`nachverfolgung`)
- Mieter-/Eigentümerkommunikation (`kommunikation`)
- Internes Dokumentenmanagement (`dokumentation`)
- Anderes (`anderes`)

---

## ERLEDIGT / ARCHIV

- [x] Single-Page: nur `index.html` als Marketing-Seite
- [x] `landingpage.html` und `demo.html` → 301 auf `/`
- [x] Branchenseiten → 410 in `.htaccess`
- [x] Branchen-Dropdown entfernt
- [x] Immobilien-Use-Cases statt WF1/Tekin/Agentur-CRM
- [x] Collab-Path (7 Schritte) vor Kontakt
- [x] Copy ohne Gedankenstriche in sichtbarem Text

## RECHTLICHES (Hinweis für Copy)

- ImmoScout24 nur als Beispiel-Quelle, kein Partner-Claim
- Keine KPI-Garantien ohne Beleg
- Datenschutz nur bei neuen Datenflüssen anpassen

---

## DATEIEN

| Datei | Rolle |
|-------|-------|
| `index.html` | Gesamte Marketing-Seite |
| `styles/antigravity-polish.css` | Collab-Path, Polish |
| `scripts/collab-path.js` | Schritt-Navigation |
| `impressum.html`, `datenschutz.html` | Rechtstexte |
| `Claude_and_brand.md/*` | Brand- und Agent-Kontext |
| `CLAUDE_CODE_INSTRUCTIONS.md` | Claude Code Kontext |
