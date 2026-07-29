/**
 * Idempotent Home shell sync from page-shell.mjs.
 * Syncs: skip-link + nav + mobile overlay, footer-legal, booking hooks, booking modal.
 * Does NOT inject site-nav.js (index keeps inline hamburger JS).
 * Run via: npm run pages
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { bookingModalHtml, navHtml } from './page-shell.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = resolve(root, 'index.html');
let html = readFileSync(indexPath, 'utf8');

/** Home nav: in-page #systeme anchors + hamburger-icon id for inline JS */
function homeNavHtml() {
  return navHtml(null)
    .replaceAll('/#systeme', '#systeme')
    .replace(
      '<svg width="22" height="22"',
      '<svg id="hamburger-icon" width="22" height="22"'
    );
}

const homeFooterLegal = `<nav class="footer-legal" aria-label="Seitenlinks">
                <a href="#systeme">Systeme</a>
                <a href="zusammenarbeit.html">So arbeiten wir</a>
                <a href="referenzen.html">Referenzen</a>
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

html =
  html.slice(0, afterBody) +
  '\n\n' +
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

const after = html.slice(cutEnd);
html =
  before +
  bookingModalHtml.trim() +
  '\n<script src="scripts/booking-modal.js"></script>\n\n' +
  after;

// Remove duplicate booking-modal.js if tilt block already had nothing and we doubled
html = html.replace(
  /(<script src="scripts\/booking-modal\.js"><\/script>\s*){2,}/g,
  '<script src="scripts/booking-modal.js"></script>\n'
);
// Never leave site-nav on index
html = html.replace(/\s*<script src="scripts\/site-nav\.js"><\/script>\s*/g, '\n');

writeFileSync(indexPath, html, 'utf8');
console.log('synced index.html shell from page-shell.mjs (no site-nav.js)');
