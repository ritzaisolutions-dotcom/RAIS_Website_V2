# RAIS Brand Guide

Version 3, Stand 05.08.2026. Ersetzt Version 2. Änderungen gegenüber früheren Fassungen sind an den betroffenen Stellen kurz begründet, damit die Historie nachvollziehbar bleibt.

**Was Version 3 ergänzt:** Das visuelle System ist am 05.08.2026 neu ausgerichtet worden. British Racing Green trägt jetzt volle Flächen, der Fließtext ist Instrument Sans, topografische Höhenlinien sind das Signature-Element, und die Schrift auf Mandarin ist Charcoal statt Weiß. Alle Werte stehen unten in **Color Palette**, **Typography Direction** und **Visual Direction**, die Umsetzungsregeln in `brand_steer.md`. Der Abschnitt **Kaskade und Dateizuständigkeit** am Ende ist neu und verhindert die häufigste Fehlerquelle beim Weiterbauen.

**Drei Dokumente, drei Fragen:**

| Datei | beantwortet |
|---|---|
| `brand.md` (dieses) | **was** gilt: Zielgruppe, Botschaft, Palette, Schriften, harte Regeln |
| `brand_steer.md` | **warum** und in welcher Dosierung: Flächenstrategie, Modulregeln, Anti-Ziele |
| `design-patterns.md` | **wie**: fertige Copy-Paste-Bausteine für Flächen, Karten, Animationen |

Das CSS dazu liegt als Pattern-Bibliothek am Ende von `styles/site-multipage.css` und lädt auf jeder Seite.

## Brand Summary

RAIS (Ritz AI Solutions) ist ein praktischer Automatisierungs-Partner für **Dienstleistungsunternehmen**: Makler, Agenturen, Beratungen. Wiederkehrende Anfragen, Nachfassen und Übergaben laufen durch Systeme, nicht durch den Inhaber.

RAIS soll nicht wie ein AI-Lab, eine Trend-Agentur oder eine vage Digitalberatung wirken. Die Marke soll ruhig, kompetent, kommerziell nützlich und in echten Arbeitsabläufen verankert wirken.

**Änderung September 2026 (VSL-Startseite):** Der ICP ist **Dienstleistungsunternehmen**. Die Startseite führt mit „Dienstleister“, dann zählt sie die Segmente auf. Eine Aktion: Audit buchen. Käufer im Audit: Inhaber / Geschäftsführer (der Engpass). Handwerk und Handel sind keine geführten Branchenbänder.

## Audience

**Zielgruppe (ICP), verbindlich:**

Dienstleistungsunternehmen mit wiederkehrendem Anfrage- und Vorgangsvolumen.

**Aufzählung auf der Startseite (Reihenfolge):**

1. **Makler und Immobilienberatung** — schärfstes Schmerzbeispiel, laufende Referenz Haller
2. **Agenturen** (Marketing, Web, SEO, Content)
3. **Beratungen und Coaching** mit wiederkehrendem Intake

Eyebrow-Muster: `Für Dienstleister: Makler, Agenturen, Beratungen` — Frame zuerst, Liste danach. Nicht drei gleichrangige Marken im Hero.

Weitere Dienstleister im Einzelfall, wenn Anfragen, Onboarding oder Support Volumen haben. Ablehnen, wenn kein echter Mehrwert erkennbar ist.

**Zielperson im Audit:** Inhaber / Geschäftsführer, der selbst der Engpass ist (zeitknapp, oft nicht-technisch).

**Harte Ausschlusskriterien:**

- Einzelkämpfer ohne Team und ohne Volumen
- Betriebe ohne wiederkehrende Prozesse
- Auftraggeber, die nur Strategiepapiere wollen und keine Umsetzung
- Keine Bereitschaft zu klaren Freigaben und Verantwortlichkeiten

**Qualifizierende Merkmale, in Reihenfolge der Wichtigkeit:**

1. Wiederkehrende Anfragen oder Vorgänge mit spürbarem Volumen
2. Team oder klare Übergabe an Menschen im Ablauf
3. Bestehende Tools und CRMs, oder Bereitschaft, eines einzuführen
4. Offenheit für Automatisierung und Datenverantwortung

**Merkmale der Zielperson:**

- oft nicht-technische Betreiber, keine Entwickler
- zeitknapp
- skeptisch gegenüber Hype und SaaS-Ballast
- legen Wert auf Reaktionsgeschwindigkeit, saubere Akten, keine verlorenen Anfragen

Copy: kurz, ergebnisorientiert, Schmerz im ersten Satz. Kein Mittelstands-Absatz.

