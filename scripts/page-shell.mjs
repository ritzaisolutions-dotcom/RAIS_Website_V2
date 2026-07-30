/**
 * Shared HTML fragments for multipage shell.
 * Canonical shell: change only here, then run `npm run pages`
 * (build-pages + sync-index-shell). Do not hand-edit Nav/Footer/Modal on pages.
 */
export const bookingModalHtml = `
<div id="booking-modal" role="dialog" aria-modal="true" aria-label="Kostenlose Beratungsstunde buchen">
  <div class="bm-backdrop" id="bm-backdrop"></div>
  <div class="bm-box">
    <button class="bm-close" id="bm-close" type="button" aria-label="Schließen">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="bm-progress" id="bm-progress">
      <div class="bm-dot" data-step="0"></div>
      <div class="bm-dot" data-step="1"></div>
      <div class="bm-dot" data-step="2"></div>
    </div>
    <div class="bm-step is-active" id="bm-step-0">
      <p class="bm-label">Schritt 1 von 2</p>
      <h2 class="bm-title">Ihre Kontaktdaten</h2>
      <p class="bm-sub">Damit wir die Beratungsstunde vorbereiten und Sie erreichen können.</p>
      <div class="bm-field">
        <label for="bm-name">Ihr Name</label>
        <input type="text" id="bm-name" placeholder="Max Mustermann" autocomplete="name" maxlength="200">
      </div>
      <div class="bm-field">
        <label for="bm-email">E-Mail-Adresse</label>
        <input type="email" id="bm-email" placeholder="max@muster.de" autocomplete="email" maxlength="254">
      </div>
      <div class="bm-field">
        <label for="bm-phone">Telefon</label>
        <input type="tel" id="bm-phone" placeholder="+49 170 1234567" autocomplete="tel" maxlength="40" inputmode="tel">
      </div>
      <div class="bm-field" style="position:absolute;left:-9999px;" aria-hidden="true">
        <label for="bm-website">Website</label>
        <input type="text" id="bm-website" name="website" tabindex="-1" autocomplete="off">
      </div>
      <label class="bm-check" for="bm-privacy">
        <input type="checkbox" id="bm-privacy" required>
        <span>Ich habe die <a href="datenschutz.html" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a> gelesen.</span>
      </label>
      <div class="bm-actions">
        <button type="button" class="bm-btn-next" id="bm-next-0">Weiter</button>
      </div>
    </div>
    <div class="bm-step" id="bm-step-1">
      <p class="bm-label">Schritt 2 von 2</p>
      <h2 class="bm-title">Ihr Anfragevolumen</h2>
      <p class="bm-sub">Wie viele E-Mail-Anfragen landen durchschnittlich pro Woche bei Ihnen?</p>
      <div class="bm-slider-block">
        <div class="bm-slider-value" aria-live="polite">
          <span id="bm-volume-display">80</span>
          <span class="bm-slider-unit">Anfragen / Woche</span>
        </div>
        <input type="range" id="bm-volume" class="bm-slider" min="0" max="300" step="5" value="80" aria-valuemin="0" aria-valuemax="300" aria-valuenow="80" aria-label="Anfragen pro Woche">
        <div class="bm-slider-scale" aria-hidden="true">
          <span>0</span>
          <span>150</span>
          <span>300</span>
        </div>
      </div>
      <div class="bm-actions">
        <button type="button" class="bm-btn-back" id="bm-back-1">Zurück</button>
        <button type="button" class="bm-btn-next" id="bm-next-1">Termin buchen</button>
      </div>
    </div>
    <div class="bm-step" id="bm-step-2">
      <p class="bm-label">Fast geschafft</p>
      <h2 class="bm-title">Wählen Sie Ihren Termin</h2>
      <p class="bm-sub">60 Minuten, kostenlos. Die Buchung öffnet sich bei Cal.com in einem neuen Tab. Es werden keine Angaben aus diesem Formular an Cal.com übergeben.</p>
      <p class="bm-sub" id="bm-submit-status" role="status" aria-live="polite"></p>
      <div class="bm-cal-wrap" id="bm-cal-wrap"></div>
    </div>
  </div>
</div>
`;

