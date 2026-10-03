-- Keep referral reads under one policy and index every referral foreign key.

create index laboratory_referrals_doctor_idx
  on public.laboratory_referrals (doctor_id, created_at desc);

drop policy laboratory_referrals_beneficiary_read
  on public.laboratory_referrals;
drop policy laboratory_referrals_provider_read
  on public.laboratory_referrals;

create policy laboratory_referrals_read
on public.laboratory_referrals for select to authenticated
using (
  (
    beneficiary_id = (select auth.uid())
    and (select app_private.current_role()) = 'beneficiary'
    and (select app_private.current_account_status()) = 'active'
  )
  or (
    clinic_id = (select app_private.current_facility_id())
    and (select app_private.current_role()) in ('clinic_staff', 'doctor')
  )
);