## USP und Kernbotschaft

Ergänzt am 04.08.2026. Steht über allen Detailformulierungen in diesem Dokument.

> **Enterprise-Sicherheit ohne Enterprise-Overhead.**

Die Leitidee: RAIS bringt die Disziplin, die große Anbieter mitbringen, ohne den Apparat, den sie mitbringen. Sicherheit, Verträge, definierte Freigabepunkte und dokumentierte Übergabe, aber ohne Procurement-Zyklen, Lizenzstaffeln, Governance-Boards und Beraterstab.

**Haltung dahinter:** Der Markt verkauft KI-Hype und vernebelt, was tatsächlich Mehrwert schafft. RAIS verkauft keine KI, sondern Ergebnisse. Nicht „Shareholder Value", sondern echte Zeit und echtes Geld für das Unternehmen des Kunden.

**Freigegebene Sätze:**

- „Wir verkaufen keine KI, wir bieten Ihnen Ergebnisse."
- „Klare Systeme, die Ihrem Unternehmen echte Probleme lösen."
- „Sie kaufen keine KI. Sie kaufen den Freiraum, endlich ans Wachsen denken zu können." (steht auf der Startseite unmittelbar vor dem CTA)

**Der Beleg, verifiziert am 04.08.2026:**

| Ebene | Standort |
|---|---|
| Hosting | Litauen (EU) |
| Datenbank | AWS Frankfurt |
| Sprachmodell | Frankreich |
| Auftragsverarbeitung | AVV nach Art. 28 DSGVO |

Ein durchgehender EU-Stack bis hinunter zum Modell ist das eigentliche Differenzierungsmerkmal. Der Normalfall im Markt ist eine Pipeline, die für jeden Prompt Kundendaten an einen US-Anbieter schickt.

**Freigegebene Zusagen, ergänzt am 05.08.2026:**

- **Zeitangabe:** „Ein erstes System geht typischerweise in vier bis sechs Wochen live." Eine Aussage über den eigenen Prozess, kein Kundenbeleg. Erscheint im FAQ und als Dauer im Ablauf.
- **Risikoumkehr:** „Wir definieren messbare Kriterien vor Projektstart. Werden sie nicht erreicht, passen wir nach, ohne zusätzliche Beratungshonorare." Steht als eigenes Band unmittelbar vor dem Kontaktmodul.
- **Preisfrage:** wird beantwortet, nicht übergangen. Kein öffentlicher Preis, aber die Begründung und die drei Faktoren, die den Rahmen bestimmen. Weiterhin **keine Zahl**.

**Tech-Streifen, Ausnahme zur Ticker-Regel:**

Der Proof-Ticker bleibt frei von Technologie-Markennamen, `brand_steer.md` gilt unverändert. Er steht seit dem 05.08.2026 unter der Systemakte, die Logos haben dafür den Platz direkt unter dem Hero. Begründung: ein Textlauf wird nicht gelesen, Logos tragen Wiedererkennung. Die DSGVO-Labels wurden dabei nicht gestrichen, nur verschoben.

Der Logo-Streifen folgt dem Datenfluss:

- „Worauf Ihre Systeme laufen" — im Einsatz, innerhalb der EU
- „Auf Wunsch anbindbar" — Fähigkeit, kein Bestandsanspruch
- „Womit wir entwickeln" — sieht keine Kundendaten

**Geändert am 05.08.2026:** Der Streifen läuft jetzt als durchgehender Logostrom, die drei Überschriften erscheinen nicht mehr. Die Gliederung bleibt als Datenstruktur in `scripts/techstack-data.mjs` bestehen und ist weiterhin die Prüfliste, sie ist nur nicht mehr sichtbar.

**Damit im Strom keine Aussage kippt, trägt jedes Logo seine Einordnung im eigenen `meta`.** Ohne die Überschrift „Auf Wunsch anbindbar" liest ein blankes „EU-Region" neben Azure wie Standard-Infrastruktur, deshalb steht dort „auf Wunsch, EU-Region". Ohne „Sieht keine Kundendaten" fiele die wichtigste Einschränkung der Werkbank weg, deshalb „nur Entwicklung" statt „Entwicklung". **Wer diese `meta`-Texte kürzt, nimmt die Aussage weg.**

Der Lauf hält bei Hover und Tastaturfokus an, weil ein Logo, das man nicht fixieren kann, keine Wiedererkennung trägt. Bei `prefers-reduced-motion` steht der Streifen still und ist stattdessen selbst scrollbar.

