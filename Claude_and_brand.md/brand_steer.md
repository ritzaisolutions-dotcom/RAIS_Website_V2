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

**Änderung gegenüber Version 2:** RAIS ist die Marke. AMS ist ein Systemname im Portfolio, kein Flaggship-Brand. Home ist Unternehmensseite mit gewichtetem Live-Systeme-Teaser. Nur AMS hat eine Deep-Subpage.

```
Home (RAIS) ──┬── #systeme (AMS dominant + 5 Peers)
              ├── AMS (System-Verkaufsseite + Rechner)
              ├── Referenzen
              ├── Über uns
              ├── Persönlichkeit
              ├── So arbeiten wir (Footer / sekundär)
              └── Kontakt / Audit (Modul, kein Nav-Punkt)
```

Primäre Nav: Systeme · Referenzen · Über uns · Persönlichkeit · Audit buchen.

### Home

**Job:** Konversionsorientierte Landingpage. Lead-Magnet für Paid und organische Einstiege.

- Hero: Qualifizierungs-Claim (kein Anfragen-Problem, Qualifizierungs-Problem), Supporting, primär Audit, sekundär `#systeme`
- Tech-Stack-Ticker direkt unter dem Hero (n8n, Supabase, Cloud, CRM-Ökosystem); DSGVO-Fakten wandern als Chips in `#trust`
- `#zielgruppe`: Mit wem wir arbeiten, Passt / Passt nicht (Ausschluss: geringes Volumen, Franchise, keine Innovationsbereitschaft)
- `#warum-rais`: 2x2 Authority Grid (Enterprise-KI, Mehrwert statt Hype, EU-Infrastruktur, maßgeschneidert)
- `#aqut`: Flaggschiff, Sage-Vollfläche mit Leinen-Punktraster, 5-Schritt Icon-Flow, drei Benefits (20–35 Std/Woche, 15 Std auf 2 Min, Entlastung), CTA
- `#systeme`: hinter AMS, gegenläufiges Doppel-Marquee mit Spotlight-Cards (oranger Hover-Rahmen); Anker bleibt `#systeme`
- `#rechner`: Multi-Step-Wizard (Volumen → Telefon → Kostensatz → Ergebnis), client-only, kein CRM-Feld
- `#ablauf`: Discovery, Systemgespräch, Umsetzung ~4 Wochen, Betrieb im Retainer
- `#trust`: Gründerzugang plus DSGVO-Chips und Info-Kacheln; Haller-Teaser ausgeblendet bis Freigabe
- `#contact`: Abschluss-CTA als kostenlose Beratungsstunden (Klarheit wo KI Zeit, Geld und Sorgen spart)
- FAQ lebt auf der AMS-Seite, nicht auf Home

### AMS

**Job:** dieses eine System verkaufen. Absender bleibt RAIS.

1. Orientierungsclaim (20–35 Std-Formel aus brand.md), nicht als feste Garantie
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

- Sage, genau eine Sektion pro Seite darf als volle Blockfläche in Sage mit Warm-Linen-Text ausgeführt werden. Auf der Home-Seite ist das `#aqut` mit Leinen-Punktraster. Auf der AMS-Seite ist das die Use-Case- beziehungsweise Beweisfläche.
- Charcoal und Stone für Lesbarkeit

### Amendment 05.08.2026: British Racing Green als Leitfläche

British Racing Green (`#004225`) war bisher zweite Tinte, also ausschließlich Linien-, Label- und Markenfarbe. Ab jetzt trägt es auf der Startseite volle Flächen.

**Warum.** Cloud plus Serif plus Mandarin ist der am weitesten verbreitete Default-Look KI-nahe Seiten. Genau davor warnt die Typography Steering weiter unten, und dieselbe Logik gilt für die Fläche. Racing Green liefert die Kontrast-Tiefe, die eine Seite hochwertig wirken lässt, ohne in Dark-Tech-Theatrik zu kippen, und im DACH-KI-Beratungsfeld besetzt die Farbe niemand.

**Regel.** Der Bandwechsel trägt ab hier eine Aussage statt nur Rhythmus: helle Bänder sind der Kontext draußen, grüne Flächen sind „innerhalb der Grenze". Das deckt sich mit dem Kernversprechen „Kundendaten bleiben in der EU".

