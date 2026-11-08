/**
 * VSL im Hero.
 *
 * Ohne data-vsl-src ist der Block ein Buchungs-Hook (kein Fake-Player):
 * Klick auf das Poster oeffnet das Erstgespraech-Modal.
 * Mit data-vsl-src (mp4 oder Embed-URL von Vimeo, Wistia, YouTube) wird er zum Player.
 * Optional: data-vsl-captions="pfad/zur/datei.vtt" fuer Untertitel (mp4).
 *
 * Wistia (data-vsl-src) lädt NICHT beim Seitenaufruf. Es startet nur, wenn die
 * Person bereits in "wistia" eingewilligt hat (Banner) oder auf "Video abspielen"
 * klickt; der Klick ist die dokumentierte Einwilligung (siehe Datenschutz).
 * Vorher: Poster-Gate ohne Request an Wistia. Widerruf entfernt das Embed.
 * Mp4/andere Embeds starten wie bisher.
 *
 * Ereignisse (fuer spaeteres Tracking, nur nach Klaro-Zustimmung zu verwenden):
 *   document 'rais:vsl'  detail: { event: 'play' | '25' | '50' | '75' | 'ended', t }
 */
(function () {
  var SERVICE = 'wistia';
  var root = document.getElementById('vsl');
  if (!root) return;
  var src = (root.getAttribute('data-vsl-src') || '').trim();
  var captions = (root.getAttribute('data-vsl-captions') || '').trim();
  var play = root.querySelector('.vsl__play');
  var frame = root.querySelector('.vsl__frame');
  if (!frame) return;

  var posterHtml = null;
  var playHtml = null;
  var loaded = false;

  function t(text) {
    return window.RAIS && typeof window.RAIS.t === 'function' ? window.RAIS.t(text) : text;
  }

  /* Gate statt Autostart: kein Request an Wistia, bis geklickt wird. */
  function renderGate() {
    if (frame.querySelector('.vsl__gate')) return;
    var gate = document.createElement('div');
    gate.className = 'vsl__gate';
    gate.style.cssText =
      'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' +
      'justify-content:center;gap:0.9rem;padding:1rem;text-align:center;color:#FBF8F3;';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vsl__play';
    btn.style.cssText = 'position:static;inset:auto;';
    var icon = document.createElement('span');
    icon.className = 'vsl__play-icon';
    var label = document.createElement('span');
    label.className = 'vsl__play-label';
    label.textContent = t('Video abspielen');
    btn.appendChild(icon);
    btn.appendChild(label);
    btn.addEventListener('click', onPlayClick);
    gate.appendChild(btn);

    var note = document.createElement('p');
    note.style.cssText = 'margin:0;max-width:34rem;font-size:0.78rem;line-height:1.45;opacity:0.85;';
    note.appendChild(
      document.createTextNode(
        t('Das Video wird von Wistia (USA) geladen. Mit dem Klick wird Ihre IP-Adresse an Wistia übertragen. Details in der '),
      ),
    );
    var link = document.createElement('a');
    link.href = 'datenschutz.html';
    link.textContent = t('Datenschutzerklärung');
    link.style.cssText = 'color:#FBF8F3;text-decoration:underline;';
    note.appendChild(link);
    note.appendChild(document.createTextNode('.'));
    gate.appendChild(note);

    frame.appendChild(gate);
  }

  function emit(name, t) {
    try {
      document.dispatchEvent(new CustomEvent('rais:vsl', { detail: { event: name, t: t || 0 } }));
    } catch (e) { /* aelterer Browser */ }
  }

  function isWistia(url) {
    return /wistia\.(net|com)/i.test(url || '');
  }

  function isSelfHosted(url) {
    return /\.mp4($|\?)/i.test(url) || (url && url.indexOf('blob:') === 0);
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

  /* Play-Klick = dokumentierte Einwilligung (wie Cal). Ohne Klaro
     trotzdem laden: der Klick selbst ist die Einwilligung. */
  function ensureConsent() {
    if (hasConsent()) return true;
    if (grantConsent()) return true;
    return true;
  }

  function clearMedia() {
    var media = frame.querySelectorAll('iframe, video, .vsl__gate');
    for (var i = 0; i < media.length; i++) media[i].remove();
    loaded = false;
  }

  function restorePoster() {
    clearMedia();
    if (isWistia(src)) {
      renderGate();
      return;
    }
    if (!frame.querySelector('.vsl__poster') && posterHtml) {
      frame.insertAdjacentHTML('afterbegin', posterHtml);
    }
    if (!frame.querySelector('.vsl__play') && playHtml) {
      frame.insertAdjacentHTML('beforeend', playHtml);
      play = frame.querySelector('.vsl__play');
      if (play) play.addEventListener('click', onPlayClick);
    }
  }

  function mountMp4() {
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
    loaded = true;
  }

  function mountIframe() {
    if (loaded) return;
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = 'RAIS Video';
    iframe.loading = 'eager';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);
    loaded = true;
    emit('play', 0);
  }

  function startPlayback() {
    if (loaded) return;
    var gate = frame.querySelector('.vsl__gate');
    if (gate) gate.remove();
    var poster = frame.querySelector('.vsl__poster');
    var btn = frame.querySelector('.vsl__play');
    if (poster) {
      posterHtml = poster.outerHTML;
      poster.remove();
    }
    if (btn) {
      playHtml = btn.outerHTML;
      btn.remove();
    }

    if (isSelfHosted(src)) {
      mountMp4();
      return;
    }

    if (isWistia(src)) {
      ensureConsent();
      mountIframe();
      return;
    }

    mountIframe();
  }

  function onPlayClick(e) {
    if (e) e.preventDefault();
    if (loaded) return;
    startPlayback();
  }

  function watchConsent() {
    if (!isWistia(src)) return;
    var mgr = manager();
    if (!mgr || typeof mgr.watch !== 'function') return;
    mgr.watch({
      update: function (_obj, name) {
        if (name !== 'consents' && name !== 'saveConsents') return;
        if (hasConsent()) {
          /* Erst nach dem Speichern starten, nicht beim bloßen Umschalten im Dialog. */
          if (name === 'saveConsents' && !loaded) startPlayback();
          return;
        }
        if (loaded) restorePoster();
        else if (isWistia(src)) renderGate();
      }
    });
  }

  if (!src) {
    if (!play) return;
    root.classList.add('vsl--booking');
    play.classList.add('js-open-booking');
    if (!play.getAttribute('data-source')) play.setAttribute('data-source', 'vsl');
    play.setAttribute('aria-label', 'Erstgespräch buchen');
    var emptyLabel = play.querySelector('.vsl__play-label');
    if (emptyLabel) emptyLabel.textContent = 'Erstgespräch buchen';
    return;
  }

  root.classList.remove('vsl--booking');
  if (isWistia(src) && !hasConsent()) {
    renderGate();
  } else {
    startPlayback();
  }
  watchConsent();
})();