**Zwei Fragen, die nicht verwechselt werden dürfen:**

1. Verarbeitet ein Anbieter Daten von **Besuchern dieser Website**? Dann gehört er in `datenschutz.html`.
2. Ist ein Anbieter Teil dessen, was wir **für Kunden bauen**? Dann gehört er in den AVV mit dem jeweiligen Kunden, **nicht** in die Datenschutzerklärung dieser Website.

Ein Logo im Streifen ist eine Aussage über die Bauweise, keine Offenlegung einer Website-Verarbeitung. Der Schalter `listed` in `scripts/techstack-data.mjs` ist deshalb kein Rechts-Gate, sondern dient nur dazu, nichts zu zeigen, was nicht tatsächlich im Einsatz ist.

Dazu der Satz, der die Ausnahme benennt und die Entscheidung beim Kunden lässt: „Wo Sie es ausdrücklich wünschen und die Daten nicht sensibel sind, binden wir auch Modelle außerhalb der EU an. Diese Entscheidung treffen Sie, nicht wir."

**Harte Regeln für diese Botschaft:**

- **Keine Zertifizierungen behaupten.** Kein ISO 27001, kein SOC 2, kein TISAX, auch nicht als Ankündigung. Nur nachprüfbare Praktiken.
- **Kein Preisrahmen.** Der Overhead-Teil der USP wird über Vendor-Lock-in, Procurement und Abhängigkeit belegt, nicht über Zahlen.
- **Das Wort „KI" nicht im Hero.** Es widerspricht „Wir verkaufen keine KI" und `brand.md` untersagt ohnehin, den Begriff zu überstrapazieren.
- **Keine aktive Content-Security-Policy behaupten.** Die CSP in `vercel.json` läuft als `Content-Security-Policy-Report-Only`.
- **Standort-Claims nur mit Abgleich gegen `datenschutz.html`.** Das Sprachmodell darf erst genannt werden, wenn der Anbieter dort als Auftragsverarbeiter geführt wird.
- **Präzision statt Absolutheit:** „Kundendaten bleiben in der EU", nicht „keine Datenweitergabe außerhalb der EU". Notion (USA) hält die eigenen Anfragen von RAIS, keine Kundendaten.

## Positioning

Verkauft wird **weniger manuelle Bearbeitungszeit und mehr gebuchte Erstgespräche**, nicht abstrakte KI.

RAIS verkauft nicht:

- KI um ihrer selbst willen
- öffentliche Chatbot-Spielereien als Hauptprodukt
- Startup-Sprache
- generische "digitale Transformation"
- ein Menü unzusammenhängender Leistungen
- offizielle Portal-Partnerschaften ohne Vertrag

RAIS verkauft:

- schnellere Bearbeitung von Portal- und E-Mail-Anfragen
- automatische Qualifizierung und Terminbuchung, direkt in den bestehenden Kalender
- Übersicht über alle Anfragen und Termine an einem Ort
- Systeme ohne teuren wiederkehrenden SaaS-Lock-in, wo möglich

## Marken-Hierarchie und Live-Systeme

**RAIS** ist die Marke und der Absender (Logo, Home, Navigation).

**AMS** ist nur der Name eines Angebotssystems unter RAIS (Anfragen-Management-System), keine eigene Brand. Es darf auf einer Deep-Subpage ausführlich erklärt werden. Die Startseite zeigt RAIS als Unternehmen und teasert Live-Systeme, ohne AMS zur Produktmarke zu machen.

**Live-Systeme im Portfolio (Home, gewichtet):**

1. **AMS** (dominant, Deep-Page) – Anfragen qualifizieren und Termine buchen
2. **Onboarding WFS** (Kontext: Makler)
3. **Lead Scraping LMLF** (Kontext: Makler)
4. **CRM** (Kontext: Makler)
5. **Habit-Tracker mit Performance Report** (Kontext: Intern)
6. **Agentic AI Content Creation** (Kontext: Content)

Nur AMS hat eine eigene Verkaufsseite. Die übrigen fünf erscheinen auf der Home als leichtere Teaser.

## Angebotssystem AMS

**AMS** steht für **Anfragen-Management-System**. Verwendung in Angeboten, Pitches und auf `/aqut.html`.

**Paket 1, das verkaufte Kernprodukt:**

- Automatische Qualifizierung eingehender Portalanfragen (aktuell ImmoScout24 per E-Mail)
- Kauf/Miete-Erkennung, automatische Rückfrage bei fehlenden Angaben
- Personalisierter Terminbuchungslink für den Interessenten
- Direkte Kalenderintegration (aktuell Outlook / Microsoft Graph)
- Übersichts-Dashboard mit Anfragen und Terminen pro Objekt
- Intelligente Datenbanksuche über alle Leads

