(function () {
  'use strict';

  var root = document.getElementById('roadmap-hero-ui');
  if (!root) return;

  var badge = root.querySelector('[data-badge]');
  var termin = root.querySelector('[data-termin]');
  var checks = root.querySelectorAll('[data-check]');
  var timer = null;
  var phase = 0;

  var badges = ['Wartend', 'Analyse…', 'Analyse…', 'Analyse…', 'A-LEAD'];

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function setPhase(next) {
    phase = next;
    root.setAttribute('data-phase', String(next));
    checks.forEach(function (el) {
      var id = parseInt(el.getAttribute('data-check'), 10);
      el.classList.toggle('is-done', next >= 4 ? true : id < next);
      el.classList.toggle('is-active', next > 0 && next < 4 && id === next);
    });
    if (badge) {
      badge.textContent = badges[next] || 'Wartend';
      badge.classList.toggle('is-lead', next >= 4);
    }
    if (termin) {
      termin.hidden = next < 4;
    }
  }

  function endState() {
    setPhase(4);
  }

  function tick() {
    if (phase >= 4) {
      timer = setTimeout(function () {
        setPhase(0);
        timer = setTimeout(tick, 900);
      }, 2200);
      return;
    }
    var next = phase + 1;
    setPhase(next);
    timer = setTimeout(tick, next === 1 ? 1400 : 1100);
  }

  function start() {
    if (prefersReducedMotion()) {
      endState();
      return;
    }
    setPhase(0);
    timer = setTimeout(tick, 700);
  }

  if (typeof window.IntersectionObserver === 'function') {
    var obs = new window.IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.disconnect();
          start();
        });
      },
      { threshold: 0.35 }
    );
    obs.observe(root);
  } else {
    start();
  }
})();
