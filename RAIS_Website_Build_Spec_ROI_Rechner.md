# RAIS Website Build Spec, ROI-Rechner, Backend, ICP- und Socials-Änderungen

**Ziel-Repo:** ritz-ai.solutions (Vercel)
**Stand:** 29.07.2026
**Für:** Cursor. Konservativ umsetzen. Keine Interpretation, keine Eigeninitiative über diese Spec hinaus.

---

## 0. Verbindliche Regeln für diese Umsetzung

1. Keine neuen Abhängigkeiten außer den unter 3.1 genannten. Kein Framework-Wechsel, kein Build-Step-Umbau.
2. Kein Gedankenstrich (—) in nutzersichtbarem Text. Deutsch, Sie-Form.
3. Jede angezeigte Zahl ist entweder aus Nutzereingaben berechnet oder mit sichtbarer Quellenangabe belegt. Keine dritte Kategorie.
4. Der Rechner sendet keine Daten. Erst das Audit-Formular sendet.
5. Bestehende Sektionen werden nicht neu gebaut, nur die unter Teil D und E genannten Stellen geändert.
6. Alle Farben aus Abschnitt 3.2. Keine neuen Farbwerte.
7. Commit-Reihenfolge aus Abschnitt 8 einhalten. Ein Commit pro Teil.

---

## 1. Umfang

**Gebaut wird:**

| Teil | Inhalt |
|---|---|
| A | ROI-Rechner, neue Sektion auf der Startseite |
| B | Backend für Lead-Übergabe (Vercel Function, Supabase, n8n) |
| C | Übergabe der Rechnerwerte ins bestehende Audit-Formular |
| D | ICP- und Referenzen-Sektion schärfen |
| E | Socials im Footer plus schlanke Subpage |
| F | 60-Stunden-Claim entfernen (Pflicht, zuerst) |

**Nicht gebaut wird:**

- Keine Änderung an Hero, Prozess-Sektion, Gründer-Sektion, Zusammenarbeit-Sektion
- Keine neue Kalender-Integration, der bestehende Buchungsschritt bleibt
- Kein Redesign, keine neuen Schriften
- Kein Tracking-Pixel, kein Analytics-Tool

---

## 2. Voraussetzung, zuerst erledigen

**Teil F, Pflicht vor allem anderen.**

Auf der Startseite steht aktuell in der Nutzen-Sektion:

```
Durchschnittlich 60 Stunden Ersparnis pro Monat
```

Diese Zeile ist eine unbelegte Behauptung über den Besucher und ein Brand-Verstoß. Ersetzen durch exakt:

```
Bei typischem Anfragevolumen oft im Bereich von rund 30 Stunden pro Monat, abhängig von Ihrem Volumen.
Herleitung: ca. 5 bis 8 Stunden pro Woche.
```

Formatierung: erste Zeile als bestehende Hervorhebung, zweite Zeile als kleinerer Zusatz in `--rais-stone`, Schriftgröße 14px.

Direkt darunter den sekundären Link einfügen:

```
Ihren eigenen Wert berechnen →
```
Anker: `#rechner`

---

## 3. Technische Basis

### 3.1 Stack und erlaubte Abhängigkeiten

- Vanilla JS, keine Framework-Einführung
- Vercel Serverless Functions (Node 20, `/api`)
- `@supabase/supabase-js` (nur serverseitig, nie im Client-Bundle)
- Sonst nichts

### 3.2 Design-Tokens

Als CSS-Custom-Properties in der bestehenden globalen Stylesheet-Datei ergänzen, falls noch nicht vorhanden. Exakte Werte, keine Abweichung.

```css
:root {
  --rais-orange:        #EC6A37;
  --rais-orange-hover:  #F37A48;
  --rais-cloud:         #F5F2EC;
  --rais-linen:         #FBF8F3;
  --rais-sage:          #789464;
  --rais-green:         #004225;
  --rais-charcoal:      #2F2A24;
  --rais-stone:         #7B746B;
  --rais-border:        #D9D1C7;
}
```

**Verwendungsregeln im Rechner:**