**Paket 2, die Erweiterung, erst nach stabilem Go-Live von Paket 1:**

- Besichtigungstermin-Buchung
- Digitale Mieterselbstauskunft
- Vergleichsansicht für Bewerbungen/Anfragen

Diese Zweiteilung gehört sichtbar auf die Website. Sie erklärt gleichzeitig das Produkt und den Grund für eine fortlaufende Zusammenarbeit, ohne wie ein Leistungsmenü zu wirken.

## Primärer und sekundärer CTA

Primär, über die gesamte Website: **Kostenlosen Audit buchen**

Sekundär, zur Orientierung: **AMS ansehen** beziehungsweise, je nach Seite, **Use Cases ansehen**

Kein fester öffentlicher Preis auf der Website, solange nicht ausdrücklich wieder eingeführt. Das Setup-Preismodell befindet sich aktuell in Erprobung (siehe Wissensbasis, Testmodell niedrigeres Setup plus volumenbasierte Retainer-Tiers), daher keine Zahl festschreiben.

## Proof und Use Cases

Use Cases werden als **konkrete Arbeitsabläufe** dargestellt, nicht als generische Portfolio-Stücke, und leiten sich direkt aus Paket 1 ab:

1. Automatische Antwort und Qualifizierung bei Inseratsanfragen (ImmoScout24 per E-Mail, n8n)
2. Automatische Terminbuchung mit direkter Kalenderintegration
3. Übersichts-Dashboard und intelligente Datenbanksuche

Keine Andeutung von Kundenlogos oder Portal-Partnerschaften ohne Erlaubnis.

**Referenz:** Haller Immobilienberatung GmbH: öffentliche Nennung auf der Startseite ist bis zur Freigabe ausgeblendet. `referenzen.html` und der Nav-Punkt bleiben. Sobald Freigabe und belastbare Kennzahl aus dem Live-Betrieb vorliegen, wird die Case Study freigeschaltet. Bis dahin keine unbelegten Zahlen zu diesem oder einem anderen Kunden verwenden.

## Trust Baseline

Immer enthalten:

- Impressum
- Datenschutz
- Cookie-Banner / Consent-Tooling (Klaro)
- AVV-Hinweis gemäß Art. 28 DSGVO, EU-Serverstandorte klar benannt

Trust darf nicht als Fußzeilen-Nachgedanke versteckt werden.

## Brand Personality

Die Marke soll wirken:

- direkt
- geerdet
- reif
- kommerziell ernsthaft
- warm, ohne weich zu klingen
- selbstbewusst, ohne laut zu klingen

Die Marke soll nicht wirken:

- futuristisch
- verkäuferisch
- überproduziert
- wie generisches SaaS
- wie eine vage "Full-Service-Agentur"
- hype-getrieben

## Color Palette

**Grundpalette, unverändert:**

| Rolle | Hex | Token |
|---|---|---|
| Primärakzent / Mandarin Orange | `#EC6A37` | `--orange` |
| Akzent-Hover / Soft Mandarin | `#F37A48` | `--orange-hover` |
| Basis-Hintergrund / Cloud | `#F5F2EC` | `--background` |
| Fläche / Warm Linen | `#FBF8F3` | `--surface` |
| Sage | `#789464` | `--sage` |
| British Racing Green | `#004225` | `--racing-green` |
| Charcoal-Text | `#2F2A24` | `--charcoal` |
| Gedämpfter Text / Stone | `#7B746B` | `--stone` |
| Border | `#D9D1C7` | `--border` |

**Ergänzt am 05.08.2026, weil Racing Green jetzt volle Flächen trägt.** Auf dunklem Grund funktionieren mehrere Farben der Grundpalette nicht mehr, dafür gibt es diese Tokens:

| Rolle | Hex | Token |
|---|---|---|
| Verlaufsboden, Sektionskanten | `#002A18` | `--green-900` |
| Grüne Basisfläche | `#004225` | `--green-800` |
| Kartenfläche auf Grün | `#0A5231` | `--green-700` |
| Text auf Grün | `#FBF8F3` | `--linen-on-green` |
| Akzent und Labels auf Grün | `#9FB88C` | `--sage-light` |
| Haarlinien auf Grün | `rgba(251,248,243,0.14)` | `--rule-on-green` |
| Kartenfüllung auf Grün | `rgba(251,248,243,0.06)` | `--fill-on-green` |
| Fokusring auf Grün | `rgba(159,184,140,0.55)` | `--focus-on-green` |
| Schrift auf Mandarin | `#2F2A24` | `--on-orange` |

