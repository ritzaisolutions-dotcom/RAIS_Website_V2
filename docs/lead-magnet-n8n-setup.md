# Lead-Magnet: n8n E-Mail-Benachrichtigung

Bei jedem INSERT in `lead_magnet_downloads` → E-Mail an `kevin@ritz-ai.solutions`.

## Architektur

```
Website Formular → Supabase INSERT → lead-magnet-notify (Edge Function)
                                      ├─ Telegram (sofort, wenn konfiguriert)
                                      └─ n8n Webhook (E-Mail an kevin@ritz-ai.solutions)
```

**Edge Function:** `lead-magnet-notify` (bereits deployed)  
**URL:** `https://qdywaenmojdxhfxqbvun.supabase.co/functions/v1/lead-magnet-notify`

Die Website ruft diese Function nach erfolgreichem INSERT automatisch auf (`scripts/lead-magnet.js`).

---

## Schritt 0: Benachrichtigung aktivieren (eine Option reicht)

### Option A — Direkt per SMTP (empfohlen, ohne n8n)

Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**:

| Secret | Wert |
|--------|------|
| `LEAD_MAGNET_SMTP_USER` | `kevin@ritz-ai.solutions` |
| `LEAD_MAGNET_SMTP_PASS` | Hostinger-Mail-Passwort |
| `LEAD_MAGNET_SMTP_HOST` | `smtp.hostinger.com` (optional) |
| `LEAD_MAGNET_SMTP_PORT` | `465` (optional) |

Die Edge Function `lead-magnet-notify` versendet dann E-Mails direkt.

### Option B — Über n8n (falls SMTP in n8n schon läuft)

| Secret | Wert |
|--------|------|
| `N8N_LEAD_MAGNET_WEBHOOK_URL` | `https://DEINE-N8N-URL/webhook/lead-magnet-download` |

**Telegram** funktioniert zusätzlich automatisch (bestehende Bot-Secrets).

---

## Schritt 1: n8n-Workflow importieren (nur bei Option B)

1. n8n öffnen (Hostinger-Instanz)
2. **Workflows** → **Import from File**
3. Datei: [`docs/n8n/lead-magnet-download-email.workflow.json`](n8n/lead-magnet-download-email.workflow.json)
4. Workflow öffnen → Node **E-Mail senden** → SMTP-Credential verknüpfen

### Hostinger SMTP (falls noch nicht in n8n)

| Feld | Wert |
|------|------|
| Host | `smtp.hostinger.com` |
| Port | `465` (SSL) oder `587` (TLS) |
| User | `kevin@ritz-ai.solutions` |
| Passwort | Hostinger-Mail-Passwort |
| From | `kevin@ritz-ai.solutions` |

5. Workflow **aktivieren** (Toggle oben rechts)
6. **Production Webhook-URL** kopieren aus Node „Webhook Supabase INSERT“  
   Format: `https://DEINE-N8N-DOMAIN/webhook/lead-magnet-download`

---

## Schritt 2: Supabase Database Webhook

1. [Supabase Dashboard](https://supabase.com/dashboard/project/qdywaenmojdxhfxqbvun) → **Database** → **Webhooks**
2. **Create a new hook**
3. Einstellungen:

| Feld | Wert |
|------|------|
| Name | `lead_magnet_download_notify` |
| Table | `lead_magnet_downloads` |
| Events | `INSERT` |
| Type | `HTTP Request` |
| Method | `POST` |
| URL | n8n Production-Webhook-URL aus Schritt 1 |
| HTTP Headers | optional: `Content-Type: application/json` |

4. Speichern

---

## Schritt 3: Test (CLI)

```powershell
$env:N8N_WEBHOOK_URL="https://DEINE-N8N-URL/webhook/lead-magnet-download"
node scripts/test-lead-magnet-webhook.mjs
```

Erwartung:
- CLI: `Status: 200`
- n8n: Execution grün
- Posteingang: E-Mail „Neuer Lead-Magnet-Download: RAIS Prozesshandbuch“

## Schritt 4: End-to-End (Live-Seite)

1. `prozesshandbuch.html` öffnen
2. Formular ausfüllen und absenden
3. Supabase → `lead_magnet_downloads` → neuer Eintrag
4. n8n Execution + E-Mail prüfen

---

## Fehlerbehebung

| Symptom | Ursache | Lösung |
|---------|---------|--------|
| n8n 404 | Workflow nicht aktiv oder Test-URL statt Production | Workflow aktivieren, Production-URL in Supabase |
| n8n Execution rot „Kein record.email“ | Payload-Format anders | Code-Node prüft `body.record` und `record` |
| Supabase Webhook feuert nicht | Hook nicht auf INSERT | Webhook-Events prüfen |
| E-Mail kommt nicht | SMTP falsch | Hostinger SMTP in n8n testen (Send Test Email) |

---

## SQL-Schnelltest (Supabase SQL Editor)

```sql
insert into lead_magnet_downloads (name, email, source, privacy_ack)
values ('SQL Test', 'sql-test@example.com', 'sql-manual', true);
```
