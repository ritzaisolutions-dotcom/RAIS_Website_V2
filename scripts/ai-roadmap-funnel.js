/**
 * KI-Roadmap-Landingpage: Rechner + Funnel-Events.
 *
 * Rechner (#roadmap-calc): lokal, nichts verlässt den Browser.
 * Termin: Cal.com Embed (scripts/cal-embed.js), Quali-Fragen im Event.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'rais:ai-roadmap';
  var WEEKS_PER_MONTH = 4.33;
  var PREVIEW_RATE = 0.7;

  var ALLOWED_EVENTS = {
    lp_view: true,
    vsl_start: true,
    funnel_result_view: true,
    booking_confirmed: true,
  };

  var cfg = window.RAIS_PUBLIC_CONFIG || {};
  var SUPABASE_URL = cfg.supabaseUrl || '';
  var SUPABASE_ANON = cfg.supabaseAnonKey || '';

  var sessionId = funnelSessionId();

  function funnelSessionId() {
    var key = 'rais:ai-roadmap-sid';
    try {
      var existing = window.sessionStorage.getItem(key);
      if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
      var id = crypto.randomUUID();
      window.sessionStorage.setItem(key, id);
      return id;
    } catch (e) {
      return crypto.randomUUID();
    }
  }

  function utmSource() {
    var params = new URLSearchParams(window.location.search);
    var source = params.get('utm_source') || params.get('source') || '';
    source = String(source).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 100);
    return source || 'direct';
  }

  function clampNum(value, min, max, fallback) {
    var n = Number(value);
    if (!isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function t(text) {
    return window.RAIS && typeof window.RAIS.t === 'function' ? window.RAIS.t(text) : text;
  }

  function formatDe(n, digits) {
    var locale = window.RAIS && window.RAIS.lang && window.RAIS.lang() === 'en' ? 'en-GB' : 'de-DE';
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: digits == null ? 0 : digits,
      minimumFractionDigits: digits == null ? 0 : digits,
    }).format(n);
  }

  function post(payload) {
    if (!SUPABASE_URL || !SUPABASE_ANON) return Promise.resolve(null);
    return fetch(SUPABASE_URL + '/functions/v1/submit-funnel-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON,
        Authorization: 'Bearer ' + SUPABASE_ANON,
      },
      body: JSON.stringify(payload),
    }).catch(function () {
      return null;
    });
  }

  function track(name, extra) {
    if (!ALLOWED_EVENTS[name]) return;
    var payload = Object.assign(
      {
        type: 'event',
        event: name,
        quelle: utmSource(),
        session_id: sessionId,
      },
      extra || {},
    );
    try {
      window.dispatchEvent(new CustomEvent('rais:funnel', { detail: payload }));
    } catch (e) {
      /* ignore */
    }
    post(payload);
  }

  window.RAISFunnel = { track: track };

  var calc = {
    volumenWoche: 25,
    minutenProVorgang: 10,
    stundensatz: 25,
  };

  function loadCalc() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      calc.volumenWoche = clampNum(parsed.volumenWoche, 5, 150, 25);
      calc.minutenProVorgang = clampNum(parsed.minutenProVorgang, 3, 40, 10);
      calc.stundensatz = clampNum(parsed.stundensatz, 10, 200, 25);
    } catch (e) {
      /* private mode */
    }
  }

  function saveCalc() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(calc));
    } catch (e) {
      /* private mode */
    }
  }

  function compute() {
    var hoursMonth =
      (calc.volumenWoche * calc.minutenProVorgang * WEEKS_PER_MONTH) / 60;
    var euroYear = hoursMonth * calc.stundensatz * 12;
    return {
      hoursMonth: hoursMonth,
      euroYear: euroYear,
      recovered: hoursMonth * PREVIEW_RATE,
      recoveredEuro: euroYear * PREVIEW_RATE,
    };
  }

  var calcRoot = document.getElementById('roadmap-calc');
  var resultSeen = false;

  function paintCalc() {
    var volOut = document.getElementById('rf-volume-out');
    var minOut = document.getElementById('rf-minutes-out');
    if (volOut) volOut.textContent = String(calc.volumenWoche);
    if (minOut) minOut.textContent = String(calc.minutenProVorgang);

    var c = compute();
    var hoursEl = document.getElementById('rf-hours');
    var boundEl = document.getElementById('rf-bound');
    var euroEl = document.getElementById('rf-euro');
    var rateEl = document.getElementById('rf-rate-copy');
    var previewEl = document.getElementById('rf-preview');

    if (hoursEl) hoursEl.textContent = t(formatDe(c.hoursMonth, 1) + ' Stunden pro Monat');
    if (boundEl) {
      boundEl.textContent = t(
        'gebunden durch ' + formatDe(calc.volumenWoche) + ' Vorgänge pro Woche',
      );
    }
    if (euroEl) euroEl.textContent = t(formatDe(c.euroYear) + ' Euro pro Jahr');
    if (rateEl) {
      rateEl.textContent = t(
        'bei einem internen Stundensatz von ' + formatDe(calc.stundensatz) + ' Euro',
      );
    }
    if (previewEl) {
      previewEl.textContent = t(
        'Davon übernimmt das System nach dem Aufbau typischerweise 70 Prozent. Das sind rund ' +
          formatDe(c.recovered, 1) +
          ' Stunden pro Monat oder ' +
          formatDe(c.recoveredEuro) +
          ' Euro pro Jahr. 70 Prozent sind eine Vorschau, nicht die Vertragszahl. Den genauen Wert legen wir vor dem Bau gemeinsam fest.',
      );
    }

    var liveEl = document.getElementById('rf-live');
    if (liveEl) {
      liveEl.textContent = t(
        formatDe(c.hoursMonth, 1) +
          ' Stunden pro Monat, ' +
          formatDe(c.euroYear) +
          ' Euro pro Jahr.',
      );
    }
  }

  if (calcRoot) {
    loadCalc();

    var volEl = document.getElementById('rf-volume');
    var minEl = document.getElementById('rf-minutes');
    var rateInput = document.getElementById('rf-rate');
    if (volEl) volEl.value = String(calc.volumenWoche);
    if (minEl) minEl.value = String(calc.minutenProVorgang);
    if (rateInput) rateInput.value = String(calc.stundensatz);

    [
      ['rf-volume', 'volumenWoche', 5, 150, 25],
      ['rf-minutes', 'minutenProVorgang', 3, 40, 10],
      ['rf-rate', 'stundensatz', 10, 200, 25],
    ].forEach(function (spec) {
      var el = document.getElementById(spec[0]);
      if (!el) return;
      el.addEventListener('input', function () {
        calc[spec[1]] = clampNum(el.value, spec[2], spec[3], spec[4]);
        paintCalc();
        saveCalc();
      });
    });

    paintCalc();

    if (typeof window.IntersectionObserver === 'function') {
      var calcObs = new window.IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting || resultSeen) return;
            resultSeen = true;
            calcObs.disconnect();
            track('funnel_result_view');
          });
        },
        { threshold: 0.4 },
      );
      calcObs.observe(calcRoot);
    }
  }

  var vslRoot = document.getElementById('roadmap-vsl');
  var vslPlay = document.getElementById('vsl-play');
  var vslPending = document.getElementById('vsl-pending');
  var vslStarted = false;
  if (vslPlay && vslRoot) {
    vslPlay.addEventListener('click', function () {
      if (!vslStarted) {
        vslStarted = true;
        track('vsl_start');
      }
      vslRoot.classList.add('is-pending');
      if (vslPending) vslPending.hidden = false;
    });
  }

  document.addEventListener('rais:lang', function () {
    paintCalc();
  });

  track('lp_view');
})();
