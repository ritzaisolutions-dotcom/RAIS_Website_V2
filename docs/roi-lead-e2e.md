# ROI Lead E2E And Alert Wiring

This repo now includes a repeatable smoke test for the live ROI lead webhook:

```bash
node scripts/roi-lead-smoke-test.mjs
```

Optional overrides:

```bash
node scripts/roi-lead-smoke-test.mjs --url https://your-n8n/webhook/rais-roi-report-lead --restaurant "Test Bistro" --email test@example.com
```

What the test verifies:

- The payload contract from the website matches the n8n webhook expectations.
- The webhook responds with a success or validation error in JSON.
- The live endpoint is reachable from the client side.

Before the live test, import the updated [rais_roi_report_leads_prod.json](/C:/Users/kevin/OneDrive/Desktop/RAIS/Google%20Antigravity%20Projects/TRW_22_02_2026/RAIS_WEBSITE_LIVE/RAIS_WEBSITE_LIVE-1/n8n/rais_roi_report_leads_prod.json) into n8n and activate the workflow. The currently deployed workflow still returns `Unused Respond to Webhook node found in the workflow`, which indicates the old version is still live.

What still needs to be confirmed in the stack after each test:

1. Open the latest n8n execution for `RAIS ROI Report Leads Prod`.
2. Confirm `Insert Lead` ran for valid payloads or `Insert Rejection` ran for invalid payloads.
3. If `RAIS_ALERT_WEBHOOK_URL` is configured, confirm `Send Alert` ran.
4. Check Supabase for the stored row:

```sql
select
  submitted_at,
  business_name,
  email,
  source,
  monthly_loss,
  annual_loss,
  processing_status
from public.roi_leads
order by submitted_at desc
limit 10;
```

Useful rejection query:

```sql
select
  submitted_at,
  business_name,
  email,
  validation_errors
from public.roi_lead_rejections
order by submitted_at desc
limit 10;
```

Alert wiring notes:

- The workflow now only calls `Send Alert` when `RAIS_ALERT_WEBHOOK_URL` is non-empty.
- Lead capture still returns `200` when alerting is intentionally not configured yet.
- A bad alert destination can still fail the alert node itself, so the first live test should use a real Slack, Teams, Discord, or relay webhook.

Recommended live test sequence:

1. Run the smoke test with a unique email alias.
2. Confirm the row appears in `public.roi_leads`.
3. Confirm the alert arrives in the chosen channel.
4. Run one invalid test with `--consent false` and confirm it lands in `public.roi_lead_rejections`.
