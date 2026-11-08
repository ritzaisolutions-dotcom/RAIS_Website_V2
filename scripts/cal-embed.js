/**
 * Cal Inline-Embed, geteilt von Buchungsmodal und Kontaktsektion.
 *
 * Kein Netzwerkzugriff auf Cal, solange NICHT BEIDE Klaro-Services
 * "cal" und "meta-pixel" eingewilligt sind. Ohne Einwilligung: Platzhalter
 * mit Zustimmungs-Button. Nur dieser Button erteilt die Einwilligung (beide
 * Dienste zugleich); ein CTA-/Modal-Klick allein gilt NICHT als Einwilligung.
 *
 * Event: ritzaisolutions/strategiegespraech-mit-rais
 * Quali-Fragen leben im Cal-Event (pain, sales_per_year, social_media,
 * social_media_how). Kein vorgeschaltetes Formular, kein Custom-Booking.
 *
 * Nach bookingSuccessful: Weiterleitung auf /danke.html (Cal-Plan ohne
 * serverseitigen Redirect).
 */
(function () {
  'use strict';

  function t(text) {
    return window.RAIS && typeof window.RAIS.t === 'function' ? window.RAIS.t(text) : text;
  }

  var cfg = window.RAIS_PUBLIC_CONFIG || {};
  /* Zuordnungsdaten fuer das serverseitige Schedule (scripts/cal-tracking.js). */
  var T = window.RAISCalTracking || null;
  /* Buchung nur mit beiden Einwilligungen (Cal.com + Meta Pixel). */
  var SERVICES = ['cal', 'meta-pixel'];
  var grantingUntil = 0;

  var FALLBACK_URL = 'https://cal.com/ritzaisolutions/strategiegespraech-mit-rais';
  var ALLOWED_HOSTS = ['cal.com', 'www.cal.com', 'ritz-ai-solutions.cal.eu'];

  var target = resolveTarget(cfg.calComUrl);
  var scriptPromise = null;
  var mounted = [];
  var counter = 0;
  var thanksRedirectInstalled = false;
  var thanksRedirected = false;

  function resolveTarget(raw) {
    var url;
    try {
      url = new URL(raw);
    } catch (e) {
      url = new URL(FALLBACK_URL);
    }
    if (url.protocol !== 'https:' || ALLOWED_HOSTS.indexOf(url.hostname) === -1) {
      url = new URL(FALLBACK_URL);
    }
    var isCalCom = url.hostname === 'cal.com' || url.hostname === 'www.cal.com';
    return {
      origin: isCalCom ? 'https://cal.com' : url.origin,
      script: (isCalCom ? 'https://app.cal.com' : url.origin) + '/embed/embed.js',
      link: url.pathname.replace(/^\/+/, '').replace(/\/+$/, ''),
    };
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
    if (mgr && mgr.consents) {
      return SERVICES.every(function (name) {
        return mgr.consents[name] === true;
      });
    }
    try {
      var raw = window.localStorage.getItem('klaro') || '{}';
      var stored = JSON.parse(decodeURIComponent(raw));
      return SERVICES.every(function (name) {
        return stored[name] === true;
      });
    } catch (e) {
      return false;
    }
  }

  /* Nur vom Zustimmungs-Button im Gate aufrufen (explizite Handlung). */
  function grantConsent() {
    var mgr = manager();
    if (!mgr || typeof mgr.updateConsent !== 'function') return false;
    try {
      grantingUntil = Date.now() + 2000;
      SERVICES.forEach(function (name) {
        mgr.updateConsent(name, true);
      });
      mgr.saveAndApplyConsents();
      return true;
    } catch (e) {
      return false;
    }
  }

  /* Erteilt nichts mehr automatisch: gibt nur zurück, ob beide Einwilligungen da sind. */
  function ensureConsent() {
    return hasConsent();
  }

  function watchConsent() {
    var mgr = manager();
    if (!mgr || typeof mgr.watch !== 'function') return;
    mgr.watch({
      update: function (_obj, name) {
        if (name !== 'consents' && name !== 'saveConsents') return;
        mounted.forEach(function (entry) {
          if (!hasConsent() && Date.now() < grantingUntil) return;
          if (hasConsent()) {
            if (entry.loaded) return;
            clearReadyTimer(entry);
            entry.loaded = false;
            activate(entry);
          } else {
            clearReadyTimer(entry);
            entry.loaded = false;
            renderPlaceholder(entry);
          }
        });
      },
    });
  }

  function renderPlaceholder(entry) {
    var box = document.createElement('div');
    box.className = 'cal-gate';

    var title = document.createElement('p');
    title.className = 'cal-gate__title';
    title.textContent = t('Terminkalender laden');
    box.appendChild(title);

    var note = document.createElement('p');
    note.className = 'cal-gate__note';
    note.textContent = t(
      'Für die Online-Terminbuchung benötigen wir Ihre Einwilligung in zwei Dienste: Cal.com (Kalender, Ihre IP-Adresse wird an Cal.com übertragen) und Meta Pixel (Werbemessung, Daten werden an Meta übertragen, damit wir sehen, ob eine Buchung über unsere Anzeigen zustande kam). Ohne beide Einwilligungen ist keine Online-Buchung möglich; alternativ erreichen Sie uns per E-Mail an kevin@ritz-ai.solutions. Name, E-Mail und Telefonnummer geben Sie anschließend direkt im Kalender ein. Details in der ',
    );
    var link = document.createElement('a');
    link.href = 'datenschutz.html';
    link.textContent = t('Datenschutzerklärung');
    note.appendChild(link);
    note.appendChild(document.createTextNode('.'));
    box.appendChild(note);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-gate__btn';
    btn.textContent = t('Zustimmen und Termin wählen');
    btn.addEventListener('click', function () {
      btn.disabled = true;
      btn.textContent = t('Kalender wird geladen…');
      if (!grantConsent()) {
        /* Consent-Tool nicht verfügbar (z. B. von einem Blocker unterdrückt): nichts laden, Hinweis zeigen. */
        btn.disabled = false;
        btn.textContent = t('Zustimmen und Termin wählen');
        if (!box.querySelector('.cal-gate__error')) {
          var err = document.createElement('p');
          err.className = 'cal-gate__error';
          err.setAttribute('role', 'alert');
          err.textContent = t(
            'Die Einwilligung konnte nicht gespeichert werden. Bitte laden Sie die Seite neu oder schreiben Sie uns an kevin@ritz-ai.solutions.',
          );
          box.appendChild(err);
        }
        return;
      }
      entry.openedByClick = true;
      entry.consentedAt = Date.now();
      /* Der Klaro-Watcher hat den Eintrag beim Speichern meist schon aktiviert. */
      if (!entry.loaded) activate(entry);
    });
    box.appendChild(btn);

    entry.el.innerHTML = '';
    entry.el.appendChild(box);
  }

  function renderFallbackLink(entry) {
    var link = document.createElement('a');
    var resolved = entry.target || target;
    link.href = resolved.origin + '/' + resolved.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'cal-gate__btn';
    link.textContent = t('Termin bei Cal.com auswählen');
    entry.el.innerHTML = '';
    entry.el.appendChild(link);
  }

  function installStub() {
    if (window.Cal && window.Cal.q) return;
    var push = function (a, ar) {
      a.q.push(ar);
    };
    var Cal = function () {
      var ar = arguments;
      if (ar[0] === 'init') {
        var namespace = ar[1];
        if (typeof namespace === 'string') {
          var api = Cal.ns[namespace] || function () {
            push(api, arguments);
          };
          api.q = api.q || [];
          Cal.ns[namespace] = api;
          push(api, ar);
          push(Cal, ['initNamespace', namespace]);
          return;
        }
      }
      push(Cal, ar);
    };
    Cal.ns = {};
    Cal.q = [];
    Cal.loaded = true;
    window.Cal = Cal;
  }

  function loadScript(scriptUrl) {
    var src = scriptUrl || target.script;
    if (scriptPromise && scriptPromise._raisSrc === src) return scriptPromise;
    installStub();
    scriptPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-rais-cal-embed]');
      if (existing && existing.getAttribute('src') === src) {
        if (window.Cal && !window.Cal.q) {
          resolve();
          return;
        }
        existing.addEventListener('load', function () {
          resolve();
        });
        existing.addEventListener('error', function () {
          reject(new Error('cal embed script failed'));
        });
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.setAttribute('data-rais-cal-embed', '');
      s.onload = resolve;
      s.onerror = function () {
        reject(new Error('cal embed script failed'));
      };
      document.head.appendChild(s);
    });
    scriptPromise._raisSrc = src;
    return scriptPromise;
  }

  function clearReadyTimer(entry) {
    if (entry.readyTimer) {
      window.clearTimeout(entry.readyTimer);
      entry.readyTimer = 0;
    }
  }

  function markReady(entry) {
    clearReadyTimer(entry);
    entry.el.classList.remove('is-loading');
  }

  function scheduleReadyFallback(entry) {
    clearReadyTimer(entry);
    entry.readyTimer = window.setTimeout(function () {
      entry.readyTimer = 0;
      if (entry.el.querySelector('iframe')) {
        markReady(entry);
        return;
      }
      entry.loaded = false;
      entry.el.classList.remove('is-loading');
      renderFallbackLink(entry);
    }, 4000);
  }

  var iframeReadyAckInstalled = false;
  function installIframeReadyAck() {
    if (iframeReadyAckInstalled) return;
    iframeReadyAckInstalled = true;
    window.addEventListener('message', function (event) {
      var origin = event.origin || '';
      if (origin !== 'https://app.cal.com' && origin !== 'https://cal.com') return;
      var data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.originator !== 'CAL' || data.type !== '__iframeReady') return;
      var source = event.source;
      if (!source || typeof source.postMessage !== 'function') return;
      try {
        source.postMessage(
          { originator: 'CAL', method: 'parentKnowsIframeReady', arg: {} },
          origin,
        );
      } catch (e) {
        /* ignore */
      }
    });
  }

  /* Felder fuer die versteckten Cal-Felder. Nur mit beiden Einwilligungen, sonst {}. */
  function trackingFields() {
    if (!T || !hasConsent()) return {};
    try {
      window.RAIS_EVENT_ID = window.RAIS_EVENT_ID || T.newEventId();
      return T.trackingConfig({
        consent: true,
        cookie: document.cookie,
        href: window.location.href,
        search: window.location.search,
        userAgent: window.navigator ? window.navigator.userAgent : '',
        eventId: window.RAIS_EVENT_ID,
        nowMs: Date.now(),
      });
    } catch (e) {
      return {};
    }
  }

  /* _fbp entsteht erst, wenn fbevents.js geladen ist (kurz nach der Zustimmung).
     Hoechstens 1200 ms warten, dann trotzdem weiter. Ohne Tracking-Modul oder mit
     vorhandenem Cookie wird nicht gewartet. */
  function whenPixelCookie(done) {
    function has() {
      try {
        return /(?:^|;\s*)_fbp=/.test(document.cookie);
      } catch (e) {
        return true;
      }
    }
    if (!T || has()) {
      done();
      return;
    }
    var waited = 0;
    var timer = window.setInterval(function () {
      waited += 100;
      if (has() || waited >= 1200) {
        window.clearInterval(timer);
        done();
      }
    }, 100);
  }

  /* Nur Logging, nur mit localStorage.rais_debug_cal = '1'. Speichert und sendet nichts. */
  function debugBooking(source, raw) {
    try {
      if (window.localStorage.getItem('rais_debug_cal') !== '1' || !window.console) return;
      var d = raw;
      if (typeof d === 'string') d = JSON.parse(d);
      var inner = d && d.data && typeof d.data === 'object' ? d.data : {};
      window.console.info('[rais] Cal Buchung', {
        source: source,
        type: d && (d.type || d.action || d.method) || null,
        keys: Object.keys(inner),
        hasUid: typeof inner.uid === 'string',
        uid: typeof inner.uid === 'string' ? inner.uid : null,
      });
    } catch (e) {
      /* Debug darf nie stoeren */
    }
  }

  function goToThanks() {
    if (thanksRedirected) return;
    thanksRedirected = true;
    /* Buchung abgeschlossen → Meta-Event "Schedule". Der Kalender lädt nur mit
       Meta-Pixel-Einwilligung, fbq existiert hier also nur bei Zustimmung.
       Kurze Verzögerung, damit der Request vor dem Seitenwechsel rausgeht. */
    var delay = 0;
    try {
      if (typeof window.fbq === 'function') {
        if (window.RAIS_EVENT_ID) {
          window.fbq('track', 'Schedule', {}, { eventID: window.RAIS_EVENT_ID });
        } else {
          window.fbq('track', 'Schedule');
        }
        delay = 400;
      }
    } catch (e) {
      /* Tracking darf die Weiterleitung nie blockieren */
    }
    window.setTimeout(function () {
      window.location.assign('/danke.html');
    }, delay);
  }

  function isCalBookingSuccess(data) {
    if (!data) return false;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return false;
      }
    }
    if (typeof data !== 'object') return false;
    var type = data.type || data.action || data.method || '';
    if (type === 'bookingSuccessful' || type === 'bookingSuccessfulV2') return true;
    if (data.data && typeof data.data === 'object') {
      var nested = data.data.type || data.data.action || '';
      if (nested === 'bookingSuccessful' || nested === 'bookingSuccessfulV2') return true;
    }
    return false;
  }

  function listenThanksRedirect() {
    if (thanksRedirectInstalled) return;
    thanksRedirectInstalled = true;
    window.addEventListener('message', function (event) {
      var origin = event.origin || '';
      if (origin !== 'https://app.cal.com' && origin !== 'https://cal.com') return;
      if (!isCalBookingSuccess(event.data)) return;
      debugBooking('iframe', event.data);
      goToThanks();
    });
  }

  function configQuery(config) {
    if (!config || typeof config !== 'object') return '';
    var parts = [];
    Object.keys(config).forEach(function (key) {
      var value = config[key];
      if (value === undefined || value === null || value === '') return;
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(value)));
    });
    return parts.length ? '&' + parts.join('&') : '';
  }

  function renderDirectFrame(entry, tracking) {
    var resolved = entry.target || target;
    var pageUrl = resolved.origin + '/' + resolved.link;
    clearReadyTimer(entry);
    entry.el.classList.remove('is-loading');
    entry.el.innerHTML = '';
    installIframeReadyAck();
    listenThanksRedirect();

    var frame = document.createElement('iframe');
    frame.title = t('Termin wählen');
    frame.src =
      'https://app.cal.com/' +
      resolved.link +
      '/embed?embedType=inline&layout=month_view&hideEventTypeDetails=true&theme=light' +
      configQuery(Object.assign({}, tracking || {}, entry.config || {}));
    frame.loading = 'eager';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.setAttribute('allow', 'payment');
    frame.style.width = '100%';
    frame.style.height = '100%';
    frame.style.minHeight = '560px';
    frame.style.border = '0';
    frame.style.display = 'block';
    frame.style.background = '#fff';
    entry.el.appendChild(frame);

    if (entry.el.id !== 'bm-cal-wrap') {
      var link = document.createElement('a');
      link.href = pageUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'cal-direct-link';
      link.textContent = t('Termin bei Cal.com öffnen');
      entry.el.appendChild(link);
    }
  }

  function activate(entry) {
    if (entry.loaded) return;
    entry.loaded = true;
    listenThanksRedirect();

    entry.activation = (entry.activation || 0) + 1;
    var run = entry.activation;
    entry.el.classList.add('is-loading');

    whenPixelCookie(function () {
      /* Zwischenzeitlich widerrufen oder neu aktiviert: nichts mehr tun. */
      if (entry.activation !== run || !entry.loaded || !hasConsent()) return;
      var tracking = trackingFields();

      /* Convert-LP und Modal: direktes Iframe (zuverlässiger als Cal.js). */
      if (entry.noLead || entry.direct) {
        renderDirectFrame(entry, tracking);
        return;
      }
      mountCalJs(entry, tracking);
    });
  }

  function mountCalJs(entry, tracking) {
    entry.el.innerHTML = '';
    entry.el.classList.add('is-loading');

    var resolved = entry.target || target;
    loadScript(resolved.script).catch(function () {
      entry.loaded = false;
      clearReadyTimer(entry);
      entry.el.classList.remove('is-loading');
      renderFallbackLink(entry);
    });

    var ns = entry.ns;
    window.Cal('init', ns, { origin: resolved.origin });
    var inlineOpts = {
      elementOrSelector: entry.el,
      calLink: resolved.link,
      layout: 'month_view',
      config: Object.assign(
        {
          locale: window.RAIS && window.RAIS.lang && window.RAIS.lang() === 'en' ? 'en' : 'de',
        },
        tracking || {},
        entry.config || {},
      ),
    };
    window.Cal.ns[ns]('inline', inlineOpts);
    window.Cal.ns[ns]('ui', {
      theme: 'light',
      colorScheme: 'light',
      cssVarsPerTheme: { light: { 'cal-brand': '#EC6A37' } },
      hideEventTypeDetails: true,
    });
    window.Cal.ns[ns]('on', {
      action: 'bookingSuccessful',
      callback: function (e) {
        markReady(entry);
        debugBooking('cal.js', e && e.detail);
        if (window.RAISFunnel && typeof window.RAISFunnel.track === 'function') {
          window.RAISFunnel.track('booking_confirmed', {
            source: entry.source || null,
          });
        }
        goToThanks();
      },
    });
    window.Cal.ns[ns]('on', {
      action: 'linkReady',
      callback: function () {
        markReady(entry);
      },
    });
    scheduleReadyFallback(entry);
  }

  function pageCalUrl() {
    var body = document.body;
    return body && body.getAttribute('data-cal-url');
  }

  function resolveEntryTarget(el, options) {
    var raw =
      (options && options.calUrl) ||
      (el && el.getAttribute('data-cal-url')) ||
      pageCalUrl() ||
      cfg.calComUrl;
    return resolveTarget(raw);
  }

  function sanitizeSource(value) {
    if (!value) return null;
    var clean = String(value).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 100);
    return clean || null;
  }

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    var forceLoad = options.ensureConsent === true;
    var remount = options.remount === true;
    if (forceLoad) ensureConsent();

    var existing = null;
    mounted.forEach(function (entry) {
      if (entry.el === el) existing = entry;
    });

    if (existing) {
      if (options.source) existing.source = sanitizeSource(options.source);
      if (options.icpSegment) existing.icpSegment = options.icpSegment;
      if (options.calUrl) existing.target = resolveTarget(options.calUrl);
      if (options.config) existing.config = options.config;
      if (typeof options.noLead === 'boolean') existing.noLead = options.noLead;
      if (typeof options.direct === 'boolean') existing.direct = options.direct;

      if (
        remount ||
        (existing.loaded && options.config) ||
        (!existing.loaded && (forceLoad || hasConsent()))
      ) {
        clearReadyTimer(existing);
        existing.loaded = false;
        existing.el.innerHTML = '';
        existing.el.classList.remove('is-loading');
        if (remount) {
          counter += 1;
          existing.ns = 'rais-' + counter;
        }
        if (hasConsent()) {
          existing.consentedAt = Date.now();
          activate(existing);
        } else {
          renderPlaceholder(existing);
        }
      }
      return existing;
    }

    counter += 1;
    var isConvert = document.body && document.body.getAttribute('data-page') === 'convert';
    var entry = {
      el: el,
      ns: 'rais-' + counter,
      loaded: false,
      noLead:
        options.noLead === true ||
        (el && el.hasAttribute('data-cal-nolead')) ||
        isConvert,
      direct: options.direct === true || isConvert || el.id === 'bm-cal-wrap',
      mountedAt: Date.now(),
      consentedAt: 0,
      readyTimer: 0,
      source: sanitizeSource(options.source),
      icpSegment: options.icpSegment || null,
      target: resolveEntryTarget(el, options),
      config: options.config || null,
    };
    mounted.push(entry);

    if (hasConsent() && (forceLoad || !el.hasAttribute('data-cal-click'))) {
      entry.consentedAt = Date.now();
      activate(entry);
    } else {
      renderPlaceholder(entry);
    }
    return entry;
  }

  function autoMount() {
    var nodes = document.querySelectorAll('[data-cal-inline]');
    if (!nodes.length) return;

    function mountNode(el) {
      mount(el, {
        source: el.getAttribute('data-source'),
        calUrl: el.getAttribute('data-cal-url') || pageCalUrl(),
        noLead: el.hasAttribute('data-cal-nolead'),
      });
    }

    var eager = [];
    var lazy = [];
    nodes.forEach(function (el) {
      if (el.id === 'cal-inline-contact' || el.id === 'cal-inline-termin') {
        eager.push(el);
      } else {
        lazy.push(el);
      }
    });

    eager.forEach(mountNode);
    if (!lazy.length) return;

    if (typeof window.IntersectionObserver !== 'function') {
      lazy.forEach(mountNode);
      return;
    }

    var pending = lazy.slice();
    var observer = new window.IntersectionObserver(
      function (entries) {
        entries.forEach(function (item) {
          if (!item.isIntersecting) return;
          observer.unobserve(item.target);
          pending = pending.filter(function (n) {
            return n !== item.target;
          });
          mountNode(item.target);
        });
      },
      { rootMargin: '400px 0px' },
    );

    pending.forEach(function (el) {
      observer.observe(el);
    });

    window.setTimeout(function () {
      pending.forEach(function (el) {
        observer.unobserve(el);
        if (!el.querySelector('.cal-gate__btn, iframe')) mountNode(el);
      });
      pending = [];
    }, 1200);
  }

  /* Script + DNS warmen, sobald Consent da ist. Iframe erst bei mount. */
  function preload(opts) {
    var options = opts || {};
    if (!hasConsent()) return Promise.resolve(null);
    return loadScript((options.calUrl ? resolveTarget(options.calUrl) : target).script).catch(
      function () {
        return null;
      },
    );
  }

  window.RAISCal = {
    mount: mount,
    preload: preload,
    hasConsent: hasConsent,
    ensureConsent: ensureConsent,
    grantConsent: grantConsent,
  };

  watchConsent();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }
})();
