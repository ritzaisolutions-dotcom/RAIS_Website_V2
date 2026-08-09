/**
 * Page behavior for /makler.html.
 * Tracking bus fires locally only (CustomEvent + console.debug). No persistence.
 */
(function () {
  'use strict';

  function utmProps() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || null,
      utm_medium: params.get('utm_medium') || null,
      utm_campaign: params.get('utm_campaign') || null,
      path: window.location.pathname
    };
  }

  function track(name, props) {
    var payload = Object.assign({ event: name, t: Date.now() }, utmProps(), props || {});
    try {
      window.dispatchEvent(new CustomEvent('rais:makler', { detail: payload }));
    } catch (e) {
      /* IE-free site; ignore */
    }
    if (typeof console !== 'undefined' && typeof console.debug === 'function') {
      console.debug('[makler]', name, payload);
    }
  }

  window.RAISMakler = {
    track: track
  };

  track('lp_view');

  /* Manual start only. Autoplay calls start() without synthesizing a click. */
  var playBtn = document.getElementById('aqut-sim-play');
  if (playBtn) {
    playBtn.addEventListener('click', function () {
      track('sim_start');
    });
  }

  /* Three-step pipeline draws once on scroll entry. */
  var steps = document.getElementById('makler-steps');
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

  /* Mobile sticky CTA: show after 40% scroll, hide when booking is visible. */
  var sticky = document.getElementById('makler-sticky');
  var booking = document.getElementById('buchung');
  if (sticky && booking) {
    var bookingVisible = false;
    var deepEnough = false;

    function paintSticky() {
      var show = deepEnough && !bookingVisible;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      document.body.classList.toggle('has-makler-sticky', show);
    }

    function onScroll() {
      var doc = document.documentElement;
      var max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      deepEnough = window.scrollY / max >= 0.4;
      paintSticky();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (typeof IntersectionObserver === 'function') {
      var bookObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            bookingVisible = entry.isIntersecting;
            paintSticky();
          });
        },
        { threshold: 0.15 }
      );
      bookObs.observe(booking);
    }
  }
})();
