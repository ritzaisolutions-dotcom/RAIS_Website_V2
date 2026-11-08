/**
 * Buchungsmodal — öffnet direkt Cal.com.
 * Quali-Fragen liegen in Cal.com, nicht mehr im Modal.
 */
(function () {
  'use strict';

  var modal = document.getElementById('booking-modal');
  if (!modal) return;

  var backdrop = document.getElementById('bm-backdrop');
  var closeBtn = document.getElementById('bm-close');
  var calWrap = document.getElementById('bm-cal-wrap');
  var lastFocused = null;
  var source = null;
  var icpSegment = null;
  var calMounted = false;

  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

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
      config: { locale: 'de' },
    });
    calMounted = true;
  }

  function warmCal() {
    if (!window.RAISCal) return;
    /* Kein automatisches Zustimmen: preload lädt nur, wenn schon beide
       Einwilligungen (Cal.com + Meta Pixel) vorliegen. */
    if (typeof window.RAISCal.preload === 'function') {
      window.RAISCal.preload({ ensureConsent: true });
    }
  }

  function openModal(opts) {
    var options = opts || {};
    lastFocused = document.activeElement;
    source = options.source || null;
    icpSegment = options.icp_segment || null;
    calMounted = false;
    modal.classList.add('is-open');
    document.body.classList.add('noscroll');

    /* Cal vorwärmen, aber nur mit bestehender Einwilligung; sonst zeigt das Modal das Zustimmungs-Gate. */
    warmCal();
    mountCal();

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
