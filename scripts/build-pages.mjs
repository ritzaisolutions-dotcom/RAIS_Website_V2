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

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function page({ file, active, title, description, path, main, extraScripts = '' }) {
  const html =
    headHtml({ title, description, path }) +
    navHtml(active) +
    `<main id="main">${main}</main>` +
    contactHtml +
    footerHtml +
    bookingModalHtml +
    extraScripts +
    scriptsHtml;
  writeFileSync(resolve(root, file), html, 'utf8');
  console.log('wrote', file);
}

page({
  file: 'aqut.html',
  active: 'systeme',
  title: 'AQuT | Anfragen-System von RAIS',
  description:
    'AQuT von RAIS: Portalanfragen qualifizieren und Termine buchen. Bei hohem Volumen oft 20 bis 35 Stunden pro Woche zurück.',
  path: 'aqut.html',
  main: `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">System von RAIS</span>
    <h1>AQuT: weniger manuelle Anfragenbearbeitung, mehr gebuchte Erstgespräche</h1>
    <p>Bei hohem Anfragevolumen oft im Bereich von 20 bis 35 Stunden pro Woche, abhängig von Ihrem Volumen. Erstreaktion von durchschnittlich 15 Stunden auf 2 Minuten. Der Rechner darunter rechnet mit Ihren Angaben.</p>
    <button type="button" class="btn-primary js-open-booking" data-source="aqut-hero">Kostenlose Beratungsstunde buchen</button>
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
        <button type="button" class="btn-primary js-open-booking rq-btn-cta" id="rq-cta" data-source="aqut-rechner" hidden>Kostenlose Beratungsstunde buchen</button>
      </div>
      <details>
        <summary>Optional: Übergang zum Umsatzargument</summary>
        <p class="section-sub" style="margin-top:0.75rem;">Verlorene Bearbeitungszeit ist nicht nur Personalkosten. Sie ist der Vorlauf zu verlorenen Abschlüssen. Im 60-minütigen Audit prüfen wir das anhand Ihrer echten Anfragedaten.</p>
      </details>
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
    <h2 class="section-h2">Was AQuT konkret liefert</h2>
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
        <p>Systeme laufen selbst gehostet in Deutschland, Datenbank in Frankfurt. AVV nach Art. 28 DSGVO. Keine Datenweitergabe außerhalb der EU ohne Rechtsgrundlage.</p>
      </details>
      <details>
        <summary>Funktioniert AQuT mit onOffice oder Propstack?</summary>
        <p>Ja, Anbindung an bestehende CRMs ist Teil des Setups, sofern API und Freigaben vorliegen. Ohne CRM bauen wir eine schlanke eigene Datenhaltung.</p>
      </details>
      <details>
        <summary>Wie lange dauert Setup bis Go-Live?</summary>
        <p>Abhängig von Zugängen, Kalender und Qualifizierungskriterien. Im Audit klären wir eine realistische Timeline für Ihr Büro.</p>
      </details>
      <details>
        <summary>Für welche Teamgröße passt AQuT?</summary>
        <p>Für unabhängige Maklerbüros mit etwa 5 bis 25 Mitarbeitenden und spürbarem Portalvolumen. Solo-Makler, Franchise und bankgebundene Agenturen sind nicht die Zielgruppe.</p>
      </details>
    </div>
    <p style="margin-top:2rem;">
      <button type="button" class="btn-primary js-open-booking" data-source="aqut-faq">Kostenlose Beratungsstunde buchen</button>
    </p>
  </div>
</section>
`,
  extraScripts: '\n<script src="scripts/aqut-rechner.js"></script>\n'
});

page({
  file: 'referenzen.html',
  active: 'referenzen',
  title: 'Referenzen | RAIS',
  description: 'Referenzen von RAIS. Haller Immobilienberatung GmbH als erste öffentliche Case Study.',
  path: 'referenzen.html',
  main: `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Referenzen</span>
    <h1>Beweisen, nicht behaupten</h1>
    <p>Öffentliche Referenzierung nur mit Freigabe. Aktuell: Haller Immobilienberatung GmbH.</p>
  </div>
</section>
<section>
  <div class="section-wrap case-story">
    <span class="mono-label">Case Study</span>
    <h2 class="section-h2">Haller Immobilienberatung GmbH</h2>

    <h3>Ausgangslage</h3>
    <p>Hohes Anfragevolumen über Immobilienportale. Qualifizierung und Terminabstimmung liefen manuell: Mails lesen, Rückfragen schreiben, Termine per Hin und Her finden. Kapazität im Büro ging in Vorarbeit statt in passende Erstgespräche.</p>

    <h3>Was gebaut wurde</h3>
    <p>AQuT im Scope Paket 1: Portalanfragen erfassen und dem Objekt zuordnen, Kauf oder Miete erkennen, fehlende Angaben per automatischer Rückfrage klären, personalisierten Terminlink ausspielen, Termine in den Kalender schreiben und Anfragen in einer Übersicht durchsuchbar halten.</p>

    <h3>Wie der Alltag läuft</h3>
    <ol class="list-plain list-plain--ordered">
      <li>Portalanfrage kommt rein und wird dem Objekt zugeordnet.</li>
      <li>Das System qualifiziert und fragt nach, wenn Angaben fehlen.</li>
      <li>Der Interessent bucht selbst; der Termin landet im Kalender des Büros.</li>
    </ol>

    <h3>Status</h3>
    <p>Die Referenz ist öffentlich freigegeben. Eine belastbare Kennzahl aus dem Live-Betrieb (Stunden, Abschlussrate oder Antwortzeit) folgt, sobald sie gemessen und freigegeben ist. Bis dahin keine erfundenen Prozent- oder Euro-Claims zu diesem Kunden.</p>

    <p style="margin-top:2rem;"><button type="button" class="btn-primary js-open-booking" data-source="referenzen">Kostenlose Beratungsstunde buchen</button></p>
    <div class="case-slot case-slot--quiet" aria-hidden="true"></div>
    <div class="case-slot case-slot--quiet" aria-hidden="true"></div>
  </div>
</section>
`
});

