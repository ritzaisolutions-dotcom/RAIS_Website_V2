/**
 * KI-Roadmap-Landingpage: zwei getrennte Bausteine.
 *
 * 1. Rechner (#roadmap-calc)
 *    Flach, keine Schritte. Drei Eingaben, das Ergebnis rechnet live
 *    daneben mit. Nichts davon verlaesst den Browser.
 *
 * 2. Gate vor dem Kalender (#roadmap-gate)
 *    Drei Fragen, dann erscheint das Cal-Embed. Bewusst ohne Name,
 *    E-Mail und Telefon: die entstehen genau einmal, naemlich in der
 *    Cal-Maske. Die drei Antworten gehen mit der Einwilligung an
 *    submit-funnel-lead (type "qualify") und landen in funnel_qualify.
 *
 * Der Kalender-Container traegt im Markup data-cal-deferred, damit
 * das autoMount in cal-embed.js ihn nicht selbst einhaengt. Erst nach
 * dem Gate ruft diese Datei RAISCal.mount() auf.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'rais:ai-roadmap';
  var WEEKS_PER_MONTH = 4.33;
  var PREVIEW_RATE = 0.7;

  var ALLOWED_EVENTS = {
    lp_view: true,
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

  function formatDe(n, digits) {
    return new Intl.NumberFormat('de-DE', {
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
    /* Vollkostensatz einer Teamstunde. Gleicher Startwert wie im
       Startseiten-Rechner, damit die Seite sich nicht widerspricht. */
    stundensatz: 45
  };

  function loadCalc() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      calc.volumenWoche = clampNum(parsed.volumenWoche, 5, 150, 25);
      calc.minutenProVorgang = clampNum(parsed.minutenProVorgang, 3, 40, 10);
      calc.stundensatz = clampNum(parsed.stundensatz, 10, 200, 45);
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

    if (hoursEl) hoursEl.textContent = formatDe(c.hoursMonth, 1) + ' Stunden pro Monat';
    if (boundEl) {
      boundEl.textContent =
        'gebunden durch ' + formatDe(calc.volumenWoche) + ' Vorgänge pro Woche';
    }
    if (euroEl) euroEl.textContent = formatDe(c.euroYear) + ' Euro pro Jahr';
    if (rateEl) {
      rateEl.textContent =
        'bei einem internen Stundensatz von ' + formatDe(calc.stundensatz) + ' Euro';
    }
    if (previewEl) {
      /* Die Kostenzahl steht in Euro, also steht die Rueckgewinnzahl
         auch in Euro. Sonst ist nur die Zahl monetarisiert, die weh
         tut, und die, die hilft, bleibt abstrakt. */
      previewEl.textContent =
        'Davon übernimmt das System nach dem Aufbau typischerweise 70 Prozent. Das sind rund ' +
        formatDe(c.recovered, 1) +
        ' Stunden pro Monat oder ' +
        formatDe(c.recoveredEuro) +
        ' Euro pro Jahr. 70 Prozent sind eine Vorschau, nicht die Vertragszahl. Den genauen Wert legen wir vor dem Bau gemeinsam fest.';
    }

    /* Kurzfassung fuer die Live-Region. Das ganze Ergebnisfeld als
       aria-live waere bei jedem Reglerschritt sechs Absaetze. */
    var liveEl = document.getElementById('rf-live');
    if (liveEl) {
      liveEl.textContent =
        formatDe(c.hoursMonth, 1) +
        ' Stunden pro Monat, ' +
        formatDe(c.euroYear) +
        ' Euro pro Jahr.';
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
      ['rf-rate', 'stundensatz', 10, 200, 45]
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

  /* ── 2. Gate vor dem Kalender ───────────────────────────────── */

  var gate = document.getElementById('roadmap-gate');

  if (gate) {
    var GATE_STEPS = 3;
    var gateStep = 1;
    var gateState = { pain: '', ecosystem: '', crm: '', volume: 25 };
    var gateSent = {};
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

    function paintGate(moveFocus) {
      gate.querySelectorAll('[data-gstep]').forEach(function (panel) {
        panel.hidden = Number(panel.getAttribute('data-gstep')) !== gateStep;
      });
      if (gateCount) gateCount.textContent = 'Frage ' + gateStep + ' von ' + GATE_STEPS;
      gateBars.forEach(function (bar) {
        bar.classList.toggle('is-filled', Number(bar.getAttribute('data-gbar')) <= gateStep);
      });
      if (gateBack) gateBack.hidden = gateStep === 1;
      if (gateSubmit) {
        gateSubmit.textContent = gateStep === GATE_STEPS ? 'Weiter zum Kalender' : 'Weiter';
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

    /* Einfachauswahl: der Klick ist die Antwort, ein zusaetzliches
       "Weiter" bringt keine Information. */
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
      /* Wer den Rechner oben schon benutzt hat, findet den Wert hier
         wieder, statt ihn ein zweites Mal einzustellen. Sobald der
         Regler hier einmal selbst bewegt wurde, gilt dieser Wert und
         der Rechner schreibt ihn nicht mehr um. */
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

    function revealCal() {
      var el = document.getElementById('cal-inline-contact');
      if (!el) return;
      el.hidden = false;
      /* Ab hier darf cal-embed.js den Container kennen. */
      el.removeAttribute('data-cal-deferred');
      el.setAttribute('data-cal-inline', '');

      var done = document.getElementById('gate-done');
      if (done) done.hidden = false;
      gate.hidden = true;

      if (window.RAISCal && typeof window.RAISCal.mount === 'function') {
        window.RAISCal.mount(el, {
          source: 'ai-roadmap',
          icpSegment: gateState.pain === 'mieteranliegen' ? 'verwaltung' : 'makler',
          config: calConfig()
        });
      }

      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function calConfig() {
      var c = compute();
      var notes = [
        'Engpass: ' + gateState.pain,
        'Mail/Kalender: ' + gateState.ecosystem,
        'CRM: ' + gateState.crm,
        'Volumen: ' + gateState.volume + ' / Woche',
        'Rechner: ' + formatDe(c.hoursMonth, 1) + ' h/Monat bei ' + formatDe(calc.stundensatz) + ' EUR/Std'
      ].join('\n');
      var config = {
        locale: 'de',
        notes: notes,
        'anfragen-pro-woche': String(gateState.volume),
        crm: gateState.crm
      };
      var engpass = PAIN_TO_ENGPASS[gateState.pain];
      if (engpass) config.engpass = engpass;
      return config;
    }

    if (gateSubmit) {
      gateSubmit.addEventListener('click', function () {
        /* Jede Frage wird dort geprueft, wo sie gestellt wurde.
           Sonst springt der Fehler an eine Stelle, die gerade gar
           nicht sichtbar ist. */
        if (gateStep === 1) {
          if (!gateState.pain) {
            gateError('Bitte wählen Sie, wo es am meisten weh tut.');
            return;
          }
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
            gateError('Bitte Mail-System und CRM angeben.');
            return;
          }
          gateGo(3);
          return;
        }

        if (!gatePrivacy || !gatePrivacy.checked) {
          markInvalid(gatePrivacy, true);
          gateError('Bitte stimmen Sie der Speicherung zu, dann geht es weiter.');
          return;
        }
        markInvalid(gatePrivacy, false);

        gateError('');
        emitGateStep(3);

        gateSubmit.disabled = true;
        gateSubmit.textContent = 'Einen Moment…';

        /* Der Kalender darf nicht davon abhaengen, ob das Speichern
           klappt. Fehlschlaege landen im Log, der Termin bleibt
           erreichbar. */
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
          gateSubmit.textContent = 'Weiter zum Kalender';
          revealCal();
        });
      });
    }

    paintGate(false);
  }

  /* ── Ablauf-Linien ── */

  var steps = document.getElementById('roadmap-steps');
  if (steps) {
    var reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      steps.classList.add('is-drawn');
    } else if (typeof IntersectionObserver === 'function') {
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            steps.classList.add('is-drawn');
            obs.disconnect();
          });
        },
        { threshold: 0.35 }
      );
      obs.observe(steps);
    } else {
      steps.classList.add('is-drawn');
    }
  }

  track('lp_view');
})();
