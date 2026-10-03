import Link from "next/link";

import { BuildingIcon, ChevronRightIcon, UserIcon } from "@/components/ui/icons";

const portals = [
  {
    href: "/patient",
    title: "Patient",
    description:
      "Access your beneficiary workspace, covered medicines, prescriptions, and care information.",
    icon: <UserIcon size={28} />,
  },
  {
    href: "/login",
    title: "Medical professional",
    description:
      "Continue to the secure workspace for doctors, clinic staff, and pharmacy staff.",
    icon: <BuildingIcon size={28} />,
  },
] as const;

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-4xl" aria-labelledby="welcome-title">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex rounded-full bg-secondary-100 px-4 py-2 text-sm font-semibold text-quaternary">
            TULAY · YAKAP-GAMOT
          </p>
          <h1
            id="welcome-title"
            className="mt-5 text-3xl font-semibold tracking-tight text-primary sm:text-4xl"
          >
            Welcome to TULAY
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-secondary-500">
            Choose the portal that matches how you will use the demo platform.
          </p>
        </div>

        <nav aria-label="Choose your TULAY portal" className="mt-8 sm:mt-10">
          <ul className="grid gap-4 md:grid-cols-2">
            {portals.map((portal) => (
              <li key={portal.href}>
                <Link
                  href={portal.href}
                  className="group flex min-h-48 h-full flex-col rounded-tulay-16 border border-grey-200 bg-surface p-6 shadow-sm transition hover:border-primary hover:shadow-md sm:p-8"
                >
                  <span className="flex size-14 items-center justify-center rounded-tulay-12 bg-tertiary text-primary">
                    {portal.icon}
                  </span>
                  <span className="mt-6 text-xl font-semibold text-primary">
                    {portal.title}
                  </span>
                  <span className="mt-2 text-sm leading-6 text-secondary-500">
                    {portal.description}
                  </span>
                  <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
                    Continue
                    <ChevronRightIcon
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-8 text-center text-xs leading-5 text-secondary-500">
          Hackathon demonstration only. All records and medical information are fictional.
        </p>
      </section>
    </main>
  );
}