- Höchstens drei grüne Vollflächen pro Seite. Auf der Startseite: `#hero`, `#sicherheit`, `#contact`.
- Die Sage-Regel bleibt davon unberührt. Genau eine Sage-Vollfläche pro Seite, auf der Startseite weiterhin `#aqut`.
- Cloud und Warm Linen bleiben die Mehrheitsflächen. Kippt das Verhältnis, ist die Warm-Linen-Identität verloren.
- Auf grünem Grund trägt `--sage` (`#789464`) nur 3.4:1 und ist als Textfarbe unbrauchbar. Dafür gibt es `--sage-light` (`#9FB88C`, 5.4:1).
- Mandarin kommt auf Racing Green nur auf 3.7:1. Auf grünen Flächen deshalb keine Mandarin-Labels, Orange bleibt dort der Aktion vorbehalten. Ergänzt die bestehende Regel „Mandarin nie als Fließtextfarbe auf Cloud".

**Signature.** Topografische Höhenlinien als Untergrund der grünen Flächen, reine CSS-Gradients in `--sage-light` bei niedriger Deckkraft. Höhenlinien sind Vermessung, Gelände, Kataster, Grenzverlauf, also die Bildsprache von Grundstücken, und damit an der Referenzbranche Immobilien verankert. Sie ersetzen das frühere orange Quadratraster im Hero, das generisches Tech-Vokabular war. Statisch, ohne Parallax und ohne Entrance-Animation.

Akzent:

- Mandarin Orange ausschließlich für Aktion und Schlüsselbetonung, unter fünf Prozent Flächenanteil
- Mandarin nie als Fließtextfarbe auf Cloud, Kontrast dort grenzwertig

### Amendment 05.08.2026: Schrift auf Mandarin ist Charcoal, nicht Weiß

Primäre CTA trugen weiße Schrift auf `#EC6A37`. Das sind **3.14:1** und reißt die geforderten 4.5:1 auf jedem einzelnen Button, auf allen sechs Seiten inklusive Booking-Modal. Charcoal `#2F2A24` kommt auf **4.52:1**, im Hover auf `--orange-hover` sogar auf **5.20:1**.

Es gibt dafür den Token `--on-orange`. Jede Fläche in Mandarin nutzt ihn, nichts setzt Weiß direkt.

**Achtung: 4.52 ist knapp über der Grenze.** Wird `--orange` je aufgehellt, muss der Wert neu gerechnet werden. Die Alternative wäre gewesen, Mandarin auf `#C64E1A` abzudunkeln und Weiß zu behalten (4.66:1) — verworfen, weil das die Markenfarbe selbst verändert hätte.

Nebeneffekt, der zur Richtung passt: Charcoal auf Mandarin liest wärmer und gedruckter als der vorherige Weiß-auf-Bunt-Button, der nach generischem SaaS aussah.

Orange darf nicht zur dominanten Atmosphäre werden.

## Typography Steering

**Empfehlung, kein festgeschriebener Beschluss, bei Bedarf anpassen:**

Überschriften sollen editorial und kommerziell ernsthaft wirken, aber bewusst nicht die aktuell verbreitete Kombination aus kontrastreicher Display-Serif auf warmem Creme mit Terrakotta-Akzent verwenden, das ist gerade der Standard-Look KI-naher Websites und schwächt die Differenzierung genau der Marke, die "keine Lösung von der Stange" verkauft.

- Überschriften: eine **Text**-Serif statt Display-Serif, moderater Strichkontrast, sachlich. Kandidaten: Source Serif 4, Literata, Newsreader, lizenziert GT Alpina oder Freight Text.
- Fließtext: neutrale Grotesk, ausdrücklich nicht geometrisch, das schließt Poppins und Montserrat aus. Archivo oder Instrument Sans frei verfügbar, Söhne lizenziert.
- Mono-Cues erlaubt für kleine Labels (`mono-label`), zurückhaltende Systemmarker, unterstützende Rahmung. Mono darf nie zur dominanten Stimme werden, keine Mono-Headlines, kein Mono-Fließtext.

