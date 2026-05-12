/* ─────────────────────────────────────────────────────
   KLARO: Design-Overrides (RAIS Farben)
───────────────────────────────────────────────────── */
(function () {
  var s = document.createElement('style');
  s.textContent = [
    /* Banner (unterer Streifen) */
    '.klaro .cookie-notice { background: #FBF8F3 !important; color: #2F2A24 !important; border-top: 2px solid #EC6A37 !important; font-family: Inter, sans-serif !important; }',
    /* Modal */
    '.klaro .cookie-modal .cm-modal { background: #FBF8F3 !important; color: #2F2A24 !important; font-family: Inter, sans-serif !important; border-radius: 1rem !important; }',
    '.klaro .cookie-modal .cm-header { border-bottom: 1px solid #D9D1C7 !important; }',
    '.klaro .cookie-modal .cm-footer { border-top: 1px solid #D9D1C7 !important; }',
    '.klaro .cookie-modal .cm-header h1 { font-size: 1.1rem !important; }',
    /* Buttons — Akzeptieren */
    '.klaro .cm-btn-success { background: #EC6A37 !important; border-color: #EC6A37 !important; border-radius: 0.5rem !important; }',
    '.klaro .cm-btn-success:hover { background: #F37A48 !important; border-color: #F37A48 !important; }',
    /* Buttons — Ablehnen / Neutral */
    '.klaro .cm-btn-decline, .klaro .cm-btn-info { background: transparent !important; border: 1px solid #D9D1C7 !important; color: #7B746B !important; border-radius: 0.5rem !important; }',
    '.klaro .cm-btn-decline:hover, .klaro .cm-btn-info:hover { border-color: #2F2A24 !important; color: #2F2A24 !important; }',
    /* Toggle-Slider */
    '.klaro .switch input:checked + .slider { background-color: #EC6A37 !important; }',
    /* Links */
    '.klaro a { color: #EC6A37 !important; }',
    /* Service-Namen */
    '.klaro .cm-services .cm-service .cm-service-title { color: #2F2A24 !important; font-weight: 600 !important; }',
    /* Kategorie-Labels */
    '.klaro .cm-purpose .cm-purpose-title { color: #3C5A2A !important; font-weight: 700 !important; text-transform: uppercase !important; font-size: 0.75rem !important; letter-spacing: 0.05em !important; }',
  ].join('\n');
  document.head.appendChild(s);
})();


/* ─────────────────────────────────────────────────────
   SUPABASE: Consent-Logging
───────────────────────────────────────────────────── */
(function () {
  var SUPABASE_URL = 'https://qdywaenmojdxhfxqbvun.supabase.co';
  var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeXdhZW5tb2pkeGhmeHFidnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDYwMTYsImV4cCI6MjA5MDk4MjAxNn0.rfIzS2eY3yZCvap0pKdB7V-AfKmnvQLx_QLaFEi1gts';

  /* Unveränderliche Browser-ID (kein Personenbezug, nur zur Deduplizierung) */
  function getConsentId() {
    var key = 'rais_cid';
    var id = localStorage.getItem(key);
    if (!id) {
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      localStorage.setItem(key, id);
    }
    return id;
  }

  function sendConsent(decisions) {
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

  /* localStorage.setItem abfangen: Klaro schreibt unter dem Key 'klaro' */
  var _origSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    _origSetItem(key, value);
    if (key === 'klaro') {
      try { sendConsent(JSON.parse(value)); } catch (e) { /* ignore */ }
    }
  };
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
  mustConsent: false,
  acceptAll: true,
  hideDeclineAll: false,
  privacyPolicy: '/datenschutz.html',

  translations: {
    de: {
      consentNotice: {
        description:
          'Wir nutzen Cookies und ähnliche Technologien. Einige sind technisch notwendig, andere helfen uns beim Erkennen von Fehlern oder – mit deiner Einwilligung – bei Analyse und Marketing.',
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
        functional: 'Funktional',
        analytics: 'Analyse',
        marketing: 'Marketing & Werbung',
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
    {
      name: 'calendly',
      title: 'Calendly (Terminbuchung)',
      description:
        'Ermöglicht Online-Terminbuchungen. Das Widget wird erst nach aktiver Nutzerinteraktion geladen — nicht beim bloßen Seitenaufruf.',
      purposes: ['functional'],
      required: false,
      optOut: false,
    },
    {
      name: 'google-analytics',
      title: 'Google Analytics (GA4)',
      description:
        'Analysiert das Nutzungsverhalten auf dieser Website. Daten werden an Google-Server übertragen, ggf. in die USA. Anbieter: Google Ireland Ltd., Dublin.',
      purposes: ['analytics'],
      required: false,
      optOut: false,
      cookies: [/^_ga/, /^_gid/, /^_gat/],
    },
    {
      name: 'meta-pixel',
      title: 'Meta Pixel (Facebook/Instagram)',
      description:
        'Misst die Wirksamkeit von Werbeanzeigen auf Facebook und Instagram. Anbieter: Meta Platforms Ireland Ltd., Dublin.',
      purposes: ['marketing'],
      required: false,
      optOut: false,
      cookies: ['_fbp', '_fbc'],
    },
  ],
};
