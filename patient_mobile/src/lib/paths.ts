export const PATIENT_BASE_PATH = "/patient";

export function patientAsset(path: string): string {
  return `${PATIENT_BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
