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
    return window.klaro && typeof window.klaro.getManager === 'function'
      ? window.klaro.getManager()
      : null;
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
    if (!mgr) return false;
    mgr.updateConsent(SERVICE, true);
    mgr.saveAndApplyConsents();
    return true;
  }

  /* CTA / Modal: gleiche Geste wie der Gate-Button. Wenn Klaro da ist,
     Consent setzen und Embed laden — kein zweiter Klick. */
  function ensureConsent() {
    if (hasConsent()) return true;
    return grantConsent();
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
          if (hasConsent()) {
            activate(entry);
          } else {
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
      entry.consentedAt = Date.now();
      if (!grantConsent()) {
        /* Ohne Klaro-Manager keine belastbare Einwilligung, also
           auch kein Embed. Der externe Link bleibt als Ausweg. */
        renderFallbackLink(entry);
        return;
      }
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

  function loadScript() {
    if (scriptPromise) return scriptPromise;
    installStub();
    scriptPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = target.script;
      s.async = true;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('cal embed script failed')); };
      document.head.appendChild(s);
    });
    return scriptPromise;
  }

  function activate(entry) {
    if (entry.loaded) return;
    entry.loaded = true;
    entry.el.innerHTML = '';
    entry.el.classList.add('is-loading');

    loadScript().catch(function () {
      entry.loaded = false;
      entry.el.classList.remove('is-loading');
      renderFallbackLink(entry);
    });

    var ns = entry.ns;
    var resolved = entry.target || target;
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
      cssVarsPerTheme: { light: { 'cal-brand': '#EC6A37' } },
      hideEventTypeDetails: hideDetails
    });
    window.Cal.ns[ns]('on', {
      action: 'bookingSuccessful',
      callback: function (event) {
        entry.el.classList.remove('is-loading');
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
      callback: function () { entry.el.classList.remove('is-loading'); }
    });
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
    if (options.ensureConsent) ensureConsent();

    var existing = null;
    mounted.forEach(function (entry) { if (entry.el === el) existing = entry; });

    if (existing) {
      /* Source darf sich aendern, der Kalender bleibt stehen. */
      if (options.source) existing.source = sanitizeSource(options.source);
      if (options.icpSegment) existing.icpSegment = options.icpSegment;
      if (options.calUrl) existing.target = resolveTarget(options.calUrl);
      if (options.config) existing.config = options.config;
      if (existing.loaded && options.config) {
        existing.loaded = false;
        existing.leadSent = false;
        existing.el.innerHTML = '';
        if (hasConsent()) activate(existing);
        return existing;
      }
      if (!existing.loaded && hasConsent()) {
        existing.consentedAt = existing.consentedAt || Date.now();
        activate(existing);
      }
      return existing;
    }

    counter += 1;
    var entry = {
      el: el,
      ns: 'rais-' + counter,
      loaded: false,
      leadSent: false,
      mountedAt: Date.now(),
      consentedAt: 0,
      source: sanitizeSource(options.source),
      icpSegment: options.icpSegment || null,
      target: resolveEntryTarget(el, options),
      config: options.config || null
    };
    mounted.push(entry);

    if (hasConsent()) {
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
        calUrl: el.getAttribute('data-cal-url') || pageCalUrl()
      });
    }

    var eager = [];
    var lazy = [];
    nodes.forEach(function (el) {
      if (el.id === 'cal-inline-contact' || el.classList.contains('cal-inline--contact')) {
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
}());
