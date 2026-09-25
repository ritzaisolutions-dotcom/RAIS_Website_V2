/**
 * Idempotent Home shell sync from page-shell.mjs.
 * Syncs: skip-link + nav + mobile overlay, footer-legal, booking hooks, booking modal.
 * Does NOT inject site-nav.js (index keeps inline hamburger JS).
 * Run via: npm run pages
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { bookingModalHtml, navHtml, spriteHtml, i18nBootHtml, i18nScriptsHtml } from './page-shell.mjs';
import { UNIVERSAL, renderRegister, renderBranchen } from './systemakte-data.mjs';
import { renderChangelog } from './changelog-data.mjs';
import { renderTechstack } from './techstack-data.mjs';
import { renderFaq, renderFaqSchema } from './faq-data.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = resolve(root, 'index.html');
let html = readFileSync(indexPath, 'utf8');

/** Home nav: minimal shell (logo + audit). */
function homeNavHtml() {
  return navHtml(null);
}

const homeFooterLegal = `<nav class="footer-legal" aria-label="Seitenlinks">
                <a href="impressum.html">Impressum</a>
                <a href="datenschutz.html">Datenschutz</a>
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

// Sticky CTA label matches nav
html = html.replace(
  /(<button[^>]*id="sticky-demo-btn"[^>]*>)[^<]*(<\/button>)/,
  '$1Kostenlosen Audit buchen$2'
);
html = html.replace(
  /(<button[^>]*id="nav-demo-btn"[^>]*>)[^<]*(<\/button>)/,
  '$1Kostenlosen Audit buchen$2'
);

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

// 5) Systemakte: optional. Home-Filter braucht sie nicht; volle Tiefe auf referenzen.html.
const AKTE_START = '<!-- systemakte:start -->';
const AKTE_END = '<!-- systemakte:end -->';
const akteStart = html.indexOf(AKTE_START);
const akteEnd = html.indexOf(AKTE_END);
if (akteStart >= 0 && akteEnd > akteStart) {
  const akteHtml = [
    AKTE_START,
    renderRegister(UNIVERSAL.slice(0, 5)),
    renderBranchen({ limit: 2, linkTo: 'referenzen.html' }),
    renderChangelog(),
    '                ' + AKTE_END
  ].filter(Boolean).join('\n');
  html = html.slice(0, akteStart) + akteHtml + html.slice(akteEnd + AKTE_END.length);
}

// Branchen-Reiter nur einbinden, wenn die Startseite sie auch enthaelt
const branchenTag = '<script src="scripts/branchen-tabs.js"></script>';
html = html.replace(/\s*<script src="scripts\/branchen-tabs\.js"><\/script>/g, '');
if (html.includes('class="branchen"')) {
  html = html.replace(
    '<script src="scripts/booking-modal.js"></script>',
    '<script src="scripts/booking-modal.js"></script>\n' + branchenTag
  );
}

// Home-Wenn-Accordion nur bei vorhandenem Filter
const wennTag = '<script src="scripts/wenn-branchen.js"></script>';
html = html.replace(/\s*<script src="scripts\/wenn-branchen\.js"><\/script>/g, '');
if (html.includes('class="wenn-branchen"') || html.includes('id="branchen-list"')) {
  html = html.replace(
    '<script src="scripts/booking-modal.js"></script>',
    '<script src="scripts/booking-modal.js"></script>\n' + wennTag
  );
}

// 6) FAQ: optional auf Home. Schema nur setzen, wenn Marker vorhanden.
const FAQ_START = '<!-- faq:start -->';
const FAQ_END = '<!-- faq:end -->';
const faqStart = html.indexOf(FAQ_START);
const faqEnd = html.indexOf(FAQ_END);
html = html.replace(
  /\n?<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/,
  ''
);
if (faqStart >= 0 && faqEnd > faqStart) {
  const faqHtml = [FAQ_START, renderFaq(), '                ' + FAQ_END]
    .filter(Boolean)
    .join('\n');
  html = html.slice(0, faqStart) + faqHtml + html.slice(faqEnd + FAQ_END.length);
  const faqSchema = renderFaqSchema();
  if (faqSchema) {
    html = html.replace('</head>', faqSchema + '\n</head>');
  }
}

// 7) Tech-Streifen auf der Startseite: nur Logos, eng.
const TECH_START = '<!-- techstack:start -->';
const TECH_END = '<!-- techstack:end -->';
const techStart = html.indexOf(TECH_START);
const techEnd = html.indexOf(TECH_END);
if (techStart >= 0 && techEnd > techStart) {
  const techHtml = [TECH_START, renderTechstack({ logosOnly: true }), '                ' + TECH_END]
    .filter(Boolean)
    .join('\n');
  html = html.slice(0, techStart) + techHtml + html.slice(techEnd + TECH_END.length);
}

// Language toggle + dictionary: keep the boot script in <head> and the
// runtime scripts before the calculator / sim modules.
if (!html.includes("localStorage.getItem('rais-lang')")) {
  html = html.replace(
    '<meta charset="UTF-8">',
    `<meta charset="UTF-8">
    ${i18nBootHtml}`
  );
}
html = html.replace(/\s*<script src="scripts\/i18n-dict\.js"><\/script>\s*/g, '\n');
html = html.replace(/\s*<script src="scripts\/i18n\.js"><\/script>\s*/g, '\n');
if (html.includes('<script src="scripts/aqut-rechner.js"></script>')) {
  html = html.replace(
    '<script src="scripts/aqut-rechner.js"></script>',
    i18nScriptsHtml.trim() + '\n<script src="scripts/aqut-rechner.js"></script>'
  );
} else {
  html = html.replace('</body>', i18nScriptsHtml + '</body>');
}

// Mobile sticky: hide when mid-CTA or contact band is in view
html = html.replace(
  /\/\* ── Mobile sticky CTA ───────────────────────────────── \*\/\s*var stickyCta = document\.getElementById\('sticky-cta'\);\s*var contactEl = document\.getElementById\('contact'\);\s*if \(stickyCta && contactEl\) \{[\s\S]*?updateStickyCta\(\);\s*\}/,
  `/* ── Mobile sticky CTA ───────────────────────────────── */
        var stickyCta = document.getElementById('sticky-cta');
        var contactEl = document.getElementById('contact');
        var midCta = document.getElementById('cta-before-contact');
        if (stickyCta && contactEl) {
            function bandInView(el) {
                if (!el) return false;
                var r = el.getBoundingClientRect();
                return r.top < window.innerHeight * 0.9 && r.bottom > window.innerHeight * 0.15;
            }
            function updateStickyCta() {
                var scrolled = window.scrollY > 420;
                var hideForBand = bandInView(contactEl) || bandInView(midCta);
                if (scrolled && !hideForBand) {
                    stickyCta.classList.add('is-visible');
                    stickyCta.removeAttribute('aria-hidden');
                } else {
                    stickyCta.classList.remove('is-visible');
                    stickyCta.setAttribute('aria-hidden', 'true');
                }
            }
            window.addEventListener('scroll', updateStickyCta, { passive: true });
            updateStickyCta();
        }`
);

writeFileSync(indexPath, html, 'utf8');
console.log('synced index.html shell + systemakte from data module');
