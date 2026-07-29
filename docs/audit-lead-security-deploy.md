# Audit-Lead-Sicherheitsdeployment

Lead-Inhalte gehen nach **Notion + E-Mail**, nicht mehr in `inbound_leads`.
Supabase hält nur Rate-Limit (gehashte IP). Details: [`audit-lead-notion-email.md`](./audit-lead-notion-email.md).

## Status-Check (2026-07-25)

- Edge Function `submit-audit-lead` ist im Projekt `qdywaenmojdxhfxqbvun` **ACTIVE** (CLI: `supabase functions list`).
- Vor Live-Smoke trotzdem Secrets und Abnahme unten durchgehen (Deploy allein reicht nicht, wenn Notion/Mail/Salt fehlen).

## Deploy-Reihenfolge (Kevin)

1. Rate-Limit-SQL (bereits applied, falls nötig erneut):

   ```powershell
   Get-Content supabase\migrations\20260725_secure_audit_lead_submission.sql -Raw | supabase db query --linked
   ```

2. Secrets (Rate-Limit + Origins + Notion + Mail) — siehe Notion-Doc. Keine Secrets ins Repo oder in den Chat.

3. Function:

   ```powershell
   supabase functions deploy submit-audit-lead --project-ref qdywaenmojdxhfxqbvun
   ```

4. Frontend-Config:

   ```text
   CAL_COM_URL=https://ritz-ai-solutions.cal.eu/kevin/erstgespraech-mit-rais
   ```

   Wichtig: `SENTRY_DSN` und `SUPABASE_ANON_KEY` in `.env` müssen echte Werte sein. Danach `npm run config`.

5. nginx-CSP auf dem VPS aus [`deploy/nginx/ritz-ai.solutions.conf`](../deploy/nginx/ritz-ai.solutions.conf) aktivieren.

## Abnahme

| Check | Erwartung |
|---|---|
| Direkter `POST` auf `/rest/v1/inbound_leads` mit Anon-Key | `401` oder `403` (kein Client-Insert) |
| Gültiger Modal-POST an `/functions/v1/submit-audit-lead` | `201` + Notion-Eintrag + Notify-Mail |
| Spam / zu schnell | `429` (Rate-Limit) |
| Ungültige `data-value` / fehlende Privacy | `400` generisch, kein Stacktrace |
| Cal.com-Link | nur `https://ritz-ai-solutions.cal.eu/kevin/erstgespraech-mit-rais`, ohne Name/E-Mail in der URL |
| CSP live | erzwingend, nicht nur Report-Only |

Frontend-Pfad: [`scripts/booking-modal.js`](../scripts/booking-modal.js) → Edge Function (Publishable Key only).
