-- Demo-only referral records for laboratory services that the YAKAP clinic
-- cannot cover or complete. This records navigation, not diagnosis or an
-- electronic connection to a formal hospital.

create type public.referral_status as enum ('issued');

create table public.laboratory_referrals (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references public.profiles(id) on delete restrict,
  doctor_id uuid not null references public.profiles(id) on delete restrict,
  clinic_id uuid not null references public.facilities(id) on delete restrict,
  service_name text not null,
  destination_name text not null,
  reason text not null,
  status public.referral_status not null default 'issued',
  created_at timestamptz not null default now(),
  constraint laboratory_referrals_service_not_blank check (btrim(service_name) <> ''),
  constraint laboratory_referrals_destination_not_blank check (btrim(destination_name) <> ''),
  constraint laboratory_referrals_reason_not_blank check (btrim(reason) <> ''),
  constraint laboratory_referrals_service_length check (char_length(btrim(service_name)) <= 120),
  constraint laboratory_referrals_destination_length check (char_length(btrim(destination_name)) <= 160),
  constraint laboratory_referrals_reason_length check (char_length(btrim(reason)) <= 500)
);

create index laboratory_referrals_beneficiary_idx
  on public.laboratory_referrals (beneficiary_id, created_at desc);
create index laboratory_referrals_clinic_idx
  on public.laboratory_referrals (clinic_id, created_at desc);

alter table public.laboratory_referrals enable row level security;

revoke all on public.laboratory_referrals from anon, authenticated;
grant select on public.laboratory_referrals to authenticated;

create policy laboratory_referrals_beneficiary_read
on public.laboratory_referrals for select to authenticated
using (
  beneficiary_id = (select auth.uid())
  and (select app_private.current_role()) = 'beneficiary'
  and (select app_private.current_account_status()) = 'active'
);

create policy laboratory_referrals_provider_read
on public.laboratory_referrals for select to authenticated
using (
  clinic_id = (select app_private.current_facility_id())
  and (select app_private.current_role()) in ('clinic_staff', 'doctor')
);

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

  if v_doctor.role <> 'doctor' or v_doctor.facility_id is null then
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

revoke all on function public.create_laboratory_referral(
  uuid,
  text,
  text,
  text
) from public, anon;
grant execute on function public.create_laboratory_referral(
  uuid,
  text,
  text,
  text
) to authenticated;
