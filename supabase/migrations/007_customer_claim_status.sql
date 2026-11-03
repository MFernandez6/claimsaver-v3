-- Customers may only set draft / in_progress. Privileged statuses stay
-- server-controlled (service role: auth.uid() is null).

create or replace function public.enforce_customer_claim_status()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is null then
    return NEW;
  end if;

  if NEW.status is distinct from 'draft'
     and NEW.status is distinct from 'in_progress' then
    if TG_OP = 'INSERT' then
      raise exception 'Customers may only set claim status to draft or in_progress';
    end if;
    if NEW.status is distinct from OLD.status then
      raise exception 'Customers may only set claim status to draft or in_progress';
    end if;
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_enforce_customer_claim_status on public.claims;
create trigger trg_enforce_customer_claim_status
  before insert or update of status on public.claims
  for each row
  execute function public.enforce_customer_claim_status();

revoke all on function public.enforce_customer_claim_status() from public;
revoke all on function public.enforce_customer_claim_status() from anon, authenticated;
