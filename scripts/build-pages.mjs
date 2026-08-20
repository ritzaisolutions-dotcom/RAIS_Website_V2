import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  headHtml,
  navHtml,
  contactHtml,
  footerHtml,
  bookingModalHtml,
  scriptsHtml
} from './page-shell.mjs';
import {
  UNIVERSAL,
  renderRegister,
  renderBranchen,
  renderSystemTile,
  renderSystemTiles,
  systemCount,
  flagships
} from './systemakte-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function page({
  file,
  active,
  title,
  description,
  path,
  main,
  extraScripts = '',
  extraCss = [],
  calUrl,
  dauer,
  navCta,
  contact,
  stickyHref,
  stickyLabel,
  bookingAriaLabel,
  bodyAttrs = '',
  footerMinimal = false,
  ogImage = '',
  afterContact = ''
}) {
  const resolvedBodyAttrs = calUrl
    ? `${bodyAttrs} data-cal-url="${calUrl}"`.trim()
    : bodyAttrs;
  const html =
    headHtml({
      title,
      description,
      path,
      extraCss,
      bodyAttrs: resolvedBodyAttrs ? ` ${resolvedBodyAttrs}` : '',
      ogImage
    }) +
    navHtml(active, navCta || {}) +
    `<main id="main">${main}</main>` +
    contactHtml({ calUrl, dauer, ...(contact || {}) }) +
    afterContact +
    footerHtml({ stickyHref, stickyLabel, minimal: footerMinimal }) +
    bookingModalHtml(dauer, bookingAriaLabel) +
    extraScripts +
    scriptsHtml;
  writeFileSync(resolve(root, file), html, 'utf8');
  console.log('wrote', file);
}

