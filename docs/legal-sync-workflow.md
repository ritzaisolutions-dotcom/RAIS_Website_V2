# Legal Sync Workflow

`eRecht24` remains the generator base, but not the final authority for every live data flow.

## Fixed workflow

1. Clean the `eRecht24` project before every import.
2. Keep only real generator-supported services in `eRecht24`.
3. Import the texts.
4. Re-apply the template delta through `rais_rechtstexte/tpl/*`.
5. Copy the generated root legal pages back into the repo.
6. Deploy only after root files and templates match again.

## Generator-supported baseline

- Hosting
- CCM19
- Calendly
- Google Gemini API
- Local Google Fonts
- General contact and contract processing

## Manual delta that must remain in templates

- Supabase
- Self-hosted `n8n` at Hostinger
- Any stack-specific legal clarifications not modeled cleanly by `eRecht24`
- Branding and `§ 19 UStG` notice in the legal notice wrapper

## Hard rules

- Do not reintroduce `Telegram`, `X/Twitter`, `Google Analytics` or `Cookiebot` unless they are truly live again.
- Do not publish the normal German tax number in the legal notice.
- If live legal pages are changed via import, sync them back into git before the next deploy.
