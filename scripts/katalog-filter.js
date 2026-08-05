/**
 * Freitextsuche über den Systemkatalog. Progressive Enhancement:
 * ohne dieses Skript bleibt das Suchfeld verborgen und alle Einträge
 * stehen sichtbar untereinander.
 *
 * Sucht über das data-search-Attribut, das systemakte-data.mjs pro
 * Eintrag aus Titel, Auslöser, Anbindung und Kürzel zusammensetzt.
 */
(function () {
  'use strict';

  var root = document.getElementById('katalog');
  if (!root) return;

  var field = root.querySelector('.katalog__search');
  var input = root.querySelector('#katalog-suche');
  var status = root.querySelector('#katalog-status');
  var items = Array.prototype.slice.call(root.querySelectorAll('.akte-item'));
  if (!field || !input || !items.length) return;

  field.hidden = false;

  // Panels und Reiter kennt branchen-tabs.js. Wird gesucht, muss die
  // Reiterlogik pausieren, sonst versteckt sie Treffer aus anderen Branchen.
  var branchen = root.querySelector('.branchen');
  var panels = Array.prototype.slice.call(root.querySelectorAll('.branchen__panel'));

  function normalise(value) {
    return value
      .toLowerCase()
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ß/g, 'ss');
  }

  function apply() {
    var query = normalise(input.value.trim());

    if (!query) {
      items.forEach(function (item) { item.hidden = false; });
      if (branchen) branchen.classList.remove('is-searching');
      panels.forEach(function (panel) { panel.hidden = false; });
      // Reiterzustand wiederherstellen
      if (branchen && branchen.classList.contains('js-branchen')) {
        var tabs = root.querySelectorAll('.branchen__tab');
        Array.prototype.forEach.call(tabs, function (tab, i) {
          var on = tab.getAttribute('aria-selected') === 'true';
          if (panels[i]) panels[i].hidden = !on;
        });
      }
      status.textContent = '';
      return;
    }

    // Waehrend der Suche alle Panels oeffnen, damit Treffer sichtbar werden
    if (branchen) branchen.classList.add('is-searching');
    panels.forEach(function (panel) { panel.hidden = false; });

    var hits = 0;
    items.forEach(function (item) {
      var haystack = normalise(item.getAttribute('data-search') || '');
      var match = haystack.indexOf(query) !== -1;
      item.hidden = !match;
      if (match) hits++;
    });

    status.textContent =
      hits === 0
        ? 'Kein Eintrag passt zu „' + input.value.trim() + '“. Im Erstgespräch klären wir auch Fälle, die hier nicht stehen.'
        : hits === 1
          ? '1 Eintrag gefunden.'
          : hits + ' Einträge gefunden.';
  }

  input.addEventListener('input', apply);
  input.addEventListener('search', apply);
})();
