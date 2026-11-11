/**
 * Sonar Grid — Framer-inspired particle field
 * Source params from empathic-step Sonar Grid:
 * spacing 24, dotSize 0.8, baseOpacity 0.22, pingEvery 2.6,
 * ringWidth 35, amplitude 2.2, speed 260, interactive.
 * Brand: orange pings (#EC6A37), muted dots on dark green.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-sonar-grid]');
  if (!root) return;

  var canvas = root.querySelector('canvas');
  if (!canvas) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var spacing = 24;
  var dotSize = 0.9;
  var baseOpacity = 0.22;
  var pingEvery = 2.6;
  var ringWidth = 35;
  var amplitude = 2.2;
  var speed = 260;
  var pingColor = { r: 236, g: 106, b: 55 };
  var dotColor = { r: 159, g: 184, b: 140 };

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = 0;
  var height = 0;
  var dots = [];
  var pings = [];
  var pointer = { x: -9999, y: -9999, active: false };
  var lastPingAt = 0;
  var raf = 0;
  var visible = true;

  function resize() {
    var rect = root.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildDots();
  }

  function buildDots() {
    dots = [];
    var cols = Math.ceil(width / spacing) + 1;
    var rows = Math.ceil(height / spacing) + 1;
    var ox = (width - (cols - 1) * spacing) / 2;
    var oy = (height - (rows - 1) * spacing) / 2;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        dots.push({
          x: ox + c * spacing,
          y: oy + r * spacing,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
  }

  function spawnPing(x, y, now) {
    pings.push({
      x: x,
      y: y,
      born: now,
      life: ringWidth / Math.max(40, speed) + 0.55
    });
    if (pings.length > 8) pings.shift();
  }

  function autoPing(now) {
    if (reduce || !dots.length) return;
    if (now - lastPingAt < pingEvery) return;
    lastPingAt = now;
    var pick = dots[(Math.random() * dots.length) | 0];
    spawnPing(pick.x, pick.y, now);
  }

  function draw(nowSec) {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var wave = Math.sin(nowSec * 1.15 + d.phase) * 0.5 + 0.5;
      var boost = 0;
      if (pointer.active) {
        var dx = d.x - pointer.x;
        var dy = d.y - pointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) boost = (1 - dist / 110) * 0.55;
      }
      var alpha = baseOpacity * (0.55 + wave * 0.45) + boost;
      var size = dotSize + wave * amplitude * 0.18 + boost * 1.1;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(' + dotColor.r + ',' + dotColor.g + ',' + dotColor.b + ',' + alpha + ')';
      ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var p = pings.length - 1; p >= 0; p--) {
      var ping = pings[p];
      var age = nowSec - ping.born;
      if (age > ping.life) {
        pings.splice(p, 1);
        continue;
      }
      var t = age / ping.life;
      var radius = 4 + t * ringWidth;
      var alphaRing = (1 - t) * 0.7;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(' + pingColor.r + ',' + pingColor.g + ',' + pingColor.b + ',' + alphaRing + ')';
      ctx.lineWidth = 1.25;
      ctx.arc(ping.x, ping.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // plus-shaped hot core (matches Framer readout sparks)
      var core = Math.max(0.15, 1 - t * 1.35);
      var arm = 3.2 + (1 - t) * 2.4;
      ctx.strokeStyle = 'rgba(' + pingColor.r + ',' + pingColor.g + ',' + pingColor.b + ',' + core + ')';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(ping.x - arm, ping.y);
      ctx.lineTo(ping.x + arm, ping.y);
      ctx.moveTo(ping.x, ping.y - arm);
      ctx.lineTo(ping.x, ping.y + arm);
      ctx.stroke();
    }
  }

  function frame(ts) {
    if (!visible) {
      raf = 0;
      return;
    }
    var nowSec = ts / 1000;
    if (!reduce) autoPing(nowSec);
    draw(nowSec);
    raf = window.requestAnimationFrame(frame);
  }

  function start() {
    if (raf || !visible) return;
    raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    if (!raf) return;
    window.cancelAnimationFrame(raf);
    raf = 0;
  }

  function onPointer(e) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  }

  function onLeave() {
    pointer.active = false;
  }

  resize();
  if (reduce) {
    draw(0);
  } else {
    start();
  }

  window.addEventListener('resize', function () {
    resize();
    if (reduce) draw(0);
  }, { passive: true });

  /* Hover glow on the CTA band; stage itself stays pointer-events: none */
  var interactiveHost = root.closest('#termin');
  if (interactiveHost && !reduce) {
    interactiveHost.addEventListener('pointermove', onPointer, { passive: true });
    interactiveHost.addEventListener('pointerleave', onLeave);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      visible = entries.some(function (en) { return en.isIntersecting; });
      if (visible && !reduce) start();
      else stop();
    }, { threshold: 0.05 });
    io.observe(root);
  }
})();
