import "server-only";

import { requirePatient } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type {
  AvailabilityRecord,
  FacilityRecord,
  NotificationRecord,
  PatientPrescription,
} from "@/types/domain";

type Row = Record<string, unknown>;

function object(value: unknown): Row {
  if (Array.isArray(value)) return object(value[0]);
  return typeof value === "object" && value !== null ? value as Row : {};
}

export async function listFacilities(kind?: "clinic" | "pharmacy"): Promise<FacilityRecord[]> {
  await requirePatient();
  const supabase = await createClient();
  let query = supabase
    .from("facilities")
    .select("id, kind, name, address, operating_hours, public_contact")
    .order("name");
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  if (error) throw new Error("Unable to load facilities from the database.");
  return (data ?? []).map((row: Row) => ({
    id: String(row.id),
    kind: row.kind as FacilityRecord["kind"],
    name: String(row.name),
    address: String(row.address),
    operatingHours: typeof row.operating_hours === "string" ? row.operating_hours : null,
    publicContact: typeof row.public_contact === "string" ? row.public_contact : null,
  }));
}

export async function getFacility(id: string): Promise<FacilityRecord | null> {
  await requirePatient();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("facilities")
    .select("id, kind, name, address, operating_hours, public_contact")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Unable to load the facility from the database.");
  if (!data) return null;
  return {
    id: data.id,
    kind: data.kind,
    name: data.name,
    address: data.address,
    operatingHours: data.operating_hours,
    publicContact: data.public_contact,
  } as FacilityRecord;
}

function prescription(row: Row): PatientPrescription {
  const doctor = object(row.doctor);
  const clinic = object(row.clinic);
  const items = Array.isArray(row.items) ? row.items : [];
  return {
    id: String(row.id),
    mockUpsc: String(row.mock_upsc),
    issuedAt: String(row.issued_at),
    doctorName: typeof doctor.display_name === "string" ? doctor.display_name : "Assigned doctor",
    clinicName: typeof clinic.name === "string" ? clinic.name : "Assigned clinic",
    items: items.map((value) => {
      const item = object(value);
      const medicine = object(item.medicine);
      return {
        medicineId: String(item.medicine_id),
        genericName: String(medicine.generic_name),
        strength: String(medicine.strength),
        dosageForm: String(medicine.dosage_form),
        prescribedQuantity: typeof item.prescribed_quantity === "number" ? item.prescribed_quantity : null,
        instructions: String(item.instructions),
      };
    }),
  };
}

export async function listMyPrescriptions(): Promise<PatientPrescription[]> {
  await requirePatient("active");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prescriptions")
    .select(`id, mock_upsc, issued_at,
      doctor:profiles!prescriptions_doctor_id_fkey(display_name),
      clinic:facilities!prescriptions_clinic_id_fkey(name),
      items:prescription_items(medicine_id, prescribed_quantity, instructions,
        medicine:medicines!prescription_items_medicine_id_fkey(generic_name, strength, dosage_form))`)
    .order("issued_at", { ascending: false });
  if (error) throw new Error("Unable to load prescriptions from the database.");
  return (data ?? []).map((row: Row) => prescription(row));
}

export async function getMyPrescription(id: string): Promise<PatientPrescription | null> {
  const rows = await listMyPrescriptions();
  return rows.find((item) => item.id === id) ?? null;
}

export async function listMedicineAvailability(): Promise<AvailabilityRecord[]> {
  await requirePatient("active");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("medicine_availability")
    .select(`id, status, updated_at,
      facility:facilities!medicine_availability_facility_id_fkey(id, kind, name, address, operating_hours, public_contact),
      medicine:medicines!medicine_availability_medicine_id_fkey(id, generic_name, strength, dosage_form)`)
    .order("updated_at", { ascending: false });
  if (error) throw new Error("Unable to load medicine availability from the database.");
  return (data ?? []).map((row: Row) => {
    const facility = object(row.facility);
    const medicine = object(row.medicine);
    return {
      id: String(row.id),
      status: row.status as AvailabilityRecord["status"],
      updatedAt: String(row.updated_at),
      facility: {
        id: String(facility.id),
        kind: facility.kind as FacilityRecord["kind"],
        name: String(facility.name),
        address: String(facility.address),
        operatingHours: typeof facility.operating_hours === "string" ? facility.operating_hours : null,
        publicContact: typeof facility.public_contact === "string" ? facility.public_contact : null,
      },
      medicine: {
        id: String(medicine.id),
        genericName: String(medicine.generic_name),
        strength: String(medicine.strength),
        dosageForm: String(medicine.dosage_form),
      },
    };
  });
}

export async function listMyNotifications(): Promise<NotificationRecord[]> {
  await requirePatient("active");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, channel, title, message, read_at, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Unable to load notifications from the database.");
  return (data ?? []).map((row: Row) => ({
    id: String(row.id),
    channel: row.channel as NotificationRecord["channel"],
    title: String(row.title),
    message: String(row.message),
    readAt: typeof row.read_at === "string" ? row.read_at : null,
    createdAt: String(row.created_at),
  }));
}

export async function getMyPendingActivation() {
  await requirePatient("pending");
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_my_pending_activation");
  if (error) throw new Error("Unable to load your pending activation record.");
  const value = object(data);
  const clinic = object(value.clinic);
  if (!value.verificationReference || !clinic.id) throw new Error("Your clinic selection is incomplete.");
  return {
    displayName: typeof value.displayName === "string" ? value.displayName : "Patient",
    verificationReference: String(value.verificationReference),
    clinic: {
      id: String(clinic.id),
      name: String(clinic.name),
      address: String(clinic.address),
      operatingHours: typeof clinic.operatingHours === "string" ? clinic.operatingHours : null,
      publicContact: typeof clinic.publicContact === "string" ? clinic.publicContact : null,
    },
  };
}
