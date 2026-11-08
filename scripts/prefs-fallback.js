/* Fallback, wenn das Consent-Tool nicht startet.
 *
 * Wird nach vendor/klaro/klaro.js eingebunden. Fehlt window.klaroConfig
 * (z. B. weil ein Blocker site-prefs.js unterdrückt), erscheint ein
 * schlichter Hinweis mit Mailadresse und Cal.com-Link.
 *
 * Wichtig: Dieses Skript lädt nichts nach und erteilt keine Einwilligung.
 * Meta Pixel, Cal-Embed, Wistia und Sentry bleiben aus, weil sie nur über
 * Klaro freigegeben werden. Der Cal.com-Link ist ein normaler Link, den die
 * Person selbst anklickt; es wird nichts eingebettet.
 */
(function () {
  'use strict';

  var MAIL = 'kevin@ritz-ai.solutions';
  var CAL_URL = 'https://cal.com/ritzaisolutions/strategiegespraech-mit-rais';

  function isEn() {
    try {
      return window.localStorage.getItem('rais-lang') === 'en';
    } catch (e) {
      return false;
    }
  }

  function show() {
    if (typeof window.klaroConfig !== 'undefined') return;
    if (document.getElementById('prefs-fallback')) return;

    var en = isEn();
    var box = document.createElement('div');
    box.id = 'prefs-fallback';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', en ? 'Privacy notice' : 'Datenschutzhinweis');
    box.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#fff;color:#1a1512;' +
      'border-top:1px solid #d9d1c7;box-shadow:0 -4px 24px rgba(47,42,36,.12);' +
      'font:14px/1.5 Inter,system-ui,sans-serif;padding:14px 48px 14px 16px;';

    var text = document.createElement('p');
    text.style.cssText = 'margin:0;max-width:60rem;';
    text.appendChild(
      document.createTextNode(
        en
          ? 'The privacy settings could not be loaded (possibly blocked by a browser extension). Without your consent we load no tracking or third-party services. To book a call, email '
          : 'Die Datenschutzeinstellungen konnten nicht geladen werden (möglicherweise durch einen Blocker). Ohne Ihre Einwilligung laden wir keine Tracking- oder Drittanbieter-Dienste. Für einen Termin schreiben Sie an ',
      ),
    );

    var mail = document.createElement('a');
    mail.href = 'mailto:' + MAIL;
    mail.textContent = MAIL;
    mail.style.cssText = 'color:#ec6a37;text-decoration:underline;';
    text.appendChild(mail);

    text.appendChild(document.createTextNode(en ? ' or use ' : ' oder nutzen Sie '));

    var cal = document.createElement('a');
    cal.href = CAL_URL;
    cal.target = '_blank';
    cal.rel = 'noopener noreferrer';
    cal.textContent = en ? 'Cal.com directly' : 'Cal.com direkt';
    cal.style.cssText = 'color:#ec6a37;text-decoration:underline;';
    text.appendChild(cal);
    text.appendChild(document.createTextNode('.'));
    box.appendChild(text);

    var close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', en ? 'Close' : 'Schließen');
    close.textContent = '×';
    close.style.cssText =
      'position:absolute;top:8px;right:12px;border:0;background:none;font-size:24px;line-height:1;' +
      'cursor:pointer;color:#1a1512;';
    close.addEventListener('click', function () {
      if (box.parentNode) box.parentNode.removeChild(box);
    });
    box.appendChild(close);

    document.body.appendChild(box);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else {
    show();
  }
})();
