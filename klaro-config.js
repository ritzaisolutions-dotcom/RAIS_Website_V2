/* Klaro design: styles/klaro-overrides.css (loaded after klaro.min.css) */

/* ─────────────────────────────────────────────────────
   SUPABASE: Consent-Logging
───────────────────────────────────────────────────── */
(function () {
  var cfg = window.RAIS_PUBLIC_CONFIG || {};
  var SUPABASE_URL = cfg.supabaseUrl || '';
  var SUPABASE_ANON = cfg.supabaseAnonKey || '';

  /* Unveränderliche Browser-ID (kein Personenbezug, nur zur Deduplizierung) */
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
  lang: 'de',
  mustConsent: true,
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
  ],
};
