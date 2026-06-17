import { copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcDir = join(root, 'node_modules', 'klaro', 'dist');
const destDir = join(root, 'vendor', 'klaro');

const files = [
  ['klaro.js', 'klaro.js'],
  ['klaro.min.css', 'klaro.min.css'],
];

mkdirSync(destDir, { recursive: true });

for (const [srcName, destName] of files) {
  copyFileSync(join(srcDir, srcName), join(destDir, destName));
}

console.log('Copied klaro dist → vendor/klaro/');
