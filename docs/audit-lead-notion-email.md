# Audit-Leads → Notion CRM + E-Mail

Flow:

```text
Website Booking Modal
  → Edge Function submit-audit-lead
    → Validierung + Rate-Limit (Supabase, nur IP-Hash)
    → Notion CRM (Quelle = „Inbound Website“)
    → E-Mail an kevin@ritz-ai.solutions
```

Ziel-DB: [📋 CRM](https://www.notion.so/d24344bc71fc4704864cb30a0ff5fa18?v=46d372bc1184423098a36cd96549bfd0)

## Feld-Mapping

| Formular | CRM |
|---|---|
| Name | `Firma` (Titel) + `GF/Entscheider` |
| E-Mail | `E-Mail` |
| — | `Quelle` = **Inbound Website** |
| — | `Status` = Neu |
| — | `Quell-URL` = https://ritz-ai.solutions/ |
| Pain Point / ICP / Source | `Angriffspunkte` |
| Teamgröße | `Mitarbeiterzahl` (mapped) |

## 1. Notion Integration (einmalig)

1. [Notion My Integrations](https://www.notion.so/my-integrations) → **New integration**
2. Name z. B. `RAIS Website → CRM`
3. Token kopieren (`secret_…`)
4. In Notion die DB **CRM** öffnen → `⋯` → **Connections** → Integration verbinden
5. Secrets setzen:

```powershell
supabase secrets set NOTION_TOKEN="secret_..." NOTION_AUDIT_LEADS_DATABASE_ID="d24344bc71fc4704864cb30a0ff5fa18" AUDIT_LEAD_NOTIFY_EMAIL="kevin@ritz-ai.solutions" --project-ref qdywaenmojdxhfxqbvun
```

## 2. E-Mail

SMTP nutzt vorhandene `LEAD_MAGNET_SMTP_*`-Secrets (Hostinger) bzw. optional:

```powershell
supabase secrets set AUDIT_LEAD_NOTIFY_WEBHOOK_URL="https://DEINE-N8N/webhook/audit-lead" --project-ref qdywaenmojdxhfxqbvun
```

## 3. Deploy

```powershell
supabase functions deploy submit-audit-lead --project-ref qdywaenmojdxhfxqbvun
```

## Abnahme

- Formular → CRM-Eintrag mit `Quelle = Inbound Website`, `Status = Neu`
- Mail an `kevin@ritz-ai.solutions`
- Kein Lead-Inhalt in Supabase `inbound_leads`