page({
  file: 'ams.html',
  active: 'systeme',
  title: 'AMS | Anfragen-System von RAIS',
  description:
    'AMS von RAIS: Portalanfragen qualifizieren und Termine buchen. Beispielsystem für den Mittelstand. Bei hohem Volumen oft 20 bis 35 Stunden pro Woche zurück.',
  path: 'ams.html',
  main: `
<section class="page-hero page-hero--aqut">
  <div class="page-hero__inner">
    <span class="mono-label">Beispielsystem von RAIS</span>
    <h1>AMS: so bauen wir Systeme. Exemplarisch für Immobilien.</h1>
    <p>Bei hohem Anfragevolumen oft im Bereich von 20 bis 35 Stunden pro Woche, abhängig von Ihrem Volumen. Erstreaktion von durchschnittlich 15 Stunden auf 2 Minuten. Das Prinzip überträgt sich auf andere B2B-Prozesse.</p>
    <button type="button" class="btn-primary js-open-booking" data-source="aqut-hero">Kostenlosen KI-Audit buchen</button>
  </div>
</section>

<section class="aqut-sim-section" aria-labelledby="aqut-sim-title">
  <div class="section-wrap">
    <span class="mono-label">Live-Simulation</span>
    <h2 class="section-h2" id="aqut-sim-title">So läuft eine Anfrage durch AMS</h2>
    <p class="section-sub">Klicken Sie auf Demo Anfrage testen. Die Karte wandert Schritt für Schritt durch die Pipeline.</p>
    <div class="aqut-sim" id="aqut-sim" data-step="0">
      <div class="aqut-sim__glow" aria-hidden="true"></div>
      <ol class="aqut-sim__rail" aria-label="AMS Pipeline">
        <li class="aqut-sim__node" data-node="1">
          <span class="aqut-sim__pulse" aria-hidden="true"></span>
          <strong>Portal-Mail</strong>
          <span>Anfrage trifft ein</span>
        </li>
        <li class="aqut-sim__node" data-node="2">
          <span class="aqut-sim__pulse" aria-hidden="true"></span>
          <strong>KI-Check</strong>
          <span>Qualifizierung &amp; Bonität</span>
        </li>
        <li class="aqut-sim__node" data-node="3">
          <span class="aqut-sim__pulse" aria-hidden="true"></span>
          <strong>Kalender</strong>
          <span>Termin-Slot gebucht</span>
        </li>
        <li class="aqut-sim__node" data-node="4">
          <span class="aqut-sim__pulse" aria-hidden="true"></span>
          <strong>CRM</strong>
          <span>Eintrag &amp; Reminder</span>
        </li>
      </ol>
      <div class="aqut-sim__card" id="aqut-sim-card" aria-live="polite">
        <span class="aqut-sim__card-label">Demo-Anfrage</span>
        <p id="aqut-sim-status">Bereit. Starten Sie die Simulation.</p>
      </div>
      <div class="aqut-sim__actions">
        <button type="button" class="btn-primary" id="aqut-sim-play">Demo Anfrage testen</button>
        <button type="button" class="home-cta-link" id="aqut-sim-reset" hidden>Zurücksetzen</button>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="section-wrap" style="padding-top:2rem;">
    <span class="mono-label">Ihre Rechnung</span>
    <h2 class="section-h2">Rechner: nach Ihren eigenen Angaben</h2>
    <p class="section-sub">Keine Lead-Erfassung. Keine Kontaktdaten. Nur Aufklärung aus Ihren Zahlen: Mailbearbeitung plus Mailbox-Nachtelefonate. CRM klären wir im Discovery-Call.</p>
    <div class="rechner rechner--wizard" id="aqut-rechner">
      <div class="rq-progress">
        <span class="rq-progress__label" id="rq-step-label">Schritt 1 von 3</span>
        <div class="rq-progress__bars" aria-hidden="true">
          <span class="rq-progress__bar is-filled" data-bar="1"></span>
          <span class="rq-progress__bar" data-bar="2"></span>
          <span class="rq-progress__bar" data-bar="3"></span>
        </div>
      </div>

      <fieldset class="rq-step" data-step="1">
        <legend class="rq-step__title">Ihr Anfragevolumen</legend>
        <p class="rq-step__hint">Wie viele Anfragen landen bei Ihnen, und wie lange dauert die Bearbeitung?</p>
        <div class="rq-period" role="group" aria-label="Zeitraum für Anfragevolumen">
          <button type="button" class="rq-period__btn is-active" id="rq-period-month" data-period="month" aria-pressed="true">Monatlich</button>
          <button type="button" class="rq-period__btn" id="rq-period-week" data-period="week" aria-pressed="false">Wöchentlich</button>
        </div>
        <div class="rq-fields">
          <div>
            <label for="rq-volume" id="rq-volume-label">Anfragen pro Monat</label>
            <input id="rq-volume" type="number" min="0" step="1" value="350" inputmode="numeric">
          </div>
          <div>
            <label for="rq-minutes">Minuten pro Mail-Anfrage</label>
            <input id="rq-minutes" type="number" min="0" step="1" value="18" inputmode="numeric">
          </div>
        </div>
      </fieldset>

      <fieldset class="rq-step" data-step="2" hidden>
        <legend class="rq-step__title">Telefon-Nacharbeit</legend>
        <p class="rq-step__hint">Wie viel Zeit verbringt Ihr Team mit dem Hinterhertelefonieren von Mailbox-Anfragen?</p>
        <div class="rq-fields">
          <div>
            <label for="rq-phone-share">Anteil Anfragen mit Mailbox-Nachtelefonat (%)</label>
            <input id="rq-phone-share" type="number" min="0" max="100" step="1" value="30" inputmode="numeric">
          </div>
          <div>
            <label for="rq-phone-minutes">Minuten pro Mailbox-Nein-Anruf</label>
            <input id="rq-phone-minutes" type="number" min="0" step="1" value="5" inputmode="numeric">
          </div>
        </div>
      </fieldset>

      <fieldset class="rq-step" data-step="3" hidden>
        <legend class="rq-step__title">Ihr Kostensatz</legend>
        <p class="rq-step__hint">Mit welchem internen Stundensatz rechnen Sie die Bearbeitungszeit?</p>
        <div class="rq-fields">
          <div>
            <label for="rq-rate">Stundensatz in Euro</label>
            <input id="rq-rate" type="number" min="0" step="1" value="45" inputmode="decimal">
          </div>
        </div>
      </fieldset>

      <div class="rq-step rq-step--result" data-step="4" hidden>
        <span class="rq-step__eyebrow">Ihr Ergebnis</span>
        <p class="rq-step__hint">nach Ihren eigenen Angaben, ausgewiesen pro Monat</p>
        <div class="rechner__out" id="rq-output" aria-live="polite"></div>
      </div>

      <p class="rq-error" id="rq-error" hidden role="alert"></p>

      <div class="rq-nav">
        <button type="button" class="rq-btn-back" id="rq-back" hidden>Zurück</button>
        <button type="button" class="rq-btn-reset" id="rq-reset" hidden>Werte anpassen</button>
        <button type="button" class="rq-btn-next" id="rq-next">Weiter</button>
        <button type="button" class="btn-primary js-open-booking rq-btn-cta" id="rq-cta" data-source="aqut-rechner" hidden>Kostenlosen KI-Audit buchen</button>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="section-wrap">
    <span class="mono-label">Prozess</span>
    <h2 class="section-h2">Vier Schritte von der Portalanfrage zum Termin</h2>
    <div class="steps-4">
      <article><h3>Anfrage kommt rein</h3><p>Portal-Mail wird erfasst und dem Objekt zugeordnet.</p></article>
      <article><h3>Qualifizierung</h3><p>Kauf oder Miete, fehlende Angaben, automatische Rückfrage.</p></article>
      <article><h3>Terminbuchung</h3><p>Interessent wählt selbst, Termin landet im Kalender.</p></article>
      <article><h3>Übersicht</h3><p>Dashboard und Suche über alle Leads und Termine.</p></article>
    </div>
  </div>
</section>

<section>
  <div class="section-wrap">
    <span class="mono-label">Paket 1</span>
    <h2 class="section-h2">Was AMS konkret liefert</h2>
    <p class="section-sub">Das Setup für den Qualifizierungsalltag: von der Portalanfrage bis zum gebuchten Erstgespräch.</p>
    <ul class="list-plain">
      <li>Automatische Qualifizierung eingehender Portalanfragen</li>
      <li>Kauf/Miete-Erkennung und Rückfrage bei fehlenden Angaben</li>
      <li>Personalisierter Terminbuchungslink</li>
      <li>Kalenderintegration (aktuell Outlook / Microsoft Graph)</li>
      <li>Übersichts-Dashboard und intelligente Suche</li>
      <li>Anbindung an onOffice oder Propstack, wo technisch und vertraglich möglich</li>
    </ul>
  </div>
</section>

<section class="sage-block">
  <div class="section-wrap">
    <span class="mono-label">Use Cases</span>
    <h2 class="section-h2">So arbeitet das System im Alltag</h2>
    <details open><summary>Anfrage kommt rein und wird qualifiziert</summary><p>Rückfrage geht automatisch raus, wenn Angaben fehlen.</p></details>
    <details><summary>Interessent bucht Termin selbst</summary><p>Der Slot landet direkt im Kalender Ihres Büros.</p></details>
    <details><summary>Dashboard und intelligente Suche</summary><p>Alle Anfragen und Termine an einem Ort, durchsuchbar.</p></details>
  </div>
</section>

<section>
  <div class="section-wrap">
    <span class="mono-label">Danach</span>
    <h2 class="section-h2">Ausblick Paket 2</h2>
    <p class="section-sub">Nach stabilem Go-Live: Besichtigungstermine, digitale Mieterselbstauskunft, Vergleichsansicht. Kein zweites Angebot auf dieser Seite, nur der Weg danach.</p>
  </div>
</section>

<section>
  <div class="section-wrap">
    <span class="mono-label">Scope</span>
    <h2 class="section-h2">Was drin ist und was nicht</h2>
    <div class="scope-grid">
      <div>
        <h3>Enthalten</h3>
        <ul>
          <li>Setup und Anbindung laut Scope Paket 1</li>
          <li>Schulung Ihres Teams</li>
          <li>DSGVO-konforme EU-Infrastruktur und AVV</li>
        </ul>
      </div>
      <div>
        <h3>Nicht enthalten</h3>
        <ul>
          <li>Beliebige Zusatzmodule ohne Abstimmung</li>
          <li>Portal-Partnerschaften oder Markenrechte Dritter</li>
          <li>Unbegrenzte Feature-Wünsche im Setup-Preis</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="section-wrap">
    <span class="mono-label">FAQ</span>
    <h2 class="section-h2">Häufige Fragen</h2>
    <div class="faq-list">
      <details>
        <summary>Wie steht es um DSGVO und Hosting?</summary>
        <p>Systeme laufen selbst gehostet in der EU, Datenbank in Frankfurt. AVV nach Art. 28 DSGVO. Kundendaten bleiben in der EU.</p>
      </details>
      <details>
        <summary>Funktioniert AMS mit onOffice oder Propstack?</summary>
        <p>Ja, Anbindung an bestehende CRMs ist Teil des Setups, sofern API und Freigaben vorliegen. Ohne CRM bauen wir eine schlanke eigene Datenhaltung.</p>
      </details>
      <details>
        <summary>Wie lange dauert Setup bis Go-Live?</summary>
        <p>Abhängig von Zugängen, Kalender und Qualifizierungskriterien. Im Audit klären wir eine realistische Timeline für Ihr Büro.</p>
      </details>
      <details>
        <summary>Für welche Teamgröße passt AMS?</summary>
        <p>AMS ist für unabhängige Maklerbüros mit etwa 5 bis 25 Mitarbeitenden und spürbarem Portalvolumen gebaut. Solo-Makler, Franchise und bankgebundene Agenturen sind nicht die Zielgruppe. Für andere Branchen im Mittelstand bauen wir vergleichbare Qualifizierungssysteme nach dem gleichen Stack.</p>
      </details>
    </div>
    <p style="margin-top:2rem;">
      <button type="button" class="btn-primary js-open-booking" data-source="aqut-faq">Kostenlosen KI-Audit buchen</button>
    </p>
  </div>
</section>
`,
  extraScripts: '\n<script src="scripts/aqut-rechner.js"></script>\n<script src="scripts/aqut-sim.js"></script>\n'
});

