/**
 * Idempotent Home shell sync from page-shell.mjs.
 * Syncs: skip-link + nav + mobile overlay, footer-legal, booking hooks, booking modal.
 * Does NOT inject site-nav.js (index keeps inline hamburger JS).
 * Run via: npm run pages
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { bookingModalHtml, navHtml, spriteHtml } from './page-shell.mjs';
import { UNIVERSAL, renderRegister, renderBranchen } from './systemakte-data.mjs';
import { renderChangelog } from './changelog-data.mjs';
import { renderTechstack } from './techstack-data.mjs';
import { renderFaq, renderFaqSchema } from './faq-data.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = resolve(root, 'index.html');
let html = readFileSync(indexPath, 'utf8');

/** Home nav: in-page anchors + hamburger-icon id for inline JS */
function homeNavHtml() {
  return navHtml(null)
    .replaceAll('/#systeme', '#systeme')
    .replaceAll('/#methodik', '#methodik')
    .replace(
      '<svg width="22" height="22"',
      '<svg id="hamburger-icon" width="22" height="22"'
    );
}

const homeFooterLegal = `<nav class="footer-legal" aria-label="Seitenlinks">
                <a href="#systeme">Systeme</a>
                <a href="#methodik">Methode</a>
                <a href="zusammenarbeit.html">So arbeiten wir</a>
                <a href="referenzen.html">Systemkatalog</a>
                <a href="ams.html">AMS Beispielsystem</a>
                <a href="ai-roadmap.html">KI-Roadmap</a>
                <a href="persoenlichkeit.html">Persönlichkeit</a>
                <a href="#contact">Kontakt</a>
                <a href="impressum.html">Impressum</a>
                <a href="datenschutz.html">Datenschutz</a>
                <a href="https://linkedin.com/in/kevin-ritz-rais" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </nav>`;

// 1) Skip-link + navbar + mobile overlay (everything before MAIN / <main)
const mainCommentRe = /<!--[^\n]*MAIN CONTENT[\s\S]*?-->/;
const mainTagRe = /<main\b[^>]*>/;
const bodyMatch = html.match(/<body[^>]*>/i);
if (!bodyMatch) {
  console.error('sync-index-shell: <body> missing');
  process.exit(1);
}
const afterBody = bodyMatch.index + bodyMatch[0].length;

let mainStart = -1;
const commentMatch = html.slice(afterBody).match(mainCommentRe);
if (commentMatch) {
  mainStart = afterBody + commentMatch.index;
} else {
  const tagMatch = html.slice(afterBody).match(mainTagRe);
  if (tagMatch) mainStart = afterBody + tagMatch.index;
}
if (mainStart < 0) {
  console.error('sync-index-shell: MAIN CONTENT / <main> missing');
  process.exit(1);
}

// Das Symbol-Sprite muss hier mit rein: index.html nutzt headHtml() aus
// page-shell.mjs nicht, wuerde die Symbole also nicht kennen. Die
// Systemakte rendert aber auf beiden Seiten dieselben <use>-Verweise,
// und ohne Sprite zeigen die ins Leere.
html =
  html.slice(0, afterBody) +
  '\n' +
  spriteHtml +
  '\n' +
  homeNavHtml().trim() +
  '\n\n\n    ' +
  html.slice(mainStart);

// 2) Footer legal links
if (!/<nav class="footer-legal"[\s\S]*?<\/nav>/.test(html)) {
  console.error('sync-index-shell: footer-legal missing');
  process.exit(1);
}
html = html.replace(/<nav class="footer-legal"[\s\S]*?<\/nav>/, homeFooterLegal);

// 3) Booking CTA hooks (idempotent)
html = html.replace(
  /id="contact-demo-btn" class="cal-load-btn"(?! js-open-booking)/,
  'id="contact-demo-btn" class="cal-load-btn js-open-booking" data-source="contact"'
);
html = html.replace(
  /id="contact-demo-btn" class="cal-load-btn js-open-booking"(?! data-source)/,
  'id="contact-demo-btn" class="cal-load-btn js-open-booking" data-source="contact"'
);
html = html.replace(
  /class="sticky-cta-btn"(?! js-open-booking) id="sticky-demo-btn"/,
  'class="sticky-cta-btn js-open-booking" id="sticky-demo-btn" data-source="sticky"'
);
html = html.replace(
  /class="sticky-cta-btn js-open-booking" id="sticky-demo-btn"(?! data-source)/,
  'class="sticky-cta-btn js-open-booking" id="sticky-demo-btn" data-source="sticky"'
);

// Ensure contact button already synced still has data-source
html = html.replace(
  /id="contact-demo-btn" class="cal-load-btn js-open-booking"(?:\s+data-source="contact")?/,
  'id="contact-demo-btn" class="cal-load-btn js-open-booking" data-source="contact"'
);
html = html.replace(
  /class="sticky-cta-btn js-open-booking" id="sticky-demo-btn"(?:\s+data-source="sticky")?/,
  'class="sticky-cta-btn js-open-booking" id="sticky-demo-btn" data-source="sticky"'
);

// 4) Booking modal: replace from #booking-modal through optional site-nav/booking scripts
const modalStart = html.indexOf('<div id="booking-modal"');
if (modalStart < 0) {
  console.error('sync-index-shell: booking-modal missing');
  process.exit(1);
}