page({
  file: 'zusammenarbeit.html',
  active: null,
  title: 'So arbeiten wir | RAIS',
  description: 'Zusammenarbeit mit RAIS: von Discovery bis Betrieb, klar und ohne Umwege.',
  path: 'zusammenarbeit.html',
  main: `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Zusammenarbeit</span>
    <h1>So läuft die Zusammenarbeit</h1>
    <p>Vom ersten Gespräch bis zum stabilen Betrieb. Sie wissen in jedem Schritt, woran Sie sind.</p>
  </div>
</section>
<section>
  <div class="section-wrap">
    <div id="collab-path" data-active-step="1" tabindex="0" aria-label="Zusammenarbeit in sieben Schritten">
      <div class="collab-nav" role="tablist">
        ${[1,2,3,4,5,6,7].map((n) => `<button type="button" data-step-btn="${n}" aria-label="Schritt ${n}">${n}</button>`).join('')}
      </div>
      ${[
        ['Discovery', 'Kostenloses Erstgespräch. Wir schauen uns Ihre Prozesse an. Ergebnis: Sie wissen, was möglich ist.'],
        ['Angebot', 'Scope, Timeline und Preis. Konkret, schriftlich, ohne Überraschungen.'],
        ['Kickoff', 'Vertrag und Onboarding. Rollen, Zugänge, Meilensteine.'],
        ['Entwicklung', 'Wir bauen das System in Iterationen und halten Sie im Loop.'],
        ['Testing', 'Gemeinsames Prüfen mit echten Abläufen Ihres Büros.'],
        ['Go-Live', 'Übergabe, Schulung, stabile Produktivnahme.'],
        ['Betrieb', 'Begleitung nach dem Go-Live, klarer Ansprechpartner.']
      ].map((pair, i) => `
      <article class="collab-step" data-step="${i + 1}">
        <span class="mono-label">Schritt ${i + 1}</span>
        <h2 class="section-h2" style="margin-top:0.35rem;">${pair[0]}</h2>
        <p class="section-sub">${pair[1]}</p>
      </article>`).join('')}
      <div class="collab-controls">
        <button type="button" id="collab-prev">Zurück</button>
        <span id="collab-counter" aria-live="polite">Schritt 1 von 7</span>
        <button type="button" id="collab-next">Weiter</button>
      </div>
    </div>
    <div style="margin-top:3rem;">
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
  description: 'Kevin Ritz, Gründer von RAIS in Koblenz. Direkter Zugang, EU-Infrastruktur, externer Security-Review.',
  path: 'ueber-uns.html',
  main: `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Über uns</span>
    <h1>Gründer. Aus Koblenz. Für Maklerbüros.</h1>
    <p>Sie arbeiten direkt mit mir. Transparent, DSGVO-konform, ohne unnötigen SaaS-Ballast.</p>
  </div>
</section>
<section>
  <div class="section-wrap">
    <div class="about-grid">
      <img src="images/prof_bild.jpg" width="240" height="320" loading="lazy" alt="Kevin Ritz, Gründer von RAIS">
      <div>
        <p>Ich bin Kevin Ritz, Gründer von RAIS aus Koblenz. Mich treibt das Optimieren von Prozessen an, die allen Beteiligten die Arbeit leichter machen. Effizienz ist kein Buzzword, sie ist der Grund, warum es RAIS gibt.</p>
        <p>Was wir gemeinsam entwickeln, ist nachvollziehbar und auf Ihren Alltag zugeschnitten. Klein, direkt, persönlich.</p>
        <p><a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
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
          <tr><td>Hosting</td><td>Selbst gehostet in Deutschland</td></tr>
          <tr><td>Datenbank</td><td>Frankfurt (EU)</td></tr>
          <tr><td>Vertrag</td><td>AVV nach Art. 28 DSGVO</td></tr>
          <tr><td>Weitergabe</td><td>Keine Datenweitergabe außerhalb der EU ohne Rechtsgrundlage</td></tr>
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
  description: 'Kevin Ritz hinter RAIS: LinkedIn und technische YouTube-Videos zu Automation und KI im Unternehmer- und Maklerkontext.',
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
        <p>Automatisierung in Maklerbüros: weniger manuelle Qualifizierung, mehr gebuchte Gespräche.</p>
        <a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">Zum LinkedIn-Profil</a>
      </article>
      <article class="person-card">
        <p>Warum Systeme ohne unnötigen SaaS-Lock-in für mittelständische Teams oft besser passen.</p>
        <a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">Zum LinkedIn-Profil</a>
      </article>
      <article class="person-card">
        <p>EU-Hosting und AVV als Trust-Signal: was Makler-GFs bei Prozess-Systemen prüfen sollten.</p>
        <a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">Zum LinkedIn-Profil</a>
      </article>
    </div>
  </div>
</section>
<section>
  <div class="section-wrap">
    <span class="mono-label">YouTube</span>
    <h2 class="section-h2">Technische Praxis-Videos</h2>
    <p class="section-sub">Einordnung zu Automation und KI für Unternehmer und den Maklerkontext. Lokales Vorschaubild, Link-out zum Video oder Kanal. Kein YouTube-Request und kein eingebetteter Player vor Ihrer Entscheidung dem Link zu folgen. Weitere Einträge kommen dazu, sobald freigegeben.</p>
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

console.log('multipage HTML generated');
