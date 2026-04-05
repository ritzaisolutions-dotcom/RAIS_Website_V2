const defaultWebhookUrl = process.env.RAIS_REPORT_WEBHOOK_URL || 'https://n8n.ritz-ai.solutions/webhook/rais-roi-report-lead';

function parseArgs(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith('--')) {
      continue;
    }

    const key = current.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      options[key] = 'true';
      continue;
    }

    options[key] = next;
    index += 1;
  }

  return options;
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createPayload(options) {
  const missedReservationsPerWeek = toNumber(options.missed, 7);
  const averageGuestsPerReservation = toNumber(options.guests, 3);
  const averageSpendPerGuest = toNumber(options.spend, 42);
  const monthlyLoss = Math.round(missedReservationsPerWeek * averageGuestsPerReservation * averageSpendPerGuest * 4.33);
  const annualLoss = monthlyLoss * 12;
  const savedReservations = Math.round(missedReservationsPerWeek * 4.33);
  const paybackWeeks = monthlyLoss > 0 ? Number((((3499) / monthlyLoss) * 4.33).toFixed(1)) : 0;

  return {
    email: options.email || `smoke-test+${Date.now()}@ritz-ai.solutions`,
    restaurant: options.restaurant || 'RAIS Smoke Test Restaurant',
    consent: options.consent ? options.consent !== 'false' : true,
    report: {
      missedReservationsPerWeek,
      averageGuestsPerReservation,
      averageSpendPerGuest,
      monthlyLoss,
      annualLoss,
      savedReservations,
      paybackWeeks
    },
    source: options.source || 'impact-report-smoke-test',
    page: options.page || 'https://ritz-ai.solutions/#impact',
    createdAt: new Date().toISOString()
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const webhookUrl = options.url || defaultWebhookUrl;

  if (!webhookUrl) {
    throw new Error('Missing webhook URL. Set RAIS_REPORT_WEBHOOK_URL or pass --url.');
  }

  const payload = createPayload(options);
  console.log(`Posting ROI lead smoke test to ${webhookUrl}`);
  console.log(JSON.stringify(payload, null, 2));

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const rawBody = await response.text();
  let parsedBody = rawBody;

  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    // Keep raw text if the response is not JSON.
  }

  console.log(`Response status: ${response.status} ${response.statusText}`);
  console.log('Response body:');
  console.log(typeof parsedBody === 'string' ? parsedBody : JSON.stringify(parsedBody, null, 2));

  if (!response.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Smoke test failed:', error);
  process.exitCode = 1;
});
