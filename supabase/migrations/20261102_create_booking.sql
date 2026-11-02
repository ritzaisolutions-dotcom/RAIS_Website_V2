-- RAIS Custom Booking: Erstgespräch ohne Cal.com.
-- Source of Truth in Supabase. Google Calendar nur Spiegel.
-- Anon: kein Tabellen-Zugriff. Inserts nur über Edge Functions (service_role).
-- Staff (sales.is_app_user): Config und Buchungen lesen/schreiben.

begin;

create extension if not exists pgcrypto;

-- ── Event types ──────────────────────────────────────────────
create table if not exists public.booking_event_types (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  duration_min integer not null default 45 check (duration_min > 0 and duration_min <= 480),
  buffer_before_min integer not null default 0 check (buffer_before_min >= 0),
  buffer_after_min integer not null default 0 check (buffer_after_min >= 0),
  min_notice_hours integer not null default 24 check (min_notice_hours >= 0),
  horizon_days integer not null default 28 check (horizon_days > 0 and horizon_days <= 120),
  timezone text not null default 'Europe/Berlin',
  gcal_calendar_id text not null default 'primary',
  active boolean not null default true
);

-- ── Weekly availability windows ──────────────────────────────
-- weekday: 1=Montag … 7=Sonntag (ISO, wie Haller-Editor)
create table if not exists public.booking_availability (
  id uuid primary key default gen_random_uuid(),
  event_type_id uuid not null references public.booking_event_types(id) on delete cascade,
  weekday smallint not null check (weekday between 1 and 7),
  start_time time not null,
  end_time time not null,
  active boolean not null default true,
  constraint booking_availability_span check (start_time < end_time)
);

create index if not exists booking_availability_event_idx
  on public.booking_availability (event_type_id, weekday);