page({
  file: 'referenzen.html',
  active: 'referenzen',
  title: 'Systemkatalog | RAIS',
  description:
    `Der Systemkatalog von RAIS: ${systemCount()} Systeme zum Anfragen. Anfragen qualifizieren, Support, Ticketing, Dokumente, Content und Reporting, für Maklerbüros mit Anfragevolumen.`,
  path: 'referenzen.html',
  extraScripts:
    '<script src="scripts/branchen-tabs.js"></script>\n<script src="scripts/katalog-filter.js"></script>\n',
  main: `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Systemkatalog</span>
    <h1>Suchen Sie sich Ihr System aus</h1>
    <p>${systemCount()} Systeme, die wir bauen. Jeder Eintrag nennt den Auslöser, den Ablauf, die Stelle für die menschliche Übergabe und ausdrücklich das, was das System nicht tut. Was passt, fragen Sie direkt an.</p>
  </div>
</section>

<!-- Anatomie eines Eintrags. Erklaert einmal gross, was in den 24
     Eintraegen darunter jeweils in vier Zeilen steht. Reines HTML und
     CSS, kein Bild: die Produkt-Screenshots im Repo zeigen echte
     Kontaktdaten und sind deshalb nicht verwendbar. -->
<section class="band-linen" aria-labelledby="katalog-anatomie-title">
  <div class="section-wrap">
    <span class="mono-label">So liest sich ein Eintrag</span>
    <h2 class="section-h2 section-h2--anchor" id="katalog-anatomie-title">Wie ein System bei Ihnen ankommt</h2>
    <p class="section-sub">Jeder Eintrag im Katalog beantwortet dieselben vier Fragen. Am Beispiel des Systems, mit dem die meisten anfangen.</p>

    <ol class="anatomie">
      <li class="anatomie__stage">
        <span class="anatomie__ico"><svg class="ico" aria-hidden="true"><use href="#i-mail"></use></svg></span>
        <span class="anatomie__label">Auslöser</span>
        <p class="anatomie__what">Woran Sie Ihren eigenen Alltag wiedererkennen.</p>
        <p class="anatomie__example">Eine Anfrage trifft ein, über Formular, Portal, Mail oder Telefon.</p>
      </li>
      <li class="anatomie__stage">
        <span class="anatomie__ico"><svg class="ico" aria-hidden="true"><use href="#i-board"></use></svg></span>
        <span class="anatomie__label">Ablauf</span>
        <p class="anatomie__what">Vier Schritte, die das System selbst erledigt.</p>
        <p class="anatomie__example">Aufnehmen, Rückfragen stellen, einordnen, weiterleiten.</p>
      </li>
      <li class="anatomie__stage">
        <span class="anatomie__ico"><svg class="ico" aria-hidden="true"><use href="#i-hand"></use></svg></span>
        <span class="anatomie__label">Übergabe</span>
        <p class="anatomie__what">Die Stelle, an der ein Mensch entscheidet.</p>
        <p class="anatomie__example">Sobald Bedarf, Budget und Zeitrahmen geklärt sind, geht der Vorgang an Ihr Team.</p>
      </li>
      <li class="anatomie__stage anatomie__stage--limit">
        <span class="anatomie__ico"><svg class="ico" aria-hidden="true"><use href="#i-limit"></use></svg></span>
        <span class="anatomie__label">Nicht im Zug</span>
        <p class="anatomie__what">Was das System ausdrücklich nicht tut.</p>
        <p class="anatomie__example">Keine Preiszusagen, keine Zusagen zu Verfügbarkeiten.</p>
      </li>
    </ol>

    <p class="anatomie__note">Die vierte Zeile ist die wichtigste. Ein System, das seine Grenze nicht kennt, gehört nicht in Ihren Betrieb.</p>
  </div>
</section>

<section id="katalog" aria-labelledby="katalog-uebergreifend-title">
  <div class="section-wrap">
    <!-- Ohne JS bleibt das Suchfeld verborgen und alle Eintraege stehen sichtbar. -->
    <div class="katalog__search" hidden>
      <label for="katalog-suche">Katalog durchsuchen</label>
      <input type="search" id="katalog-suche" placeholder="Zum Beispiel Angebot, Rechnung, WhatsApp, Onboarding" autocomplete="off">
      <p class="katalog__status" id="katalog-status" role="status" aria-live="polite"></p>
    </div>

    <span class="mono-label">Im Detail</span>
    <h2 class="section-h2" id="katalog-flaggschiffe-title">Die fünf, mit denen die meisten anfangen</h2>
    <p class="section-sub">Jedes davon hat eine eigene Seite mit Ablauf, Übergabepunkt und Grenzen.</p>
${renderSystemTiles()}

    <span class="mono-label" style="margin-top:4rem;">Branchenübergreifend</span>
    <h2 class="section-h2" id="katalog-uebergreifend-title">Sieben Systeme, die überall greifen</h2>
    <p class="section-sub">Diese Vorgänge sehen in jedem Betrieb ähnlich aus. Nur die Bezeichnungen und die angebundenen Systeme unterscheiden sich.</p>
${renderRegister(UNIVERSAL, { cta: true })}

    <div class="branchen-wrap">
      <span class="mono-label">Nach Branche</span>
      <h2 class="section-h2" id="katalog-branchen-title">Wie das im Alltag aussieht</h2>
      <p class="section-sub">Dieselben Prinzipien, übersetzt in die Sprache und die Werkzeuge Ihrer Branche.</p>
${renderBranchen({ cta: true })}
    </div>
  </div>
</section>

<section aria-labelledby="katalog-fragen-title">
  <div class="section-wrap">
    <span class="mono-label">Vor der Entscheidung</span>
    <h2 class="section-h2" id="katalog-fragen-title">Fragen, die Sie jedem Anbieter stellen sollten</h2>
    <p class="section-sub">Nicht nur uns. Wenn jemand bei einer davon ins Schwimmen kommt, wissen Sie genug.</p>
    <ul class="akte-register akte-register--fragen">
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Wo genau liegen unsere Daten, und wer verarbeitet sie?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body"><p>Bei uns: Hosting innerhalb der EU, Datenbank in Frankfurt, AVV nach Art. 28 DSGVO. Wer das nicht in einem Satz beantworten kann, weiß es selbst nicht.</p></div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Was passiert mit dem System, wenn wir die Zusammenarbeit beenden?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body"><p>Bei uns bleibt es stehen. Dokumentierte Übergabe, kein Lizenzschlüssel, den wir abschalten.</p></div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">An welcher Stelle entscheidet die Software, und an welcher ein Mensch?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body"><p>Jeder Eintrag oben nennt den Freigabepunkt und das, was das System nicht tut. Wer diese Grenze nicht benennen kann, hat sie nicht gezogen.</p></div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Wer haftet, wenn das System einen Fehler macht?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body"><p>Deshalb entscheidet bei uns nichts autonom, was jemand verantworten muss. Alles mit Konsequenz bekommt vorher eine menschliche Freigabe.</p></div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Was passiert, wenn Ihr Anbieter die Preise verdoppelt?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body"><p>Wir bauen ohne Vendor-Lock-in, wo es geht. Austauschbare Bausteine statt einer Plattform, die Sie später nicht verlassen können.</p></div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Können wir nachvollziehen, was das System entschieden hat, und warum?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body"><p>Jeder Vorgang wird protokolliert und ist im Zielsystem nachvollziehbar. Ein System, dessen Entscheidungen niemand prüfen kann, ist kein System, sondern ein Risiko.</p></div>
      </details></li>
    </ul>
  </div>
</section>

<!-- Gruener Anker dieser Seite. Die Ehrlichkeit darueber, was hier
     belegt ist und was nicht, ist das eigentliche Argument des
     Katalogs, deshalb traegt sie die dunkle Flaeche. -->
<section class="surface-green" aria-labelledby="katalog-beleg-title">
  <div class="section-wrap">
    <span class="mono-label">Beweislage</span>
    <h2 class="section-h2" id="katalog-beleg-title">Was hier steht und was nicht</h2>
    <p class="section-sub">Die Einträge beschreiben Systeme, die wir bauen, und die Regeln, nach denen sie arbeiten. Systeme laufen bereits im Aufbau und im Betrieb. Ein Eintrag trägt den Vermerk „Live im Betrieb“ aber erst, wenn ein Kunde die Nennung freigibt. Öffentliche Namen und Kennzahlen nennen wir erst nach Freigabe. Bis dahin sprechen wir über Systeme und Arbeitsweise, nicht über erfundene Erfolgsgeschichten.</p>
    <p class="section-sub" style="margin-top:1rem;">Ihr Fall steht nicht dabei? Die meisten Systeme entstehen als Zuschnitt aus mehreren dieser Bausteine.</p>
    <p style="margin-top:1.5rem;"><button type="button" class="btn-primary js-open-booking" data-source="katalog-abschluss">Passendes System besprechen</button></p>
  </div>
</section>
`
});

