import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const T = require('../../scripts/cal-tracking.js');

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('newEventId', () => {
  it('nutzt randomUUID, wenn vorhanden', () => {
    expect(T.newEventId({ randomUUID: () => 'fixed-id' })).toBe('fixed-id');
  });

  it('liefert mit dem echten crypto eine UUID v4 und ist eindeutig', () => {
    const a = T.newEventId();
    const b = T.newEventId();
    expect(a).toMatch(UUID_V4);
    expect(a).not.toBe(b);
  });

  it('faellt ohne randomUUID auf getRandomValues zurueck', () => {
    const id = T.newEventId({
      getRandomValues(arr) {
        for (let i = 0; i < arr.length; i++) arr[i] = 255;
        return arr;
      },
    });
    expect(id).toMatch(UUID_V4);
    expect(id).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
  });

  it('faellt ohne crypto auf Math.random zurueck', () => {
    expect(T.newEventId(null)).toMatch(UUID_V4);
  });

  it('faellt zurueck, wenn randomUUID wirft', () => {
    const id = T.newEventId({
      randomUUID() {
        throw new Error('nicht erlaubt');
      },
    });
    expect(id).toMatch(UUID_V4);
  });
});

describe('buildFbc', () => {
  it('baut fb.1.<ms>.<fbclid>', () => {
    expect(T.buildFbc('AbC-123_x', 1700000000123)).toBe('fb.1.1700000000123.AbC-123_x');
  });

  it('gibt bei fehlendem oder ungueltigem fbclid leer zurueck', () => {
    expect(T.buildFbc('', 1)).toBe('');
    expect(T.buildFbc(undefined, 1)).toBe('');
    expect(T.buildFbc('a b', 1)).toBe('');
    expect(T.buildFbc('a.b', 1)).toBe('');
    expect(T.buildFbc('x'.repeat(501), 1)).toBe('');
  });
});

describe('readCookie', () => {
  it('liest den passenden Cookie', () => {
    expect(T.readCookie('_fbp', 'a=1; _fbp=fb.1.2.3; b=2')).toBe('fb.1.2.3');
  });

  it('matcht nicht auf Teilnamen', () => {
    expect(T.readCookie('_fbp', 'x_fbp=1; _fbp2=2')).toBe('');
  });

  it('liefert leer ohne Treffer oder ohne Cookie-String', () => {
    expect(T.readCookie('_fbp', '')).toBe('');
    expect(T.readCookie('_fbp', undefined)).toBe('');
    expect(T.readCookie('_fbp', 'a=1')).toBe('');
  });
});

describe('trackingConfig', () => {
  const base = {
    consent: true,
    cookie: '_fbp=fb.1.111.222; _fbc=fb.1.333.CLICK',
    href: 'https://ritz-ai.solutions/index.html?utm_source=meta&x=1#kontakt',
    search: '?utm_source=meta&utm_campaign=herbst%202026&utm_content=ad_a&x=1',
    userAgent: 'UA/1.0 (Test)',
    eventId: 'evt-1',
    nowMs: 1700000000000,
  };

  it('gibt ohne Einwilligung ein leeres Objekt zurueck und liest nichts', () => {
    expect(T.trackingConfig({ ...base, consent: false })).toEqual({});
    expect(T.trackingConfig({ ...base, consent: undefined })).toEqual({});
    expect(T.trackingConfig({ ...base, consent: 'true' })).toEqual({});
    expect(T.trackingConfig()).toEqual({});
  });

  it('liefert mit Einwilligung alle Felder', () => {
    expect(T.trackingConfig(base)).toEqual({
      event_id: 'evt-1',
      fbp: 'fb.1.111.222',
      fbc: 'fb.1.333.CLICK',
      client_user_agent: 'UA/1.0 (Test)',
      event_source_url: 'https://ritz-ai.solutions/index.html?utm_source=meta&x=1',
      utm_source: 'meta',
      utm_campaign: 'herbst 2026',
      utm_content: 'ad_a',
    });
  });

  it('entfernt den Hash aus event_source_url', () => {
    expect(T.trackingConfig(base).event_source_url).not.toContain('#');
  });

  it('laesst leere Werte weg', () => {
    const out = T.trackingConfig({
      consent: true,
      cookie: '',
      href: 'https://ritz-ai.solutions/',
      search: '',
      userAgent: '',
      eventId: 'evt-2',
    });
    expect(out).toEqual({ event_id: 'evt-2', event_source_url: 'https://ritz-ai.solutions/' });
    expect(Object.keys(out)).not.toContain('fbp');
    expect(Object.keys(out)).not.toContain('utm_source');
  });

  it('bevorzugt den _fbc-Cookie vor fbclid in der URL', () => {
    const out = T.trackingConfig({ ...base, search: '?fbclid=FROMURL' });
    expect(out.fbc).toBe('fb.1.333.CLICK');
  });

  it('baut fbc aus fbclid, wenn der Cookie fehlt', () => {
    const out = T.trackingConfig({
      ...base,
      cookie: '_fbp=fb.1.111.222',
      search: '?fbclid=FROMURL',
    });
    expect(out.fbc).toBe('fb.1.1700000000000.FROMURL');
  });

  it('kappt lange Werte', () => {
    const out = T.trackingConfig({ ...base, search: '?utm_source=' + 'a'.repeat(400) });
    expect(out.utm_source).toHaveLength(256);
  });

  it('laesst lange Seiten-URLs und User-Agents bis zu ihrer Grenze zu', () => {
    const long = 'https://ritz-ai.solutions/?fbclid=' + 'x'.repeat(600);
    const out = T.trackingConfig({ ...base, href: long, userAgent: 'u'.repeat(600) });
    expect(out.event_source_url).toHaveLength(600 + 34);
    expect(out.client_user_agent).toHaveLength(512);
  });

  it('liefert keine Felder ohne Wert fuer fbclid mit Sonderzeichen', () => {
    const out = T.trackingConfig({ ...base, cookie: '', search: '?fbclid=a%20b' });
    expect(out).not.toHaveProperty('fbc');
  });
});