-- ── Blackouts ────────────────────────────────────────────────
create table if not exists public.booking_blackouts (
  id uuid primary key default gen_random_uuid(),
  event_type_id uuid not null references public.booking_event_types(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  constraint booking_blackouts_span check (starts_at < ends_at)
);

create index if not exists booking_blackouts_event_idx
  on public.booking_blackouts (event_type_id, starts_at, ends_at);

-- ── Questions ────────────────────────────────────────────────
create table if not exists public.booking_questions (
  id uuid primary key default gen_random_uuid(),
  event_type_id uuid not null references public.booking_event_types(id) on delete cascade,
  sort integer not null default 0,
  key text not null,
  label text not null,
  type text not null check (type in ('single', 'multi', 'number', 'text', 'boolean')),
  required boolean not null default true,
  options jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  unique (event_type_id, key)
);

create index if not exists booking_questions_event_idx
  on public.booking_questions (event_type_id, sort);

-- ── Rules (proceed / reject) ─────────────────────────────────
create table if not exists public.booking_rules (
  id uuid primary key default gen_random_uuid(),
  event_type_id uuid not null references public.booking_event_types(id) on delete cascade,
  sort integer not null default 0,
  name text not null,
  condition jsonb not null default '{}'::jsonb,
  outcome text not null check (outcome in ('proceed', 'reject')),
  reject_message text,
  active boolean not null default true
);

create index if not exists booking_rules_event_idx
  on public.booking_rules (event_type_id, sort);

-- ── Short-lived holds ────────────────────────────────────────
create table if not exists public.booking_holds (
  id uuid primary key default gen_random_uuid(),
  event_type_id uuid not null references public.booking_event_types(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  hold_token text not null unique,
  expires_at timestamptz not null,
  constraint booking_holds_span check (starts_at < ends_at)
);

create index if not exists booking_holds_active_idx
  on public.booking_holds (event_type_id, starts_at, ends_at, expires_at);

-- ── Bookings ─────────────────────────────────────────────────
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  event_type_id uuid not null references public.booking_event_types(id) on delete restrict,
  status text not null check (status in (
    'confirmed', 'cancelled', 'rejected_inquiry', 'sync_failed'
  )),
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text not null default 'Europe/Berlin',
  name text,
  email text,
  phone text,
  answers jsonb not null default '{}'::jsonb,
  rule_outcome text check (rule_outcome is null or rule_outcome in ('proceed', 'reject')),
  reject_reason text,
  gcal_event_id text,
  source text,
  ip_hash text,
  idempotency_key text unique,
  constraint bookings_confirmed_needs_slot check (
    status not in ('confirmed', 'sync_failed')
    or (starts_at is not null and ends_at is not null and starts_at < ends_at)
  )
);

create index if not exists bookings_event_status_idx
  on public.bookings (event_type_id, status, starts_at);

create index if not exists bookings_email_idx
  on public.bookings (email)
  where email is not null;

-- Overlap guard for confirmed bookings (no second confirmed on same slot)
create or replace function public.booking_no_confirmed_overlap()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'confirmed' and new.starts_at is not null and new.ends_at is not null then
    if exists (
      select 1
      from public.bookings b
      where b.event_type_id = new.event_type_id
        and b.status = 'confirmed'
        and b.id is distinct from new.id
        and b.starts_at < new.ends_at
        and b.ends_at > new.starts_at
    ) then
      raise exception 'booking_slot_taken';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_no_overlap on public.bookings;
create trigger bookings_no_overlap
  before insert or update on public.bookings
  for each row execute function public.booking_no_confirmed_overlap();

create or replace function public.booking_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists booking_event_types_updated on public.booking_event_types;
create trigger booking_event_types_updated
  before update on public.booking_event_types
  for each row execute function public.booking_set_updated_at();

drop trigger if exists bookings_updated on public.bookings;
create trigger bookings_updated
  before update on public.bookings
  for each row execute function public.booking_set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
alter table public.booking_event_types enable row level security;
alter table public.booking_availability enable row level security;
alter table public.booking_blackouts enable row level security;
alter table public.booking_questions enable row level security;
alter table public.booking_rules enable row level security;
alter table public.booking_holds enable row level security;
alter table public.bookings enable row level security;

revoke all on public.booking_event_types from anon, authenticated;
revoke all on public.booking_availability from anon, authenticated;
revoke all on public.booking_blackouts from anon, authenticated;
revoke all on public.booking_questions from anon, authenticated;
revoke all on public.booking_rules from anon, authenticated;
revoke all on public.booking_holds from anon, authenticated;
revoke all on public.bookings from anon, authenticated;

grant select, insert, update, delete on public.booking_event_types to authenticated, service_role;
grant select, insert, update, delete on public.booking_availability to authenticated, service_role;
grant select, insert, update, delete on public.booking_blackouts to authenticated, service_role;
grant select, insert, update, delete on public.booking_questions to authenticated, service_role;
grant select, insert, update, delete on public.booking_rules to authenticated, service_role;
grant select, insert, update, delete on public.booking_holds to service_role;
grant select, insert, update, delete on public.bookings to authenticated, service_role;

-- Staff policies (reuse sales allowlist when present)
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'sales' and p.proname = 'is_app_user'
  ) then
    execute $p$
      create policy booking_event_types_staff on public.booking_event_types
        for all to authenticated
        using ((select sales.is_app_user()))
        with check ((select sales.is_app_user()));
      create policy booking_availability_staff on public.booking_availability
        for all to authenticated
        using ((select sales.is_app_user()))
        with check ((select sales.is_app_user()));
      create policy booking_blackouts_staff on public.booking_blackouts
        for all to authenticated
        using ((select sales.is_app_user()))
        with check ((select sales.is_app_user()));
      create policy booking_questions_staff on public.booking_questions
        for all to authenticated
        using ((select sales.is_app_user()))
        with check ((select sales.is_app_user()));
      create policy booking_rules_staff on public.booking_rules
        for all to authenticated
        using ((select sales.is_app_user()))
        with check ((select sales.is_app_user()));
      create policy bookings_staff on public.bookings
        for all to authenticated
        using ((select sales.is_app_user()))
        with check ((select sales.is_app_user()));
    $p$;
  end if;