## Color Usage

- Cloud und Warm Linen dominieren die Grundatmosphäre und bleiben die Mehrheitsflächen
- Charcoal und Stone tragen Hierarchie und Lesbarkeit
- **British Racing Green ist seit 05.08.2026 Leitfläche, nicht mehr nur zweite Tinte.** Höchstens drei grüne Vollflächen pro Seite. Der Bandwechsel trägt damit eine Aussage statt nur Rhythmus: helle Bänder sind der Kontext draußen, grüne Flächen sind „innerhalb der Grenze". Das deckt sich mit „Kundendaten bleiben in der EU".
- Sage bleibt davon unberührt: genau **eine** Sage-Vollfläche pro Seite, auf der Startseite `#aqut`
- Orange ist Akzent, nicht Seitenhintergrund, weiterhin unter fünf Prozent Flächenanteil
- Token: `--pistachio` bleibt als Alias auf `--racing-green`

**Kontrastgrenzen, nachgerechnet am 05.08.2026. Nicht schätzen, diese Werte gelten:**

| Paarung | Ratio | Verwendung |
|---|---|---|
| Linen `#FBF8F3` auf Grün | 10.98 | Fließtext auf Grün |
| `--sage-light #9FB88C` auf Grün | 5.38 | Labels, Links, Akzente auf Grün |
| `--sage #789464` auf Grün | **3.44** | **unbrauchbar**, deshalb gibt es `--sage-light` |
| Mandarin auf Grün | **3.70** | **unbrauchbar für Kleintext.** Auf grünen Flächen keine Mandarin-Labels, Orange bleibt dort der Aktion vorbehalten |
| `--on-orange #2F2A24` auf Mandarin | 4.52 | alle primären CTA |
| `--on-orange` auf `--orange-hover` | 5.20 | Hover-Zustand |
| Weiß auf Mandarin | **3.14** | **war der Zustand bis 05.08.2026, verstieß auf jedem CTA gegen 4.5** |

**Zwei Warnungen:**

1. **4.52 ist knapp über der Grenze.** Wird `--orange` je aufgehellt, reißt die Schrift auf allen CTA sofort. Dann neu rechnen. Die verworfene Alternative war, Mandarin auf `#C64E1A` abzudunkeln und Weiß zu behalten (4.66), das hätte aber die Markenfarbe selbst verändert.
2. **Nichts setzt Weiß direkt auf eine Mandarin-Fläche.** Immer `--on-orange`. Das gilt auch für Hover-Zustände, Pseudo-Elemente wie Schrittzähler und Verlaufsflächen, dort sind die Verstöße zuletzt übersehen worden.

## Typography Direction

Typografie soll wirken:

- hochwertig
- lesbar
- editorial, nicht techy
- selbstbewusst ohne Aggressivität

Vermeiden:

- futuristische Schriften
- Dev-Tool-Ästhetik als Hauptstimme
- übermäßig geometrische Startup-Typografie

**Entschieden am 05.08.2026, vorher offen:**

| Rolle | Schrift | Token |
|---|---|---|
| Überschriften | **Source Serif 4** | `--serif` |
| Fließtext | **Instrument Sans** | `--sans` |
| Kleine Labels | **JetBrains Mono** | `--mono` |

Alle drei self-hosted in `fonts/`, keine Anfrage an Google zur Laufzeit.

**Warum Instrument Sans statt Libre Franklin:** Libre Franklin ist ein Franklin-Gothic-Revival und liest als Behörden-Default. Instrument Sans ist enger proportioniert, wirkt bewusster gesetzt und konkurriert nicht mit der Serif. Nicht geometrisch, die Sperre gegen Poppins und Montserrat bleibt eingehalten. Als Variable Font trägt **eine Datei alle Gewichte 400 bis 700**, statt vorher fünf statischer Schnitte. SIL Open Font License.

**Warum Source Serif 4 bleibt:** eine Text-Serif, ausdrücklich keine Display-Serif. Die verbreitete Kombination aus kontrastreicher Display-Serif auf warmem Creme mit Terrakotta-Akzent ist der Standard-Look KI-naher Websites und schwächt genau die Marke, die „keine Lösung von der Stange" verkauft.

**Satzregeln:**

