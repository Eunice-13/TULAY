import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ButtonLink } from "@/components/ui/Button";

/** TULAY / Start • Membership choice (222:2119) */
export default function StartPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-dvh flex-col bg-surface outline-none md:bg-canvas/40">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center gap-4 p-6 md:max-w-lg md:rounded-[16px] md:bg-surface md:p-10 md:shadow-sm">
          <h1 className="flex w-full items-center justify-center gap-2">
            <span className="whitespace-nowrap text-center text-2xl font-bold text-primary">Welcome to</span>
            <BrandLogo width={166} height={106} priority />
          </h1>

          <Link
            href="/what-is-tulay"
            className="-my-3 w-full py-3 text-center text-xs text-muted underline-offset-2 hover:underline"
          >
            A clearer way to reach your YAKAP clinic and medicines.
          </Link>

          <section
            aria-labelledby="journey-heading"
            className="flex w-full items-center gap-4 rounded-tulay bg-tertiary-100 p-4"
          >
            <h2 id="journey-heading" className="min-w-0 flex-1 text-2xl font-semibold text-black break-words-safe">
              Choose where you are in your YAKAP journey.
            </h2>
            <Link href="/what-is-tulay" aria-label="Learn what TULAY is" className="shrink-0 rounded-tulay">
              <Image src="/icons/stethoscope.svg" alt="" width={88} height={85} />
            </Link>
          </section>

          <ButtonLink href="/login">I am a YAKAP member</ButtonLink>
          <ButtonLink href="/what-is-tulay" variant="secondary">
            I am not a YAKAP member yet
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
