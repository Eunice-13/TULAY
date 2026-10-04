import type { Metadata } from "next";
import { MenuScreen } from "@/features/auth/MenuScreen";
import { requirePatient } from "@/lib/auth";

export const metadata: Metadata = { title: "Your account • TULAY" };

/** TULAY / Account menu (222:4366) */
export default async function AccountMenuPage() {
  const profile = await requirePatient("active");
  return (
    <MenuScreen
      title="Your account"
      closeHref="/dashboard"
      homeHref="/dashboard"
      profile={{ name: profile.displayName ?? "Patient" }}
      dividers
      links={[
        { href: "/prescriptions", icon: "user", title: "My prescriptions", description: "Prescriptions issued to this account." },
        { href: "/directory", icon: "user", title: "Care directory", description: "Clinics and pharmacies from TULAY." },
        { href: "/notifications", icon: "settings", title: "Notifications", description: "Updates saved for this account." },
      ]}
      spacer="h-[70px]"
      logoutHref="/account/logout"
    />
  );
}
