-- One pending deletion ticket per user. Purchases stay; this only caps spam inserts.
with ranked as (
  select
    id,
    row_number() over (partition by user_id order by created_at asc) as rn
  from public.account_deletion_requests
  where status = 'pending'
)
update public.account_deletion_requests d
set status = 'denied'
from ranked r
where d.id = r.id
  and r.rn > 1;

create unique index if not exists account_deletion_requests_one_pending
  on public.account_deletion_requests (user_id)
  where status = 'pending';
