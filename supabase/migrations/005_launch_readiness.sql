-- Clickwrap records, deletion requests, notarization fulfillment, Stripe disputes.
-- Service role writes most of these. Authenticated users can insert/select their own consents
-- and create a deletion request.

create table if not exists public.legal_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  document text not null check (document in ('tos', 'privacy')),
  version text not null,
  source text not null check (source in ('signup', 'checkout', 'pricing', 'reaccept', 'callback')),
  ip text not null default '',
  user_agent text not null default '',
  accepted_at timestamptz not null default now()
);

create index if not exists idx_legal_consents_user on public.legal_consents (user_id, accepted_at desc);
create index if not exists idx_legal_consents_doc_version on public.legal_consents (user_id, document, version);

alter table public.legal_consents enable row level security;

create policy "select own legal consents"
  on public.legal_consents for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Inserts go through the service-role API so we can stamp IP / user-agent.

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'done', 'denied')),
  created_at timestamptz not null default now()
);

create index if not exists idx_deletion_requests_user on public.account_deletion_requests (user_id);

alter table public.account_deletion_requests enable row level security;

create table if not exists public.notarization_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_session_id text,
  status text not null default 'awaiting_fulfillment'
    check (status in ('awaiting_fulfillment', 'scheduled', 'completed', 'canceled', 'refunded')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notary_orders_user on public.notarization_orders (user_id);

alter table public.notarization_orders enable row level security;

create table if not exists public.billing_disputes (
  id uuid primary key default gen_random_uuid(),
  stripe_dispute_id text not null unique,
  user_id uuid references public.profiles (id) on delete set null,
  amount_cents integer not null default 0,
  reason text not null default '',
  status text not null default '',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.billing_disputes enable row level security;

grant select, insert, update, delete on table public.legal_consents to service_role;
grant select on table public.legal_consents to authenticated;

grant select, insert, update, delete on table public.account_deletion_requests to service_role;
grant select, insert, update, delete on table public.notarization_orders to service_role;
grant select, insert, update, delete on table public.billing_disputes to service_role;
