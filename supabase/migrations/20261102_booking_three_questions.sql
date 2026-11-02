-- Drei Quali-Fragen für erstgespraech (VSL-LP)
-- 1 Kern-Pain · 2 Verkäufe jährlich · 3 Social Media (+ optional wie)

begin;

with et as (
  select id from public.booking_event_types where slug = 'erstgespraech'
)
delete from public.booking_questions bq
using et
where bq.event_type_id = et.id;

with et as (
  select id from public.booking_event_types where slug = 'erstgespraech'
)
insert into public.booking_questions (event_type_id, sort, key, label, type, required, options)
select et.id, q.sort, q.key, q.label, q.type, q.required, q.options::jsonb
from et
cross join (
  values
    (
      10,
      'pain',
      'Was ist Ihr größter Schmerz gerade?',
      'single',
      true,
      '[
        {"value":"kaufanfragen","label":"Planbare, kaufkräftige Nachfragen"},
        {"value":"eigentuemer","label":"Angebot an Eigentümer, die verkaufen wollen"},
        {"value":"nachfassen","label":"Manuelle Arbeit: schnell abholen und nachfassen"}
      ]'
    ),
    (
      20,
      'sales_per_year',
      'Wie viele Immobilien verkaufen Sie aktuell ungefähr pro Jahr?',
      'number',
      true,
      '[]'
    ),
    (
      30,
      'social_media',
      'Bisherige Erfahrung mit Social Media als Vertriebskanal?',
      'single',
      true,
      '[
        {"value":"nein","label":"Nein, noch nicht"},
        {"value":"ja","label":"Ja"}
      ]'
    ),
    (
      40,
      'social_media_how',
      'Wenn ja: Wie haben Sie Social Media bisher als Vertriebskanal genutzt?',
      'text',
      false,
      '[]'
    )
) as q(sort, key, label, type, required, options);

-- Alte Reject-Regeln auf entfernte Felder (owner, ads_budget) streichen
with et as (
  select id from public.booking_event_types where slug = 'erstgespraech'
)
delete from public.booking_rules br
using et
where br.event_type_id = et.id
  and br.name in ('Kein Inhaber', 'Budget zu niedrig');

commit;
