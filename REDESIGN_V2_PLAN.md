# RAIS Hauptseite — Verbesserungsplan V2

**Datum:** 2026-05-11
**Basis:** Live-Version nach Redesign V1 — Analyse via Code + User-Feedback

---

## Identifizierte Probleme

### Problem 1 — Hero-Panel verdeckt das Hintergrundbild (vom User bestätigt)

Das Glass-Panel (`.hero-content`) hat:
- `max-width: 860px` → belegt fast die gesamte Viewport-Breite
- `padding: 3.25rem 3.5rem` → macht das Panel sehr hoch
- `background: rgba(251,248,243,0.74)` → 74% Deckkraft, kaum transparent
- Inhalt: Label + H1 + Subtext + 3 Route-Links + 2 CTAs → Panel wird noch taller

Das Bergfoto ist auf Mobilgeräten gar nicht sichtbar, auf Desktop nur als schmaler Streifen links/rechts.

### Problem 2 — Leistungen: 2 Säulen statt 3 (vom User bestätigt)

Aktuelle Struktur (falsch):
- Säule 1: Spezialisierte Website
- Säule 2: Automation & KI-Agenten (kombiniert)

Korrekte Struktur (3 eigenständige Leistungen):
- **Leistung 1:** Spezialisierte Website → Hauptleistung
- **Leistung 2:** Prozessautomatisierung → eigenständige Erweiterung
- **Leistung 3:** KI-Agenten → eigenständige Erweiterung

### Problem 3 — Hero-Inhalt zu dicht (Code-Analyse)

Die Route-Links ("Direkt zu: Fliesenleger / Elektriker / Maler") stehen **im** Glass-Panel und machen es unnötig lang. Diese Navigation existiert bereits in der Navbar — es ist Dopplung. Entfernen reduziert Panel-Höhe spürbar ohne Informationsverlust.

### Problem 4 — Section-Heading wird inkonsistent (Folgefehler von Problem 2)

`"Zwei Leistungen. Ein klarer Fokus."` muss nach der 3-Säulen-Umstellung angepasst werden.

---

## Implementierungsplan

### Schritt 1 — Hero-Panel verkleinern und atmend machen

**Ziel:** Das Bergfoto ist klar sichtbar, das Panel ist ein Fenster — nicht eine Wand.

**CSS-Änderungen an `.hero-content`:**

```css
/* Vorher */
max-width: 860px;
padding: 3.25rem 3.5rem;
background: rgba(251, 248, 243, 0.74);

/* Nachher */
max-width: 680px;
padding: 2.5rem 3rem;
background: rgba(251, 248, 243, 0.68);
```

**HTML-Änderung:** `div.hero-route` komplett entfernen (3 Nischen-Links).
Das Panel verliert dadurch ca. 3–4rem Höhe und wird schlanker.

**Overlay leicht anpassen** — das Foto braucht etwas mehr Eigenpräsenz:

```css
/* Vorher */
background: linear-gradient(155deg, rgba(47,42,36,0.20) 0%, rgba(18,16,12,0.52) 100%);

/* Nachher */
background: linear-gradient(155deg, rgba(47,42,36,0.10) 0%, rgba(18,16,12,0.38) 100%);
```

**Ergebnis:** Foto atmet, Panel bleibt lesbar, Glaseffekt tritt stärker hervor.

---

### Schritt 2 — Leistungen: 3 eigenständige Säulen

**Neue Grid-Struktur:**

```
┌──────────────────────┬────────────────────┬────────────────────┐
│  LEISTUNG 1          │  LEISTUNG 2        │  LEISTUNG 3        │
│  [Badge: Haupt-      │  [Badge:           │  [Badge:           │
│   leistung]          │   Erweiterung]     │   Erweiterung]     │
│                      │                    │                    │
│  Spezialisierte      │  Prozessautomati-  │  KI-Agenten        │
│  Website             │  sierung           │                    │
│                      │                    │                    │
│  · Kostenrechner     │  · Anfragen        │  · Vorqualifi-     │
│  · Terminbuchung     │    auffangen       │    zierung         │
│  · Anfrageweg        │  · Abläufe auto-   │  · Verpasste       │
│                      │    matisieren      │    Anrufe          │
│  1.800 EUR einmalig  │  · Weiterleitung   │  · Dringlichkeits- │
│  [→ Branchen]        │                    │    routing         │
│                      │  Auf Anfrage       │                    │
│                      │  [→ Gespräch]      │  Auf Anfrage       │
│                      │                    │  [→ Gespräch]      │
└──────────────────────┴────────────────────┴────────────────────┘
```

