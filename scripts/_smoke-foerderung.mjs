const base = 'http://127.0.0.1:5173';
const checks = [];

async function get(path) {
  const r = await fetch(base + path);
  const t = await r.text();
  return { status: r.status, t };
}

function must(name, ok, detail = '') {
  checks.push({ name, ok, detail });
}

const home = await get('/');
const rm = await get('/ai-roadmap.html');
const ams = await get('/ams.html');
const pretty = await get('/ai-roadmap');

must('home 200', home.status === 200);
must('home System-Problem', home.t.includes('System-Problem'));
must('home glass-claims', home.t.includes('id="glass-claims"'));
must('home zwei-wege', home.t.includes('id="zwei-wege"'));
must('home nav KI-Roadmap', home.t.includes('ai-roadmap.html') && home.t.includes('KI-Roadmap'));
must('home hero secondary', home.t.includes('KI-Roadmap ansehen'));
must('home charts', home.t.includes('aqut-sim-charts'));
must('home motion.js', home.t.includes('scripts/motion.js'));
must('home spline-glass.js', home.t.includes('scripts/spline-glass.js'));
must('home no spline.design', !home.t.includes('spline.design'));
must('roadmap 200', rm.status === 200);
must('roadmap glass', rm.t.includes('glass-claims'));
must('roadmap funnel', rm.t.includes('ai-roadmap-funnel.js'));
must('pretty /ai-roadmap', pretty.status === 200 && pretty.t.includes('KI-Automatisierung'));
must('ams 200', ams.status === 200 && ams.t.includes('AMS'));

for (const a of [
  '/styles/glass-motion.css',
  '/images/glass/shield.svg',
  '/images/glass/bars.svg',
  '/images/glass/chat.svg',
  '/scripts/spline-glass.js'
]) {
  const r = await fetch(base + a);
  must('asset ' + a, r.status === 200, String(r.status));
}

const failed = checks.filter((c) => !c.ok);
for (const c of checks) {
  console.log((c.ok ? 'PASS' : 'FAIL') + ' ' + c.name + (c.detail ? ' ' + c.detail : ''));
}
console.log(failed.length ? 'FAILED ' + failed.length : 'ALL PASS');
process.exit(failed.length ? 1 : 0);
