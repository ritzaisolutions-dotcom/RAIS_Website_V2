(function () {
  'use strict';

  function t(text) {
    return window.RAIS && typeof window.RAIS.t === 'function' ? window.RAIS.t(text) : text;
  }

  var root = document.getElementById('aqut-sim');
  if (!root) return;

  var playBtn = document.getElementById('aqut-sim-play');
  var resetBtn = document.getElementById('aqut-sim-reset');
  var statusEl = document.getElementById('aqut-sim-status');
  var nodes = root.querySelectorAll('.aqut-sim__node');
  var timer = null;
  var running = false;
  var autoplay = root.hasAttribute('data-autoplay');
  var replayLabel = root.getAttribute('data-replay-label') || 'Nochmal abspielen';
  var defaultPlayLabel = playBtn ? playBtn.textContent : 'Demo Anfrage testen';
  var lastStep = nodes.length || 4;
  var isStory = root.classList.contains('aqut-sim--story');

  var messages = isStory
    ? [
        'Bereit. Starten Sie die Simulation.',
        'Neue Anfrage von ImmScout24 erfasst.',
        'RAIS prüft Kaufabsicht, Vollständigkeit und Bonitäts-Hinweise.',
        'Qualifiziert als A-LEAD.',
        'Interessent erhält Terminlink und bucht selbst.',
        'CRM aktualisiert. A-Lead ist beim Team.'
      ]
    : [
        'Bereit. Starten Sie die Simulation.',
        'Neue Portal-Mail erfasst und dem Objekt zugeordnet.',
        'KI prüft Kaufabsicht, Vollständigkeit und Bonitäts-Hinweise.',
        'Interessent erhält Terminlink und bucht selbst.',
        'CRM aktualisiert, Reminder gesetzt. A-Lead ist beim Team.'
      ];

  function setStep(step) {
    root.setAttribute('data-step', String(step));
    nodes.forEach(function (node) {
      var id = parseInt(node.getAttribute('data-node'), 10);
      node.classList.toggle('is-active', id === step);
      node.classList.toggle('is-done', id < step);
    });
    if (statusEl) statusEl.textContent = t(messages[step] || messages[0]);
    if (resetBtn) resetBtn.hidden = step === 0;
  }

  function stop() {
    running = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (playBtn) playBtn.disabled = false;
  }

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function finish() {
    setStep(lastStep);
    stop();
    if (playBtn) playBtn.textContent = t(replayLabel);
  }

  function runStep(step) {
    setStep(step);
    if (step >= lastStep) {
      finish();
      return;
    }
    timer = setTimeout(function () {
      runStep(step + 1);
    }, 1100);
  }

  function start() {
    if (running) return;
    running = true;
    if (playBtn) {
      playBtn.disabled = true;
      playBtn.textContent = t('Simulation läuft…');
    }
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    runStep(1);
  }

  function reset() {
    stop();
    setStep(0);
    if (playBtn) {
      playBtn.disabled = false;
      playBtn.textContent = t(defaultPlayLabel);
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', function () {
      var card = document.getElementById('aqut-sim-card');
      if (card && !card.hasAttribute('aria-live')) {
        card.setAttribute('aria-live', 'polite');
      }
      start();
    });
  }
  if (resetBtn) resetBtn.addEventListener('click', reset);
  setStep(0);

  if (autoplay) {
    if (typeof window.IntersectionObserver === 'function') {
      var obs = new window.IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            obs.disconnect();
            start();
          });
        },
        { threshold: 0.4 }
      );
      obs.observe(root);
    } else if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(function () {
        start();
      });
    } else {
      start();
    }
  }

  document.addEventListener('rais:lang', function () {
    var step = parseInt(root.getAttribute('data-step'), 10) || 0;
    if (statusEl) statusEl.textContent = t(messages[step] || messages[0]);
    if (!playBtn) return;
    if (running) playBtn.textContent = t('Simulation läuft…');
    else if (step >= lastStep) playBtn.textContent = t(replayLabel);
    else playBtn.textContent = t(defaultPlayLabel);
  });
})();
