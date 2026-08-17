-- Optional columns for PIP reminder templates. Sync also works by title / [pip:id] marker.
alter table public.calendar_events
  add column if not exists source text not null default 'custom';

alter table public.calendar_events
  add column if not exists template_id integer;

create index if not exists idx_cal_claim_template
  on public.calendar_events (claim_id, template_id);
