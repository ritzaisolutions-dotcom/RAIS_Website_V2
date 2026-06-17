-- Not applied automatically. Review against the actual production schema
-- (Supabase Dashboard / `supabase db pull`) before running this migration,
-- since cookie_consents and inbound_leads were originally created outside
-- of this migrations folder.

-- ─────────────────────────────────────────────────────
-- cookie_consents: anon INSERT currently fails (HTTP 401) because no
-- policy exists. Add a policy that allows the consent logger in
-- klaro-config.js to insert, while constraining the payload shape.
-- ─────────────────────────────────────────────────────
alter table if exists public.cookie_consents enable row level security;

drop policy if exists anon_insert_cookie_consents on public.cookie_consents;
create policy anon_insert_cookie_consents
  on public.cookie_consents
  for insert
  to anon
  with check (
    consent_id is not null
    and consent_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and page_url is not null
    and char_length(page_url) <= 500
  );

grant insert on public.cookie_consents to anon;

-- ─────────────────────────────────────────────────────
-- inbound_leads: add booking-modal columns + tighten insert policy.
-- Legacy columns website_status / biggest_challenge remain for older rows.
-- ─────────────────────────────────────────────────────
alter table if exists public.inbound_leads
  add column if not exists pain_point text;

alter table if exists public.inbound_leads
  add column if not exists team_size text;

alter table if exists public.inbound_leads
  add column if not exists privacy_ack boolean not null default false;

alter table if exists public.inbound_leads
  add column if not exists consent_timestamp timestamptz not null default now();

alter table if exists public.inbound_leads enable row level security;

drop policy if exists anon_insert_inbound_leads on public.inbound_leads;
create policy anon_insert_inbound_leads
  on public.inbound_leads
  for insert
  to anon
  with check (
    privacy_ack = true
    and name is not null and char_length(name) between 1 and 200
    and email is not null and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and (pain_point is null or pain_point in (
      'onboarding', 'nachverfolgung', 'kommunikation', 'dokumentation', 'anderes'
    ))
    and (team_size is null or char_length(team_size) <= 20)
  );

grant insert on public.inbound_leads to anon;

-- ─────────────────────────────────────────────────────
-- lead_magnet_downloads: replace the unconditional `with check (true)`
-- with field validation (see 20260615_create_lead_magnet_downloads.sql).
-- ─────────────────────────────────────────────────────
drop policy if exists anon_insert_lead_magnet_downloads on public.lead_magnet_downloads;
create policy anon_insert_lead_magnet_downloads
  on public.lead_magnet_downloads
  for insert
  to anon
  with check (
    privacy_ack = true
    and name is not null and char_length(name) between 1 and 200
    and email is not null and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(magnet_slug) <= 100
    and (source is null or char_length(source) <= 500)
  );
