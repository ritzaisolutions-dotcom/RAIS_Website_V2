/**
 * Consent E2E (Playwright, system Chrome, clean profile per scenario).
 *
 * Usage:  npm run test:e2e            (startet vite auf Port 5191)
 *         BASE_URL=https://www.ritz-ai.solutions npm run test:e2e   (gegen Live)
 *         E2E_STUB_FB=1 npm run test:e2e   (Meta nicht erreichbar: fbevents.js durch Stub ersetzen)
 *
 * Standard: Die echte Bibliothek connect.facebook.net/en_US/fbevents.js wird geladen
 * (nur eine statische Datei). Jede Anfrage an www.facebook.com wird beobachtet und
 * dann abgebrochen. So erscheinen Requests wie facebook.com/tr?ev=PageView im Test,
 * aber keine Testereignisse landen im Dataset RAIS_pixel.
 * Cal.com und Wistia werden per Route durch eine leere Seite ersetzt.
 */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const PIXEL_ID = '1486765559987145';
const EXTERNAL_BASE = process.env.BASE_URL;
const STUB_FB = process.env.E2E_STUB_FB === '1';
const PORT = 5191;
const BASE = EXTERNAL_BASE || `http://localhost:${PORT}`;
const DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const THIRD_PARTY = /facebook\.(com|net)|cal\.com|wistia\.(com|net)/i;

const FBEVENTS_STUB = `
(function () {
  var id = null;
  var q = (window.fbq && window.fbq.queue) ? window.fbq.queue.slice() : [];
  function run(a) {
    if (a[0] === 'init') { id = a[1]; return; }
    if (a[0] === 'track') {
      var url = 'https://www.facebook.com/tr?id=' + id + '&ev=' + encodeURIComponent(a[1]);
      if (a[3] && a[3].eventID) url += '&eid=' + encodeURIComponent(a[3].eventID);
      new Image().src = url;
    }
  }
  var f = function () { run([].slice.call(arguments)); };
  f.loaded = true; f.stub = true;
  window.fbq = f; window._fbq = f;
  q.forEach(run);
})();`;

let server;
async function startServer() {
  if (EXTERNAL_BASE) return;
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], {
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE + '/index.html');
      if (r.ok) return;
    } catch { /* noch nicht bereit */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('vite did not start');
}

