-- Demo-only coverage labels and proximity gate.
-- Coordinates supplied by a browser are transient convenience inputs, not proof
-- of residence; clinic staff still perform the real in-person verification.

create type public.medicine_coverage_group as enum (
  'yakap_essential_21',
  'gamot_additional_54'
);

alter table public.medicines
  add column coverage_group public.medicine_coverage_group;

update public.medicines
set coverage_group = 'yakap_essential_21'
where coverage_group is null;

alter table public.medicines
  alter column coverage_group set not null;

create or replace function app_private.haversine_km(
  p_latitude_a double precision,
  p_longitude_a double precision,
  p_latitude_b double precision,
  p_longitude_b double precision
)
returns double precision
language sql
immutable
parallel safe
set search_path = ''
as $$
  select 6371.0 * 2.0 * asin(
    sqrt(
      power(sin(radians((p_latitude_b - p_latitude_a) / 2.0)), 2) +
      cos(radians(p_latitude_a)) *
      cos(radians(p_latitude_b)) *
      power(sin(radians((p_longitude_b - p_longitude_a) / 2.0)), 2)
    )
  );
$$;

revoke all on function app_private.haversine_km(
  double precision,
  double precision,
  double precision,
  double precision
) from public, anon, authenticated;

drop function public.set_beneficiary_clinic(uuid);

create function public.set_beneficiary_clinic(
  p_clinic_id uuid,
  p_latitude double precision default null,
  p_longitude double precision default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_profile public.profiles%rowtype;
  v_registry_clinic_id uuid;
  v_clinic public.facilities%rowtype;
  v_distance_km double precision;
  v_reference text;
  v_max_distance_km constant double precision := 15.0;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select * into v_profile
  from public.profiles
  where id = v_user_id
  for update;

  if v_profile.role <> 'beneficiary'
    or v_profile.account_status <> 'pending'
    or v_profile.registry_record_id is null then
    raise exception using errcode = '42501', message = 'Matched pending beneficiary account required';
  end if;

  select * into v_clinic
  from public.facilities
  where id = p_clinic_id
    and kind = 'clinic';

  if not found then
    raise exception using errcode = '22023', message = 'A valid demo clinic is required';
  end if;

  select assigned_clinic_id into v_registry_clinic_id
  from app_private.mock_beneficiary_registry
  where id = v_profile.registry_record_id;

  if v_registry_clinic_id is not null then
    if v_registry_clinic_id <> p_clinic_id then
      raise exception using errcode = '42501', message = 'Existing members must confirm their assigned clinic';
    end if;
  else
    if p_latitude is null or p_longitude is null then
      raise exception using errcode = '22023', message = 'Location is required for new YAKAP enrollment';
    end if;

    if p_latitude < -90 or p_latitude > 90
      or p_longitude < -180 or p_longitude > 180 then
      raise exception using errcode = '22023', message = 'Valid coordinates are required';
    end if;

    if v_clinic.latitude is null or v_clinic.longitude is null then
      raise exception using errcode = '22023', message = 'The selected clinic has no demo location';
    end if;

    v_distance_km := app_private.haversine_km(
      p_latitude,
      p_longitude,
      v_clinic.latitude::double precision,
      v_clinic.longitude::double precision
    );

    if v_distance_km > v_max_distance_km then
      raise exception using errcode = '42501', message = 'Select a YAKAP clinic within 15 km';
    end if;
  end if;

  update public.profiles
  set assigned_clinic_id = p_clinic_id
  where id = v_user_id;

  insert into app_private.activation_references (
    beneficiary_id,
    reference_code
  )
  values (
    v_user_id,
    'TULAY-VERIFY-' ||
      upper(substr(replace(pg_catalog.gen_random_uuid()::text, '-', ''), 1, 10))
  )
  on conflict (beneficiary_id) do update
    set reference_code = app_private.activation_references.reference_code
  returning reference_code into v_reference;

  return jsonb_build_object(
    'assignedClinicId', p_clinic_id,
    'accountStatus', 'pending',
    'verificationReference', v_reference,
    'proximityRuleApplied', v_registry_clinic_id is null,
    'distanceKm', case
      when v_distance_km is null then null
      else round(v_distance_km::numeric, 2)
    end,
    'maxDistanceKm', case
      when v_registry_clinic_id is null then v_max_distance_km
      else null
    end
  );
end;
$$;

create or replace function public.list_nearby_yakap_clinics(
  p_latitude double precision,
  p_longitude double precision
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_profile public.profiles%rowtype;
  v_result jsonb;
  v_max_distance_km constant double precision := 15.0;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select * into v_profile
  from public.profiles
  where id = v_user_id;

  if v_profile.role <> 'beneficiary'
    or v_profile.account_status <> 'pending'
    or v_profile.registry_record_id is null then
    raise exception using errcode = '42501', message = 'Matched pending beneficiary account required';
  end if;

  if p_latitude is null or p_longitude is null
    or p_latitude < -90 or p_latitude > 90
    or p_longitude < -180 or p_longitude > 180 then
    raise exception using errcode = '22023', message = 'Valid coordinates are required';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', clinic.id,
        'name', clinic.name,
        'address', clinic.address,
        'operatingHours', clinic.operating_hours,
        'publicContact', clinic.public_contact,
        'latitude', clinic.latitude,
        'longitude', clinic.longitude,
        'distanceKm', round(clinic.distance_km::numeric, 2),
        'maxDistanceKm', v_max_distance_km
      )
      order by clinic.distance_km, clinic.name
    ),
    '[]'::jsonb
  )
  into v_result
  from (
    select
      f.*,
      app_private.haversine_km(
        p_latitude,
        p_longitude,
        f.latitude::double precision,
        f.longitude::double precision
      ) as distance_km
    from public.facilities f
    where f.kind = 'clinic'
      and f.is_demo_verified
      and f.latitude is not null
      and f.longitude is not null
  ) clinic
  where clinic.distance_km <= v_max_distance_km;

  return v_result;
end;
$$;

revoke all on function public.set_beneficiary_clinic(
  uuid,
  double precision,
  double precision
) from public, anon;
grant execute on function public.set_beneficiary_clinic(
  uuid,
  double precision,
  double precision
) to authenticated;

revoke all on function public.list_nearby_yakap_clinics(
  double precision,
  double precision
) from public, anon;
grant execute on function public.list_nearby_yakap_clinics(
  double precision,
  double precision
) to authenticated;
