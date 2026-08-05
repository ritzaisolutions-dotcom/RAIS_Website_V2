/**
 * ÄNDERUNGSPROTOKOLL — „Was wir zuletzt gebaut haben"
 *
 * Beweist Aktivität, ohne eine einzige Kundenfreigabe zu brauchen.
 * Genau deshalb: keine Kundennamen, keine Kennzahlen, keine Ortsangaben,
 * aus denen sich ein Kunde erschließen lässt.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DIE LISTE IST BEWUSST LEER.
 * Solange `ENTRIES` leer ist, wird auf der Seite GAR NICHTS gerendert:
 * keine Sektion, keine Überschrift, kein Platzhalter. Es kann also nichts
 * versehentlich live gehen.
 *
 * Zum Aktivieren einfach Einträge ergänzen, dann `npm run pages`:
 *
 *   { monat: 'August 2026',
 *     branche: 'Handwerk und Bau',
 *     code: 'HWK-A',                      // optional, Kürzel aus der Systemakte
 *     text: 'Angebotsanfragen aus Telefon und Formular laufen jetzt in einen Vorgang.' }
 *
 * Regeln für den Text:
 *   - ein Satz, Vergangenheit, konkret
 *   - was gebaut wurde, nicht was es gebracht hat (Ergebnisse brauchen Belege)
 *   - keine Kundennamen, keine Prozentzahlen
 *   - keine Gedankenstriche
 * ─────────────────────────────────────────────────────────────────────────
 */

/** @type {Array<{monat: string, branche?: string, code?: string, text: string}>} */
export const ENTRIES = [];

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Rendert das Änderungsprotokoll.
 * Gibt bei leerer Liste einen leeren String zurück, damit die aufrufende
 * Seite nichts einhängt. Keine Überschrift ohne Inhalt.
 * @param {number} [limit] nur die letzten n Einträge zeigen
 * @returns {string} HTML oder ''
 */
export function renderChangelog(limit = 6) {
  if (!Array.isArray(ENTRIES) || ENTRIES.length === 0) return '';

  const rows = ENTRIES.slice(0, limit)
    .map((e) => {
      const meta = [e.branche, e.code].filter(Boolean).map(esc).join(' · ');
      return `        <li class="changelog__row">
          <span class="changelog__when">${esc(e.monat)}</span>
          <span class="changelog__what">${esc(e.text)}</span>
          ${meta ? `<span class="changelog__meta">${meta}</span>` : ''}
        </li>`;
    })
    .join('\n');

  return `    <div class="changelog">
      <h3 class="changelog__title">Was wir zuletzt gebaut haben</h3>
      <p class="changelog__lead">Ohne Kundennamen, bis eine Freigabe vorliegt. Die Einträge zeigen, woran wir tatsächlich arbeiten.</p>
      <ul class="changelog__list">
${rows}
      </ul>
    </div>`;
}
