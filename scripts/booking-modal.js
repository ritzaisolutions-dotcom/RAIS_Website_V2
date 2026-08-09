/**
 * Buchungsmodal, einstufig.
 *
 * Das zweistufige Formular ist entfallen. Der Klick auf einen CTA
 * zeigt sofort den Kalender, der Lead entsteht nach bestaetigter
 * Buchung in scripts/cal-embed.js. Dieses Modul kuemmert sich nur
 * noch um Oeffnen, Schliessen, Fokus und die Quellenzuordnung.
 *
 * Die data-source-Werte der Buttons bleiben unveraendert, sie sind
 * der Schluessel der Lead-Attribution.
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
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])', 'iframe',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function openModal(opts) {
    var options = opts || {};
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    document.body.classList.add('noscroll');

    if (calWrap && window.RAISCal) {
      window.RAISCal.mount(calWrap, {
        source: options.source || null,
        icpSegment: options.icp_segment || null
      });
    }

    /* Der Kalender kommt asynchron, deshalb zuerst auf den
       Schliessen-Button. Von dort tabbt man in den Embed. */
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
    el.addEventListener('click', function () {
      openModal({
        source: el.getAttribute('data-source') || el.id || null,
        icp_segment: el.getAttribute('data-icp') || null
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

    /* Fokus bleibt im Dialog. Sobald der Cal-Iframe den Fokus hat,
       uebernimmt der Browser, das ist gewollt. */
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
}());
