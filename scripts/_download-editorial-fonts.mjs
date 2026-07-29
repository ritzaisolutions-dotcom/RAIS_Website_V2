import { writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('fonts', { recursive: true });
const cssUrl =
  'https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&display=swap';
const css = await fetch(cssUrl, {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
}).then((r) => r.text());
if (css.includes('<!DOCTYPE') || css.includes('Invalid')) {
  console.error('Bad CSS response');
  writeFileSync('fonts/_gf-raw.css', css.slice(0, 500));
  process.exit(1);
}
writeFileSync('fonts/_gf-raw.css', css);

const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((m) => m[1]);
const unique = [...new Set(urls)];
console.log('files', unique.length);

const map = {};
for (const u of unique) {
  const fname = u.split('/').pop().split('?')[0];
  const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
  writeFileSync(`fonts/${fname}`, buf);
  map[u] = fname;
  console.log(fname, buf.length);
}

let localCss = css;
for (const [remote, local] of Object.entries(map)) {
  localCss = localCss.split(remote).join(local);
}
writeFileSync('fonts/editorial-faces.css', localCss);
console.log('wrote fonts/editorial-faces.css');
