-- Fictional demo data only. Safe to rerun after the schema migrations.
-- Auth users/provider profiles are deliberately not seeded here because their
-- UUIDs come from Supabase Auth. Provision those accounts server-side later.

insert into public.facilities (
  id, kind, name, address, operating_hours, public_contact, is_demo_verified
) values
  (
    '10000000-0000-4000-8000-000000000001',
    'clinic',
    'Demo TULAY Clinic A',
    'Fictional address, Manila',
    'Monday-Friday, 8:00 AM-5:00 PM',
    'clinic-a@example.com',
    true
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'clinic',
    'Demo TULAY Clinic B',
    'Fictional address, Quezon City',
    'Monday-Friday, 8:00 AM-5:00 PM',
    'clinic-b@example.com',
    true
  ),
  (
    '20000000-0000-4000-8000-000000000001',
    'pharmacy',
    'Demo TULAY Pharmacy A',
    'Fictional address, Manila',
    'Monday-Saturday, 9:00 AM-6:00 PM',
    'pharmacy-a@example.com',
    true
  )
on conflict (id) do update set
  kind = excluded.kind,
  name = excluded.name,
  address = excluded.address,
  operating_hours = excluded.operating_hours,
  public_contact = excluded.public_contact,
  is_demo_verified = excluded.is_demo_verified;

insert into app_private.mock_beneficiary_registry (
  id,
  mock_philhealth_id,
  first_name,
  last_name,
  birth_date,
  assigned_clinic_id
) values
  (
    '30000000-0000-4000-8000-000000000001',
    'DEMO-PH-001',
    'Sample',
    'Beneficiary One',
    '2000-01-15',
    null
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    'DEMO-PH-002',
    'Sample',
    'Beneficiary Two',
    '1995-06-20',
    '10000000-0000-4000-8000-000000000001'
  )
on conflict (id) do update set
  mock_philhealth_id = excluded.mock_philhealth_id,
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  birth_date = excluded.birth_date,
  assigned_clinic_id = excluded.assigned_clinic_id;

insert into public.medicines (
  id, generic_name, strength, dosage_form
) values
  (
    '40000000-0000-4000-8000-000000000001',
    'Demo Medicine A',
    '500 mg',
    'Tablet'
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    'Demo Medicine B',
    '10 mg',
    'Tablet'
  )
on conflict (id) do update set
  generic_name = excluded.generic_name,
  strength = excluded.strength,
  dosage_form = excluded.dosage_form;