page({
  file: 'zusammenarbeit.html',
  active: null,
  title: 'So arbeiten wir | RAIS',
  description: 'Zusammenarbeit mit RAIS in fünf klaren Schritten: Erstkontakt, Discovery, Sales, Onboarding, Go-Live.',
  path: 'zusammenarbeit.html',
  main: `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Zusammenarbeit</span>
    <h1>Fünf Schritte. Kein Projektchaos.</h1>
    <p>Vom ersten Termin bis zum laufenden System. Jeder Schritt hat ein klares Ergebnis.</p>
  </div>
</section>
<!-- Wellen-Stepper. Das CSS dafuer liegt seit laengerem fertig und
     animiert in antigravity-polish.css (.collab-path__*), wurde aber
     von keinem Markup benutzt; die Seite zeigte stattdessen eine
     Primitiv-Variante, bei der immer nur ein Schritt sichtbar war.
     Hier stehen alle fuenf Schritte gleichzeitig, der aktive wird
     hervorgehoben. Ohne JavaScript ist damit der ganze Prozess
     lesbar statt nur Schritt eins.
     scripts/collab-path.js braucht: .collab-step[data-step],
     [data-step-btn], #collab-prev, #collab-next, #collab-counter. -->
<section>
  <div class="section-wrap">
    <div class="collab-path" id="collab-path" data-active-step="1" aria-label="Zusammenarbeit in fünf Schritten">
      <div class="collab-path__viewport">
        <div class="collab-path__track">
          <svg class="collab-path__svg collab-path__svg--wave" viewBox="0 0 1200 256" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="collabPathGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#004225"/>
                <stop offset="55%" stop-color="#789464"/>
                <stop offset="100%" stop-color="#004225"/>
              </linearGradient>
            </defs>
            <path class="collab-path__line collab-path__line--bg" fill="none" d="M0 128 C60 128 60 60 120 60 C180 60 300 196 360 196 C420 196 540 60 600 60 C660 60 780 196 840 196 C900 196 1020 60 1080 60 C1140 60 1140 128 1200 128"/>
            <path class="collab-path__line collab-path__line--dash" fill="none" d="M0 128 C60 128 60 60 120 60 C180 60 300 196 360 196 C420 196 540 60 600 60 C660 60 780 196 840 196 C900 196 1020 60 1080 60 C1140 60 1140 128 1200 128"/>
          </svg>
          <svg class="collab-path__svg collab-path__svg--stack" viewBox="0 0 8 600" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path class="collab-path__line collab-path__line--bg" fill="none" d="M4 0 L4 600"/>
            <path class="collab-path__line collab-path__line--dash" fill="none" d="M4 0 L4 600"/>
          </svg>

          <ol class="collab-path__steps">
            ${[
              ['Appointment Setting', 'Erstkontakt und Terminvereinbarung. Wir klären kurz, ob Volumen und Setup zu RAIS passen.'],
              ['Discovery Call', 'Pain-Analyse und Prozessaufnahme. Wir finden heraus, wo Zeit verloren geht und welches System den größten Hebel hat.'],
              ['Sales Call und Konzept', 'Maßgeschneidertes Lösungskonzept, Scope, Timeline und Preis. Schriftlich, nachvollziehbar, ohne Überraschungen.'],
              ['Technisches Onboarding', 'Systemaufbau, CRM-Anbindung und Integration in Ihre bestehenden Tools. Test mit echten Abläufen.'],
              ['Go-Live und Monitoring', 'Übergabe, Live-Betrieb und Monitoring. Anpassungen laufen mit, ohne dass Sie das System selbst betreiben.']
            ].map((row, i) => `
            <li class="collab-step${i === 0 ? ' is-active' : ''}" data-step="${i + 1}" data-position="${i % 2 === 0 ? 'up' : 'down'}">
              <div class="collab-step__inner">
                <button type="button" class="collab-step__btn" data-step-btn="${i + 1}"${i === 0 ? ' aria-current="step"' : ''}>
                  <span class="collab-step__num">${String(i + 1).padStart(2, '0')}</span>
                  <span class="sr-only">Schritt ${i + 1}: ${row[0]}</span>
                </button>
                <div class="collab-step__card">
                  <h3 class="collab-step__title">${row[0]}</h3>
                  <p class="collab-step__desc">${row[1]}</p>
                </div>
              </div>
            </li>`).join('')}
          </ol>
        </div>
      </div>

      <div class="collab-path__controls">
        <button type="button" class="collab-path__nav" id="collab-prev">Zurück</button>
        <span class="collab-path__counter" id="collab-counter" aria-live="polite">Schritt 1 von 5</span>
        <button type="button" class="collab-path__nav collab-path__nav--next" id="collab-next">Weiter</button>
      </div>
    </div>

    <div class="mitwirkung">
      <span class="mono-label">Mitwirkung</span>
      <h2 class="section-h2">Was wir von Ihnen brauchen</h2>
      <ul class="list-plain">
        <li>Zugang zu den relevanten Postfächern und dem Kalender</li>
        <li>Ansprechperson für Rückfragen im Büro</li>
        <li>Klare Freigaben zu Textbausteinen und Qualifizierungskriterien</li>
      </ul>
    </div>
  </div>
</section>
`,
  extraScripts: '\n<script src="scripts/collab-path.js"></script>\n'
});

