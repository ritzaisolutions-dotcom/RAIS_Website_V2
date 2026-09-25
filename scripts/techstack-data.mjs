/**
 * TECH-STREIFEN — Werkzeuge, gruppiert nach dem tatsächlichen Datenfluss.
 *
 * WICHTIG, nicht wegoptimieren:
 * `brand_steer.md` verbietet Technologie-Markennamen im Proof-Ticker
 * ausdrücklich und nennt dabei „n8n oder Supabase" als Negativbeispiel.
 * Diese Logos gehören deshalb NUR hierher, niemals in den Ticker. Der
 * Ticker trägt weiter die EU- und DSGVO-Belege.
 *
 * Die Gruppierung folgt der Frage „wer sieht welche Daten", nicht der Optik.
 * Sie ist das eigentliche Argument des Streifens.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ZWEI GETRENNTE FRAGEN, NICHT VERWECHSELN
 *
 * 1. Verarbeitet ein Anbieter Daten von BESUCHERN DIESER WEBSITE?
 *    Dann gehört er in `datenschutz.html`. Betrifft aktuell Hostinger,
 *    Supabase, Sentry, Notion, Cal.com.
 *
 * 2. Ist ein Anbieter Teil dessen, was wir für KUNDEN bauen?
 *    Dann gehört er in den AVV mit dem jeweiligen Kunden, NICHT in die
 *    Datenschutzerklärung dieser Website. Ein Logo hier ist eine Aussage
 *    über unsere Bauweise, keine Offenlegung einer Website-Verarbeitung.
 *
 * `listed: false` ist deshalb kein Rechts-Gate, sondern nur für Anbieter
 * gedacht, die wir tatsächlich noch nicht einsetzen. Nichts behaupten,
 * was nicht läuft.
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * ─────────────────────────────────────────────────────────────────────────
 * DARSTELLUNG: durchgehender Logostrom, nur Logos in Originalfarbe,
 * kein Text am einzelnen Eintrag (Entscheidung 05.08.2026).
 *
 * Die Gruppierung bleibt hier als Datenstruktur bestehen, weil sie die
 * Pruefliste ist: sie beantwortet die Frage "wer sieht welche Daten".
 * Sichtbar ist sie nicht mehr.
 *
 * `meta` wird derzeit NICHT gerendert. Das Feld bleibt gepflegt, weil es
 * die Einordnung je Anbieter festhaelt und beim naechsten Umbau der
 * Darstellung sofort wieder gebraucht wird. Die Aussagen, die frueher
 * dort standen, traegt jetzt LEAD ueber dem Streifen:
 *
 *   - "Betrieb ausschliesslich in der EU" ersetzt die Standort-Metas
 *   - "unsere Entwicklungswerkzeuge sehen keine Kundendaten" ersetzt
 *     die Einschraenkung an Claude und Codex
 *
 * Wer LEAD kuerzt, nimmt diese Aussagen weg. Nicht wegoptimieren.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const GROUPS = [
  {
    id: 'laufzeit',
    title: 'Worauf Ihre Systeme laufen',
    note: 'Alles innerhalb der EU.',
    items: [
      { name: 'n8n', file: 'n8n-color.svg', meta: 'selbst gehostet', listed: true },
      { name: 'Supabase', file: 'supabase.svg', meta: 'Datenbank Frankfurt', listed: true },
      { name: 'Mistral', file: 'mistral.svg', meta: 'Modell Frankreich', listed: true },
    ],
  },
  {
    id: 'optional',
    title: 'Auf Wunsch anbindbar',
    note: 'In EU-Regionen betrieben.',
    items: [
      { name: 'Microsoft Azure', file: 'Azure logo.svg', meta: 'auf Wunsch, EU-Region', listed: true },
      { name: 'Google Cloud', file: 'google-cloud.svg', meta: 'auf Wunsch, EU-Region', listed: true },
    ],
  },
  {
    id: 'werkbank',
    title: 'Womit wir entwickeln',
    note: 'Sieht keine Kundendaten.',
    items: [
      { name: 'Claude', file: 'anthropic.svg', meta: 'nur Entwicklung', listed: true },
      { name: 'Codex', file: 'codex-openai.svg', meta: 'nur Entwicklung', listed: true },
    ],
  },
];

/**
 * Der Satz, der die Ausnahme benennt.
 *
 * Steht seit 05.08.2026 NICHT MEHR am Tech-Streifen, sondern in
 * #sicherheit bei der Architektur-Notiz. Grund: der Streifen zeigt nur
 * noch Logos und ein EU-Label; ein Fliesstext daneben wurde nicht
 * gelesen. Ersatzlos streichen war aber keine Option, denn dann stuende
 * ein EU-Label da, waehrend die bekannte Ausnahme verschwiegen wird.
 *
 * Der Export bleibt, damit die Aussage eine einzige Quelle behaelt.
 */
