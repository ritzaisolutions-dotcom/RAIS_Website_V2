/**
 * Builds the visual VSL homepage <main> for Dienstleistungsunternehmen.
 * Run via: npm run pages
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const path = resolve(root, 'index.html');
let html = readFileSync(path, 'utf8');

const TITLE = 'RAIS | Systeme für Makler, Berater und Agenturen';
const DESC =
  'Für Sie erledigt: ein Wachstumssystem, das sich selbst zahlt — oder Sie bekommen Ihre Monatsbeiträge zurück. Für Makler, Berater und Agenturen.';

html = html.replace(
  /<!-- Home ist Filter[\s\S]*?<title>[\s\S]*?<\/title>|<!-- Home ist Filter laut Direktion:[\s\S]*?<title>[\s\S]*?<\/title>|<!-- Ausrichtung auf Maklerbüros[\s\S]*?<title>[\s\S]*?<\/title>|<!-- Home: VSL-Startseite[\s\S]*?<title>[\s\S]*?<\/title>/,
  `<!-- Home: VSL-Startseite für Dienstleister. Eine Aktion: Audit buchen. -->
    <title>${TITLE}</title>`
);
html = html.replace(
  /<meta name="description" content="[^"]*">/,
  `<meta name="description" content="${DESC}">`
);
html = html.replace(
  /<meta property="og:title" content="[^"]*">/,
  `<meta property="og:title" content="${TITLE}">`
);
html = html.replace(
  /<meta property="og:description" content="[^"]*">/,
  `<meta property="og:description" content="${DESC}">`
);
html = html.replace(
  /<meta name="twitter:title" content="[^"]*">/,
  `<meta name="twitter:title" content="${TITLE}">`
);
html = html.replace(
  /<meta name="twitter:description" content="[^"]*">/,
  `<meta name="twitter:description" content="${DESC}">`
);
html = html.replace(
  /"description":\s*"[^"]*"/,
  `"description": "${DESC}"`
);

if (!html.includes('styles/glass-motion.css')) {
  html = html.replace(
    '<link rel="stylesheet" href="styles/home.css">',
    '<link rel="stylesheet" href="styles/home.css">\n    <link rel="stylesheet" href="styles/glass-motion.css">'
  );
}

const mainOpen = html.indexOf('<main id="main">');
const mainClose = html.indexOf('</main>');
if (mainOpen < 0 || mainClose < 0) {
  console.error('main missing');
  process.exit(1);
}

const auditBtn = (id, source) =>
  `<button type="button" class="hero-btn-primary js-open-booking" id="${id}" data-source="${source}">Kostenlosen Audit buchen</button>`;

const newMain = `<main id="main">

        <section id="hero">
            <div class="hero-overlay" aria-hidden="true"></div>
            <div class="hero-content">
                <div class="hero-brand-emblem">
                    <img src="favicon.svg" alt="" width="36" height="36">
                    <span class="hero-brand-emblem__word">RAIS</span>
                </div>
                <h1 class="hero-h1 hero-h1--promise" data-i18n-ignore>
                    <span data-lang-copy="de">Für Sie erledigt: ein <span class="hero-h1__mark">Wachstumssystem</span>, das sich <span class="hero-h1__mark">selbst zahlt</span> — oder Sie bekommen Ihre <span class="hero-h1__mark">Monatsbeiträge zurück</span>.</span>
                    <span data-lang-copy="en">Done for you: a <span class="hero-h1__mark">growth system</span> that <span class="hero-h1__mark">pays for itself</span> — or you get your <span class="hero-h1__mark">monthly fees back</span>.</span>
                </h1>
                <p class="hero-sub">Für Makler, Berater und Agenturen</p>

                <div class="vsl vsl--booking" id="vsl" data-vsl-src="">
                    <div class="vsl__frame">
                        <img class="vsl__poster" src="images/mark-koch-hero.webp" alt="" width="1280" height="720" decoding="async">
                        <button type="button" class="vsl__play js-open-booking" data-source="vsl" aria-label="Kostenlosen Audit buchen">
                            <span class="vsl__play-icon" aria-hidden="true"></span>
                            <span class="vsl__play-label">Audit buchen</span>
                        </button>
                    </div>
                </div>

                <div class="hero-ctas">
                    ${auditBtn('hero-work-btn', 'hero')}
                </div>
            </div>
        </section>

        <section id="briefing" class="glass-band" aria-labelledby="briefing-title">
            <div class="section-wrap">
                <span class="mono-label mono-label--on-green">Vor dem Gespräch</span>
                <h2 class="glass-band__title" id="briefing-title">Was klar wird.</h2>
                <div class="glass-band__grid">
                    <article class="glass-claim">
                        <div class="glass-claim__icon">
                            <img class="glass-claim__fallback" src="images/glass/play.svg" width="120" height="120" alt="" loading="lazy" decoding="async">
                        </div>
                        <h3 class="glass-claim__heading">Vor dem Termin</h3>
                        <p class="glass-claim__body">Was wir bauen, woran Sie den Engpass erkennen, wie ein Fall aussieht.</p>
                    </article>
                    <article class="glass-claim">
                        <div class="glass-claim__icon">
                            <img class="glass-claim__fallback" src="images/glass/calendar.svg" width="120" height="120" alt="" loading="lazy" decoding="async">
                        </div>
                        <h3 class="glass-claim__heading">Im Termin</h3>
                        <p class="glass-claim__body">Ihr Engpass in 20 Minuten. Ein konkreter nächster Schritt.</p>
                    </article>
                    <article class="glass-claim">
                        <div class="glass-claim__icon">
                            <img class="glass-claim__fallback" src="images/glass/open.svg" width="120" height="120" alt="" loading="lazy" decoding="async">
                        </div>
                        <h3 class="glass-claim__heading">Prozess-Sparring</h3>
                        <p class="glass-claim__body">Was geht, was nicht, was Sinn macht.</p>
                    </article>
                </div>
            </div>
        </section>

        <section id="schmerz" class="home-band home-band--linen" aria-labelledby="schmerz-title">
            <div class="section-wrap schmerz-split">
                <div class="schmerz-split__copy">
                    <span class="mono-label">Der Engpass</span>
                    <h2 class="section-h2" id="schmerz-title">Zeit weg. Wachstum liegengeblieben.</h2>
                    <ul class="schmerz-list">
                        <li>Stunden verschwinden in Nachfassen und Handarbeit.</li>
                        <li>Kunden und Umsatz bleiben aus, weil Sie operativ in der Ineffizienz feststecken.</li>
                        <li>Wachstum wartet, solange der Alltag den Kalender frisst.</li>
                    </ul>
                    <p class="schmerz-bridge">Wir nehmen Ihnen das ab — ohne ein weiteres Projekt, das Sie selbst durchziehen müssen.</p>
                </div>
                <figure class="schmerz-split__visual">
                    <img src="images/glass/desk-bottleneck.svg" width="280" height="200" alt="Alltag am Schreibtisch: Postfach und Nachfassen statt Wachstum" loading="lazy" decoding="async">
                </figure>
            </div>
        </section>

        <section id="ergebnis" class="home-band home-band--cloud" aria-labelledby="ergebnis-title">
            <div class="section-wrap">
                <span class="mono-label">Anwendungsfälle</span>
                <h2 class="section-h2" id="ergebnis-title">Ergebnis, nicht Tool-Menü.</h2>
                <p class="section-sub usecase-lead">Von wo bis wohin. Was das System übernimmt — und wo Sie entscheiden.</p>
                <ul class="usecase-grid">
                    <li class="usecase-card">
                        <img class="usecase-card__icon" src="images/glass/inbox.svg" width="72" height="72" alt="" loading="lazy" decoding="async">
                        <h3 class="usecase-card__title">Speed to Lead</h3>
                        <ul class="usecase-card__bullets">
                            <li>Von: Portalanfrage, Formular oder Mail</li>
                            <li>Bis: qualifizierter Termin im Kalender</li>
                            <li>Ihr Team gibt frei — keine Preiszusage durch das System</li>
                        </ul>
                    </li>
                    <li class="usecase-card">
                        <img class="usecase-card__icon" src="images/glass/open.svg" width="72" height="72" alt="" loading="lazy" decoding="async">
                        <h3 class="usecase-card__title">Onboarding</h3>
                        <ul class="usecase-card__bullets">
                            <li>Von: Mandat unterschrieben</li>
                            <li>Bis: Checkliste und Startpaket laufen</li>
                            <li>Ohne dass Sie die Liste tippen</li>
                        </ul>
                    </li>
                    <li class="usecase-card">
                        <img class="usecase-card__icon" src="images/glass/chat.svg" width="72" height="72" alt="" loading="lazy" decoding="async">
                        <h3 class="usecase-card__title">Kundenservice</h3>
                        <ul class="usecase-card__bullets">
                            <li>Von: Nachricht außerhalb der Bürozeiten</li>
                            <li>Bis: erste Antwort oder Eskalation bei Ihnen</li>
                            <li>Mensch greift ein, wenn es eng wird</li>
                        </ul>
                    </li>
                    <li class="usecase-card">
                        <img class="usecase-card__icon" src="images/glass/document.svg" width="72" height="72" alt="" loading="lazy" decoding="async">
                        <h3 class="usecase-card__title">Dokumente</h3>
                        <ul class="usecase-card__bullets">
                            <li>Von: PDF oder Scan im Posteingang</li>
                            <li>Bis: Daten in der Akte</li>
                            <li>Freigabe bleibt bei Ihnen</li>
                        </ul>
                    </li>
                    <li class="usecase-card">
                        <img class="usecase-card__icon" src="images/glass/bars.svg" width="72" height="72" alt="" loading="lazy" decoding="async">
                        <h3 class="usecase-card__title">Wochenlage</h3>
                        <ul class="usecase-card__bullets">
                            <li>Von: verstreute Zahlen und offene Punkte</li>
                            <li>Bis: eine Lageübersicht für die Woche</li>
                            <li>Ohne dass jemand die Liste zusammensucht</li>
                        </ul>
                    </li>
                    <li class="usecase-card">
                        <img class="usecase-card__icon" src="images/glass/ads.svg" width="72" height="72" alt="" loading="lazy" decoding="async">
                        <h3 class="usecase-card__title">Ads-Reporting</h3>
                        <ul class="usecase-card__bullets">
                            <li>Von: Google Ads und Meta Ads Rohdaten</li>
                            <li>Bis: eine Performance-Übersicht für Sie</li>
                            <li>Wöchentlich, ohne Export-Chaos</li>
                        </ul>
                    </li>
                </ul>
                <p class="usecase-more">
                    <a class="home-cta-link" href="systeme.html">Systeme im Überblick</a>
                </p>
            </div>
        </section>

        <section id="beweis" class="home-band home-band--linen" aria-labelledby="beweis-title">
            <div class="section-wrap">
                <span class="mono-label">Beweis</span>
                <h2 class="section-h2" id="beweis-title">Ein Fall. Ohne erfundene Kennzahlen.</h2>
                <article class="proof-doc">
                    <img class="proof-doc__illu" src="images/glass/document.svg" width="120" height="132" alt="" loading="lazy" decoding="async">
                    <div class="proof-doc__body">
                        <p class="proof-doc__status">Live im Alltag</p>
                        <h3 class="proof-doc__name">Haller Immobilienberatung</h3>
                        <p class="proof-doc__text">Anfrage-System live: Qualifizierung und Terminübergabe an das Team. Läuft im Alltag.</p>
                    </div>
                </article>
            </div>
        </section>

        <section id="ablauf" class="home-band home-band--cloud collab-pin" aria-labelledby="ablauf-title" data-collab-pin>
            <div class="section-wrap">
                <span class="mono-label">Zusammenarbeit</span>
                <h2 class="section-h2" id="ablauf-title">So läuft die Zusammenarbeit.</h2>
                <p class="section-sub usecase-lead">Fünf Schritte vom ersten Termin bis zum laufenden System. Reihenfolge, kein Menü.</p>
                <div class="step-rail__bar" aria-hidden="true">
                    <div class="step-rail__bar-fill"></div>
                </div>
                <ol class="step-rail" aria-label="Zusammenarbeit in fünf Schritten">
                    <li class="step-rail__item" data-step="0">
                        <span class="step-rail__dot" aria-hidden="true"></span>
                        <span class="step-rail__num">01</span>
                        <strong class="step-rail__title">Termin</strong>
                        <span class="step-rail__desc">Kurz klären, ob Volumen und Setup passen.</span>
                    </li>
                    <li class="step-rail__item" data-step="1">
                        <span class="step-rail__dot" aria-hidden="true"></span>
                        <span class="step-rail__num">02</span>
                        <strong class="step-rail__title">Discovery</strong>
                        <span class="step-rail__desc">Engpass und Prozess. Welches System den Hebel hat.</span>
                    </li>
                    <li class="step-rail__item" data-step="2">
                        <span class="step-rail__dot" aria-hidden="true"></span>
                        <span class="step-rail__num">03</span>
                        <strong class="step-rail__title">Konzept</strong>
                        <span class="step-rail__desc">Scope, Timeline, Preis und messbare Kriterien. Schriftlich.</span>
                    </li>
                    <li class="step-rail__item" data-step="3">
                        <span class="step-rail__dot" aria-hidden="true"></span>
                        <span class="step-rail__num">04</span>
                        <strong class="step-rail__title">Aufbau</strong>
                        <span class="step-rail__desc">Anbindung an Ihre Tools. Test mit echten Abläufen.</span>
                    </li>
                    <li class="step-rail__item" data-step="4">
                        <span class="step-rail__dot" aria-hidden="true"></span>
                        <span class="step-rail__num">05</span>
                        <strong class="step-rail__title">Go-Live</strong>
                        <span class="step-rail__desc">Übergabe und Monitoring. Anpassungen laufen mit.</span>
                    </li>
                </ol>
            </div>
        </section>

        <section id="garantie" class="home-band home-band--linen garantie-band" aria-labelledby="garantie-title">
            <div class="section-wrap">
                <div class="garantie">
                    <img class="garantie__icon" src="images/glass/shield.svg" width="96" height="96" alt="" loading="lazy" decoding="async">
                    <div class="garantie__copy">
                        <span class="mono-label">Unser Risiko, nicht Ihres</span>
                        <h2 class="section-h2" id="garantie-title">Garantie am System, nicht am Pitch.</h2>
                        <p class="garantie__body">Bei Bedarf kommen wir zu Ihnen und handeln eine Garantie aus — passend zu dem System, das Ihren Engpass löst. Jede Problemlösung braucht eine eigene, passende Zusage. Festgehalten werden messbare Kennzahlen vor dem Start.</p>
                        <p class="garantie__body">Bleibt in den ersten zwei Monaten nach Go-Live der Mehrwert nach diesen Kennzahlen aus oder nicht messbar, bekommen Sie Ihre Monatsbeiträge zurück.</p>
                    </div>
                </div>
                <div class="home-cta-row home-cta-row--center">
                    ${auditBtn('cta-before-contact', 'before-contact')}
                </div>
            </div>
        </section>

<section id="contact" class="contact-band home-band--green">
            <div class="section-wrap">
                <div class="contact-deliver">
                    <span class="mono-label mono-label--contact">Kostenloser Audit</span>
                    <p class="contact-claim">20 Minuten. Ein Engpass. Prozess-Sparring: was geht, was nicht, was Sinn macht.</p>
                    <h2 class="section-h2 contact-h2">Termin wählen.</h2>
                    <p class="contact-copy home-contact-lead">
                        Sie geben Ihre Angaben direkt im Kalender ein. Ein zweites Formular gibt es nicht.
                    </p>

                    <div class="contact-deliver__cta">
                        <p class="cal-card-sub">20 Minuten, kostenlos.</p>
                        <div class="cal-inline cal-inline--contact" data-cal-inline data-source="contact" id="cal-inline-contact">
                            <button type="button" class="cal-load-btn js-open-booking" data-source="contact-fallback">Termin wählen</button>
                        </div>
                        <p class="contact-deliver__trust">Kevin Ritz · Audit · kein Verkaufsdruck</p>
                    </div>
                </div>
            </div>
        </section>



    `;

html = html.slice(0, mainOpen) + newMain + html.slice(mainClose);

html = html.replace(/\s*<script src="scripts\/aqut-rechner\.js"><\/script>/g, '');
html = html.replace(/\s*<script src="scripts\/aqut-sim\.js"><\/script>/g, '');
html = html.replace(/\s*<script src="scripts\/lead-magnet\.js"><\/script>/g, '');
html = html.replace(/\s*<script src="scripts\/spline-glass\.js"><\/script>/g, '');
html = html.replace(/\s*<script src="scripts\/branchen-tabs\.js"><\/script>/g, '');
html = html.replace(/\s*<script src="scripts\/wenn-branchen\.js"><\/script>/g, '');
html = html.replace(/\s*<script src="scripts\/vsl-player\.js"><\/script>/g, '');
html = html.replace(/\s*<script src="scripts\/home-flow\.js"><\/script>/g, '');
html = html.replace(/\s*<script src="scripts\/collab-scroll\.js"><\/script>/g, '');

html = html.replace(
  /<\/body>/,
  `    <script src="scripts/vsl-player.js"></script>
    <script src="scripts/collab-scroll.js"></script>
</body>`
);

writeFileSync(path, html, 'utf8');
console.log('VSL visual home applied');
