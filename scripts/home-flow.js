/**
 * Interactive flow tabs on the VSL homepage (#home-flow).
 */
(function () {
  var root = document.getElementById('home-flow');
  if (!root) return;

  var tabs = root.querySelectorAll('[data-flow]');
  var panels = root.querySelectorAll('.home-flow__panel');
  if (!tabs.length || !panels.length) return;

  function activate(index) {
    var i = Number(index);
    if (Number.isNaN(i) || i < 0 || i >= panels.length) return;

    root.setAttribute('data-active', String(i));

    Array.prototype.forEach.call(tabs, function (tab, idx) {
      var on = idx === i;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
    });

    Array.prototype.forEach.call(panels, function (panel, idx) {
      var on = idx === i;
      panel.classList.toggle('is-active', on);
      if (on) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
  }

  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener('click', function () {
      activate(tab.getAttribute('data-flow'));
    });
    tab.addEventListener('keydown', function (e) {
      var cur = Number(root.getAttribute('data-active') || 0);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        activate((cur + 1) % tabs.length);
        tabs[(cur + 1) % tabs.length].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = (cur - 1 + tabs.length) % tabs.length;
        activate(prev);
        tabs[prev].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        activate(0);
        tabs[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        activate(tabs.length - 1);
        tabs[tabs.length - 1].focus();
      }
    });
  });

  activate(0);
})();
