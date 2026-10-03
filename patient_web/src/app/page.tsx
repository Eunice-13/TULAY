import Link from "next/link";

const quickActions = [
  {
    href: "/medicines",
    label: "Covered medicines",
    hint: "Check what's covered for you",
  },
  {
    href: "/prescriptions",
    label: "My prescriptions",
    hint: "View your UPSC codes",
  },
  {
    href: "/pharmacy-finder",
    label: "Find a pharmacy",
    hint: "See which pharmacies have stock",
  },
  {
    href: "/notifications",
    label: "Notifications",
    hint: "Restock alerts and updates",
  },
];

export default function PatientHome() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 py-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-secondary-500">
          TULAY · YAKAP-GAMOT
        </p>
        <h1 className="text-2xl font-semibold text-primary">Kumusta 👋</h1>
        <p className="text-sm text-secondary-500">
          Your bridge to covered medicines. All data shown here is mock demo
          data.
        </p>
      </header>

      <nav aria-label="Quick actions">
        <ul className="flex flex-col gap-3">
          {quickActions.map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className="flex flex-col gap-0.5 rounded-tulay-16 border border-grey-200 bg-surface p-4 transition-colors hover:bg-tertiary"
              >
                <span className="text-base font-semibold text-primary">
                  {action.label}
                </span>
                <span className="text-sm text-secondary-500">
                  {action.hint}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-auto pt-6 text-xs text-secondary-500">
        Mock data · not for real medical use.
      </footer>
    </main>
  );
}
