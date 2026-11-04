-- 14-day PIP checklist campaign leads.
-- Writes only via the Next.js server action using the service role.
-- Anon/authenticated have no table grants and RLS is enabled with no
-- client policies, so the Data API cannot read or write these rows.

create table if not exists public.leads_14days (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_name text not null,
  email text not null,
  phone text,
  locale text not null check (locale in ('en', 'es')),
  ack_self_help boolean not null,
  sms_consent boolean not null default false,
  sms_consent_text text,
  sms_consent_at timestamptz,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  fbclid text,
  referrer text,
  landing_path text,
  ip_hash text,
  user_agent text,
  constraint leads_14days_email_key unique (email)
);

create index if not exists leads_14days_created_at_idx
  on public.leads_14days (created_at desc);

comment on table public.leads_14days is
  'PII for the /14days checklist campaign. Service role only. Never store raw IP; ip_hash is SHA-256(ip || salt).';

comment on column public.leads_14days.ip_hash is
  'SHA-256 of client IP concatenated with LEAD_IP_SALT. Raw IP is not stored.';

comment on column public.leads_14days.sms_consent_text is
  'Exact TCPA consent copy shown to the user at the time of consent.';

alter table public.leads_14days enable row level security;

revoke all on table public.leads_14days from public;
revoke all on table public.leads_14days from anon, authenticated;
grant select, insert, update, delete on table public.leads_14days to service_role;
