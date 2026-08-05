/**
 * Branchen-Reiter als Progressive Enhancement.
 *
 * Ohne dieses Skript stehen alle Branchen-Panels sichtbar untereinander,
 * jedes mit eigener Ueberschrift. Erst hier werden daraus Reiter.
 * Deshalb wird die Reiterleiste im Markup zunaechst versteckt und erst
 * durch .js-branchen sichtbar gemacht.
 */
(function () {
  'use strict';

  var roots = document.querySelectorAll('.branchen');
  if (!roots.length) return;

  Array.prototype.forEach.call(roots, function (root) {
    var tablist = root.querySelector('.branchen__tablist');
    var tabs = Array.prototype.slice.call(root.querySelectorAll('.branchen__tab'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('.branchen__panel'));
    if (!tablist || tabs.length < 2 || tabs.length !== panels.length) return;

    root.classList.add('js-branchen');

    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        select(i, false);
      });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        event.preventDefault();
        select(next, true);
      });
    });

    // Direktlink auf eine Branche respektieren, sonst die erste zeigen
    var initial = 0;
    var hash = window.location.hash.replace('#', '');
    if (hash) {
      panels.forEach(function (panel, i) {
        var title = panel.querySelector('.branchen__panel-title');
        if (panel.id === 'branche-panel-' + hash || (title && title.id === hash)) {
          initial = i;
        }
      });
    }
    select(initial, false);
  });
})();
