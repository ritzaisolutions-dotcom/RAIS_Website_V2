/**
 * EINWAND-FAQ — einzige Quelle für sichtbares Markup UND FAQPage-Schema.
 *
 * Abgrenzung: Die sechs Fragen in `#sicherheit` sind eine Einkaufs-Checkliste
 * („Fragen, die Sie jedem Anbieter stellen sollten"). Sie leisten etwas
 * anderes und bleiben unangetastet. Hier steht klassische Einwandbehandlung.
 *
 * Regeln für Antworten:
 *   - keine erfundenen Zahlen, keine Kundenbelege
 *   - keine Gedankenstriche, typografische Anführungszeichen „so"
 *   - Zusagen nur über den eigenen Prozess, nie über Kundenergebnisse
 */

export const FAQ = [
  {
    q: 'Wie lange dauert es, bis ein System läuft?',
    a: 'Ein erstes System geht typischerweise in vier bis sechs Wochen live. Der Audit und die Analyse davor kosten Sie etwa zwei Termine. Größere Zuschnitte dauern länger, das sagen wir dann vor Projektstart und nicht mittendrin.',
  },
  {
    q: 'Was ist, wenn das System die vereinbarten Kriterien nicht erreicht?',
    a: 'Wir definieren messbare Kriterien vor Projektstart. Werden sie nicht erreicht, passen wir nach, ohne zusätzliche Beratungshonorare. Deshalb legen wir im Audit so viel Wert darauf, dass die Kriterien überhaupt messbar formuliert sind.',
  },
  {
    q: 'Was ist, wenn mein Team damit nicht klarkommt?',
    a: 'Die Systeme laufen dort, wo Ihr Team ohnehin arbeitet: im Postfach, im CRM, im Ticketsystem. Es gibt in der Regel keine neue Oberfläche, die jemand lernen muss. Wo doch, gehört die Einweisung zur Übergabe und nicht auf eine Extrarechnung.',
  },
  {
    q: 'Können wir unsere bestehenden Tools und unser CRM behalten?',
    a: 'Ja, das ist der Normalfall. Wir bauen an Ihre Systeme an, statt Ihnen eine Plattform zu verkaufen. Wenn ein Werkzeug wirklich im Weg steht, sagen wir das offen, aber ein Wechsel ist nie die Voraussetzung dafür, dass wir anfangen können.',
  },
  {
    q: 'Brauchen wir technisches Wissen im Haus?',
    a: 'Für den Betrieb nicht. Sie brauchen jemanden, der fachlich entscheiden kann, was das System darf und was nicht, und der Freigaben erteilt. Das ist eine fachliche Rolle, keine technische.',
  },
  {
    q: 'Was passiert nach dem Go-Live, wer betreut das System?',
    a: 'Jedes System wird dokumentiert übergeben, damit Ihr Team oder ein anderer Dienstleister es weiterbetreiben kann. Ob wir den Betrieb übernehmen, entscheiden Sie danach. Es gibt keinen Lizenzschlüssel, den wir abschalten könnten.',
  },
  {
    q: 'Wie viel Zeit kostet uns das Projekt intern?',
    a: 'Rechnen Sie mit einem halben Tag für den Audit, dann etwa ein bis zwei Stunden pro Woche für Rückfragen und Freigaben, solange gebaut wird. Wenn wir mehr brauchen, sagen wir es vorher.',
  },
  {
    q: 'Ab welcher Größe lohnt sich das überhaupt?',
    a: 'Entscheidend ist nicht die Mitarbeiterzahl, sondern das Volumen eines wiederkehrenden Vorgangs. Unter etwa zehn Fällen pro Woche raten wir ab, da rechnet sich der Aufwand meistens nicht. Was bei Ihnen zusammenkommt, können Sie im Rechner auf dieser Seite mit Ihren eigenen Zahlen prüfen.',
  },
  {
    q: 'Was kostet es?',
    a: 'Wir nennen keinen öffentlichen Preis, weil der Zuschnitt jedes Systems den Aufwand bestimmt und eine Zahl ohne Kontext niemandem hilft. Der Rahmen hängt an drei Dingen: wie viele Prozesse Sie automatisieren, wie sauber Ihre Daten heute vorliegen, und ob wir den Betrieb übernehmen. Sie bekommen ein schriftliches Angebot mit Scope, Zeitplan und Preis, bevor irgendetwas gebaut wird.',
  },
  {
    q: 'Arbeiten Sie auch außerhalb der genannten Branchen?',
    // Nannte bis 09.08.2026 vier Branchen. Seit die Seite nur noch
    // Immobilien führt, wäre das eine Aufzählung von Bereichen, die der
    // Besucher nirgends findet. Letzter Satz bleibt wörtlich.
    a: 'Ja, im Einzelfall. Immobilien ist der Bereich, in dem wir die meisten Prozesse dokumentiert haben. Die Systeme selbst sind nicht immobilienspezifisch, ein Anfrageeingang mit Prüfung und Übergabe sieht anderswo ähnlich aus. Wenn wir in Ihrem Fall keinen echten Mehrwert sehen, sagen wir ab, statt ein Projekt anzunehmen.',
  },
];

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Sichtbares Markup. Nutzt das .akte--frage-Muster aus Runde 2. */
export function renderFaq() {
  if (!FAQ.length) return '';
  const items = FAQ.map(
    (f) => `        <li><details class="akte akte--frage">
          <summary class="akte__head">
            <span class="akte__title">${esc(f.q)}</span>
            <span class="akte__toggle"><span class="akte__toggle-closed">Antwort öffnen</span><span class="akte__toggle-open">Antwort schließen</span></span>
          </summary>
          <div class="akte__body">
            <p>${esc(f.a)}</p>
          </div>
        </details></li>`
  ).join('\n');

  return `      <ul class="akte-register akte-register--faq">
${items}
      </ul>`;
}

/**
 * FAQPage-JSON-LD aus derselben Quelle wie das Markup, damit beide
 * niemals auseinanderlaufen. JSON.stringify uebernimmt das Escaping.
 */
export function renderFaqSchema() {
  if (!FAQ.length) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
}
