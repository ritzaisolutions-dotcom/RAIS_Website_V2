create table if not exists public.roi_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  business_name text not null,
  consent_granted boolean not null,
  consent_text_version text not null default 'rais-roi-report-v1',
  lead_type text not null default 'roi_report',
  source text not null default 'impact-report',
  page_url text,
  report jsonb not null default '{}'::jsonb,
  missed_reservations_per_week integer,
  average_guests_per_reservation integer,
  average_spend_per_guest numeric(10,2),
  monthly_loss integer,
  annual_loss integer,
  saved_reservations integer,
  payback_weeks numeric(8,2),
  client_created_at timestamptz,
  submitted_at timestamptz not null default now(),
  processing_status text not null default 'new' check (processing_status in ('new', 'contacted', 'qualified', 'won', 'lost', 'archived')),
  last_alerted_at timestamptz,
  notes text,
  original_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint roi_leads_email_check check (position('@' in email) > 1),
  constraint roi_leads_business_name_check check (char_length(trim(business_name)) >= 2)
);

create table if not exists public.roi_lead_rejections (
  id uuid primary key default gen_random_uuid(),
  email text,
  business_name text,
  source text,
  page_url text,
  validation_errors jsonb not null default '[]'::jsonb,
  original_payload jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists roi_leads_email_idx
  on public.roi_leads (lower(email));

create index if not exists roi_leads_submitted_at_idx
  on public.roi_leads (submitted_at desc);

create index if not exists roi_leads_processing_status_idx
  on public.roi_leads (processing_status);

create index if not exists roi_leads_source_idx
  on public.roi_leads (source);

create index if not exists roi_leads_report_gin_idx
  on public.roi_leads using gin (report);

create index if not exists roi_lead_rejections_submitted_at_idx
  on public.roi_lead_rejections (submitted_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists roi_leads_set_updated_at on public.roi_leads;

create trigger roi_leads_set_updated_at
before update on public.roi_leads
for each row
execute function public.set_updated_at();

alter table public.roi_leads enable row level security;
alter table public.roi_lead_rejections enable row level security;

create policy "service_role_manage_roi_leads"
  on public.roi_leads
  for all
  to service_role
  using (true)
  with check (true);

create policy "service_role_insert_roi_rejections"
  on public.roi_lead_rejections
  for insert
  to service_role
  with check (true);

create policy "service_role_select_roi_rejections"
  on public.roi_lead_rejections
  for select
  to service_role
  using (true);

comment on table public.roi_leads is 'Produktive ROI-Report-Leads von ritz-ai.solutions inklusive Consent und berechneten Reportwerten.';
comment on table public.roi_lead_rejections is 'Validierungsfehler oder unvollstaendige ROI-Lead-Eingaben fuer Audit und Debugging.';
