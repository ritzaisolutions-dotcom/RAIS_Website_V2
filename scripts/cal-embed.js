/**
 * Cal Inline-Embed, geteilt von Buchungsmodal und Kontaktsektion.
 *
 * Ablauf: kein Netzwerkzugriff auf Cal, solange der Klaro-Service "cal"
 * nicht eingewilligt ist. Ohne Einwilligung steht ein Platzhalter mit
 * Ladebutton. Der Klick auf diesen Button ist die Einwilligung, sie wird
 * ueber Klaro persistiert und gilt danach fuer alle Container.
 *
 * Nach bestaetigter Buchung meldet Cal "bookingSuccessful". Erst dann
 * entsteht der Lead in Notion und Supabase, ueber dieselbe Edge Function
 * wie zuvor das Formular. Die Function ist unveraendert, das Payload
 * muss daher ihren Vertrag treffen:
 *
 *   name            Pflicht
 *   email           Pflicht
 *   phone           Pflicht, 6 bis 20 Ziffern
 *   inquiry_volume  Pflicht, Zahl 0 bis 300
 *   pain_point      optional, nur die sechs Slugs unten
 *   source          optional, nur [A-Za-z0-9_-]
 *   privacy_ack     muss true sein
 *   form_opened_at  ISO, mindestens 1,5 s und hoechstens 60 min alt
 *
 * Die dafuer noetigen Felder werden im Cal-Dashboard als Buchungsfragen
 * angelegt. Die Identifier muessen exakt so heissen:
 *
 *   attendeePhoneNumber   Telefon, Pflicht (Cal-Standardfeld)
 *   anfragen-pro-woche    Zahl, Pflicht, min 0, max 300
 *   engpass               Auswahl, Pflicht, Werte = PAIN_POINTS unten
 *   crm                   Text, optional
 *
 * "engpass" landet bewusst auf pain_point. Das frueher gesendete Feld
 * engpass hat die Edge Function nie gelesen, es fiel still weg.
 *
 * Auf /akut: data-cal-nolead am Container. Dann kein submit-audit-lead —
 * die Akut-Quali (Anfragevolumen, Primaerschmerz, CRM) bleibt im Event.
 */
