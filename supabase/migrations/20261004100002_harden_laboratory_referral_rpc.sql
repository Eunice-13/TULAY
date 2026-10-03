-- Reject missing beneficiary profiles explicitly instead of relying on a
-- foreign-key error after authorization checks.

create or replace function public.create_laboratory_referral(
  p_beneficiary_id uuid,
  p_service_name text,
  p_reason text,
  p_destination_name text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_doctor public.profiles%rowtype;
  v_patient public.profiles%rowtype;
  v_referral public.laboratory_referrals%rowtype;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  if p_beneficiary_id is null
    or p_service_name is null
    or p_reason is null
    or p_destination_name is null
    or char_length(btrim(p_service_name)) = 0
    or char_length(btrim(p_service_name)) > 120
    or char_length(btrim(p_reason)) = 0
    or char_length(btrim(p_reason)) > 500
    or char_length(btrim(p_destination_name)) = 0
    or char_length(btrim(p_destination_name)) > 160 then
    raise exception using errcode = '22023', message = 'Valid referral details are required';
  end if;

  select * into v_doctor
  from public.profiles
  where id = v_user_id;

  if not found
    or v_doctor.role <> 'doctor'
    or v_doctor.facility_id is null then
    raise exception using errcode = '42501', message = 'Doctor permission required';
  end if;

  if not exists (
    select 1
    from public.facilities f
    where f.id = v_doctor.facility_id
      and f.kind = 'clinic'
  ) then
    raise exception using errcode = '42501', message = 'A clinic-assigned doctor is required';
  end if;

  select * into v_patient
  from public.profiles
  where id = p_beneficiary_id;

  if not found
    or v_patient.role <> 'beneficiary'
    or v_patient.account_status <> 'active'
    or v_patient.assigned_clinic_id <> v_doctor.facility_id then
    raise exception using errcode = '42501', message = 'Active patient assigned to this clinic required';
  end if;

  insert into public.laboratory_referrals (
    beneficiary_id,
    doctor_id,
    clinic_id,
    service_name,
    destination_name,
    reason
  ) values (
    p_beneficiary_id,
    v_user_id,
    v_doctor.facility_id,
    btrim(p_service_name),
    btrim(p_destination_name),
    btrim(p_reason)
  )
  returning * into v_referral;

  return jsonb_build_object(
    'referralId', v_referral.id,
    'beneficiaryId', v_referral.beneficiary_id,
    'doctorId', v_referral.doctor_id,
    'clinicId', v_referral.clinic_id,
    'serviceName', v_referral.service_name,
    'destinationName', v_referral.destination_name,
    'reason', v_referral.reason,
    'status', v_referral.status,
    'createdAt', v_referral.created_at,
    'notice', 'Demo referral for laboratory navigation; not a hospital connection or diagnosis.'
  );
end;
$$;
