/**
 * Site-wide DE/EN toggle. German remains the source language.
 * Exact-string map lives in i18n-dict.js (window.RAIS_I18N_EN).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'rais-lang';
  var ATTRS = ['aria-label', 'placeholder', 'title', 'alt', 'content'];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1, SVG: 1, TEXTAREA: 1 };

  var entityMap = {
    nbsp: '\u00A0',
    shy: '\u00AD',
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    ndash: '\u2013',
    mdash: '\u2014',
    bdquo: '\u201E',
    ldquo: '\u201C',
    rdquo: '\u201D',
    sbquo: '\u201A',
    lsquo: '\u2018',
    rsquo: '\u2019',
    auml: 'ä',
    ouml: 'ö',
    uuml: 'ü',
    Auml: 'Ä',
    Ouml: 'Ö',
    Uuml: 'Ü',
    szlig: 'ß',
    eacute: 'é',
    sect: '§'
  };

  function decodeEntities(value) {
    return String(value || '')
      .replace(/&([a-zA-Z]+);/g, function (_, name) {
        return Object.prototype.hasOwnProperty.call(entityMap, name) ? entityMap[name] : _;
      })
      .replace(/&#(\d+);/g, function (_, num) {
        return String.fromCharCode(parseInt(num, 10));
      })
      .replace(/&#x([0-9a-fA-F]+);/g, function (_, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      });
  }

  function normalize(value) {
    return decodeEntities(value)
      .replace(/\u00AD/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** EN values this short must not reverse-map (e.g. "." → "mit."). */
  function isSafeReverseKey(en) {
    var n = normalize(en);
    if (!n || n.length <= 2) return false;
    return /[A-Za-z0-9\u00C0-\u024F]/.test(n);
  }

  var deToEn = Object.create(null);
  var enToDe = Object.create(null);
  var raw = window.RAIS_I18N_EN || {};
  Object.keys(raw).forEach(function (key) {
    var de = normalize(key);
    var en = String(raw[key]);
    if (!de || de === normalize(en)) return;
    deToEn[de] = en;
    if (isSafeReverseKey(en)) enToDe[normalize(en)] = de;
  });

  var PATTERNS = [
    [/^Schritt (\d+) von (\d+)$/, 'Step $1 of $2'],
    [/^Frage (\d+) von (\d+)$/, 'Question $1 of $2'],
    [/^(\d+) Einträge gefunden\.$/, '$1 entries found.'],
    [/^Kein Eintrag passt zu [„"](.+)[“"]\. Im Erstgespräch klären wir auch Fälle, die hier nicht stehen\.$/, 'No entry matches “$1”. In the first conversation we also cover cases that are not listed here.'],
    [/^gebunden durch (.+) Vorgänge pro Woche$/, 'tied up by $1 cases per week'],
    [/^(.+) Stunden pro Monat$/, '$1 hours per month'],
    [/^(.+) Euro pro Jahr$/, '$1 euros per year'],
    [/^bei einem internen Stundensatz von (.+) Euro$/, 'at an internal hourly rate of $1 euros'],
    [/^(.+) Stunden im Monat$/, '$1 hours per month'],
    [/^rund (.+) im Monat$/, 'about $1 per month'],
    [/^≈ (.+) Std\/Woche$/, '≈ $1 hrs/week'],
    [/^Bei Ihrer Annahme von (.+) Prozent$/, 'At your assumption of $1 percent'],
    [/^(.+) Stunden und rund (.+) im Monat$/, '$1 hours and about $2 per month'],
    [/^Mail (.+) Std\/Monat$/, 'Mail $1 hrs/month'],
    [/^Telefon (.+) Std\/Monat$/, 'Phone $1 hrs/month'],
    [/^Aufteilung: Mailbearbeitung (.+) Stunden im Monat, Telefon-Nacharbeit (.+) Stunden im Monat$/, 'Split: email handling $1 hours per month, phone follow-up $2 hours per month'],
    [/^Davon übernimmt das System nach dem Aufbau typischerweise 70 Prozent\. Das sind rund (.+) Stunden pro Monat oder (.+) Euro pro Jahr\. 70 Prozent sind eine Vorschau, nicht die Vertragszahl\. Den genauen Wert legen wir vor dem Bau gemeinsam fest\.$/, 'After setup the system typically takes over 70 percent. That is about $1 hours per month or $2 euros per year. 70 percent is a preview, not the contract figure. We fix the exact value together before we build.'],
    [/^(.+) Stunden pro Monat, (.+) Euro pro Jahr\.$/, '$1 hours per month, $2 euros per year.']
  ];

  function viaPattern(text) {
    for (var i = 0; i < PATTERNS.length; i++) {
      var match = text.match(PATTERNS[i][0]);
      if (match) return text.replace(PATTERNS[i][0], PATTERNS[i][1]);
    }
    return null;
  }

  function lookupEnglish(text) {
    var key = normalize(text);
    if (!key) return null;
    if (deToEn[key]) return deToEn[key];
    return viaPattern(key);
  }

  function germanKey(text) {
    var key = normalize(text);
    if (!key) return null;
    if (deToEn[key]) return key;
    if (enToDe[key]) return enToDe[key];
    return null;
  }

  function applyMapped(original, lang) {
    var key = germanKey(original);
    if (!key) {
      if (lang === 'en') {
        var patterned = viaPattern(normalize(original));
        if (patterned) return patterned;
      }
      return original;
    }
    if (lang === 'en') {
      var en = deToEn[key] || original;
      if (en === original) return original;
      var lead = (String(original).match(/^\s*/) || [''])[0];
      var trail = (String(original).match(/\s*$/) || [''])[0];
      return lead + String(en).replace(/^\s+|\s+$/g, '') + trail;
    }
    // Restore exact German source (whitespace around marks / after </strong>).
    return original;
  }

  function readLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'de') return stored;
    } catch (e) { /* private mode */ }
    return 'de';
  }

  function writeLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
  }

  var current = readLang();

  function shouldSkip(el) {
    if (!el || !el.closest) return true;
    if (el.closest('[data-i18n-ignore]')) return true;
    return false;
  }

  function translateAttributes(el, lang) {
    if (shouldSkip(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var name = ATTRS[i];
      if (!el.hasAttribute(name)) continue;
      var store = 'raisOrigAttr:' + name;
      if (!el[store]) el[store] = el.getAttribute(name);
      el.setAttribute(name, applyMapped(el[store], lang));
    }
  }

  function walk(root, lang) {
    if (!root) return;
    if (root.nodeType === 1) {
      if (SKIP[root.tagName] || shouldSkip(root)) return;
      translateAttributes(root, lang);
      var els = root.querySelectorAll('*');
      for (var i = 0; i < els.length; i++) {
        if (SKIP[els[i].tagName] || shouldSkip(els[i])) continue;
        translateAttributes(els[i], lang);
      }
    }

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (node) {
        if (node.nodeType === 1) {
          if (SKIP[node.tagName] || shouldSkip(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_SKIP;
        }
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (shouldSkip(node.parentElement)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var node;
    while ((node = walker.nextNode())) {
      if (!node.raisOrig) node.raisOrig = node.nodeValue;
      var next = applyMapped(node.raisOrig, lang);
      if (next !== node.nodeValue) node.nodeValue = next;
    }
  }

  function translateHead(lang) {
    if (document.title) document.title = applyMapped(document.title, lang);
    var metas = document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]');
    for (var i = 0; i < metas.length; i++) translateAttributes(metas[i], lang);
  }

  function syncToggle(lang) {
    var buttons = document.querySelectorAll('[data-lang-set]');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var on = btn.getAttribute('data-lang-set') === lang;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('is-active', on);
    }
    var groups = document.querySelectorAll('.lang-toggle');
    for (var g = 0; g < groups.length; g++) {
      groups[g].setAttribute('aria-label', lang === 'en' ? 'Language' : 'Sprache');
    }
  }

  function apply(lang, opts) {
    current = lang === 'en' ? 'en' : 'de';
    writeLang(current);
    document.documentElement.lang = current;
    document.documentElement.setAttribute('data-lang', current);
    translateHead(current);
    walk(document.body, current);
    syncToggle(current);
    document.documentElement.removeAttribute('data-lang-pending');
    if (!opts || opts.emit !== false) {
      document.dispatchEvent(new CustomEvent('rais:lang', { detail: { lang: current } }));
    }
  }

  function t(german) {
    return applyMapped(german, current);
  }

  function langToggleMarkup() {
    return (
      '<div class="lang-toggle" data-i18n-ignore role="group" aria-label="Sprache / Language">' +
        '<button type="button" class="lang-toggle__btn" data-lang-set="de" aria-pressed="true">DE</button>' +
        '<button type="button" class="lang-toggle__btn" data-lang-set="en" aria-pressed="false">EN</button>' +
      '</div>'
    );
  }

  function ensureToggle() {
    if (document.querySelector('.lang-toggle')) return;
    var host = document.querySelector('.nav-right') || document.querySelector('.topbar') || document.querySelector('header');
    if (!host) return;
    host.insertAdjacentHTML('afterbegin', langToggleMarkup());
  }

  function bindToggles() {
    document.addEventListener('click', function (event) {
      var btn = event.target.closest && event.target.closest('[data-lang-set]');
      if (!btn) return;
      event.preventDefault();
      apply(btn.getAttribute('data-lang-set'));
    });
  }

  var applying = false;
  function observe() {
    if (!window.MutationObserver || !document.body) return;
    var timer = null;
    var observer = new MutationObserver(function () {
      if (applying || current === 'de') return;
      clearTimeout(timer);
      timer = setTimeout(function () {
        applying = true;
        walk(document.body, current);
        applying = false;
      }, 40);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  window.RAIS = window.RAIS || {};
  window.RAIS.lang = function () { return current; };
  window.RAIS.t = t;
  window.RAIS.setLang = apply;
  window.RAIS.langToggleHtml = langToggleMarkup;

  function start() {
    ensureToggle();
    bindToggles();
    apply(current, { emit: true });
    observe();
    setTimeout(function () {
      document.documentElement.removeAttribute('data-lang-pending');
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}());