- Serif-Überschriften laufen auf `letter-spacing: -0.018em`, sonst wirken sie in Displaygrößen zu locker
- Genau **zwei** Sektionen pro Seite dürfen die größere Stufe `.section-h2--anchor` tragen. Auf der Startseite `#sicherheit` und `#systeme`, also die zwei Fragen, die ein Mittelstands-Geschäftsführer tatsächlich stellt
- Mono nur für kleine Labels. Keine Mono-Headlines, kein Mono-Fließtext
- Keine Versalien-Eyebrows. Deutsch hat Großbuchstaben in Substantiven, Versalsatz zerstört das Wortbild

Weitere Details in `brand_steer.md`.

## Messaging Principles

Copy soll sein:

- konkret
- glaubwürdig
- ergebnisorientiert
- auf der Website standardmäßig deutsch
- **ohne Gedankenstriche (—)** in nutzersichtbarem Text

Copy soll nicht:

- das Wort KI überstrapazieren
- allen alles versprechen
- auf vage Wachstumssprache setzen
- Statistiken ohne Beleg erfinden
- ImmoScout24 als Partner darstellen

**Orientierungsclaim (AMS, verbindliche Formel):** „Bei hohem Anfragevolumen oft im Bereich von 20 bis 35 Stunden pro Woche, abhängig von Ihrem Volumen.“ (Herleitung: Platzhalter, Kevin liefert die Zahlenbasis.) Der Rechner personalisiert darunter. Claim und Rechner-Ergebnis dürfen nicht als dieselbe Zahl behauptet werden.

**Speed-to-Lead-Claim (AMS):** Erstreaktion von durchschnittlich 15 Stunden auf 2 Minuten. (Herleitung: Platzhalter, Kevin liefert die Zahlenbasis.)

## Messaging Pillars

Immer wieder aufgreifen:

- weniger verlorene Inseratsanfragen
- schnellere Erstreaktion
- ein Abschluss refinanziert das System, nicht nur Zeitersparnis rechtfertigt den Preis
- Systeme statt Copy-Paste zwischen Tools
- messbares Setup, kein unnötiger SaaS-Ballast

**Änderung gegenüber Version 1:** Das Umsatzargument (ein Abschluss bringt einen fünfstelligen Betrag, das System refinanziert sich mit dem ersten geretteten Abschluss) ist jetzt das primäre Argument auf der AMS-Seite, Zeitersparnis ist ein unterstützender Beleg, nicht die Hauptaussage. Grund: Umsatzverlust ist für den Ziel-GF schmerzhafter als Personalkosten.

## Quantifizierung von Schmerz, nur mit eigenen Angaben

Wird auf der AMS-Seite oder der Home-Landingpage ein interaktiver Rechner eingesetzt, gilt zwingend:

- Jede angezeigte Zahl muss vollständig aus Eingaben des Besuchers berechnet sein (Anfragevolumen, Minuten pro Mail, Mailbox-Telefonanteil, Minuten pro Nein-Anruf, Stundensatz).
- Der Rechner ist ein Multi-Step-Wizard (Volumen → Telefon-Nacharbeit → Kostensatz → Ergebnis), client-only, ohne Kontaktdaten.
- Formel: Mailstunden plus Telefon-Nacharbeitsstunden → Std/Woche und Euro/Monat „nach Ihren eigenen Angaben“.
- Kein CRM-Feld im Rechner; CRM wird im Discovery-Call geklärt.
- RAIS behauptet nie selbst eine Zahl über den Besucher oder sein Büro.
- Kalkulierte Ausgaben sind erlaubt und erwünscht, unbelegte oder von RAIS angenommene Ausgaben nicht.

Details zum Rechner-Konzept liegen im separaten Design-Dokument zur Website-Architektur.

## Visual Direction

Die Website soll wie ein hochwertiger kommerzieller Partner wirken, nicht wie eine Startup-Landingpage.

Verwenden:

- warmer Weißraum
- zurückhaltender Kontrast
- klare Sektionsabstände
- beweisorientierte Layouts
- ruhige Ernsthaftigkeit

Vermeiden:

- Dashboard-Fantasie
- Neon- oder Sci-Fi-Stilistik
- generische AI-Agentur-Signale
- dekoratives Rauschen ohne Zweck

### Signature: topografische Höhenlinien

Ergänzt am 05.08.2026. Das eine Element, an dem die Seite wiedererkannt wird.

Höhenlinien aus gestapelten `radial-gradient`-Ringen liegen als Untergrund auf den grünen Flächen und im Hero, gezeichnet in `--sage-light` bei niedriger Deckkraft (0.15 auf Bändern, 0.30 im Hero, wo das Foto konkurriert).

