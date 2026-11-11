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
          'Wir nutzen Cookies und ähnliche Technologien. Einige sind technisch notwendig, andere helfen uns – mit deiner Einwilligung – bei der Terminbuchung, bei Videos und bei der Werbemessung (Meta Pixel) auf dieser Website.',
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
        booking: 'Terminbuchung',
        media: 'Video & Medien',
        marketing: 'Marketing & Werbemessung',
      },
    },
    en: {
      consentNotice: {
        description:
          'We use cookies and similar technologies. Some are technically required, others help us, with your consent, with appointment booking, videos and ad measurement (Meta Pixel) on this website.',
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
        booking: 'Appointment booking',
        media: 'Video and media',
        marketing: 'Marketing and ad measurement',
      },
      'meta-pixel': {
        title: 'Meta Pixel (ad measurement)',
        description:
          'The Meta Pixel measures the effectiveness of our Facebook and Instagram ads and lets us show ads to relevant audiences. It loads only after you consent and transmits your IP address, browser data and the pages you view to Meta. Provider: Meta Platforms Ireland Limited, Dublin, Ireland (data may be transferred to Meta Platforms, Inc., USA).',
      },
      cal: {
        title: 'Cal.com (appointment booking)',
        description:
          'Cal.com provides the booking calendar. Loading it sends your IP address to Cal.com. You enter your booking details there. Provider: Cal.com, Inc., San Francisco, USA.',
      },
      wistia: {
        title: 'Wistia (video player)',
        description:
          'Wistia hosts and plays the sales video. Loading the player sends your IP address to Wistia. The video loads only after you click play or enable Wistia in the privacy settings. Provider: Wistia, Inc., USA.',
      },
      youtube: {
        title: 'YouTube (video player)',
        description:
          'YouTube plays the context video. Loading the player sends your IP address to Google Ireland. The video loads only after you click play or enable YouTube in the privacy settings. Provider: Google Ireland Limited, Dublin, Ireland.',
      },
    },
  },

  services: [
    /* Cal.com Embed (scripts/cal-embed.js). Lädt erst nach CTA/Gate.
       Kein Autoload beim Seitenaufruf. */
    {
      name: 'cal',
      title: 'Cal.com (Terminbuchung)',
      description:
        'Cal.com stellt den Terminkalender bereit. Beim Laden wird Ihre IP-Adresse an Cal.com übertragen, Ihre Buchungsangaben geben Sie direkt dort ein. Anbieter: Cal.com, Inc., San Francisco, USA.',
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
    /* YouTube-Kontextvideo: Embed erst nach Play-Klick / Klaro-Consent,
       siehe scripts/yt-gate.js. Kein Autoload beim Seitenaufruf. */
    {
      name: 'youtube',
      title: 'YouTube (Video-Player)',
      description:
        'YouTube spielt das Kontextvideo ab. Beim Laden des Players wird Ihre IP-Adresse an Google Ireland übertragen. Das Video lädt erst, wenn Sie auf Abspielen klicken oder YouTube in den Datenschutzeinstellungen aktivieren. Anbieter: Google Ireland Limited, Dublin, Irland.',
      purposes: ['media'],
      required: false,
      optOut: false,
    },
    /* Meta Pixel: Code kommt aus scripts/meta-pixel-klaro-bootstrap.js
       (type="text/plain", data-name="meta-pixel"). Läuft erst nach Opt-in.
       cookies: Klaro löscht _fbp/_fbc, wenn der Dienst abgelehnt/widerrufen wird. */
    {
      name: 'meta-pixel',
      title: 'Meta Pixel (Werbemessung)',
      description:
        'Der Meta Pixel misst die Wirkung unserer Facebook- und Instagram-Werbung und ermöglicht zielgruppenbasierte Anzeigen. Er lädt erst nach Ihrer Einwilligung und überträgt IP-Adresse, Browserdaten und aufgerufene Seiten an Meta. Anbieter: Meta Platforms Ireland Limited, Dublin, Irland (ggf. Übermittlung an Meta Platforms, Inc., USA).',
      purposes: ['marketing'],
      cookies: [/^_fbp$/, /^_fbc$/],
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
