# CLAUDE.md

## Project Goal
Redesign the current RAIS website into a restaurant-niche V2.
The website should target restaurant owners and position RAIS as a practical, premium, operations-aware partner.

## Primary Constraint
Reuse the existing technical foundation wherever reasonable.
Change the frontend feel, copy, hierarchy, visual language, and presentation without introducing unnecessary rebuilds.

## Design Authority
`brand.md` is the primary brand and messaging authority for this repo.
`brand_steer.md` is the visual execution and appearance authority derived from `brand.md`.

When making visual or copy decisions:
1. follow `brand.md` first
2. follow `brand_steer.md` for visual and layout execution
3. prefer restaurant-specific clarity over generic web design patterns
4. reject any choice that drifts toward generic SaaS, AI agency, or startup aesthetics

## Workflow Rules
- Propose a short plan before large edits
- Avoid random redesign drift
- Keep the direction aligned with the restaurant-owner niche
- Prefer focused edits over uncontrolled page-wide rewrites
- When in doubt, simplify rather than embellish

## Content Rules
- Write in German unless explicitly asked otherwise
- Keep language simple, grounded, and commercially credible
- Avoid jargon-heavy AI phrasing
- Sell business outcomes, not technical novelty
- Keep restaurant-owner comprehension as the top priority

## Structural Rules
- Preserve deployability
- Avoid unnecessary rewrites
- Prefer editing existing files over rebuilding the project from scratch
- Reuse working structure, scripts, legal pages, and integrations where possible
- Do not remove legal or compliance-related content without a clear reason
- Keep the website compatible with the current hosting and development workflow unless explicitly changing it

## File Priorities
Primary files to edit first:
- `index.html`
- `datenschutz.html`
- `impressum.html`
- `impressum-en.html`
- shared styles or assets already used by the live site

Secondary references:
- exported legacy files in `temp_zip_content/`
- existing prompt or steering files such as `.bolt/prompt`

## What Not to Change Casually
- Existing legal structure
- Working technical integrations
- Reservation logic without reason
- Cookie or privacy baseline
- Branding assets unless a change is intentional and justified

## Prompt Handling Rules
When asked to redesign or refine:
- use `brand.md` as the style authority
- use `brand_steer.md` as the appearance authority
- explain briefly what changed and why
- keep edits tied to concrete business and UX goals
- avoid replacing the brand with a template aesthetic

When a prompt conflicts with `brand.md` or `brand_steer.md`:
- highlight the conflict briefly
- prefer the brand direction unless the user explicitly overrides it

## Output Rules
When changing sections, explain briefly:
- what changed
- why it changed

Keep explanations short and practical.
Do not produce long design theory unless asked.

## Quality Standard
The site should feel:
- specific
- premium
- warm
- useful
- non-generic

If an update makes the site feel like a template, a startup landing page, or a generic AI agency, revise it before considering the task done.
