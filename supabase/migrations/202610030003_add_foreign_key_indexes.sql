-- Cover foreign keys used by authorization checks, joins, and cleanup.

create index mock_registry_assigned_clinic_idx
  on app_private.mock_beneficiary_registry (assigned_clinic_id);

create index activation_audit_clinic_idx
  on public.activation_audit (clinic_id);

create index activation_audit_approved_by_idx
  on public.activation_audit (approved_by);

create index availability_updated_by_idx
  on public.medicine_availability (updated_by);

create index prescription_items_medicine_idx
  on public.prescription_items (medicine_id);

create index prescriptions_doctor_idx
  on public.prescriptions (doctor_id);

create index profiles_facility_idx
  on public.profiles (facility_id);

create index subscriptions_medicine_idx
  on public.restock_subscriptions (medicine_id);