page({
  file: 'ueber-uns.html',
  active: 'ueber-uns',
  title: 'Über uns | RAIS',
  description: 'RAIS: Effizienz mit Prinzipien. Geschäftsführer Kevin Ritz. Vision: größter Dienstleister für Prozessautomatisierung mit echtem Mehrwert im DACH-Raum.',
  path: 'ueber-uns.html',
  main: `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Über uns</span>
    <h1>Effizienz mit Prinzipien</h1>
    <p>Klar arbeiten. Systeme bauen, die echten Mehrwert schaffen. Ziel: Maßstab setzen im DACH-Raum.</p>
  </div>
</section>
<section>
  <div class="section-wrap">
    <span class="mono-label">Grundwerte</span>
    <h2 class="section-h2">Was uns trägt</h2>
    <p class="section-sub">Fünf Prinzipien. Der Maßstab für jede Entscheidung und jedes System.</p>
    <ol class="values-row" aria-label="Unsere fünf Grundwerte">
      <li class="values-row__item">
        <span class="values-row__num" aria-hidden="true">01</span>
        <h3>Wahrhaftigkeit &amp; Ehrlichkeit</h3>
        <p>Ehrliche Einschätzungen, wo KI hilft und wo nicht. Kein Marketing-Theater.</p>
      </li>
      <li class="values-row__item">
        <span class="values-row__num" aria-hidden="true">02</span>
        <h3>Verpflichtung &amp; Treue</h3>
        <p>Zuverlässige Betreuung, klare Zusagen, Verbindlichkeit in Projekten.</p>
      </li>
      <li class="values-row__item">
        <span class="values-row__num" aria-hidden="true">03</span>
        <h3>Dienst am Nächsten</h3>
        <p>Systeme sollen Menschen entlasten, nicht nur Dashboards füllen.</p>
      </li>
      <li class="values-row__item">
        <span class="values-row__num" aria-hidden="true">04</span>
        <h3>Verantwortung für Anvertrautes</h3>
        <p>Sorgfalt bei Kundendaten, Prozessen und Entscheidungen, die Menschen betreffen.</p>
      </li>
      <li class="values-row__item">
        <span class="values-row__num" aria-hidden="true">05</span>
        <h3>Demut &amp; Exzellenz</h3>
        <p>Hohe technische Qualität ohne Arroganz. Lernen bleibt Pflicht.</p>
      </li>
    </ol>

    <div class="team-block" aria-labelledby="team-title">
      <span class="mono-label">Unser Team</span>
      <h2 class="section-h2" id="team-title">Wer RAIS trägt</h2>
      <p class="section-sub">Wir sehen uns nicht als Besitzer, sondern als Verwalter. Arbeit direkt, persönlich, nachvollziehbar.</p>
      <div class="team-grid">
        <article class="team-card">
          <img src="images/profilbild.webp" width="480" height="640" loading="lazy" alt="Kevin Ritz, Geschäftsführer von RAIS">
          <div class="team-card__meta">
            <span class="team-card__role">Geschäftsführer</span>
            <h3>Kevin Ritz</h3>
            <p>Ich baue die Systeme und stehe für den Alltag: von Koblenz aus, direkt im Projekt, ohne anonymes Account-Team.</p>
            <p><a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
          </div>
        </article>
        <article class="team-card">
          <img src="images/jesus.webp" width="480" height="640" loading="lazy" alt="Darstellung von Jesus Christus, Inhaber von RAIS">
          <div class="team-card__meta">
            <span class="team-card__role">Inhaber</span>
            <h3>Jesus Christus</h3>
            <p>Das Fundament dieser Firma. Das prägt, wie wir arbeiten: ehrlich, klar und mit dem Ziel, anderen verantwortungsvoll beim Wachsen zu helfen.</p>
          </div>
        </article>
      </div>
    </div>

    <div class="vision-block" aria-labelledby="vision-title">
      <span class="mono-label">Unsere Vision</span>
      <h2 class="section-h2" id="vision-title">Das Team ausbauen. Den Maßstab setzen.</h2>
      <p class="section-sub">Wir bauen das Team aus. Ziel: der größte Dienstleister für Prozessautomatisierung mit echtem Mehrwert im DACH-Raum.</p>
    </div>

    <div style="margin-top:3rem;">
      <span class="mono-label">Qualität</span>
      <h2 class="section-h2">Externer Spezialist für Review und Security</h2>
      <p class="section-sub">Code-Review und Sicherheitsaudit durch einen externen Spezialisten. Gegenmittel gegen den Ein-Personen-Einwand, ohne eine erfundene „wir“-Fassade.</p>
    </div>
    <div style="margin-top:3rem;">
      <span class="mono-label">Infrastruktur</span>
      <h2 class="section-h2">EU-Standorte und AVV</h2>
      <table class="infra-table">
        <thead><tr><th>Thema</th><th>Umsetzung</th></tr></thead>
        <tbody>
          <tr><td>Hosting</td><td>Selbst gehostet in der EU</td></tr>
          <tr><td>Datenbank</td><td>Frankfurt (EU)</td></tr>
          <tr><td>Vertrag</td><td>AVV nach Art. 28 DSGVO</td></tr>
          <tr><td>Weitergabe</td><td>Kundendaten bleiben in der EU</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
`
});

page({
  file: 'persoenlichkeit.html',
  active: 'persoenlichkeit',
  title: 'Persönlichkeit | RAIS',
  description: 'Kevin Ritz hinter RAIS: LinkedIn und technische YouTube-Videos zu Automation und KI für den Mittelstand.',
  path: 'persoenlichkeit.html',
  main: `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Persönlichkeit</span>
    <h1>Die Person hinter RAIS</h1>
    <p>Glaubwürdigkeit über LinkedIn und technische Praxis-Videos. Kuratiert, kein Auto-Latest, kein Glaubensformat hier.</p>
  </div>
</section>
<section>
  <div class="section-wrap">
    <span class="mono-label">LinkedIn</span>
    <h2 class="section-h2">Worüber ich auf LinkedIn schreibe</h2>
    <p class="section-sub">Die Themen, zu denen ich dort poste. Business, kein Produktmenü. Der Link führt aufs Profil, nicht auf einen einzelnen Beitrag.</p>
    <div class="person-cards">
      <article class="person-card">
        <p>Automatisierung im Mittelstand: weniger manuelle Qualifizierung, mehr gebuchte Gespräche.</p>
        <a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">Zum LinkedIn-Profil</a>
      </article>
      <article class="person-card">
        <p>Warum Systeme ohne unnötigen SaaS-Lock-in für mittelständische Teams oft besser passen.</p>
        <a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">Zum LinkedIn-Profil</a>
      </article>
      <article class="person-card">
        <p>EU-Hosting und AVV als Trust-Signal: was Geschäftsführer bei Prozess-Systemen prüfen sollten.</p>
        <a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">Zum LinkedIn-Profil</a>
      </article>
    </div>
  </div>
</section>
<section>
  <div class="section-wrap">
    <span class="mono-label">YouTube</span>
    <h2 class="section-h2">Technische Praxis-Videos</h2>
    <p class="section-sub">Einordnung zu Automation und KI für Unternehmer und den Maklerkontext. Lokales Vorschaubild, Link-out zum Video oder Kanal. Kein YouTube-Request und kein eingebetteter Player vor Ihrer Entscheidung dem Link zu folgen.</p>
    <div class="yt-list">
      <a class="yt-thumb-link" href="https://www.youtube.com/@kevin_ritz" target="_blank" rel="noopener noreferrer">
        <img src="images/youtube-curated-thumb.svg" width="1280" height="720" alt="Vorschaubild: Kevin Ritz zu KI und Automation" loading="lazy">
        <div class="yt-thumb-caption">
          <strong>KI und Automation für Unternehmer</strong>
          <p style="margin:0.35rem 0 0;color:var(--stone);">Technische Einordnung ohne Hype. Öffnet YouTube in einem neuen Tab.</p>
        </div>
      </a>
    </div>
    <p class="section-sub" style="margin-top:1.25rem;"><a href="https://www.youtube.com/@kevin_ritz" target="_blank" rel="noopener noreferrer">Kanal @kevin_ritz</a></p>
  </div>
</section>
`
});

const AI_ROADMAP_CAL = 'https://cal.com/ritzaisolutions/immo-ai-roadmap';

