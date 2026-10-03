-- Fictional demo data only. Safe to rerun after the schema migrations.
-- Auth users/provider profiles are deliberately not seeded here because their
-- UUIDs come from Supabase Auth. Provision those accounts server-side later.

insert into public.facilities (
  id,
  kind,
  name,
  address,
  operating_hours,
  public_contact,
  latitude,
  longitude,
  is_demo_verified
) values
  (
    '10000000-0000-4000-8000-000000000001',
    'clinic',
    'Demo Bayanihan YAKAP Clinic',
    'Fictional Barangay Maligaya, Manila',
    'Monday-Friday, 8:00 AM-5:00 PM',
    'bayanihan-clinic@example.com',
    14.599500,
    120.984200,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'clinic',
    'Demo Malasakit YAKAP Clinic',
    'Fictional Barangay Pag-asa, Quezon City',
    'Monday-Saturday, 8:00 AM-5:00 PM',
    'malasakit-clinic@example.com',
    14.676000,
    121.043700,
    true
  ),
  (
    '20000000-0000-4000-8000-000000000001',
    'pharmacy',
    'Demo Lingap GAMOT Partner Pharmacy',
    'Fictional Barangay Masigla, Manila',
    'Monday-Saturday, 9:00 AM-6:00 PM',
    'lingap-pharmacy@example.com',
    14.609100,
    121.022300,
    true
  )
on conflict (id) do update set
  kind = excluded.kind,
  name = excluded.name,
  address = excluded.address,
  operating_hours = excluded.operating_hours,
  public_contact = excluded.public_contact,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
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
  id,
  generic_name,
  strength,
  dosage_form,
  coverage_group
) values
  ('40000000-0000-4000-8000-000000000001', 'Amoxicillin', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000002', 'Co-amoxiclav', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000003', 'Co-trimoxazole (Sulfamethoxazole + Trimethoprim)', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000004', 'Nitrofurantoin', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000005', 'Ciprofloxacin', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000006', 'Clarithromycin', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000007', 'Oral Rehydration Salts (ORS)', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000008', 'Prednisone', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000009', 'Salbutamol', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000010', 'Fluticasone + Salmeterol', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000011', 'Paracetamol', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000012', 'Gliclazide', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000013', 'Metformin', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000014', 'Simvastatin', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000015', 'Enalapril', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000016', 'Metoprolol', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000017', 'Amlodipine', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000018', 'Hydrochlorothiazide', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000019', 'Losartan', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000020', 'Aspirin', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000021', 'Chlorphenamine', 'Varies by preparation', 'See prescription', 'yakap_essential_21'),
  ('40000000-0000-4000-8000-000000000022', 'Albendazole', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000023', 'Azithromycin', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000024', 'Cefixime', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000025', 'Cefuroxime', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000026', 'Clindamycin', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000027', 'Clotrimazole', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000028', 'Cloxacillin', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000029', 'Doxycycline', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000030', 'Erythromycin', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000031', 'Fluconazole', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000032', 'Ketoconazole', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000033', 'Mebendazole', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000034', 'Metronidazole', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000035', 'Oseltamivir', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000036', 'Tobramycin', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000037', 'Clopidogrel', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000038', 'Budesonide + Formoterol', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000039', 'Ipratropium', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000040', 'Montelukast', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000041', 'Ipratropium + Salbutamol', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000042', 'Tiotropium', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000043', 'Aluminum Hydroxide + Magnesium Hydroxide', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000044', 'Butamirate', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000045', 'Celecoxib', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000046', 'Cetirizine', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000047', 'Colchicine', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000048', 'Diphenhydramine', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000049', 'Ferrous Salt (Iron Preparations)', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000050', 'Folic Acid + Iron Ferrous', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000051', 'Ibuprofen', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000052', 'Lagundi (Vitex negundo)', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000053', 'Loratadine', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000054', 'Mefenamic Acid', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000055', 'Naproxen', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000056', 'Omeprazole', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000057', 'Zinc', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000058', 'Dapagliflozin', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000059', 'Atorvastatin', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000060', 'Fenofibrate', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000061', 'Rosuvastatin', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000062', 'Atenolol', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000063', 'Captopril', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000064', 'Clonidine', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000065', 'Diltiazem', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000066', 'Enalapril + Hydrochlorothiazide', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000067', 'Isosorbide Dinitrate', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000068', 'Isosorbide Mononitrate', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000069', 'Methyldopa', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000070', 'Tamsulosin', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000071', 'Telmisartan', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000072', 'Telmisartan + Hydrochlorothiazide', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000073', 'Valsartan', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000074', 'Valsartan + Hydrochlorothiazide', 'Varies by preparation', 'See prescription', 'gamot_additional_54'),
  ('40000000-0000-4000-8000-000000000075', 'Gabapentin', 'Varies by preparation', 'See prescription', 'gamot_additional_54')
on conflict (id) do update set
  generic_name = excluded.generic_name,
  strength = excluded.strength,
  dosage_form = excluded.dosage_form,
  coverage_group = excluded.coverage_group;



