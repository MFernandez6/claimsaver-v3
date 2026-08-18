-- New Supabase projects (2026+) do not auto-expose public tables to the Data API.
-- Explicit grants + RLS (already enabled in 001) are required.

grant usage on schema public to anon, authenticated, service_role;

grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.profiles to service_role;

grant select on table public.purchases to authenticated;
grant select, insert, update, delete on table public.purchases to service_role;

grant select, insert, update, delete on table public.claims to authenticated, service_role;
grant select, insert, update, delete on table public.claim_documents to authenticated, service_role;
grant select, insert, update, delete on table public.calendar_events to authenticated, service_role;
grant select, insert, update, delete on table public.expenses to authenticated, service_role;

grant select, insert on table public.admin_notes to authenticated;
grant select, insert, update, delete on table public.admin_notes to service_role;

grant usage, select on all sequences in schema public to authenticated, service_role;
