/**
 * Deprecated stub: Cal.com Embed entfernt.
 * Alias auf scripts/rais-booking.js (Custom Booking), inkl. Step-4.
 * Bleibt geladen, falls alte Referenzen noch auf cal-embed.js zeigen.
 */
(function () {
  'use strict';

  function mountViaBooking(el, opts) {
    var o = opts || {};
    if (!window.RAISBooking) return;
    if (o.step4 || o.answers) {
      window.RAISBooking.mountStep4(el, {
        source: o.source || null,
        answers: o.answers || {},
        icpSegment: o.icpSegment || null,
      });
      return;
    }
    window.RAISBooking.mount(el, {
      source: o.source || null,
      ensureConsent: o.ensureConsent !== false,
    });
  }

  if (window.RAISBooking) {
    window.RAISCal = window.RAISCal || { mount: mountViaBooking };
    return;
  }

  var s = document.createElement('script');
  s.src = 'scripts/rais-booking.js';
  s.async = false;
  s.onload = function () {
    window.RAISCal = window.RAISCal || { mount: mountViaBooking };
  };
  document.head.appendChild(s);
})();