page({
  file: 'ai-roadmap.html',
  active: null,
  title: 'Kostenlose KI-Roadmap für Immobilienbetriebe | RAIS',
  description:
    'Kostenloses 60-Minuten-Erstgespräch für Immobilienbetriebe. Danach eine schriftliche KI-Roadmap, die Sie behalten. Ab etwa zehn Vorgängen pro Woche.',
  path: 'ai-roadmap.html',
  extraCss: ['styles/ai-roadmap.css'],
  ogImage: 'og-cover.webp',
  calUrl: AI_ROADMAP_CAL,
  dauer: '60 Minuten',
  bookingAriaLabel: 'KI-Roadmap buchen',
  // Landingpage-Modus: Nav und Footer ohne Seitenlinks. Jeder weitere
  // Link auf dieser Seite ist ein Ausstieg aus dem einzigen Ziel.
  navCta: { ctaHref: '#contact', ctaLabel: 'Erstgespräch buchen', minimal: true },
  stickyHref: '#contact',
  stickyLabel: 'Kostenloses Erstgespräch buchen',
  footerMinimal: true,
  contact: {
    label: 'KI-Roadmap',
    title: 'Termin wählen',
    copy: [],
    calTitle: 'KI-Roadmap buchen',
    calSub: '60 Minuten, kostenlos. Wird aufgezeichnet.',
    // Zeigt, was am Ende in der Hand liegt. Steht bewusst im
    // Buchungsblock und nicht in einer eigenen Sektion: es ist das
    // Ergebnis des Termins, kein zweites Angebot.
    media: `
        <figure class="contact-deliverable">
          <img src="images/cover.webp" alt="Titelseite der schriftlichen Roadmap für Immobilienmakler und Hausverwaltungen" width="1055" height="1491" loading="lazy" decoding="async" onerror="this.parentNode.remove()">
          <figcaption><strong>Ihre Roadmap.</strong> Schriftlich, auf Ihren Betrieb bezogen. Sie behalten sie auch dann, wenn wir nicht zusammenarbeiten.</figcaption>
        </figure>`,
    // Drei Fragen vor dem Kalender. Keine Kontaktdaten: die entstehen
    // erst in der Cal-Maske. cal-embed.js laesst den Container in Ruhe,
    // solange er data-cal-deferred traegt.
    gate: `
        <div class="roadmap-gate" id="roadmap-gate">
          <div class="roadmap-gate__head">
            <span class="roadmap-gate__count" id="gate-count">Frage 1 von 3</span>
            <div class="roadmap-gate__bars" aria-hidden="true">
              <span class="roadmap-gate__bar is-filled" data-gbar="1"></span>
              <span class="roadmap-gate__bar" data-gbar="2"></span>
              <span class="roadmap-gate__bar" data-gbar="3"></span>
            </div>
          </div>
          <p class="roadmap-gate__lead">Drei Fragen, dann sehen Sie den Kalender. Damit ich vorbereitet ins Gespräch gehe.</p>

          <fieldset class="roadmap-gate__q" data-gstep="1">
            <legend>Wo tut es am meisten weh?</legend>
            <div class="roadmap-gate__choice" role="radiogroup" aria-label="Hauptproblem">
              <button type="button" class="roadmap-gate__opt" data-gate="pain" data-value="manuelle-bearbeitung" role="radio" aria-checked="false">Anfragen von Hand bearbeiten kostet zu viel Zeit</button>
              <button type="button" class="roadmap-gate__opt" data-gate="pain" data-value="mieteranliegen" role="radio" aria-checked="false">Mieteranliegen im Griff behalten</button>
              <button type="button" class="roadmap-gate__opt" data-gate="pain" data-value="reaktionszeit" role="radio" aria-checked="false">Zu langsame Reaktion auf neue Anfragen</button>
              <button type="button" class="roadmap-gate__opt" data-gate="pain" data-value="terminierung" role="radio" aria-checked="false">Termine vereinbaren frisst den Tag</button>
            </div>
          </fieldset>

          <fieldset class="roadmap-gate__q" data-gstep="2" hidden>
            <legend>Womit arbeiten Sie?</legend>
            <div class="rq-fields">
              <div>
                <label for="gate-ecosystem">Mail und Kalender</label>
                <select id="gate-ecosystem">
                  <option value="">Bitte wählen</option>
                  <option value="google">Google Workspace</option>
                  <option value="microsoft365">Microsoft 365</option>
                  <option value="imap">Eigener Server per IMAP</option>
                  <option value="gemischt">Gemischt</option>
                  <option value="weiss-nicht">Weiß ich nicht</option>
                </select>
              </div>
              <div>
                <label for="gate-crm">CRM</label>
                <select id="gate-crm">
                  <option value="">Bitte wählen</option>
                  <option value="onoffice">onOffice</option>
                  <option value="propstack">Propstack</option>
                  <option value="flowfact">FlowFact</option>
                  <option value="haufe">Haufe</option>
                  <option value="excel">Excel oder keins</option>
                  <option value="anderes">Anderes</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset class="roadmap-gate__q" data-gstep="3" hidden>
            <legend>Wie viele Vorgänge pro Woche?</legend>
            <p class="roadmap-gate__hint">Anfragen oder Mieteranliegen, je nachdem was bei Ihnen überwiegt.</p>
            <div class="roadmap-slider">
              <div class="roadmap-slider__row">
                <label for="gate-volume">Vorgänge pro Woche</label>
                <span class="roadmap-slider__value" id="gate-volume-out">25</span>
              </div>
              <input id="gate-volume" type="range" min="5" max="150" step="1" value="25">
            </div>
            <label class="lm-check" for="gate-privacy">
              <input type="checkbox" id="gate-privacy" required>
              <span>Ich habe die <a href="datenschutz.html" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a> gelesen und bin einverstanden, dass diese drei Angaben zur Vorbereitung des Gesprächs gespeichert werden.</span>
            </label>
          </fieldset>

          <p class="rq-error" id="gate-error" hidden role="alert"></p>
          <div class="roadmap-gate__nav">
            <button type="button" class="rq-btn-back" id="gate-back" hidden>Zurück</button>
            <button type="button" class="btn-primary" id="gate-submit">Weiter</button>
          </div>
          <p class="roadmap-gate__note">Name, E-Mail und Telefon geben Sie erst im Kalender an, und dort nur einmal.</p>
        </div>
        <p class="roadmap-gate__done" id="gate-done" hidden>Danke. Wählen Sie unten Ihren Termin.</p>`
  },
  extraScripts:
    '\n<script src="scripts/ai-roadmap-funnel.js"></script>\n',
  afterContact: `
<section class="home-band home-band--linen" id="faq" aria-labelledby="roadmap-faq-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-faq-title">Bevor Sie fragen</h2>
    <ul class="akte-register akte-register--faq">
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Und wenn wir danach zusammenarbeiten?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Die Laufzeit beträgt zwölf Monate. Dazu kommt unsere Garantie an Sie: Wenn die vorher gemeinsam festgelegten Ergebnisse nach drei Monaten nicht erreicht sind, kommen Sie ohne Haken aus dem Vertrag und müssen das nicht begründen. Drei Monate braucht ein System, um eingeregelt zu werden. Diese Garantie gibt es, weil Sie mit dem aufgezeichneten Gespräch etwas beigetragen haben. Voraussetzung ist, dass wir Zugang bekommen und Ihr Team das System auch nutzt.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Was kostet es?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Wir nennen keinen öffentlichen Preis, weil der Zuschnitt jedes Systems den Aufwand bestimmt und eine Zahl ohne Kontext niemandem hilft. Der Rahmen hängt an drei Dingen: wie viele Prozesse Sie automatisieren, wie sauber Ihre Daten heute vorliegen, und ob wir den Betrieb übernehmen. Sie bekommen ein schriftliches Angebot mit Umfang, Zeitplan und Preis, bevor irgendetwas gebaut wird.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Können wir unser CRM behalten?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Ja, das ist der Normalfall. Wir bauen an Ihre Systeme an, statt Ihnen eine Plattform zu verkaufen. Jedes CRM, das uns bisher begegnet ist, ließ sich anbinden, unterschiedlich ist nur der Aufwand. Wenn Sie heute mit Excel arbeiten, bauen wir zuerst die Ablage: am Anfang mehr Aufwand, danach sauberer als bei den meisten.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Was ist, wenn mein Team nicht mitzieht?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Die Systeme laufen dort, wo Ihr Team ohnehin arbeitet: im Postfach, im CRM, im Ticketsystem. Es gibt in der Regel keine neue Oberfläche, die jemand lernen muss. Wo doch, gehört die Einweisung zur Übergabe und nicht auf eine Extrarechnung.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Was passiert mit der Aufzeichnung?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Aus dem Gespräch wird ein Beitrag für meinen YouTube-Kanal. Mandantendaten, Objektadressen und Umsatzzahlen kommen nicht ins Video. Sie sehen den Schnitt, bevor er online geht, und Sie können die Freigabe auch danach noch zurückziehen. Wenn Sie gar nicht aufgezeichnet werden möchten, sagen Sie mir vorher Bescheid, dann reden wir trotzdem.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Warum sehe ich hier keine Kundenlogos?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Keine Kundenlogos ohne Mandat, keine erfundenen Prozentzahlen, keine Vorher-Nachher-Werte, die niemand gemessen hat. Jeder Eintrag in unserem Systemkatalog trägt stattdessen einen Stempel, der sagt, wie belastbar er ist: Live im Betrieb, Im Aufbau oder Übertragbar. Aktuell trägt keiner den Stempel Live im Betrieb, weil die Freigaben zur Nennung noch ausstehen. Auch das sagen wir lieber, als es zu verschweigen.</p>
        </div>
      </details></li>
    </ul>
  </div>
</section>

<section class="home-band home-band--cloud" id="rechner" aria-labelledby="roadmap-calc-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-calc-title">Noch unsicher? Rechnen Sie nach</h2>
    <p class="section-sub">Drei Regler, keine Kontaktdaten. Die Zahl gehört Ihnen, auch ohne Termin.</p>
    <div class="rechner roadmap-calc" id="roadmap-calc">
      <div class="roadmap-calc__inputs">
        <div class="roadmap-slider">
          <div class="roadmap-slider__row">
            <label for="rf-volume">Vorgänge pro Woche</label>
            <span class="roadmap-slider__value" id="rf-volume-out">25</span>
          </div>
          <input id="rf-volume" type="range" min="5" max="150" step="1" value="25">
        </div>
        <div class="roadmap-slider">
          <div class="roadmap-slider__row">
            <label for="rf-minutes">Minuten pro Vorgang bis zur Erledigung</label>
            <span class="roadmap-slider__value" id="rf-minutes-out">10</span>
          </div>
          <input id="rf-minutes" type="range" min="3" max="40" step="1" value="10">
        </div>
        <div class="rq-fields">
          <div>
            <label for="rf-rate">Interner Stundensatz in Euro</label>
            <input id="rf-rate" type="number" min="10" max="200" step="1" value="45" inputmode="decimal">
          </div>
        </div>
      </div>
      <div class="roadmap-calc__out">
        <span class="rq-step__eyebrow">Ihr Ergebnis</span>
        <p class="roadmap-result__hours" id="rf-hours"></p>
        <p class="roadmap-result__note" id="rf-bound"></p>
        <p class="roadmap-result__euro" id="rf-euro"></p>
        <p class="roadmap-result__note" id="rf-rate-copy"></p>
        <p class="roadmap-result__preview" id="rf-preview"></p>
        <p class="roadmap-result__disclaimer">Nur aus Ihren eigenen Angaben gerechnet. Wir behaupten nichts über Ihren Betrieb.</p>
        <div class="roadmap-result__cta">
          <a class="btn-primary" href="#contact">Kostenloses Erstgespräch buchen</a>
        </div>
      </div>
      <p class="roadmap-sr" id="rf-live" aria-live="polite"></p>
    </div>
  </div>
</section>
`,
  main: `
<section class="page-hero page-hero--roadmap" aria-labelledby="roadmap-hero-title">
  <div class="page-hero__inner">
    <div class="roadmap-hero">
      <div class="roadmap-hero__copy">
        <span class="mono-label">Für Maklerbüros ab etwa zehn Anfragen pro Woche</span>
        <h1 id="roadmap-hero-title">Wer zuerst antwortet, bekommt den Termin.</h1>
        <p class="roadmap-hero__sub">Die meisten Anfragen verlieren Sie nicht im Gespräch, sondern vorher.</p>
        <ul class="roadmap-hero__offer">
          <li>60 Minuten, kostenlos</li>
          <li>Schriftliche Roadmap, die Sie behalten</li>
          <li>Kein Pitch, kein Angebot im Termin</li>
        </ul>
        <div class="roadmap-hero__actions">
          <a class="btn-primary" href="#contact">Kostenloses Erstgespräch buchen</a>
        </div>
        <p class="roadmap-hero__rec">Das Gespräch wird aufgezeichnet und auf YouTube veröffentlicht. <a href="#gegenleistung">Was das heißt</a></p>
      </div>
      <figure class="roadmap-hero__me">
        <img src="images/profilbild.webp" width="720" height="720" loading="eager" fetchpriority="high" decoding="async" alt="Kevin Ritz, Geschäftsführer von RAIS">
        <figcaption><strong>Kevin Ritz</strong>Sie reden mit mir, nicht mit einem Vertrieb.</figcaption>
      </figure>
    </div>
  </div>
</section>

<aside class="roadmap-disq" aria-label="Qualifizierung">
  <p>Unter etwa zehn Anfragen pro Woche raten wir ab. Da rechnet sich der Aufwand meistens nicht, und das sagen wir lieber jetzt als im Gespräch.</p>
</aside>

<section class="home-band home-band--cloud" aria-labelledby="roadmap-when-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-when-title">Dieselbe Anfrage, zwei Abende</h2>
    <div class="roadmap-when">
      <article class="roadmap-when__col">
        <h3 class="roadmap-when__head">Heute</h3>
        <ol class="roadmap-when__list">
          <li><span class="roadmap-when__t">18:42</span><strong>Anfrage kommt rein</strong><span>Sie sind beim Essen.</span></li>
          <li><span class="roadmap-when__t">09:15</span><strong>Sie sehen sie</strong><span>Zwei Büros haben längst geantwortet.</span></li>
          <li><span class="roadmap-when__t">11:30</span><strong>Sie rufen zurück</strong><span>Die Besichtigung läuft schon.</span></li>
        </ol>
      </article>
      <article class="roadmap-when__col roadmap-when__col--sys">
        <h3 class="roadmap-when__head">Mit System</h3>
        <ol class="roadmap-when__list">
          <li><span class="roadmap-when__t">18:42</span><strong>Anfrage kommt rein</strong><span>Geprüft auf Bedarf und Zeitrahmen.</span></li>
          <li><span class="roadmap-when__t">18:43</span><strong>Antwort mit Terminvorschlag</strong><span>Nach Ihren Kriterien.</span></li>
          <li><span class="roadmap-when__t">18:51</span><strong>Interessent bucht selbst</strong><span>Im CRM, mit Notiz.</span></li>
        </ol>
      </article>
    </div>
    <p class="roadmap-when__note">Illustrativ, keine gemessenen Werte. Das passiert nicht bei jeder Anfrage. Sie erfahren nur nie, bei welchen.</p>
  </div>
</section>

<section class="home-band home-band--linen" aria-labelledby="roadmap-agenda-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-agenda-title">Was in den 60 Minuten passiert</h2>
    <ol class="roadmap-agenda">
      <li>
        <span class="roadmap-agenda__t">0–10</span>
        <div><strong>Ihre Vorgänge</strong><p>Wo es klemmt, in Ihren Worten.</p></div>
      </li>
      <li>
        <span class="roadmap-agenda__t">10–20</span>
        <div><strong>Was Sie schon probiert haben</strong><p>Und warum es nicht gehalten hat.</p></div>
      </li>
      <li>
        <span class="roadmap-agenda__t">20–35</span>
        <div><strong>Was heute geht und was nicht</strong><p>Mit klaren Grenzen statt Hype.</p></div>
      </li>
      <li>
        <span class="roadmap-agenda__t">35–55</span>
        <div><strong>Ein bis zwei Use Cases, konkret</strong><p>Welches Werkzeug, welcher Rahmen, welcher Aufwand.</p></div>
      </li>
      <li>
        <span class="roadmap-agenda__t">55–60</span>
        <div><strong>Ehrliche Einschätzung</strong><p>Auch wenn sie lautet: lohnt sich nicht.</p></div>
      </li>
    </ol>
    <p class="roadmap-agenda__note">Kein Pitch und kein Angebot im Termin. Die schriftliche Roadmap kommt danach.</p>
  </div>
</section>

<section class="home-band home-band--green roadmap-deal" id="gegenleistung" aria-labelledby="roadmap-deal-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-deal-title">Warum das kostenlos ist</h2>
    <p class="section-sub">Aus diesen Gesprächen entstehen meine YouTube-Beiträge. Sie zahlen nichts, ich bekomme den Beitrag. Genau deshalb ist das kein Verkaufsgespräch: Ich habe schon bekommen, wofür ich hier bin.</p>
    <ul class="roadmap-deal__list">
      <li>Keine Mandantendaten, keine Objektadressen, keine Umsatzzahlen im Video.</li>
      <li>Sie sehen den Schnitt vorher und können die Freigabe jederzeit zurückziehen.</li>
      <li>Ohne Kamera geht auch. Sagen Sie vorher kurz Bescheid.</li>
    </ul>
  </div>
</section>

<section class="home-band home-band--cloud" aria-labelledby="roadmap-who-title">
  <div class="section-wrap">
    <div class="roadmap-who__grid">
      <figure class="roadmap-who__media">
        <img src="images/profilbild.webp" width="720" height="720" loading="lazy" decoding="async" alt="Kevin Ritz, Geschäftsführer von RAIS">
      </figure>
      <div class="roadmap-who__copy">
        <h2 class="section-h2" id="roadmap-who-title">Wer im Termin sitzt</h2>
        <p>Kevin Ritz, Geschäftsführer von RAIS aus Koblenz. Sie reden mit mir, nicht mit einem Vertrieb. Wenn wir bauen, baue ich auch selbst.</p>
        <p>Davor bei 1&amp;1, an Systemen, bei denen ein Ausfall sofort Kunden trifft.</p>
        <p class="roadmap-who__channel"><a href="https://www.youtube.com/@kevin_ritz" target="_blank" rel="noopener noreferrer">Kanal @kevin_ritz</a></p>
      </div>
    </div>
  </div>
</section>

<aside class="roadmap-trust" aria-label="Hosting und Datenschutz">
  <p>Selbst gehostet in der EU · Datenbank Frankfurt · AVV nach Art. 28 DSGVO</p>
  <p class="roadmap-trust__proof">Kundenlogos und Prozentzahlen finden Sie hier nicht. Warum nicht, steht in den Fragen unter dem Kalender.</p>
</aside>
`
});

