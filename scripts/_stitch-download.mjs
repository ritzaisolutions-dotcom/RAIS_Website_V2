import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'scripts', '_stitch-out');
mkdirSync(outDir, { recursive: true });

const gen = JSON.parse(readFileSync(join(outDir, 'generate-home.json'), 'utf8'));
const screens = gen.outputComponents?.[0]?.design?.screens || [];
const design = screens.find((s) => s.screenType === 'DESIGN') || screens[1];
const image = screens.find((s) => s.screenType === 'IMAGE') || screens[0];

async function download(url, path) {
  console.log('Downloading', path);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(path, buf);
  console.log('Saved', path, buf.length);
  return path;
}

if (design?.htmlCode?.downloadUrl) {
  await download(design.htmlCode.downloadUrl, join(outDir, 'home.html'));
}
if (design?.screenshot?.downloadUrl) {
  await download(design.screenshot.downloadUrl, join(outDir, 'home-screenshot.png'));
}
if (image?.screenshot?.downloadUrl) {
  await download(image.screenshot.downloadUrl, join(outDir, 'hero-atmosphere.png'));
}

writeFileSync(
  join(outDir, 'meta.json'),
  JSON.stringify(
    {
      projectId: gen.projectId,
      designScreen: design?.name,
      imageScreen: image?.name,
      title: design?.title,
    },
    null,
    2
  )
);
console.log('OK');
