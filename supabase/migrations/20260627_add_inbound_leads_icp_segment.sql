-- Add ICP segment and source tracking for booking-modal leads.

alter table if exists public.inbound_leads
  add column if not exists icp_segment text;

alter table if exists public.inbound_leads
  add column if not exists source text;

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
      'inseratsanfragen', 'onboarding', 'email-management', 'company-gpt',
      'gesamtprozess', 'anderes',
      'nachverfolgung', 'kommunikation', 'dokumentation'
    ))
    and (team_size is null or char_length(team_size) <= 20)
    and (icp_segment is null or icp_segment in ('makler', 'verwaltung'))
    and (source is null or char_length(source) <= 100)
  );

grant insert on public.inbound_leads to anon;