end;
$$;

-- ── Seed: Erstgespräch ───────────────────────────────────────
insert into public.booking_event_types (
  slug, title, duration_min, buffer_before_min, buffer_after_min,
  min_notice_hours, horizon_days, timezone, gcal_calendar_id, active
)
values (
  'erstgespraech',
  'Erstgespräch mit RAIS',
  45, 0, 15, 24, 28, 'Europe/Berlin', 'primary', true
)
on conflict (slug) do nothing;

with et as (
  select id from public.booking_event_types where slug = 'erstgespraech'
)
insert into public.booking_availability (event_type_id, weekday, start_time, end_time)
select et.id, d.weekday, d.start_time::time, d.end_time::time
from et
cross join (
  values
    (1, '09:00', '12:00'),
    (1, '14:00', '17:00'),
    (2, '09:00', '12:00'),
    (2, '14:00', '17:00'),
    (3, '09:00', '12:00'),
    (3, '14:00', '17:00'),
    (4, '09:00', '12:00'),
    (4, '14:00', '17:00'),
    (5, '09:00', '12:00'),
    (5, '14:00', '17:00')
) as d(weekday, start_time, end_time)
where not exists (
  select 1 from public.booking_availability a
  where a.event_type_id = et.id
);

with et as (
  select id from public.booking_event_types where slug = 'erstgespraech'
)
insert into public.booking_questions (event_type_id, sort, key, label, type, required, options)
select et.id, q.sort, q.key, q.label, q.type, q.required, q.options::jsonb
from et
cross join (
  values
    (10, 'owner', 'Bist du Geschäftsführer / Inhaber?', 'boolean', true, '[]'),
    (20, 'team_size', 'Teamgröße (inkl. GF)?', 'number', true, '[]'),
    (30, 'crm', 'Welches CRM nutzt ihr?', 'single', true,
      '[{"value":"propstack","label":"Propstack"},{"value":"onoffice","label":"onOffice"},{"value":"anderes","label":"Anderes"},{"value":"keins","label":"Keins"}]'),
    (40, 'inquiries_per_day', 'Wie viele Anfragen / Tag ungefähr?', 'text', true, '[]'),
    (50, 'ads_budget', 'Ads-Budget möglich ≥ 1.000 € / Monat auf eurem Konto?', 'single', true,
      '[{"value":"ja","label":"Ja"},{"value":"nein","label":"Nein"},{"value":"unklar","label":"Unklar"}]'),
    (60, 'pain', 'Primärschmerz?', 'single', true,
      '[{"value":"kaufanfragen","label":"Zu wenig Kaufanfragen"},{"value":"mandate","label":"Zu wenig Kaufmandate"},{"value":"filter","label":"Zu viel Zeit mit Filtern & Quali"}]')
) as q(sort, key, label, type, required, options)
where not exists (
  select 1 from public.booking_questions x
  where x.event_type_id = et.id and x.key = q.key
);

with et as (
  select id from public.booking_event_types where slug = 'erstgespraech'
)
insert into public.booking_rules (event_type_id, sort, name, condition, outcome, reject_message)
select et.id, r.sort, r.name, r.condition::jsonb, r.outcome, r.reject_message
from et
cross join (
  values
    (10, 'Kein Inhaber',
      '{"field":"owner","op":"eq","value":false}',
      'reject',
      'Aktuell arbeiten wir nur direkt mit Inhabern und Geschäftsführern. Melde dich gerne erneut, wenn du entscheiden kannst.'),
    (20, 'Budget zu niedrig',
      '{"field":"ads_budget","op":"eq","value":"nein"}',
      'reject',
      'Ohne monatliches Ads-Budget ab etwa 1.000 € passt unser System derzeit nicht. Schreib uns, wenn sich das ändert.')
) as r(sort, name, condition, outcome, reject_message)
where not exists (
  select 1 from public.booking_rules x
  where x.event_type_id = et.id and x.name = r.name
);

commit;
