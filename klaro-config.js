/* Klaro design: styles/klaro-overrides.css (loaded after klaro.min.css) */

/* ─────────────────────────────────────────────────────
   SUPABASE: Consent-Logging
───────────────────────────────────────────────────── */
(function () {
  var cfg = window.RAIS_PUBLIC_CONFIG || {};
  var SUPABASE_URL = cfg.supabaseUrl || '';
  var SUPABASE_ANON = cfg.supabaseAnonKey || '';

  /* Pseudonyme Browser-ID (personenbezogen, nur zur Deduplizierung; siehe Datenschutzerklärung) */
  function generateUUID() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    var bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = Array.from(bytes).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    return hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20);
  }

  function getConsentId() {
    var key = 'rais_cid';
    var id;
    try { id = localStorage.getItem(key); } catch (e) { return generateUUID(); }
    if (!id) {
      id = generateUUID();
      try { localStorage.setItem(key, id); } catch (e) { /* quota exceeded — proceed without persistence */ }
    }
    return id;
  }

  function sendConsent(decisions) {
    if (!SUPABASE_URL || !SUPABASE_ANON) return;
    fetch(SUPABASE_URL + '/rest/v1/cookie_consents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': 'Bearer ' + SUPABASE_ANON,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        consent_id: getConsentId(),
        decisions: decisions,
        page_url: window.location.pathname,
      }),
    }).catch(function () { /* silent fail — Consent ist im localStorage */ });
  }

  window.raisSendConsent = sendConsent;
})();


/* ─────────────────────────────────────────────────────
   KLARO: Konfiguration
───────────────────────────────────────────────────── */
var klaroConfig = {
  version: 1,
  elementID: 'klaro',
  storageMethod: 'localStorage',
  storageName: 'klaro',
  cookieExpiresAfterDays: 365,
  lang: (function () {
    try { return localStorage.getItem('rais-lang') === 'en' ? 'en' : 'de'; }
    catch (e) { return 'de'; }
  }()),
  mustConsent: (function () {
    try {
      var path = (window.location && window.location.pathname) || '';
      // Privacy policy must stay readable — no cookie wall (Care.com-style).
      if (/\/datenschutz(\.html)?\/?$/i.test(path)) return false;
    } catch (e) { /* ignore */ }
    return true;
  }()),
  acceptAll: true,
  hideDeclineAll: false,
  privacyPolicy: '/datenschutz.html',

  callback: function (consent, service) {
    if (typeof window.raisSendConsent === 'function') {
      window.raisSendConsent(consent);
    }
  },

  translations: {
    de: {
      consentNotice: {
        description:
          'Wir nutzen Cookies und ähnliche Technologien. Einige sind technisch notwendig, andere helfen uns – mit deiner Einwilligung – bei der Fehlererkennung auf dieser Website.',
        learnMore: 'Einstellungen',
      },
      consentModal: {
        title: 'Datenschutzeinstellungen',
        description:
          'Hier kannst du entscheiden, welche Dienste auf dieser Website verwendet werden dürfen.',
        privacyPolicy: {
          name: 'Datenschutzerklärung',
          text: 'Weitere Informationen findest du in unserer {privacyPolicy}.',
        },
      },
      acceptAll: 'Alle akzeptieren',
      declineAll: 'Nur notwendige',
      acceptSelected: 'Auswahl speichern',
      close: 'Schließen',
      poweredBy: 'Verwaltet mit Klaro',
      purposes: {
        security: 'Sicherheit & Fehlerbehebung',
        booking: 'Terminbuchung',
        media: 'Video & Medien',
      },
    },
    en: {
      consentNotice: {
        description:
          'We use cookies and similar technologies. Some are technically required, others help us, with your consent, detect errors on this website.',
        learnMore: 'Settings',
      },
      consentModal: {
        title: 'Privacy settings',
        description: 'Choose which services this website may use.',
        privacyPolicy: {
          name: 'privacy policy',
          text: 'You can find more information in our {privacyPolicy}.',
        },
      },
      acceptAll: 'Accept all',
      declineAll: 'Necessary only',
      acceptSelected: 'Save selection',
      close: 'Close',
      poweredBy: 'Managed with Klaro',
      purposes: {
        security: 'Security and troubleshooting',
        booking: 'Appointment booking',
        media: 'Video and media',
      },
      sentry: {
        title: 'Sentry (error monitoring)',
        description:
          'Sentry captures technical errors so we can keep the website stable. Processing on EU servers (ingest.de.sentry.io). Provider: Functional Software Inc., San Francisco, USA.',
      },
      booking: {
        title: 'Appointment booking',
        description:
          'Our booking form loads available slots from our servers (Supabase) and, after you confirm, creates a Google Calendar event. Provider for calendar sync: Google Ireland Limited / Google LLC.',
      },
      wistia: {
        title: 'Wistia (video player)',
        description:
          'Wistia hosts and plays the sales video. Loading the player sends your IP address to Wistia. The video loads only after you click play or enable Wistia in the privacy settings. Provider: Wistia, Inc., USA.',
      },
    },
  },

  services: [
    {
      name: 'sentry',
      title: 'Sentry (Fehlerüberwachung)',
      description:
        'Sentry erfasst technische Fehler, damit wir die Stabilität der Website sicherstellen können. Verarbeitung auf EU-Servern (ingest.de.sentry.io). Anbieter: Functional Software Inc., San Francisco, USA.',
      purposes: ['security'],
      required: false,
      optOut: false,
    },
    /* Eigene Buchungsmaske (scripts/rais-booking.js). Lädt erst nach
       CTA bzw. Gate-Einwilligung. Kein Dritt-iframe. */
    {
      name: 'booking',
      title: 'Terminbuchung (RAIS)',
      description:
        'Unsere Buchungsmaske lädt freie Termine von unseren Servern (Supabase) und legt nach Bestätigung einen Eintrag in Google Calendar an. Anbieter Kalender-Sync: Google Ireland Limited / Google LLC. Es wird kein Cal.com-Embed geladen.',
      purposes: ['booking'],
      required: false,
      optOut: false,
    },
    /* VSL im Hero: Embed erst nach Play-Klick / Klaro-Consent,
       siehe scripts/vsl-player.js. Kein Autoload beim Seitenaufruf. */
    {
      name: 'wistia',
      title: 'Wistia (Video-Player)',
      description:
        'Wistia hostet und spielt das Verkaufsvideo ab. Beim Laden des Players wird Ihre IP-Adresse an Wistia übertragen. Das Video lädt erst, wenn Sie auf Abspielen klicken oder Wistia in den Datenschutzeinstellungen aktivieren. Anbieter: Wistia, Inc., USA.',
      purposes: ['media'],
      required: false,
      optOut: false,
    },
  ],
};

/* Kleiner Wiedereinstieg, nachdem das Banner weg ist.
   „Nur notwendige“ darf die spätere Buchung nicht sperren;
   die Einstellungen bleiben über diesen Button erreichbar. */
(function () {
  function openSettings() {
    try {
      if (window.klaro && typeof window.klaro.show === 'function') {
        window.klaro.show(undefined, true);
      }
    } catch (e) { /* Klaro blockiert */ }
  }

  function mountButton() {
    if (document.getElementById('klaro-reopen')) return;
    var btn = document.createElement('button');
    btn.id = 'klaro-reopen';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Datenschutzeinstellungen');
    btn.textContent = 'Datenschutz';
    btn.addEventListener('click', openSettings);
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountButton);
  } else {
    mountButton();
  }
}());
