(function () {
  var cfg = window.RAIS_PUBLIC_CONFIG;
  if (!cfg || !cfg.sentryDsn || !cfg.sentryLoaderKey) return;

  var loader = document.createElement('script');
  loader.type = 'text/plain';
  loader.setAttribute('data-type', 'application/javascript');
  loader.setAttribute('data-name', 'sentry');
  loader.src = 'https://js-de.sentry-cdn.com/' + cfg.sentryLoaderKey + '.min.js';
  loader.crossOrigin = 'anonymous';
  document.head.appendChild(loader);

  var init = document.createElement('script');
  init.type = 'text/plain';
  init.setAttribute('data-type', 'application/javascript');
  init.setAttribute('data-name', 'sentry');
  init.textContent = 'Sentry.init({ dsn: ' + JSON.stringify(cfg.sentryDsn) + ' });';
  document.head.appendChild(init);
})();
