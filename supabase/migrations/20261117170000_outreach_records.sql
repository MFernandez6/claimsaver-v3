-- Staff-only clinic outreach records. The Next.js route checks the staff role,
-- then uses the service role. The table is not exposed to anon or authenticated.

create table public.outreach_records (
  id text primary key,
  kind text not null,
  data jsonb not null,
  updated timestamptz not null default now(),
  constraint outreach_records_id_check check (id ~ '^[a-z0-9-]{1,80}$'),
  constraint outreach_records_kind_check check (
    kind in ('clinic', 'client', 'task', 'script', 'note', 'document')
  )
);

create index outreach_records_updated_idx on public.outreach_records (updated desc);

alter table public.outreach_records enable row level security;
alter table public.outreach_records force row level security;

revoke all on table public.outreach_records from anon, authenticated;
grant select, insert, update, delete on table public.outreach_records to service_role;
