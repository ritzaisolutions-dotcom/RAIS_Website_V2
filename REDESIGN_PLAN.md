# RAIS Hauptseite — Redesign-Plan

**Datum:** 2026-05-11
**Scope:** `index.html` (Hauptseite) — keine Änderungen an Branchenseiten, Legal, oder Backend

---

## Status-quo-Analyse

### Was gut ist
- Headline im Hero ist stark: *„Sie verlieren Aufträge nicht an bessere Betriebe. Sie verlieren sie an greifbarere."*
- Farbpalette und Typografie sind eigenständig (Baskerville + JetBrains Mono + Warm Linen)
- Grain-Canvas + Scroll-Cue laufen bereits
- Branchen-Routing-Logik ist richtig (Hub-Seite)
- Calendly click-to-load ist DSGVO-konform

### Kernprobleme

**1. Kein Gesicht**
`images/pic_kevin.jpg` liegt im Projekt, wird aber nicht genutzt. Gründer-Bereich zeigt Platzhalter mit „RAIS"-Text.

**2. Hero-Hintergrund ist statisch**
Gradient + Grain vorhanden, aber ohne Bewegung.

**3. Leistungen: Zwei Angebote — drei Karten**
Das Kernangebot (Website) und das zweite Angebot (Automation & KI-Agenten) werden als drei fragmentierte Karten präsentiert. Automation-Karte 2 und 3 gehören zusammen und sollten als eine zweite Leistung positioniert werden. Der Preis taucht nirgends auf.

---

## Was nicht geändert wird

- Hero-Headline und Subline
- Branchen-Sektion (Struktur und Logik)
- Kontakt / Calendly
- Navbar, Footer
- Alle Branchenseiten

---

## Implementierungsplan

### Schritt 1 — Hero-Animation (Blob-Hintergrund)

**Ansatz: Zwei langsam driftende Farb-Blobs, CSS-only**

Kein React, kein framer-motion, keine neuen Dependencies. Zwei `div`-Elemente mit stark gerundetem `border-radius`, `filter: blur(120px)`, und langen CSS-`@keyframes` (18–24 s), die sehr langsam ihre Position verschieben.

```
Hero-Background-Stack (unten → oben):
  1. Warm Linen Grundfläche          (bleibt)
  2. Statischer Radial-Gradient Spot  (bleibt)
  3. [NEU] Blob A — Orange #EC6A37, opacity 0.16, driftet NW → SE, 22 s
  4. [NEU] Blob B — Sage #789464,   opacity 0.12, driftet E → W,   18 s
  5. Canvas Grain                     (bleibt ganz oben)
```

`prefers-reduced-motion`: Blobs erhalten `animation: none`, Opacity auf 0.07 reduziert.

**Nicht verwenden:** Background-Boxes (15.000 DOM-Nodes, dark-mode-Design, gegen brand_steer.md). Partikel, SVG-Morphing, Parallax — passt nicht zum Markton.

---

### Schritt 2 — Leistungen: Zwei klare Säulen

**Neue Struktur: Zwei-Spalten-Layout**

Statt 1 Primary Card + 2 kleine Karten → zwei gleichwertige Blöcke nebeneinander, die klar als zwei Leistungen lesbar sind.

```
┌─────────────────────────────────┬──────────────────────────────────┐
│  SÄULE 1                        │  SÄULE 2                         │
│  Spezialisierte Website         │  Automation & KI-Agenten         │
│  ─────────────────────          │  ────────────────────────────    │
│  [Icon Monitor]                 │  [Icon Bot/Zap]                  │
│  [Badge: Hauptleistung]         │  [Badge: Erweiterung]            │
│                                 │                                  │
│  Website mit Kostenrechner      │  Automatisierte Abläufe, die     │
│  und Terminbuchung — damit      │  Anfragen auffangen, vorqualifi- │
│  neue Anfragen sauber           │  zieren und weiterleiten — auch  │
│  ankommen.                      │  wenn Sie gerade nicht erreich-  │
│                                 │  bar sind.                       │
│  · Leistungen & Referenzen      │                                  │
│  · Kostenrechner                │  · Vorqualifizierung bei Eingang │
│  · Rückruf / Terminbuchung      │  · Auffang für verpasste Anrufe  │
│                                 │  · Weiterleitung nach Dringlichk.│
│  ─────────────────────          │                                  │
│  1.800 EUR — einmalig           │  Auf Anfrage / als Erweiterung   │
│  Keine laufenden Drittkosten    │                                  │
│  [→ Branchen ansehen]           │  [→ Gespräch buchen]             │
└─────────────────────────────────┴──────────────────────────────────┘
```

