/**
 * Shared navbar: scroll shadow, hamburger, sticky CTA visibility.
 */
(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger-btn');
  var overlay = document.getElementById('mobile-overlay');
  var sticky = document.getElementById('sticky-cta');

  function closeMenu() {
    if (!overlay || !hamburger) return;
    overlay.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('noscroll-menu');
  }

  function openMenu() {
    if (!overlay || !hamburger) return;
    overlay.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('noscroll-menu');
  }

  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
      if (sticky) {
        var show = window.scrollY > 480;
        sticky.classList.toggle('is-visible', show);
        sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      }
    }, { passive: true });
    navbar.classList.add('is-ready');
  }

  if (hamburger && overlay) {
    hamburger.addEventListener('click', function () {
      if (overlay.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
    overlay.querySelectorAll('[data-close-menu]').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });
  }
}());
