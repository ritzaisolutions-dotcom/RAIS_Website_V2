/**
 * Zuordnungsdaten fuer die Cal.com-Buchung (serverseitiges Schedule per Conversions API).
 *
 * Reine Hilfsfunktionen, ohne DOM- oder Cookie-Zugriff. Alles, was gelesen wird,
 * kommt als Parameter herein, damit die Funktionen testbar bleiben. Der Aufrufer
 * (scripts/cal-embed.js) liefert die Werte erst, nachdem die Klaro-Services "cal"
 * und "meta-pixel" eingewilligt sind. Ohne Einwilligung gibt trackingConfig {} zurueck.
 *
 * Die Felder landen als Prefill in versteckten Cal-Feldern. Dort muessen Fragen mit
 * genau diesen Bezeichnern existieren: event_id, fbp, fbc, client_user_agent,
 * event_source_url, utm_source, utm_campaign, utm_content.
 *
 * Laedt im Browser als window.RAISCalTracking, in Node per require/import.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module && module.exports) {
    module.exports = api;
  }
  if (root) root.RAISCalTracking = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var MAX_VALUE = 256;
  var MAX_BY_FIELD = { event_source_url: 1000, client_user_agent: 512 };
  var FBCLID_RE = /^[A-Za-z0-9_-]{1,500}$/;

  function pad(n, len) {
    var s = n.toString(16);
    while (s.length < len) s = '0' + s;
    return s;
  }

  /* UUID v4. Reihenfolge: randomUUID, getRandomValues, Math.random. */
  function newEventId(cryptoLike) {
    var c = cryptoLike === undefined ? (typeof crypto !== 'undefined' ? crypto : null) : cryptoLike;
    try {
      if (c && typeof c.randomUUID === 'function') return c.randomUUID();
    } catch (e) {
      /* weiter mit Fallback */
    }
    var bytes = new Array(16);
    var filled = false;
    try {
      if (c && typeof c.getRandomValues === 'function') {
        var arr = new Uint8Array(16);
        c.getRandomValues(arr);
        for (var i = 0; i < 16; i++) bytes[i] = arr[i];
        filled = true;
      }
    } catch (e) {
      /* weiter mit Math.random */
    }
    if (!filled) {
      for (var j = 0; j < 16; j++) bytes[j] = Math.floor(Math.random() * 256);
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = '';
    for (var k = 0; k < 16; k++) hex += pad(bytes[k], 2);
    return (
      hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' +
      hex.slice(16, 20) + '-' + hex.slice(20)
    );
  }

  /* Meta-Format fuer fbc: fb.1.<Unix-ms>.<fbclid>. Leer, wenn fbclid fehlt oder ungueltig ist. */
  function buildFbc(fbclid, nowMs) {
    if (typeof fbclid !== 'string' || !FBCLID_RE.test(fbclid)) return '';
    var ms = typeof nowMs === 'number' && isFinite(nowMs) ? Math.floor(nowMs) : Date.now();
    return 'fb.1.' + ms + '.' + fbclid;
  }

  function readCookie(name, cookieString) {
    if (!cookieString || typeof cookieString !== 'string') return '';
    var parts = cookieString.split(';');
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].replace(/^\s+/, '');
      var eq = part.indexOf('=');
      if (eq === -1) continue;
      if (part.slice(0, eq) === name) {
        var raw = part.slice(eq + 1);
        try {
          return decodeURIComponent(raw);
        } catch (e) {
          return raw;
        }
      }
    }
    return '';
  }

  function param(search, name) {
    if (!search) return '';
    var qs = search.charAt(0) === '?' ? search.slice(1) : search;
    var pairs = qs.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var eq = pairs[i].indexOf('=');
      var key = eq === -1 ? pairs[i] : pairs[i].slice(0, eq);
      var val = eq === -1 ? '' : pairs[i].slice(eq + 1);
      var dk;
      try {
        dk = decodeURIComponent(key.replace(/\+/g, ' '));
      } catch (e) {
        dk = key;
      }
      if (dk !== name) continue;
      try {
        return decodeURIComponent(val.replace(/\+/g, ' '));
      } catch (e) {
        return val;
      }
    }
    return '';
  }

  function clean(value, max) {
    if (typeof value !== 'string') return '';
    var v = value.trim();
    var limit = max || MAX_VALUE;
    return v.length > limit ? v.slice(0, limit) : v;
  }

  function stripHash(href) {
    if (typeof href !== 'string') return '';
    var i = href.indexOf('#');
    return i === -1 ? href : href.slice(0, i);
  }

  /**
   * @param {{consent:boolean, cookie?:string, href?:string, search?:string,
   *          userAgent?:string, eventId?:string, nowMs?:number}} env
   * @returns {Object<string,string>} nur nicht leere Felder. Ohne consent: {}.
   */
  function trackingConfig(env) {
    var e = env || {};
    if (e.consent !== true) return {};

    var search = e.search || '';
    var fbc = readCookie('_fbc', e.cookie);
    if (!fbc) fbc = buildFbc(param(search, 'fbclid'), e.nowMs);

    var fields = {
      event_id: e.eventId,
      fbp: readCookie('_fbp', e.cookie),
      fbc: fbc,
      client_user_agent: e.userAgent,
      event_source_url: stripHash(e.href),
      utm_source: param(search, 'utm_source'),
      utm_campaign: param(search, 'utm_campaign'),
      utm_content: param(search, 'utm_content'),
    };

    var out = {};
    Object.keys(fields).forEach(function (key) {
      var v = clean(fields[key], MAX_BY_FIELD[key]);
      if (v) out[key] = v;
    });
    return out;
  }

  return {
    newEventId: newEventId,
    buildFbc: buildFbc,
    readCookie: readCookie,
    trackingConfig: trackingConfig,
  };
});
