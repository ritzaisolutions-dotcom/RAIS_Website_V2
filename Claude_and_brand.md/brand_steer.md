# RAIS Brand Steer

Version 2, Stand 25.07.2026. Ersetzt die vorherige Fassung.

## Purpose

Diese Datei steuert die visuelle Umsetzung der aktuellen RAIS-Website.
`brand.md` definiert Positionierung und Botschaft.
`brand_steer.md` übersetzt das in Bildschirm-Entscheidungen.

Autoritätsreihenfolge:

1. `brand.md`
2. `brand_steer.md`
3. Seitendateien (`index.html`, weitere Seiten, CSS)

## Core Appearance Goal

RAIS soll wie kommerzielle Klarheit mit editorialer Zurückhaltung wirken.

Das heißt:

- warm
- hochwertig
- komponiert
- glaubwürdig für ein operativ arbeitendes Maklerbüro, nicht Consumer-Glanz
- eher wie ein ernsthaftes Angebot als eine Startup-Landingpage

## Anti-Goals

Nicht abdriften in:

- generische Agentur-Ästhetik
- generische SaaS-Card-Grids
- "AI-Agentur"-Bildsprache
- Dark-Tech-Theatralik
- dekorative Effekte, die Vertrauen schwächen
- gefälschte Portal-Markenzeichen oder irreführende Produkt-Screenshots
- mehrere gleich laute CTAs auf einer Sektion
- Nummerierung ohne echte Reihenfolge im Inhalt

## Site-Architektur

**Änderung gegenüber Version 2:** RAIS ist die Marke. AQuT ist ein Systemname im Portfolio, kein Flaggship-Brand. Home ist Unternehmensseite mit gewichtetem Live-Systeme-Teaser. Nur AQuT hat eine Deep-Subpage.

```
Home (RAIS) ──┬── #systeme (AQuT dominant + 5 Peers)
              ├── AQuT (System-Verkaufsseite + Rechner)
              ├── Referenzen
              ├── Über uns
              ├── Persönlichkeit
              ├── So arbeiten wir (Footer / sekundär)
              └── Kontakt / Audit (Modul, kein Nav-Punkt)
```

Primäre Nav: Systeme · Referenzen · Über uns · Persönlichkeit · Audit buchen.

### Home

**Job:** RAIS als Unternehmen zeigen, Vertrauen, kurzes Portfolio, Conversion.

- Hero: Qualifizierungs-Claim (kein Anfragen-Problem, Qualifizierungs-Problem), Supporting, primär Audit, sekundär `#systeme`
- Trust-Strip: EU/AVV/Hosting (keine Tech-Logos)
- Pain-/Alltagssektion (`#alltag`): konkrete Qualifizierungs-Pains vor der Lösung
- Wem wir geholfen haben: Haller-Teaser mit Outcome-Richtung ohne Fake-Kennzahl → `/referenzen.html`
- Live-Systeme: asymmetrisches Bento, AQuT groß, fünf Peers leichter mit Kontextwort
- ICP inkl. sichtbarer Ausschlüsse, unnummeriert
- Kurzer Einstieg „So starten wir“ → `/zusammenarbeit.html`
- FAQ lebt auf der AQuT-Seite (DSGVO, CRM, Dauer, Fit), nicht auf Home
- Kontaktmodul

### AQuT

**Job:** dieses eine System verkaufen. Absender bleibt RAIS.

1. Orientierungsclaim (30 Std-Formel aus brand.md), nicht als feste Garantie
2. Rechner „nach Ihren Angaben“, client-only, keine Leads
3. Vier-Schritt-Prozess
4. Paket 1
5. Use-Case-Sage-Fläche
6. Paket-2-Ausblick
7. Scope / Nicht-Scope
8. FAQ (DSGVO/EU, onOffice/Propstack, Dauer, Teamgröße/Fit)
9. Ein primärer CTA: Audit buchen

### So arbeiten wir

**Job:** Angst vor dem Ablauf nehmen. Collab-Prozess (Discovery bis Betrieb) mit vollem Raum. In der Footer-Navigation.

### Referenzen

**Job:** Beweisen, nicht behaupten. Haller als Impact-Story: Ausgangslage → gebautes System → Alltag in Prozesssprache → ehrlicher Status ohne unbelegte Kennzahlen. Keine Logo-Wall.

### Über uns

