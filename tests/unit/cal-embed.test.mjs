import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const CAL_EMBED = readFileSync('scripts/cal-embed.js', 'utf8');
const CAL_TRACKING = readFileSync('scripts/cal-tracking.js', 'utf8');

class El {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.attrs = {};
    this.style = {};
    this.listeners = {};
    this.className = '';
    this._text = '';
    this.id = '';
    this.classList = { add() {}, remove() {}, contains() { return false; } };
  }
  set innerHTML(v) { this.children = []; }
  get innerHTML() { return ''; }
  set textContent(v) { this._text = v; }
  get textContent() { return this._text; }
  appendChild(c) { this.children.push(c); return c; }
  setAttribute(k, v) { this.attrs[k] = v; }
  getAttribute(k) { return this.attrs[k] ?? null; }
  hasAttribute(k) { return k in this.attrs; }
  addEventListener(t, fn) { (this.listeners[t] ||= []).push(fn); }
  click() { (this.listeners.click || []).forEach((f) => f()); }
  querySelector() { return null; }
  find(pred) {
    if (pred(this)) return this;
    for (const c of this.children) {
      const r = c.find ? c.find(pred) : null;
      if (r) return r;
    }
    return null;
  }
}

/** Baut eine Fake-Seite, laedt cal-tracking.js (optional) und cal-embed.js. */
function setup({
  consents = {},
  cookie = '',
  href = 'https://ritz-ai.solutions/index.html?utm_source=meta&utm_campaign=herbst%202026#kontakt',
  search = '?utm_source=meta&utm_campaign=herbst%202026',
  userAgent = 'UA/1.0 (Test; Ä)',
  withTracking = true,
  debug = false,
} = {}) {
  const winListeners = {};
  const state = {
    consents: { ...consents },
    saves: 0,
    fbq: [],
    redirects: [],
    timers: [],
    intervals: [],
    scripts: [],
    logs: [],
    cookie,
  };
  const manager = {
    get consents() { return state.consents; },
    updateConsent(n, v) { state.consents[n] = v; },
    saveAndApplyConsents() { state.saves++; },
    watch() {},
  };
  const document = {
    readyState: 'complete',
    body: new El('body'),
    get cookie() { return state.cookie; },
    createElement: (t) => new El(t),
    createTextNode: (t) => { const e = new El('#text'); e._text = t; return e; },
    querySelector: () => null,
    querySelectorAll: () => [],
    head: { appendChild: (s) => state.scripts.push(s) },
    addEventListener() {},
  };
  const window = {
    RAIS_PUBLIC_CONFIG: {},
    klaro: { getManager: () => manager },
    addEventListener: (t, fn) => { (winListeners[t] ||= []).push(fn); },
    setTimeout: (fn, ms) => { state.timers.push({ fn, ms }); return state.timers.length; },
    clearTimeout() {},
    setInterval: (fn) => { state.intervals.push({ fn, cleared: false }); return state.intervals.length; },
    clearInterval: (id) => { if (state.intervals[id - 1]) state.intervals[id - 1].cleared = true; },
    location: { href, search, assign: (u) => state.redirects.push(u) },
    navigator: { userAgent },
    localStorage: { getItem: (k) => (debug && k === 'rais_debug_cal' ? '1' : null) },
    console: { info: (...a) => state.logs.push(a) },
    fbq: (...a) => state.fbq.push(a),
  };
  window.window = window;
  const ctx = vm.createContext({
    window, document, URL, console, encodeURIComponent, decodeURIComponent, JSON, Date, Promise,
    Object, String, Uint8Array, Math, isFinite, Number, Array, crypto: globalThis.crypto,
  });
  if (withTracking) vm.runInContext(CAL_TRACKING, ctx);
  vm.runInContext(CAL_EMBED, ctx);
  const tick = () => state.intervals.filter((i) => !i.cleared).forEach((i) => i.fn());
  return { window, state, winListeners, tick };
}

const wrap = () => { const el = new El('div'); el.id = 'bm-cal-wrap'; return el; };
const iframe = (el) => el.find((n) => n.tagName === 'IFRAME');
const gate = (el) => el.find((n) => n.className === 'cal-gate');
const query = (src) => Object.fromEntries(new URL(src).searchParams.entries());
const BOTH = { cal: true, 'meta-pixel': true };

