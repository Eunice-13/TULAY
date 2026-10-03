import type { Metadata } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { Divider } from "@/components/ui/Divider";
import { ListLink } from "@/components/ui/ListLink";
import type { IconName } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "What is TULAY? • TULAY" };

const GUIDE_LINKS: Array<{ href: string; icon: IconName; title: string; description: string }> = [
  {
    href: "/eligibility-guide",
    icon: "guide",
    title: "What is YAKAP-GAMOT?",
    description: "Explore the primary care program.",
  },
  {
    href: "/eligibility-guide/enrollment",
    icon: "hospital",
    title: "How do I become a member?",
    description: "Select your registered clinic and visit in person.",
  },
  {
    href: "/eligibility-guide/benefits",
    icon: "check",
    title: "How is my account verified?",
    description: "Clinic staff verify and activate your account.",
  },
];

/** TULAY / P0 • What is TULAY? (222:2173) */
export default function WhatIsTulayPage() {
  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5">
        <BackLink href="/" />
        <h1 className="w-full text-2xl font-semibold text-primary">Care, with fewer unknowns</h1>

        <section aria-labelledby="what-is-tulay" className="flex w-full flex-col gap-3 rounded-tulay bg-soft p-4">
          <h2 id="what-is-tulay" className="text-base font-bold text-primary">
            What is TULAY?
          </h2>
          <div className="flex w-full items-center gap-3">
            <p className="min-w-0 flex-1 text-sm text-black break-words-safe">
              TULAY helps you find a clinic, view your e-reseta and check reported medicine availability.
            </p>
            <Image src="/icons/hospital-illustration.svg" alt="" width={108} height={90} className="shrink-0" />
          </div>
        </section>

        <nav aria-label="Patient guides" className="w-full pt-8">
          <ul className="flex w-full flex-col gap-7">
            {GUIDE_LINKS.map((link, index) => (
              <Fragment key={link.href}>
                {index > 0 ? (
                  <li aria-hidden="true">
                    <Divider />
                  </li>
                ) : null}
                <li>
                  <ListLink
                    href={link.href}
                    icon={link.icon}
                    title={link.title}
                    description={link.description}
                    className="py-1"
                  />
                </li>
              </Fragment>
            ))}
          </ul>
        </nav>
      </PageContent>
    </AppShell>
  );
}
