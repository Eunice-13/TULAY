import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <section>
        <h1>TULAY (YAKAP-GAMOT)</h1>
        <p>
          A bridge between beneficiaries and the medicines covered for them.
          Register, get activated by a clinic, find covered medicines, and
          locate a pharmacy with live stock status.
        </p>
      </section>

      <section>
        <h2>What is YAKAP-GAMOT?</h2>
        <p>
          YAKAP-GAMOT helps beneficiaries understand what medicines are
          covered, where they are available, and how to claim them.
        </p>
      </section>

      <nav>
        <Link href="/eligibility-guide">Check eligibility</Link>
        <Link href="/directory">Find a provider</Link>
        <Link href="/register">Register</Link>
        <Link href="/login">Log in</Link>
      </nav>
    </main>
  );
}
