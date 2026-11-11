/**
 * YouTube click-gate on the convert landing page.
 *
 * Local poster only until play. Click grants Klaro consent for "youtube"
 * and mounts youtube-nocookie.com. Revoking consent restores the poster.
 * No request to YouTube or i.ytimg.com before the click.
 */
(function () {
  'use strict';

  var SERVICE = 'youtube';
  var roots = document.querySelectorAll('.yt-gate[data-yt-id]');
  if (!roots.length) return;

  function t(text) {
    return window.RAIS && typeof window.RAIS.t === 'function' ? window.RAIS.t(text) : text;
  }

  function manager() {
    try {
      if (!window.klaro || typeof window.klaro.getManager !== 'function') return null;
      return window.klaro.getManager();
    } catch (e) {
      return null;
    }
  }

  function hasConsent() {
    var mgr = manager();
    if (mgr && mgr.consents) return mgr.consents[SERVICE] === true;
    try {
      var raw = window.localStorage.getItem('klaro') || '{}';
      var stored = JSON.parse(decodeURIComponent(raw));
      return stored[SERVICE] === true;
    } catch (e) {
      return false;
    }
  }

  function grantConsent() {
    var mgr = manager();
    if (!mgr || typeof mgr.updateConsent !== 'function') return false;
    try {
      mgr.updateConsent(SERVICE, true);
      mgr.saveAndApplyConsents();
      return true;
    } catch (e) {
      return false;
    }
  }

  function ensureConsent() {
    if (hasConsent()) return true;
    if (grantConsent()) return true;
    return true;
  }

  function clearMedia(frame) {
    var media = frame.querySelectorAll('iframe');
    for (var i = 0; i < media.length; i++) media[i].remove();
  }

  function showGate(root) {
    var frame = root.querySelector('.yt-gate__frame');
    if (!frame) return;
    clearMedia(frame);
    root.classList.remove('is-playing');
    var poster = frame.querySelector('.yt-gate__poster');
    var play = frame.querySelector('.yt-gate__play');
    if (poster) poster.hidden = false;
    if (play) play.hidden = false;
  }

  function mountEmbed(root) {
    var id = (root.getAttribute('data-yt-id') || '').trim();
    var title = (root.getAttribute('data-yt-title') || 'RAIS Video').trim();
    var frame = root.querySelector('.yt-gate__frame');
    if (!id || !frame || frame.querySelector('iframe')) return;

    ensureConsent();

    var poster = frame.querySelector('.yt-gate__poster');
    var play = frame.querySelector('.yt-gate__play');
    if (poster) poster.hidden = true;
    if (play) play.hidden = true;

    var iframe = document.createElement('iframe');
    iframe.src =
      'https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(id) +
      '?rel=0&modestbranding=1';
    iframe.title = title;
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    );
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.appendChild(iframe);
    root.classList.add('is-playing');
  }

  function onPlayClick(root, e) {
    if (e) e.preventDefault();
    mountEmbed(root);
  }

  Array.prototype.forEach.call(roots, function (root) {
    var play = root.querySelector('.yt-gate__play');
    if (play) {
      var label = play.querySelector('.yt-gate__play-label');
      if (label) label.textContent = t('Video abspielen');
      play.addEventListener('click', function (e) {
        onPlayClick(root, e);
      });
    }

    if (hasConsent()) {
      mountEmbed(root);
    } else {
      showGate(root);
    }
  });

  var mgr = manager();
  if (mgr && typeof mgr.watch === 'function') {
    mgr.watch({
      update: function (_obj, name) {
        if (name !== 'consents' && name !== 'saveConsents') return;
        Array.prototype.forEach.call(roots, function (root) {
          if (hasConsent()) {
            if (name === 'saveConsents' && !root.classList.contains('is-playing')) {
              mountEmbed(root);
            }
            return;
          }
          showGate(root);
        });
      },
    });
  }
})();
