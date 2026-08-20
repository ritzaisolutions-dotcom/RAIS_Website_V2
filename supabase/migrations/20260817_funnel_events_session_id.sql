-- Pseudonyme Funnel-Session, damit Abbrüche derselben Person
-- zaehlbar sind, ohne Name oder E-Mail an Events zu haengen.

begin;

alter table public.funnel_events
  add column if not exists session_id uuid;

create index if not exists funnel_events_session_id_created_at_idx
  on public.funnel_events (session_id, created_at desc);

commit;