async function newPage(browser, { blockPrefs = false } = {}) {
  // Die echte fbevents.js sendet in Headless-Chrome nichts (erkennt HeadlessChrome im User-Agent).
  // Deshalb meldet sich der Testbrowser wie ein normales Desktop-Chrome.
  const ctx = await browser.newContext({ locale: 'de-DE', userAgent: DESKTOP_UA });
  await ctx.addInitScript("Object.defineProperty(navigator, 'webdriver', { get: () => false })");
  const seen = [];
  ctx.on('request', (req) => seen.push(req.url()));
  if (STUB_FB) {
    await ctx.route(/connect\.facebook\.net/, (r) =>
      r.fulfill({ status: 200, contentType: 'application/javascript', body: FBEVENTS_STUB }));
    await ctx.route(/www\.facebook\.com/, (r) =>
      r.fulfill({ status: 200, contentType: 'image/gif', body: Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64') }));
  } else {
    await ctx.route(/connect\.facebook\.net/, (r) => r.continue());
    // Anfrage ist fuer ctx.on('request') sichtbar, geht aber nie raus.
    await ctx.route(/www\.facebook\.com/, (r) => r.abort());
  }
  await ctx.route(/(^https:\/\/([a-z0-9-]+\.)?cal\.com)|wistia/i, (r) =>
    r.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' }));
  if (blockPrefs) await ctx.route(/site-prefs\.js/, (r) => r.abort());
  const page = await ctx.newPage();
  return { ctx, page, seen };
}

const tr = (seen, ev) => seen.filter((u) => u.includes('facebook.com/tr') && u.includes(`ev=${ev}`) && u.includes(`id=${PIXEL_ID}`));
const hostOf = (u) => { try { return new URL(u).hostname; } catch { return ""; } };
const thirdParty = (seen) => seen.filter((u) => THIRD_PARTY.test(hostOf(u)));
const isTr = (ev) => (r) => r.url().includes('facebook.com/tr') && r.url().includes(`ev=${ev}`);
const ACCEPT = /Alle akzeptieren/;
const DECLINE = /Ich lehne ab|Nur notwendige/;

const results = [];
async function scenario(name, fn) {
  try {
    await fn();
    results.push(['PASS', name]);
    console.log('PASS', name);
  } catch (e) {
    results.push(['FAIL', name, e.message]);
    console.log('FAIL', name, '\n   ', e.message.split('\n')[0]);
  }
}

async function openHome(page, path = '/index.html') {
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForSelector('#klaro .cookie-notice, #klaro .cookie-modal', { state: 'visible', timeout: 8000 });
}

await startServer();
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-blink-features=AutomationControlled'] });

try {
  await scenario('1 Banner sichtbar, vor Einwilligung kein Drittanbieter-Request und kein fbq', async () => {
    const { ctx, page, seen } = await newPage(browser);
    await openHome(page);
    await page.waitForTimeout(1200);
    assert.equal(await page.evaluate(() => typeof window.fbq), 'undefined');
    assert.deepEqual(thirdParty(seen), [], 'Requests vor Einwilligung: ' + thirdParty(seen).join(', '));
    await ctx.close();
  });

  await scenario('2 Alle akzeptieren: echte fbq-Bibliothek, genau ein PageView-Request an facebook.com/tr', async () => {
    const { ctx, page, seen } = await newPage(browser);
    await openHome(page);
    const pageView = page.waitForRequest(isTr('PageView'), { timeout: 10000 });
    await page.getByRole('button', { name: ACCEPT }).first().click();
    await pageView;
    assert.equal(await page.evaluate(() => typeof window.fbq), 'function');
    if (!STUB_FB) {
      // getState gibt es nur in der echten Bibliothek, nicht in der Warteschlange aus dem Snippet.
      await page.waitForFunction(() => typeof window.fbq.getState === 'function', null, { timeout: 8000 });
      assert.equal(await page.evaluate(() => !!window.fbq.stub), false, 'es laeuft der Stub');
    }
    await page.waitForTimeout(500);
    assert.equal(tr(seen, 'PageView').length, 1, 'genau ein PageView erwartet');
    await ctx.close();
  });

  await scenario('3 Nur notwendige: kein fbq, kein Request an Meta', async () => {
    const { ctx, page, seen } = await newPage(browser);
    await openHome(page);
    await page.getByRole('button', { name: DECLINE }).first().click();
    await page.waitForTimeout(2000);
    assert.equal(await page.evaluate(() => typeof window.fbq), 'undefined');
    assert.deepEqual(seen.filter((u) => /facebook\.(com|net)/.test(u)), []);
    await ctx.close();
  });

  await scenario('4 Buchungs-Gate: ohne Zustimmung kein Cal-Request; Klick lädt Cal + Pixel; Buchung sendet Schedule mit eventID', async () => {
    const { ctx, page, seen } = await newPage(browser);
    await openHome(page);
    await page.getByRole('button', { name: DECLINE }).first().click();
    await page.waitForTimeout(500);
    await page.locator('.js-open-booking').first().click();
    const gate = page.locator('#bm-cal-wrap .cal-gate');
    await gate.waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(800);
    assert.deepEqual(seen.filter((u) => /cal\.com|facebook/i.test(hostOf(u))), [], 'vor dem Klick darf nichts an Cal/Meta gehen');
    const pageView = page.waitForRequest(isTr('PageView'), { timeout: 10000 });
    await gate.getByRole('button', { name: /Zustimmen und Termin/ }).click();
    await pageView;
    await page.waitForSelector('#bm-cal-wrap iframe', { timeout: 10000 });
    assert((await page.locator('#bm-cal-wrap iframe').getAttribute('src')).startsWith('https://app.cal.com/'));
    const eventId = await page.evaluate(() => window.RAIS_EVENT_ID);
    assert.match(eventId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    const schedule = page.waitForRequest(isTr('Schedule'), { timeout: 10000 });
    await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', { origin: 'https://app.cal.com', data: { type: 'bookingSuccessful' } })));
    const req = await schedule;
    assert.equal(tr(seen, 'Schedule').length, 1);
    assert.equal(new URL(req.url()).searchParams.get('eid'), eventId, 'Schedule traegt die eventID');
    await ctx.close();
  });

  await scenario('5 site-prefs.js blockiert: Fallback-Hinweis mit Mail + Cal-Link, Pixel und Drittanbieter bleiben aus', async () => {
    const { ctx, page, seen } = await newPage(browser, { blockPrefs: true });
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    const box = page.locator('#prefs-fallback');
    await box.waitFor({ state: 'visible', timeout: 5000 });
    assert(await box.locator('a[href="mailto:kevin@ritz-ai.solutions"]').count() === 1, 'Mail-Link fehlt');
    assert(await box.locator('a[href^="https://cal.com/"]').count() === 1, 'Cal-Link fehlt');
    await page.waitForTimeout(1200);
    assert.equal(await page.evaluate(() => typeof window.fbq), 'undefined');
    assert.deepEqual(thirdParty(seen), [], 'Requests ohne Consent-Tool: ' + thirdParty(seen).join(', '));
    await ctx.close();
  });

  await scenario('6 Normaler Start: kein Fallback-Hinweis, wenn site-prefs.js lädt', async () => {
    const { ctx, page } = await newPage(browser);
    await openHome(page);
    assert.equal(await page.locator('#prefs-fallback').count(), 0);
    await ctx.close();
  });

  await scenario('7 Mit Einwilligung: Iframe-src enthält event_id, fbp, fbc, user_agent, Seiten-URL und UTMs', async () => {
    const { ctx, page } = await newPage(browser);
    await openHome(page, '/index.html?fbclid=TEST123&utm_source=meta&utm_campaign=c1&utm_content=a1#abschnitt');
    const pageView = page.waitForRequest(isTr('PageView'), { timeout: 10000 });
    await page.getByRole('button', { name: ACCEPT }).first().click();
    await pageView;
    await page.locator('.js-open-booking').first().click();
    await page.waitForSelector('#bm-cal-wrap iframe', { timeout: 10000 });
    const src = await page.locator('#bm-cal-wrap iframe').getAttribute('src');
    const q = Object.fromEntries(new URL(src).searchParams.entries());
    assert.equal(q.event_id, await page.evaluate(() => window.RAIS_EVENT_ID), 'event_id');
    // Echte Bibliothek: eigener _fbc-Cookie, Domain-Index je nach Host (fb.0 auf localhost, fb.1 oder fb.2 live).
    // Stub: kein Cookie, also greift unser Fallback fb.1.<ms>.<fbclid>.
    assert.match(q.fbc, STUB_FB ? /^fb\.1\.\d+\.TEST123$/ : /^fb\.[0-2]\.\d+\.TEST123$/, 'fbc: ' + q.fbc);
    assert.equal(q.client_user_agent, await page.evaluate(() => navigator.userAgent), 'client_user_agent');
    assert.equal(q.event_source_url, `${BASE}/index.html?fbclid=TEST123&utm_source=meta&utm_campaign=c1&utm_content=a1`, 'event_source_url ohne Hash');
    assert.equal(q.utm_source, 'meta');
    assert.equal(q.utm_campaign, 'c1');
    assert.equal(q.utm_content, 'a1');
    if (!STUB_FB) {
      // Die echte Bibliothek setzt _fbp. Der Stub tut das nicht.
      assert.match(q.fbp, /^fb\.[0-2]\.\d+\.\d+$/, 'fbp: ' + q.fbp);
    }
    await ctx.close();
  });

  await scenario('8 Ohne Einwilligung: kein Iframe, keine Event-ID, kein fbp/fbc/user_agent irgendwo', async () => {
    const { ctx, page, seen } = await newPage(browser);
    await openHome(page, '/index.html?fbclid=TEST123&utm_source=meta');
    await page.getByRole('button', { name: DECLINE }).first().click();
    await page.waitForTimeout(500);
    await page.locator('.js-open-booking').first().click();
    await page.locator('#bm-cal-wrap .cal-gate').waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(1500);
    assert.equal(await page.locator('iframe[src*="cal.com"]').count(), 0, 'Cal-Iframe ohne Einwilligung');
    assert.equal(await page.evaluate(() => typeof window.RAIS_EVENT_ID), 'undefined');
    const cookies = await page.evaluate(() => document.cookie);
    assert(!/_fbp|_fbc/.test(cookies), 'Meta-Cookies ohne Einwilligung: ' + cookies);
    const leaked = seen.filter((u) => /[?&](fbp|fbc|client_user_agent|event_id)=/.test(u));
    assert.deepEqual(leaked, [], 'Zuordnungsfelder in Requests: ' + leaked.join(', '));
    assert.deepEqual(seen.filter((u) => /cal\.com|facebook/i.test(hostOf(u))), []);
    await ctx.close();
  });
} finally {
  await browser.close();
  if (server) server.kill();
}

const failed = results.filter((r) => r[0] === 'FAIL');
console.log(`\n${results.length - failed.length}/${results.length} bestanden`);
process.exit(failed.length ? 1 : 0);
