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
    <div className="min-h-dvh lg:grid lg:grid-cols-[minmax(0,43%)_1fr]">
      <aside className="bg-primary px-5 py-8 text-white sm:px-10 lg:min-h-dvh lg:px-16 lg:py-16">
        <div className="inline-flex rounded-tulay-16 bg-surface px-6 py-4">
          <TulayLogo />
        </div>
        <p className="mt-8 text-3xl leading-tight font-normal sm:text-[40px] sm:leading-[48px]">
          Better connected.
          <br />
          Better cared for.
        </p>
        <p className="mt-6 max-w-md text-base leading-7 text-white/85 sm:text-lg">
          One workspace to connect patients, doctors and pharmacies throughout their YAKAP–GAMOT journey.
        </p>
        <ol className="mt-8 hidden max-w-md flex-col gap-6 rounded-tulay-16 border border-white/40 bg-primary-soft p-6 sm:flex">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-5">
              <span className="pt-2 text-lg text-white/85" aria-hidden="true">
                {s.n}
              </span>
              <span>
                <span className="block text-sm font-semibold">{s.title}</span>
                <span className="block text-sm text-white/85">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-8 hidden text-xs text-white/85 sm:block">TULAY · Professional portal</p>
      </aside>

      <main id="main-content" className="flex items-start justify-center px-5 py-10 sm:px-10 lg:py-28">
        <div className="w-full max-w-[520px]">
          {children}
          <p className="mt-6 text-xs leading-5 text-secondary-500">
            Use your assigned account. Patient accounts sign in through the patient portal.
          </p>
        </div>
      </main>
    </div>
  );
}
