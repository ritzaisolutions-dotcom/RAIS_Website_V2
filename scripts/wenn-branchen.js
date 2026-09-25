/**
 * Home-Accordion: nur eine Branche gleichzeitig offen.
 */
(function () {
  var root = document.getElementById('branchen-list');
  if (!root) return;
  var items = root.querySelectorAll('details.wenn-branche');
  items.forEach(function (el) {
    el.addEventListener('toggle', function () {
      if (!el.open) return;
      items.forEach(function (other) {
        if (other !== el) other.open = false;
      });
    });
  });
})();
