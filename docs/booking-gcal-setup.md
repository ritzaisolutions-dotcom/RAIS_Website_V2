# Google Calendar für RAIS Booking

Die Edge Functions lesen FreeBusy und schreiben Events nur, wenn diese Secrets gesetzt sind:

| Secret | Inhalt |
| --- | --- |
| `GOOGLE_CALENDAR_CLIENT_ID` | OAuth Client ID (Google Cloud) |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | OAuth Client Secret |
| `GOOGLE_CALENDAR_REFRESH_TOKEN` | Refresh-Token für Kevin’s Kalenderkonto |
| `BOOKING_IP_SALT` | optional, Salt für IP-Hash |
| `RESEND_API_KEY` | optional, Confirm-Mail an Lead + Kevin |
| `BOOKING_MAIL_FROM` | optional, Absender (default `RAIS <kevin@ritz-ai.solutions>`) |
| `BOOKING_MAIL_INTERNAL` | optional, interne Kopie (default Kevin) |

## Einmalig einrichten

1. Google Cloud Projekt → APIs: **Google Calendar API** aktivieren.
2. OAuth-Client (Desktop oder Web) anlegen, Redirect `http://localhost` reicht für den Token-Austausch.
3. Scopes: `https://www.googleapis.com/auth/calendar` (oder `calendar.events` + freebusy).
4. Auth-Code gegen Tokens tauschen, **Refresh-Token** speichern.
5. In Supabase Edge Function Secrets setzen (Dashboard → Edge Functions → Secrets) oder lokal in `.env` für `supabase functions serve`.

Ohne diese Secrets liefern `booking-availability` trotzdem Slots aus den Wochenfenstern (ohne FreeBusy). `booking-book` speichert die Buchung; `gcalSynced` bleibt `false` und Status kann `sync_failed` werden, bis Secrets stehen.

`booking_event_types.gcal_calendar_id` default `primary`. Für einen eigenen Kalender die Calendar-ID dort setzen.

## Legacy: `submit-audit-lead`

Die alte Audit-Lead-Edge (`submit-audit-lead` + Cal.com-Pfad) wird vom Frontend nicht mehr aufgerufen. Neue Buchungen laufen über `booking-book` / `booking-availability`. Die Function darf in Supabase liegen bleiben, bis ein separates Cleanup sie entfernt — nicht neu verdrahten.

## Absagen (CRM)

**Source of truth ist die DB:** Status `cancelled` in `public.bookings` freigibt den Slot. Das CRM setzt nur diesen Status.

**Google-Calendar-Delete** (Event über `gcal_event_id` löschen) ist Phase-2 und bewusst noch nicht verdrahtet: erst wenn die OAuth-Secrets oben stehen und ein stabiler Delete-Pfad getestet ist. Bis dahin kann nach einer Absage ein Orphan-Event im Google-Kalender bleiben — manuell löschen oder später nachziehen.
