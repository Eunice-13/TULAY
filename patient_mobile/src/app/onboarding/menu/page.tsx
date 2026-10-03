import type { Metadata } from "next";
import { MenuScreen } from "@/features/auth/MenuScreen";
import { DEMO_PATIENT } from "@/features/registration/mock-data";

export const metadata: Metadata = { title: "Your Account • TULAY" };

/** TULAY / Menu • Pending account (222:5335) */
export default function PendingMenuPage() {
  return (
    <MenuScreen
      title="Your Account"
      closeHref="/onboarding/pending"
      homeHref="/onboarding/pending"
      profile={{ name: DEMO_PATIENT.fullName, subtitle: "Fictional patient profile" }}
      links={[
        {
          href: "/onboarding/profile",
          icon: "user",
          title: "Edit Profile",
          description: "Patient and dependent information.",
        },
        { href: "/account/switch?state=pending", icon: "user", title: "Switch Account", description: "Demo patient profiles." },
        { href: "/onboarding/settings", icon: "settings", title: "Settings", description: "Account preferences." },
      ]}
      actions={[
        { href: "/onboarding/clinic/demo-community-clinic/plan", label: "Walk-in enrollment plan" },
        { href: "/onboarding/protected", label: "Protected features" },
      ]}
      spacer="h-20"
      logoutHref="/account/logout?state=pending"
    />
  );
}