| Element | Farbe |
|---|---|
| Sektions-Hintergrund | `--rais-cloud` |
| Rechner-Karte | `--rais-linen` |
| Kartenrand | 1px solid `--rais-border`, Radius 12px |
| Fließtext, Labels | `--rais-charcoal` |
| Hilfstext, Fußnote, Quelle | `--rais-stone` |
| Slider-Track gefüllt, aktive Werte | `--rais-orange` |
| Slider-Track ungefüllt | `--rais-border` |
| Ergebnis-Zahlen (Zeit, Kosten) | `--rais-green` |
| Ergebnis-Karte Hintergrund | `#FFFFFF` |
| CTA-Button | Hintergrund `--rais-orange`, Hover `--rais-orange-hover`, Text `#FFFFFF` |
| Benchmark-Balken aktiv | `--rais-orange` |
| Benchmark-Balken Referenz | `--rais-sage` |

Kein Schatten außer `box-shadow: 0 1px 2px rgba(47,42,36,0.05)` auf der Ergebnis-Karte. Keine Verläufe. Keine Animation außer 150ms `ease-out` auf Zahlenwechsel und Button-Hover.

---

## 4. Teil A, ROI-Rechner

### 4.1 Dateien

```
/rechner.js          neue Datei, Logik
/rechner.css         neue Datei, Styles
index.html           neue <section id="rechner">
```

Skript per `<script src="/rechner.js" defer></script>` am Ende von `index.html` einbinden.

### 4.2 Platzierung

Neue Sektion `id="rechner"` direkt **nach** der Nutzen-/Leistungs-Sektion und **vor** der Referenzen-Sektion. Ankernavigation im Header nicht ändern.

### 4.3 Sektions-Kopf, exakte Copy

```
Label:      Zeitverlust berechnen
H2:         Was kostet Sie die manuelle Bearbeitung Ihrer Portalanfragen?
Subline:    Vier Angaben. Alle Zahlen unten werden ausschließlich aus Ihren Eingaben berechnet.
```

### 4.4 Eingaben, exakt vier

Alle vier als Slider bzw. Auswahl. Kein Freitext. Kein Pflichtfeld-Zwang, alle haben Defaults, das Ergebnis ist ab Sekunde eins sichtbar.

| # | Key | Label | Typ | Min | Max | Step | Default | Suffix |
|---|---|---|---|---|---|---|---|---|
| 1 | `anfragenProWoche` | Anfragen pro Woche über Immobilienportale | range | 5 | 150 | 5 | 40 | ` Anfragen` |
| 2 | `minutenProAnfrage` | Minuten pro Anfrage bis der Erstkontakt steht | range | 5 | 45 | 1 | 18 | ` Min.` |
| 3 | `reaktionszeit` | Wie schnell reagiert Ihr Team im Schnitt? | select | siehe 4.5 | | | `selber_tag` | |
| 4 | `stundensatz` | Interner Stundensatz pro Mitarbeiter | range | 25 | 90 | 5 | 45 | ` €` |

**Hilfstext unter Frage 2, exakt:**
```
Rückfragen per Telefon, Nachfassen per Mail und interne Weitergabe mitrechnen.
```

**Hilfstext unter Frage 4, exakt:**
```
Vollkosten inklusive Lohnnebenkosten. Wenn unklar, Standardwert stehen lassen.
```

### 4.5 Reaktionszeit-Optionen und Benchmark-Faktoren

```js
const REAKTION = {
  unter_1std: {
    label: "Innerhalb einer Stunde",
    faktor: null,          // Referenzgruppe
    referenz: true
  },
  selber_tag: {
    label: "Am selben Werktag",
    faktor: 7,
    referenz: false
  },
  naechster_werktag: {
    label: "Am nächsten Werktag",
    faktor: 60,
    referenz: false
  },
  laenger: {
    label: "Länger als zwei Werktage",
    faktor: 60,
    referenz: false
  }
};
```

Die Faktoren sind **fest verdrahtet** und stammen aus der unter 4.8 genannten Quelle. Nicht interpolieren, nicht runden, nicht selbst herleiten.

### 4.6 Formeln, exakt

```js
const WOCHEN_PRO_MONAT = 4.33;

const anfragenProMonat = anfragenProWoche * WOCHEN_PRO_MONAT;
const stundenProMonat  = (anfragenProWoche * minutenProAnfrage * WOCHEN_PRO_MONAT) / 60;
const kostenProMonat   = stundenProMonat * stundensatz;
const stundenProJahr   = stundenProMonat * 12;
const kostenProJahr    = kostenProMonat * 12;
```

**Rundung und Formatierung:**

