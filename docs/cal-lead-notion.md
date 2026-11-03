# Cal-Buchungen → Notion CRM

```text
Cal.com BOOKING_CREATED
  → Edge Function submit-cal-lead
    → Notion CRM (Quelle = „Inbound Website“)
    → Notify-Mail an kevin@ritz-ai.solutions
```

Kein Lead-Inhalt in Supabase. Supabase hält nur die Relay-Function und Secrets.
Bestehende Credential: `NOTION_TOKEN` + `NOTION_AUDIT_LEADS_DATABASE_ID` (gleiche wie Audit-Leads).

## Feld-Mapping

| Cal | Notion CRM |
|---|---|
| Name | `Firma` (Titel) + `GF/Entscheider` |
| E-Mail | `E-Mail` |
| Telefon | in `Angriffspunkte` |
| pain / sales_per_year / social_media | `Angriffspunkte` |
| — | `Quelle` = **Inbound Website** |
| — | `Status` = Neu |
| — | `Quell-URL` = https://ritz-ai.solutions/ |

## Webhook in Cal.com (einmalig)

1. Event öffnen: [strategiegespraech-mit-rais](https://app.cal.com/event-types/7317278) → Webhooks / Developer
2. Subscriber URL:

   ```text
   https://qdywaenmojdxhfxqbvun.supabase.co/functions/v1/submit-cal-lead
   ```

3. Trigger: **BOOKING_CREATED**
4. Secret = Wert von Supabase Secret `CAL_WEBHOOK_SECRET` (Dashboard → Edge Functions → Secrets)
5. Speichern, aktiv lassen

## Deploy

```powershell
supabase functions deploy submit-cal-lead --project-ref qdywaenmojdxhfxqbvun
```

## Abnahme

- Testbuchung → CRM-Eintrag mit `Quelle = Inbound Website`
- Mail an kevin@ritz-ai.solutions
- Kein neuer Row in `inbound_leads`
