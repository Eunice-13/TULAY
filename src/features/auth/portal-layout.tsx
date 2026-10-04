import type { ReactNode } from "react";

import { TulayLogo } from "@/components/layout/logo";

const steps = [
  { n: "01", title: "Verify and activate", body: "Identity review at the patient's clinic." },
  { n: "02", title: "Connect care", body: "Manage visits, records and referrals." },
  { n: "03", title: "Share prescriptions", body: "Send an e-reseta with its unique UPSC." },
];

/** Split layout used by the role chooser, sign-in forms and workplace picker (Figma L1/LD/LP/CSL). */
export function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:h-dvh lg:grid-cols-[minmax(0,43%)_1fr] lg:overflow-hidden">
      <aside className="hidden h-dvh flex-col bg-primary px-10 py-8 text-white lg:flex xl:px-16 xl:py-10">
        <div className="inline-flex self-start rounded-tulay-16 bg-surface px-5 py-3">
          <TulayLogo />
        </div>
        <p className="mt-6 text-3xl leading-10 font-normal xl:text-[36px] xl:leading-[44px]">
          Better connected.
          <br />
          Better cared for.
        </p>
        <p className="mt-4 max-w-md text-base leading-6 text-white/85">
          One workspace to connect patients, doctors and pharmacies throughout their YAKAP–GAMOT journey.
        </p>
        <ol className="mt-6 flex max-w-md flex-col gap-4 rounded-tulay-16 border border-white/40 bg-primary-soft p-5">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-5">
              <span className="pt-1 text-base text-white/85" aria-hidden="true">
                {s.n}
              </span>
              <span>
                <span className="block text-sm font-semibold">{s.title}</span>
                <span className="block text-sm text-white/85">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-auto pt-5 text-xs text-white/85">TULAY · Professional portal</p>
      </aside>

      <main id="main-content" className="flex min-h-dvh items-start justify-center overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:h-dvh lg:items-center">
        <div className="w-full max-w-[540px] pb-[env(safe-area-inset-bottom)]">
          {children}
          <p className="mt-4 text-xs leading-5 text-secondary-500">
            Use your assigned account. Patient accounts sign in through the patient portal.
          </p>
        </div>
      </main>
    </div>
  );
}