export const CHOICE_NOTE =
  'Wo Sie es ausdrücklich wünschen und die Daten nicht sensibel sind, binden wir auch Modelle außerhalb der EU an. Diese Entscheidung treffen Sie, nicht wir.';

/**
 * Das Label neben dem Logostrom.
 *
 * Bewusst faktisch und nachpruefbar statt pauschal. Beide Angaben sind
 * in brand.md am 04.08.2026 verifiziert. Ein pauschales
 * "DSGVO-konform" waere eine Zertifizierungsbehauptung, die brand.md
 * ausdruecklich verbietet, in Deutschland abmahnfaehig ist und dem
 * Umstand widerspricht, dass auf Wunsch auch ausserhalb der EU
 * angebunden wird.
 */
export const TRUST_LABEL = 'EU-Hosting · AVV nach Art. 28';

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Rendert den Streifen als durchgehenden Logostrom.
 *
 * Endlosschleife ohne JavaScript und ohne Dependency: die Liste wird
 * exakt einmal dupliziert, die Spur wandert per CSS um -50% und
 * springt damit nahtlos zurueck. Vorbild ist InfiniteSlider von
 * 21st.dev, dort React mit framer-motion und react-use-measure. Dieses
 * Projekt ist Vanilla, deshalb nachgebaut statt eingebunden.
 *
 * Die Kopie traegt `aria-hidden`, sonst liest ein Screenreader jedes
 * Logo zweimal vor. Sie ist rein optisch.
 *
 * Die Dauer haengt an der Anzahl der Logos, damit die Geschwindigkeit
 * gleich bleibt, wenn Eintraege dazukommen oder wegfallen.
 */
export function renderTechstack(opts = {}) {
  const logosOnly = opts.logosOnly === true;
  const items = GROUPS.flatMap((g) => g.items).filter((i) => i.listed !== false);

  if (items.length === 0) return '';

  // Nur das Logo, kein Text daneben.
  const logo = (i) => `            <li class="techstack__item">
              <img src="images/${encodeURI(i.file)}" alt="${esc(i.name)}" width="120" height="40" loading="lazy" decoding="async">
            </li>`;

  const run = items.map(logo).join('\n');

  // Sekunden pro Logo. 2.5s: Strip zieht zuegig von vorne nach,
  // ohne zu hetzen. Pause bei Hover/Fokus bleibt.
  const duration = (items.length * 2.5).toFixed(1);

  const trust = logosOnly
    ? ''
    : `
      <p class="techstack__trust">
        <svg class="ico" aria-hidden="true"><use href="#i-lock"></use></svg>
        ${esc(TRUST_LABEL)}
      </p>`;

  return `    <div class="techstack${logosOnly ? ' techstack--logos-only' : ''}">
      <div class="marquee techstack__marquee" style="--marquee-duration: ${duration}s">
        <div class="marquee__track">
          <ul class="techstack__list">
${run}
          </ul>
          <ul class="techstack__list" aria-hidden="true">
${run}
          </ul>
        </div>
      </div>${trust}
    </div>`;
}
