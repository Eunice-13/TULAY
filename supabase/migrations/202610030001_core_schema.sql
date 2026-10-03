-- TULAY core schema.
-- All records used for the hackathon must be fictional and clearly labeled demo data.

create extension if not exists pgcrypto;

create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;
grant usage on schema app_private to authenticated;

create type public.user_role as enum (
  'beneficiary',
  'clinic_staff',
  'doctor',
  'pharmacy_staff'
);

create type public.account_status as enum ('pending', 'active');
create type public.facility_kind as enum ('clinic', 'pharmacy');
create type public.availability_status as enum ('available', 'out_of_stock');
create type public.notification_channel as enum ('in_app', 'simulated_sms');

create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  kind public.facility_kind not null,
  name text not null,
  address text not null,
  operating_hours text,
  public_contact text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  is_demo_verified boolean not null default true,
  created_at timestamptz not null default now(),
  constraint facilities_name_not_blank check (btrim(name) <> ''),
  constraint facilities_address_not_blank check (btrim(address) <> '')
);

create table app_private.mock_beneficiary_registry (
  id uuid primary key default gen_random_uuid(),
  mock_philhealth_id text not null unique,
  first_name text not null,
  last_name text not null,
  birth_date date not null,
  assigned_clinic_id uuid references public.facilities(id),
  claimed_by uuid unique references auth.users(id) on delete set null,
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint registry_name_not_blank check (
    btrim(first_name) <> '' and btrim(last_name) <> ''
  )
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.user_role not null default 'beneficiary',
  account_status public.account_status,
  facility_id uuid references public.facilities(id),
  assigned_clinic_id uuid references public.facilities(id),
  registry_record_id uuid unique references app_private.mock_beneficiary_registry(id),
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_shape check (
    (
      role = 'beneficiary'
      and account_status is not null
      and facility_id is null
    )
    or
    (
      role <> 'beneficiary'
      and account_status is null
      and facility_id is not null
      and assigned_clinic_id is null
      and registry_record_id is null
    )
  )
);

create table app_private.activation_references (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null unique references public.profiles(id) on delete cascade,
  reference_code text not null unique,
  created_at timestamptz not null default now()
);

create table public.activation_audit (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references public.profiles(id) on delete restrict,
  clinic_id uuid not null references public.facilities(id) on delete restrict,
  approved_by uuid not null references public.profiles(id) on delete restrict,
  approved_at timestamptz not null default now(),
  unique (beneficiary_id)
);

create table public.medicines (
  id uuid primary key default gen_random_uuid(),
  generic_name text not null,
  strength text not null,
  dosage_form text not null,
  created_at timestamptz not null default now(),
  unique (generic_name, strength, dosage_form),
  constraint medicine_fields_not_blank check (
    btrim(generic_name) <> ''
    and btrim(strength) <> ''
    and btrim(dosage_form) <> ''
  )
);

create table public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references public.profiles(id) on delete restrict,
  doctor_id uuid not null references public.profiles(id) on delete restrict,
  clinic_id uuid not null references public.facilities(id) on delete restrict,
  mock_upsc text not null unique,
  issued_at timestamptz not null default now(),
  constraint mock_upsc_format check (mock_upsc ~ '^DEMO-UPSC-[A-F0-9]{10}$')
);

create table public.prescription_items (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references public.prescriptions(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id) on delete restrict,
  prescribed_quantity integer,
  instructions text not null,
  created_at timestamptz not null default now(),
  constraint prescribed_quantity_positive check (
    prescribed_quantity is null or prescribed_quantity > 0
  ),
  constraint prescription_instructions_not_blank check (btrim(instructions) <> '')
);

create table public.medicine_availability (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id) on delete cascade,
  status public.availability_status not null,
  updated_by uuid not null references public.profiles(id) on delete restrict,
  updated_at timestamptz not null default now(),
  status_changed_at timestamptz not null default now(),
  unique (facility_id, medicine_id)
);

