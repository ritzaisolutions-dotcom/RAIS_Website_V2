(function () {
  var cfg = window.RAIS_PUBLIC_CONFIG || {};
  var SUPABASE_URL  = cfg.supabaseUrl || '';
  var SUPABASE_ANON = cfg.supabaseAnonKey || '';
  var PDF_PATH = 'downloads/rais-prozesshandbuch-2026.pdf';
  var MAGNET_SLUG = 'prozesshandbuch-2026';

  var form = document.getElementById('lm-form');
  var success = document.getElementById('lm-success');
  var downloadBtn = document.getElementById('lm-download-btn');
  var submitBtn = document.getElementById('lm-submit');

  if (!form) return;
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    console.error('RAIS: scripts/public-config.js fehlt. npm run config ausführen.');
    return;
  }

  function getSource() {
    var params = new URLSearchParams(window.location.search);
    return params.get('utm_source') || params.get('source') || document.referrer || 'direct';
  }

  function getN8nWebhookUrl() {
    return form.getAttribute('data-n8n-webhook') || '';
  }

  function validate() {
    var nameEl = document.getElementById('lm-name');
    var emailEl = document.getElementById('lm-email');
    var privacyEl = document.getElementById('lm-privacy');
    var ok = true;

    if (!nameEl.value.trim()) { nameEl.classList.add('bm-error'); ok = false; } else { nameEl.classList.remove('bm-error'); }
    if (!emailEl.value.trim() || emailEl.value.indexOf('@') === -1) { emailEl.classList.add('bm-error'); ok = false; } else { emailEl.classList.remove('bm-error'); }
    if (!privacyEl.checked) { privacyEl.classList.add('bm-error'); ok = false; } else { privacyEl.classList.remove('bm-error'); }

    return ok;
  }

  function notifyN8n(record) {
    var webhookUrl = getN8nWebhookUrl();
    if (!webhookUrl) return Promise.resolve({ skipped: true });

    return fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'INSERT',
        table: 'lead_magnet_downloads',
        schema: 'public',
        record: record,
        old_record: null
      })
    }).catch(function () {});
  }

  function notifyEdgeFunction(record) {
    return fetch(SUPABASE_URL + '/functions/v1/lead-magnet-notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': 'Bearer ' + SUPABASE_ANON
      },
      body: JSON.stringify({ record: record })
    }).catch(function () {});
  }

  function showSuccess() {
    form.classList.add('is-hidden');
    success.classList.add('is-visible');
    if (downloadBtn) {
      downloadBtn.href = PDF_PATH;
      downloadBtn.setAttribute('download', 'RAIS-Prozesshandbuch-2026.pdf');
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var nameEl = document.getElementById('lm-name');
    var emailEl = document.getElementById('lm-email');
    var marketingEl = document.getElementById('lm-marketing');
    var payload = {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      magnet_slug: MAGNET_SLUG,
      source: getSource(),
      privacy_ack: true,
      marketing_consent: !!(marketingEl && marketingEl.checked),
      consent_timestamp: new Date().toISOString()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gespeichert…';

    fetch(SUPABASE_URL + '/rest/v1/lead_magnet_downloads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': 'Bearer ' + SUPABASE_ANON,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (body) {
          throw new Error('save failed: ' + res.status + ' ' + body);
        });
      }
      return payload;
    }).then(function (record) {
      showSuccess();
      notifyN8n(record);
      notifyEdgeFunction(record);
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Prozesshandbuch herunterladen';
      alert('Speichern fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie an kevin@ritz-ai.solutions.');
    });
  });
}());
