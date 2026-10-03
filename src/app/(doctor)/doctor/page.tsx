import { redirect } from "next/navigation";

export default function DoctorIndex() {
  redirect("/doctor/dashboard");
}
