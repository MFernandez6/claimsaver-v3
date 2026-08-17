-- ClaimSaver+ v3 — Postgres + Storage
-- Apply in Supabase SQL editor or via CLI.
-- Auth users live in auth.users; profiles.id matches auth.users.id.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  role text not null default 'user' check (role in ('user', 'admin', 'super_admin')),
  is_active boolean not null default true,
  has_platform_access boolean not null default false,
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_profiles_role on public.profiles (role);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_session_id text not null unique,
  product_code text not null check (product_code in ('platform', 'notarization')),
  amount_cents integer not null,
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  created_at timestamptz not null default now()
);

create index if not exists idx_purchases_user on public.purchases (user_id);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  claim_number text not null unique,
  status text not null default 'draft',
  priority text not null default 'medium',
  worksheet_step integer not null default 1,
  worksheet jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_claims_user on public.claims (user_id);
create index if not exists idx_claims_status on public.claims (status);
create index if not exists idx_claims_updated on public.claims (updated_at desc);

create table if not exists public.claim_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  claim_id uuid references public.claims (id) on delete set null,
  name text not null,
  type text not null check (type in ('medical', 'legal', 'insurance', 'evidence', 'other')),
  mime_type text not null,
  size_bytes integer not null default 0,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_docs_user on public.claim_documents (user_id);
create index if not exists idx_docs_claim on public.claim_documents (claim_id);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  claim_id uuid references public.claims (id) on delete set null,
  title text not null,
  date text not null,
  time text not null default '',
  type text not null check (type in ('appointment', 'deadline', 'follow-up', 'payment', 'custom')),
  description text not null default '',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cal_user on public.calendar_events (user_id);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  claim_id uuid references public.claims (id) on delete set null,
  category text not null check (category in ('medical', 'wage', 'mileage', 'other')),
  amount_cents integer not null,
  description text not null,
  incurred_on date not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_exp_user on public.expenses (user_id);

create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  body text not null,
  created_at timestamptz not null default now()
);

-- New auth user → profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage
insert into storage.buckets (id, name, public, file_size_limit)
values ('claim-documents', 'claim-documents', false, 52428800)
on conflict (id) do update set file_size_limit = excluded.file_size_limit;

-- RLS
alter table public.profiles enable row level security;
alter table public.purchases enable row level security;
alter table public.claims enable row level security;
alter table public.claim_documents enable row level security;
alter table public.calendar_events enable row level security;
alter table public.expenses enable row level security;
alter table public.admin_notes enable row level security;

create policy "own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "update own profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "own purchases" on public.purchases
  for select using (auth.uid() = user_id);

create policy "own claims" on public.claims
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own documents" on public.claim_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own calendar" on public.calendar_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own expenses" on public.expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Service role (webhooks, admin) bypasses RLS. Storage is accessed via signed URLs
-- issued by the API using the service role; do not expose the bucket publicly.
