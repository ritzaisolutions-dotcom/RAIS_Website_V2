import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

const copyTargets = [
  { from: 'scripts', to: 'scripts' },
  { from: 'downloads', to: 'downloads' },
  { from: 'vendor', to: 'vendor' },
  { from: 'klaro-config.js', to: 'klaro-config.js' },
  { from: 'styles/klaro-overrides.css', to: 'styles/klaro-overrides.css' },
];

mkdirSync(dist, { recursive: true });

for (const { from, to } of copyTargets) {
  const source = resolve(root, from);
  if (!existsSync(source)) continue;
  cpSync(source, resolve(dist, to), { recursive: true });
}
