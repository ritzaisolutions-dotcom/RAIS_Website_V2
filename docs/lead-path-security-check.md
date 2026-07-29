# Lead path security note (Stufe 1 check)
# Reviewed 2026-07-25 against .cursor/skills/cyber-security

- Client uses only publishable Supabase anon key from scripts/public-config.js (generated, not service role).
- Lead POST goes to Edge Function /functions/v1/submit-audit-lead (not direct table insert with elevated rights from browser).
- Booking modal: honeypot #bm-website, maxlength on name/email, privacy checkbox required, generic error copy (no stack traces).
- Cal.com opens in new tab without form fields in the URL.
- AQuT calculator: client-only, no network, no PII.
- Do not weaken validation or add secrets to the client when copying the contact/booking module across pages.

## Shell rule (Plan G)

Canonical shell: `scripts/page-shell.mjs`. After any Nav/Footer/Contact/Modal change run `npm run pages` (writes subpages + syncs Home shell via `scripts/sync-index-shell.mjs`). Do not hand-edit those blocks on `index.html` or generated HTML.
