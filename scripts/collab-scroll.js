/**
 * Zusammenarbeit: CSS timeline play-once when section enters view.
 * JS only toggles is-playing / is-complete — no interval, no reflow hacks.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-collab-pin]');
  if (!root) return;

  var items = root.querySelectorAll('.step-rail__item[data-step]');
  if (!items.length) return;

  var DURATION_MS = 2800;
  var reduce =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finish() {
    root.classList.remove('is-playing');
    root.classList.add('is-complete');
    root.setAttribute('data-played', '');
    for (var k = 0; k < items.length; k++) {
      items[k].classList.add('is-revealed');
      items[k].classList.toggle('is-active', k === items.length - 1);
      items[k].setAttribute(
        'aria-current',
        k === items.length - 1 ? 'step' : 'false'
      );
    }
  }

  function play() {
    if (root.hasAttribute('data-played')) return;
    root.setAttribute('data-played', '');
    root.classList.add('is-playing');

    window.setTimeout(finish, DURATION_MS + 80);
  }

  if (reduce) {
    finish();
    return;
  }

  for (var k = 0; k < items.length; k++) {
    items[k].classList.remove('is-revealed', 'is-active');
    items[k].setAttribute('aria-current', 'false');
  }

  if (typeof window.IntersectionObserver !== 'function') {
    play();
    return;
  }

  var observer = new window.IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        play();
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(root);
})();
