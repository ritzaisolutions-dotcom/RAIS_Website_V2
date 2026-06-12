# CLAUDE.md

## Project Goal

Position RAIS as a practical, premium, commercially serious partner for **process automation and internal AI systems**, with a **clear but not exclusive focus on Makler and Hausverwaltungen**.

The website should sell measurable relief from manual admin work (portal inquiries, object files, team communication), not abstract technology or generic agency services.

## Primary Constraint

Reuse the current technical foundation wherever reasonable.
Prefer targeted edits to copy, hierarchy, and presentation over unnecessary rebuilds.

The site is a **single-page** experience: `index.html` is the only marketing surface.

## Design Authority

`brand.md` defines positioning and messaging.
`brand_steer.md` defines visual execution.

When making visual or copy decisions:

1. follow `brand.md` first
2. follow `brand_steer.md` second
3. prefer outcome-specific clarity over generic design patterns
4. reject anything that reads like a template, generic agency, or AI-hype landing page

## Workflow Rules

- propose a short plan before large edits
- avoid random redesign drift
- keep the direction aligned with automation outcomes for property teams
- prefer focused edits over uncontrolled rewrites
- simplify rather than embellish when unsure

## Content Rules

- write in German on the website unless explicitly asked otherwise
- keep language commercially credible and easy to scan
- sell business outcomes, not technical novelty
- avoid jargon-heavy AI phrasing
- do not invent proof, statistics, or case evidence
- **no em dashes (—) in visible copy**; use periods or commas

## Structural Rules

- preserve deployability
- avoid unnecessary rewrites
- reuse working legal pages and integrations where possible
- do not remove legal or compliance content without reason
- keep the site compatible with the current hosting and development workflow unless explicitly changing it

## File Priorities

Primary files:

- `index.html`
- `styles/antigravity-polish.css`
- `scripts/collab-path.js`
- `brand.md`
- `brand_steer.md`
- `CLAUDE_CODE_INSTRUCTIONS.md`

Secondary:

- `impressum.html`, `datenschutz.html`
- `RAIS_Website_Repositionierung.md` (live copy reference)
- `.htaccess` (redirects, 410 for removed trade pages)

**Obsolete / removed from repo:** `landingpage.html`, trade niche pages (`fliesenleger.html`, etc.)

## What Not to Change Casually

- legal structure and privacy logic unless data flows change
- working Calendly and Klaro consent logic
- branding assets without reason
- `#collab-path` JS behavior unless explicitly requested
- booking modal `data-value` keys (Supabase compatibility)
- hero image and tech ticker without reason

## Copy Quality Standard

The site should feel:

- specific
- premium
- useful
- believable
- non-generic

If a page could fit any random automation consultant, it is not sharp enough.
If Immobilien copy sounds like a full vertical rebrand instead of a credible focus, it is too narrow.
