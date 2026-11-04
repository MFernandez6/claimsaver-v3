-- Admin console ops: clinics/BAA, consented impersonation, delayed deletion, retention.
-- Staff still manage the software, not a claimant's filing.
-- Do not store claim contents, medical details, or SSN on these tables.

create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null check (char_length(legal_name) between 1 and 200),
  dba text not null default '',
  address text not null default '',
  ahca_license text not null default '',
  primary_contact_name text not null default '',
  primary_contact_email text not null default '',
  plan text not null default 'PILOT'
    check (plan in ('PILOT', 'FOUNDING_199', 'STANDARD_299')),
  pilot_start date,
  pilot_end date,
  baa_status text not null default 'NOT_SENT'
    check (baa_status in ('NOT_SENT', 'SENT', 'SIGNED')),
  baa_signed_at date,
  baa_document_url text not null default '',
  enrollment_code text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
  notes text not null default '',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clinics_baa_signed check (
    baa_status <> 'SIGNED' or baa_signed_at is not null
  ),
  constraint clinics_active_requires_baa check (
    is_active = false or baa_status = 'SIGNED'
  )
);

comment on table public.clinics is
  'Clinic customers. Patient enrollment stays off until BAA status is SIGNED. No claim contents here.';

create table if not exists public.clinic_enrollments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  display_name text not null default '',
  enrolled_at timestamptz not null default now(),
  unique (clinic_id, user_id)
);

comment on table public.clinic_enrollments is
  'Claimant-initiated clinic membership. Progress views use step/status only — never claim contents.';

create index if not exists idx_clinic_enrollments_clinic on public.clinic_enrollments (clinic_id);
create index if not exists idx_clinic_enrollments_user on public.clinic_enrollments (user_id);

alter table public.user_roles
  drop constraint if exists user_roles_clinic_fk;
alter table public.user_roles
  add constraint user_roles_clinic_fk
  foreign key (clinic_id) references public.clinics (id) on delete cascade;

create table if not exists public.impersonation_sessions (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.profiles (id),
  user_id uuid not null references public.profiles (id),
  ticket_id uuid references public.support_tickets (id),
  reason text not null check (char_length(reason) between 1 and 500),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'denied', 'expired', 'ended')),
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  expires_at timestamptz,
  ended_at timestamptz
);

comment on table public.impersonation_sessions is
  'Consented, time-boxed support sessions. Silent impersonation is never allowed. Read-only.';

create index if not exists idx_impersonation_user_status
  on public.impersonation_sessions (user_id, status);

create table if not exists public.account_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_account_activity_user
  on public.account_activity (user_id, created_at desc);

create table if not exists public.privacy_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'ready'
    check (status in ('pending', 'ready', 'expired', 'downloaded')),
  download_token_hash text not null unique,
  payload jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

comment on table public.privacy_exports is
  'A user''s own data package. Staff cannot download this payload. Expires in 24 hours.';

alter table public.account_deletion_requests
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references public.profiles (id),
  add column if not exists hard_delete_after timestamptz;

alter table public.support_messages
  add column if not exists email_id text not null default '',
  add column if not exists email_status text not null default 'skipped'
    check (email_status in ('skipped', 'sent', 'failed'));

create table if not exists public.admin_ops_state (
  id integer primary key default 1 check (id = 1),
  admin_revoked_at timestamptz,
  revoked_by uuid
);

create table if not exists public.cron_runs (
  id uuid primary key default gen_random_uuid(),
  job text not null,
  ran_at timestamptz not null default now(),
  counts jsonb not null default '{}'::jsonb
);

alter table public.clinics enable row level security;
alter table public.clinic_enrollments enable row level security;
alter table public.impersonation_sessions enable row level security;
alter table public.account_activity enable row level security;
alter table public.privacy_exports enable row level security;
alter table public.admin_ops_state enable row level security;
alter table public.cron_runs enable row level security;

revoke all on table public.clinics from public, anon, authenticated;
revoke all on table public.clinic_enrollments from public, anon, authenticated;
revoke all on table public.impersonation_sessions from public, anon, authenticated;
revoke all on table public.account_activity from public, anon, authenticated;
revoke all on table public.privacy_exports from public, anon, authenticated;
revoke all on table public.admin_ops_state from public, anon, authenticated;
revoke all on table public.cron_runs from public, anon, authenticated;

grant select, insert, update, delete on table public.clinics to service_role;
grant select, insert, update, delete on table public.clinic_enrollments to service_role;
grant select, insert, update, delete on table public.impersonation_sessions to service_role;
grant select, insert, update, delete on table public.account_activity to service_role;
grant select, insert, update, delete on table public.privacy_exports to service_role;
grant select, insert, update, delete on table public.admin_ops_state to service_role;
grant select, insert, update, delete on table public.cron_runs to service_role;

create index if not exists idx_deletion_hard_delete
  on public.account_deletion_requests (status, hard_delete_after)
  where status = 'processing';

insert into public.admin_ops_state (id) values (1) on conflict (id) do nothing;
