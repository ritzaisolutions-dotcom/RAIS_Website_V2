(function () {
  'use strict';

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

  var messages = [
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
    if (statusEl) statusEl.textContent = messages[step] || messages[0];
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

  // Wer reduzierte Bewegung angefordert hat, bekommt das Ergebnis
  // statt der Abfolge. Die Information ist dieselbe, nur ohne Takt.
  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function finish() {
    setStep(4);
    stop();
    if (playBtn) playBtn.textContent = replayLabel;
  }

  function runStep(step) {
    setStep(step);
    if (step >= 4) {
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
      playBtn.textContent = 'Simulation läuft…';
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
      playBtn.textContent = defaultPlayLabel;
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', function () {
      // Erst der ausdrueckliche Klick macht die Statuszeile zur
      // Live-Region. Beim Autoplay wuerde ein Screenreader sonst
      // fuenf Meldungen vorlesen, um die niemand gebeten hat.
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
    // Ein Durchlauf, aber erst wenn die Simulation tatsaechlich im
    // Bild ist. Auf dem Handy steht sie unter der Hero-Copy und weit
    // ausserhalb des ersten Viewports: ein Start beim Paint lief ins
    // Leere, und wer hinunterscrollte, fand nur noch den Endzustand.
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
})();
