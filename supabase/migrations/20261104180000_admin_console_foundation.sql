-- Admin console foundation (Phase 1).
-- Staff manage the software, not a claimant's filing.
-- SQL only — this repo has no Prisma. Do not apply to production until reviewed.

-- 1. Internal roles live on user_roles. profiles.role stays for the claimant app.
do $$ begin
  create type public.app_role as enum (
    'OWNER',
    'SUPPORT',
    'CLINIC_ADMIN',
    'CLINIC_STAFF',
    'CLAIMANT'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  clinic_id uuid,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id),
  unique (user_id, role),
  constraint user_roles_clinic_required check (
    (
      role in ('CLINIC_ADMIN', 'CLINIC_STAFF')
      and clinic_id is not null
    )
    or (
      role not in ('CLINIC_ADMIN', 'CLINIC_STAFF')
      and clinic_id is null
    )
  )
);

comment on table public.user_roles is
  'Admin/clinic roles. Claimant access stays on profiles + RLS. Never grant claim-content permissions here.';

create unique index if not exists user_roles_one_staff
  on public.user_roles (user_id)
  where role in ('OWNER', 'SUPPORT');

create index if not exists idx_user_roles_user on public.user_roles (user_id);
create index if not exists idx_user_roles_role on public.user_roles (role);

alter table public.user_roles enable row level security;

revoke all on table public.user_roles from public, anon, authenticated;
grant select, insert, update, delete on table public.user_roles to service_role;

-- Map today's staff flags. Claimant profiles.role = user is unchanged.
insert into public.user_roles (user_id, role)
select id, 'OWNER'::public.app_role
from public.profiles
where role = 'super_admin'
on conflict (user_id, role) do nothing;

insert into public.user_roles (user_id, role)
select id, 'SUPPORT'::public.app_role
from public.profiles
where role = 'admin'
on conflict (user_id, role) do nothing;

-- 2. Append-only audit log. 6-year retention is a later cron; do not UPDATE/DELETE rows.
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id),
  actor_role public.app_role,
  action text not null,
  resource_type text not null default '',
  resource_id text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  ip text not null default '',
  user_agent text not null default '',
  created_at timestamptz not null default now()
);

comment on table public.audit_events is
  'Append-only admin audit trail. Never store claim worksheet, medical details, or full SSN in metadata.';

create index if not exists idx_audit_events_created on public.audit_events (created_at desc);
create index if not exists idx_audit_events_actor on public.audit_events (actor_id, created_at desc);
create index if not exists idx_audit_events_action on public.audit_events (action, created_at desc);

alter table public.audit_events enable row level security;

revoke all on table public.audit_events from public, anon, authenticated;
grant select, insert on table public.audit_events to service_role;

create or replace function private.audit_events_append_only()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_events is append-only';
end;
$$;

drop trigger if exists audit_events_no_update on public.audit_events;
create trigger audit_events_no_update
  before update on public.audit_events
  for each row execute function private.audit_events_append_only();

drop trigger if exists audit_events_no_delete on public.audit_events;
create trigger audit_events_no_delete
  before delete on public.audit_events
  for each row execute function private.audit_events_append_only();
