import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const path = resolve(root, 'index.html');
let html = readFileSync(path, 'utf8');

const replacement = `
        <section class="trust-strip" aria-label="Infrastruktur und Datenschutz">
            <ul class="trust-strip__list">
                <li>Selbst gehostet in Deutschland</li>
                <li>Datenbank in Frankfurt</li>
                <li>AVV nach Art. 28 DSGVO</li>
                <li>Keine Datenweitergabe außerhalb der EU</li>
                <li>Koblenz</li>
            </ul>
        </section>

        <section id="referenzen-teaser">
            <div class="section-wrap">
                <span class="mono-label">Wem wir geholfen haben</span>
                <h2 class="section-h2">Haller Immobilienberatung GmbH</h2>
                <div class="teaser-card">
                    <p>Öffentlich freigegebene Referenz: Anfragen-Qualifizierung und Terminierung für ein Maklerbüro. Details auf der Referenzen-Seite.</p>
                    <p style="margin-top:0.75rem;"><a href="referenzen.html">Zur Referenz</a></p>
                </div>
            </div>
        </section>

        <section id="systeme">
            <div class="section-wrap">
                <span class="mono-label">Live-Systeme</span>
                <h2 class="section-h2">Was RAIS heute baut</h2>
                <p class="section-sub">AQuT ist das vertiefte Angebotssystem für Makleranfragen. Die übrigen Systeme zeigen die Bandbreite, ohne die Zielgruppe zu verwässern.</p>
                <div class="systeme-bento">
                    <article class="sys-cell sys-cell--aqut">
                        <span class="sys-ctx">Makler</span>
                        <h3>AQuT</h3>
                        <p>Portalanfragen qualifizieren und Termine buchen. Bei typischem Volumen oft im Bereich von rund 30 Stunden pro Monat, abhängig von Ihrem Anfragevolumen.</p>
                        <a href="aqut.html">AQuT genauer ansehen</a>
                    </article>
                    <article class="sys-cell sys-cell--peer">
                        <span class="sys-ctx">Makler</span>
                        <h3>Onboarding WFS</h3>
                        <p>Automatisierte Onboarding-Workflows nach Vertragsunterschrift.</p>
                    </article>
                    <article class="sys-cell sys-cell--peer">
                        <span class="sys-ctx">Makler</span>
                        <h3>Lead Scraping LMLF</h3>
                        <p>Lead-Erfassung und Enrichment über strukturierte Workflows.</p>
                    </article>
                    <article class="sys-cell sys-cell--peer">
                        <span class="sys-ctx">Makler</span>
                        <h3>CRM</h3>
                        <p>Anbindung und schlanke Datenhaltung rund um Anfragen und Termine.</p>
                    </article>
                    <article class="sys-cell sys-cell--peer">
                        <span class="sys-ctx">Intern</span>
                        <h3>Habit Tracker + Report</h3>
                        <p>Apps mit Performance-Report für interne Disziplin und Auswertung.</p>
                    </article>
                    <article class="sys-cell sys-cell--peer">
                        <span class="sys-ctx">Content</span>
                        <h3>Agentic AI Content</h3>
                        <p>Agentische Systeme für Content-Erstellung und Redaktionsabläufe.</p>
                    </article>
                </div>
            </div>
        </section>

        <section id="zielgruppe">
            <div class="section-wrap">
                <span class="mono-label">Für wen</span>
                <h2 class="section-h2">Unabhängige Maklerbüros mit echtem Anfragevolumen</h2>
                <ul class="list-plain">
                    <li>5 bis 25 Mitarbeitende im Team</li>
                    <li>Hohes Anfragevolumen über gängige Immobilienportale</li>
                    <li>Bestehendes CRM wie onOffice oder Propstack, oder Bereitschaft dazu</li>
                    <li>Offenheit für KI und neue Systeme im Team</li>
                </ul>
                <p style="margin-top:1.5rem;"><a href="zusammenarbeit.html">So arbeiten wir</a></p>
            </div>
        </section>

`;

const tStart = html.indexOf('<section id="ticker"');
const cStart = html.indexOf('<section id="contact"');
if (tStart < 0 || cStart < 0) {
  console.error('markers missing', tStart, cStart);
  process.exit(1);
}
html = html.slice(0, tStart) + replacement + html.slice(cStart);
writeFileSync(path, html);
console.log('home mid-sections replaced');
