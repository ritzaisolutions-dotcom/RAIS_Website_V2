/**
 * Erzeugt sitemap.xml aus einer einzigen Liste.
 *
 * Vorher wurde die Datei von Hand gepflegt. Sie stand deshalb auf
 * `lastmod 2026-07-25` fuer alle Eintraege und war beim Anlegen neuer
 * Seiten regelmaessig unvollstaendig. Mit den Flaggschiff-Seiten waere
 * das endgueltig aus dem Ruder gelaufen: die kommen aus
 * systemakte-data.mjs und koennen jederzeit mehr werden.
 *
 * ─────────────────────────────────────────────────────────────────────
 * WARUM EIN INHALTS-HASH UND NICHT DIE DATEIZEIT
 *
 * Eine fruehere Fassung nahm `statSync(...).mtime`. Das war falsch:
 * `npm run pages` schreibt index.html, ams.html, referenzen.html und
 * alle system-*.html bei JEDEM Lauf neu. Die mtime ist damit immer die
 * Build-Zeit, auch wenn sich am Inhalt nichts geaendert hat. Jeder
 * Deploy haette also behauptet, saemtliche Seiten seien frisch, und
 * genau das macht `lastmod` fuer Crawler wertlos.
 *
 * Stattdessen: der gerenderte Seiteninhalt wird gehasht und zusammen
 * mit dem Datum in sitemap-lastmod.json abgelegt. Aendert sich der Hash
 * nicht, bleibt das alte Datum stehen. Die Manifest-Datei GEHOERT INS
 * REPOSITORY, sonst faengt die Historie bei jedem Klon von vorn an.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Nicht in der Sitemap: impressum.html und datenschutz.html. Die sind in
 * robots.txt gesperrt.
 *
 * Laeuft ueber `npm run pages`, nach build-pages.mjs und
 * sync-index-shell.mjs, damit die Seiten in ihrer Endfassung vorliegen.
 */
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { flagships } from './systemakte-data.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://ritz-ai.solutions';
const MANIFEST = resolve(root, 'sitemap-lastmod.json');

/** Feste Seiten mit ihrer Gewichtung. */
const PAGES = [
  { file: 'index.html', loc: '/', priority: '1.0' },
  { file: 'ams.html', priority: '0.9' },
  { file: 'referenzen.html', priority: '0.8' },
  { file: 'zusammenarbeit.html', priority: '0.7' },
  { file: 'ueber-uns.html', priority: '0.7' },
  { file: 'persoenlichkeit.html', priority: '0.6' },
  { file: 'ai-roadmap.html', priority: '0.8' },
  // Die Systemseiten stehen unter referenzen.html, deshalb darunter.
  ...flagships().map((r) => ({ file: `system-${r.slug}.html`, priority: '0.7' })),
];

const heute = () => new Date().toISOString().slice(0, 10);

/**
 * Startdatum fuer eine Seite, die noch nicht im Manifest steht.
 * Erste Wahl ist der letzte Commit, der die Datei angefasst hat, sonst
 * heute. So beginnt die Historie nicht fuer alle Seiten gleichzeitig,
 * nur weil das Manifest neu ist.
 */
function startdatum(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    // Kein Git oder Datei noch nie committet: dann heute.
  }
  return heute();
}

const manifest = existsSync(MANIFEST)
  ? JSON.parse(readFileSync(MANIFEST, 'utf8'))
  : {};

const entries = [];
const fehlend = [];
const geaendert = [];

for (const p of PAGES) {
  const pfad = resolve(root, p.file);
  if (!existsSync(pfad)) {
    fehlend.push(p.file);
    continue;
  }

  const hash = createHash('sha256').update(readFileSync(pfad)).digest('hex').slice(0, 16);
  const vorher = manifest[p.file];

  let lastmod;
  if (!vorher) {
    lastmod = startdatum(p.file);
  } else if (vorher.hash === hash) {
    lastmod = vorher.lastmod;
  } else {
    lastmod = heute();
    geaendert.push(p.file);
  }

  manifest[p.file] = { hash, lastmod };
  entries.push(
    `  <url>\n    <loc>${ORIGIN}${p.loc || '/' + p.file}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`
  );
}

// Seiten, die es nicht mehr gibt, aus dem Manifest werfen, sonst waechst
// es mit jeder umbenannten Datei weiter (etwa aqut.html -> ams.html).
const aktuell = new Set(PAGES.map((p) => p.file));
for (const key of Object.keys(manifest)) {
  if (!aktuell.has(key)) delete manifest[key];
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Erzeugt von scripts/build-sitemap.mjs. Nicht von Hand aendern. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

writeFileSync(resolve(root, 'sitemap.xml'), xml, 'utf8');
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

// Stillschweigend fehlende Seiten waeren schlimmer als ein lauter Hinweis:
// eine Seite, die nicht in der Sitemap steht, faellt niemandem auf.
if (fehlend.length) {
  console.warn('build-sitemap: Datei fehlt, nicht aufgenommen: ' + fehlend.join(', '));
}
console.log(
  `sitemap.xml: ${entries.length} URLs` +
    (geaendert.length ? `, ${geaendert.length} mit neuem Datum (${geaendert.join(', ')})` : ', keine Inhaltsaenderung')
);
