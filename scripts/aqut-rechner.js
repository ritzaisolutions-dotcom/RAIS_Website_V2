/**
 * Client-only AMS pain calculator. No network, no PII, no lead capture.
 * Multi-step wizard: volume → phone follow-up → rate → result.
 * Volume input defaults to monthly; optional weekly toggle converts with 4.33.
 * Result is always shown as hours/month and euro/month.
 */
(function () {
  'use strict';

  var WEEKS_PER_MONTH = 4.33;

  var root = document.getElementById('aqut-rechner');
  if (!root) return;

  var volEl = document.getElementById('rq-volume');
  var volLabel = document.getElementById('rq-volume-label');
  var minEl = document.getElementById('rq-minutes');
  var phoneShareEl = document.getElementById('rq-phone-share');
  var phoneMinEl = document.getElementById('rq-phone-minutes');
  var rateEl = document.getElementById('rq-rate');
  var autoEl = document.getElementById('rq-auto');
  var autoOutEl = document.getElementById('rq-auto-out');
  var outEl = document.getElementById('rq-output');
  var labelEl = document.getElementById('rq-step-label');
  var errorEl = document.getElementById('rq-error');
  var backBtn = document.getElementById('rq-back');
  var nextBtn = document.getElementById('rq-next');
  var resetBtn = document.getElementById('rq-reset');
  var ctaBtn = document.getElementById('rq-cta');
  var periodMonthBtn = document.getElementById('rq-period-month');
  var periodWeekBtn = document.getElementById('rq-period-week');
  var bars = root.querySelectorAll('.rq-progress__bar');
  var steps = root.querySelectorAll('.rq-step');

  var isWizard = root.classList.contains('rechner--wizard') && steps.length > 0;
  var step = 1;
  var maxInputStep = 3;
  var period = 'month';

  var stepFields = {
    1: [volEl, minEl],
    2: [phoneShareEl, phoneMinEl],
    3: [rateEl]
  };

  var stepCopy = {
    1: 'Schritt 1 von 3',
    2: 'Schritt 2 von 3',
    3: 'Schritt 3 von 3',
    4: 'Ihr Ergebnis'
  };

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

  function formatHours(n) {
    return n.toFixed(1).replace('.', ',');
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.hidden = true;
    errorEl.textContent = '';
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.hidden = false;
    errorEl.textContent = message;
  }

  function setPeriod(next) {
    if (next !== 'month' && next !== 'week') return;
    if (period === next) return;

    var current = num(volEl, period === 'month' ? 350 : 80);
    if (period === 'month' && next === 'week') {
      volEl.value = String(Math.max(0, Math.round(current / WEEKS_PER_MONTH)));
    } else if (period === 'week' && next === 'month') {
      volEl.value = String(Math.max(0, Math.round(current * WEEKS_PER_MONTH)));
    }

    period = next;
    if (periodMonthBtn) {
      periodMonthBtn.classList.toggle('is-active', period === 'month');
      periodMonthBtn.setAttribute('aria-pressed', period === 'month' ? 'true' : 'false');
    }
    if (periodWeekBtn) {
      periodWeekBtn.classList.toggle('is-active', period === 'week');
      periodWeekBtn.setAttribute('aria-pressed', period === 'week' ? 'true' : 'false');
    }
    if (volLabel) {
      volLabel.textContent = period === 'month' ? 'Anfragen pro Monat' : 'Anfragen pro Woche';
    }
  }

  function volumePerMonth() {
    var volume = num(volEl, 0);
    return period === 'week' ? volume * WEEKS_PER_MONTH : volume;
  }

  function validateStep(n) {
    var fields = stepFields[n] || [];
    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      if (!el) continue;
      var raw = String(el.value || '').trim();
      if (raw === '') {
        showError('Bitte füllen Sie alle Felder aus.');
        el.focus();
        return false;
      }
      var value = parseFloat(raw);
      if (!isFinite(value) || value < 0) {
        showError('Bitte geben Sie eine gültige Zahl ab 0 ein.');
        el.focus();
        return false;
      }
      if (el === phoneShareEl && value > 100) {
        showError('Der Anteil darf höchstens 100 Prozent betragen.');
        el.focus();
        return false;
      }
    }
    clearError();
    return true;
  }

  function focusFirstField(n) {
    var fields = stepFields[n] || [];
    for (var i = 0; i < fields.length; i++) {
      if (fields[i]) {
        fields[i].focus();
        return;
      }
    }
  }

  function setStep(n) {
    step = n;
    for (var i = 0; i < steps.length; i++) {
      var el = steps[i];
      var s = parseInt(el.getAttribute('data-step'), 10);
      if (s === step) {
        el.hidden = false;
        el.removeAttribute('hidden');
      } else {
        el.hidden = true;
        el.setAttribute('hidden', '');
      }
    }

    if (labelEl) labelEl.textContent = stepCopy[step] || '';

    for (var b = 0; b < bars.length; b++) {
      var barStep = parseInt(bars[b].getAttribute('data-bar'), 10);
      if (step === 4) {
        bars[b].classList.toggle('is-filled', true);
      } else {
        bars[b].classList.toggle('is-filled', barStep <= step);
      }
    }

    if (backBtn) backBtn.hidden = step === 1 || step === 4;
    if (nextBtn) nextBtn.hidden = step === 4;
    if (resetBtn) resetBtn.hidden = step !== 4;
    if (ctaBtn) ctaBtn.hidden = step !== 4;

    if (step <= maxInputStep) {
      focusFirstField(step);
    }

    if (step === 4) render();
  }

  // Die Annahme gehoert dem Besucher. Wir behaupten keine Quote.
  if (autoEl && autoOutEl) {
    autoEl.addEventListener('input', function () {
      autoOutEl.textContent = autoEl.value + ' %';
    });
  }

  function render() {
    var minutes = num(minEl, 0);
    var phoneShare = Math.min(num(phoneShareEl, 0), 100);
    var phoneMinutes = num(phoneMinEl, 0);
    var rate = num(rateEl, 45);
    var volumeMonth = volumePerMonth();

    var emailHoursMonth = (volumeMonth * minutes) / 60;
    var phoneHoursMonth = (volumeMonth * (phoneShare / 100) * phoneMinutes) / 60;
    var hoursMonth = emailHoursMonth + phoneHoursMonth;
    var hoursWeek = hoursMonth / WEEKS_PER_MONTH;
    var euroMonth = hoursMonth * rate;

    if (!outEl) return;

    outEl.textContent = '';

    if (isWizard) {
      var hoursP = document.createElement('p');
      hoursP.className = 'rq-result-hours';
      hoursP.textContent = formatHours(hoursMonth) + ' Stunden im Monat';
      outEl.appendChild(hoursP);

      var euroP = document.createElement('p');
      euroP.className = 'rq-result-euro';
      euroP.textContent = 'rund ' + formatEuro(euroMonth) + ' im Monat';
      outEl.appendChild(euroP);

      var weekHint = document.createElement('p');
      weekHint.className = 'rq-result-week';
      weekHint.textContent = '≈ ' + formatHours(hoursWeek) + ' Std/Woche';
      outEl.appendChild(weekHint);

      // Ersparnis nur, wenn der Besucher selbst eine Annahme gesetzt hat.
      // Bei 0 Prozent behaupten wir nichts. Die Quote stammt ausdruecklich
      // von ihm, nicht von uns.
      var autoShare = Math.min(num(autoEl, 0), 100);
      if (autoShare > 0) {
        var savedHours = hoursMonth * (autoShare / 100);
        var savedEuro = euroMonth * (autoShare / 100);

        var delta = document.createElement('p');
        delta.className = 'rq-result-delta';

        var deltaLabel = document.createElement('span');
        deltaLabel.className = 'rq-result-delta__label';
        deltaLabel.textContent = 'Bei Ihrer Annahme von ' + autoShare + ' Prozent';
        delta.appendChild(deltaLabel);

        var deltaValue = document.createElement('span');
        deltaValue.className = 'rq-result-delta__value';
        deltaValue.textContent =
          formatHours(savedHours) + ' Stunden und rund ' + formatEuro(savedEuro) + ' im Monat';
        delta.appendChild(deltaValue);

        outEl.appendChild(delta);
      }

      var chart = document.createElement('div');
      chart.className = 'rq-chart';
      chart.setAttribute('role', 'img');
      chart.setAttribute(
        'aria-label',
        'Aufteilung: Mailbearbeitung ' +
          formatHours(emailHoursMonth) +
          ' Stunden im Monat, Telefon-Nacharbeit ' +
          formatHours(phoneHoursMonth) +
          ' Stunden im Monat'
      );

      // Ohne Aufwand gibt es keine Aufteilung. Ein 50/50-Balken wuerde eine
      // Zahl behaupten, die der Besucher nie eingegeben hat.
      if (hoursMonth <= 0) return;

      var emailPct = Math.round((emailHoursMonth / hoursMonth) * 100);
      var phonePct = 100 - emailPct;

      var bar = document.createElement('div');
      bar.className = 'rq-chart__bar';
      bar.setAttribute('aria-hidden', 'true');

      var emailSeg = document.createElement('span');
      emailSeg.className = 'rq-chart__seg rq-chart__seg--mail';
      emailSeg.style.width = emailPct + '%';

      var phoneSeg = document.createElement('span');
      phoneSeg.className = 'rq-chart__seg rq-chart__seg--phone';
      phoneSeg.style.width = phonePct + '%';

      bar.appendChild(emailSeg);
      bar.appendChild(phoneSeg);
      chart.appendChild(bar);

      var legend = document.createElement('div');
      legend.className = 'rq-chart__legend';
      legend.setAttribute('aria-hidden', 'true');

      var mailItem = document.createElement('span');
      mailItem.className = 'rq-chart__item rq-chart__item--mail';
      mailItem.textContent = 'Mail ' + formatHours(emailHoursMonth) + ' Std/Monat';

      var phoneItem = document.createElement('span');
      phoneItem.className = 'rq-chart__item rq-chart__item--phone';
      phoneItem.textContent = 'Telefon ' + formatHours(phoneHoursMonth) + ' Std/Monat';

      legend.appendChild(mailItem);
      legend.appendChild(phoneItem);
      chart.appendChild(legend);
      outEl.appendChild(chart);
      return;
    }

    var p = document.createElement('p');
    p.appendChild(document.createTextNode('Nach Ihren eigenen Angaben verbringt Ihr Büro rechnerisch '));
    var strongH = document.createElement('strong');
    strongH.textContent = formatHours(hoursMonth) + ' Stunden im Monat';
    p.appendChild(strongH);
    p.appendChild(document.createTextNode(' mit Mailbearbeitung und Mailbox-Nachtelefonaten, kalkulatorischer Gegenwert etwa '));
    var strongE = document.createElement('strong');
    strongE.textContent = formatEuro(euroMonth) + ' im Monat';
    p.appendChild(strongE);
    p.appendChild(document.createTextNode(' (≈ ' + formatHours(hoursWeek) + ' Std/Woche).'));
    outEl.appendChild(p);

    var splitLegacy = document.createElement('p');
    splitLegacy.className = 'rechner__split';
    splitLegacy.textContent =
      'Davon Mailbearbeitung: ' +
      formatHours(emailHoursMonth) +
      ' Std/Monat · Telefon-Nacharbeit: ' +
      formatHours(phoneHoursMonth) +
      ' Std/Monat.';
    outEl.appendChild(splitLegacy);
  }

  if (periodMonthBtn) {
    periodMonthBtn.addEventListener('click', function () { setPeriod('month'); });
  }
  if (periodWeekBtn) {
    periodWeekBtn.addEventListener('click', function () { setPeriod('week'); });
  }

  if (!isWizard) {
    [volEl, minEl, phoneShareEl, phoneMinEl, rateEl].forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', render);
      el.addEventListener('change', render);
    });
    render();
    return;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (!validateStep(step)) return;
      if (step < maxInputStep) {
        setStep(step + 1);
        return;
      }
      setStep(4);
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      clearError();
      if (step > 1 && step <= maxInputStep) setStep(step - 1);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      clearError();
      setStep(1);
    });
  }

  root.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if (step === 4) return;
    if (e.target && e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    if (nextBtn && !nextBtn.hidden) nextBtn.click();
  });

  setStep(1);
}());
