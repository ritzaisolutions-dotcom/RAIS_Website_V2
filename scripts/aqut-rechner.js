/**
 * Client-only AQuT pain calculator. No network, no PII, no lead capture.
 */
(function () {
  'use strict';

  var root = document.getElementById('aqut-rechner');
  if (!root) return;

  var volEl = document.getElementById('rq-volume');
  var minEl = document.getElementById('rq-minutes');
  var rateEl = document.getElementById('rq-rate');
  var crmEl = document.getElementById('rq-crm');
  var outEl = document.getElementById('rq-output');
  var crmMsgEl = document.getElementById('rq-crm-msg');

  function num(el, fallback) {
    var v = parseFloat(el && el.value);
    return isFinite(v) && v >= 0 ? v : fallback;
  }

  function formatEuro(n) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(n);
  }

  function crmMessage(value) {
    if (value === 'onoffice' || value === 'propstack') {
      return 'AQuT lässt sich direkt an Ihr bestehendes CRM anbinden, keine Datenmigration nötig.';
    }
    if (value === 'keins') {
      return 'Für Büros ohne CRM richten wir eine schlanke Datenbank innerhalb von AQuT ein.';
    }
    return 'Wir binden AQuT an Ihr bestehendes System an, sofern die Schnittstellen das zulassen.';
  }

  function render() {
    var volume = num(volEl, 0);
    var minutes = num(minEl, 0);
    var rate = num(rateEl, 35);
    var hoursWeek = (volume * minutes) / 60;
    var hoursMonth = hoursWeek * 4.33;
    var euroMonth = hoursMonth * rate;

    if (outEl) {
      outEl.textContent = '';
      var p = document.createElement('p');
      p.appendChild(document.createTextNode('Nach Ihren eigenen Angaben verbringt Ihr Büro rechnerisch '));
      var strongH = document.createElement('strong');
      strongH.textContent = hoursWeek.toFixed(1).replace('.', ',') + ' Stunden pro Woche';
      p.appendChild(strongH);
      p.appendChild(document.createTextNode(' mit der manuellen Bearbeitung von Anfragen, kalkulatorischer Gegenwert etwa '));
      var strongE = document.createElement('strong');
      strongE.textContent = formatEuro(euroMonth) + ' im Monat';
      p.appendChild(strongE);
      p.appendChild(document.createTextNode(' (' + hoursMonth.toFixed(0) + ' Std/Monat).'));
      outEl.appendChild(p);
    }
    if (crmMsgEl) {
      crmMsgEl.textContent = crmMessage(crmEl ? crmEl.value : '');
    }
  }

  [volEl, minEl, rateEl, crmEl].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  render();
}());
