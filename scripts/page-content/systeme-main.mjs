/**
 * Systeme-Hub: Closed Loop Onboarding + AMS (Speed to Lead / AQUT).
 * Gebaut über build-pages.mjs → systeme.html
 */
import { renderTechstack } from '../techstack-data.mjs';

const logos = renderTechstack({ logosOnly: true });

export const systemeMain = `
<section class="page-hero">
  <div class="page-hero__inner">
    <span class="mono-label">Systeme</span>
    <h1>Zwei Systeme. Ein Ziel.</h1>
    <p>Start und Mehrwert im Closed Loop — Anfragen, die zum Termin werden, mit AMS.</p>
  </div>
</section>

<section id="closed-loop" class="band-cloud" aria-labelledby="closed-loop-title">
  <div class="section-wrap">
    <div class="systeme-intro">
      <img class="systeme-intro__icon" src="images/glass/open.svg" width="72" height="72" alt="" loading="lazy" decoding="async">
      <div>
        <span class="mono-label">System 01</span>
        <h2 class="section-h2" id="closed-loop-title">Closed Loop Onboarding</h2>
        <p class="section-sub">Vom unterschriebenen Mandat bis zum nachweisbaren Mehrwert — ohne Slack-Jagd und ohne Excel am Freitagabend.</p>
      </div>
    </div>

    <div class="systeme-split">
      <div>
        <p class="usecase-card__phase">Start</p>
        <ul class="systeme-list">
          <li>Vertrag sichern, Transkripte ablegen, Zuständige inkl. Call-Zeiten informieren</li>
          <li>Ordner-Zugriff in der Willkommensmail</li>
          <li>Kunde ready, intern Bescheid — ohne Slack-Jagd</li>
        </ul>
      </div>
      <div>
        <p class="usecase-card__phase">Mehrwert</p>
        <ul class="systeme-list">
          <li>Meta Ads, Google Ads, SEO, GEO — Daten nach Ihrer Freigabe weiter</li>
          <li>Harte Zahlen, was die Leistung beim Kunden bewirkt</li>
          <li>Proaktiv statt Excel am Freitagabend</li>
        </ul>
      </div>
    </div>

    <div class="home-cta-row">
      <button type="button" class="btn-primary js-open-booking" data-source="systeme-closed-loop">Kostenlosen Audit buchen</button>
    </div>
  </div>
</section>

<section id="ams" class="band-linen" aria-labelledby="ams-title">
  <div class="section-wrap">
    <div class="systeme-intro">
      <img class="systeme-intro__icon" src="images/glass/inbox.svg" width="72" height="72" alt="" loading="lazy" decoding="async">
      <div>
        <span class="mono-label">System 02 · Flaggship</span>
        <h2 class="section-h2" id="ams-title">AMS — Speed to Lead</h2>
        <p class="section-sub">Anfragen sofort abholen. Die Lücke ist selten „keine Leads“ — sondern zu langsame Mail oder DM.</p>
      </div>
    </div>
    <ul class="systeme-list systeme-list--single">
      <li>Anfrage intelligent abholen → Antwort → Termin</li>
      <li>Anfrage wird Termin, nicht Postfach</li>
      <li>Ihr Team gibt frei — keine Preiszusage durch das System</li>
    </ul>
    <div class="home-cta-row">
      <a class="home-cta-link" href="ams.html">AMS mit Ihren Zahlen rechnen</a>
      <button type="button" class="btn-primary js-open-booking" data-source="systeme-ams">Kostenlosen Audit buchen</button>
    </div>
  </div>
</section>

<section id="stack" class="band-linen trust-band systeme-logos" aria-label="Worauf die Systeme laufen">
  <div class="section-wrap">
    <span class="mono-label">Worauf die Systeme laufen</span>
    ${logos}
  </div>
</section>
`;
