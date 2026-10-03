-- Restricted business operations exposed through authenticated RPC calls.
-- Each SECURITY DEFINER function validates auth.uid(), trusted database roles,
-- ownership/organization assignment, and current account state.

create or replace function public.match_mock_beneficiary(
  p_mock_philhealth_id text,
  p_birth_date date,
  p_first_name text,
  p_last_name text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_registry app_private.mock_beneficiary_registry%rowtype;
  v_profile public.profiles%rowtype;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select * into v_profile from public.profiles where id = v_user_id for update;
  if v_profile.role <> 'beneficiary' or v_profile.account_status <> 'pending' then
    raise exception using errcode = '42501', message = 'Pending beneficiary account required';
  end if;

  if v_profile.registry_record_id is not null then
    raise exception using errcode = '23505', message = 'A registry record is already linked to this account';
  end if;

  select r.* into v_registry
  from app_private.mock_beneficiary_registry r
  where lower(btrim(r.mock_philhealth_id)) = lower(btrim(p_mock_philhealth_id))
    and r.birth_date = p_birth_date
    and lower(regexp_replace(btrim(r.first_name), '\s+', ' ', 'g')) =
      lower(regexp_replace(btrim(p_first_name), '\s+', ' ', 'g'))
    and lower(regexp_replace(btrim(r.last_name), '\s+', ' ', 'g')) =
      lower(regexp_replace(btrim(p_last_name), '\s+', ' ', 'g'))
  for update;

  if not found then
    return jsonb_build_object(
      'matched', false,
      'message', 'The submitted information did not match the mock registry.'
    );
  end if;

  if v_registry.claimed_by is not null and v_registry.claimed_by <> v_user_id then
    raise exception using errcode = '23505', message = 'This mock beneficiary record has already been claimed';
  end if;

  update app_private.mock_beneficiary_registry
  set claimed_by = v_user_id, claimed_at = coalesce(claimed_at, now())
  where id = v_registry.id;

  update public.profiles
  set registry_record_id = v_registry.id,
      display_name = v_registry.first_name || ' ' || v_registry.last_name,
      assigned_clinic_id = v_registry.assigned_clinic_id,
      account_status = 'pending'
  where id = v_user_id;

  return jsonb_build_object(
    'matched', true,
    'clinicPath', case when v_registry.assigned_clinic_id is null
      then 'select_clinic' else 'confirm_assigned_clinic' end,
    'assignedClinicId', v_registry.assigned_clinic_id,
    'accountStatus', 'pending'
  );
end;
$$;

create or replace function public.set_beneficiary_clinic(p_clinic_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_profile public.profiles%rowtype;
  v_registry_clinic_id uuid;
  v_reference text;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select * into v_profile from public.profiles where id = v_user_id for update;
  if v_profile.role <> 'beneficiary'
    or v_profile.account_status <> 'pending'
    or v_profile.registry_record_id is null then
    raise exception using errcode = '42501', message = 'Matched pending beneficiary account required';
  end if;

  if not exists (
    select 1 from public.facilities f where f.id = p_clinic_id and f.kind = 'clinic'
  ) then
    raise exception using errcode = '22023', message = 'A valid demo clinic is required';
  end if;

  select assigned_clinic_id into v_registry_clinic_id
  from app_private.mock_beneficiary_registry
  where id = v_profile.registry_record_id;

  if v_registry_clinic_id is not null and v_registry_clinic_id <> p_clinic_id then
    raise exception using errcode = '42501', message = 'Existing members must confirm their assigned clinic';
  end if;

  update public.profiles set assigned_clinic_id = p_clinic_id where id = v_user_id;

  insert into app_private.activation_references (beneficiary_id, reference_code)
  values (
    v_user_id,
    'TULAY-VERIFY-' || upper(substr(replace(pg_catalog.gen_random_uuid()::text, '-', ''), 1, 10))
  )
  on conflict (beneficiary_id) do update
    set reference_code = app_private.activation_references.reference_code
  returning reference_code into v_reference;

  return jsonb_build_object(
    'assignedClinicId', p_clinic_id,
    'accountStatus', 'pending',
    'verificationReference', v_reference
  );
end;
$$;

create or replace function public.lookup_pending_beneficiary(p_reference text)
returns jsonb
language plpgsql
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

  select * into v_staff from public.profiles where id = v_user_id;
  if v_staff.role <> 'clinic_staff' or v_staff.facility_id is null then
    raise exception using errcode = '42501', message = 'Clinic staff permission required';
  end if;

  select jsonb_build_object(
    'beneficiaryId', p.id,
    'displayName', p.display_name,
    'mockPhilHealthId', r.mock_philhealth_id,
    'birthDate', r.birth_date,
    'accountStatus', p.account_status,
    'assignedClinicId', p.assigned_clinic_id
  ) into v_result
  from app_private.activation_references ar
  join public.profiles p on p.id = ar.beneficiary_id
  join app_private.mock_beneficiary_registry r on r.id = p.registry_record_id
  where upper(btrim(ar.reference_code)) = upper(btrim(p_reference))
    and p.assigned_clinic_id = v_staff.facility_id
    and p.account_status = 'pending';

  if v_result is null then
    raise exception using errcode = 'P0002', message = 'No assigned pending beneficiary was found';
  end if;

  return v_result;
end;
$$;

create or replace function public.activate_beneficiary(p_reference text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_staff public.profiles%rowtype;
  v_beneficiary_id uuid;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select * into v_staff from public.profiles where id = v_user_id;
  if v_staff.role <> 'clinic_staff' or v_staff.facility_id is null then
    raise exception using errcode = '42501', message = 'Clinic staff permission required';
  end if;

  select p.id into v_beneficiary_id
  from app_private.activation_references ar
  join public.profiles p on p.id = ar.beneficiary_id
  where upper(btrim(ar.reference_code)) = upper(btrim(p_reference))
    and p.assigned_clinic_id = v_staff.facility_id
    and p.account_status = 'pending'
  for update of p;

  if v_beneficiary_id is null then
    raise exception using errcode = 'P0002', message = 'No assigned pending beneficiary was found';
  end if;

  update public.profiles
  set account_status = 'active', activated_at = now()
  where id = v_beneficiary_id;

  insert into public.activation_audit (beneficiary_id, clinic_id, approved_by)
  values (v_beneficiary_id, v_staff.facility_id, v_user_id);

  return jsonb_build_object(
    'beneficiaryId', v_beneficiary_id,
    'accountStatus', 'active',
    'activatedAt', now()
  );
end;
$$;

create or replace function public.issue_mock_prescription(
  p_beneficiary_id uuid,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_doctor public.profiles%rowtype;
  v_prescription_id uuid;
  v_mock_upsc text;
  v_item jsonb;
  v_attempt integer := 0;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select * into v_doctor from public.profiles where id = v_user_id;
  if v_doctor.role <> 'doctor' or v_doctor.facility_id is null then
    raise exception using errcode = '42501', message = 'Doctor permission required';
  end if;

  if not exists (
    select 1 from public.profiles p
    where p.id = p_beneficiary_id
      and p.role = 'beneficiary'
      and p.account_status = 'active'
      and p.assigned_clinic_id = v_doctor.facility_id
  ) then
    raise exception using errcode = '42501', message = 'Active patient assigned to this clinic required';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception using errcode = '22023', message = 'At least one prescription item is required';
  end if;

  loop
    v_attempt := v_attempt + 1;
    v_mock_upsc := 'DEMO-UPSC-' ||
      upper(substr(replace(pg_catalog.gen_random_uuid()::text, '-', ''), 1, 10));
    begin
      insert into public.prescriptions (
        beneficiary_id, doctor_id, clinic_id, mock_upsc
      ) values (
        p_beneficiary_id, v_user_id, v_doctor.facility_id, v_mock_upsc
      ) returning id into v_prescription_id;
      exit;
    exception when unique_violation then
      if v_attempt >= 5 then raise; end if;
    end;
  end loop;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if not (v_item ? 'medicineId') or not (v_item ? 'instructions') then
      raise exception using errcode = '22023', message = 'Each item requires medicineId and instructions';
    end if;

    insert into public.prescription_items (
      prescription_id,
      medicine_id,
      prescribed_quantity,
      instructions
    ) values (
      v_prescription_id,
      (v_item->>'medicineId')::uuid,
      nullif(v_item->>'prescribedQuantity', '')::integer,
      btrim(v_item->>'instructions')
    );
  end loop;

  return jsonb_build_object(
    'prescriptionId', v_prescription_id,
    'mockUpsc', v_mock_upsc,
    'issuedAt', now()
  );
end;
$$;

create or replace function public.lookup_prescription_by_upsc(p_mock_upsc text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_pharmacy public.profiles%rowtype;
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select * into v_pharmacy from public.profiles where id = v_user_id;
  if v_pharmacy.role <> 'pharmacy_staff' or v_pharmacy.facility_id is null then
    raise exception using errcode = '42501', message = 'Pharmacy staff permission required';
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
  ) into v_result
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

revoke all on function public.match_mock_beneficiary(text, date, text, text) from public, anon;
revoke all on function public.set_beneficiary_clinic(uuid) from public, anon;
revoke all on function public.lookup_pending_beneficiary(text) from public, anon;
revoke all on function public.activate_beneficiary(text) from public, anon;
revoke all on function public.issue_mock_prescription(uuid, jsonb) from public, anon;
revoke all on function public.lookup_prescription_by_upsc(text) from public, anon;

grant execute on function public.match_mock_beneficiary(text, date, text, text) to authenticated;
grant execute on function public.set_beneficiary_clinic(uuid) to authenticated;
grant execute on function public.lookup_pending_beneficiary(text) to authenticated;
grant execute on function public.activate_beneficiary(text) to authenticated;
grant execute on function public.issue_mock_prescription(uuid, jsonb) to authenticated;
grant execute on function public.lookup_prescription_by_upsc(text) to authenticated;