(function () {
  'use strict';

  function t(text) {
    return window.RAIS && typeof window.RAIS.t === 'function' ? window.RAIS.t(text) : text;
  }

  var cfg = window.RAIS_PUBLIC_CONFIG || {};
  var SUPABASE_URL = cfg.supabaseUrl || '';
  var SUPABASE_ANON = cfg.supabaseAnonKey || '';
  var SERVICE = 'cal';

  var FALLBACK_URL = 'https://cal.com/ritzaisolutions/erstgesprach-mit-rais';
  var ALLOWED_HOSTS = ['cal.com', 'www.cal.com', 'ritz-ai-solutions.cal.eu'];

  /* Nur diese Werte akzeptiert submit-audit-lead als pain_point. */
  var PAIN_POINTS = [
    'inseratsanfragen-qualifizieren',
    'mieteranliegen-management',
    'terminierung-besichtigungen',
    'onboarding-vertragsunterschrift',
    'wiederkehrende-kundenfragen',
    'gesamtprozess',
    'anderes'
  ];

  var target = resolveTarget(cfg.calComUrl);
  var scriptPromise = null;
  var mounted = [];

  /* ── Ziel und Herkunft ──────────────────────────────────────── */

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
    /* cal.com liefert das Embed-Skript von app.cal.com, eine
       Organisations-Domain liefert es von sich selbst. */
    var isCalCom = url.hostname === 'cal.com' || url.hostname === 'www.cal.com';
    return {
      origin: isCalCom ? 'https://cal.com' : url.origin,
      script: (isCalCom ? 'https://app.cal.com' : url.origin) + '/embed/embed.js',
      link: url.pathname.replace(/^\/+/, '').replace(/\/+$/, '')
    };
  }

  /* ── Einwilligung ───────────────────────────────────────────── */

  function manager() {
    try {
      if (!window.klaro || typeof window.klaro.getManager !== 'function') return null;
      return window.klaro.getManager();
    } catch (e) {
      /* Klaro-Skript blockiert (Adblocker) oder Config nicht geladen. */
      return null;
    }
  }

  function hasConsent() {
    var mgr = manager();
    if (mgr && mgr.consents) return mgr.consents[SERVICE] === true;
    try {
      /* Klaro legt den Wert URL-kodiert ab, JSON.parse allein reicht nicht. */
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

  /* CTA / Modal: gleiche Geste wie der Gate-Button. Wenn Klaro da ist,
     Consent setzen und Embed laden — kein zweiter Klick. Ohne Klaro
     trotzdem laden: der Klick selbst ist die dokumentierte Einwilligung. */
  function ensureConsent() {
    if (hasConsent()) return true;
    if (grantConsent()) return true;
    return true;
  }

  /* Klaro kann spaeter noch widerrufen werden. Dann fallen alle
     Container auf den Platzhalter zurueck. */
  function watchConsent() {
    var mgr = manager();
    if (!mgr || typeof mgr.watch !== 'function') return;
    mgr.watch({
      update: function (_obj, name) {
        if (name !== 'consents' && name !== 'saveConsents') return;
        mounted.forEach(function (entry) {
          if (!hasConsent() && entry.holdUntil && Date.now() < entry.holdUntil) return;
          if (hasConsent()) {
            clearReadyTimer(entry);
            entry.loaded = false;
            activate(entry);
          } else if (!entry.openedByClick) {
            clearReadyTimer(entry);
            entry.loaded = false;
            renderPlaceholder(entry);
          }
        });
      }
    });
  }

  /* ── Platzhalter ────────────────────────────────────────────── */

  function renderPlaceholder(entry) {
    var box = document.createElement('div');
    box.className = 'cal-gate';

    var title = document.createElement('p');
    title.className = 'cal-gate__title';
    title.textContent = t('Terminkalender laden');
    box.appendChild(title);

    var note = document.createElement('p');
    note.className = 'cal-gate__note';
    note.textContent =
      t('Der Kalender kommt von unserem Terminanbieter Cal.com. Mit dem Klick laden Sie ihn nach, dabei wird Ihre IP-Adresse an Cal.com übertragen. Name, E-Mail und Telefonnummer geben Sie anschließend direkt im Kalender ein. Details in der ');
    var link = document.createElement('a');
    link.href = 'datenschutz.html';
    link.textContent = t('Datenschutzerklärung');
    note.appendChild(link);
    note.appendChild(document.createTextNode('.'));
    box.appendChild(note);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-gate__btn';
    btn.textContent = t('Kalender laden und Termin wählen');
    btn.addEventListener('click', function () {
      btn.disabled = true;
      btn.textContent = t('Kalender wird geladen…');
      entry.openedByClick = true;
      entry.holdUntil = Date.now() + 2000;
      entry.consentedAt = Date.now();
      grantConsent();
      entry.loaded = false;
      activate(entry);
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

  /* ── Embed ──────────────────────────────────────────────────── */

  /* Offizielle Cal-Queue. Aufrufe vor dem Laden von embed.js werden
     gepuffert und danach abgespielt, deshalb darf activate() sofort
     nach dem Stub arbeiten. Das Skript haengt hier bewusst selbst am
     DOM statt lazy im Stub, sonst gaebe es kein onerror. */
  function installStub() {
    if (window.Cal && window.Cal.q) return;
    var push = function (a, ar) { a.q.push(ar); };
    var Cal = function () {
      var ar = arguments;
      if (ar[0] === 'init') {
        var namespace = ar[1];
        if (typeof namespace === 'string') {
          var api = Cal.ns[namespace] || function () { push(api, arguments); };
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
        existing.addEventListener('load', function () { resolve(); });
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
      s.onerror = function () { reject(new Error('cal embed script failed')); };
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

  function renderDirectFrame(entry) {
    var resolved = entry.target || target;
    var pageUrl = resolved.origin + '/' + resolved.link;
    clearReadyTimer(entry);
    entry.el.classList.remove('is-loading');
    entry.el.innerHTML = '';

    var frame = document.createElement('iframe');
    frame.title = t('Termin wählen');
    /* Monat zuerst, ohne die lange Event-Beschreibung darüber.
       Danach Zeit, dann Angaben — alles in derselben Höhe. */
    frame.src = 'https://app.cal.com/' + resolved.link
      + '/embed?embedType=inline&layout=month_view&hideEventTypeDetails=true&theme=light';
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
    /* Convert-LP: kein Embed-Skript. Direktes Iframe lädt den Kalender
       auch wenn Klaro schon akzeptiert ist und Cal.js hängen bleibt. */
    if (entry.noLead) {
      renderDirectFrame(entry);
      return;
    }
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
    var hideDetails = resolved.link.indexOf('immo-ai-roadmap') !== -1;
    window.Cal('init', ns, { origin: resolved.origin });
    var inlineOpts = {
      elementOrSelector: entry.el,
      calLink: resolved.link,
      layout: 'month_view',
      config: Object.assign({
        locale: (window.RAIS && window.RAIS.lang && window.RAIS.lang() === 'en') ? 'en' : 'de'
      }, entry.config || {})
    };
    window.Cal.ns[ns]('inline', inlineOpts);
    window.Cal.ns[ns]('ui', {
      theme: 'light',
      colorScheme: 'light',
      cssVarsPerTheme: { light: { 'cal-brand': '#EC6A37' } },
      hideEventTypeDetails: hideDetails
    });
    window.Cal.ns[ns]('on', {
      action: 'bookingSuccessful',
      callback: function (event) {
        markReady(entry);
        submitLead(entry, event && event.detail ? event.detail.data : null);
        /* Local diagnostic only on /makler.html. No persistence. */
        if (window.RAISFunnel && typeof window.RAISFunnel.track === 'function') {
          window.RAISFunnel.track('booking_confirmed', {
            source: entry.source || null
          });
        }
      }
    });
    window.Cal.ns[ns]('on', {
      action: 'linkReady',
      callback: function () { markReady(entry); }
    });
    scheduleReadyFallback(entry);
  }

  /* ── Lead nach bestaetigter Buchung ─────────────────────────── */

  function pick(responses, keys) {
    if (!responses) return null;
    for (var i = 0; i < keys.length; i++) {
      var value = responses[keys[i]];
      if (value && typeof value === 'object') value = value.value;
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return String(value).trim();
      }
    }
    return null;
  }

  /* Die Function verlangt einen Zeitstempel, der zwischen 1,5 s und
     60 min alt ist. Eine Buchung kann laenger dauern, deshalb wird
     ausserhalb des Fensters auf einen gueltigen Wert korrigiert. */
  function openedAt(entry) {
    var stamp = entry.consentedAt || entry.mountedAt;
    var age = Date.now() - stamp;
    if (age < 1500 || age > 55 * 60 * 1000) stamp = Date.now() - 5000;
    return new Date(stamp).toISOString();
  }

  function submitLead(entry, data) {
    if (entry.noLead) return;
    if (!SUPABASE_URL || !SUPABASE_ANON) return;
    if (entry.leadSent) return;

    var booking = (data && data.booking) || {};
    var responses = booking.responses || (data && data.responses) || {};
    var attendee = (booking.attendees && booking.attendees[0]) || {};

    var name = pick(responses, ['name']) || attendee.name || null;
    var email = pick(responses, ['email']) || attendee.email || null;
    var phone = pick(responses, ['attendeePhoneNumber', 'telefon', 'phone', 'smsReminderNumber']);
    var volume = pick(responses, ['anfragen-pro-woche', 'anfragen_pro_woche']);
    var painPoint = pick(responses, ['engpass', 'pain-point', 'pain_point']);

    var inquiryVolume = volume === null ? null : Number(volume);
    if (inquiryVolume !== null && isFinite(inquiryVolume)) {
      inquiryVolume = Math.max(0, Math.min(300, Math.round(inquiryVolume)));
    } else {
      inquiryVolume = null;
    }

    if (!name || !email || !phone || inquiryVolume === null) {
      /* Fehlt ein Pflichtfeld, wuerde die Function mit 400 antworten.
         Die Buchung selbst steht bereits, deshalb nur protokollieren. */
      console.warn('RAIS: Buchung ohne vollstaendige Lead-Felder, Pflichtfragen in Cal pruefen.');
      return;
    }

    entry.leadSent = true;

    fetch(SUPABASE_URL + '/functions/v1/submit-audit-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': 'Bearer ' + SUPABASE_ANON
      },
      body: JSON.stringify({
        name: name.slice(0, 200),
        email: email.slice(0, 254),
        phone: phone.slice(0, 40),
        inquiry_volume: inquiryVolume,
        pain_point: PAIN_POINTS.indexOf(painPoint) === -1 ? null : painPoint,
        icp_segment: entry.icpSegment || null,
        source: entry.source || null,
        privacy_ack: true,
        form_opened_at: openedAt(entry)
      })
    }).catch(function () {
      /* Der Termin steht trotzdem. Cal benachrichtigt uns per Mail. */
      entry.leadSent = false;
    });
  }

  /* ── Oeffentliche Schnittstelle ─────────────────────────────── */

  var counter = 0;

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

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    var forceLoad = options.ensureConsent === true;
    var remount = options.remount === true;
    if (forceLoad) ensureConsent();

    var existing = null;
    mounted.forEach(function (entry) { if (entry.el === el) existing = entry; });

    if (existing) {
      /* Source darf sich aendern, der Kalender bleibt stehen. */
      if (options.source) existing.source = sanitizeSource(options.source);
      if (options.icpSegment) existing.icpSegment = options.icpSegment;
      if (options.calUrl) existing.target = resolveTarget(options.calUrl);
      if (options.config) existing.config = options.config;
      if (typeof options.noLead === 'boolean') existing.noLead = options.noLead;

      if (remount || (existing.loaded && options.config) || (!existing.loaded && (forceLoad || hasConsent()))) {
        clearReadyTimer(existing);
        existing.loaded = false;
        existing.leadSent = false;
        existing.el.innerHTML = '';
        existing.el.classList.remove('is-loading');
        if (remount) {
          counter += 1;
          existing.ns = 'rais-' + counter;
        }
        if (forceLoad || remount || hasConsent()) {
          if (forceLoad) {
            existing.openedByClick = true;
            existing.holdUntil = Date.now() + 2000;
          }
          existing.consentedAt = Date.now();
          activate(existing);
        } else {
          renderPlaceholder(existing);
        }
      }
      return existing;
    }

    counter += 1;
    var entry = {
      el: el,
      ns: 'rais-' + counter,
      loaded: false,
      leadSent: false,
      noLead: options.noLead === true || (el && el.hasAttribute('data-cal-nolead')),
      mountedAt: Date.now(),
      consentedAt: 0,
      readyTimer: 0,
      source: sanitizeSource(options.source),
      icpSegment: options.icpSegment || null,
      target: resolveEntryTarget(el, options),
      config: options.config || null
    };
    mounted.push(entry);

    /* CTA/Modal: ensureConsent = Klick ist die Einwilligung → sofort laden.
       data-cal-click: nur Platzhalter, bis der Gate-Button geklickt wird. */
    if (forceLoad || (hasConsent() && !el.hasAttribute('data-cal-click'))) {
      if (forceLoad) {
        entry.openedByClick = true;
        entry.holdUntil = Date.now() + 2000;
      }
      entry.consentedAt = Date.now();
      activate(entry);
    } else {
      renderPlaceholder(entry);
    }
    return entry;
  }

  /* submit-audit-lead weist alles ab, was nicht [A-Za-z0-9_-] ist. */
  function sanitizeSource(value) {
    if (!value) return null;
    var clean = String(value).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 100);
    return clean || null;
  }

  window.RAISCal = {
    mount: mount,
    hasConsent: hasConsent,
    ensureConsent: ensureConsent,
    grantConsent: grantConsent
  };

  watchConsent();

  /* Container, die schon im Markup stehen, brauchen keinen Aufruf.
     Kontakt-Embed sofort (Conversion), Rest kurz vor Sichtbarkeit. */
  function autoMount() {
    var nodes = document.querySelectorAll('[data-cal-inline]');
    if (!nodes.length) return;

    function mountNode(el) {
      mount(el, {
        source: el.getAttribute('data-source'),
        calUrl: el.getAttribute('data-cal-url') || pageCalUrl(),
        noLead: el.hasAttribute('data-cal-nolead')
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

    var observer = new window.IntersectionObserver(function (entries) {
      entries.forEach(function (item) {
        if (!item.isIntersecting) return;
        observer.unobserve(item.target);
        pending = pending.filter(function (n) { return n !== item.target; });
        mountNode(item.target);
      });
    }, { rootMargin: '400px 0px' });

    pending.forEach(function (el) { observer.observe(el); });

    /* Never leave only the static HTML fallback if IO never fires. */
    window.setTimeout(function () {
      pending.forEach(function (el) {
        observer.unobserve(el);
        /* Real embed gate uses .cal-gate__btn; HTML fallback uses .js-open-booking. */
        if (!el.querySelector('.cal-gate__btn, iframe')) mountNode(el);
      });
      pending = [];
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }

  /* Convert-LP: Cal-Iframe meldet bookingSuccessful per postMessage.
     Nur dort auf die Danke-Seite wechseln — andere Cal-Seiten bleiben. */
  function isCalBookingSuccess(data) {
    if (!data) return false;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { return false; }
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

  function listenConvertThanksRedirect() {
    if (!document.body || document.body.dataset.page !== 'convert') return;
    var redirected = false;
    window.addEventListener('message', function (event) {
      if (redirected) return;
      var origin = event.origin || '';
      if (origin !== 'https://app.cal.com' && origin !== 'https://cal.com') return;
      if (!isCalBookingSuccess(event.data)) return;
      redirected = true;
      window.location.assign('/danke.html');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', listenConvertThanksRedirect);
  } else {
    listenConvertThanksRedirect();
  }
}());
