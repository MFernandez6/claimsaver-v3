-- Admin SMS one-time codes. Staff manage the software; claimant stays the filer.
-- Codes are stored hashed. Do not store the plaintext code or claim contents.

create table if not exists public.admin_sms_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  code_hash text not null,
  phone_last4 text not null default '',
  expires_at timestamptz not null,
  consumed_at timestamptz,
  attempts int not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.admin_sms_challenges is
  'Hashed admin SMS login codes. Service-role only. Never store the plaintext code.';

create index if not exists idx_admin_sms_challenges_user
  on public.admin_sms_challenges (user_id, created_at desc);

alter table public.admin_sms_challenges enable row level security;

revoke all on table public.admin_sms_challenges from public, anon, authenticated;
grant select, insert, update, delete on table public.admin_sms_challenges to service_role;
