-- Art. 7 DSGVO: Nachweis der Einwilligungen aus dem KI-Roadmap-Fragenblock.
-- Nur Edge Function (service_role). Kein anon-Zugriff.

begin;

create table if not exists public.form_consents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references public.funnel_leads(id) on delete set null,
  email text not null,
  purpose text not null,
  granted boolean not null,
  text_version text not null,
  consent_version text not null,
  source text,
  page_url text,
  ip_hash text
);

alter table public.form_consents
  drop constraint if exists form_consents_purpose_check;

alter table public.form_consents
  add constraint form_consents_purpose_check
  check (purpose in ('privacy_ack', 'marketing'));

create index if not exists form_consents_email_created_at_idx
  on public.form_consents (email, created_at desc);

create index if not exists form_consents_lead_id_idx
  on public.form_consents (lead_id);

alter table public.form_consents enable row level security;
revoke select, insert, update, delete on table public.form_consents from anon, authenticated;

commit;
