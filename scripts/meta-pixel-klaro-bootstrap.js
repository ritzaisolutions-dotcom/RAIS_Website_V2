/* Meta Pixel (Facebook) — nur nach Einwilligung.
 *
 * Der Pixel-Code wird als "text/plain" mit data-name="meta-pixel" in den
 * <head> gelegt. Klaro führt ihn erst aus, wenn der Service "meta-pixel"
 * (site-prefs.js) eingewilligt ist. Vorher: kein Request an Meta.
 *
 * Bewusst weggelassen: das <noscript><img ...facebook.com/tr...></noscript>
 * aus dem Meta-Standardsnippet. Es würde ohne JavaScript und damit ohne
 * Einwilligung einen Request an Meta auslösen.
 *
 * Muss VOR vendor/klaro/klaro.js eingebunden sein (wie sentry-klaro-bootstrap.js).
 */
(function () {
  var PIXEL_ID = '1486765559987145';

  var init = document.createElement('script');
  init.type = 'text/plain';
  init.setAttribute('data-type', 'application/javascript');
  init.setAttribute('data-name', 'meta-pixel');
  init.textContent =
    "!function(f,b,e,v,n,t,s)" +
    "{if(f.fbq)return;n=f.fbq=function(){n.callMethod?" +
    "n.callMethod.apply(n,arguments):n.queue.push(arguments)};" +
    "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';" +
    "n.queue=[];t=b.createElement(e);t.async=!0;" +
    "t.src=v;s=b.getElementsByTagName(e)[0];" +
    "s.parentNode.insertBefore(t,s)}(window, document,'script'," +
    "'https://connect.facebook.net/en_US/fbevents.js');" +
    "fbq('init', '" + PIXEL_ID + "');" +
    "fbq('track', 'PageView');";
  document.head.appendChild(init);
})();
