/**
 * VSL im Hero.
 *
 * Ohne data-vsl-src ist der Block ein Buchungs-Hook (kein Fake-Player):
 * Klick auf das Poster oeffnet das Erstgespraech-Modal.
 * Mit data-vsl-src (mp4 oder Embed-URL von Vimeo, Wistia, YouTube) wird er zum Player.
 * Optional: data-vsl-captions="pfad/zur/datei.vtt" fuer Untertitel (mp4).
 *
 * Ereignisse (fuer spaeteres Tracking, nur nach Klaro-Zustimmung zu verwenden):
 *   document 'rais:vsl'  detail: { event: 'play' | '25' | '50' | '75' | 'ended', t }
 */
(function () {
  var root = document.getElementById('vsl');
  if (!root) return;
  var src = (root.getAttribute('data-vsl-src') || '').trim();
  var captions = (root.getAttribute('data-vsl-captions') || '').trim();
  var play = root.querySelector('.vsl__play');
  var frame = root.querySelector('.vsl__frame');
  if (!play || !frame) return;

  function emit(name, t) {
    try {
      document.dispatchEvent(new CustomEvent('rais:vsl', { detail: { event: name, t: t || 0 } }));
    } catch (e) { /* aelterer Browser */ }
  }

  if (!src) {
    root.classList.add('vsl--booking');
    play.classList.add('js-open-booking');
    if (!play.getAttribute('data-source')) play.setAttribute('data-source', 'vsl');
    play.setAttribute('aria-label', 'Erstgespräch buchen');
    var emptyLabel = play.querySelector('.vsl__play-label');
    if (emptyLabel) emptyLabel.textContent = 'Erstgespräch buchen';
    return;
  }

  root.classList.remove('vsl--booking');
  play.classList.remove('js-open-booking');
  play.removeAttribute('data-source');
  play.setAttribute('aria-label', 'Video abspielen');
  var label = play.querySelector('.vsl__play-label');
  if (label) label.textContent = 'Video ansehen';

  play.addEventListener('click', function () {
    var poster = frame.querySelector('.vsl__poster');
    if (poster) poster.remove();
    play.remove();

    if (/\.mp4($|\?)/i.test(src) || src.indexOf('blob:') === 0) {
      var video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'metadata';
      if (captions) {
        var track = document.createElement('track');
        track.kind = 'subtitles';
        track.srclang = 'de';
        track.label = 'Deutsch';
        track.src = captions;
        track.default = true;
        video.appendChild(track);
      }
      var sent = {};
      video.addEventListener('play', function () {
        if (!sent.play) { sent.play = 1; emit('play', 0); }
      });
      video.addEventListener('timeupdate', function () {
        if (!video.duration) return;
        var p = video.currentTime / video.duration;
        [['25', 0.25], ['50', 0.5], ['75', 0.75]].forEach(function (m) {
          if (p >= m[1] && !sent[m[0]]) { sent[m[0]] = 1; emit(m[0], video.currentTime); }
        });
      });
      video.addEventListener('ended', function () { emit('ended', video.duration); });
      frame.appendChild(video);
      return;
    }

    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = 'RAIS Video';
    iframe.loading = 'lazy';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);
    emit('play', 0);
  });
})();
