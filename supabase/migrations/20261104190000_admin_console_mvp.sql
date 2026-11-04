-- Admin console MVP (staff operations, not a claims desk).
-- Tickets are about the software: account, billing, technical.
-- Do not store claim worksheets, medical details, or SSN here.

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null check (char_length(subject) between 1 and 200),
  status text not null default 'open' check (status in ('open', 'waiting', 'closed')),
  priority text not null default 'normal' check (priority in ('normal', 'high')),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.support_tickets is
  'Software-support tickets. Never use this table to advise on a PIP claim or the substance of a filing.';

create index if not exists idx_support_tickets_user on public.support_tickets (user_id);
create index if not exists idx_support_tickets_status on public.support_tickets (status, created_at desc);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets (id) on delete cascade,
  author_id uuid references public.profiles (id),
  author_kind text not null check (author_kind in ('staff', 'system')),
  body text not null check (char_length(body) between 1 and 8000),
  created_at timestamptz not null default now()
);

comment on table public.support_messages is
  'In-console support replies. Claim-substance messages are prohibited by product policy, not by this check constraint.';

create index if not exists idx_support_messages_ticket on public.support_messages (ticket_id, created_at);

alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;

revoke all on table public.support_tickets from public, anon, authenticated;
revoke all on table public.support_messages from public, anon, authenticated;
grant select, insert, update, delete on table public.support_tickets to service_role;
grant select, insert, update, delete on table public.support_messages to service_role;
