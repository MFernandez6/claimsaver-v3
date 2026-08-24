-- Harden Data API grants and the signup trigger after the security audit.
-- Apply this on the live Supabase project (CLI or SQL editor).

-- 1. Customers may only edit name/phone. Paid access, role, email, and
--    is_active stay writable by the service role (Stripe webhook / admin).
revoke update on table public.profiles from authenticated;
grant update (first_name, last_name, phone, updated_at) on table public.profiles to authenticated;

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check (
    (select auth.uid()) = id
    and role is not distinct from (select p.role from public.profiles p where p.id = (select auth.uid()))
    and has_platform_access is not distinct from (select p.has_platform_access from public.profiles p where p.id = (select auth.uid()))
    and is_active is not distinct from (select p.is_active from public.profiles p where p.id = (select auth.uid()))
    and email is not distinct from (select p.email from public.profiles p where p.id = (select auth.uid()))
  );

-- 2. Staff notes are service-role only.
revoke select, insert on table public.admin_notes from authenticated;

-- 3. Move the auth trigger off the exposed public schema and drop PUBLIC execute.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, service_role;

create or replace function private.handle_new_user()
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

revoke all on function private.handle_new_user() from public;
revoke all on function private.handle_new_user() from anon, authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'supabase_auth_admin') then
    grant usage on schema private to supabase_auth_admin;
    grant execute on function private.handle_new_user() to supabase_auth_admin;
  end if;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

drop function if exists public.handle_new_user();
