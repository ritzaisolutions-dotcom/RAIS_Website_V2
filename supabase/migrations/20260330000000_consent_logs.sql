-- RAIS Consent Logs Table
-- Stores server-side consent documentation per Art. 7 Abs. 1 DSGVO
-- Retention: minimum 3 years (Aufbewahrungspflicht)

create table if not exists consent_logs (
  id             uuid        primary key default gen_random_uuid(),
  uid            text        not null,
  timestamp      timestamptz not null,
  version        text        not null,
  categories     jsonb       not null,
  action         text        not null,  -- initial_save | update | no_change
  user_agent     text,
  ip_anonymized  text,       -- last octet zeroed for IPv4, last 80 bits zeroed for IPv6
  created_at     timestamptz default now()
);

-- Index for lookups by UID (e.g. responding to data subject requests)
create index if not exists consent_logs_uid_idx on consent_logs (uid);

-- Row-level security: edge function inserts only, no public reads
alter table consent_logs enable row level security;

-- Allow the service role (edge function) to insert
create policy "edge_function_insert"
  on consent_logs for insert
  to service_role
  with check (true);
