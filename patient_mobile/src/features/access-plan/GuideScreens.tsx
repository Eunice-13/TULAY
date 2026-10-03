import type { ReactNode } from "react";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { GuideCard, type GuideCardProps } from "./GuideCard";

/**
 * P4 guide screens.
 * - public/pending set: 222:2236, 222:2276, 222:2341
 * - active set: 222:5038, 222:5104, 222:5195 (copy, casing and spacing differ slightly)
 */
export type GuideContext = {
  variant: "public" | "active";
  /** Route prefix for the guide set: "/eligibility-guide" or "/guide". */
  base: string;
  backHref: string;
  /** Destination of "Select my registered clinic". */
  clinicHref: string;
};

function GuideHeading({ title, subtitle, backHref }: { title: string; subtitle: string; backHref: string }) {
  return (
    <>
      <BackLink href={backHref} size="sm" tone="primary" />
      <h1 className="w-full text-2xl font-bold text-primary">{title}</h1>
      <p className="w-full text-sm font-medium text-primary">{subtitle}</p>
    </>
  );
}

export function GuideIndex({ variant, base, backHref }: GuideContext) {
  const active = variant === "active";
  const cards: GuideCardProps[] = [
    {
      href: `${base}/benefits`,
      title: active ? "Primary Care starts at your clinic" : "Primary care starts at your clinic",
      description: "Consultations, doctor-ordered tests and prescribed medicines.",
      icon: "hospital",
      surface: "bg-soft",
    },
    {
      href: `${base}/enrollment`,
      title: "Ready to enroll?",
      description: "Choose your registered clinic. Walk in for verification.",
      icon: "check",
      surface: "bg-canvas",
    },
    {
      href: `${base}/benefits#medicines`,
      title: "Your medicines and E-Reseta",
      description: "A consultation comes before a prescription.",
      icon: "rx",
      surface: "bg-success",
    },
  ];

  return (
    <>
      <GuideHeading title="Understand YAKAP-GAMOT" subtitle="Tap a guide to learn more." backHref={backHref} />
      <ul className={cn("grid w-full grid-cols-1 md:grid-cols-3 md:gap-6", active ? "gap-5" : "gap-10")}>
        {cards.map((card) => (
          <li key={card.href}>
            <GuideCard {...card} compact={active} />
          </li>
        ))}
      </ul>
    </>
  );
}

type GuideItem = { id?: string; icon: IconName; title: string; body: ReactNode };

function GuideList({ items, dividers = true }: { items: GuideItem[]; dividers?: boolean }) {
  return (
    <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-8">
      {items.map((item) => (
        <li key={item.title} id={item.id} className="flex flex-col gap-5">
          <div className="flex w-full items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-tulay bg-soft">
              <Icon name={item.icon} size={24} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1 break-words-safe">
              <h2 className="text-base font-bold text-primary">{item.title}</h2>
              <p className="text-xs text-black">{item.body}</p>
            </div>
          </div>
          {dividers ? <Divider /> : null}
        </li>
      ))}
    </ul>
  );
}

export function BenefitsGuide({ variant, base, backHref }: GuideContext) {
  const active = variant === "active";
  const items: GuideItem[] = [
    { icon: "hospital", title: "Consultations", body: "Visit your selected YAKAP clinic for primary care." },
    {
      id: "medicines",
      icon: "rx",
      title: "Medicines",
      body: "The draft describes 75 medicines: 21 clinic and 54 pharmacy entries.",
    },
    {
      icon: "hospital",
      title: "Laboratory Tests",
      body: "A doctor orders the test. Some tests use your clinic’s partner laboratory.",
    },
    { icon: "hospital", title: "Cancer Screening", body: "Your doctor recommends screening when appropriate." },
    {
      icon: "hospital",
      title: "Hospital Referral",
      body: "Your doctor may refer you for specialist or hospital care.",
    },
  ];

  return (
    <>
      <GuideHeading
        title={active ? "Your Care Benefits" : "Your care benefits"}
        subtitle="Program overview for the patient guide."
        backHref={backHref}
      />
      <GuideList items={items} />
      <ButtonLink href={`${base}/enrollment`} className="md:max-w-sm">
        {active ? "How to Enroll" : "How to enroll"}
      </ButtonLink>
    </>
  );
}

function enrollmentItems(active: boolean): GuideItem[] {
  if (active) {
    return [
      {
        icon: "hospital",
        title: "1. Select your registered clinic",
        body: "Browse nearby clinics and choose the clinic where you will enroll.",
      },
      {
        icon: "hospital",
        title: "2. Visit during clinic hours",
        body: "Bring your PhilHealth information and ask staff about enrollment requirements.",
      },
      {
        icon: "hospital",
        title: "3. Complete the clinic process",
        body: "Staff handle identity verification, the agreement and the first patient encounter.",
      },
      {
        icon: "guide",
        title: "4. Wait for account activation",
        body: "Only authorized clinic staff can activate your TULAY account.",
      },
    ];
  }
  return [
    {
      icon: "hospital",
      title: "1. Select your Registered Clinic",
      body: (
        <>
          Browse <strong className="font-bold">nearby clinics</strong> and choose the clinic where you will enroll.
        </>
      ),
    },
    {
      icon: "hospital",
      title: "2. Visit during Clinic Hours",
      body: (
        <>
          Bring your <strong className="font-bold">PhilHealth information</strong> and ask staff about enrollment
          requirements.
        </>
      ),
    },
    {
      icon: "hospital",
      title: "3. Complete the Clinic Process",
      body: (
        <>
          Staff handle <strong className="font-bold">identity verification, </strong>the agreement and the first
          patient encounter.
        </>
      ),
    },
    {
      icon: "guide",
      title: "4. Wait for account activation",
      body: (
        <>
          Only <strong className="font-bold">authorized</strong> clinic staff can activate your{" "}
          <strong className="font-bold">TULAY</strong> account.
        </>
      ),
    },
  ];
}

export function EnrollmentGuide({ variant, backHref, clinicHref }: GuideContext) {
  const active = variant === "active";
  return (
    <>
      <GuideHeading
        title="Enroll through your clinic"
        subtitle={active ? "Walk-in enrollment • no verification booking." : "Walk-in enrollment • No verification booking."}
        backHref={backHref}
      />
      <GuideList items={enrollmentItems(active)} dividers={!active} />
      <div className="flex w-full flex-col gap-5 md:flex-row md:gap-4">
        <ButtonLink href={clinicHref} className="md:max-w-sm">
          Select my registered clinic
        </ButtonLink>
        {active ? (
          <ButtonLink href="/dashboard" variant="secondary" className="md:max-w-sm">
            Back to my dashboard
          </ButtonLink>
        ) : null}
      </div>
    </>
  );
}
