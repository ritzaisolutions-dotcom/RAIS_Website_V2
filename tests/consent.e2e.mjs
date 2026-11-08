/**
 * Consent E2E (Playwright, system Chrome, clean profile per scenario).
 *
 * Usage:  npm run test:e2e            (startet vite auf Port 5191)
 *         BASE_URL=https://www.ritz-ai.solutions npm run test:e2e   (gegen Live)
 *
 * Meta, Cal.com und Wistia werden per Route abgefangen: Es erreichen
 * keine Testdaten diese Anbieter, und fbevents.js wird durch einen Stub ersetzt,
 * der wie das Original bei fbq('track', ...) einen Request auf facebook.com/tr
 * sendet. So prüfen wir unsere Verdrahtung, nicht Metas Skript.
 */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const PIXEL_ID = '1486765559987145';
const EXTERNAL_BASE = process.env.BASE_URL;
const PORT = 5191;
const BASE = EXTERNAL_BASE || `http://localhost:${PORT}`;
const THIRD_PARTY = /facebook\.(com|net)|cal\.com|wistia\.(com|net)/i;

const FBEVENTS_STUB = `
(function () {
  var id = null;
  var q = (window.fbq && window.fbq.queue) ? window.fbq.queue.slice() : [];
  function run(a) {
    if (a[0] === 'init') { id = a[1]; return; }
    if (a[0] === 'track') {
      new Image().src = 'https://www.facebook.com/tr?id=' + id + '&ev=' + encodeURIComponent(a[1]);
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
  const ctx = await browser.newContext({ locale: 'de-DE' });
  const seen = [];
  ctx.on('request', (req) => seen.push(req.url()));
  await ctx.route(/connect\.facebook\.net/, (r) =>
    r.fulfill({ status: 200, contentType: 'application/javascript', body: FBEVENTS_STUB }));
  await ctx.route(/www\.facebook\.com\/tr/, (r) =>
    r.fulfill({ status: 200, contentType: 'image/gif', body: Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64') }));
  await ctx.route(/(^https:\/\/([a-z0-9-]+\.)?cal\.com)|wistia/i, (r) =>
    r.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' }));
  if (blockPrefs) await ctx.route(/site-prefs\.js/, (r) => r.abort());
  const page = await ctx.newPage();
  return { ctx, page, seen };
}

const tr = (seen, ev) => seen.filter((u) => u.includes('facebook.com/tr') && u.includes(`ev=${ev}`) && u.includes(`id=${PIXEL_ID}`));
const hostOf = (u) => { try { return new URL(u).hostname; } catch { return ""; } };
const thirdParty = (seen) => seen.filter((u) => THIRD_PARTY.test(hostOf(u)));

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

async function openHome(page) {
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForSelector('#klaro .cookie-notice, #klaro .cookie-modal', { state: 'visible', timeout: 8000 });
}

await startServer();
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  await scenario('1 Banner sichtbar, vor Einwilligung kein Drittanbieter-Request und kein fbq', async () => {
    const { ctx, page, seen } = await newPage(browser);
    await openHome(page);
    await page.waitForTimeout(1200);
    assert.equal(await page.evaluate(() => typeof window.fbq), 'undefined');
    assert.deepEqual(thirdParty(seen), [], 'Requests vor Einwilligung: ' + thirdParty(seen).join(', '));
    await ctx.close();
  });

  await scenario('2 Alle akzeptieren: fbq definiert, PageView-Request an facebook.com/tr', async () => {
    const { ctx, page, seen } = await newPage(browser);
    await openHome(page);
    const pageView = page.waitForRequest((r) => r.url().includes('facebook.com/tr') && r.url().includes('ev=PageView'), { timeout: 8000 });
    await page.getByRole('button', { name: /Alle akzeptieren/ }).first().click();
    await pageView;
    assert.equal(await page.evaluate(() => typeof window.fbq), 'function');
    assert.equal(tr(seen, 'PageView').length, 1, 'genau ein PageView erwartet');
    await ctx.close();
  });

  await scenario('3 Nur notwendige: kein fbq, kein Request an Meta', async () => {
    const { ctx, page, seen } = await newPage(browser);
    await openHome(page);
    await page.getByRole('button', { name: /Ich lehne ab|Nur notwendige/ }).first().click();
    await page.waitForTimeout(2000);
    assert.equal(await page.evaluate(() => typeof window.fbq), 'undefined');
    assert.deepEqual(seen.filter((u) => /facebook\.(com|net)/.test(u)), []);
    await ctx.close();
  });

  await scenario('4 Buchungs-Gate: ohne Zustimmung kein Cal-Request; Klick lädt Cal + Pixel; Buchung sendet Schedule', async () => {
    const { ctx, page, seen } = await newPage(browser);
    await openHome(page);
    await page.getByRole('button', { name: /Ich lehne ab|Nur notwendige/ }).first().click();
    await page.waitForTimeout(500);
    await page.locator('.js-open-booking').first().click();
    const gate = page.locator('#bm-cal-wrap .cal-gate');
    await gate.waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(800);
    assert.deepEqual(seen.filter((u) => /cal\.com|facebook/i.test(u)), [], 'vor dem Klick darf nichts an Cal/Meta gehen');
    const pageView = page.waitForRequest((r) => r.url().includes('facebook.com/tr') && r.url().includes('ev=PageView'), { timeout: 8000 });
    await gate.getByRole('button', { name: /Zustimmen und Termin/ }).click();
    await pageView;
    await page.waitForSelector('#bm-cal-wrap iframe', { timeout: 8000 });
    assert((await page.locator('#bm-cal-wrap iframe').getAttribute('src')).startsWith('https://app.cal.com/'));
    const schedule = page.waitForRequest((r) => r.url().includes('facebook.com/tr') && r.url().includes('ev=Schedule'), { timeout: 8000 });
    await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', { origin: 'https://app.cal.com', data: { type: 'bookingSuccessful' } })));
    await schedule;
    assert.equal(tr(seen, 'Schedule').length, 1);
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

} finally {
  await browser.close();
  if (server) server.kill();
}

const failed = results.filter((r) => r[0] === 'FAIL');
console.log(`\n${results.length - failed.length}/${results.length} bestanden`);
process.exit(failed.length ? 1 : 0);