create table public.restock_subscriptions (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references public.profiles(id) on delete cascade,
  facility_id uuid not null references public.facilities(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (beneficiary_id, facility_id, medicine_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references public.profiles(id) on delete cascade,
  channel public.notification_channel not null default 'in_app',
  title text not null,
  message text not null,
  source_key text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (beneficiary_id, source_key),
  constraint notification_text_not_blank check (
    btrim(title) <> '' and btrim(message) <> '' and btrim(source_key) <> ''
  )
);

create index profiles_assigned_clinic_idx on public.profiles (assigned_clinic_id);
create index prescriptions_beneficiary_idx on public.prescriptions (beneficiary_id, issued_at desc);
create index prescriptions_clinic_idx on public.prescriptions (clinic_id, issued_at desc);
create index prescription_items_prescription_idx on public.prescription_items (prescription_id);
create index availability_lookup_idx on public.medicine_availability (medicine_id, status);
create index subscriptions_lookup_idx on public.restock_subscriptions (facility_id, medicine_id);
create index notifications_beneficiary_idx on public.notifications (beneficiary_id, created_at desc);

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function app_private.set_updated_at();

create or replace function app_private.set_availability_timestamps()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if old.status is distinct from new.status then
    new.status_changed_at := now();
  else
    new.status_changed_at := old.status_changed_at;
  end if;
  return new;
end;
$$;

create trigger availability_set_timestamps
before update on public.medicine_availability
for each row execute function app_private.set_availability_timestamps();

create or replace function app_private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role, account_status)
  values (new.id, 'beneficiary', 'pending');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function app_private.handle_new_auth_user();

create or replace function app_private.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = (select auth.uid());
$$;

create or replace function app_private.current_facility_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.facility_id from public.profiles p where p.id = (select auth.uid());
$$;

create or replace function app_private.current_account_status()
returns public.account_status
language sql
stable
security definer
set search_path = ''
as $$
  select p.account_status from public.profiles p where p.id = (select auth.uid());
$$;

revoke all on all functions in schema app_private from public, anon;
grant execute on function app_private.current_role() to authenticated;
grant execute on function app_private.current_facility_id() to authenticated;
grant execute on function app_private.current_account_status() to authenticated;

alter table public.facilities enable row level security;
alter table public.profiles enable row level security;
alter table public.activation_audit enable row level security;
alter table public.medicines enable row level security;
alter table public.prescriptions enable row level security;
alter table public.prescription_items enable row level security;
alter table public.medicine_availability enable row level security;
alter table public.restock_subscriptions enable row level security;
alter table public.notifications enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.facilities to authenticated;
grant select on public.profiles to authenticated;
grant select on public.activation_audit to authenticated;
grant select on public.medicines to authenticated;
grant select on public.prescriptions to authenticated;
grant select on public.prescription_items to authenticated;
grant select, insert, update on public.medicine_availability to authenticated;
grant select, insert, delete on public.restock_subscriptions to authenticated;
grant select, update (read_at) on public.notifications to authenticated;

create policy facilities_authenticated_read
on public.facilities for select to authenticated
using (true);

create policy profiles_own_or_assigned_provider_read
on public.profiles for select to authenticated
using (
  id = (select auth.uid())
  or (
    role = 'beneficiary'
    and assigned_clinic_id = (select app_private.current_facility_id())
    and (select app_private.current_role()) in ('clinic_staff', 'doctor')
  )
);

create policy activation_audit_beneficiary_or_clinic_read
on public.activation_audit for select to authenticated
using (
  beneficiary_id = (select auth.uid())
  or (
    clinic_id = (select app_private.current_facility_id())
    and (select app_private.current_role()) in ('clinic_staff', 'doctor')
  )
);

create policy medicines_authenticated_read
on public.medicines for select to authenticated
using (true);

create policy prescriptions_patient_or_assigned_doctor_read
on public.prescriptions for select to authenticated
using (
  (
    beneficiary_id = (select auth.uid())
    and (select app_private.current_account_status()) = 'active'
  )
  or (
    clinic_id = (select app_private.current_facility_id())
    and (select app_private.current_role()) = 'doctor'
  )
);

create policy prescription_items_patient_or_assigned_doctor_read
on public.prescription_items for select to authenticated
using (
  exists (
    select 1
    from public.prescriptions p
    where p.id = prescription_items.prescription_id
      and (
        (
          p.beneficiary_id = (select auth.uid())
          and (select app_private.current_account_status()) = 'active'
        )
        or (
          p.clinic_id = (select app_private.current_facility_id())
          and (select app_private.current_role()) = 'doctor'
        )
      )
  )
);

create policy availability_active_patient_or_own_provider_read
on public.medicine_availability for select to authenticated
using (
  (select app_private.current_account_status()) = 'active'
  or facility_id = (select app_private.current_facility_id())
);

create policy availability_pharmacy_insert
on public.medicine_availability for insert to authenticated
with check (
  (select app_private.current_role()) = 'pharmacy_staff'
  and facility_id = (select app_private.current_facility_id())
  and updated_by = (select auth.uid())
);

create policy availability_pharmacy_update
on public.medicine_availability for update to authenticated
using (
  (select app_private.current_role()) = 'pharmacy_staff'
  and facility_id = (select app_private.current_facility_id())
)
with check (
  (select app_private.current_role()) = 'pharmacy_staff'
  and facility_id = (select app_private.current_facility_id())
  and updated_by = (select auth.uid())
);

create policy subscriptions_own_active_read
on public.restock_subscriptions for select to authenticated
using (
  beneficiary_id = (select auth.uid())
  and (select app_private.current_account_status()) = 'active'
);

create policy subscriptions_own_active_insert
on public.restock_subscriptions for insert to authenticated
with check (
  beneficiary_id = (select auth.uid())
  and (select app_private.current_account_status()) = 'active'
);

create policy subscriptions_own_active_delete
on public.restock_subscriptions for delete to authenticated
using (
  beneficiary_id = (select auth.uid())
  and (select app_private.current_account_status()) = 'active'
);

create policy notifications_own_active_read
on public.notifications for select to authenticated
using (
  beneficiary_id = (select auth.uid())
  and (select app_private.current_account_status()) = 'active'
);

create policy notifications_own_active_mark_read
on public.notifications for update to authenticated
using (
  beneficiary_id = (select auth.uid())
  and (select app_private.current_account_status()) = 'active'
)
with check (
  beneficiary_id = (select auth.uid())
  and (select app_private.current_account_status()) = 'active'
);

create or replace function app_private.create_restock_notifications()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_facility_name text;
  v_medicine_name text;
  v_source_key text;
begin
  if old.status = 'out_of_stock' and new.status = 'available' then
    select f.name into v_facility_name
    from public.facilities f where f.id = new.facility_id;

    select m.generic_name into v_medicine_name
    from public.medicines m where m.id = new.medicine_id;

    v_source_key := 'restock:' || new.id::text || ':' ||
      floor(extract(epoch from new.status_changed_at))::bigint::text;

    insert into public.notifications (
      beneficiary_id,
      channel,
      title,
      message,
      source_key
    )
    select
      rs.beneficiary_id,
      'in_app',
      'Medicine reported available',
      v_medicine_name || ' was reported available at ' || v_facility_name ||
        '. Availability may change before arrival.',
      v_source_key
    from public.restock_subscriptions rs
    where rs.facility_id = new.facility_id
      and rs.medicine_id = new.medicine_id
    on conflict (beneficiary_id, source_key) do nothing;
  end if;

  return new;
end;
$$;

create trigger availability_create_restock_notifications
after update on public.medicine_availability
for each row execute function app_private.create_restock_notifications();

revoke all on function app_private.handle_new_auth_user() from public, anon, authenticated;
revoke all on function app_private.set_updated_at() from public, anon, authenticated;
revoke all on function app_private.set_availability_timestamps() from public, anon, authenticated;
revoke all on function app_private.create_restock_notifications() from public, anon, authenticated;



