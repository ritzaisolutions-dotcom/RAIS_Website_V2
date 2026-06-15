/**
 * Simuliert den Supabase-Database-Webhook-Payload gegen die n8n-Webhook-URL.
 *
 * Usage:
 *   N8N_WEBHOOK_URL="https://DEINE-N8N-URL/webhook/lead-magnet-download" node scripts/test-lead-magnet-webhook.mjs
 */

const LOG_ENDPOINT = 'http://127.0.0.1:7796/ingest/75088f27-bfbd-48c4-b661-f653e547a554';
const SESSION_ID = 'bca8c9';

function debugLog(hypothesisId, location, message, data) {
  // #region agent log
  fetch(LOG_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: SESSION_ID,
      runId: process.env.DEBUG_RUN_ID || 'webhook-test',
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

const webhookUrl = process.env.N8N_WEBHOOK_URL;

if (!webhookUrl) {
  console.error('Fehler: N8N_WEBHOOK_URL fehlt.');
  console.error('Beispiel: N8N_WEBHOOK_URL=https://n8n.example.com/webhook/lead-magnet-download node scripts/test-lead-magnet-webhook.mjs');
  process.exit(1);
}

const payload = {
  type: 'INSERT',
  table: 'lead_magnet_downloads',
  schema: 'public',
  record: {
    id: '00000000-0000-4000-8000-000000000099',
    created_at: new Date().toISOString(),
    name: 'Webhook Test',
    email: 'webhook-test@example.com',
    magnet_slug: 'prozesshandbuch-2026',
    source: 'cli-test',
    privacy_ack: true,
    marketing_consent: false,
    consent_timestamp: new Date().toISOString(),
  },
  old_record: null,
};

debugLog('H1', 'test-lead-magnet-webhook.mjs:start', 'Sending test payload', {
  webhookHost: new URL(webhookUrl).host,
  table: payload.table,
});

const res = await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

const text = await res.text();

debugLog('H2', 'test-lead-magnet-webhook.mjs:response', 'Webhook response received', {
  status: res.status,
  ok: res.ok,
  bodyPreview: text.slice(0, 200),
});

console.log('Status:', res.status);
console.log('Body:', text);

if (!res.ok) {
  debugLog('H3', 'test-lead-magnet-webhook.mjs:fail', 'Webhook returned error status', { status: res.status });
  process.exit(1);
}

debugLog('H4', 'test-lead-magnet-webhook.mjs:success', 'Webhook accepted payload', { status: res.status });
console.log('OK — prüfe n8n Executions und Posteingang kevin@ritz-ai.solutions');
