-- Add phone and inquiry_volume for simplified booking modal.

begin;

alter table public.inbound_leads
  add column if not exists phone text;

alter table public.inbound_leads
  add column if not exists inquiry_volume integer;

alter table public.inbound_leads
  drop constraint if exists inbound_leads_inquiry_volume_check;

alter table public.inbound_leads
  add constraint inbound_leads_inquiry_volume_check
  check (inquiry_volume is null or (inquiry_volume >= 0 and inquiry_volume <= 300));

alter table public.inbound_leads
  drop constraint if exists inbound_leads_phone_check;

alter table public.inbound_leads
  add constraint inbound_leads_phone_check
  check (phone is null or char_length(phone) <= 40);

commit;