describe('Einwilligungs-Gate', () => {
  it('zeigt ohne Einwilligung nur das Gate, erzeugt keine Event-ID und gibt nichts frei', () => {
    const { window, state } = setup({ cookie: '_fbp=fb.1.1.2' });
    const el = wrap();
    window.RAISCal.mount(el, { ensureConsent: true, direct: true });
    expect(gate(el)).toBeTruthy();
    expect(iframe(el)).toBeNull();
    expect(window.RAIS_EVENT_ID).toBeUndefined();
    expect(state.saves).toBe(0);
    expect(state.consents).toEqual({});
  });

  it('verlangt beide Services: nur cal reicht nicht', () => {
    const { window } = setup({ consents: { cal: true } });
    const el = wrap();
    window.RAISCal.mount(el, { ensureConsent: true, direct: true });
    expect(gate(el)).toBeTruthy();
    expect(iframe(el)).toBeNull();
    expect(window.RAIS_EVENT_ID).toBeUndefined();
  });

  it('preload laedt ohne Einwilligung kein Cal-Script', () => {
    const { window, state } = setup();
    window.RAISCal.preload({ ensureConsent: true });
    expect(state.scripts).toHaveLength(0);
  });
});

describe('Zuordnungsfelder im Iframe', () => {
  it('haengt alle Felder URL-kodiert an, wenn beide Einwilligungen da sind', () => {
    const { window } = setup({
      consents: BOTH,
      cookie: '_fbp=fb.1.111.222; _fbc=fb.1.333.CLICK',
    });
    const el = wrap();
    window.RAISCal.mount(el, { ensureConsent: true, direct: true, config: { locale: 'de' } });
    const src = iframe(el).src;
    expect(src.startsWith('https://app.cal.com/')).toBe(true);
    const q = query(src);
    expect(q.event_id).toBe(window.RAIS_EVENT_ID);
    expect(q.event_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(q.fbp).toBe('fb.1.111.222');
    expect(q.fbc).toBe('fb.1.333.CLICK');
    expect(q.client_user_agent).toBe('UA/1.0 (Test; Ä)');
    expect(q.event_source_url).toBe('https://ritz-ai.solutions/index.html?utm_source=meta&utm_campaign=herbst%202026');
    expect(q.utm_source).toBe('meta');
    expect(q.utm_campaign).toBe('herbst 2026');
    expect(q.locale).toBe('de');
    // rohe Zeichen duerfen nicht ungekodiert in der URL stehen
    expect(src).toContain('client_user_agent=UA%2F1.0%20(Test%3B%20%C3%84)');
    expect(src).not.toContain(' ');
  });

  it('laesst leere Werte weg (kein _fbp, kein utm_content)', () => {
    const { window, tick } = setup({ consents: BOTH, cookie: '' });
    const el = wrap();
    window.RAISCal.mount(el, { ensureConsent: true, direct: true });
    for (let i = 0; i < 13; i++) tick();
    const q = query(iframe(el).src);
    expect(q).not.toHaveProperty('fbp');
    expect(q).not.toHaveProperty('fbc');
    expect(q).not.toHaveProperty('utm_content');
    expect(q).toHaveProperty('event_id');
  });

  it('baut fbc aus fbclid, wenn der Cookie fehlt', () => {
    const { window } = setup({
      consents: BOTH,
      cookie: '_fbp=fb.1.1.2',
      search: '?fbclid=TEST123',
      href: 'https://ritz-ai.solutions/?fbclid=TEST123',
    });
    const el = wrap();
    window.RAISCal.mount(el, { ensureConsent: true, direct: true });
    expect(query(iframe(el).src).fbc).toMatch(/^fb\.1\.\d+\.TEST123$/);
  });

  it('wartet hoechstens 1200 ms auf _fbp und baut das Iframe dann trotzdem', () => {
    const { window, state, tick } = setup({ consents: BOTH, cookie: '' });
    const el = wrap();
    window.RAISCal.mount(el, { ensureConsent: true, direct: true });
    expect(iframe(el)).toBeNull();
    for (let i = 0; i < 11; i++) tick();
    expect(iframe(el)).toBeNull();
    tick();
    expect(iframe(el)).toBeTruthy();
    expect(state.intervals.every((i) => i.cleared)).toBe(true);
  });

  it('nimmt _fbp mit, sobald der Cookie waehrend des Wartens entsteht', () => {
    const { window, state, tick } = setup({ consents: BOTH, cookie: '' });
    const el = wrap();
    window.RAISCal.mount(el, { ensureConsent: true, direct: true });
    tick();
    tick();
    state.cookie = '_fbp=fb.1.9.9';
    tick();
    expect(query(iframe(el).src).fbp).toBe('fb.1.9.9');
  });

  it('baut nichts, wenn die Einwilligung waehrend des Wartens widerrufen wird', () => {
    const { window, state, tick } = setup({ consents: BOTH, cookie: '' });
    const el = wrap();
    window.RAISCal.mount(el, { ensureConsent: true, direct: true });
    state.consents['meta-pixel'] = false;
    for (let i = 0; i < 13; i++) tick();
    expect(iframe(el)).toBeNull();
  });

  it('funktioniert weiter, wenn cal-tracking.js fehlt (ohne Zusatzfelder)', () => {
    const { window } = setup({ consents: BOTH, cookie: '_fbp=fb.1.1.2', withTracking: false });
    const el = wrap();
    window.RAISCal.mount(el, { ensureConsent: true, direct: true, config: { locale: 'de' } });
    const q = query(iframe(el).src);
    expect(q.locale).toBe('de');
    expect(q).not.toHaveProperty('event_id');
    expect(q).not.toHaveProperty('fbp');
    expect(window.RAIS_EVENT_ID).toBeUndefined();
  });

  it('Gate-Klick gibt beide Services frei und erzeugt danach Event-ID und Felder', () => {
    const { window, state } = setup({ cookie: '_fbp=fb.1.1.2' });
    const el = wrap();
    window.RAISCal.mount(el, { ensureConsent: true, direct: true });
    el.find((n) => n.className === 'cal-gate__btn').click();
    expect(state.consents).toEqual(BOTH);
    const q = query(iframe(el).src);
    expect(q.event_id).toBe(window.RAIS_EVENT_ID);
    expect(q.fbp).toBe('fb.1.1.2');
  });
});

describe('Schedule', () => {
  const success = { origin: 'https://app.cal.com', data: { type: 'bookingSuccessfulV2', data: { uid: 'abc' } } };

  it('sendet Schedule mit eventID und leitet nach 400 ms weiter', () => {
    const { window, state, winListeners } = setup({ consents: BOTH, cookie: '_fbp=fb.1.1.2' });
    window.RAISCal.mount(wrap(), { ensureConsent: true, direct: true });
    (winListeners.message || []).forEach((f) => f(success));
    expect(state.fbq).toEqual([['track', 'Schedule', {}, { eventID: window.RAIS_EVENT_ID }]]);
    expect(state.redirects).toHaveLength(0);
    const t = state.timers.at(-1);
    expect(t.ms).toBe(400);
    t.fn();
    expect(state.redirects).toEqual(['/danke.html']);
  });

  it('feuert nur einmal, auch bei doppelter Nachricht', () => {
    const { window, state, winListeners } = setup({ consents: BOTH, cookie: '_fbp=fb.1.1.2' });
    window.RAISCal.mount(wrap(), { ensureConsent: true, direct: true });
    (winListeners.message || []).forEach((f) => f(success));
    (winListeners.message || []).forEach((f) => f(success));
    expect(state.fbq).toHaveLength(1);
  });

  it('sendet ohne fbq nichts und leitet sofort weiter', () => {
    const { window, state, winListeners } = setup({ consents: BOTH, cookie: '_fbp=fb.1.1.2' });
    window.RAISCal.mount(wrap(), { ensureConsent: true, direct: true });
    delete window.fbq;
    (winListeners.message || []).forEach((f) => f(success));
    expect(state.fbq).toHaveLength(0);
    expect(state.timers.at(-1).ms).toBe(0);
  });

  it('loggt die Buchungsnachricht nur mit Debug-Flag und nur in die Konsole', () => {
    const on = setup({ consents: BOTH, cookie: '_fbp=fb.1.1.2', debug: true });
    on.window.RAISCal.mount(wrap(), { ensureConsent: true, direct: true });
    (on.winListeners.message || []).forEach((f) => f(success));
    expect(on.state.logs).toHaveLength(1);
    expect(on.state.logs[0][1]).toMatchObject({
      source: 'iframe',
      type: 'bookingSuccessfulV2',
      keys: ['uid'],
      hasUid: true,
      uid: 'abc',
    });

    const off = setup({ consents: BOTH, cookie: '_fbp=fb.1.1.2' });
    off.window.RAISCal.mount(wrap(), { ensureConsent: true, direct: true });
    (off.winListeners.message || []).forEach((f) => f(success));
    expect(off.state.logs).toHaveLength(0);
  });

  it('ignoriert Nachrichten von fremden Origins', () => {
    const { window, state, winListeners } = setup({ consents: BOTH, cookie: '_fbp=fb.1.1.2' });
    window.RAISCal.mount(wrap(), { ensureConsent: true, direct: true });
    (winListeners.message || []).forEach((f) => f({ origin: 'https://evil.example', data: success.data }));
    expect(state.fbq).toHaveLength(0);
  });
});
