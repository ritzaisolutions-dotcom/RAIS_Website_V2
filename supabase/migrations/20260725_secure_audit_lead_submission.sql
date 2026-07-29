-- Create inbound_leads if missing, then lock inserts to the Edge Function only.
-- Apply this before deploying submit-audit-lead.

begin;

create table if not exists public.inbound_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  pain_point text,
  team_size text,
  icp_segment text,
  source text,
  privacy_ack boolean not null default false,
  consent_timestamp timestamptz not null default now()
);

alter table public.inbound_leads enable row level security;

drop policy if exists anon_insert_inbound_leads on public.inbound_leads;
revoke select, insert, update, delete on table public.inbound_leads from anon, authenticated;

create schema if not exists private;

create table if not exists private.audit_lead_rate_limits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists audit_lead_rate_limits_ip_hash_created_at_idx
  on private.audit_lead_rate_limits (ip_hash, created_at);

create index if not exists audit_lead_rate_limits_created_at_idx
  on private.audit_lead_rate_limits (created_at);

alter table private.audit_lead_rate_limits enable row level security;
revoke all on table private.audit_lead_rate_limits from public, anon, authenticated;
grant select, insert, delete on table private.audit_lead_rate_limits to service_role;

create or replace function public.register_audit_lead_attempt(p_ip_hash text)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, private
as $$
declare
  attempts integer;
begin
  if p_ip_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid rate limit key';
  end if;

  perform pg_advisory_xact_lock(hashtext(p_ip_hash));
  delete from private.audit_lead_rate_limits
    where created_at < now() - interval '24 hours';

  select count(*)
    into attempts
    from private.audit_lead_rate_limits
   where ip_hash = p_ip_hash
     and created_at >= now() - interval '15 minutes';

  if attempts >= 5 then
    return false;
  end if;

  insert into private.audit_lead_rate_limits (ip_hash)
  values (p_ip_hash);

  return true;
end;
$$;

revoke all on function public.register_audit_lead_attempt(text) from public, anon, authenticated;
grant execute on function public.register_audit_lead_attempt(text) to service_role;

commit;
