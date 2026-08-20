# KI-Roadmap Funnel: Consent, Supabase, n8n

Qualifizierung bleibt im Fragenblock auf `/ai-roadmap.html`. Cal bekommt dieselben Angaben per Prefill: Name, E-Mail, Telefon, `anfragen-pro-woche`, `engpass`, `crm`. Die Identifier im Cal-Dashboard müssen exakt so heißen. CRM, Kalender und Postfach bleiben im Funnel (Schritt 3), die Spalten in `funnel_leads` werden dort gefüllt.

## Ablauf

```
Fragenblock absenden
  → Edge Function submit-funnel-lead
      → funnel_leads (Lead-Daten)
      → form_consents (Art. 7: Häkchen + Wortlaut)
      → Webhook n8n
          → Mail an kevin@ritz-ai.solutions
          → Bestätigung an den User (Cal-Link)
          → nach 24 Stunden Reminder an den User
```

Ohne `FUNNEL_LEAD_NOTIFY_WEBHOOK_URL` sendet die Function Kevin-Mail und User-Bestätigung selbst per SMTP. Der 24-Stunden-Reminder braucht n8n.

---

## Schritt 0: n8n-Workflow importieren

1. n8n öffnen (Hostinger-Instanz)
2. **Workflows** → **Import from File**
3. Datei: [`docs/n8n/funnel-lead.workflow.json`](n8n/funnel-lead.workflow.json)
4. SMTP-Credential an die drei Mail-Nodes hängen (Mail an Kevin, Bestätigung an User, Reminder an User)

### Hostinger SMTP (falls noch nicht in n8n)

| Feld | Wert |
|------|------|
| Host | `smtp.hostinger.com` |
| Port | `465` (SSL) oder `587` (TLS) |
| User | `kevin@ritz-ai.solutions` |
| Passwort | Hostinger-Mail-Passwort |
| From | `kevin@ritz-ai.solutions` |

5. Workflow **aktivieren**
6. Production-Webhook-URL kopieren aus Node „Webhook Funnel Lead“  
   Format: `https://DEINE-N8N-DOMAIN/webhook/funnel-lead`

---

## Schritt 1: Supabase Secret

Dashboard → Project `qdywaenmojdxhfxqbvun` → **Edge Functions** → **Secrets**:

| Secret | Wert |
|--------|------|
| `FUNNEL_LEAD_NOTIFY_WEBHOOK_URL` | n8n Production-URL aus Schritt 0 |

Bestehende Secrets (`RAIS_ALLOWED_ORIGINS`, Rate-Limit-Salt, SMTP-Fallback, Notion) bleiben.

---

## Schritt 2: Test

1. `/ai-roadmap.html` durchspielen und absenden
2. Supabase → `funnel_leads`: neuer Lead
3. Supabase → `form_consents`: zwei Zeilen (`privacy_ack` erteilt, `marketing` erteilt oder nicht)
4. Posteingang Kevin: „Neuer Funnel-Lead: …“
5. Posteingang User: Bestätigung mit Cal-Link
6. n8n: Execution wartet 24 Stunden, danach Reminder

SQL-Kontrolle:

```sql
select id, email, created_at from funnel_leads order by created_at desc limit 5;

select lead_id, email, purpose, granted, consent_version, left(text_version, 80)
from form_consents
order by created_at desc
limit 10;
```

---

## Fehlerbehebung

| Symptom | Ursache | Lösung |
|---------|---------|--------|
| n8n 404 | Workflow nicht aktiv oder Test-URL | Workflow aktivieren, Production-URL ins Secret |
| Function 201, keine Mails | Webhook-Secret fehlt und SMTP fehlt | Secret oder SMTP setzen |
| Reminder kommt nicht | Wait-Node, Workflow inaktiv | Workflow aktiv lassen; Wait braucht laufende Instanz |
| Consent-Zeilen fehlen | Function-Version alt | `submit-funnel-lead` neu deployen |
