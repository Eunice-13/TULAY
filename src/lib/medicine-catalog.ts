import { createClient } from "@/lib/supabase/server";
import type { ApiResult, MedicineCatalogItem } from "@/types/domain";

function actionError<T>(code: string, message: string): ApiResult<T> {
  return { error: { code, message } };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMedicine(value: unknown): MedicineCatalogItem | null {
  if (
    !isObject(value) ||
    typeof value.id !== "string" ||
    typeof value.generic_name !== "string" ||
    typeof value.strength !== "string" ||
    typeof value.dosage_form !== "string" ||
    (value.coverage_group !== "yakap_essential_21" &&
      value.coverage_group !== "gamot_additional_54")
  ) {
    return null;
  }

  return {
    id: value.id,
    genericName: value.generic_name,
    strength: value.strength,
    dosageForm: value.dosage_form,
    coverageGroup: value.coverage_group,
  };
}

export async function loadMedicineCatalog(): Promise<
  ApiResult<MedicineCatalogItem[]>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("medicines")
    .select("id, generic_name, strength, dosage_form, coverage_group")
    .order("coverage_group")
    .order("generic_name");

  if (error) {
    return actionError(
      "MEDICINES_FAILED",
      "Unable to load the covered medicine catalog.",
    );
  }

  const medicines = data.map(parseMedicine);

  if (medicines.some((medicine) => medicine === null)) {
    return actionError(
      "INVALID_RESPONSE",
      "The medicine catalog returned an unexpected response.",
    );
  }

  return { data: medicines as MedicineCatalogItem[] };
}
