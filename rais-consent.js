/* ============================================================
   RAIS Consent Manager v1.0
   DSGVO / TTDSG § 25 / Planet49 / Google Consent Mode v2
   Standalone vanilla JS — no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
     CONFIGURATION
     Replace placeholder IDs with real values:
     GA4:    analytics.google.com → Admin → Data Streams → Web stream details
     Hotjar: hotjar.com → Settings → Sites & Organizations
  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */
  var CONSENT_VERSION = '1';

  /* Supabase consent-log endpoint.
     After deploying the edge function run:
       supabase functions deploy consent-log
     then update this URL with your project ref. */
  var CONSENT_LOG_URL = 'https://qihysrywltmtifqvptpq.supabase.co/functions/v1/consent-log';

  var SERVICES = [
    {
      id: 'google-analytics',
      name: 'Google Analytics (GA4)',
      category: 'statistiken',
      provider: 'google',
      providerName: 'Google Ireland Limited',
      providerAddress: 'Gordon House, Barrow Street, Dublin 4, Irland',
      purpose: 'Webanalyse und Nutzerverhaltensanalyse — hilft uns zu verstehen, wie Besucher unsere Website nutzen.',
      legalBasis: 'Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG',
      dataTransferUSA: true,
      dataTransferBasis: 'EU-Standardvertragsklauseln (SCCs)',
      privacyUrl: 'https://policies.google.com/privacy?hl=de',
      optOutUrl: 'https://tools.google.com/dlpage/gaoptout?hl=de',
      cookies: [
        { name: '_ga',   duration: '2 Jahre',    purpose: 'Unterscheidung von Nutzern', type: 'HTTP Cookie' },
        { name: '_ga_*', duration: '2 Jahre',    purpose: 'Speicherung des Sitzungsstatus', type: 'HTTP Cookie' },
        { name: '_gid',  duration: '24 Stunden', purpose: 'Unterscheidung von Nutzern', type: 'HTTP Cookie' }
      ]
    },
    {
      id: 'hotjar',
      name: 'Hotjar',
      category: 'statistiken',
      provider: 'hotjar',
      providerName: 'Hotjar Ltd.',
      providerAddress: 'Dragonara Business Centre, 5th Floor, Dragonara Road, Paceville St Julian\'s STJ 3141, Malta',
      purpose: 'Analyse des Nutzerverhaltens mittels Heatmaps und Session-Recordings.',
      legalBasis: 'Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG',
      dataTransferUSA: false,
      privacyUrl: 'https://www.hotjar.com/legal/policies/privacy/',
      optOutUrl: 'https://www.hotjar.com/legal/compliance/opt-out',
      cookies: [
        { name: '_hjid',             duration: '365 Tage',  purpose: 'Eindeutige Benutzer-ID', type: 'HTTP Cookie' },
        { name: '_hjSessionUser_*',  duration: '365 Tage',  purpose: 'Sitzungsnutzer-ID', type: 'HTTP Cookie' },
        { name: '_hjSession_*',      duration: '30 Minuten', purpose: 'Aktuelle Sitzungs-ID', type: 'HTTP Cookie' }
      ]
    }
  ];

  var ESSENTIAL_SERVICES = [
    {
      id: 'rais-consent',
      name: 'RAIS Consent (Einwilligungsverwaltung)',
      category: 'essenziell',
      provider: 'own',
      providerName: 'Eigentümer dieser Website',
      purpose: 'Speichert Ihre Cookie-Einwilligungen und dokumentiert diese gemäß Art. 7 Abs. 1 DSGVO.',
      cookies: [
        { name: 'rais_consent', duration: '365 Tage', purpose: 'Speicherung der Cookie-Einwilligung inkl. UID und Zeitstempel', type: 'HTTP Cookie' }
      ]
    }
  ];

  /* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
     CONSENT STORE — cookie read / write / UID
  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */
  var Store = {
    COOKIE_NAME: 'rais_consent',
    COOKIE_DAYS: 365,

    generateUID: function () {
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      function block(len) {
        var s = '';
        for (var i = 0; i < len; i++) {
          s += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return s;
      }
      return block(8) + '-' + block(8) + '-' + block(8) + '-' + block(8);
    },

    read: function () {
      var name = this.COOKIE_NAME + '=';
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i].trim();
        if (c.indexOf(name) === 0) {
          try {
            return JSON.parse(decodeURIComponent(c.substring(name.length)));
          } catch (e) {
            return null;
          }
        }
      }
      return null;
    },

    write: function (state) {
      var exp = new Date();
      exp.setTime(exp.getTime() + this.COOKIE_DAYS * 24 * 60 * 60 * 1000);
      var value = encodeURIComponent(JSON.stringify(state));
      var secure = location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = this.COOKIE_NAME + '=' + value +
        '; expires=' + exp.toUTCString() +
        '; path=/' +
        '; SameSite=Lax' +
        secure;
    },

    buildState: function (categories, action, existing) {
      var uid = (existing && existing.uid) ? existing.uid : this.generateUID();
      var history = (existing && existing.history) ? existing.history.slice() : [];
      var now = new Date().toISOString();

      history.push({
        timestamp: now,
        action: action,
        categories: JSON.parse(JSON.stringify(categories))
      });

      var services = {};
      SERVICES.forEach(function (s) {
        services[s.id] = categories[s.category] === true;
      });
      ESSENTIAL_SERVICES.forEach(function (s) {
        services[s.id] = true;
      });

      return {
        uid: uid,
        version: CONSENT_VERSION,
        timestamp: now,
        categories: categories,
        services: services,
        history: history
      };
    },

    deleteConsentCookie: function () {
      document.cookie = this.COOKIE_NAME + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
    },

    /* Delete cookies set by revoked services */
    deleteServiceCookies: function (revokedCategories) {
      var toDelete = [];
      SERVICES.forEach(function (s) {
        if (revokedCategories.indexOf(s.category) !== -1) {
          s.cookies.forEach(function (c) {
            toDelete.push(c.name);
          });
        }
      });
      toDelete.forEach(function (name) {
        /* Handle wildcard names like _ga_* */
        var base = name.replace('*', '');
        var all = document.cookie.split(';');
        all.forEach(function (c) {
          var cookieName = c.trim().split('=')[0];
          if (cookieName === base || (name.indexOf('*') !== -1 && cookieName.indexOf(base) === 0)) {
            document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
            /* Also try with domain */
            document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname + '; SameSite=Lax';
          }
        });
      });
    }
  };

  /* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
     GOOGLE CONSENT MODE v2
     Default must fire BEFORE gtag.js loads (set in index.html <head>).
     This module handles the update call after user gives consent.
  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */
  var ConsentMode = {
    update: function (categories) {
      if (typeof window.gtag !== 'function') return;
      window.gtag('consent', 'update', {
        ad_storage:           'denied',
        ad_user_data:         'denied',
        ad_personalization:   'denied',
        analytics_storage:    categories.statistiken ? 'granted' : 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
        security_storage:     'granted'
      });
    }
  };

  /* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
     CONSENT LOADER — injects third-party scripts
  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */
  var Loader = {
    _loaded: {},

    loadStatistiken: function () {
      if (this._loaded.statistiken) return;
      this._loaded.statistiken = true;

      /* ── Google Analytics 4 ── */
      var GA_ID = 'G-XV9M848G0Z';
      var gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(gaScript);

      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== 'function') {
        window.gtag = function () { window.dataLayer.push(arguments); };
      }
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, { anonymize_ip: true });

      /* ── Hotjar ──
         Replace 000000 with your Hotjar Site ID */
      var HJ_ID = '000000';
      (function (h, o, t, j, a, r) {
        h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
        h._hjSettings = { hjid: HJ_ID, hjsv: 6 };
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script');
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    },

    apply: function (categories) {
      if (categories.statistiken) this.loadStatistiken();
    }
  };

  /* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
     SERVER-SIDE CONSENT LOGGING
     Posts to Supabase edge function for Art. 7 DSGVO proof.
  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */
  function logConsent(state, action) {
    if (!CONSENT_LOG_URL || CONSENT_LOG_URL.indexOf('<YOUR_PROJECT_REF>') !== -1) return;
    try {
      navigator.sendBeacon(CONSENT_LOG_URL, JSON.stringify({
        uid:        state.uid,
        timestamp:  state.timestamp,
        version:    state.version,
        categories: state.categories,
        action:     action,
        user_agent: navigator.userAgent
      }));
    } catch (e) {
      /* Silent fail — client-side history in cookie is fallback */
    }
  }

  /* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
     UI HELPERS
  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function cookieTableHTML(cookies) {
    if (!cookies || !cookies.length) return '';
    var rows = cookies.map(function (c) {
      return '<tr>' +
        '<td>' + esc(c.name) + '</td>' +
        '<td>' + esc(c.duration) + '</td>' +
        '<td>' + esc(c.purpose) + '</td>' +
        '<td>' + esc(c.type || 'HTTP Cookie') + '</td>' +
        '</tr>';
    }).join('');
    return '<div class="rcc-cookie-table-wrap">' +
      '<table class="rcc-cookie-table">' +
      '<thead><tr>' +
      '<th>Name</th><th>Laufzeit</th><th>Zweck</th><th>Typ</th>' +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table></div>';
  }

  /* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
     FOCUS TRAP
  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */
  function trapFocus(el) {
    var focusable = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return function () {};
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    function handler(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }
    el.addEventListener('keydown', handler);
    first.focus();
    return function () { el.removeEventListener('keydown', handler); };
  }

  /* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
     UI — MAIN CONSENT MANAGER
  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */
  var UI = {
    _container: null,
    _backdrop:  null,
    _releaseFocus: null,

    init: function () {
      this._injectTrigger();
    },

    /* Check if banner should be shown */
    shouldShowBanner: function () {
      var state = Store.read();
      if (!state) return true;
      if (state.version !== CONSENT_VERSION) return true;
      return false;
    },

    open: function () {
      if (this._container) return;
      document.body.style.overflow = 'hidden';

      this._container = document.createElement('div');
      this._container.className = 'rcc-modal rcc-root';
      this._container.setAttribute('role', 'dialog');
      this._container.setAttribute('aria-modal', 'true');
      this._container.setAttribute('aria-label', 'Cookie Einstellungen');
      this._container.setAttribute('lang', 'de');
      this._container.innerHTML = this._firstLayerHTML(Store.read());
      document.body.appendChild(this._container);

      this._bindFirstLayer();
      this._releaseFocus = trapFocus(this._container);
    },

    close: function () {
      if (!this._container) return;
      if (this._releaseFocus) { this._releaseFocus(); this._releaseFocus = null; }
      this._container.remove();
      this._container = null;
      document.body.style.overflow = '';
    },

    /* ── First layer HTML ── */
    _firstLayerHTML: function (existingState) {
      var statsChecked = existingState && existingState.categories && existingState.categories.statistiken;
      return '<div class="rcc-panel">' +
        '<div class="rcc-panel-inner">' +
        '<div class="rcc-header-label">[ Cookie Protokoll ]</div>' +
        '<h2 class="rcc-title">Cookie Einstellungen</h2>' +
        '<hr class="rcc-divider">' +
        '<p class="rcc-intro">' +
          'Wir benötigen Ihre Zustimmung, bevor Sie unsere Website weiter besuchen können. ' +
          'Wir verwenden Cookies und andere Technologien auf unserer Website. Einige von ihnen sind ' +
          'essenziell, während andere uns helfen, diese Website und Ihre Erfahrung zu verbessern. ' +
          'Personenbezogene Daten können verarbeitet werden (z.&nbsp;B. IP-Adressen), z.&nbsp;B. für ' +
          'personalisierte Anzeigen und Inhaltsmessung. Weitere Informationen finden Sie in unserer ' +
          '<a href="datenschutz.html" target="_blank" rel="noopener">Datenschutzerklärung</a>. ' +
          'Sie können Ihre Auswahl jederzeit unter ' +
          '<button class="rcc-btn-text" id="rcc-open-settings-inline" style="display:inline;padding:0;font-size:inherit;text-decoration:underline;vertical-align:baseline;">Einstellungen</button>' +
          ' widerrufen oder anpassen.' +
        '</p>' +
        '<div class="rcc-categories">' +
          '<label class="rcc-category-item rcc-disabled">' +
            '<input type="checkbox" checked disabled aria-label="Essenziell (immer aktiv)"> Essenziell' +
          '</label>' +
          '<label class="rcc-category-item">' +
            '<input type="checkbox" id="rcc-cat-statistiken"' + (statsChecked ? ' checked' : '') + ' aria-label="Statistiken Cookies aktivieren"> Statistiken' +
          '</label>' +
        '</div>' +
        '<div class="rcc-btn-group">' +
          '<button class="rcc-btn rcc-btn-primary" id="rcc-save">Speichern</button>' +
          '<button class="rcc-btn rcc-btn-primary" id="rcc-accept-all">Alle akzeptieren</button>' +
          '<button class="rcc-btn rcc-btn-text" id="rcc-open-settings">Individuelle Datenschutzeinstellungen</button>' +
        '</div>' +
        '<hr class="rcc-divider">' +
        '<div class="rcc-footer-links">' +
          '<a href="datenschutz.html" target="_blank" rel="noopener">Datenschutzerklärung</a>' +
          '<a href="impressum.html" target="_blank" rel="noopener">Impressum</a>' +
        '</div>' +
        '</div></div>';
    },

    _bindFirstLayer: function () {
      var self = this;

      document.getElementById('rcc-save').addEventListener('click', function () {
        var stats = document.getElementById('rcc-cat-statistiken').checked;
        self._saveConsent({ essenziell: true, statistiken: stats });
      });

      document.getElementById('rcc-accept-all').addEventListener('click', function () {
        self._saveConsent({ essenziell: true, statistiken: true });
      });

      document.getElementById('rcc-open-settings').addEventListener('click', function () {
        self._switchToSettings();
      });

      var inline = document.getElementById('rcc-open-settings-inline');
      if (inline) {
        inline.addEventListener('click', function () { self._switchToSettings(); });
      }

      /* Escape key closes with current selection preserved */
      document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', handler);
          /* Only close if user already has a stored consent — don't allow bypassing banner */
          if (Store.read()) self.close();
        }
      });
    },

    _saveConsent: function (categories, action) {
      var existing = Store.read();
      var isChange = existing && JSON.stringify(existing.categories) !== JSON.stringify(categories);
      var act = action || (existing ? (isChange ? 'update' : 'no_change') : 'initial_save');

      /* Determine revoked categories for cookie cleanup */
      if (existing && existing.categories) {
        var revoked = [];
        Object.keys(existing.categories).forEach(function (cat) {
          if (existing.categories[cat] && !categories[cat]) revoked.push(cat);
        });
        if (revoked.length) Store.deleteServiceCookies(revoked);
      }

      var state = Store.buildState(categories, act, existing);
      Store.write(state);
      logConsent(state, act);
      ConsentMode.update(categories);
      Loader.apply(categories);
      this.close();
    },

    /* ── Switch to second layer (settings) ── */
    _switchToSettings: function () {
      var panel = this._container.querySelector('.rcc-panel');
      var state = Store.read();
      panel.querySelector('.rcc-panel-inner').innerHTML = this._settingsHTML(state);
      this._bindSettings(state);
      if (this._releaseFocus) { this._releaseFocus(); }
      this._releaseFocus = trapFocus(this._container);
    },

    /* ── Second layer HTML ── */
    _settingsHTML: function (state) {
      var cats = (state && state.categories) || {};

      /* Tab 1: Service-Gruppen */
      var allCookies = ESSENTIAL_SERVICES[0].cookies.concat(
        SERVICES.filter(function (s) { return s.category === 'statistiken'; })
          .reduce(function (acc, s) { return acc.concat(s.cookies); }, [])
      );

      var tab1 = '' +
        /* Essenziell */
        '<div class="rcc-cat-section">' +
          '<div class="rcc-cat-header">' +
            '<label class="rcc-category-item rcc-disabled" style="flex:1;">' +
              '<input type="checkbox" checked disabled> Essenziell' +
            '</label>' +
            '<button class="rcc-expand-btn" data-target="rcc-expand-essenziell">▸ Cookie-Info</button>' +
          '</div>' +
          '<p class="rcc-cat-desc">Essenzielle Cookies ermöglichen grundlegende Funktionen und sind für die einwandfreie Funktion der Website erforderlich.</p>' +
          '<div id="rcc-expand-essenziell" style="display:none;">' +
            cookieTableHTML(ESSENTIAL_SERVICES[0].cookies) +
          '</div>' +
        '</div>' +
        /* Statistiken */
        '<div class="rcc-cat-section">' +
          '<div class="rcc-cat-header">' +
            '<label class="rcc-category-item" style="flex:1;">' +
              '<input type="checkbox" id="rcc-s2-statistiken"' + (cats.statistiken ? ' checked' : '') + ' aria-label="Statistiken aktivieren"> Statistiken' +
            '</label>' +
            '<button class="rcc-expand-btn" data-target="rcc-expand-statistiken">▸ Cookie-Info</button>' +
          '</div>' +
          '<p class="rcc-cat-desc">Statistik Cookies erfassen Informationen anonym. Diese Informationen helfen uns zu verstehen, wie unsere Besucher unsere Website nutzen.</p>' +
          '<div id="rcc-expand-statistiken" style="display:none;">' +
            cookieTableHTML(
              SERVICES.filter(function (s) { return s.category === 'statistiken'; })
                .reduce(function (acc, s) { return acc.concat(s.cookies); }, [])
            ) +
          '</div>' +
        '</div>';

      /* Tab 2: Services */
      var tab2 = ESSENTIAL_SERVICES.map(function (s) {
        return '<div class="rcc-service-item">' +
          '<div><div class="rcc-service-name">' + esc(s.name) + '</div>' +
          '<div class="rcc-service-cat">Essenziell</div></div>' +
          '<label class="rcc-toggle">' +
            '<input type="checkbox" checked disabled aria-label="' + esc(s.name) + ' ist immer aktiv">' +
            '<span class="rcc-toggle-label">An</span>' +
          '</label>' +
        '</div>';
      }).join('') +
      SERVICES.map(function (s) {
        var checked = cats[s.category] ? ' checked' : '';
        return '<div class="rcc-service-item">' +
          '<div><div class="rcc-service-name">' + esc(s.name) + '</div>' +
          '<div class="rcc-service-cat">Statistiken</div></div>' +
          '<label class="rcc-toggle">' +
            '<input type="checkbox" class="rcc-svc-toggle" data-service="' + esc(s.id) + '" data-category="' + esc(s.category) + '"' + checked + ' aria-label="' + esc(s.name) + ' Cookie aktivieren/deaktivieren">' +
            '<span class="rcc-toggle-label">' + (cats[s.category] ? 'An' : 'Aus') + '</span>' +
          '</label>' +
        '</div>';
      }).join('');

      /* Tab 3: Provider */
      var ownCookies = ESSENTIAL_SERVICES[0].cookies;
      var googleServices = SERVICES.filter(function (s) { return s.provider === 'google'; });
      var hotjarServices = SERVICES.filter(function (s) { return s.provider === 'hotjar'; });

      var tab3 = '<div class="rcc-provider-search-wrap">' +
        '<input type="text" class="rcc-provider-search" id="rcc-provider-search" placeholder="Provider suchen...">' +
        '<div class="rcc-provider-count" id="rcc-provider-count">3 Provider</div>' +
        '</div>' +
        /* Own */
        '<div class="rcc-provider-item" data-provider-name="Eigentümer dieser Website">' +
          '<div class="rcc-provider-header">' +
            '<div class="rcc-provider-name">Eigentümer dieser Website</div>' +
            '<button class="rcc-expand-btn" data-target="rcc-prov-own">▸ Cookie-Info</button>' +
          '</div>' +
          '<div id="rcc-prov-own" style="display:none;" class="rcc-provider-body">' +
            '<p>Kevin Ritz / Ritz AI Solutions (RAIS) ist verantwortlich für den Inhalt dieser Website und die Verarbeitung Ihrer Daten.</p>' +
            cookieTableHTML(ownCookies) +
          '</div>' +
        '</div>' +
        /* Google */
        '<div class="rcc-provider-item" data-provider-name="Google Ireland Limited">' +
          '<div class="rcc-provider-header">' +
            '<div class="rcc-provider-name">Google Ireland Limited</div>' +
            '<button class="rcc-expand-btn" data-target="rcc-prov-google">▸ Cookie-Info</button>' +
          '</div>' +
          '<div id="rcc-prov-google" style="display:none;" class="rcc-provider-body">' +
            '<p>Gordon House, Barrow Street, Dublin 4, Irland. Datenübertragung in die USA möglich (EU-Standardvertragsklauseln). ' +
            '<a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener" style="color:var(--rcc-orange-bright);">Datenschutzerklärung</a></p>' +
            cookieTableHTML(googleServices.reduce(function (acc, s) { return acc.concat(s.cookies); }, [])) +
          '</div>' +
        '</div>' +
        /* Hotjar */
        '<div class="rcc-provider-item" data-provider-name="Hotjar Ltd.">' +
          '<div class="rcc-provider-header">' +
            '<div class="rcc-provider-name">Hotjar Ltd.</div>' +
            '<button class="rcc-expand-btn" data-target="rcc-prov-hotjar">▸ Cookie-Info</button>' +
          '</div>' +
          '<div id="rcc-prov-hotjar" style="display:none;" class="rcc-provider-body">' +
            '<p>Dragonara Business Centre, St Julian\'s, Malta. ' +
            '<a href="https://www.hotjar.com/legal/policies/privacy/" target="_blank" rel="noopener" style="color:var(--rcc-orange-bright);">Datenschutzerklärung</a></p>' +
            cookieTableHTML(hotjarServices.reduce(function (acc, s) { return acc.concat(s.cookies); }, [])) +
          '</div>' +
        '</div>';

      /* Tab 4: History */
      var tab4;
      if (state && state.history && state.history.length) {
        var rows = state.history.slice().reverse().map(function (h) {
          var catList = Object.keys(h.categories).filter(function (k) { return h.categories[k]; }).join(', ');
          var actionMap = { initial_save: 'Ersteinwilligung', update: 'Aktualisierung', no_change: 'Keine Änderung' };
          return '<tr>' +
            '<td>' + new Date(h.timestamp).toLocaleString('de-DE') + '</td>' +
            '<td>' + esc(catList) + '</td>' +
            '<td>' + esc(actionMap[h.action] || h.action) + '</td>' +
            '<td>' + esc(state.version) + '</td>' +
            '</tr>';
        }).join('');
        tab4 = '<table class="rcc-history-table"><thead><tr>' +
          '<th>Datum</th><th>Einwilligungen</th><th>Änderung</th><th>Version</th>' +
          '</tr></thead><tbody>' + rows + '</tbody></table>' +
          '<div class="rcc-uid-display">UID: <span>' + esc(state.uid) + '</span></div>';
      } else {
        tab4 = '<div class="rcc-history-empty">Keine Einwilligungsdaten</div>';
      }

      return '' +
        '<div class="rcc-settings-header">' +
          '<button class="rcc-back-btn" id="rcc-back">&#8592; Zurück</button>' +
          '<div class="rcc-settings-title">Cookie Einstellungen</div>' +
          '<div class="rcc-settings-header-links">' +
            '<a href="datenschutz.html" target="_blank" rel="noopener">Datenschutz</a>' +
            '<a href="impressum.html" target="_blank" rel="noopener">Impressum</a>' +
          '</div>' +
        '</div>' +
        '<p class="rcc-settings-intro">Hier finden Sie eine Übersicht über alle verwendeten Cookies. Sie können Ihre Einwilligung zu ganzen Kategorien geben oder nur bestimmte Cookies auswählen.</p>' +
        '<div class="rcc-tabs">' +
          '<button class="rcc-tab-btn rcc-tab-active" data-tab="rcc-tab1">Service-Gruppen</button>' +
          '<button class="rcc-tab-btn" data-tab="rcc-tab2">Services</button>' +
          '<button class="rcc-tab-btn" data-tab="rcc-tab3">Provider</button>' +
          '<button class="rcc-tab-btn" data-tab="rcc-tab4">Einwilligung-Historie</button>' +
        '</div>' +
        '<div id="rcc-tab1" class="rcc-tab-panel rcc-tab-active">' + tab1 + '</div>' +
        '<div id="rcc-tab2" class="rcc-tab-panel">'               + tab2 + '</div>' +
        '<div id="rcc-tab3" class="rcc-tab-panel">'               + tab3 + '</div>' +
        '<div id="rcc-tab4" class="rcc-tab-panel">'               + tab4 + '</div>' +
        '<div class="rcc-settings-btn-row">' +
          '<button class="rcc-btn rcc-btn-primary" id="rcc-settings-save">Speichern</button>' +
          '<button class="rcc-btn rcc-btn-primary" id="rcc-settings-accept-all">Alle akzeptieren</button>' +
        '</div>';
    },

    _bindSettings: function (state) {
      var self = this;

      /* Back button */
      document.getElementById('rcc-back').addEventListener('click', function () {
        var panel = self._container.querySelector('.rcc-panel');
        panel.querySelector('.rcc-panel-inner').innerHTML = self._firstLayerHTML(Store.read());
        self._bindFirstLayer();
        if (self._releaseFocus) self._releaseFocus();
        self._releaseFocus = trapFocus(self._container);
      });

      /* Tabs */
      var tabBtns = self._container.querySelectorAll('.rcc-tab-btn');
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          tabBtns.forEach(function (b) { b.classList.remove('rcc-tab-active'); });
          self._container.querySelectorAll('.rcc-tab-panel').forEach(function (p) { p.classList.remove('rcc-tab-active'); });
          btn.classList.add('rcc-tab-active');
          document.getElementById(btn.dataset.tab).classList.add('rcc-tab-active');
        });
      });

      /* Expand buttons */
      self._container.querySelectorAll('.rcc-expand-btn[data-target]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = document.getElementById(btn.dataset.target);
          if (!target) return;
          var open = target.style.display !== 'none';
          target.style.display = open ? 'none' : 'block';
          btn.textContent = (open ? '▸' : '▾') + ' Cookie-Info';
        });
      });

      /* Service toggles — sync categories */
      self._container.querySelectorAll('.rcc-svc-toggle').forEach(function (tog) {
        tog.addEventListener('change', function () {
          var label = tog.parentElement.querySelector('.rcc-toggle-label');
          if (label) label.textContent = tog.checked ? 'An' : 'Aus';
          /* Sync category checkbox in tab 1 */
          var cat = tog.dataset.category;
          var catChk = document.getElementById('rcc-s2-' + cat);
          if (catChk) {
            /* Check if ALL services in this category are on */
            var allOn = true;
            self._container.querySelectorAll('.rcc-svc-toggle[data-category="' + cat + '"]').forEach(function (t) {
              if (!t.checked) allOn = false;
            });
            catChk.checked = allOn;
          }
        });
      });

      /* Category checkbox (tab 1) — sync service toggles */
      var statsCat = document.getElementById('rcc-s2-statistiken');
      if (statsCat) {
        statsCat.addEventListener('change', function () {
          self._container.querySelectorAll('.rcc-svc-toggle[data-category="statistiken"]').forEach(function (t) {
            t.checked = statsCat.checked;
            var label = t.parentElement.querySelector('.rcc-toggle-label');
            if (label) label.textContent = statsCat.checked ? 'An' : 'Aus';
          });
        });
      }

      /* Provider search */
      var searchInput = document.getElementById('rcc-provider-search');
      if (searchInput) {
        searchInput.addEventListener('input', function () {
          var q = searchInput.value.toLowerCase();
          var items = self._container.querySelectorAll('.rcc-provider-item');
          var visible = 0;
          items.forEach(function (item) {
            var name = (item.dataset.providerName || '').toLowerCase();
            var show = !q || name.indexOf(q) !== -1;
            item.style.display = show ? '' : 'none';
            if (show) visible++;
          });
          var count = document.getElementById('rcc-provider-count');
          if (count) count.textContent = visible + ' Provider';
        });
      }

      /* Save / Accept all */
      document.getElementById('rcc-settings-save').addEventListener('click', function () {
        var cats = self._collectSettingsCategories();
        self._saveConsent(cats);
      });

      document.getElementById('rcc-settings-accept-all').addEventListener('click', function () {
        self._saveConsent({ essenziell: true, statistiken: true });
      });
    },

    _collectSettingsCategories: function () {
      var statsChk = document.getElementById('rcc-s2-statistiken');
      /* Also check if any individual service toggle is on */
      var anyStatOn = false;
      this._container.querySelectorAll('.rcc-svc-toggle[data-category="statistiken"]').forEach(function (t) {
        if (t.checked) anyStatOn = true;
      });
      return {
        essenziell: true,
        statistiken: (statsChk && statsChk.checked) || anyStatOn
      };
    },

    /* ── Persistent trigger button (floating bottom-left) ── */
    _injectTrigger: function () {
      var self = this;
      var btn = document.createElement('button');
      btn.className = 'rcc-trigger rcc-root';
      btn.setAttribute('aria-label', 'Cookie Einstellungen öffnen');
      btn.setAttribute('title', 'Cookie Einstellungen');
      btn.innerHTML = '&#127850;'; /* Cookie emoji */
      btn.addEventListener('click', function () { self.open(); });
      document.body.appendChild(btn);
    }
  };

  /* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
     INIT — runs on DOMContentLoaded
  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */
  function init() {
    /* Always inject the persistent trigger */
    UI.init();

    var state = Store.read();

    if (!state || state.version !== CONSENT_VERSION) {
      /* First visit or version changed — show banner */
      UI.open();
    } else {
      /* Returning visitor — apply stored consent silently */
      ConsentMode.update(state.categories);
      Loader.apply(state.categories);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
