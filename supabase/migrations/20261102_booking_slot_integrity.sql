-- Slot integrity: sync_failed occupies capacity; hold claim is atomic.

begin;

create or replace function public.booking_no_confirmed_overlap()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('confirmed', 'sync_failed')
     and new.starts_at is not null
     and new.ends_at is not null then
    if exists (
      select 1
      from public.bookings b
      where b.event_type_id = new.event_type_id
        and b.status in ('confirmed', 'sync_failed')
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

create or replace function public.claim_booking_hold(
  p_event_type_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_hold_token text,
  p_expires_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_starts_at >= p_ends_at then
    raise exception 'invalid_hold_span';
  end if;

  if exists (
    select 1 from public.bookings b
    where b.event_type_id = p_event_type_id
      and b.status in ('confirmed', 'sync_failed')
      and b.starts_at < p_ends_at
      and b.ends_at > p_starts_at
  ) then
    raise exception 'booking_slot_taken';
  end if;

  if exists (
    select 1 from public.booking_holds h
    where h.event_type_id = p_event_type_id
      and h.expires_at > now()
      and h.starts_at < p_ends_at
      and h.ends_at > p_starts_at
  ) then
    raise exception 'booking_slot_busy';
  end if;

  insert into public.booking_holds (
    event_type_id, starts_at, ends_at, hold_token, expires_at
  ) values (
    p_event_type_id, p_starts_at, p_ends_at, p_hold_token, p_expires_at
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.claim_booking_hold(uuid, timestamptz, timestamptz, text, timestamptz)
  from public, anon, authenticated;
grant execute on function public.claim_booking_hold(uuid, timestamptz, timestamptz, text, timestamptz)
  to service_role;

commit;
