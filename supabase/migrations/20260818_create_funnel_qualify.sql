-- Drei Qualifizierungsfragen vor dem Kalender auf /ai-roadmap.html.
--
-- Bewusst ohne Kontaktdaten: Name, E-Mail und Telefon entstehen erst
-- in der Cal-Maske. Der Datensatz ist damit pseudonym und haengt nur
-- an der Funnel-Session.
--
-- Der Einwilligungsnachweis nach Art. 7 DSGVO steht hier direkt in
-- der Zeile und nicht in form_consents: dort ist email NOT NULL und
-- lead_id zeigt auf funnel_leads, beides gibt es an dieser Stelle
-- nicht.
--
-- Inserts nur ueber die Edge Function (service role). Kein anon.

begin;

create table if not exists public.funnel_qualify (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid,
  pain text not null,
  ecosystem text not null,
  crm text not null,
  volumen_woche integer not null,
  source text,
  privacy_ack boolean not null default true,
  consent_text text not null,
  consent_version text not null,
  ip_hash text
);

alter table public.funnel_qualify
  drop constraint if exists funnel_qualify_pain_check;

alter table public.funnel_qualify
  add constraint funnel_qualify_pain_check
  check (pain in (
    'manuelle-bearbeitung',
    'mieteranliegen',
    'reaktionszeit',
    'terminierung'
  ));

alter table public.funnel_qualify
  drop constraint if exists funnel_qualify_ecosystem_check;

alter table public.funnel_qualify
  add constraint funnel_qualify_ecosystem_check
  check (ecosystem in (
    'google',
    'microsoft365',
    'imap',
    'gemischt',
    'weiss-nicht'
  ));

alter table public.funnel_qualify
  drop constraint if exists funnel_qualify_crm_check;

alter table public.funnel_qualify
  add constraint funnel_qualify_crm_check
  check (crm in (
    'onoffice',
    'propstack',
    'flowfact',
    'haufe',
    'excel',
    'anderes'
  ));

alter table public.funnel_qualify
  drop constraint if exists funnel_qualify_volumen_check;

alter table public.funnel_qualify
  add constraint funnel_qualify_volumen_check
  check (volumen_woche between 5 and 150);

create index if not exists funnel_qualify_created_at_idx
  on public.funnel_qualify (created_at desc);

create index if not exists funnel_qualify_session_id_idx
  on public.funnel_qualify (session_id, created_at desc);

alter table public.funnel_qualify enable row level security;

revoke select, insert, update, delete on table public.funnel_qualify from anon, authenticated;

commit;
