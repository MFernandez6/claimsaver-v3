-- Option A: pipeline stage on the existing staff outreach desk.
-- Clinic/client rows get a CRM stage. Notes, scripts, and tasks stay unstaged.
-- Do not store claim contents, medical details, or worksheet JSON here.

alter table public.outreach_records
  add column if not exists stage text,
  add column if not exists next_action_at timestamptz,
  add column if not exists consent_at timestamptz,
  add column if not exists consent_source text not null default '';

update public.outreach_records
set stage = 'lead'
where kind in ('clinic', 'client')
  and stage is null;

alter table public.outreach_records
  drop constraint if exists outreach_records_stage_check;

alter table public.outreach_records
  add constraint outreach_records_stage_check check (
    stage is null
    or stage in (
      'lead',
      'contacted',
      'visit_scheduled',
      'visited',
      'demo_completed',
      'follow_up',
      'negotiating',
      'converted',
      'lost'
    )
  );

create or replace function public.outreach_default_pipeline_stage()
returns trigger
language plpgsql
as $$
begin
  if new.kind in ('clinic', 'client') and new.stage is null then
    new.stage := 'lead';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_outreach_default_pipeline_stage on public.outreach_records;
create trigger trg_outreach_default_pipeline_stage
  before insert or update on public.outreach_records
  for each row
  execute function public.outreach_default_pipeline_stage();

alter table public.outreach_records
  drop constraint if exists outreach_records_pipeline_stage_check;

alter table public.outreach_records
  add constraint outreach_records_pipeline_stage_check check (
    kind not in ('clinic', 'client') or stage is not null
  );

revoke all on function public.outreach_default_pipeline_stage() from public;
revoke all on function public.outreach_default_pipeline_stage() from anon, authenticated;

create index if not exists outreach_records_stage_idx
  on public.outreach_records (stage)
  where stage is not null;

create index if not exists outreach_records_next_action_idx
  on public.outreach_records (next_action_at)
  where next_action_at is not null;
