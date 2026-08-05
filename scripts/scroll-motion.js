/**
 * Bewegung mit Verkaufszweck, einmal ausgelöst beim Scrollen ins Bild.
 *
 * Zwei Ziele:
 *   .arch      Datenfluss-Puls im Architekturbild. Zeigt, wohin Daten
 *              laufen, und dass an der EU-Grenze Schluss ist.
 *   .kontrakt  Zeilenweise Staffelung, links vor rechts, damit die
 *              Leserichtung „das bekommen Sie, das sparen Sie" trägt.
 *
 * Das gestaffelte Einblenden ganzer Sektionsblöcke (`.reveal` /
 * `.reveal.active`) macht die Orchestrierung im Inline-Script von
 * index.html. Bewusst getrennt lassen: die dortige Auswahlliste ist
 * kuratiert, damit etwa die Systemakte als ein Block einblendet und
 * nicht Eintrag für Eintrag. Ein zweiter Observer auf `.reveal`
 * würde sich mit ihr um dieselben Elemente streiten.
 *
 * Sicherheitsnetz: Ohne IntersectionObserver oder bei reduzierter
 * Bewegung wird `.no-anim` gesetzt und alles steht sofort sichtbar da.
 * Der Inhalt darf nie von der Animation abhängen.
 */
(function () {
  'use strict';

  var targets = document.querySelectorAll('.arch, .kontrakt');
  if (!targets.length) return;

  var reduce =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    document.documentElement.classList.add('no-anim');
  }

  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-live');
        observer.unobserve(entry.target); // laeuft genau einmal
      });
    },
    { threshold: 0.35 }
  );

  Array.prototype.forEach.call(targets, function (el) {
    observer.observe(el);
  });
})();
