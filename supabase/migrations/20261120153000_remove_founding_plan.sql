-- Remove the $199 founding clinic list price. Remaining paid list is STANDARD_299.
-- Listed MRR is still admin display math, not Stripe-collected cash.
-- Do not treat this migration as a live clinic subscription.

update public.clinics
set plan = 'STANDARD_299', updated_at = now()
where plan = 'FOUNDING_199';

alter table public.clinics drop constraint if exists clinics_plan_check;

alter table public.clinics
  add constraint clinics_plan_check
  check (plan in ('PILOT', 'STANDARD_299'));
