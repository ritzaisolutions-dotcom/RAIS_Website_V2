export const amsMain = `<section class="page-hero page-hero--aqut" id="eroeffnung">
  <div class="page-hero__inner">
    <span class="mono-label">System von RAIS · Flaggship</span>
    <h1>AMS: Anfragen, die heute liegen bleiben, sind Abschlüsse, die nicht kommen.</h1>
    <p>Ein verlorener Vorgang kostet nicht nur Bearbeitungszeit. Er kostet den Vorlauf zu einem Abschluss. Rechnen Sie das unten mit Ihren eigenen Zahlen. Keine behauptete Quote von uns.</p>
    <button type="button" class="btn-primary js-open-booking" data-source="aqut-hero">Kostenlosen KI-Audit buchen</button>
  </div>
</section>

<section id="rechner">
  <div class="section-wrap" style="padding-top:2rem;">
    <span class="mono-label">Ihre Rechnung</span>
    <h2 class="section-h2">Rechner: nach Ihren eigenen Angaben</h2>
    <p class="section-sub">Keine Lead-Erfassung. Keine Kontaktdaten. Nur Aufklärung aus Ihren Zahlen: Mailbearbeitung plus Mailbox-Nachtelefonate. CRM und Anbindung klären wir im Discovery-Call, onOffice und Propstack sind Beispiele, kein Ausschluss.</p>
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
        <p class="rq-crm-note">Bestehendes CRM bleibt. onOffice und Propstack sind häufige Anbindungen in der Immobilien-Referenz. Andere Systeme prüfen wir im Audit.</p>
      </div>

      <p class="rq-error" id="rq-error" hidden role="alert"></p>

      <div class="rq-nav">
        <button type="button" class="rq-btn-back" id="rq-back" hidden>Zurück</button>
        <button type="button" class="rq-btn-reset" id="rq-reset" hidden>Werte anpassen</button>
        <button type="button" class="rq-btn-next" id="rq-next">Weiter</button>
        <button type="button" class="btn-primary js-open-booking rq-btn-cta" id="rq-cta" data-source="aqut-rechner" hidden>Kostenlosen KI-Audit buchen</button>
      </div>
    </div>
    <p class="section-sub" style="margin-top:1.5rem;">Im Audit prüfen wir das anhand Ihrer echten Anfragedaten. Messbare Kriterien vor Projektstart.</p>
  </div>
</section>

<section id="prozess">
  <div class="section-wrap">
    <span class="mono-label">Prozess</span>
    <h2 class="section-h2">Vier Schritte von der Anfrage zum Termin</h2>
    <p class="section-sub">Exemplarisch für Immobilien-Portalanfragen. Dasselbe Muster gilt für vergleichbare B2B-Eingänge.</p>
    <div class="steps-4">
      <article><h3>Anfrage kommt rein</h3><p>Portal-Mail, Formular oder Postfach wird erfasst und dem Vorgang zugeordnet.</p></article>
      <article><h3>Qualifizierung</h3><p>Kauf oder Miete, fehlende Angaben, automatische Rückfrage.</p></article>
      <article><h3>Terminbuchung</h3><p>Interessent wählt selbst, Termin landet im Kalender.</p></article>
      <article><h3>Übergabe</h3><p>Notiz und Einordnung im CRM. Ihr Team gibt frei, was den Interessenten verbindlich betrifft.</p></article>
    </div>
  </div>
</section>

<section class="aqut-sim-section" aria-labelledby="aqut-sim-title" id="simulation">
  <div class="section-wrap">
    <span class="mono-label">So sieht das aus</span>
    <h2 class="section-h2" id="aqut-sim-title">Eine Anfrage durch AMS</h2>
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

<section id="lieferung">
  <div class="section-wrap">
    <span class="mono-label">Paket 1</span>
    <h2 class="section-h2">Was AMS konkret liefert</h2>
    <p class="section-sub">Das Setup für den Qualifizierungsalltag. Pro Punkt: was es tut, wie es aussieht, was es ausdrücklich nicht tut.</p>
    <ol class="deliver-list">
      <li class="deliver-item">
        <h3><span class="deliver-item__num" aria-hidden="true">1</span> Anfragen aufnehmen</h3>
        <p>Portalanfrage, Website-Formular oder Mail landet im System und wird dem Vorgang zugeordnet.</p>
        <p class="deliver-item__see"><a href="#simulation">So sieht das aus</a></p>
        <p class="deliver-item__limit"><span>Nicht im Zug</span> Keine Absage an Interessenten ohne menschliche Freigabe.</p>
      </li>
      <li class="deliver-item">
        <h3><span class="deliver-item__num" aria-hidden="true">2</span> Qualifizieren und nachfragen</h3>
        <p>Kauf oder Miete erkennen, fehlende Angaben nachziehen, nur belastbare Vorgänge weiterreichen.</p>
        <p class="deliver-item__see"><a href="#simulation">So sieht das aus</a></p>
        <p class="deliver-item__limit"><span>Nicht im Zug</span> Keine Preiszusagen und keine Vertragsauskünfte.</p>
      </li>
      <li class="deliver-item">
        <h3><span class="deliver-item__num" aria-hidden="true">3</span> Termin vorbereiten</h3>
        <p>Personalisierter Buchungslink, Slot im Kalender, Reminder an Ihr Team.</p>
        <p class="deliver-item__see"><a href="#simulation">So sieht das aus</a></p>
        <p class="deliver-item__limit"><span>Nicht im Zug</span> Keine verbindliche Terminbestätigung gegenüber dem Interessenten ohne Ihre Regel.</p>
      </li>
      <li class="deliver-item">
        <h3><span class="deliver-item__num" aria-hidden="true">4</span> CRM-Notiz und Übergabe</h3>
        <p>Eintrag mit Einordnung und Notiz. Ihr Team übernimmt ab dem Freigabepunkt.</p>
        <p class="deliver-item__see"><a href="system-anfragen-qualifizieren.html">Systemseite Anfragen qualifizieren</a></p>
        <p class="deliver-item__limit"><span>Nicht im Zug</span> Keine Entscheidung, für die am Ende ein Mensch geradestehen muss.</p>
      </li>
      <li class="deliver-item">
        <h3><span class="deliver-item__num" aria-hidden="true">5</span> Übersicht und Suche</h3>
        <p>Dashboard über Leads und Termine, durchsuchbar, ohne neue Oberfläche, die niemand lernen will.</p>
        <p class="deliver-item__see"><a href="#simulation">So sieht das aus</a></p>
        <p class="deliver-item__limit"><span>Nicht im Zug</span> Kein Vendor-Lock-in und kein Lizenzschlüssel, den wir abschalten könnten.</p>
      </li>
    </ol>
    <p style="margin-top:2rem;">
      <button type="button" class="btn-primary js-open-booking" data-source="aqut-deliver">Kostenlosen KI-Audit buchen</button>
      <span class="cta-criteria">Messbare Kriterien vor Projektstart.</span>
    </p>
  </div>
</section>

<section class="sage-block" id="paket-2">
  <div class="section-wrap">
    <span class="mono-label">Danach</span>
    <h2 class="section-h2">Ausblick Paket 2</h2>
    <p class="section-sub">Nach stabilem Go-Live: Besichtigungstermine, digitale Mieterselbstauskunft, Vergleichsansicht. Kein zweites Angebot auf dieser Seite, nur der Weg danach.</p>
  </div>
</section>

<section id="scope">
  <div class="section-wrap">
    <span class="mono-label">Scope</span>
    <h2 class="section-h2">Was drin ist und was nicht</h2>
    <div class="scope-grid">
      <div>
        <h3>Enthalten</h3>
        <ul>
          <li>Setup und Anbindung laut Scope Paket 1</li>
          <li>Schulung Ihres Teams</li>
          <li>Betrieb in Ihrer Infrastruktur, dokumentierte Übergabe</li>
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

<section id="faq">
  <div class="section-wrap">
    <span class="mono-label">FAQ</span>
    <h2 class="section-h2">Häufige Fragen</h2>
    <div class="faq-list">
      <details>
        <summary>Funktioniert AMS nur mit onOffice oder Propstack?</summary>
        <p>Nein. Das sind häufige Anbindungen in der Immobilien-Referenz. Wir bauen an Ihr bestehendes CRM an, sofern API und Freigaben vorliegen. Ohne CRM richten wir eine schlanke Datenhaltung ein.</p>
      </details>
      <details>
        <summary>Ist das nur für Maklerbüros?</summary>
        <p>AMS ist exemplarisch für Immobilien gebaut. Der ICP von RAIS ist der operative Mittelstand mit wiederkehrendem Volumen. Für vergleichbare Anfrageprozesse in anderen Branchen bauen wir nach demselben Stack.</p>
      </details>
      <details>
        <summary>Wie lange dauert Setup bis Go-Live?</summary>
        <p>Abhängig von Zugängen, Kalender und Qualifizierungskriterien. Im Audit klären wir eine realistische Timeline. Typisch geht ein erstes System in vier bis sechs Wochen live.</p>
      </details>
      <details>
        <summary>Ich muss noch nachdenken.</summary>
        <p>Der Audit ist der Denkschritt. Zwanzig Minuten, kostenlos. Danach ist klar, ob es passt. Messbare Kriterien stehen vor Projektstart, nicht erst danach.</p>
      </details>
      <details>
        <summary>Wo laufen die Systeme?</summary>
        <p>In Ihrer Infrastruktur bzw. selbst gehostet in der EU. Vertragliches und Standorte stehen unter <a href="ueber-uns.html">Über uns</a> und in der Datenschutzerklärung.</p>
      </details>
    </div>
    <p style="margin-top:2rem;">
      <button type="button" class="btn-primary js-open-booking" data-source="aqut-faq">Kostenlosen KI-Audit buchen</button>
      <span class="cta-criteria">Messbare Kriterien vor Projektstart.</span>
    </p>
  </div>
</section>
`;
