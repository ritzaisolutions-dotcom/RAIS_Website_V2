-- Applied via Supabase MCP on 2026-06-15
create table if not exists public.lead_magnet_downloads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  magnet_slug text not null default 'prozesshandbuch-2026',
  source text,
  privacy_ack boolean not null default true,
  marketing_consent boolean not null default false,
  consent_timestamp timestamptz not null default now()
);

alter table public.lead_magnet_downloads enable row level security;

drop policy if exists anon_insert_lead_magnet_downloads on public.lead_magnet_downloads;
create policy anon_insert_lead_magnet_downloads
  on public.lead_magnet_downloads
  for insert
  to anon
  with check (true);

grant insert on public.lead_magnet_downloads to anon;
grant usage on schema public to anon;
