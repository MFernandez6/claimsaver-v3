-- Audit items 2, 8, 9, 10: Data API paywall, durable rate limits,
-- storage deny-by-default, deletion fulfillment columns, wipe stored SSNs.

-- 1. Paid tables: own-row + paid + active. Then revoke authenticated CRUD
--    so the browser Data API cannot skip the $500 Next.js gate.
drop policy if exists "own claims" on public.claims;
create policy "own paid claims"
  on public.claims
  for all
  to authenticated
  using (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.has_platform_access = true
        and p.is_active = true
    )
  )
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.has_platform_access = true
        and p.is_active = true
    )
  );

drop policy if exists "own documents" on public.claim_documents;
create policy "own paid documents"
  on public.claim_documents
  for all
  to authenticated
  using (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.has_platform_access = true
        and p.is_active = true
    )
  )
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.has_platform_access = true
        and p.is_active = true
    )
  );

drop policy if exists "own calendar" on public.calendar_events;
create policy "own paid calendar"
  on public.calendar_events
  for all
  to authenticated
  using (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.has_platform_access = true
        and p.is_active = true
    )
  )
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.has_platform_access = true
        and p.is_active = true
    )
  );

drop policy if exists "own expenses" on public.expenses;
create policy "own paid expenses"
  on public.expenses
  for all
  to authenticated
  using (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.has_platform_access = true
        and p.is_active = true
    )
  )
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.has_platform_access = true
        and p.is_active = true
    )
  );

revoke select, insert, update, delete on table public.claims from authenticated;
revoke select, insert, update, delete on table public.claim_documents from authenticated;
revoke select, insert, update, delete on table public.calendar_events from authenticated;
revoke select, insert, update, delete on table public.expenses from authenticated;

grant select, insert, update, delete on table public.claims to service_role;
grant select, insert, update, delete on table public.claim_documents to service_role;
grant select, insert, update, delete on table public.calendar_events to service_role;
grant select, insert, update, delete on table public.expenses to service_role;

-- 2. Do not keep Social Security numbers in worksheet JSON.
update public.claims
set
  worksheet = jsonb_set(coalesce(worksheet, '{}'::jsonb), '{claimantSSN}', '""'::jsonb, true),
  updated_at = now()
where coalesce(worksheet->>'claimantSSN', '') <> '';

-- 3. One consent row per user / document / version.
create unique index if not exists legal_consents_user_doc_version
  on public.legal_consents (user_id, document, version);

-- 4. Deletion fulfillment audit columns.
alter table public.account_deletion_requests
  add column if not exists processed_at timestamptz,
  add column if not exists processed_by uuid references public.profiles (id);

-- 5. Durable rate limits (service role only; not on the Data API).
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, service_role;

create table if not exists private.rate_limits (
  key text primary key,
  count integer not null default 0,
  reset_at timestamptz not null
);

create or replace function private.consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns jsonb
language plpgsql
security definer
set search_path = private
as $$
declare
  rec private.rate_limits%rowtype;
  now_ts timestamptz := clock_timestamp();
  retry integer;
begin
  if p_key is null or length(p_key) = 0 or p_limit < 1 or p_window_seconds < 1 then
    return jsonb_build_object('ok', false, 'retry_after', 60);
  end if;

  insert into private.rate_limits (key, count, reset_at)
  values (p_key, 1, now_ts + make_interval(secs => p_window_seconds))
  on conflict (key) do update
    set
      count = case
        when private.rate_limits.reset_at <= excluded.reset_at - make_interval(secs => p_window_seconds)
          then 1
        else private.rate_limits.count + 1
      end,
      reset_at = case
        when private.rate_limits.reset_at <= excluded.reset_at - make_interval(secs => p_window_seconds)
          then excluded.reset_at
        else private.rate_limits.reset_at
      end
  returning * into rec;

  if rec.count > p_limit then
    retry := greatest(1, ceil(extract(epoch from (rec.reset_at - now_ts)))::integer);
    return jsonb_build_object('ok', false, 'retry_after', retry);
  end if;
  return jsonb_build_object('ok', true, 'retry_after', 0);
end;
$$;

revoke all on function private.consume_rate_limit(text, integer, integer) from public;
revoke all on function private.consume_rate_limit(text, integer, integer) from anon, authenticated;
grant execute on function private.consume_rate_limit(text, integer, integer) to service_role;
grant select, insert, update, delete on table private.rate_limits to service_role;

-- 6. Storage: private bucket, no anon/authenticated object access.
--    RLS is already on in Supabase; we are not table owner so we only add
--    restrictive deny policies. Service role bypasses RLS.
drop policy if exists "no anon claim documents" on storage.objects;
create policy "no anon claim documents"
  on storage.objects
  as restrictive
  for all
  to anon
  using (false)
  with check (false);

drop policy if exists "no authenticated claim documents" on storage.objects;
create policy "no authenticated claim documents"
  on storage.objects
  as restrictive
  for all
  to authenticated
  using (false)
  with check (false);
