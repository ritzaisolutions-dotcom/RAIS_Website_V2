import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  headHtml,
  navHtml,
  contactHtml,
  footerHtml,
  bookingModalHtml,
  scriptsHtml,
  i18nScriptsHtml
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
import { renderTechstack } from './techstack-data.mjs';

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
    i18nScriptsHtml +
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
  title: 'KI-Automatisierung für Immobilienunternehmen | RAIS',
  description:
    'Anfragen und Mieteranliegen noch per Hand? Wir zeigen, was sich automatisieren lässt. 60 Minuten, konkreter Plan, kein Pitch.',
  path: 'ai-roadmap.html',
  extraCss: ['styles/ai-roadmap.css'],
  ogImage: 'og-cover.webp',
  calUrl: AI_ROADMAP_CAL,
  dauer: '60 Minuten',
  bookingAriaLabel: 'KI-Roadmap buchen',
  bodyAttrs: 'class="page-roadmap"',
  navCta: { ctaHref: '#contact', ctaLabel: 'KI-Roadmap', minimal: true },
  stickyHref: '#contact',
  stickyLabel: 'KI-Roadmap anfragen',
  footerMinimal: true,
  contact: {
    label: 'KI-Roadmap',
    title: 'Termin wählen',
    copy: [
      'Drei kurze Fragen, dann der Kalender. Die schriftliche Roadmap behalten Sie.',
      'Kein Pitch. Wenn wir keinen sinnvollen Anwendungsfall sehen, sagen wir es Ihnen.'
    ],
    calTitle: 'KI-Roadmap buchen',
    calSub: '60 Minuten, kostenlos.',
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
    '\n<script src="scripts/roadmap-hero-ui.js"></script>\n<script src="scripts/aqut-sim.js"></script>\n<script src="scripts/ai-roadmap-funnel.js"></script>\n',
  afterContact: `
<section class="home-band home-band--linen" id="faq" aria-labelledby="roadmap-faq-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-faq-title">Bevor Sie fragen</h2>
    <ul class="akte-register akte-register--faq">
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Wie läuft die Roadmap ab?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>60 Minuten. Wir schauen uns einen echten Prozess an. Was kostet er heute, was muss ein Mensch machen, was lässt sich automatisieren, was bringt das wirtschaftlich. Danach eine schriftliche Roadmap. Kein Pitch.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Was kostet die spätere Umsetzung?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Kein öffentlicher Preis. Der Aufwand hängt an Prozessen, Datenlage und Betrieb. Sie bekommen ein schriftliches Angebot mit Umfang, Zeitplan und Preis, bevor irgendetwas gebaut wird.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Muss ich meine Software wechseln?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Nein. Wir bauen an Ihre Systeme an. Ein Wechsel ist nie die Voraussetzung.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Welche Systeme können integriert werden?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Jedes CRM, das uns bisher begegnet ist, ließ sich anbinden. Unterschiedlich ist nur der Aufwand. Typisch: onOffice, Propstack, FlowFact, Haufe, Microsoft 365, Google Workspace. Bei Excel bauen wir zuerst die Ablage.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Ist das DSGVO-konform?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Selbst gehostet in der EU, Datenbank Frankfurt, AVV nach Art. 28 DSGVO. Was bei Ihnen angebunden wird und wo Daten liegen, steht in der Roadmap, bevor gebaut wird.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Muss ich technisches Wissen haben?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Für den Betrieb nicht. Sie brauchen jemanden, der fachlich entscheidet, was das System darf, und Freigaben erteilt.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Was passiert nach der Roadmap?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Sie behalten die Roadmap. Wenn es sich lohnt und Sie wollen, bauen wir. Wenn nicht, endet es dort.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Und wenn wir danach zusammenarbeiten?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Laufzeit zwölf Monate. Garantie: Wenn die vorher gemeinsam festgelegten Ergebnisse nach drei Monaten nicht stehen, kommen Sie ohne Haken aus dem Vertrag. Voraussetzung: Zugang und Nutzung durch Ihr Team.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Was passiert mit meinen Daten?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Die drei Qualifizierungsangaben speichern wir zur Gesprächsvorbereitung. Name, E-Mail und Telefon entstehen erst in der Terminbuchung. Details in der Datenschutzerklärung.</p>
        </div>
      </details></li>
      <li><details class="akte akte--frage">
        <summary class="akte__head">
          <span class="akte__title">Warum sehe ich hier keine Kundenlogos?</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
        </summary>
        <div class="akte__body">
          <p>Keine Logos ohne Mandat. Die Zahlen oben kommen vom Beispielsystem AMS und sind gemessen. Freigaben zur Kundennennung stehen noch aus. Auch das sagen wir lieber offen.</p>
        </div>
      </details></li>
    </ul>
  </div>
</section>
`,
  main: `
<section class="page-hero page-hero--roadmap page-hero--roadmap-atmosphere rs-product" aria-labelledby="roadmap-hero-title">
  <div class="page-hero__inner">
    <div class="roadmap-hero roadmap-hero--split">
      <div class="roadmap-hero__copy">
        <span class="mono-label">Für Maklerbüros und Hausverwaltungen</span>
        <h1 id="roadmap-hero-title">Jede vernachlässigte Anfrage kostet Sie bares Geld.</h1>
        <p class="roadmap-hero__sub">Nicht weil Ihre Mitarbeiter schlecht arbeiten. Sondern weil diese Arbeit anfällt, egal wie gut jemand ist.</p>
        <div class="roadmap-hero__actions">
          <a class="btn-primary" href="#vsl">Sehen, wie das automatisiert werden kann</a>
        </div>
      </div>
      <div class="roadmap-hero-ui" id="roadmap-hero-ui" data-phase="0" aria-hidden="true">
        <div class="roadmap-hero-ui__chrome">
          <span class="roadmap-hero-ui__dot"></span>
          <span class="roadmap-hero-ui__dot"></span>
          <span class="roadmap-hero-ui__dot"></span>
          <span class="roadmap-hero-ui__title">Neue Anfrage</span>
        </div>
        <div class="roadmap-hero-ui__meta">
          <span>ImmScout24</span>
          <span>vor 2 Min</span>
        </div>
        <p class="roadmap-hero-ui__snippet">3-Zimmer-Wohnung Koblenz · Kauf · „Können wir diese Woche besichtigen?“</p>
        <ul class="roadmap-hero-ui__checks">
          <li data-check="1"><span class="roadmap-hero-ui__tick" aria-hidden="true"></span>Kaufabsicht prüfen</li>
          <li data-check="2"><span class="roadmap-hero-ui__tick" aria-hidden="true"></span>Vollständigkeit</li>
          <li data-check="3"><span class="roadmap-hero-ui__tick" aria-hidden="true"></span>Bonitätshinweise</li>
        </ul>
        <div class="roadmap-hero-ui__status">
          <span class="roadmap-hero-ui__badge" data-badge>Wartend</span>
          <span class="roadmap-hero-ui__termin" data-termin hidden>Terminlink gesendet</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="home-band home-band--cloud rs-editorial roadmap-band--tight-bottom" aria-labelledby="roadmap-reframe-title">
  <div class="section-wrap roadmap-problem">
    <span class="mono-label">Das Problem</span>
    <h2 class="section-h2 roadmap-problem__hook" id="roadmap-reframe-title">Was Sie in Kauf nehmen</h2>
    <p class="section-sub">Jede vernachlässigte Anfrage kostet Sie Umsatz und Kunden. An mehreren Seiten zugleich.</p>
    <div class="roadmap-hurt" aria-label="Was Sie in Kauf nehmen">
      <article class="roadmap-hurt__card">
        <span class="roadmap-hurt__ico" aria-hidden="true"><svg class="ico"><use href="#i-calendar"></use></svg></span>
        <div class="roadmap-hurt__copy">
          <h3>Verkaufsdauer</h3>
          <p>Ihr Objekt steht länger. Jede Woche, die Sie brauchen, zählt für Ihren Mandanten.</p>
        </div>
      </article>
      <article class="roadmap-hurt__card">
        <span class="roadmap-hurt__ico" aria-hidden="true"><svg class="ico"><use href="#i-mail"></use></svg></span>
        <div class="roadmap-hurt__copy">
          <h3>Verlorener Umsatz</h3>
          <p>Sie haken nicht rechtzeitig nach. Der kaufbereite Interessent ist weg, bevor Sie antworten.</p>
        </div>
      </article>
      <article class="roadmap-hurt__card">
        <span class="roadmap-hurt__ico" aria-hidden="true"><svg class="ico"><use href="#i-hand"></use></svg></span>
        <div class="roadmap-hurt__copy">
          <h3>Team</h3>
          <p>Ihr Team ertrinkt in manueller, unanspruchsvoller Arbeit. Die Moral sinkt. Würdigere Aufgaben bleiben liegen.</p>
        </div>
      </article>
      <article class="roadmap-hurt__card">
        <span class="roadmap-hurt__ico" aria-hidden="true"><svg class="ico"><use href="#i-chat"></use></svg></span>
        <div class="roadmap-hurt__copy">
          <h3>Beratung</h3>
          <p>Sie haben keine Zeit für die Beratung. Die Vorarbeit frisst Ihren Tag.</p>
        </div>
      </article>
      <article class="roadmap-hurt__card">
        <span class="roadmap-hurt__ico" aria-hidden="true"><svg class="ico"><use href="#i-megafon"></use></svg></span>
        <div class="roadmap-hurt__copy">
          <h3>Ruf</h3>
          <p>Sie antworten zu spät. Der Verkauf dauert zu lange. Ihr Ruf leidet, bevor der Abschluss kommt.</p>
        </div>
      </article>
    </div>
    <p class="roadmap-problem__hours">8–10 Stunden. Jede Woche.</p>
    <p class="roadmap-problem__hours-note">Nur die Vorarbeit, die Sie sehen. Ohne den Auftrag, der Ihnen deshalb entgeht.</p>
  </div>
</section>

<section class="home-band home-band--linen rs-data roadmap-band--tight-top" id="rechner" aria-labelledby="roadmap-calc-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-calc-title">Rechnen wir es aus.</h2>
    <p class="section-sub">Ihre Zahlen. Nicht unsere.</p>
    <div class="rechner roadmap-calc roadmap-calc--signature" id="roadmap-calc">
      <div class="roadmap-calc__inputs">
        <div class="roadmap-slider">
          <div class="roadmap-slider__row">
            <label for="rf-volume">Anfragen oder Vorgänge pro Woche</label>
            <span class="roadmap-slider__value" id="rf-volume-out">25</span>
          </div>
          <div class="roadmap-slider__track">
            <input id="rf-volume" type="range" min="5" max="150" step="1" value="25">
            <div class="roadmap-slider__scale" aria-hidden="true">
              <span class="roadmap-slider__mark" style="--p: 0%"><i></i>5</span>
              <span class="roadmap-slider__mark" style="--p: 31.03%"><i></i>50</span>
              <span class="roadmap-slider__mark" style="--p: 65.52%"><i></i>100</span>
              <span class="roadmap-slider__mark" style="--p: 100%"><i></i>150</span>
            </div>
          </div>
        </div>
        <div class="roadmap-slider">
          <div class="roadmap-slider__row">
            <label for="rf-minutes">Minuten pro Vorgang</label>
            <span class="roadmap-slider__value" id="rf-minutes-out">10</span>
          </div>
          <div class="roadmap-slider__track">
            <input id="rf-minutes" type="range" min="3" max="40" step="1" value="10">
            <div class="roadmap-slider__scale" aria-hidden="true">
              <span class="roadmap-slider__mark" style="--p: 0%"><i></i>3</span>
              <span class="roadmap-slider__mark" style="--p: 18.92%"><i></i>10</span>
              <span class="roadmap-slider__mark" style="--p: 45.95%"><i></i>20</span>
              <span class="roadmap-slider__mark" style="--p: 72.97%"><i></i>30</span>
              <span class="roadmap-slider__mark" style="--p: 100%"><i></i>40</span>
            </div>
          </div>
        </div>
        <div class="rq-fields">
          <div>
            <label for="rf-rate">Interner Stundenwert in Euro</label>
            <input id="rf-rate" type="number" min="10" max="200" step="1" value="25" inputmode="decimal">
          </div>
        </div>
      </div>
      <div class="roadmap-calc__out">
        <span class="rq-step__eyebrow">Geschätzte Personalkosten</span>
        <p class="roadmap-result__euro roadmap-result__euro--hero" id="rf-euro"></p>
        <p class="roadmap-result__scope">nur für manuelle Vorarbeit</p>
        <p class="roadmap-result__hours" id="rf-hours"></p>
        <p class="roadmap-result__note" id="rf-bound"></p>
        <p class="roadmap-result__note" id="rf-rate-copy"></p>
        <p class="roadmap-result__preview" id="rf-preview"></p>
        <p class="roadmap-result__cost-note">Und das ist nur die Zeit, die Sie sehen. Die Anfrage, die am Samstagabend eingeht und Montagmorgen auf Platz 40 liegt, steht auf keiner Lohnabrechnung. Der Auftrag, der deshalb woanders landet, auch nicht.</p>
        <p class="roadmap-result__disclaimer">Nur aus Ihren eigenen Angaben gerechnet. Wir behaupten nichts über Ihren Betrieb.</p>
      </div>
      <p class="roadmap-sr" id="rf-live" aria-live="polite"></p>
    </div>
  </div>
</section>

<section class="home-band rs-contrast roadmap-band--system" aria-labelledby="roadmap-process-title">
  <div class="section-wrap roadmap-process">
    <div class="roadmap-process__head">
      <div class="roadmap-process__copy">
        <h2 class="section-h2" id="roadmap-process-title">Erst der Prozess. Dann die KI.</h2>
        <p class="section-sub">Daten und Prozesse zuerst als Fundament.</p>
        <p>Wer auf KI baut, ohne Fundament, baut instabil. Es braucht klar definierte Standardprozesse und eine saubere Datenmenge, bevor KI überhaupt angegangen wird. Sonst werden die Ergebnisse nicht besser.</p>
        <p>KI auf einen Scherbenhaufen zu setzen macht alles nur schlimmer.</p>
      </div>
      <figure class="roadmap-visual roadmap-visual--process">
        <img src="images/roadmap/bg-process.png" width="1600" height="900" alt="Kran und Datenbank als Fundament: Prozesse und Daten zuerst." loading="lazy" decoding="async">
      </figure>
    </div>
    <div class="roadmap-process__cols">
      <article class="roadmap-process__col roadmap-process__col--wrong">
        <span class="roadmap-process__tag">Falsch</span>
        <h3>Tool first</h3>
        <ol>
          <li>Modell wählen</li>
          <li>Prompt schreiben</li>
          <li>Irgendwas anbinden</li>
          <li>Hoffen, dass es passt</li>
        </ol>
      </article>
      <article class="roadmap-process__col roadmap-process__col--rais">
        <span class="roadmap-process__tag">RAIS</span>
        <h3>Prozess first</h3>
        <ol>
          <li>Prozess</li>
          <li>Daten</li>
          <li>Entscheidungspunkte</li>
          <li>System</li>
        </ol>
      </article>
    </div>
    <p class="roadmap-process__punch">Ist nur die falsche Reihenfolge.</p>
    <p>Erst muss klar sein, was passieren soll. Dann kann ein System die Arbeit übernehmen.</p>
  </div>
</section>

<section class="home-band home-band--linen rs-product" id="vsl" aria-labelledby="roadmap-vsl-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-vsl-title">Wie das bei Ihnen konkret aussehen kann</h2>
    <p class="section-sub">Keine Theorie. Wir nehmen einen echten Prozess aus einem Immobilienunternehmen und zeigen, was davon automatisiert werden kann.</p>
    <div class="roadmap-vsl" id="roadmap-vsl">
      <button type="button" class="roadmap-vsl__play" id="vsl-play" aria-label="Video abspielen">
        <img class="roadmap-vsl__poster" src="images/profilbild.webp" width="1280" height="720" alt="" loading="lazy" decoding="async">
        <span class="roadmap-vsl__btn" aria-hidden="true"></span>
        <span class="roadmap-vsl__label">Video ansehen</span>
      </button>
      <p class="roadmap-vsl__pending" id="vsl-pending" hidden>Das Video folgt in Kürze. Bis dahin: Prozess und Zahlen darunter.</p>
    </div>
    <div class="roadmap-vsl__cta">
      <a class="btn-primary" href="#contact">KI-Roadmap anfragen</a>
    </div>
  </div>
</section>

<section class="home-band home-band--cloud rs-product" aria-labelledby="roadmap-workflow-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-workflow-title">So läuft eine Anfrage durch</h2>
    <p class="section-sub">ImmScout24 bis CRM. Ohne manuelle Vorarbeit dazwischen.</p>
    <div class="aqut-sim aqut-sim--story" id="aqut-sim" data-step="0">
      <ol class="aqut-sim__story" aria-label="Anfrage-Workflow">
        <li class="aqut-sim__node" data-node="1">
          <span class="aqut-sim__pulse" aria-hidden="true"></span>
          <strong>ImmScout24</strong>
          <span>Anfrage trifft ein</span>
        </li>
        <li class="aqut-sim__node" data-node="2">
          <span class="aqut-sim__pulse" aria-hidden="true"></span>
          <strong>RAIS Analyse</strong>
          <span>Bedarf, Zeitrahmen, Vollständigkeit</span>
        </li>
        <li class="aqut-sim__node" data-node="3">
          <span class="aqut-sim__pulse" aria-hidden="true"></span>
          <strong>Qualifiziert</strong>
          <span>Status A-LEAD</span>
        </li>
        <li class="aqut-sim__node" data-node="4">
          <span class="aqut-sim__pulse" aria-hidden="true"></span>
          <strong>Termin</strong>
          <span>Buchungslink gesendet</span>
        </li>
        <li class="aqut-sim__node" data-node="5">
          <span class="aqut-sim__pulse" aria-hidden="true"></span>
          <strong>CRM</strong>
          <span>Notiz und Status</span>
        </li>
      </ol>
      <div class="aqut-sim__card" id="aqut-sim-card">
        <span class="aqut-sim__card-label">Live-Status</span>
        <p id="aqut-sim-status">Bereit. Starten Sie die Simulation.</p>
      </div>
      <div class="aqut-sim__actions">
        <button type="button" class="btn-primary" id="aqut-sim-play">Demo Anfrage testen</button>
        <button type="button" class="home-cta-link" id="aqut-sim-reset" hidden>Zurücksetzen</button>
      </div>
    </div>
  </div>
</section>

<section class="home-band rs-contrast roadmap-band--human" aria-labelledby="roadmap-human-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-human-title">Nicht alles sollte automatisiert werden.</h2>
    <p class="section-sub">KI ist ein Werkzeug, um Ihr Team zu entlasten. Kein Ersatz für den einzigartigen menschlichen Kontakt.</p>
    <div class="roadmap-human roadmap-human--compact">
      <article class="roadmap-human__col roadmap-human__col--mensch">
        <figure class="roadmap-human__thumb">
          <img src="images/roadmap/bg-human.png" width="800" height="900" alt="Makler im Anzug, Mensch-Seite." loading="lazy" decoding="async">
        </figure>
        <h3>Mensch</h3>
        <ul>
          <li>Beratung</li>
          <li>Verhandlung</li>
          <li>Abschluss</li>
          <li>Verantwortung</li>
        </ul>
      </article>
      <div class="roadmap-human__bridge" aria-hidden="true"><span>RAIS</span></div>
      <article class="roadmap-human__col roadmap-human__col--system">
        <figure class="roadmap-human__thumb">
          <img src="images/roadmap/bg-system.png" width="800" height="900" alt="System-Roboter, Maschinen-Seite." loading="lazy" decoding="async">
        </figure>
        <h3>System</h3>
        <ul>
          <li>Erfassen</li>
          <li>Prüfen</li>
          <li>Qualifizieren</li>
          <li>Terminieren</li>
        </ul>
      </article>
    </div>
  </div>
</section>

<section class="home-band home-band--linen rs-product" aria-labelledby="roadmap-cases-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-cases-title">Wo das greift</h2>
    <p class="section-sub">Wiederkehrende Vorarbeit. Kein Ersatz für Fachurteil.</p>
    <div class="roadmap-cases roadmap-cases--dense">
      <article class="roadmap-cases__card">
        <span class="roadmap-cases__ico" aria-hidden="true"><svg class="ico"><use href="#i-mail"></use></svg></span>
        <h3>Interessentenanfragen</h3>
        <p>Erfassen, verstehen, qualifizieren, beantworten.</p>
      </article>
      <article class="roadmap-cases__card">
        <span class="roadmap-cases__ico" aria-hidden="true"><svg class="ico"><use href="#i-chat"></use></svg></span>
        <h3>Mieteranliegen</h3>
        <p>Aufnehmen, zuordnen, nächsten Schritt vorbereiten.</p>
      </article>
      <article class="roadmap-cases__card">
        <span class="roadmap-cases__ico" aria-hidden="true"><svg class="ico"><use href="#i-calendar"></use></svg></span>
        <h3>Terminvereinbarung</h3>
        <p>Verfügbarkeiten, Koordination, Nachfassen.</p>
      </article>
      <article class="roadmap-cases__card">
        <span class="roadmap-cases__ico" aria-hidden="true"><svg class="ico"><use href="#i-crm"></use></svg></span>
        <h3>CRM</h3>
        <p>Strukturieren und in bestehende Systeme schreiben.</p>
      </article>
      <article class="roadmap-cases__card">
        <span class="roadmap-cases__ico" aria-hidden="true"><svg class="ico"><use href="#i-doc"></use></svg></span>
        <h3>Dokumente</h3>
        <p>Daten extrahieren, strukturieren, weitergeben.</p>
      </article>
      <article class="roadmap-cases__card">
        <span class="roadmap-cases__ico" aria-hidden="true"><svg class="ico"><use href="#i-table"></use></svg></span>
        <h3>Reporting</h3>
        <p>Zahlen zusammenführen, Reports vorbereiten.</p>
      </article>
    </div>
  </div>
</section>

<section class="home-band home-band--cloud rs-data" aria-labelledby="roadmap-proof-title">
  <div class="section-wrap">
    <span class="mono-label">Beispielsystem AMS</span>
    <h2 class="section-h2" id="roadmap-proof-title">15 Stunden auf 2 Minuten.</h2>
    <p class="roadmap-proof__lead">Erstreaktion. Gemessen am Beispielsystem AMS, nicht an einem erfundenen Vorher-Nachher.</p>
    <div class="roadmap-proof__stats roadmap-proof__stats--hero">
      <div class="roadmap-proof__stat">
        <span class="roadmap-proof__num" data-proof-count>15h → 2min</span>
        <span class="roadmap-proof__label">Reaktionszeit</span>
      </div>
      <div class="roadmap-proof__stat">
        <span class="roadmap-proof__num">~40h</span>
        <span class="roadmap-proof__label">manuelle Arbeit weniger pro Monat</span>
      </div>
    </div>
    <div class="roadmap-who__grid roadmap-proof__kevin">
      <figure class="roadmap-who__media">
        <img src="images/profilbild.webp" width="720" height="720" loading="lazy" decoding="async" alt="Kevin Ritz, Geschäftsführer von RAIS">
      </figure>
      <div class="roadmap-who__copy">
        <h3>Kevin Ritz</h3>
        <p>Geschäftsführer von RAIS aus Koblenz. Sie reden mit mir, nicht mit einem Vertrieb. Wenn wir bauen, baue ich auch selbst.</p>
        <p>Davor bei 1&amp;1, an Systemen, bei denen ein Ausfall sofort Kunden trifft. Als KI-Datenanalyst für Qualitätsmanagement weiß ich, wie existenziell der Erfolg von KI-Infrastrukturen an Überprüfung und Monitoring der Antwortqualität hängt.</p>
        <p>KI ohne prüfende Instanzen bringt Unvorhersehbarkeit. KI mit den richtigen Schutzebenen bringt Arbeitsentlastung und echtes gespartes Geld für Ihr Unternehmen.</p>
      </div>
    </div>
  </div>
</section>

<section class="home-band home-band--linen rs-contrast" aria-labelledby="roadmap-antihype-title">
  <div class="section-wrap roadmap-antihype">
    <h2 class="section-h2" id="roadmap-antihype-title">Brauchen Sie wirklich das neueste KI-Modell?</h2>
    <p class="roadmap-antihype__answer">Wahrscheinlich nicht.</p>
    <p>Das teuerste Modell macht Ihren Prozess nicht besser. Eine Anfrage lesen, sortieren und weiterleiten braucht kein Spitzenmodell. Oft reicht ein günstigeres, das den Job zuverlässig erledigt.</p>
    <p>Wir wählen danach, was sich rechnet. Nicht danach, was gerade laut vermarktet wird.</p>
    <p class="roadmap-antihype__punch"><strong>KI muss Geld sparen. Sonst ist es Spielzeug.</strong></p>
    <p class="roadmap-antihype__stack-lead">Deshalb der Stack: mehrere Werkzeuge und Modelle. Was zum Prozess passt, bleibt.</p>
${renderTechstack()}
  </div>
</section>

<section class="home-band home-band--cloud rs-editorial" id="angebot" aria-labelledby="roadmap-offer-title">
  <div class="section-wrap">
    <div class="roadmap-offer">
      <div class="roadmap-offer__copy">
        <span class="mono-label">Das Angebot</span>
        <h2 class="section-h2" id="roadmap-offer-title">Wir finden heraus, wo es bei Ihnen Sinn ergibt.</h2>
        <p class="section-sub">Die kostenlose KI-Roadmap. Kein Beratungsgespräch. Ein Prozess-Check.</p>
        <ul class="roadmap-offer__checks">
          <li>Was kostet der Prozess heute?</li>
          <li>Was davon muss wirklich ein Mensch machen?</li>
          <li>Was kann automatisiert werden?</li>
          <li>Was würde das wirtschaftlich bringen?</li>
        </ul>
        <p class="roadmap-offer__meta">60 Minuten. Konkreter Plan. Kein vorbereiteter Pitch.</p>
        <p class="roadmap-offer__trust"><strong>Kein Verkaufsgespräch.</strong> Wenn wir keinen sinnvollen Anwendungsfall sehen, sagen wir es Ihnen.</p>
        <a class="btn-primary" href="#contact">KI-Roadmap anfragen</a>
      </div>
      <figure class="contact-deliverable roadmap-offer__media">
        <img src="images/cover.webp" alt="Titelseite der schriftlichen Roadmap für Immobilienmakler und Hausverwaltungen" width="1055" height="1491" loading="lazy" decoding="async" onerror="this.parentNode.remove()">
        <figcaption><strong>Ihre Roadmap.</strong> Schriftlich. Sie behalten sie auch dann, wenn wir nicht zusammenarbeiten.</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="rs-editorial roadmap-qual-strip" aria-labelledby="roadmap-qual-title">
  <div class="section-wrap">
    <h2 class="section-h2" id="roadmap-qual-title">Nicht jeder braucht KI.</h2>
    <p class="section-sub">Ehrlich gesagt: Unter einer klaren Schwelle raten wir ab. Darüber lohnt der Prozess-Check.</p>
    <div class="roadmap-qual">
      <article class="roadmap-qual__no">
        <h3>Eher nicht</h3>
        <ul>
          <li>Unter etwa zehn Vorgängen pro Woche</li>
          <li>Kein wiederkehrender Ablauf</li>
          <li>Niemand trägt den Prozess wirklich</li>
          <li>Jeder Fall ist jedes Mal anders</li>
        </ul>
      </article>
      <article class="roadmap-qual__yes">
        <h3>Dann schon</h3>
        <ul>
          <li>Täglich gleiche Anfragen oder Mieterfälle</li>
          <li>Portal und Mail laufen parallel</li>
          <li>Vorarbeit blockiert die Beratung</li>
          <li>Das Team stapelt, statt zu schließen</li>
        </ul>
      </article>
    </div>
    <p class="roadmap-qual__hard">Unter etwa zehn Vorgängen pro Woche rechnet sich der Aufwand meistens nicht. Dann sagen wir es Ihnen.</p>
  </div>
</section>

<section class="home-band rs-contrast roadmap-band--system roadmap-final" aria-labelledby="roadmap-final-title">
  <div class="roadmap-orbit" aria-hidden="true">
    <div class="roadmap-orbit__core">
      <img src="favicon.svg" width="48" height="48" alt="">
      <span>RAIS</span>
    </div>
    <div class="roadmap-orbit__ring">
      <span class="roadmap-orbit__node roadmap-orbit__node--1"></span>
      <span class="roadmap-orbit__node roadmap-orbit__node--2"></span>
      <span class="roadmap-orbit__node roadmap-orbit__node--3"></span>
      <span class="roadmap-orbit__node roadmap-orbit__node--4"></span>
      <span class="roadmap-orbit__dot roadmap-orbit__dot--1"></span>
      <span class="roadmap-orbit__dot roadmap-orbit__dot--2"></span>
      <span class="roadmap-orbit__dot roadmap-orbit__dot--3"></span>
      <span class="roadmap-orbit__dot roadmap-orbit__dot--4"></span>
    </div>
  </div>
  <div class="section-wrap roadmap-final__inner">
    <h2 class="section-h2" id="roadmap-final-title">Rechnen wir es für Ihr Unternehmen aus.</h2>
    <p class="section-sub">Ihre Zahlen. Nicht unsere.</p>
    <a class="btn-primary" href="#contact">KI-Roadmap anfragen</a>
  </div>
</section>
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