**Job:** Gründerzugang, EU-Infrastruktur, externer Security-Review. Unverändert in der Grundstruktur.

### Persönlichkeit

**Job:** Media-Hub als RAIS-Äquivalent zu Podcast/Resources: kuratierte LinkedIn-Beiträge plus technische YouTube-Praxis-Videos (`@kevin_ritz`). Zukunftspfad: mehr technische Videos auf YouTube. Regeln: lokales Thumbnail + Link-out, kein Auto-Latest vom Kanal, kein `ytimg`/Embed vor Consent, kein Eckstein-Podcast, kein Audio-Podcast-Produkt.

### Kontakt / Audit

Kein eigener Navigationspunkt, wiederverwendbares Modul am Ende jeder Seite. Mehrstufiges Formular bleibt in der Struktur, ohne Emoji-Icons, siehe Modul-Regeln unten. `data-value`-Keys unverändert lassen, Supabase-Kompatibilität.

## Layout Steering

Bevorzugen:

- klarer Sektionsrhythmus je Seite, abgestimmt auf deren einzelnen Job
- starke Copy-Hierarchie, nicht jede Sektion gleich gewichtet
- pro Seite maximal zwei Sektionen, die spürbar größer sind als der Rest
- Inhaltsbreite maximal 1100 px, Textspalten deutlich schmaler
- Sektionsabstände mindestens 120 px auf Desktop

Vermeiden:

- dieselbe Card-Behandlung Sektion für Sektion ohne Zweck wiederholen
- mehrere gleich laute CTAs auf einer Seite, Richtwert: ein primärer CTA pro Seite plus ein wiederkehrendes Kontaktmodul
- dekorative Layout-Bewegungen ohne Verkaufszweck
- römische oder arabische Nummerierung an Stellen ohne echte Reihenfolge (Beispiel: die vier ICP-Kriterien sind gleichrangig, keine Sequenz, daher unnummeriert)

## Surface Strategy

Primäre Atmosphäre:

- Cloud und Warm Linen
- ruhige tonale Schichtung
- dezenter, papierartiger Kontrast

Stützstruktur:

- Sage und Dark Pistachio, genau eine Sektion pro Seite darf als volle Blockfläche in Sage mit Warm-Linen-Text ausgeführt werden. Auf der AQuT-Seite ist das die Use-Case- beziehungsweise Beweisfläche.
- Charcoal und Stone für Lesbarkeit

Akzent:

- Mandarin Orange ausschließlich für Aktion und Schlüsselbetonung, unter fünf Prozent Flächenanteil
- Mandarin nie als Fließtextfarbe auf Cloud, Kontrast dort grenzwertig

Orange darf nicht zur dominanten Atmosphäre werden.

## Typography Steering

**Empfehlung, kein festgeschriebener Beschluss, bei Bedarf anpassen:**

Überschriften sollen editorial und kommerziell ernsthaft wirken, aber bewusst nicht die aktuell verbreitete Kombination aus kontrastreicher Display-Serif auf warmem Creme mit Terrakotta-Akzent verwenden, das ist gerade der Standard-Look KI-naher Websites und schwächt die Differenzierung genau der Marke, die "keine Lösung von der Stange" verkauft.

- Überschriften: eine **Text**-Serif statt Display-Serif, moderater Strichkontrast, sachlich. Kandidaten: Source Serif 4, Literata, Newsreader, lizenziert GT Alpina oder Freight Text.
- Fließtext: neutrale Grotesk, ausdrücklich nicht geometrisch, das schließt Poppins und Montserrat aus. Archivo oder Instrument Sans frei verfügbar, Söhne lizenziert.
- Mono-Cues erlaubt für kleine Labels (`mono-label`), zurückhaltende Systemmarker, unterstützende Rahmung. Mono darf nie zur dominanten Stimme werden, keine Mono-Headlines, kein Mono-Fließtext.

Deutsche Satzregeln: keine Versalien-Eyebrows (Deutsch hat Großbuchstaben in Substantiven, Versalsatz zerstört das Wortbild), typografische Anführungszeichen „so", keine Gedankenstriche in sichtbarer Copy.

## Modul-Regeln

### Hero (Home und AQuT unterscheiden sich)

**Home-Hero** kommuniziert Zielgruppe und Kernversprechen in einer Zeile, filtert, verweist weiter. Kein Produktmenü im Hero.

