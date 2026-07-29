import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

const copyTargets = [
  { from: 'scripts', to: 'scripts' },
  { from: 'downloads', to: 'downloads' },
  { from: 'vendor', to: 'vendor' },
  { from: 'images', to: 'images' },
  { from: 'fonts', to: 'fonts' },
  { from: 'klaro-config.js', to: 'klaro-config.js' },
  { from: 'styles/klaro-overrides.css', to: 'styles/klaro-overrides.css' },
  { from: 'styles/site-multipage.css', to: 'styles/site-multipage.css' },
  { from: 'styles/booking-modal.css', to: 'styles/booking-modal.css' },
  { from: 'styles/antigravity-polish.css', to: 'styles/antigravity-polish.css' },
  { from: 'styles/tailwind.generated.css', to: 'styles/tailwind.generated.css' },
  { from: 'fonts.css', to: 'fonts.css' },
  { from: 'favicon.svg', to: 'favicon.svg' },
  { from: 'favicon.png', to: 'favicon.png' },
  { from: 'sitemap.xml', to: 'sitemap.xml' },
  { from: 'robots.txt', to: 'robots.txt' },
];

mkdirSync(dist, { recursive: true });

for (const { from, to } of copyTargets) {
  const source = resolve(root, from);
  if (!existsSync(source)) continue;
  cpSync(source, resolve(dist, to), { recursive: true });
}
