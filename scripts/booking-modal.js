/**
 * Buchungsmodal — 4 Schritte.
 *
 * 1–3: Quali-Fragen, jeder Klick geht sofort weiter.
 * 4: Cal.com. Consent + Script-Warmup schon beim Öffnen (CTA = Einwilligung).
 */
(function () {
  'use strict';

  var modal = document.getElementById('booking-modal');
  if (!modal) return;

  var backdrop = document.getElementById('bm-backdrop');
  var closeBtn = document.getElementById('bm-close');
  var calWrap = document.getElementById('bm-cal-wrap');
  var lastFocused = null;
  var step = 1;
  var answers = {};
  var source = null;
  var icpSegment = null;
  var calMounted = false;

  var PAIN_LABEL = {
    kaufanfragen: 'Planbare, kaufkräftige Nachfragen',
    eigentuemer: 'Angebot an Eigentümer, die verkaufen wollen',
    nachfassen: 'Manuelle Arbeit: schnell abholen und nachfassen',
  };
  var SOCIAL_LABEL = {
    nein: 'Nein, noch nicht',
    ja: 'Ja',
  };

  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  function showStep(n) {
    step = n;
    modal.querySelectorAll('.bm-step').forEach(function (el) {
      var id = el.id || '';
      var match = id.match(/^bm-step-(\d+)$/);
      var num = match ? Number(match[1]) : 0;
      el.classList.toggle('is-active', num === n);
    });
    modal.querySelectorAll('[data-bm-dot]').forEach(function (dot) {
      var d = Number(dot.getAttribute('data-bm-dot'));
      dot.classList.toggle('is-filled', d <= n);
      dot.classList.toggle('is-current', d === n);
    });
    if (n === 4) mountCal();
  }

  function calConfig() {
    var cfg = { locale: 'de' };
    if (answers.pain && PAIN_LABEL[answers.pain]) cfg.pain = PAIN_LABEL[answers.pain];
    if (answers.sales_per_year != null && answers.sales_per_year !== '') {
      cfg.sales_per_year = String(answers.sales_per_year);
    }
    if (answers.social_media && SOCIAL_LABEL[answers.social_media]) {
      cfg.social_media = SOCIAL_LABEL[answers.social_media];
    }
    return cfg;
  }

  function mountCal() {
    if (!calWrap || !window.RAISCal) return;
    var pageCal = document.body && document.body.getAttribute('data-cal-url');
    var isConvert = document.body && document.body.getAttribute('data-page') === 'convert';
    calWrap.innerHTML = '';
    calWrap.classList.remove('is-loading');
    window.RAISCal.mount(calWrap, {
      source: source || null,
      icpSegment: icpSegment || null,
      calUrl: pageCal || undefined,
      ensureConsent: true,
      remount: calMounted,
      noLead: isConvert || (document.body && document.body.hasAttribute('data-cal-nolead')),
      direct: true,
      config: calConfig(),
    });
    calMounted = true;
  }

  function warmCal() {
    if (!window.RAISCal) return;
    if (typeof window.RAISCal.grantConsent === 'function') window.RAISCal.grantConsent();
    if (typeof window.RAISCal.ensureConsent === 'function') window.RAISCal.ensureConsent();
    if (typeof window.RAISCal.preload === 'function') {
      window.RAISCal.preload({ ensureConsent: true });
    }
  }

  function openModal(opts) {
    var options = opts || {};
    lastFocused = document.activeElement;
    source = options.source || null;
    icpSegment = options.icp_segment || null;
    answers = {};
    calMounted = false;
    modal.classList.add('is-open');
    document.body.classList.add('noscroll');

    /* CTA-Klick = Einwilligung → Cal so früh wie möglich warmen. */
    warmCal();
    showStep(1);

    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('noscroll');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  function onChoiceClick(btn) {
    var stepEl = btn.closest('.bm-step');
    if (!stepEl) return;
    var key = stepEl.getAttribute('data-bm-q');
    if (!key) return;
    var value = btn.getAttribute('data-value');
    if (value == null || value === '') return;

    stepEl.querySelectorAll('.bm-choice').forEach(function (el) {
      el.classList.toggle('is-selected', el === btn);
      el.setAttribute('aria-checked', el === btn ? 'true' : 'false');
    });

    if (key === 'sales_per_year') {
      answers[key] = Number(value);
    } else {
      answers[key] = value;
    }

    var next = Number(stepEl.getAttribute('data-bm-next') || step + 1);
    window.setTimeout(function () {
      showStep(next);
    }, 120);
  }

  window.RAIS_openBooking = openModal;

  document.querySelectorAll('.js-open-booking').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (el.tagName === 'A') e.preventDefault();
      openModal({
        source: el.getAttribute('data-source') || el.id || null,
        icp_segment: el.getAttribute('data-icp') || null,
      });
    });
  });

  modal.addEventListener('click', function (e) {
    var btn = e.target.closest('.bm-choice');
    if (btn && modal.contains(btn)) onChoiceClick(btn);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key !== 'Tab') return;
    var items = modal.querySelectorAll(FOCUSABLE);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