**AQuT-Hero** eröffnet mit dem Orientierungsclaim (30 Std-Formel) und führt zum Rechner. Umsatzargument als unterstützender Block erlaubt. Keine Gedankenstriche.

### Rechner (nur auf der AQuT-Seite)

Interaktives Modul, direkt im oberen Bereich der AQuT-Seite. Zweck: Schmerz quantifizieren, ohne unbelegte Behauptungen.

Eingaben, in dieser Reihenfolge:

1. Anfragevolumen pro Woche
2. Zeitaufwand pro Anfrage aktuell, in Minuten
3. Stundensatz, editierbares Vorschlagsfeld
4. Aktuelles CRM (onOffice, Propstack, anderes, keins)

Berechnung ausschließlich aus 1 bis 3: Stunden pro Woche und kalkulatorischer Wert pro Monat, mit dem sichtbaren Zusatz "nach Ihren eigenen Angaben". CRM-Eingabe steuert eine textliche Botschaft (Anbindung ohne Migration bei onOffice/Propstack, schlanke eigene Datenbank bei "keins"), fließt nicht in die Rechnung ein.

Keine Euro- oder Stundenzahl anzeigen, die nicht direkt aus den drei numerischen Eingaben berechnet ist. Keine Erfolgsgarantie einbauen, solange der zugehörige Wissensbasis-Eintrag auf Status Hypothese steht.

### Use Cases (auf der AQuT-Seite, ehemals `#projekte`)

Drei expandierende Karten, erste Karte aktiv, abgeleitet aus Paket 1:

1. Anfrage kommt rein, wird qualifiziert, Rückfrage geht automatisch raus
2. Interessent bucht Termin selbst, landet im Kalender
3. Dashboard und intelligente Suche

Screenshots oder Verlaufsflächen nur, wenn Copy exakt passt. Keine Wiederverwendung von Screenshots aus anderen Projekten mit unpassenden Titeln, insbesondere keine Inhalte aus dem Eckstein-Podcast-CMS.

### Zusammenarbeit-Prozess (jetzt auf "So arbeiten wir")

Organischer Wellenpfad, sieben Schritte, deutsche Copy, interaktiver Stepper (`collab-path.js`), Schritt 1 ist das kostenlose Erstgespräch. Struktur und JS-Verhalten nur bei ausdrücklicher Anfrage ändern.

### Persönlichkeit

Media = YouTube Tech-Videos + LinkedIn. Struktur für weitere kuratierte YouTube-Einträge (lokales Thumbnail, Titel, Kurztext, Link-out) offenhalten. Siehe Seiten-Job oben. Zusätzlich: keine automatisierte Cross-Posting-Anzeige aus Instagram oder anderen Kanälen, die laut Marken-Positionierung nicht für den RAIS-B2B-Kontext vorgesehen sind.

### Trust-Sektion

Ehrlich bleiben. Verwenden: "Use Cases" beziehungsweise konkrete Prozesssprache, direkter Gründerzugang im Kontakt, sichtbare rechtliche Links. Keinen Beweis vortäuschen, keinen Partnerstatus behaupten.

## Visual Proof Guidance

Echte Screenshots nur, wenn Copy dazu passt. Platzhalter-Gradients sind für Integrationen in Ordnung, die keine gebrandete UI zeigen können.

**Ticker-Inhalt (proof strip):** ausschließlich EU-Infrastruktur- und Datenschutz-relevante Labels, keine Technologie-Markennamen als Selbstzweck. Beispiel: selbst gehostet in Deutschland, Datenbank in Frankfurt, AVV nach Art. 28 DSGVO, keine Datenweitergabe außerhalb der EU. Diese Labels sind für die Zielgruppe der eigentliche Beweis, nicht Werkzeugnamen wie n8n oder Supabase.

## Quality Check

Vor dem Ausliefern fragen:

- verkauft diese Seite eine einzige klare Sache?
- wirkt das glaubwürdig für einen skeptischen Makler-GF?
- ist der CTA konkret, und gibt es höchstens einen primären CTA pro Seite?
- wird Trust ehrlich behandelt?
- gibt es Gedankenstriche in sichtbarer Copy? (entfernen)
- ist jede angezeigte Zahl entweder direkt belegt oder vollständig aus Nutzereingaben berechnet?
- hat jede Seite einen Job, den keine andere Seite übernehmen könnte?

Scheitert die Antwort an einem dieser Punkte, vor dem Ausliefern überarbeiten.
