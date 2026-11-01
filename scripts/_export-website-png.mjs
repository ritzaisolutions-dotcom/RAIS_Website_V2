import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const chromePath =
  process.env.CHROME_PATH ||
  'C:\\Users\\kevin\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe';
const outDir = process.env.OUT_DIR || resolve(root, 'exports', 'website-png');
const base = process.env.BASE_URL || 'http://127.0.0.1:5173';

const pages = [
  'index.html',
  'systeme.html',
  'ams.html',
  'referenzen.html',
  'zusammenarbeit.html',
  'ueber-uns.html',
  'persoenlichkeit.html',
  'ai-roadmap.html',
  'akut.html',
  'datenschutz.html',
  'impressum.html',
  'danke.html',
  'roi-praemissen.html',
  'demo.html',
  'system-anfragen-qualifizieren.html',
  'system-support-agent.html',
  'system-onboarding.html',
  'system-dokumente-auslesen.html',
  'system-reporting.html',
];

mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl(port) {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const j = await res.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {
      // retry
    }
    await sleep(250);
  }
  throw new Error('No CDP endpoint');
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data.toString());
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    });
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
  }

  async send(method, params = {}, sessionId) {
    await this.ready;
    const id = ++this.id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    const p = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.ws.send(JSON.stringify(payload));
    return p;
  }

  close() {
    this.ws.close();
  }
}

const port = 9333 + Math.floor(Math.random() * 200);
const userData = resolve(outDir, '..', `.chrome-export-${port}`);
mkdirSync(userData, { recursive: true });

const chrome = spawn(
  chromePath,
  [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userData}`,
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

let exitCode = 0;
try {
  const browserWs = await getWsUrl(port);
  const browser = new Cdp(browserWs);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', {
    targetId,
    flatten: true,
  });

  const page = {
    send: (method, params = {}) => browser.send(method, params, sessionId),
  };

  await page.send('Page.enable');
  await page.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  for (const file of pages) {
    const url = file === 'index.html' ? `${base}/` : `${base}/${file}`;
    const name = file.replace(/\.html$/, '');
    const dest = resolve(outDir, `${name}.png`);
    process.stdout.write(`Capturing ${file} ... `);
    try {
      await page.send('Page.navigate', { url });
      await sleep(2000);
      const shot = await page.send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
        fromSurface: true,
      });
      writeFileSync(dest, Buffer.from(shot.data, 'base64'));
      console.log('OK');
    } catch (e) {
      exitCode = 1;
      console.log('FAIL: ' + e.message);
    }
  }

  browser.close();
  console.log('Done -> ' + outDir);
} catch (e) {
  exitCode = 1;
  console.error(e);
} finally {
  chrome.kill();
  try {
    rmSync(userData, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

process.exit(exitCode);