const tiltMarker = '<!-- ── 3D Card Tilt Effect';
let cutEnd = html.indexOf(tiltMarker);
if (cutEnd < 0) {
  // Fall back: after booking-modal.js or </body>
  const bmJs = html.indexOf('<script src="scripts/booking-modal.js"></script>', modalStart);
  if (bmJs >= 0) {
    cutEnd = bmJs + '<script src="scripts/booking-modal.js"></script>'.length;
  } else {
    cutEnd = html.indexOf('</body>');
  }
}

// Strip any site-nav.js that might sit just before modal (should not be on home)
let before = html.slice(0, modalStart);
before = before.replace(/\s*<script src="scripts\/site-nav\.js"><\/script>\s*$/m, '\n');

// cal-embed.js muss vor booking-modal.js stehen, das Modal ruft
// beim Oeffnen window.RAISCal.mount auf.
const modalScripts =
  '\n<script src="scripts/cal-embed.js"></script>' +
  '\n<script src="scripts/booking-modal.js"></script>\n\n';

const after = html.slice(cutEnd);
html =
  before +
  bookingModalHtml().trim() +
  modalScripts +
  after;

// Remove duplicate booking-modal.js if tilt block already had nothing and we doubled
html = html.replace(
  /(<script src="scripts\/cal-embed\.js"><\/script>\s*){2,}/g,
  '<script src="scripts/cal-embed.js"></script>\n'
);
html = html.replace(
  /(<script src="scripts\/booking-modal\.js"><\/script>\s*){2,}/g,
  '<script src="scripts/booking-modal.js"></script>\n'
);
// Never leave site-nav on index
html = html.replace(/\s*<script src="scripts\/site-nav\.js"><\/script>\s*/g, '\n');

// 5) Systemakte: Kurzfassung fuer die Startseite aus systemakte-data.mjs.
//    Volle Tiefe steht auf referenzen.html, hier je Branche nur die ersten zwei.
const AKTE_START = '<!-- systemakte:start -->';
const AKTE_END = '<!-- systemakte:end -->';
const akteStart = html.indexOf(AKTE_START);
const akteEnd = html.indexOf(AKTE_END);
if (akteStart < 0 || akteEnd < 0 || akteEnd < akteStart) {
  console.error('sync-index-shell: systemakte:start/end marker missing');
  process.exit(1);
}
// renderChangelog() liefert '' solange keine Eintraege gepflegt sind.
// Dann wird auch keine Ueberschrift eingehaengt.
const akteHtml = [
  AKTE_START,
  renderRegister(UNIVERSAL.slice(0, 5)),
  renderBranchen({ limit: 2, linkTo: 'referenzen.html' }),
  renderChangelog(),
  '                ' + AKTE_END
].filter(Boolean).join('\n');
html = html.slice(0, akteStart) + akteHtml + html.slice(akteEnd + AKTE_END.length);

// Branchen-Reiter nur einbinden, wenn die Startseite sie auch enthaelt
const branchenTag = '<script src="scripts/branchen-tabs.js"></script>';
html = html.replace(/\s*<script src="scripts\/branchen-tabs\.js"><\/script>/g, '');
if (html.includes('class="branchen"')) {
  html = html.replace(
    '<script src="scripts/booking-modal.js"></script>',
    '<script src="scripts/booking-modal.js"></script>\n' + branchenTag
  );
}

// 6) FAQ: sichtbares Markup und FAQPage-Schema aus derselben Quelle,
//    damit beide nie auseinanderlaufen.
const FAQ_START = '<!-- faq:start -->';
const FAQ_END = '<!-- faq:end -->';
const faqStart = html.indexOf(FAQ_START);
const faqEnd = html.indexOf(FAQ_END);
if (faqStart < 0 || faqEnd < 0 || faqEnd < faqStart) {
  console.error('sync-index-shell: faq:start/end marker missing');
  process.exit(1);
}
const faqHtml = [FAQ_START, renderFaq(), '                ' + FAQ_END]
  .filter(Boolean)
  .join('\n');
html = html.slice(0, faqStart) + faqHtml + html.slice(faqEnd + FAQ_END.length);

// FAQPage-JSON-LD idempotent vor </head> setzen: erst die alte Fassung
// entfernen, dann die aktuelle aus faq-data.mjs einsetzen.
html = html.replace(
  /\n?<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/,
  ''
);
const faqSchema = renderFaqSchema();
if (faqSchema) {
  html = html.replace('</head>', faqSchema + '\n</head>');
}

// 7) Tech-Streifen direkt unter dem Hero. Logos statt Textlauf:
//    ein Marquee liest niemand, Logos tragen Wiedererkennung.
//    Der Proof-Ticker mit den DSGVO-Labels wandert dafuer nach unten.
const TECH_START = '<!-- techstack:start -->';
const TECH_END = '<!-- techstack:end -->';
const techStart = html.indexOf(TECH_START);
const techEnd = html.indexOf(TECH_END);
if (techStart < 0 || techEnd < 0 || techEnd < techStart) {
  console.error('sync-index-shell: techstack:start/end marker missing');
  process.exit(1);
}
const techHtml = [TECH_START, renderTechstack(), '                ' + TECH_END]
  .filter(Boolean)
  .join('\n');
html = html.slice(0, techStart) + techHtml + html.slice(techEnd + TECH_END.length);

writeFileSync(indexPath, html, 'utf8');
console.log('synced index.html shell + systemakte from data module');
