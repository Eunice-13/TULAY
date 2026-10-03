import type { Metadata } from "next";
import { MenuScreen } from "@/features/auth/MenuScreen";
import { DEMO_PATIENT } from "@/features/registration/mock-data";

export const metadata: Metadata = { title: "Your account • TULAY" };

/** TULAY / Account menu (222:4366) */
export default function AccountMenuPage() {
  return (
    <MenuScreen
      title="Your account"
      closeHref="/dashboard"
      homeHref="/dashboard"
      profile={{ name: DEMO_PATIENT.fullName }}
      dividers
      links={[
        { href: "/account/profile", icon: "user", title: "Edit profile", description: "Patient and dependent information." },
        { href: "/account/switch", icon: "user", title: "Switch account", description: "Choose your demo patient profile." },
        { href: "/account/settings", icon: "settings", title: "Settings", description: "Preferences and account options." },
      ]}
      actions={[
        { href: "/benefit-balance", label: "Estimated balance" },
        { href: "/referrals", label: "My referrals" },
      ]}
      spacer="h-[70px]"
      logoutHref="/account/logout"
    />
  );
}