export function navHtml(active) {
  const link = (href, label, key) =>
    `<li><a href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a></li>`;
  return `
<a class="skip-link" href="#main">Zum Inhalt springen</a>
<nav id="navbar" aria-label="Hauptnavigation">
  <div class="nav-inner">
    <a href="/" class="nav-brand" aria-label="RAIS zur Startseite">
      <img src="favicon.svg" alt="" width="44" height="44" aria-hidden="true">
      <div class="nav-brand-words">
        <span class="nav-wordmark">RAIS</span>
        <span class="nav-submark">Ritz AI Solutions</span>
      </div>
    </a>
    <div class="nav-center" role="none">
      <ul class="nav-list" role="list">
        ${link('/#systeme', 'Systeme', 'systeme')}
        ${link('referenzen.html', 'Referenzen', 'referenzen')}
        ${link('ueber-uns.html', 'Über uns', 'ueber-uns')}
        ${link('persoenlichkeit.html', 'Persönlichkeit', 'persoenlichkeit')}
      </ul>
    </div>
    <div class="nav-right">
      <button type="button" class="btn-primary js-open-booking" id="nav-demo-btn" data-source="nav">Kostenlose Beratungsstunde buchen</button>
      <button class="nav-hamburger" id="hamburger-btn" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="mobile-overlay">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  </div>
</nav>
<div id="mobile-overlay" role="dialog" aria-label="Navigation" aria-modal="true">
  <div class="mobile-nav-inner">
    <a href="/#systeme" class="mobile-link" data-close-menu>Systeme</a>
    <a href="referenzen.html" class="mobile-link" data-close-menu>Referenzen</a>
    <a href="ueber-uns.html" class="mobile-link" data-close-menu>Über uns</a>
    <a href="persoenlichkeit.html" class="mobile-link" data-close-menu>Persönlichkeit</a>
    <a href="zusammenarbeit.html" class="mobile-link" data-close-menu>So arbeiten wir</a>
    <hr class="mobile-hr">
    <button type="button" class="mobile-cta js-open-booking" id="mobile-demo-btn" data-source="mobile-nav">Kostenlose Beratungsstunde buchen</button>
  </div>
</div>
`;
}

export const contactHtml = `
<section id="contact">
  <div class="section-wrap">
    <div class="contact-grid">
      <div class="contact-text-col">
        <span class="mono-label">Kostenlose Beratungsstunden</span>
        <h2 class="section-h2">60 Minuten. Kostenlos. Klare nächste Schritte.</h2>
        <p class="contact-copy">Wir analysieren Ihre Prozesse und zeigen, wo Zeit verloren geht. Sie bekommen drei umsetzbare Use Cases.</p>
        <p class="contact-copy">Kein Verkaufsdruck. Blueprint inklusive.</p>
      </div>
      <div class="cal-embed-wrap">
        <p class="cal-card-title">Kostenlose Beratungsstunde buchen</p>
        <p class="cal-card-sub">60 Minuten, kostenlos. Drei konkrete Automatisierungs-Ideen für Ihr Büro.</p>
        <button type="button" id="contact-demo-btn" class="cal-load-btn js-open-booking" data-source="contact">Kostenlose Beratungsstunde buchen</button>
      </div>
    </div>
    <div class="contact-details">
      <a href="mailto:kevin@ritz-ai.solutions" class="contact-detail-link">kevin@ritz-ai.solutions</a>
      <a href="tel:+4915129755134" class="contact-detail-link">+49 151 297 551 34</a>
    </div>
  </div>
</section>
`;

export const footerHtml = `
<div id="sticky-cta" aria-hidden="true">
  <button type="button" class="sticky-cta-btn js-open-booking" id="sticky-demo-btn" data-source="sticky">Beratungsstunde buchen</button>
</div>
<footer id="footer">
  <div class="footer-inner">
    <a href="/" class="footer-brand" aria-label="RAIS Startseite">
      <img src="favicon.svg" alt="" width="40" height="40" aria-hidden="true">
      <span>RAIS</span>
    </a>
    <nav class="footer-legal" aria-label="Seitenlinks">
      <a href="/#systeme">Systeme</a>
      <a href="zusammenarbeit.html">So arbeiten wir</a>
      <a href="referenzen.html">Referenzen</a>
      <a href="#contact">Kontakt</a>
      <a href="impressum.html">Impressum</a>
      <a href="datenschutz.html">Datenschutz</a>
      <a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </nav>
    <span class="footer-copy">© 2026 Ritz AI Solutions · RAIS · Koblenz</span>
  </div>
</footer>
`;

export function headHtml({ title, description, path }) {
  return `<!DOCTYPE html>
<html lang="de" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="icon" type="image/png" href="favicon.png?v=3">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://ritz-ai.solutions/${path}">
  <meta property="og:type" content="website">
  <script src="scripts/public-config.js"></script>
  <script src="scripts/sentry-klaro-bootstrap.js"></script>
  <script src="klaro-config.js"></script>
  <script src="vendor/klaro/klaro.js"></script>
  <link rel="stylesheet" href="vendor/klaro/klaro.min.css">
  <link rel="stylesheet" href="styles/klaro-overrides.css">
  <link rel="stylesheet" href="fonts.css">
  <link rel="stylesheet" href="styles/antigravity-polish.css">
  <link rel="stylesheet" href="styles/tailwind.generated.css">
  <link rel="stylesheet" href="styles/site-multipage.css">
  <link rel="stylesheet" href="styles/booking-modal.css">
</head>
<body>
`;
}

export const scriptsHtml = `
<script src="scripts/site-nav.js"></script>
<script src="scripts/booking-modal.js"></script>
</body>
</html>
`;
