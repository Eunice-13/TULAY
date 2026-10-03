import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { Notice, PreviewNotice } from "@/components/ui/notice";
import { PageHeading } from "@/components/ui/page-heading";
import { ReferralList } from "@/features/referrals/referral-list";
import { listReferrals } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Referrals · TULAY" };

export default async function ReferralsPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;
  return (
    <>
      {sent ? (
        <div className="mb-6">
          <PreviewNotice>The digital referral was not sent. Referrals are not connected yet.</PreviewNotice>
        </div>
      ) : null}
      <PageHeading
        title="Referrals"
        description="Review incoming referrals and track care beyond your facility."
        actions={
          <>
            <LinkButton href="/doctor/referrals/new" variant="secondary">
              New digital referral
            </LinkButton>
            <LinkButton href="/doctor/referrals/escalate?patient=pt-maria">Escalate to hospital</LinkButton>
          </>
        }
      />
      <ReferralList referrals={await listReferrals()} />
      <Notice className="mt-6">
        Each referral keeps the patient summary, findings, destination, urgency and status together. Referrals
        support care navigation only; TULAY does not diagnose.
      </Notice>
    </>
  );
}
