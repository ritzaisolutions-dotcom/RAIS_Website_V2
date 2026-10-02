/**
 * ROI-Rechner — Akut plus Meta v1 (ROI_RECHNER_SPEC.md)
 * Kosten = Media + 1.500 · Worst/Best aus Plan-Prämissen · SVG-Linien
 */
(function () {
  'use strict';

  var FEE = 1500;
  var MEDIA_MIN = 1000;
  var MEDIA_MAX = 25000;
  var MEDIA_REC = 5000;
  var ANCHORS = [1000, 5000, 10000, 15000, 25000];
  var PRESETS = [1000, 5000, 25000];
  var COLORS = { worst: '#E11D48', best: '#7C3AED', cost: '#64748B', buffer: '#2F6B4F' };

  var root = document.getElementById('roi-board');
  if (!root) return;

  var mediaInput = root.querySelector('[data-roi-media]');
  var mediaOut = root.querySelector('[data-roi-media-out]');
  var mixInputs = root.querySelectorAll('[data-roi-mix]');
  var mixOut = root.querySelector('[data-roi-mix-out]');
  var costOut = root.querySelector('[data-roi-cost]');
  var worstOut = root.querySelector('[data-roi-worst]');
  var bestOut = root.querySelector('[data-roi-best]');
  var gapOut = root.querySelector('[data-roi-gap]');
  var gapWorstOut = root.querySelector('[data-roi-gap-worst]');
  var bufferLegend = root.querySelector('[data-roi-buffer-legend]');
  var tipEl = root.querySelector('[data-roi-tip]');
  var chartWrap = root.querySelector('.roi-chart-wrap') || root;
  var srTable = root.querySelector('[data-roi-sr-table]');
  var returnTable = root.querySelector('[data-roi-return-table]');
  var kpiWorst = root.querySelector('.roi-kpis__item--worst');
  var kpiGapW = root.querySelector('.roi-kpis__item--gap-w');
  var presetBtns = root.querySelectorAll('[data-roi-preset]');
  var chart = root.querySelector('[data-roi-chart]');
  if (!mediaInput || !chart) return;

  var started = false;
  var tipHideTimer = null;
  var RETURN_ROWS = [
    { key: 'min', label: 'Minimum', media: 1000 },
    { key: 'rec', label: 'Empfohlen', media: 5000 },
    { key: 'max', label: 'Maximum', media: 25000 }
  ];

  function euro(n) {
    return Math.round(n).toLocaleString('de-DE') + ' €';
  }

  function factor(n) {
    var x = Math.round(n * 10) / 10;
    return '~' + x.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '×';
  }

  function syncPresets(media) {
    presetBtns.forEach(function (btn) {
      var val = Number(btn.getAttribute('data-roi-preset'));
      var on = val === media;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function mixAnkaufFromUi() {
    var picked = '70';
    mixInputs.forEach(function (el) {
      if (el.checked) picked = el.value;
    });
    return picked === '50' ? 0.5 : 0.7;
  }

  function mixLabel(mixAnkauf) {
    return mixAnkauf === 0.5 ? '50/50 Ankauf–Verkauf' : '70/30 Ankauf–Verkauf';
  }

  function compute(media, mixAnkauf) {
    var mixV = 1 - mixAnkauf;
    var kF = (media * mixAnkauf) / 35;
    var vF = (media * mixV) / 50;
    var aT = kF * 0.35 * 0.65;
    var vT = vF * 0.30 * 0.65;
    var best = aT * 0.08 * 10000 + vF * 0.02 * 12000;
    var worst = best * 0.5;
    var base = best * 0.75;
    var kosten = media + FEE;
    return {
      kaufFormulare: kF,
      verkaufFormulare: vF,
      ankaufTerminePlan: aT,
      verkaufTerminePlan: vT,
      ankaufTermineBase: aT * 0.75,
      verkaufTermineBase: vT * 0.75,
      umsatzWorst: worst,
      umsatzBase: base,
      umsatzBest: best,
      kosten: kosten,
      gapBest: best - kosten,
      gapWorst: worst - kosten
    };
  }

  function mediaToX(media, pad, innerW) {
    return pad.l + ((media - MEDIA_MIN) / (MEDIA_MAX - MEDIA_MIN)) * innerW;
  }

  function yScale(value, yMax, pad, innerH) {
    return pad.t + innerH - (value / yMax) * innerH;
  }

  function polyline(values, color, dash) {
    var attrs = 'fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
    if (dash) attrs += ' stroke-dasharray="6 5"';
    return '<polyline ' + attrs + ' points="' + values + '"/>';
  }

  function buildBufferBand(curve, pad, innerW, innerH, yMax) {
    var segments = [];
    var current = null;
    curve.forEach(function (pt) {
      var ok = pt.data.umsatzWorst >= pt.data.kosten;
      var x = mediaToX(pt.media, pad, innerW);
      var yWorst = yScale(pt.data.umsatzWorst, yMax, pad, innerH);
      var yCost = yScale(pt.data.kosten, yMax, pad, innerH);
      if (ok) {
        if (!current) current = { tops: [], bottoms: [] };
        current.tops.push(x + ',' + yWorst);
        current.bottoms.push(x + ',' + yCost);
      } else if (current) {
        segments.push(current);
        current = null;
      }
    });
    if (current) segments.push(current);
    if (!segments.length) return { any: false, svg: '' };

    var svg = segments.map(function (seg) {
      var path = seg.tops.concat(seg.bottoms.slice().reverse()).join(' ');
      return '<polygon class="roi-buffer" points="' + path + '" fill="' + COLORS.buffer + '" fill-opacity="0.18" stroke="none"></polygon>';
    }).join('');
    return { any: true, svg: svg };
  }

  function hideTip() {
    if (!tipEl) return;
    tipEl.hidden = true;
    tipEl.removeAttribute('style');
  }

  function showTip(anchor, clientX, clientY) {
    if (!tipEl) return;
    var mixAnkauf = mixAnkaufFromUi();
    var d = compute(anchor, mixAnkauf);
    tipEl.innerHTML =
      '<strong>' + euro(anchor) + ' Media</strong>' +
      '<span>Worst ' + euro(d.umsatzWorst) + '</span>' +
      '<span>Best ' + euro(d.umsatzBest) + '</span>' +
      '<span>Kosten ' + euro(d.kosten) + '</span>';
    tipEl.hidden = false;

    var wrapRect = chartWrap.getBoundingClientRect();
    var left = clientX - wrapRect.left + 12;
    var top = clientY - wrapRect.top - 12;
    tipEl.style.left = left + 'px';
    tipEl.style.top = top + 'px';

    var tipRect = tipEl.getBoundingClientRect();
    if (tipRect.right > wrapRect.right - 8) {
      tipEl.style.left = Math.max(8, left - tipRect.width - 24) + 'px';
    }
    if (tipRect.bottom > wrapRect.bottom - 8) {
      tipEl.style.top = Math.max(8, top - tipRect.height) + 'px';
    }
  }

  function bindTipEvents(svg) {
    if (!tipEl || !svg) return;
    var hits = svg.querySelectorAll('[data-roi-anchor]');
    hits.forEach(function (hit) {
      var anchor = Number(hit.getAttribute('data-roi-anchor'));
      hit.addEventListener('mouseenter', function (e) {
        if (tipHideTimer) {
          clearTimeout(tipHideTimer);
          tipHideTimer = null;
        }
        showTip(anchor, e.clientX, e.clientY);
      });
      hit.addEventListener('mousemove', function (e) {
        showTip(anchor, e.clientX, e.clientY);
      });
      hit.addEventListener('mouseleave', function () {
        tipHideTimer = setTimeout(hideTip, 80);
      });
      hit.addEventListener('focus', function () {
        var box = hit.getBoundingClientRect();
        showTip(anchor, box.left + box.width / 2, box.top);
      });
      hit.addEventListener('blur', hideTip);
    });
  }

  function render() {
    var media = Number(mediaInput.value);
    var mixAnkauf = mixAnkaufFromUi();
    var curve = [];
    var m;
    for (m = MEDIA_MIN; m <= MEDIA_MAX; m += 250) {
      curve.push({ media: m, data: compute(m, mixAnkauf) });
    }
    // ensure exact endpoints / presets sit on the curve
    PRESETS.forEach(function (p) {
      if (!curve.some(function (pt) { return pt.media === p; })) {
        curve.push({ media: p, data: compute(p, mixAnkauf) });
      }
    });
    curve.sort(function (a, b) { return a.media - b.media; });

    var yMax = 0;
    curve.forEach(function (pt) {
      yMax = Math.max(yMax, pt.data.umsatzBest, pt.data.kosten);
    });
    yMax = Math.ceil((yMax * 1.08) / 1000) * 1000;

    var w = 720;
    var h = 320;
    var pad = { l: 64, r: 20, t: 28, b: 44 };
    var innerW = w - pad.l - pad.r;
    var innerH = h - pad.t - pad.b;

    function pts(key) {
      return curve.map(function (pt) {
        var x = mediaToX(pt.media, pad, innerW);
        var y = yScale(pt.data[key], yMax, pad, innerH);
        return x + ',' + y;
      }).join(' ');
    }

    var grid = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax].map(function (tick) {
      var gy = yScale(tick, yMax, pad, innerH);
      var label = tick >= 1000 ? Math.round(tick / 1000) + 'k' : '0';
      return (
        '<line x1="' + pad.l + '" y1="' + gy + '" x2="' + (w - pad.r) + '" y2="' + gy + '" stroke="#D9D1C7" stroke-width="1"/>' +
        '<text x="' + (pad.l - 8) + '" y="' + (gy + 4) + '" text-anchor="end" fill="#7B746B" font-size="11">' + label + '</text>'
      );
    }).join('');

    var xTicks = ANCHORS.map(function (anchor) {
      var x = mediaToX(anchor, pad, innerW);
      return (
        '<line x1="' + x + '" y1="' + pad.t + '" x2="' + x + '" y2="' + (h - pad.b) + '" stroke="#E8E2DA" stroke-width="1"/>' +
        '<text x="' + x + '" y="' + (h - 14) + '" text-anchor="middle" fill="#7B746B" font-size="11">' + (anchor / 1000) + 'k</text>'
      );
    }).join('');

    var rec = compute(media, mixAnkauf);
    var buffer = buildBufferBand(curve, pad, innerW, innerH, yMax);
    var worstStroke = rec.umsatzWorst >= rec.kosten ? COLORS.buffer : COLORS.worst;

    var anchorDots = ANCHORS.map(function (anchor) {
      var d = compute(anchor, mixAnkauf);
      var x = mediaToX(anchor, pad, innerW);
      var isActive = anchor === media;
      var r = isActive ? 0 : 4;
      var worstFill = d.umsatzWorst >= d.kosten ? COLORS.buffer : COLORS.worst;
      var hitY = Math.min(
        yScale(d.umsatzBest, yMax, pad, innerH),
        yScale(d.umsatzWorst, yMax, pad, innerH),
        yScale(d.kosten, yMax, pad, innerH)
      );
      var hitBottom = Math.max(
        yScale(d.umsatzBest, yMax, pad, innerH),
        yScale(d.umsatzWorst, yMax, pad, innerH),
        yScale(d.kosten, yMax, pad, innerH)
      );
      return (
        '<circle class="roi-point' + (isActive ? ' is-pop' : '') + '" cx="' + x + '" cy="' + yScale(d.umsatzWorst, yMax, pad, innerH) + '" r="' + r + '" fill="' + worstFill + '" opacity="0.85"></circle>' +
        '<circle class="roi-point' + (isActive ? ' is-pop' : '') + '" cx="' + x + '" cy="' + yScale(d.umsatzBest, yMax, pad, innerH) + '" r="' + r + '" fill="' + COLORS.best + '" opacity="0.85"></circle>' +
        '<circle class="roi-point' + (isActive ? ' is-pop' : '') + '" cx="' + x + '" cy="' + yScale(d.kosten, yMax, pad, innerH) + '" r="' + r + '" fill="' + COLORS.cost + '" opacity="0.85"></circle>' +
        '<rect class="roi-hit" data-roi-anchor="' + anchor + '" x="' + (x - 14) + '" y="' + (hitY - 14) + '" width="28" height="' + (hitBottom - hitY + 28) + '" fill="transparent" tabindex="0" role="button" aria-label="Media ' + euro(anchor) + ': Worst ' + euro(d.umsatzWorst) + ', Best ' + euro(d.umsatzBest) + ', Kosten ' + euro(d.kosten) + '"></rect>'
      );
    }).join('');

    var activeX = mediaToX(media, pad, innerW);
    var activeDots =
      '<circle class="roi-point is-pop" cx="' + activeX + '" cy="' + yScale(rec.umsatzWorst, yMax, pad, innerH) + '" r="7" fill="' + worstStroke + '"/>' +
      '<circle class="roi-point is-pop" cx="' + activeX + '" cy="' + yScale(rec.umsatzBest, yMax, pad, innerH) + '" r="7" fill="' + COLORS.best + '"/>' +
      '<circle class="roi-point is-pop" cx="' + activeX + '" cy="' + yScale(rec.kosten, yMax, pad, innerH) + '" r="7" fill="' + COLORS.cost + '"/>';

    var markerX = mediaToX(MEDIA_REC, pad, innerW);
    var recMarker = media === MEDIA_REC
      ? '<line x1="' + markerX + '" y1="' + (h - pad.b + 6) + '" x2="' + markerX + '" y2="' + (h - pad.b + 18) + '" stroke="var(--orange)" stroke-width="3"/>'
      : '';

    chart.innerHTML =
      '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-labelledby="roi-title">' +
      '<text x="' + pad.l + '" y="16" fill="#7B746B" font-size="11">Beispielrechnung spekulativ (€) — keine Garantie</text>' +
      grid + xTicks +
      buffer.svg +
      polyline(pts('umsatzWorst'), buffer.any ? COLORS.buffer : COLORS.worst, false) +
      polyline(pts('umsatzBest'), COLORS.best, false) +
      polyline(pts('kosten'), COLORS.cost, true) +
      anchorDots + activeDots + recMarker +
      '</svg>';

    bindTipEvents(chart.querySelector('svg'));

    if (mediaOut) mediaOut.textContent = euro(media);
    if (costOut) costOut.textContent = euro(rec.kosten);
    if (worstOut) worstOut.textContent = euro(rec.umsatzWorst);
    if (bestOut) bestOut.textContent = euro(rec.umsatzBest);
    if (gapOut) gapOut.textContent = euro(rec.gapBest);
    if (gapWorstOut) gapWorstOut.textContent = euro(rec.gapWorst);
    if (mixOut) mixOut.textContent = mixLabel(mixAnkauf);
    if (bufferLegend) bufferLegend.hidden = !buffer.any;

    var under = rec.umsatzWorst < rec.kosten;
    if (kpiWorst) kpiWorst.classList.toggle('is-under', under);
    if (kpiGapW) kpiGapW.classList.toggle('is-under', under);
    syncPresets(media);

    if (returnTable) {
      returnTable.innerHTML = RETURN_ROWS.map(function (row) {
        var d = compute(row.media, mixAnkauf);
        var active = row.media === media ? ' class="is-active-row"' : '';
        return '<tr' + active + '>' +
          '<th scope="row">' + row.label + '</th>' +
          '<td>' + euro(row.media) + '</td>' +
          '<td>' + euro(d.kosten) + '</td>' +
          '<td>' + euro(d.umsatzWorst) + '</td>' +
          '<td>' + euro(d.umsatzBest) + '</td>' +
          '<td class="roi-factor">' + factor(d.umsatzWorst / d.kosten) + '</td>' +
          '<td class="roi-factor">' + factor(d.umsatzBest / d.kosten) + '</td>' +
          '</tr>';
      }).join('');
    }

    mediaInput.setAttribute('aria-valuetext', Math.round(media).toLocaleString('de-DE') + ' Euro');

    if (srTable && !srTable.dataset.filled) {
      srTable.dataset.filled = '1';
      srTable.innerHTML = ANCHORS.map(function (anchor) {
        var row = compute(anchor, 0.7);
        return '<tr><td>' + euro(anchor) + '</td><td>' + euro(row.kosten) + '</td><td>' + euro(row.umsatzWorst) + '</td><td>' + euro(row.umsatzBest) + '</td></tr>';
      }).join('');
    }
  }

  function setMedia(value) {
    var next = Math.max(MEDIA_MIN, Math.min(MEDIA_MAX, Number(value)));
    mediaInput.value = String(next);
    render();
  }

  function bind() {
    if (started) return;
    started = true;
    mediaInput.addEventListener('input', render);
    mixInputs.forEach(function (el) { el.addEventListener('change', render); });
    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setMedia(btn.getAttribute('data-roi-preset'));
      });
    });
    render();
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          bind();
          observer.disconnect();
        }
      });
    }, { rootMargin: '120px' });
    observer.observe(root);
  } else {
    bind();
  }
}());
