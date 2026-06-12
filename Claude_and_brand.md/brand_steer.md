# RAIS Brand Steer

## Purpose

This file governs visual execution for the current RAIS website.
`brand.md` defines positioning and messaging.
`brand_steer.md` translates that into on-screen decisions.

Authority order:

1. `brand.md`
2. `brand_steer.md`
3. page files (`index.html`, CSS)

## Core Appearance Goal

RAIS should look like commercial clarity with editorial restraint.

That means:

- warm
- premium
- composed
- credible for operations-heavy teams (property admin, not consumer glam)
- more like a serious proposal than a startup landing page

## Anti-Goals

Do not drift into:

- generic agency aesthetics
- generic SaaS card grids
- “AI agency” visual language
- dark tech theatrics
- decorative effects that weaken trust
- fake portal branding or misleading product screenshots

## Layout Steering

Prefer:

- clear section rhythm: hero → ticker → leistungen → use cases → process → contact
- strong copy hierarchy
- framed offer areas for the three pillars
- expanding cards for use cases (interactive, first card active by default)
- visible seriousness around contact and legal trust

Avoid:

- repeating the same card treatment section after section without purpose
- multiple equally loud CTAs
- ornamental layout moves with no sales purpose

## Surface Strategy

Primary atmosphere:

- Cloud and Warm Linen
- calm tonal layering
- subtle paper-like contrast

Support structure:

- Sage and Dark Pistachio
- Charcoal and Stone for legibility

Accent:

- Mandarin Orange for action and key emphasis only

Do not let orange become the dominant atmosphere.

## Typography Steering

Headlines should feel editorial and commercially serious.
Body copy should stay plain, readable, and direct.

Mono cues are allowed for:

- small labels (`mono-label`)
- restrained system markers
- support framing

Mono must not become the dominant voice.

## Module Rules

### Hero

The hero should communicate one clear offer for the focus audience.

Use:

- a strong outcome claim (less manual admin, measurable, no SaaS ballast)
- one clear supporting paragraph (portals, files, communication)
- primary CTA: audit booking
- secondary CTA: use cases
- proof strip with credible, niche-relevant labels

Avoid:

- vague growth language
- product menus in the hero
- em dashes in copy

### Offer Section (`#leistungen`)

Use:

- one main pillar (Prozessautomatisierung)
- two extensions (KI, digitale Präsenz)
- bullets that name real workflows (portal mail, object files, RAG, exposé landing)

### Use Cases (`#projekte`)

Use:

- three expanding cards, immobilien-nah but technically honest
- gradient or real screenshots that match the copy
- CTA to booking on cards, not fake “live demo” links unless real

Do not:

- show ImmoScout24 logos without license
- reuse onboarding screenshots with mismatched titles

### Collaboration Path (`#zusammenarbeit-prozess`)

Use:

- organic wave path, 7 steps, German copy
- interactive stepper (`collab-path.js`)
- step 1 = free intro call

Change structure/JS only when explicitly requested.

### Homepage Role

The homepage is the **entire funnel**: explain, prove, process, book.

It should:

- qualify property-heavy teams without excluding others
- present Kevin Ritz as direct builder contact
- avoid feeling like a one-person portfolio page

There are **no** separate niche HTML pages in the repo anymore.

### Trust Section

Demo/use-case sections should be honest.

Use:

- “Use Cases” / concrete workflow language
- direct founder access in contact
- visible legal links

Do not fake proof or partner status.

## Visual Proof Guidance

Use real screenshots only when copy matches.
Placeholder gradients are fine for integrations that cannot show branded UI.

## Quality Check

Before shipping, ask:

- does this page sell one clear thing?
- does this feel credible to a skeptical Makler or Verwalter?
- is the CTA concrete?
- is trust handled honestly?
- are there em dashes in visible copy? (remove)

If the answer fails any of these, revise before shipping.
