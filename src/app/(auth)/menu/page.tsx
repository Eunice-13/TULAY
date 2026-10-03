import type { Metadata } from "next";
import { MenuScreen } from "@/features/auth/MenuScreen";

export const metadata: Metadata = { title: "Explore TULAY • TULAY" };

/** TULAY / Menu • Before login (222:5275) */
export default function MenuBeforeLoginPage() {
  return (
    <MenuScreen
      title="Explore TULAY"
      closeHref="/"
      homeHref="/"
      links={[
        { href: "/login", icon: "user", title: "Log In", description: "Continue with your existing account." },
        { href: "/register", icon: "user", title: "Register", description: "Create your TULAY account." },
        {
          href: "/what-is-tulay",
          icon: "guide",
          title: "About TULAY",
          description: "Understand the program and your next step.",
        },
        { href: "/onboarding/clinic", icon: "pin", title: "Browse clinics", description: "Find where you can enroll." },
      ]}
    />
  );
}
