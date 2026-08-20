# KI-Roadmap — vor dem Reel-Link

Seite: `/ai-roadmap.html`
Cal-Event nur auf dieser Seite: `https://cal.com/ritzaisolutions/immo-ai-roadmap`
Dauer überall: **60 Minuten**.
Alte URL `/makler.html` leitet per 301 um.

> Das Markup dieser Seite wird von `scripts/build-pages.mjs` erzeugt.
> Änderungen direkt in `ai-roadmap.html` überlebt der nächste
> `npm run pages` nicht.

## Was die Seite verspricht

Diese drei Zusagen stehen jetzt auf der Seite und sind bindend. Wer sie
ändert, ändert ein Angebot, keinen Text:

1. 60 Minuten, kostenlos, mit schriftlicher Roadmap, die der Interessent
   behält, auch ohne Zusammenarbeit.
2. Das Gespräch wird aufgezeichnet und als YouTube-Beitrag
   veröffentlicht. Keine Mandantendaten, keine Objektadressen, keine
   Umsatzzahlen im Video. Der Kunde sieht den Schnitt vor der
   Veröffentlichung und kann die Freigabe auch danach zurückziehen.
   Wer nicht aufgezeichnet werden will, meldet sich vorher per Mail und
   bekommt das Gespräch trotzdem.
3. Laufzeit zwölf Monate, dazu die **Ausstiegsgarantie**: Sind die
   vorher gemeinsam festgelegten Ergebnisse nach drei Monaten nicht
   erreicht, kommt der Kunde ohne Haken aus dem Vertrag und muss das
   nicht begründen. Keine Rückerstattung der Retainer, nur der
   Ausstieg. Die Garantie ist die Gegenleistung für den Beitrag.

**Kein öffentlicher Preis.** Die früher hier veröffentlichten
`ab 3.000 Euro` / `ab 1.000 Euro` sind entfernt: sie widersprachen
`brand.md` und FAQ #9 der Startseite.

## Cal.com Dashboard (P1, manuell)

Diese Felder liegen nicht im Repo. Ohne sie bleibt das Widget bei `1h` und englischen Systemtexten.

1. Event-Type `immo-ai-roadmap`
2. Dauer: 60 Minuten
3. Titel: `KI-Roadmap`
4. Locale: Deutsch
5. Beschreibung (ersetzen):

```
Eine Stunde, kostenlos, ohne Verkaufsdruck.

Wir sehen uns Ihre wiederkehrenden Vorgänge an und Sie bekommen
danach eine schriftliche KI-Roadmap für Ihr Immobilienunternehmen.
Darin steht, welche Vorgänge sich automatisieren lassen, in welcher
Reihenfolge, und was der erste Schritt kostet.

Sie behalten die Roadmap, auch wenn wir nicht zusammenarbeiten.

Das Gespräch wird aufgezeichnet und als Beitrag auf YouTube
veröffentlicht. Mandantendaten, Objektadressen und Umsatzzahlen
kommen nicht ins Video. Sie sehen den Schnitt vor der
Veröffentlichung.
```

6. Buchungsfragen, Identifier exakt:

| Identifier | Typ | Optionen / Hinweis |
|---|---|---|
| `attendeePhoneNumber` | Telefon, Pflicht | Label: Telefonnummer |
| `anfragen-pro-woche` | Zahl, Pflicht | Label: Anfragen pro Woche |
| `engpass` | Auswahl, Pflicht | `inseratsanfragen-qualifizieren`, `mieteranliegen-management` |
| `crm` | Auswahl oder Text | `onoffice`, `propstack`, `flowfact`, `haufe`, `excel`, `anderes` |
| **`aufzeichnung`** | **Checkbox, Pflicht** | **Noch anzulegen.** Wortlaut: „Ich bin einverstanden, dass das Gespräch aufgezeichnet und nach meiner Freigabe des Schnitts veröffentlicht wird." |

`crm` wird jetzt **nur noch** hier erhoben. Der Rechner auf der Seite
fragt es nicht mehr ab (Hausregel in `Claude_and_brand.md/CLAUDE.md`:
CRM gehört in den Discovery-Call, nicht in den Rechner).

