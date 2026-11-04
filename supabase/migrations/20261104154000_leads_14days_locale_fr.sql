-- Allow French checklist leads. Service-role writes only; RLS unchanged.

alter table public.leads_14days
  drop constraint if exists leads_14days_locale_check;

alter table public.leads_14days
  add constraint leads_14days_locale_check
  check (locale in ('en', 'es', 'fr'));