**Key-Änderungen:**
- Preis `1.800 EUR` sichtbar in Säule 1 als eigene Zeile — nicht als Fußnote
- „Keine laufenden Drittkosten" als Mono-Label darunter — das ist ein echter Unterschied zu Wettbewerbern
- Säule 2 kombiniert die bisherigen Cards 2 + 3 zu einem kohärenten zweiten Angebot
- „Auf Anfrage / als Erweiterung" — ehrlich, kein Preis erfinden
- Beide Säulen gleich breit (`1fr 1fr`), keine asymmetrische Gewichtung mehr — zwei Leistungen, klar getrennt

**CSS-Änderung:** Das bisherige `leis-grid` (3fr 2fr, 1fr 1fr) wird durch ein sauberes `grid-template-columns: 1fr 1fr` ersetzt. Die alten `.leis-card--primary`, `--secondary-top`, `--secondary-bot` entfallen. Zwei neue Klassen: `.leis-pillar` (beide gleich) und `.leis-pillar--main` (Säule 1, behält den grünen Linksrand).

---

### Schritt 3 — Gründer-Foto einsetzen

**Datei:** `images/pic_kevin.jpg` (bereits vorhanden)

Ersetzt den `founder-photo-placeholder`-Div vollständig:

```html
<!-- Alt: -->
<div class="founder-photo-placeholder" aria-hidden="true">
    <span>RAIS</span>
</div>

<!-- Neu: -->
<img
  src="images/pic_kevin.jpg"
  alt="Kevin Ritz, Gründer von RAIS"
  class="founder-photo"
  width="340"
  height="340"
>
```

Neue CSS-Klasse `.founder-photo`: `object-fit: cover`, `border-radius: 14px`, warmer `box-shadow`, keine Filter.

---

### Schritt 4 — Über-uns-Copy: persönlicher

**Mono-Label:** „Die Marke dahinter" → „Wer dahinter steckt"

**Headline:** „RAIS ist der Rahmen hinter den Branchenseiten." → „Direkt. Kein Umweg."

**Copy:** Zwei Absätze mit überlappenden Aussagen → ein klarer Absatz:

> RAIS ist Kevin Ritz — Koblenz. Ich entwickle spezialisierte Websites für Fliesenleger, Elektriker und Maler: mit passendem Anfrageweg, klarem Angebot und einer Struktur, die zum Gewerk passt. Jedes Projekt läuft direkt mit mir — kein Account-Manager, kein Wiederverkäufer.

---

### Schritt 5 — Branchen-Texte schärfen (optional)

| Branche | Aktuell | Neu |
|---------|---------|-----|
| Fliesenleger | „Hier geht es oft um Preisgefühl, Projektart und den Weg zur Besichtigung." | „Anfragen oft vage — zu groß, zu klein, falsches Budget. Der Kostenrechner sortiert das, bevor Sie zurückrufen." |
| Elektriker | „Hier zählt, ob eine Anfrage dringend ist, planbar ist oder erst nach einem Rückruf Sinn ergibt." | „Dringlich oder planbar? Die Seite trennt das sauber — und leitet entsprechend weiter." |
| Maler | „Hier entscheidet oft der erste Eindruck: Wirkt der Betrieb sauber, klar und passend für das Projekt?" | „Der erste Eindruck entscheidet, ob jemand anfragt oder weiterschaut. Die Seite macht diesen Eindruck." |

---

## Geänderte Dateien

| Datei | Änderung |
|-------|---------|
| `index.html` | Hero-Blobs (CSS + HTML), Leistungen-Grid (2 Säulen), Preis sichtbar, Foto-Tag, Copy-Korrekturen |
| `images/pic_kevin.jpg` | Nur eingebunden — keine Änderung an der Datei |

Keine neuen Dependencies. Kein Build-Step erforderlich.

---

## Implementierungsreihenfolge

1. **Schritt 3** — Foto einsetzen (5 min, sofortiger visueller Impact)
2. **Schritt 1** — Hero-Blobs (20 min)
3. **Schritt 2** — Leistungen zwei Säulen + Preis (20 min)
4. **Schritt 4** — Über-uns-Copy (10 min)
5. **Schritt 5** — Branchen-Texte (10 min)

**Gesamt: ~65 Minuten**

---

## Qualitätsprüfung vor Deployment

- [ ] Foto lädt, kein gebrochenes `src`
- [ ] Hero-Blobs auf Mobile flüssig, kein Layout-Shift
- [ ] `prefers-reduced-motion` deaktiviert Blob-Animation
- [ ] Preis in Säule 1 auf 375px-Viewport lesbar
- [ ] Zwei-Spalten-Grid bricht auf Mobile korrekt zu Single-Column
- [ ] Calendly lädt nach Klick
- [ ] `npm run build` schlägt nicht fehl