- `stundenProMonat`, `stundenProJahr`: auf ganze Zahl, `Math.round`
- `kostenProMonat`, `kostenProJahr`: auf ganze Zahl, `Math.round`
- `anfragenProMonat`: auf ganze Zahl, `Math.round`
- Zahlformat durchgehend `new Intl.NumberFormat('de-DE')`
- Währung: `new Intl.NumberFormat('de-DE', { style:'currency', currency:'EUR', maximumFractionDigits:0 })`

### 4.7 Ausgabeblock 1, Zeitverlust

Drei Kennzahlen nebeneinander (Desktop), gestapelt unter 768px.

```
[stundenProMonat] Stunden          [kostenProMonat]              [stundenProJahr] Stunden
pro Monat für die manuelle          interne Kosten pro Monat       pro Jahr
Bearbeitung
```

Darunter, kleiner, `--rais-stone`:
```
Berechnet aus Ihren Angaben: {anfragenProMonat} Anfragen pro Monat × {minutenProAnfrage} Minuten × {stundensatz} € Stundensatz.
```

### 4.8 Ausgabeblock 2, Reaktionsgeschwindigkeit

**Wenn `referenz === true` (Nutzer wählt „Innerhalb einer Stunde"):**

Überschrift:
```
Ihre Reaktionszeit liegt bereits im oberen Bereich.
```
Text, exakt:
```
Nach dem Harvard-Business-Review-Audit von 2.241 Unternehmen reagieren nur 37 Prozent innerhalb einer Stunde. Der Durchschnitt liegt bei 42 Stunden. Der Hebel liegt bei Ihnen damit nicht in der Geschwindigkeit, sondern in den {stundenProMonat} Stunden manueller Bearbeitung darüber.
```

**Wenn `referenz === false`:**

Überschrift:
```
{anfragenProMonat} Anfragen pro Monat verlassen bei Ihnen das Ein-Stunden-Fenster.
```
Text, exakt (`{faktor}` einsetzen):
```
Im Harvard-Business-Review-Audit lag die Wahrscheinlichkeit, eine Anfrage zu qualifizieren, bei einer Reaktion in dieser Zeitspanne rund {faktor}-fach unter der von Unternehmen, die innerhalb einer Stunde reagieren. Der erhobene Durchschnitt über alle Unternehmen lag bei 42 Stunden Erstreaktion, 23 Prozent reagierten überhaupt nicht.
```

**Balkenvergleich darunter, zwei Balken:**

```
Innerhalb einer Stunde        [Balken 100%, --rais-sage]
Ihre Angabe                   [Balken (100/faktor)%, mind. 2% Breite, --rais-orange]
```

Beschriftung der Balken nur mit den beiden Labels, keine Prozentzahl im Balken.

**Quellenverweis, direkt unter dem Balkenvergleich:**

Ein einzelner, unauffälliger Link. Kein Fließtextblock.

```
Quellen
```

Darstellung: 12px, Farbe `--rais-stone`, `text-decoration: underline`, `text-underline-offset: 3px`, `cursor: pointer`. Hover: Farbe `--rais-charcoal`. Kein Icon, kein Button-Look, keine Umrandung.

Verhalten und Inhalt: siehe 4.10.

**Wichtig:** Die Nennung der Quelle im Fließtext bleibt bestehen. Der Satz beginnt weiterhin mit „Im Harvard-Business-Review-Audit". Der Link liefert die Belege, er ersetzt nicht die Zuschreibung. Ohne die Nennung im Satz wirkt der Faktor wie eine Behauptung von RAIS, und genau das ist der Fehler, der beim 60-Stunden-Claim gemacht wurde.

### 4.9 Ausgabeblock 3, Übergang zum Audit

Exakte Copy:

```
H3:      Was davon automatisierbar ist, klären wir am konkreten Fall.
Text:    Im 60-minütigen Audit gehen wir Ihre echten Anfragedaten durch und Sie bekommen drei
         umsetzbare Use Cases mit Blueprint. Kostenlos, kein Pitch.
Button:  Kostenlosen Audit buchen
```

Der Button scrollt zu `#contact` und ruft `prefillAuditForm()` auf (siehe Teil C).

### 4.10 Quellen-Panel

Umsetzung mit nativem `<details>` und `<summary>`. Kein Modal, kein JavaScript, keine Bibliothek. Standardmäßig zugeklappt.

```html
<details class="rechner-quellen">
  <summary>Quellen</summary>
  <div class="rechner-quellen-inhalt">
    <!-- Inhalt siehe unten -->
  </div>
</details>
```

**Styling:**

```css
.rechner-quellen > summary {
  font-size: 12px;
  color: var(--rais-stone);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  list-style: none;
  display: inline-block;
  padding: 4px 0;
}
.rechner-quellen > summary::-webkit-details-marker { display: none; }
.rechner-quellen > summary:hover { color: var(--rais-charcoal); }
.rechner-quellen-inhalt {
  margin-top: 12px;
  padding: 16px;
  background: var(--rais-cloud);
  border: 1px solid var(--rais-border);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--rais-stone);
  max-width: 640px;
}
.rechner-quellen-inhalt a {
  color: var(--rais-stone);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.rechner-quellen-inhalt a:hover { color: var(--rais-orange); }
.rechner-quellen-inhalt strong { color: var(--rais-charcoal); font-weight: 600; }
```

**Inhalt, exakt übernehmen. Zwei Quellen plus Einordnung.**

```
Quelle 1, Grundlage der oben gezeigten Faktoren

Oldroyd, McElheran, Elkington: „The Short Life of Online Sales Leads",
Harvard Business Review, Ausgabe 89, Nr. 3, März 2011.

Auditiert wurden 2.241 US-Unternehmen mit Test-Anfragen über deren Webformulare.
Ergebnis: 37 Prozent reagierten innerhalb einer Stunde, 16 Prozent innerhalb von
einer bis 24 Stunden, 24 Prozent brauchten länger als 24 Stunden, 23 Prozent
reagierten überhaupt nicht. Die durchschnittliche Erstreaktion unter den
antwortenden Unternehmen lag bei 42 Stunden.

Der zentrale Befund: Unternehmen, die innerhalb einer Stunde Kontakt versuchten,
qualifizierten eine Anfrage knapp 7-mal so wahrscheinlich wie Unternehmen, die
auch nur eine Stunde später reagierten, und mehr als 60-mal so wahrscheinlich wie
Unternehmen, die 24 Stunden oder länger warteten.

Zum Artikel → https://hbr.org/2011/03/the-short-life-of-online-sales-leads


Quelle 2, ergänzender Kontext, nicht Grundlage der Rechnung

Oldroyd: Lead Response Management Study, MIT Sloan School of Management in
Zusammenarbeit mit InsideSales.com, 2007.

Ausgewertet wurden drei Jahre Daten aus sechs Unternehmen, mehr als 15.000 Leads
und über 100.000 Anrufversuche. Ergebnis: Bei einer Reaktion nach 30 statt nach
5 Minuten sank die Kontaktwahrscheinlichkeit um das 100-fache und die
Qualifizierungswahrscheinlichkeit um das 21-fache.

Zur Studie → https://www.leadresponsemanagement.org/lrm_study/


Warum wir mit Quelle 1 rechnen

Die viel zitierten Werte 100-fach und 21-fach aus Quelle 2 beziehen sich auf den
Abstand zwischen 5 und 30 Minuten. Für ein Maklerbüro ist das keine realistische
Vergleichsgröße. Die Zeitfenster aus Quelle 1, innerhalb einer Stunde, am selben
Tag, nach 24 Stunden, bilden den Arbeitsalltag deutlich näher ab. Deshalb liegen
dem Rechner die Faktoren aus Quelle 1 zugrunde.

Einordnung

Beide Erhebungen stammen aus den USA und aus einem allgemeinen Web-Lead-Kontext,
nicht aus dem deutschen Immobilienmarkt. Die genannten Werte sind
Wahrscheinlichkeitsverhältnisse aus diesen Stichproben, keine garantierten
Ergebnisse. Die Übertragung auf Ihr Anfragevolumen dient der Einordnung und ist
kein Versprechen für Ihr Büro.
```

Alle externen Links mit `target="_blank" rel="noopener noreferrer"`.

**Pflicht:** Die Angaben in diesem Panel werden nicht gekürzt, nicht umformuliert und nicht um zusätzliche Zahlen ergänzt. Wer später eine Zahl im Rechner ändert, ändert zuerst hier den Beleg.

### 4.11 Verhalten

- Neuberechnung bei jedem `input`-Event, kein Absende-Button
- Kein `localStorage`, kein `sessionStorage`
- Werte werden nur im JS-Speicher gehalten
- Bei deaktiviertem JS: Sektion per `<noscript>` ausblenden, statt kaputt anzuzeigen

---

## 5. Teil C, Übergabe ins Audit-Formular

Das bestehende dreistufige Audit-Formular bleibt unverändert in Aufbau und Reihenfolge. Ergänzt werden ausschließlich vier versteckte Felder.

```html
<input type="hidden" name="calc_anfragen_woche"   id="calc_anfragen_woche"   value="">
<input type="hidden" name="calc_minuten_anfrage"  id="calc_minuten_anfrage"  value="">
<input type="hidden" name="calc_reaktionszeit"    id="calc_reaktionszeit"    value="">
<input type="hidden" name="calc_stunden_monat"    id="calc_stunden_monat"    value="">
```

```js
function prefillAuditForm() {
  document.getElementById('calc_anfragen_woche').value  = state.anfragenProWoche;
  document.getElementById('calc_minuten_anfrage').value = state.minutenProAnfrage;
  document.getElementById('calc_reaktionszeit').value   = state.reaktionszeit;
  document.getElementById('calc_stunden_monat').value   = Math.round(stundenProMonat);
}
```

Wenn der Nutzer das Formular ohne Rechnernutzung erreicht, bleiben die Felder leer. Leere Werte sind serverseitig zulässig.

---

## 6. Teil B, Backend

### 6.1 Datenfluss

```
Audit-Formular (Client)
  → POST /api/audit-lead        (Vercel Serverless Function, Region fra1)
     → Validierung + Rate Limit
     → INSERT in Supabase (eu-central-1, Frankfurt), Service-Role-Key
     → POST an n8n-Webhook
        → n8n legt Notion-CRM-Eintrag an
        → n8n versendet Bestätigungsmail via Resend
  → 200 an Client, Weiterleitung zum Terminschritt
```

Der Client spricht **niemals** direkt mit Supabase. Kein Supabase-Key im Frontend-Bundle.

### 6.2 Supabase-Schema

```sql
create table public.audit_leads (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),

  name                  text not null,
  email                 text not null,
  website               text,

  pain_auswahl          text,
  teamgroesse           text,

  calc_anfragen_woche   integer,
  calc_minuten_anfrage  integer,
  calc_reaktionszeit    text,
  calc_stunden_monat    integer,

  lead_origin           text not null default 'website_rechner_2026',
  consent_at            timestamptz not null,
  user_agent            text,

  notion_synced         boolean not null default false,
  notion_page_id        text
);

alter table public.audit_leads enable row level security;
-- Keine Policy für anon oder authenticated. Zugriff ausschließlich über Service-Role.

create index audit_leads_created_at_idx on public.audit_leads (created_at desc);
create unique index audit_leads_email_day_idx
  on public.audit_leads (email, (created_at::date));
```

Der Unique-Index verhindert Doppel-Einträge derselben Adresse am selben Tag. Bei Konflikt gibt die Function `200` mit `{ ok: true, duplicate: true }` zurück, kein Fehler für den Nutzer.

**Keine IP-Speicherung.** `user_agent` wird gespeichert, die IP nicht.

### 6.3 Serverless Function

`/api/audit-lead.js`, Node 20, Region `fra1` (in `vercel.json` erzwingen).

**Akzeptiert:** nur `POST`, `Content-Type: application/json`. Alles andere → `405`.

**Validierung, serverseitig, Reihenfolge:**

1. Honeypot-Feld `firma_zusatz` muss leer sein. Sonst `200` mit `{ ok: true }` zurückgeben und nichts speichern.
2. `name`: 2 bis 80 Zeichen nach `trim`
3. `email`: RFC-nahe Regex, max. 120 Zeichen, `toLowerCase`
4. `website`: optional, max. 200 Zeichen
5. `consent` muss `true` sein, sonst `400`
6. `calc_*`: optional, wenn vorhanden `Number.isInteger` und in den Grenzen aus 4.4, sonst auf `null` setzen statt Fehler werfen
7. Alle Strings mit `.trim()` und Längenbegrenzung, kein HTML durchreichen

**Rate Limit:** max. 5 Requests pro IP pro 10 Minuten, in-memory Map mit Zeitstempel. Bei Überschreitung `429`. Die IP wird nur für dieses Zeitfenster im Speicher gehalten und nicht persistiert.

**Antwortformat:**

```json
{ "ok": true }
{ "ok": true, "duplicate": true }
{ "ok": false, "error": "validation" }
```

Niemals interne Fehlermeldungen oder Stacktraces an den Client.

**Fehlerfall n8n:** Wenn der n8n-Webhook fehlschlägt, wird der Supabase-Eintrag trotzdem behalten und `notion_synced` bleibt `false`. Die Function gibt dennoch `200` zurück. Der Nutzer darf davon nichts merken.

### 6.4 Umgebungsvariablen

In Vercel als Environment Variables, nicht im Repo:

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
N8N_AUDIT_WEBHOOK_URL
N8N_WEBHOOK_SECRET
```

Der n8n-Request trägt `X-RAIS-Signature` mit HMAC-SHA256 des Bodys unter `N8N_WEBHOOK_SECRET`. n8n verwirft Requests ohne gültige Signatur.

`.env*` in `.gitignore` prüfen. Keine Keys in Client-Code, keine `NEXT_PUBLIC_`-Präfixe.

### 6.5 DSGVO

- Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO, vorvertragliche Maßnahme
- Bestehende Consent-Checkbox bleibt Pflichtfeld, `consent_at` wird serverseitig gesetzt
- Datenschutzerklärung ergänzen um: Supabase (Frankfurt), Vercel (fra1), n8n (eigene Instanz), Resend (EU)
- Löschfrist 24 Monate nach letztem Kontakt, als Supabase-Cron oder n8n-Zeitplan
- Der Rechner selbst überträgt nichts und braucht daher keinen Consent

---

## 7. Teil D und E, Sektionsänderungen

### 7.1 „Mit wem wir arbeiten"

Die ICP-Sektion selbst ist inhaltlich korrekt und bleibt. Geändert wird nur die Einleitung, um die Ausschlüsse sichtbar zu machen.

Bestehende Subline ersetzen durch exakt:

```
Wir arbeiten ausschließlich mit unabhängigen Maklerbüros im Mittelstand. Keine Franchise-Netzwerke, keine bankgebundenen Büros, keine Hausverwaltungen. Innovationsbereitschaft ist das wichtigste Kriterium.
```

Nummerierung der vier Kriterien: die aktuell fehlerhafte Darstellung (`I`, `II`, `III`, `IV` erscheinen teils doppelt oder verschoben) korrigieren. Reine CSS- bzw. Markup-Korrektur, Inhalt unverändert.

### 7.2 Referenzen-Sektion

Aktuell zeigt die Sektion sechs Kacheln, darunter mehrere ohne Maklerbezug. Das verwässert die Positionierung.

**Behalten und an den Anfang stellen:**
- Anfragen-Qualifizierung im CRM
- Onboarding-Automatisierung
- Performance-Dashboard
- Workflow-Automatisierung

**Entfernen:**
- Website- und CMS-System (Eckstein CMS, kein Maklerbezug)
- Lead-Scraping und Enrichment (internes Tooling, kein Kundennutzen im ICP)

Sektions-Subline ersetzen durch exakt:

```
Jedes dieser Systeme läuft produktiv in einem Maklerbüro oder in unserem eigenen Betrieb. Keine Konzepte, gebaute Realität.
```

Grid von sechs auf vier Kacheln anpassen, zweispaltig ab 768px.

### 7.3 Letzte CTA-Sektion

Bestehende Zeile ersetzen durch exakt:

```
H2:      60 Minuten. Kostenlos. Drei umsetzbare Use Cases.
Text:    Für unabhängige Maklerbüros mit 5 bis 25 Mitarbeitenden. Wir gehen Ihre Anfragestrecke durch
         und Sie bekommen einen Blueprint, den Sie auch ohne uns umsetzen können.
Badges:  Kein Pitch · Kein Verkaufsdruck · Blueprint inklusive
Button:  Kostenlosen Audit buchen
```

### 7.4 Socials

**Footer**, neben dem bestehenden LinkedIn-Link ergänzen:

```
LinkedIn · YouTube · Instagram
```

Alle drei mit `target="_blank" rel="noopener noreferrer"`. URLs von Kevin einsetzen, keine Platzhalter committen.

**Neue Subpage** `/content.html`:

- Header und Footer identisch zur Startseite wiederverwenden
- H1: `Einblicke in gebaute Systeme`
- Subline: `Screenrecordings, Aufbauten und Erklärungen aus echten Projekten. Auf YouTube ausführlich, auf Instagram kurz.`
- Zwei Karten, YouTube und Instagram, je mit Kanalname, einer Zeile Beschreibung und Button zum Kanal
- Kein Embed, kein iFrame, keine Drittanbieter-Skripte. Das vermeidet Consent-Pflicht.
- Am Seitenende die bestehende CTA-Sektion aus 7.3 wiederverwenden
- Verlinkung: nur im Footer als `Content`. **Nicht** in die Hauptnavigation aufnehmen.
- `<meta name="robots" content="index,follow">`, Titel `RAIS | Content und Einblicke`

---

## 8. Commit-Reihenfolge

Ein Commit pro Schritt, in dieser Reihenfolge, jeweils deploybar.

1. `fix: 60-Stunden-Claim durch belegbare Herleitung ersetzen` (Teil F)
2. `feat: Design-Tokens ergänzen`
3. `feat: ROI-Rechner Sektion, Logik und Styles` (Teil A)
4. `feat: Rechnerwerte an Audit-Formular übergeben` (Teil C)
5. `feat: /api/audit-lead mit Supabase und n8n-Webhook` (Teil B)
6. `refactor: ICP-Einleitung, Referenzen-Filter, finale CTA` (Teil D)
7. `feat: Socials im Footer und /content.html` (Teil E)

---

## 9. Definition of Done

Jeder Punkt manuell prüfen, bevor auf Production deployed wird.

**Rechner**
- [ ] Vier Eingaben, keine fünfte, kein CRM-Feld
- [ ] Standardwerte zeigen sofort ein Ergebnis, ohne Interaktion
- [ ] Slider auf Minimum und auf Maximum erzeugen keine `NaN`, kein `Infinity`, keine negative Zahl
- [ ] Alle vier Reaktionszeit-Optionen rendern korrekten Text und korrekten Balken
- [ ] Der Link `Quellen` ist in jeder Variante sichtbar und standardmäßig zugeklappt
- [ ] Das Quellen-Panel öffnet ohne JavaScript (JS im Browser deaktivieren und testen)
- [ ] Beide externen Links im Panel laden und führen auf die genannte Studie
- [ ] Der Ergebnistext nennt Harvard Business Review weiterhin im Satz, nicht nur im Panel
- [ ] Keine Zahl auf dem Bildschirm, die weder aus Eingaben berechnet noch mit Quelle belegt ist
- [ ] Mobil unter 380px Breite kein horizontales Scrollen

**Backend**
- [ ] `SUPABASE_SERVICE_ROLE_KEY` taucht in keinem Client-Bundle auf (Build-Output durchsuchen)
- [ ] `GET /api/audit-lead` liefert 405
- [ ] Absenden ohne Consent liefert 400 und speichert nichts
- [ ] Ausgefüllter Honeypot liefert 200 und speichert nichts
- [ ] Sechster Request innerhalb von 10 Minuten liefert 429
- [ ] Zweiter Eintrag derselben Mail am selben Tag liefert 200 mit `duplicate: true`
- [ ] Bei abgeschaltetem n8n bleibt der Supabase-Eintrag bestehen und der Nutzer sieht Erfolg
- [ ] RLS ist aktiv und der anon-Key kann `audit_leads` nicht lesen (aktiv testen)

**Inhalt**
- [ ] Der String „60 Stunden" existiert nirgends mehr im Repo
- [ ] Kein Gedankenstrich in nutzersichtbarem Text
- [ ] Referenzen zeigen vier Kacheln, Eckstein CMS und Lead-Scraping sind entfernt
- [ ] Footer verlinkt LinkedIn, YouTube, Instagram und Content
- [ ] `/content.html` lädt ohne einen einzigen Drittanbieter-Request (Netzwerk-Tab prüfen)
- [ ] Datenschutzerklärung nennt Supabase, Vercel, n8n und Resend

---

## 10. Offene Punkte für Kevin

Vor Umsetzung liefern, sonst blockiert:

1. YouTube-Kanal-URL und Instagram-Profil-URL
2. n8n-Webhook-URL für den Audit-Lead-Flow
3. Bestätigung, ob `audit_leads` in der bestehenden Supabase-Instanz angelegt wird oder in einem eigenen Projekt