Deutsche Satzregeln: keine Versalien-Eyebrows (Deutsch hat Großbuchstaben in Substantiven, Versalsatz zerstört das Wortbild), typografische Anführungszeichen „so", keine Gedankenstriche in sichtbarer Copy.

**Amendment 05.08.2026, Fließtext entschieden:** Libre Franklin ist raus, **Instrument Sans** ist gesetzt (SIL OFL, self-hosted in `fonts/`). Libre Franklin ist ein Franklin-Gothic-Revival und liest als Behörden-Default. Instrument Sans ist enger proportioniert, wirkt bewusster gesetzt und konkurriert nicht mit der Serif. Nicht geometrisch, die Poppins- und Montserrat-Sperre bleibt eingehalten. Als Variable Font trägt eine Datei alle Gewichte 400 bis 700, statt vorher fünf statischer Schnitte.

Überschriften bleiben **Source Serif 4**, zusätzlich auf `letter-spacing: -0.018em` enger gestellt, weil die Serif in Displaygrößen sonst zu locker läuft. Genau zwei Sektionen pro Seite dürfen `.section-h2--anchor` tragen (größere Stufe); auf der Startseite sind das `#sicherheit` und `#systeme`.

## Modul-Regeln

### Hero (Home und AMS unterscheiden sich)

**Home-Hero** kommuniziert Zielgruppe und Kernversprechen in einer Zeile, filtert, verweist weiter. Kein Produktmenü im Hero.

**AMS-Hero** eröffnet mit dem Orientierungsclaim (20–35 Std-Formel) und führt zum Rechner. Umsatzargument als unterstützender Block erlaubt. Keine Gedankenstriche.

### Rechner (Home und AMS-Seite)

Interaktives Modul auf der Home-Landingpage und der AMS-Seite. Zweck: Schmerz quantifizieren, ohne unbelegte Behauptungen. Darstellung als Multi-Step-Wizard, nicht als Formular-Wand.

Schritte:

1. Anfragevolumen und Minuten pro Mail-Anfrage
2. Anteil Anfragen mit Mailbox-Nachtelefonat (%) und Minuten pro Mailbox-Nein-Anruf
3. Stundensatz, editierbares Vorschlagsfeld
4. Ergebnis: Std/Woche, Euro/Monat, Aufschlüsselung Mail vs. Telefon, CTA in den Audit

Berechnung: `emailHours = volume × minutes / 60`, `phoneHours = volume × (share% / 100) × phoneMinutes / 60`, Summe → Std/Woche und Euro/Monat, mit dem sichtbaren Zusatz „nach Ihren eigenen Angaben“. Kein CRM-Feld (CRM im Discovery-Call).

Keine Euro- oder Stundenzahl anzeigen, die nicht direkt aus den numerischen Eingaben berechnet ist. Keine Erfolgsgarantie einbauen, solange der zugehörige Wissensbasis-Eintrag auf Status Hypothese steht.

### Use Cases (auf der AMS-Seite, ehemals `#projekte`)

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

**Ticker-Inhalt (proof strip):** ausschließlich EU-Infrastruktur- und Datenschutz-relevante Labels, keine Technologie-Markennamen als Selbstzweck. Beispiel: selbst gehostet in der EU, Datenbank in Frankfurt, AVV nach Art. 28 DSGVO, Kundendaten bleiben in der EU. Diese Labels sind für die Zielgruppe der eigentliche Beweis, nicht Werkzeugnamen wie n8n oder Supabase.

**Korrektur vom 04.08.2026:** Die frühere Fassung nannte hier „selbst gehostet in Deutschland". Das war sachlich falsch, das Hosting läuft in Litauen. Verifizierter Stack: Hosting Litauen (EU), Datenbank AWS Frankfurt, Sprachmodell aus Frankreich. Auch „keine Datenweitergabe außerhalb der EU" war zu absolut formuliert, weil Notion (USA) die eigenen Anfragen von RAIS hält. Richtig ist die Abgrenzung „Kundendaten bleiben in der EU". Standort-Claims niemals ohne Abgleich mit `datenschutz.html` ändern.

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
