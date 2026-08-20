import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

const copyTargets = [
  { from: 'scripts', to: 'scripts' },
  { from: 'downloads', to: 'downloads' },
  // Einzelbild fuer die Link-Vorschau (og:image). Scraper koennen
  // keine gehashten Vite-Assets aufloesen, und images/ wird bewusst
  // nicht ausgeliefert. Deshalb genau diese eine Datei.
  { from: 'images/cover.webp', to: 'og-cover.webp' },
  { from: 'vendor', to: 'vendor' },
  // images/ wird NICHT kopiert (entfernt 05.08.2026).
  //
  // Jeder Bildpfad steht im HTML, und Vite bundelt daraus selbst nach
  // dist/assets mit Hash im Dateinamen. Geprueft: weder ein kopiertes
  // Stylesheet noch ein Skript verweist auf images/, und im gebauten
  // HTML steht kein einziger Verweis darauf. Die Kopie war reine
  // Doppelung und hat 26 MB ausgeliefert, davon 19 MB Dateien, die
  // nirgends referenziert sind.
  //
  // Wer kuenftig einen Bildpfad ERST ZUR LAUFZEIT zusammenbaut (etwa in
  // einem Skript), muss das hier wieder aufnehmen oder das Bild nach
  // public/ legen. Nur dann greift Vite nicht.
  { from: 'fonts', to: 'fonts' },
  { from: 'klaro-config.js', to: 'klaro-config.js' },
  { from: 'styles/klaro-overrides.css', to: 'styles/klaro-overrides.css' },
  { from: 'styles/site-multipage.css', to: 'styles/site-multipage.css' },
  { from: 'styles/home.css', to: 'styles/home.css' },
  { from: 'styles/booking-modal.css', to: 'styles/booking-modal.css' },
  { from: 'styles/ai-roadmap.css', to: 'styles/ai-roadmap.css' },
  { from: 'styles/antigravity-polish.css', to: 'styles/antigravity-polish.css' },
  { from: 'styles/tailwind.generated.css', to: 'styles/tailwind.generated.css' },
  { from: 'fonts.css', to: 'fonts.css' },
  { from: 'favicon.svg', to: 'favicon.svg' },
  { from: 'favicon.png', to: 'favicon.png' },
  { from: 'sitemap.xml', to: 'sitemap.xml' },
  { from: 'robots.txt', to: 'robots.txt' },
];

/** Vite often strips these relative CSS links; re-inject after copy for runtime. */
const sharedStyles = [
  'fonts.css',
  'styles/antigravity-polish.css',
  'styles/tailwind.generated.css',
  'styles/site-multipage.css',
  'styles/home.css',
  'styles/booking-modal.css',
];

const pageStyles = {
  'ai-roadmap.html': ['styles/ai-roadmap.css'],
};

mkdirSync(dist, { recursive: true });

for (const { from, to } of copyTargets) {
  const source = resolve(root, from);
  if (!existsSync(source)) continue;
  cpSync(source, resolve(dist, to), { recursive: true });
}

function ensureStyles(html, pageName) {
  let out = html;
  const tags = [];
  const hrefs = sharedStyles.concat(pageStyles[pageName] || []);
  for (const href of hrefs) {
    if (out.includes(href)) continue;
    tags.push(`  <link rel="stylesheet" href="${href}">`);
  }
  if (!tags.length) return out;
  if (!out.includes('</head>')) return out;
  return out.replace('</head>', `${tags.join('\n')}\n</head>`);
}

for (const name of readdirSync(dist)) {
  if (!name.endsWith('.html')) continue;
  const file = resolve(dist, name);
  const next = ensureStyles(readFileSync(file, 'utf8'), name);
  writeFileSync(file, next);
}

console.log('postbuild-copy: assets copied, shared styles ensured');