/* ═══════════════════════════════════════════════════════════
   FLAGGSCHIFF-SEITEN

   Eine Seite je Eintrag mit `slug` in systemakte-data.mjs, aktuell
   fuenf. Alles kommt aus dem Datensatz, es gibt keinen handgepflegten
   Text pro Seite: was hier steht, steht auch im Katalog, nur groesser.

   Dateien liegen FLACH IM ROOT. headHtml() nutzt durchgehend relative
   Asset-Pfade (favicon.svg, styles/…, images/…); ein Unterordner wuerde
   saemtliche Links brechen.

   Einstieg ist ausschliesslich referenzen.html, deshalb active:
   'referenzen'. Die Navigation waechst nicht mit.
   ═══════════════════════════════════════════════════════════ */

const ICON_FOR_SYS = [
  [/postfach|mail|newsletter/i, 'i-mail'],
  [/whatsapp|chat|sms/i, 'i-chat'],
  [/telefon/i, 'i-phone'],
  [/kalender|termin/i, 'i-calendar'],
  [/crm|onoffice|propstack|personalsystem|partnerverzeichnis/i, 'i-crm'],
  [/ablage|datei|bild|dokument/i, 'i-files'],
  [/ticket|projekt|board/i, 'i-board'],
  [/warenwirtschaft|shop|produkt|versand|lieferant/i, 'i-box'],
  [/formular|portal|register|website/i, 'i-form'],
  [/buchhaltung|tabelle|zeiterfassung/i, 'i-table'],
  [/wissensbasis|notiz/i, 'i-doc'],
  [/handwerkersoftware|erfassung|werkzeug/i, 'i-tool'],
  [/social/i, 'i-megafon'],
];
const sysIcon = (n) => (ICON_FOR_SYS.find(([re]) => re.test(n)) || [null, 'i-globe'])[1];

const escHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

flagships().forEach((rec) => {
  const flowChain = rec.flow
    .map(
      (s, i) =>
        `${i ? '<li class="akte__flow-arrow" aria-hidden="true"><svg class="ico"><use href="#i-arrow"></use></svg></li>' : ''}<li class="akte__flow-step">${escHtml(s)}</li>`
    )
    .join('');

  const sysList = rec.systems
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(
      (s) =>
        `<li class="akte__sys"><svg class="ico" aria-hidden="true"><use href="#${sysIcon(s)}"></use></svg>${escHtml(s)}</li>`
    )
    .join('');

  page({
    file: `system-${rec.slug}.html`,
    active: 'referenzen',
    title: `${rec.title} | RAIS`,
    description: `${rec.title}: ${rec.trigger} Ablauf, Übergabepunkt und was das System ausdrücklich nicht tut.`,
    path: `system-${rec.slug}.html`,
    main: `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Systemakte · ${escHtml(rec.code)}</span>
    <h1>${escHtml(rec.title)}</h1>
    <p>${escHtml(rec.trigger)}</p>
    <button type="button" class="btn-primary js-open-booking" data-source="system-${escHtml(rec.code)}">Dieses System anfragen</button>
  </div>
</section>

<section class="band-linen" aria-labelledby="sys-bild-title">
  <div class="section-wrap">
    <h2 class="sr-only" id="sys-bild-title">Das System auf einen Blick</h2>
    <div class="system-tiles system-tiles--single">
${renderSystemTile(rec)}
    </div>
  </div>
</section>

<section aria-labelledby="sys-ablauf-title">
  <div class="section-wrap">
    <span class="mono-label">Ablauf</span>
    <h2 class="section-h2 section-h2--anchor" id="sys-ablauf-title">Was das System selbst erledigt</h2>
    <p class="section-sub">Vier Schritte, in dieser Reihenfolge, jedes Mal gleich.</p>
    <ol class="akte__flow akte__flow--large">${flowChain}</ol>

    <div class="sys-handover">
      <span class="mono-label">Übergabe</span>
      <p>${escHtml(rec.handover)}</p>
    </div>

    <span class="mono-label" style="margin-top:2.5rem;">Anbindung</span>
    <h2 class="section-h2">Woran es angeschlossen wird</h2>
    <ul class="akte__systems akte__systems--large">${sysList}</ul>
  </div>
</section>

<!-- Gruener Anker. Die Grenze ist das eigentliche Vertrauenssignal,
     deshalb traegt sie die dunkle Flaeche und nicht den Nebensatz. -->
<section class="surface-green" aria-labelledby="sys-grenze-title">
  <div class="section-wrap">
    <span class="mono-label">Nicht im Zug</span>
    <h2 class="section-h2" id="sys-grenze-title">Was dieses System ausdrücklich nicht tut</h2>
    <p class="section-sub">${escHtml(rec.limit)}</p>
    <p class="sys-grenze-note">Ein System, das seine Grenze nicht kennt, gehört nicht in Ihren Betrieb. Deshalb steht sie hier und nicht im Kleingedruckten.</p>
    <p style="margin-top:2rem;"><a class="home-cta-link" href="referenzen.html">Alle ${systemCount()} Systeme im Katalog</a></p>
  </div>
</section>
`,
  });
});

console.log('multipage HTML generated');
