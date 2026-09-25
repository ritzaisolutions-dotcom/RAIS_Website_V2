/**
 * Wenn data-vsl-src gesetzt ist, ersetzt der Play-Button das Poster
 * durch ein YouTube/Vimeo-iframe oder ein video-Element.
 * Ohne URL: Booking-Hook (kein Play-Icon).
 */
(function () {
  var root = document.getElementById('vsl');
  if (!root) return;
  var src = (root.getAttribute('data-vsl-src') || '').trim();
  var play = root.querySelector('.vsl__play');
  var frame = root.querySelector('.vsl__frame');
  if (!play || !frame) return;

  if (!src) {
    root.classList.add('vsl--booking');
    play.classList.add('js-open-booking');
    if (!play.getAttribute('data-source')) play.setAttribute('data-source', 'vsl');
    play.setAttribute('aria-label', 'Kostenlosen Audit buchen');
    var emptyLabel = play.querySelector('.vsl__play-label');
    if (emptyLabel) emptyLabel.textContent = 'Audit buchen';
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
      frame.appendChild(video);
      return;
    }

    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = 'RAIS Video';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);
  });
})();