Bis die Beschreibung im Dashboard steht, blendet das Embed die Event-Details auf dieser Seite aus, damit Tippfehler und „Book Now!" nicht im Reel stehen.

## Aufbau der Seite

Reihenfolge, bewusst so und nicht anders:

1. **Hero** — fuer wen, welcher Schmerz, was man bekommt, ein Button.
   Kein Bild, keine Simulation: auf dem Handy zaehlt jede Zeile.
2. **Disqualifier** — unter zehn Anfragen raten wir ab.
3. **Dieselbe Anfrage, zwei Abende** — Vorher/Nachher-Zeitstrahl.
   Zeigt den Schmerz, statt ihn zu beschreiben. Als illustrativ
   gekennzeichnet, keine gemessenen Werte (brand.md).
4. **Was in den 60 Minuten passiert** — der eigentliche Grund zu
   buchen. Minutenbaender, inklusive "Was Sie schon probiert haben
   und warum es nicht gehalten hat".
5. **Warum das kostenlos ist** — der Content-Tausch, drei Zeilen.
6. **Wer im Termin sitzt** — Kevin, Foto, Kanal.
7. **Trust-Strip** — EU-Hosting, plus eine Zeile zur Beweislage.
8. **Buchen** — Gate mit drei Fragen, dann der Kalender.
9. **FAQ** und **Rechner** stehen bewusst **hinter** dem Kalender.

Sichtbarer Text: rund 680 Woerter. Vorher waren es 1.239. Wer hier
Sektionen ergaenzt, sollte vorher pruefen, was dafuer rausfaellt.

**Es gibt keine eigene Angebots-Sektion mehr.** Zwoelf Monate
Laufzeit und die Ausstiegsgarantie sind Argumente fuer die bezahlte
Zusammenarbeit, also zwei Entscheidungen spaeter. Im Scrollweg zum
kostenlosen Termin erzeugen sie nur den Gedanken "zwoelf Monate
Bindung". Der volle Wortlaut steht jetzt im FAQ-Eintrag
"Und wenn wir danach zusammenarbeiten?" unter dem Kalender.

**Die Hero-Simulation ist weg.** `scripts/aqut-sim.js` wird von
dieser Seite nicht mehr geladen. `index.html` und `ams.html` nutzen
sie unveraendert weiter.

Das **Gate** (`#roadmap-gate`) laeuft in drei Schritten, eine Frage
pro Schritt, mit Fortschrittsbalken und Zurueck-Taste. Frage 1
schaltet beim Klick automatisch weiter. Der Kalender wird erst nach
Schritt 3 sichtbar.

Im Kontaktblock steht `images/cover.webp` als Bild dessen, was nach
dem Termin in der Hand liegt.

> Das Cover traegt im Bild den Titel "Prozesse rechtssicher
> digitalisieren, Praxisleitfaden". Wenn die Roadmap ein anderes
> Dokument ist, sollte dafuer ein eigenes Cover her.

Die drei Fragen:

| # | Frage | Werte |
|---|---|---|
| 1 | Groesster Engpass | `manuelle-bearbeitung`, `mieteranliegen`, `reaktionszeit`, `terminierung` |
| 2 | Mail und Kalender | `google`, `microsoft365`, `imap`, `gemischt`, `weiss-nicht` |
| 2 | CRM | `onoffice`, `propstack`, `flowfact`, `haufe`, `excel`, `anderes` |
| 3 | Vorgaenge pro Woche | 5 bis 150 |

Dazu ein Pflicht-Kontrollkaestchen fuer die Speicherung.
**Kontaktdaten erhebt das Gate nicht**: Name, E-Mail und Telefon
entstehen genau einmal, naemlich in der Cal-Maske dahinter.

Der Kalender-Container traegt im Markup `data-cal-deferred` statt
`data-cal-inline`, damit das autoMount in `scripts/cal-embed.js` ihn
nicht vorzeitig einhaengt.

## Deploy: zwei Schritte, sonst geht der Datensatz verloren

Das Gate schreibt nach `funnel_qualify`. Beides ist **neu** und muss
vor dem Reel-Link raus:

1. **Migration anwenden**
   `supabase/migrations/20260818_create_funnel_qualify.sql`
   (`supabase db push` oder im SQL-Editor ausführen)