**CSS-Änderung:**

```css
/* Vorher */
.leis-grid { grid-template-columns: 1fr 1fr; }

/* Nachher */
.leis-grid { grid-template-columns: 1.1fr 1fr 1fr; }

/* Mobile: Single column */
@media (max-width: 768px) {
    .leis-grid { grid-template-columns: 1fr; }
}
```

Leistung 1 bekommt `1.1fr` — minimal breiter als die Erweiterungen, signalisiert Hauptstellung ohne dominierend zu wirken.

**Icons:**
- Leistung 1: Monitor (bereits vorhanden)
- Leistung 2: `<path d="M13 2H6a2 2 0 0 0-2 2v16..."/>` (Flow / Workflow)
- Leistung 3: Bot-Icon (bereits in Pillar 2 vorhanden)

**Section-Intro Text:**

```
Mono-Label: "Was wir tun"
H2: "Eine Website. Zwei Erweiterungen."
Sub: Im Zentrum steht Ihre spezialisierte Website für Ihr Gewerk. Prozessautomatisierung und KI-Agenten greifen dort ein, wo Anfragen liegenbleiben oder Abläufe Zeit kosten.
```

---

### Schritt 3 — Hero-Route-Links in CTA-Block integrieren (optional)

Falls die Nischen-Links im Hero als wichtig für Conversion gelten, können sie als dritte CTA-Option unter den Buttons platziert werden — kleiner und weniger prominent als die Hauptaktionen:

```html
<!-- Nach den zwei Haupt-CTAs -->
<div class="hero-niche-links">
    <span>Direkt zur Branchenseite:</span>
    <a href="fliesenleger.html">Fliesenleger</a>
    <a href="elektriker.html">Elektriker</a>
    <a href="maler.html">Maler</a>
</div>
```

Mit eigenem kleinerem Styling, kein eigener Block. So bleibt die Information ohne das Panel aufzublähen.

---

### Schritt 4 — Branchen-Section: Badge-Verbesserung (Code-Analyse)

Die Branchen-Blöcke haben keine visuelle Unterscheidung von Leistungen. Da nun 3 klar getrennte Leistungen existieren, sollte die Branchen-Section stärker als "Wo die Website läuft" positioniert werden:

**H2 präzisieren:**

```
Vorher: "Drei Seiten. Drei unterschiedliche Verkaufslogiken."
Nachher: "Wo die Website eingesetzt wird."
```

**Sub:**

```
Vorher: "Die Startseite ist nur der Einstieg..."
Nachher: "Drei Gewerke — jede Branchenseite mit eigener Preislogik, eigenem Anfrageweg und passendem Vertrauensaufbau."
```

---

## Zusammenfassung der Änderungen

| # | Schritt | Datei | Aufwand |
|---|---------|-------|---------|
| 1 | Hero-Panel schmaler + transparenter, Route-Links entfernen | `index.html` CSS + HTML | 10 min |
| 2 | Leistungen: 3 Säulen statt 2, neues Grid + neue Copy | `index.html` CSS + HTML | 20 min |
| 3 | Nischen-Links als kleine Sub-CTAs im Hero (optional) | `index.html` HTML | 5 min |
| 4 | Branchen-Section H2 + Sub schärfen | `index.html` HTML | 5 min |

**Gesamt: ~40 Minuten**

---

## Qualitätsprüfung nach Implementierung

- [ ] Bergfoto auf 1440px Viewport klar sichtbar links/rechts vom Panel
- [ ] Bergfoto auf 375px Viewport hinter Panel erkennbar (zumindest oben/unten)
- [ ] 3-Säulen-Grid bricht auf ≤768px zu Single Column
- [ ] Leistung 1 bleibt klar als Hauptangebot erkennbar (Pistachio-Border, Badge, Preis)
- [ ] `grid-template-columns: 1.1fr 1fr 1fr` auf 1024px noch nicht zu eng
- [ ] Calendly und alle Links intakt
