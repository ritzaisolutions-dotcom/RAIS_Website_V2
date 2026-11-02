/**
 * KI-Roadmap-Landingpage: zwei getrennte Bausteine.
 *
 * 1. Rechner (#roadmap-calc)
 *    Flach, keine Schritte. Drei Eingaben, das Ergebnis rechnet live
 *    daneben mit. Nichts davon verlaesst den Browser.
 *
 * 2. Gate vor dem Termin (#roadmap-gate)
 *    Drei Fragen, dann Step 4: Kontakt + Slot (RAISBooking.mountStep4).
 *    Nach Frage 1: Availability-Prefetch. Privacy-Consent in Step 3.
 *    answers gehen an booking-book (source ai-roadmap) und parallel
 *    an submit-funnel-lead (type qualify).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'rais:ai-roadmap';
  var WEEKS_PER_MONTH = 4.33;
  var PREVIEW_RATE = 0.7;

  var ALLOWED_EVENTS = {
    lp_view: true,
    vsl_start: true,
    funnel_step_1: true,
    funnel_step_2: true,
    funnel_step_3: true,
    funnel_result_view: true,
    booking_confirmed: true
  };

  /* Muss zu ALLOWED_PAIN in submit-funnel-lead und zum CHECK in
     20260818_create_funnel_qualify.sql passen. */
  var PAIN_TO_ENGPASS = {
    'manuelle-bearbeitung': 'inseratsanfragen-qualifizieren',
    mieteranliegen: 'mieteranliegen-management',
    reaktionszeit: 'inseratsanfragen-qualifizieren',
    terminierung: 'terminierung-besichtigungen'
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
      minimumFractionDigits: digits == null ? 0 : digits
    }).format(n);
  }

  function post(payload) {
    if (!SUPABASE_URL || !SUPABASE_ANON) return Promise.resolve(null);
    return fetch(SUPABASE_URL + '/functions/v1/submit-funnel-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON,
        Authorization: 'Bearer ' + SUPABASE_ANON
      },
      body: JSON.stringify(payload)
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
        session_id: sessionId
      },
      extra || {}
    );
    try {
      window.dispatchEvent(new CustomEvent('rais:funnel', { detail: payload }));
    } catch (e) {
      /* ignore */
    }
    post(payload);
  }

  window.RAISFunnel = { track: track };

  /* ── 1. Rechner ─────────────────────────────────────────────── */

  var calc = {
    volumenWoche: 25,
    minutenProVorgang: 10,
    /* Konservativer Default fuer die Landingpage (LinkedIn-Post). */
    stundensatz: 25
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
      recoveredEuro: euroYear * PREVIEW_RATE
    };
  }

  var calcRoot = document.getElementById('roadmap-calc');
  var resultSeen = false;
  /* Wird vom Gate gesetzt. So uebernimmt der Regler unten den Wert
     von oben, solange ihn niemand dort selbst angefasst hat. */
  var syncGateVolume = null;

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
        'gebunden durch ' + formatDe(calc.volumenWoche) + ' Vorgänge pro Woche'
      );
    }
    if (euroEl) euroEl.textContent = t(formatDe(c.euroYear) + ' Euro pro Jahr');
    if (rateEl) {
      rateEl.textContent = t(
        'bei einem internen Stundensatz von ' + formatDe(calc.stundensatz) + ' Euro'
      );
    }
    if (previewEl) {
      previewEl.textContent = t(
        'Davon übernimmt das System nach dem Aufbau typischerweise 70 Prozent. Das sind rund ' +
          formatDe(c.recovered, 1) +
          ' Stunden pro Monat oder ' +
          formatDe(c.recoveredEuro) +
          ' Euro pro Jahr. 70 Prozent sind eine Vorschau, nicht die Vertragszahl. Den genauen Wert legen wir vor dem Bau gemeinsam fest.'
      );
    }

    var liveEl = document.getElementById('rf-live');
    if (liveEl) {
      liveEl.textContent =
        t(
          formatDe(c.hoursMonth, 1) +
            ' Stunden pro Monat, ' +
            formatDe(c.euroYear) +
            ' Euro pro Jahr.'
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
      ['rf-rate', 'stundensatz', 10, 200, 25]
    ].forEach(function (spec) {
      var el = document.getElementById(spec[0]);
      if (!el) return;
      el.addEventListener('input', function () {
        calc[spec[1]] = clampNum(el.value, spec[2], spec[3], spec[4]);
        paintCalc();
        saveCalc();
        if (spec[1] === 'volumenWoche' && typeof syncGateVolume === 'function') {
          syncGateVolume(calc.volumenWoche);
        }
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
        { threshold: 0.4 }
      );
      calcObs.observe(calcRoot);
    }
  }

  /* ── 2. Gate → Step 4 Booking ───────────────────────────────── */

  var gate = document.getElementById('roadmap-gate');

  if (gate) {
    var GATE_STEPS = 3;
    var gateStep = 1;
    var gateState = { pain: '', ecosystem: '', crm: '', volume: 25 };
    var gateSent = {};
    var prefetchStarted = false;
    var gateErr = document.getElementById('gate-error');
    var gateSubmit = document.getElementById('gate-submit');
    var gateBack = document.getElementById('gate-back');
    var gateCount = document.getElementById('gate-count');
    var gateBars = gate.querySelectorAll('[data-gbar]');
    var gateVolume = document.getElementById('gate-volume');
    var gateVolumeOut = document.getElementById('gate-volume-out');
    var gateEcosystem = document.getElementById('gate-ecosystem');
    var gateCrm = document.getElementById('gate-crm');
    var gatePrivacy = document.getElementById('gate-privacy');

    var CONSENT_TEXT =
      'Ich habe die Datenschutzerklärung gelesen und bin einverstanden, dass diese drei Angaben zur Vorbereitung des Gesprächs gespeichert werden.';

    function gateError(message) {
      if (!gateErr) return;
      gateErr.hidden = !message;
      gateErr.textContent = message || '';
    }

    function markInvalid(el, on) {
      if (el) el.classList.toggle('is-invalid', !!on);
    }

    function emitGateStep(n) {
      if (gateSent[n]) return;
      gateSent[n] = true;
      track('funnel_step_' + n);
    }

    function startPrefetch() {
      if (prefetchStarted) return;
      prefetchStarted = true;
      if (window.RAISBooking && typeof window.RAISBooking.prefetch === 'function') {
        window.RAISBooking.prefetch({ event: 'erstgespraech' }).catch(function () {
          /* Prefetch ist Best-Effort; Step 4 lädt sonst selbst. */
        });
      }
    }

    function paintGate(moveFocus) {
      gate.querySelectorAll('[data-gstep]').forEach(function (panel) {
        panel.hidden = Number(panel.getAttribute('data-gstep')) !== gateStep;
      });
      if (gateCount) gateCount.textContent = t('Frage ' + gateStep + ' von ' + GATE_STEPS);
      gateBars.forEach(function (bar) {
        bar.classList.toggle('is-filled', Number(bar.getAttribute('data-gbar')) <= gateStep);
      });
      if (gateBack) gateBack.hidden = gateStep === 1;
      if (gateSubmit) {
        gateSubmit.textContent = t(gateStep === GATE_STEPS ? 'Weiter zum Termin' : 'Weiter');
      }
      gateError('');
      if (!moveFocus) return;
      var head = gate.querySelector('[data-gstep="' + gateStep + '"] legend');
      if (!head) return;
      head.setAttribute('tabindex', '-1');
      try {
        head.focus({ preventScroll: true });
      } catch (e) {
        head.focus();
      }
    }

    function gateGo(next) {
      gateStep = Math.min(GATE_STEPS, Math.max(1, next));
      paintGate(true);
    }

    gate.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-gate="pain"]');
      if (!btn || !gate.contains(btn)) return;
      gateState.pain = btn.getAttribute('data-value');
      gate.querySelectorAll('[data-gate="pain"]').forEach(function (el) {
        var on = el === btn;
        el.classList.toggle('is-active', on);
        el.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      emitGateStep(1);
      startPrefetch();
      if (gateStep === 1) gateGo(2);
    });

    if (gateEcosystem) {
      gateEcosystem.addEventListener('change', function () {
        gateState.ecosystem = gateEcosystem.value;
        markInvalid(gateEcosystem, false);
        if (gateState.ecosystem && gateState.crm) emitGateStep(2);
        gateError('');
      });
    }

    if (gateCrm) {
      gateCrm.addEventListener('change', function () {
        gateState.crm = gateCrm.value;
        markInvalid(gateCrm, false);
        if (gateState.ecosystem && gateState.crm) emitGateStep(2);
        gateError('');
      });
    }

    if (gateVolume) {
      var gateVolumeTouched = false;
      gateState.volume = calc.volumenWoche;
      gateVolume.value = String(gateState.volume);
      if (gateVolumeOut) gateVolumeOut.textContent = String(gateState.volume);

      gateVolume.addEventListener('input', function () {
        gateVolumeTouched = true;
        gateState.volume = clampNum(gateVolume.value, 5, 150, 25);
        if (gateVolumeOut) gateVolumeOut.textContent = String(gateState.volume);
        emitGateStep(3);
      });

      syncGateVolume = function (value) {
        if (gateVolumeTouched) return;
        gateState.volume = value;
        gateVolume.value = String(value);
        if (gateVolumeOut) gateVolumeOut.textContent = String(value);
      };
    }

    if (gateBack) {
      gateBack.addEventListener('click', function () {
        gateGo(gateStep - 1);
      });
    }

    function bookingAnswers() {
      var answers = {
        pain: gateState.pain,
        ecosystem: gateState.ecosystem,
        crm: gateState.crm,
        volume: gateState.volume,
        anfragen_pro_woche: gateState.volume
      };
      var engpass = PAIN_TO_ENGPASS[gateState.pain];
      if (engpass) answers.engpass = engpass;
      return answers;
    }

    function revealStep4() {
      var el = document.getElementById('cal-inline-contact');
      if (!el) return;
      el.hidden = false;
      el.removeAttribute('data-cal-deferred');
      el.setAttribute('data-rais-booking-defer', '');

      var done = document.getElementById('gate-done');
      if (done) done.hidden = false;
      gate.hidden = true;

      var opts = {
        source: 'ai-roadmap',
        answers: bookingAnswers(),
        icpSegment: gateState.pain === 'mieteranliegen' ? 'verwaltung' : 'makler'
      };

      if (window.RAISBooking && typeof window.RAISBooking.mountStep4 === 'function') {
        window.RAISBooking.mountStep4(el, opts);
      } else if (window.RAISCal && typeof window.RAISCal.mount === 'function') {
        window.RAISCal.mount(el, opts);
      }

      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    if (gateSubmit) {
      gateSubmit.addEventListener('click', function () {
        if (gateStep === 1) {
          if (!gateState.pain) {
            gateError(t('Bitte wählen Sie, wo es am meisten weh tut.'));
            return;
          }
          startPrefetch();
          gateGo(2);
          return;
        }

        if (gateStep === 2) {
          var missing = false;
          if (!gateState.ecosystem) {
            markInvalid(gateEcosystem, true);
            missing = true;
          }
          if (!gateState.crm) {
            markInvalid(gateCrm, true);
            missing = true;
          }
          if (missing) {
            gateError(t('Bitte Mail-System und CRM angeben.'));
            return;
          }
          gateGo(3);
          return;
        }

        if (!gatePrivacy || !gatePrivacy.checked) {
          markInvalid(gatePrivacy, true);
          gateError(t('Bitte stimmen Sie der Speicherung zu, dann geht es weiter.'));
          return;
        }
        markInvalid(gatePrivacy, false);

        gateError('');
        emitGateStep(3);

        gateSubmit.disabled = true;
        gateSubmit.textContent = t('Einen Moment…');

        /* Termin darf nicht davon abhängen, ob Quali-Save klappt. */
        post({
          type: 'qualify',
          pain: gateState.pain,
          ecosystem: gateState.ecosystem,
          crm: gateState.crm,
          volumenWoche: gateState.volume,
          quelle: utmSource(),
          session_id: sessionId,
          privacy_ack: true,
          consent_text: CONSENT_TEXT
        }).then(function () {
          gateSubmit.disabled = false;
          gateSubmit.textContent = t('Weiter zum Termin');
          revealStep4();
        });
      });
    }

    paintGate(false);
  }

  /* ── VSL-Platzhalter ── */

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
    if (gate) paintGate(false);
  });

  track('lp_view');
})();
