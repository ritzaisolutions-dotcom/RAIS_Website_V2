/**
 * Buchungsmodal — Custom RAIS Booking (kein Cal.com).
 *
 * CTA setzt Booking-Consent (gleiche Geste wie Gate) und öffnet den Flow.
 * data-source bleibt der Attribution-Schlüssel.
 */
(function () {
  'use strict';

  var modal = document.getElementById('booking-modal');
  if (!modal) return;

  var backdrop = document.getElementById('bm-backdrop');
  var closeBtn = document.getElementById('bm-close');
  var calWrap = document.getElementById('bm-cal-wrap');
  var lastFocused = null;

  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  function openModal(opts) {
    var options = opts || {};
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    document.body.classList.add('noscroll');

    if (calWrap && window.RAISBooking) {
      calWrap.innerHTML = '';
      calWrap.classList.remove('is-loading');
      if (
        options.ensureConsent !== false &&
        typeof window.RAISBooking.grantConsent === 'function'
      ) {
        /* CTA-Klick = Einwilligung, analog zum alten Cal-Gate */
        window.RAISBooking.grantConsent();
      }
      window.RAISBooking.mount(calWrap, {
        source: options.source || null,
        ensureConsent: false,
      });
    }

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