2. **Edge Function neu deployen**
   `supabase functions deploy submit-funnel-lead`
   Neu darin: der Zweig `type: "qualify"`.

Fehlt eines von beidem, **bleibt der Kalender trotzdem erreichbar**:
das Einblenden hängt bewusst nicht am Erfolg des Speicherns. Verloren
geht dann nur der Qualifizierungs-Datensatz, ohne dass der Interessent
etwas merkt. Nach dem Deploy einmal testen und in `funnel_qualify`
nachsehen.

`register_funnel_attempt` bleibt unverändert: `qualify` teilt sich das
Rate-Limit-Kontingent `lead` (5 Versuche je 15 Minuten und IP).

## Sicherung der Daten

1. Anonyme Events in `funnel_events` mit `session_id`, über
   `submit-funnel-lead` (`type: "event"`).
   Gesendet werden: `lp_view`, `funnel_step_1..3`,
   `funnel_result_view`, `booking_confirmed`.
2. Die drei Gate-Antworten in `funnel_qualify` (`type: "qualify"`),
   inklusive Wortlaut der Einwilligung als Nachweis nach Art. 7 DSGVO.
3. Der eigentliche Lead entsteht erst nach bestätigter Buchung, über
   `submit-audit-lead` (aus `scripts/cal-embed.js`) → `inbound_leads`,
   Notion, Mail.
4. Prozesshandbuch-Downloads laufen unverändert über
   `lead_magnet_downloads` + n8n.

> Die **Lead-Strecke** von `submit-funnel-lead` (`type: "lead"`) wird
> von dieser Seite nicht mehr benutzt. Sie verlangt `name`, `phone`,
> `crm`, `kalender` und `postfach` als Pflichtfelder und würde mit 400
> antworten. Sie bleibt für andere Verwendungen im Code stehen.

## n8n

Kurzanleitung: [`docs/funnel-lead-n8n-setup.md`](funnel-lead-n8n-setup.md)

Der Funnel-Lead-Workflow läuft aktuell leer, weil kein `type: "lead"`
mehr gesendet wird. Er kann stehen bleiben, macht aber nichts. Wenn Sie
über neue Gate-Antworten benachrichtigt werden wollen, wäre der Ort
dafür ein Webhook im `qualify`-Zweig der Function.

## Datenschutz / Ship

- `datenschutz.html` ist auf den neuen Stand gebracht:
  - neuer Abschnitt **„Aufzeichnung des Erstgesprächs (KI-Roadmap)"**
    (Art. 6 Abs. 1 lit. a DSGVO, § 22 KunstUrhG, Widerruf auch nach
    Veröffentlichung, YouTube als Empfänger)
  - neuer Abschnitt **„Prozesshandbuch als PDF-Download"** — der
    Lead-Magnet war bis dahin gar nicht abgedeckt
  - „Qualifizierungsformular KI-Roadmap" ersetzt durch **„Rechner auf
    der Seite KI-Roadmap"**: der Rechner erhebt keine Kontaktdaten
    mehr, die alte Beschreibung von `submit-funnel-lead`,
    `funnel_leads` und `form_consents` traf nicht mehr zu
  - Prefill-Beschreibung korrigiert: es werden nur noch Volumen,
    Vorgangstyp und eine Notiz übergeben, keine Kontaktdaten

  **Diese Texte sind ein Entwurf und noch nicht anwaltlich geprüft.**
  Vor Livegang gegen `rais_rechtstexte/` prüfen lassen. Besonders die
  Zusagen im Aufzeichnungs-Abschnitt (Freigabe des Schnitts, Offline-
  nahme bei Widerruf, keine Mandantendaten im Video) sind bindend und
  müssen mit der gelebten Praxis übereinstimmen.
- Vor Livegang: Cal-Dashboard wie oben inklusive `aufzeichnung`, dann
  `rais-ship-audit`.
- `npm run build` und prüfen, dass `dist/ai-roadmap.html` existiert.
  Die Seite fehlte lange im Build, während `/makler.html` bereits per
  301 auf sie zeigte.
- Erst danach den Reel-Kommentar auf `https://ritz-ai.solutions/ai-roadmap.html` umstellen.
