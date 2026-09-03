/**
 * Spline glass icons with static SVG fallback.
 *
 * Loads @splinetool/runtime only when:
 * - WebGL is available
 * - prefers-reduced-motion is not set
 * - viewport is wide enough
 * - a local .splinecode file exists (HEAD/GET succeeds)
 *
 * Never uses Spline iframe / prod.spline.design CDN embeds.
 * If the runtime phones home, disable WebGL path and keep SVG fallback.
 */
(function () {
  'use strict';

  var REDUCE =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NARROW =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 720px)').matches;

  function hasWebGL() {
    try {
      var canvas = document.createElement('canvas');
      return !!(
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      );
    } catch (e) {
      return false;
    }
  }

  function mountFallback(host) {
    if (!host || host.querySelector('img, canvas')) return;
    var src = host.getAttribute('data-spline-fallback');
    if (!src) return;
    var img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.width = 96;
    img.height = 96;
    img.decoding = 'async';
    img.loading = 'lazy';
    img.className = 'glass-claim__fallback';
    host.appendChild(img);
    host.classList.add('is-fallback');
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (window.__raisSplineRuntime) {
        resolve(window.__raisSplineRuntime);
        return;
      }
      var s = document.createElement('script');
      s.type = 'module';
      s.textContent =
        'import { Application } from "' +
        src +
        '"; window.__raisSplineRuntime = { Application: Application };' +
        'window.dispatchEvent(new Event("rais-spline-ready"));';
      s.onerror = reject;
      document.head.appendChild(s);
      window.addEventListener(
        'rais-spline-ready',
        function onReady() {
          window.removeEventListener('rais-spline-ready', onReady);
          resolve(window.__raisSplineRuntime);
        },
        { once: true }
      );
    });
  }

  function sceneExists(url) {
    return fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then(function (res) {
        return res.ok;
      })
      .catch(function () {
        return false;
      });
  }

  function mountSpline(host, Application) {
    var sceneUrl = host.getAttribute('data-spline-src');
    if (!sceneUrl) {
      mountFallback(host);
      return Promise.resolve(null);
    }
    return sceneExists(sceneUrl).then(function (ok) {
      if (!ok) {
        mountFallback(host);
        return null;
      }
      var canvas = document.createElement('canvas');
      canvas.className = 'glass-claim__canvas';
      canvas.setAttribute('aria-hidden', 'true');
      host.appendChild(canvas);
      var app = new Application(canvas);
      return app
        .load(sceneUrl)
        .then(function () {
          host.classList.add('is-spline');
          host.classList.remove('is-fallback');
          var fallbackImg = host.querySelector('.glass-claim__fallback');
          if (fallbackImg) fallbackImg.hidden = true;
          return app;
        })
        .catch(function () {
          mountFallback(host);
          try {
            app.dispose();
          } catch (e) {
            /* ignore */
          }
          return null;
        });
    });
  }

  var hosts = document.querySelectorAll('[data-spline-glass]');
  if (!hosts.length) return;

  // Always show SVG first so LCP / layout never waits on WebGL.
  Array.prototype.forEach.call(hosts, mountFallback);

  if (REDUCE || NARROW || !hasWebGL()) return;

  var runtimeSrc = 'vendor/spline/runtime.js';
  var apps = [];

  function pauseAll() {
    apps.forEach(function (app) {
      if (app && typeof app.stop === 'function') app.stop();
    });
  }

  function playAll() {
    apps.forEach(function (app) {
      if (app && typeof app.play === 'function') app.play();
    });
  }

  var section = document.getElementById('glass-claims');
  if (!section) section = hosts[0].closest('section') || hosts[0];

  var loaded = false;
  function activate() {
    if (loaded) return;
    loaded = true;
    loadScript(runtimeSrc)
      .then(function (runtime) {
        if (!runtime || !runtime.Application) return;
        var tasks = [];
        Array.prototype.forEach.call(hosts, function (host) {
          tasks.push(
            mountSpline(host, runtime.Application).then(function (app) {
              if (app) apps.push(app);
            })
          );
        });
        return Promise.all(tasks);
      })
      .catch(function () {
        /* keep SVG fallbacks */
      });
  }

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activate();
            playAll();
          } else {
            pauseAll();
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(section);
  } else {
    activate();
  }
})();
