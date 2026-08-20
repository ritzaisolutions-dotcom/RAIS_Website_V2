-- Funnel leads and anonymous step events for /ai-roadmap.html.
-- Inserts only via Edge Function (service role). No anon policies.

begin;

create table if not exists public.funnel_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  vorgangstyp text not null,
  volumen_woche integer not null,
  minuten integer not null,
  kanal text not null,
  stundensatz numeric not null,
  crm text not null,
  kalender text not null,
  postfach text not null,
  stunden_monat numeric,
  euro_jahr integer,
  rueckgewinn_stunden numeric,
  source text,
  privacy_ack boolean not null default true,
  marketing_consent boolean not null default false,
  consent_timestamp timestamptz not null default now()
);

create table if not exists public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event text not null,
  vorgangstyp text,
  source text
);

alter table public.funnel_leads enable row level security;
alter table public.funnel_events enable row level security;

revoke select, insert, update, delete on table public.funnel_leads from anon, authenticated;
revoke select, insert, update, delete on table public.funnel_events from anon, authenticated;

create schema if not exists private;

create table if not exists private.funnel_lead_rate_limits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  kind text not null default 'lead',
  created_at timestamptz not null default now()
);

create index if not exists funnel_lead_rate_limits_ip_kind_created_at_idx
  on private.funnel_lead_rate_limits (ip_hash, kind, created_at);

alter table private.funnel_lead_rate_limits enable row level security;
revoke all on table private.funnel_lead_rate_limits from public, anon, authenticated;
grant select, insert, delete on table private.funnel_lead_rate_limits to service_role;

create or replace function public.register_funnel_attempt(p_ip_hash text, p_kind text)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, private
as $$
declare
  attempts integer;
  max_attempts integer;
begin
  if p_ip_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid rate limit key';
  end if;
  if p_kind not in ('lead', 'event') then
    raise exception 'Invalid rate limit kind';
  end if;

  perform pg_advisory_xact_lock(hashtext(p_ip_hash || p_kind));
  delete from private.funnel_lead_rate_limits
    where created_at < now() - interval '24 hours';

  max_attempts := case when p_kind = 'lead' then 5 else 40 end;

  select count(*)
    into attempts
    from private.funnel_lead_rate_limits
   where ip_hash = p_ip_hash
     and kind = p_kind
     and created_at >= now() - interval '15 minutes';

  if attempts >= max_attempts then
    return false;
  end if;

  insert into private.funnel_lead_rate_limits (ip_hash, kind)
  values (p_ip_hash, p_kind);

  return true;
end;
$$;

revoke all on function public.register_funnel_attempt(text, text) from public, anon, authenticated;
grant execute on function public.register_funnel_attempt(text, text) to service_role;

commit;
