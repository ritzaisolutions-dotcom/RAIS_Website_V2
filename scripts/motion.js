/**
 * Shared motion helpers (foerderung.de-inspired, RAIS brand constraints).
 * Complements scripts/scroll-motion.js and inline .reveal orchestration.
 *
 * - Marquee pause on hover / reduced motion
 * - Dual-path / glass-claim / FAQ reveal extension
 * - AMS theater SVG chart step sync
 * - Sticky theater step highlighting when [data-theater] is present
 */
(function () {
  'use strict';

  var reduce =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Marquee: pause on hover, stop when reduced motion ── */
  document.querySelectorAll('.ticker-wrapper, .ticker-track, [data-marquee]').forEach(function (el) {
    if (reduce) {
      el.classList.add('is-paused');
      return;
    }
    el.addEventListener('mouseenter', function () {
      el.classList.add('is-paused');
    });
    el.addEventListener('mouseleave', function () {
      el.classList.remove('is-paused');
    });
  });

  if (reduce) {
    document.documentElement.classList.add('no-anim');
  }

  /* ── Extra reveal targets for new sections ── */
  var extra = document.querySelectorAll(
    '.glass-claim, .dual-path__card, .faq-item, .page-faq details, .aqut-sim, .datenblatt'
  );
  if (extra.length && 'IntersectionObserver' in window && !reduce) {
    extra.forEach(function (el, index) {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      var stagger = index % 3;
      if (stagger === 1) el.classList.add('reveal-delay-1');
      if (stagger === 2) el.classList.add('reveal-delay-2');
    });
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -4% 0px' }
    );
    extra.forEach(function (el) {
      obs.observe(el);
    });
  } else {
    extra.forEach(function (el) {
      el.classList.add('reveal', 'active');
    });
  }

  /* ── Sync SVG glow charts with AMS sim step ── */
  var sim = document.getElementById('aqut-sim');
  var charts = document.getElementById('aqut-sim-charts');
  if (sim && charts) {
    var syncCharts = function () {
      var step = parseInt(sim.getAttribute('data-step') || '0', 10);
      charts.setAttribute('data-step', String(step));
      charts.querySelectorAll('[data-chart-step]').forEach(function (node) {
        var n = parseInt(node.getAttribute('data-chart-step'), 10);
        node.classList.toggle('is-active', n === step || (step === 0 && n === 1));
        node.classList.toggle('is-done', n < step);
      });
    };
    syncCharts();
    var mo = new MutationObserver(syncCharts);
    mo.observe(sim, { attributes: true, attributeFilter: ['data-step'] });
  }

  /* ── Optional sticky theater: click or scroll steps ── */
  var theater = document.querySelector('[data-theater]');
  if (theater && !reduce) {
    var steps = theater.querySelectorAll('[data-theater-step]');
    var panels = theater.querySelectorAll('[data-theater-panel]');
    function setTheater(n) {
      theater.setAttribute('data-active', String(n));
      steps.forEach(function (s) {
        var id = parseInt(s.getAttribute('data-theater-step'), 10);
        s.classList.toggle('is-active', id === n);
      });
      panels.forEach(function (p) {
        var id = parseInt(p.getAttribute('data-theater-panel'), 10);
        p.hidden = id !== n;
      });
    }
    steps.forEach(function (s) {
      s.addEventListener('click', function () {
        setTheater(parseInt(s.getAttribute('data-theater-step'), 10));
      });
    });
    setTheater(1);
  }
})();
