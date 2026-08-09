/**
 * Live slider calculator for /makler.html.
 * Client-only. No network, no PII.
 * euroMonat = anfragenWoche * minuten * 4.33 * (stundensatz / 60)
 */
(function () {
  'use strict';

  var WEEKS_PER_MONTH = 4.33;
  var COUNT_MS = 180;

  var root = document.getElementById('makler-rechner');
  if (!root) return;

  var volEl = document.getElementById('mk-volume');
  var minEl = document.getElementById('mk-minutes');
  var rateEl = document.getElementById('mk-rate');
  var volOut = document.getElementById('mk-volume-out');
  var minOut = document.getElementById('mk-minutes-out');
  var euroEl = document.getElementById('mk-euro');
  var deriveEl = document.getElementById('mk-derive');

  var displayedEuro = 0;
  var animFrame = null;
  var calcCompleteFired = false;
  var reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function num(el, fallback) {
    var v = parseFloat(el && el.value);
    return isFinite(v) && v >= 0 ? v : fallback;
  }

  function formatEuro(n) {
    return new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 0
    }).format(Math.round(n));
  }

  function formatHours(n) {
    return n.toFixed(1).replace('.', ',');
  }

  function compute() {
    var volume = num(volEl, 25);
    var minutes = num(minEl, 12);
    var rate = num(rateEl, 45);
    var hoursMonth = (volume * minutes * WEEKS_PER_MONTH) / 60;
    var euroMonth = hoursMonth * rate;
    return { volume: volume, minutes: minutes, rate: rate, hoursMonth: hoursMonth, euroMonth: euroMonth };
  }

  function setOutputs(state) {
    if (volOut) volOut.textContent = String(Math.round(state.volume));
    if (minOut) minOut.textContent = String(Math.round(state.minutes));
    if (volEl) volEl.setAttribute('aria-valuenow', String(Math.round(state.volume)));
    if (minEl) minEl.setAttribute('aria-valuenow', String(Math.round(state.minutes)));
    if (deriveEl) {
      deriveEl.textContent =
        formatHours(state.hoursMonth) + ' Stunden pro Monat nach Ihren Angaben';
    }
  }

  function paintEuro(value) {
    displayedEuro = value;
    if (euroEl) euroEl.textContent = formatEuro(value);
  }

  function animateEuro(target) {
    if (reduced || COUNT_MS <= 0) {
      paintEuro(target);
      return;
    }
    if (animFrame) cancelAnimationFrame(animFrame);
    var from = displayedEuro;
    var start = null;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / COUNT_MS);
      var value = from + (target - from) * easeOut(t);
      paintEuro(value);
      if (t < 1) {
        animFrame = requestAnimationFrame(frame);
      } else {
        paintEuro(target);
        animFrame = null;
      }
    }

    animFrame = requestAnimationFrame(frame);
  }

  function fireCalcComplete() {
    if (calcCompleteFired) return;
    calcCompleteFired = true;
    if (window.RAISMakler && typeof window.RAISMakler.track === 'function') {
      window.RAISMakler.track('calc_complete');
    }
  }

  function update(fromUser) {
    var state = compute();
    setOutputs(state);
    animateEuro(state.euroMonth);
    if (fromUser) fireCalcComplete();
  }

  function onInput() {
    update(true);
  }

  if (volEl) volEl.addEventListener('input', onInput);
  if (minEl) minEl.addEventListener('input', onInput);
  if (rateEl) {
    rateEl.addEventListener('input', onInput);
    rateEl.addEventListener('change', onInput);
  }

  update(false);
})();
