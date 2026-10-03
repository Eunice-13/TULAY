-- Launch integration for the patient and professional portals.
-- All functions use trusted profile roles and facility assignments.

alter table public.facilities
  add column if not exists has_dispensary boolean not null default false;

update public.facilities
set has_dispensary = case
  when id = '10000000-0000-4000-8000-000000000001' then true
  when kind = 'pharmacy' then true
  else false
end;

create or replace function public.get_my_beneficiary_status()
returns jsonb
language plpgsql
stable
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
    'profileId', p.id,
    'displayName', p.display_name,
    'accountStatus', p.account_status,
    'registryMatched', p.registry_record_id is not null,
    'membershipMode', case
      when r.id is null then null
      when r.assigned_clinic_id is null then 'new_yakap'
      else 'existing_yakap'
    end,
    'assignedClinic', case
      when f.id is null then null
      else jsonb_build_object(
        'id', f.id,
        'name', f.name,
        'address', f.address,
        'operatingHours', f.operating_hours,
        'publicContact', f.public_contact
      )
    end,
    'verificationReference', ar.reference_code,
    'activatedAt', p.activated_at
  )
  into v_result
  from public.profiles p
  left join app_private.mock_beneficiary_registry r
    on r.id = p.registry_record_id
  left join public.facilities f
    on f.id = p.assigned_clinic_id
  left join app_private.activation_references ar
    on ar.beneficiary_id = p.id
  where p.id = v_user_id
    and p.role = 'beneficiary';

  if v_result is null then
    raise exception using errcode = '42501', message = 'Beneficiary account required';
  end if;

  return v_result;
end;
$$;

create or replace function public.list_assigned_beneficiaries()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_staff public.profiles%rowtype;
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select * into v_staff
  from public.profiles
  where id = v_user_id;

  if not found
    or v_staff.role not in ('clinic_staff', 'doctor')
    or v_staff.facility_id is null then
    raise exception using errcode = '42501', message = 'Assigned clinic provider required';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'beneficiaryId', p.id,
        'displayName', p.display_name,
        'mockPhilHealthId', r.mock_philhealth_id,
        'birthDate', r.birth_date,
        'accountStatus', p.account_status,
        'registeredAt', p.created_at,
        'activatedAt', p.activated_at,
        'verificationReference', case
          when v_staff.role = 'clinic_staff' then ar.reference_code
          else null
        end
      )
      order by p.created_at desc, p.id
    ),
    '[]'::jsonb
  )
  into v_result
  from public.profiles p
  join app_private.mock_beneficiary_registry r
    on r.id = p.registry_record_id
  left join app_private.activation_references ar
    on ar.beneficiary_id = p.id
  where p.role = 'beneficiary'
    and p.assigned_clinic_id = v_staff.facility_id;

  return v_result;
end;
$$;

drop policy if exists availability_pharmacy_insert
  on public.medicine_availability;
drop policy if exists availability_pharmacy_update
  on public.medicine_availability;

create policy availability_assigned_provider_insert
on public.medicine_availability for insert to authenticated
with check (
  facility_id = (select app_private.current_facility_id())
  and updated_by = (select auth.uid())
  and (
    (select app_private.current_role()) = 'pharmacy_staff'
    or (
      (select app_private.current_role()) = 'clinic_staff'
      and exists (
        select 1
        from public.facilities f
        where f.id = (select app_private.current_facility_id())
          and f.kind = 'clinic'
          and f.has_dispensary
      )
    )
  )
);

create policy availability_assigned_provider_update
on public.medicine_availability for update to authenticated
using (
  facility_id = (select app_private.current_facility_id())
  and (
    (select app_private.current_role()) = 'pharmacy_staff'
    or (
      (select app_private.current_role()) = 'clinic_staff'
      and exists (
        select 1
        from public.facilities f
        where f.id = (select app_private.current_facility_id())
          and f.kind = 'clinic'
          and f.has_dispensary
      )
    )
  )
)
with check (
  facility_id = (select app_private.current_facility_id())
  and updated_by = (select auth.uid())
  and (
    (select app_private.current_role()) = 'pharmacy_staff'
    or (
      (select app_private.current_role()) = 'clinic_staff'
      and exists (
        select 1
        from public.facilities f
        where f.id = (select app_private.current_facility_id())
          and f.kind = 'clinic'
          and f.has_dispensary
      )
    )
  )
);

create or replace function public.lookup_prescription_by_upsc(p_mock_upsc text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_staff public.profiles%rowtype;
  v_facility public.facilities%rowtype;
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select * into v_staff
  from public.profiles
  where id = v_user_id;

  if not found or v_staff.facility_id is null then
    raise exception using errcode = '42501', message = 'Dispensing staff permission required';
  end if;

  select * into v_facility
  from public.facilities
  where id = v_staff.facility_id;

  if not found or not (
    v_staff.role = 'pharmacy_staff'
    or (
      v_staff.role = 'clinic_staff'
      and v_facility.kind = 'clinic'
      and v_facility.has_dispensary
    )
  ) then
    raise exception using errcode = '42501', message = 'Dispensing staff permission required';
  end if;

  select jsonb_build_object(
    'prescriptionId', pr.id,
    'mockUpsc', pr.mock_upsc,
    'issuedAt', pr.issued_at,
    'beneficiary', jsonb_build_object(
      'id', patient.id,
      'displayName', patient.display_name
    ),
    'doctor', jsonb_build_object(
      'id', doctor.id,
      'displayName', doctor.display_name
    ),
    'clinic', jsonb_build_object(
      'id', clinic.id,
      'name', clinic.name
    ),
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'medicineId', m.id,
        'genericName', m.generic_name,
        'strength', m.strength,
        'dosageForm', m.dosage_form,
        'prescribedQuantity', pi.prescribed_quantity,
        'instructions', pi.instructions
      ) order by pi.created_at, pi.id)
      from public.prescription_items pi
      join public.medicines m on m.id = pi.medicine_id
      where pi.prescription_id = pr.id
    ), '[]'::jsonb),
    'notice', 'Mock UPSC lookup does not itself authorize dispensing.'
  )
  into v_result
  from public.prescriptions pr
  join public.profiles patient on patient.id = pr.beneficiary_id
  join public.profiles doctor on doctor.id = pr.doctor_id
  join public.facilities clinic on clinic.id = pr.clinic_id
  where upper(btrim(pr.mock_upsc)) = upper(btrim(p_mock_upsc));

  if v_result is null then
    raise exception using errcode = 'P0002', message = 'No prescription was found for that mock UPSC';
  end if;

  return v_result;
end;
$$;

revoke all on function public.get_my_beneficiary_status()
  from public, anon;
revoke all on function public.list_assigned_beneficiaries()
  from public, anon;
revoke all on function public.lookup_prescription_by_upsc(text)
  from public, anon;

grant execute on function public.get_my_beneficiary_status()
  to authenticated;
grant execute on function public.list_assigned_beneficiaries()
  to authenticated;
grant execute on function public.lookup_prescription_by_upsc(text)
  to authenticated;
