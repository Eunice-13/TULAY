-- Patient portal read model for the signed-in pending beneficiary.
-- The activation reference remains private and is returned only to its owner.

create or replace function public.get_my_pending_activation()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select jsonb_build_object(
    'beneficiaryId', p.id,
    'displayName', p.display_name,
    'accountStatus', p.account_status,
    'verificationReference', ar.reference_code,
    'clinic', jsonb_build_object(
      'id', f.id,
      'name', f.name,
      'address', f.address,
      'operatingHours', f.operating_hours,
      'publicContact', f.public_contact
    )
  ) into v_result
  from public.profiles p
  join public.facilities f on f.id = p.assigned_clinic_id
  join app_private.activation_references ar on ar.beneficiary_id = p.id
  where p.id = v_user_id
    and p.role = 'beneficiary'
    and p.account_status = 'pending';

  if v_result is null then
    raise exception using errcode = 'P0002', message = 'No pending activation record was found';
  end if;

  return v_result;
end;
$$;

revoke all on function public.get_my_pending_activation() from public, anon;
grant execute on function public.get_my_pending_activation() to authenticated;