**Warum das und nichts anderes:** Höhenlinien sind Vermessung, Gelände, Kataster, Grenzverlauf. Die Referenzbranche ist Immobilien, das ist buchstäblich die Bildsprache von Grundstücken. Sie tragen das Versprechen „Kundendaten bleiben in der EU" visuell, ohne es zu behaupten. Sie ersetzen das frühere orange Quadratraster im Hero, das generisches Tech-Vokabular war.

**Regeln dazu:**

- statisch, kein Parallax, keine Entrance-Animation
- reine CSS-Gradients, kein Canvas, kein WebGL, keine Dependency
- auf schmalen Viewports enger stellen, sonst stehen nur wenige große Bögen im Bild
- der Kühnheits-Etat der Seite ist damit ausgegeben, alles andere bleibt ruhig

### Tiefe

Der Eindruck von Hochwertigkeit kommt aus geschichteter Tiefe, nicht aus lauteren Farben.

- Radien: `--radius-sm 0.7rem`, `--radius-md 1.1rem`, `--radius-lg 1.5rem`. Bewusst **keine** Pillen-Radien um 60px, das ist der SaaS-Look
- Karten auf hellem Grund tragen die charcoal-getönten Schatten, Karten auf Grün tragen **keinen Schatten**, sondern Haarlinie plus Füllung. Schatten auf dunklem Grund sind unsichtbar und nur Ballast
- Grüne Flächen dunkeln an Ober- und Unterkante leicht nach `--green-900` ab. Ein Verlauf Grün nach Cloud wird matschig, eine harte Kante bei diesem Kontrast liest präzise
- Das globale Papierkorn blendet mit `multiply` und trägt auf dunklem Grund nichts. Grüne Flächen bekommen dieselbe Körnung noch einmal, aber aufhellend mit `screen`, sonst wirken sie flacher als die Papierbänder daneben

### Bewegung

- Bewegung muss argumentieren, nicht schmücken. Der Datenfluss-Puls im Architekturbild läuft an der EU-Grenze sichtbar gegen die Wand, das ist eine Aussage
- Reveals laufen **einmal**, nicht in Schleife, und blenden ganze Blöcke ein statt Eintrag für Eintrag. Fünfzehn gestaffelte Einzelreveals sind dekorative Bewegung ohne Verkaufszweck
- Jede Animation hat einen Ausstieg für `prefers-reduced-motion`. **Der Inhalt darf nie an der Animation hängen.** Wenn Bewegung aus ist, steht alles sofort sichtbar da
- Kein Parallax, kein Marquee mit Text, keine Aurora-Verläufe, kein Glassmorphismus als Effekt um seiner selbst willen

### Referenzen und Fremdkomponenten

Das Projekt ist **Vanilla HTML mit Vite**. Kein React, kein TypeScript, kein shadcn, keine `components.json`. Tailwind ist installiert, aber mit rund 7 KB Output faktisch ungenutzt, die eigentliche Gestaltung liegt in handgeschriebenem CSS.

Fertige Komponenten von Plattformen wie 21st.dev sind deshalb **Referenz, keine Installationsquelle**. Der Ablauf ist: Technik lesen, in Vanilla nachbauen, Inszenierung weglassen. Eine React-Komponente mit `framer-motion` einzubinden hieße, eine ganze Toolchain für einen Effekt zu installieren.

Übernommen wurden bisher: die Höhenlinien-Technik aus `halide-topo-hero`, das Darstellungsmuster aus `animated-card-diagram` für das Architekturbild, und die Endlosschleife aus `InfiniteSlider` für den Logostreifen. Jeweils die Mechanik, nie die Palette oder die Effekt-Inszenierung.

## Offer- und CTA-Guidance

Die Startseite ist die Unternehmensseite von RAIS (Hero, Trust, Referenzen-Teaser, gewichtetes System-Portfolio, ICP). Die AMS-Seite vertieft ein System. Paket 2 erscheint dort als Ausblick, nicht als zweites Angebot.

CTAs sollen den Wert des Gesprächs erklären. Schwaches Erlaubnis-Einholen ("Klingt das interessant?") ist untersagt.

## Quality Standard

Wenn eine Seite plausibel zu jedem beliebigen Freelancer, jeder Agentur oder jedem SaaS-Berater passen könnte, ist sie nicht spezifisch genug.

**Geändert gegenüber Version 1:** Der frühere Zusatz, eine reine Immobilien-Ausrichtung sei "zu eng", ist gestrichen. Die volle, unverwässerte Fokussierung auf Immobilienmakler ist jetzt der Qualitätsstandard, nicht ein Risiko, das abgefedert werden muss.

**Prüffragen pro Sektion, vor dem Ausliefern:**

- **Klarheit:** ist die Aussage in unter fünf Sekunden erfasst, auch auf 375px?
- **Relevanz:** trägt jedes Strukturmittel eine Information, oder ist es Dekor? Nummerierungen nur, wo es wirklich eine Reihenfolge gibt.
- **Autorität:** ist jede Zahl belegt oder aus Nutzereingabe abgeleitet, und wirkt die Sektion ruhiger als die Konkurrenz statt lauter?

Sektionen, die an einem der drei scheitern, werden zurückgebaut statt aufgehübscht.

## Kaskade und Dateizuständigkeit

Ergänzt am 05.08.2026. Rein technisch, aber ohne diese Regeln geht bei jeder Designänderung Zeit für dieselben vermeidbaren Fehler drauf.

### Wo eine Regel hingehört

**Das Inline-`<style>` in `index.html` steht nach allen verlinkten CSS-Dateien und gewinnt damit bei gleicher Spezifität.** Das ist die häufigste Falle: eine neue Regel in `styles/home.css` sieht korrekt aus, greift aber nicht, weil `index.html` denselben Selektor weiter unten noch einmal definiert.

Faustregel:

- **Neue Klassen** (`.home-band--green`, `.topo-lines`) → `styles/home.css`, kein Konflikt möglich
- **Höhere Spezifität** (`.home-band--green .kontrakt`) → `styles/home.css`, gewinnt ohnehin
- **Gleiche Spezifität wie eine bestehende Inline-Regel** (`.section-h2`, `.mono-label--contact::before`, `.cal-load-btn`) → **muss ins Inline-`<style>` von `index.html`**
- Nie beides. Zwei Wahrheiten driften auseinander.

Betroffen sind unter anderem `#contact`, `.cal-load-btn`, `.sticky-cta-btn`, `.bm-btn-next`, `.trust-load-btn`, `.section-h2`, `.mono-label`. Diese Selektoren existieren doppelt.

### Tokens liegen doppelt

Der `:root`-Block existiert zweimal: in `styles/site-multipage.css` und im Inline-`<style>` von `index.html`. **Ein neuer Token muss an beide Stellen.** Sonst sehen Startseite und Unterseiten unterschiedlich aus.

### Welche Dateien man nicht direkt editiert

| Datei | Quelle |
|---|---|
| `aqut.html`, `referenzen.html`, `zusammenarbeit.html`, `ueber-uns.html`, `persoenlichkeit.html` | `scripts/build-pages.mjs` |
| Nav, Footer, Booking-Modal auf allen Seiten | `scripts/page-shell.mjs` |
| Bereiche zwischen `systemakte:start/end`, `faq:start/end`, `techstack:start/end` in `index.html` | `scripts/sync-index-shell.mjs` plus die Datenmodule |
| Inhalte des Logostreifens, der Systemakte, der FAQ, des Changelogs | `scripts/*-data.mjs` |

`npm run dev` und `npm run build` führen die Generatoren vorher aus. Änderungen direkt in den generierten Dateien sind beim nächsten Start weg.

`sync-index-shell.mjs` bricht hart ab, wenn ein Marker oder die Grenze `<!-- MAIN CONTENT` / `<main` fehlt. Die Kommentare nicht löschen.

### Weitere Stolpersteine

- **`styles/home.css` wird nur von `index.html` geladen.** Home-Klassen funktionieren auf den Unterseiten nicht.
- **Neue CSS-Dateien** müssen in `scripts/page-shell.mjs` (`headHtml`) **und** in `scripts/postbuild-copy.mjs` (`copyTargets` und `sharedStyles`) eingetragen werden, sonst fehlen sie im Build.
- **Tailwind scannt nur `./*.html`,** nicht `scripts/*.mjs`. Tailwind-Klassen im generierten Markup werden weggeworfen.
- **Reveal-Orchestrierung:** `index.html` hat eine eigene, kuratierte Reveal-Steuerung im Inline-Script. `scripts/scroll-motion.js` macht ausschließlich `.arch` und `.kontrakt`. Beide getrennt lassen, ein zweiter Observer auf `.reveal` streitet sich mit dem ersten um dieselben Elemente.
- **Kontrast prüft man im Browser und im CSS.** Ein Browser-Audit findet keine Hover-Zustände, keine Pseudo-Elemente und keine Verlaufsflächen, weil deren `backgroundColor` transparent ist. Beides laufen lassen, sonst bleiben Verstöße stehen.
