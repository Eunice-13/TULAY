import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { requirePatient } from "@/lib/auth";
import { listMyNotifications, listMyPrescriptions } from "@/lib/data/patient";

export const metadata: Metadata = { title: "Home • TULAY" };

export default async function DashboardPage() {
  const [profile, prescriptions, notifications] = await Promise.all([
    requirePatient("active"),
    listMyPrescriptions(),
    listMyNotifications(),
  ]);
  const latest = prescriptions[0];
  const unread = notifications.filter((item) => !item.readAt).length;

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="home">
      <PageContent gap="gap-5" width="wide">
        <h1 className="w-full text-2xl font-semibold text-primary">Hello, {profile.displayName ?? "Patient"}</h1>
        <Badge>Active - Verified by Clinic Staff</Badge>
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <InfoRow title="Your prescriptions">
            {latest ? `${prescriptions.length} issued • Latest ${new Date(latest.issuedAt).toLocaleDateString()}` : "No prescriptions have been issued."}
          </InfoRow>
          <InfoRow title="Notifications">{unread ? `${unread} unread database notification${unread === 1 ? "" : "s"}` : "No unread notifications."}</InfoRow>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <ButtonLink href="/prescriptions">My E-Reseta</ButtonLink>
          <ButtonLink href="/directory" variant="secondary">Find care</ButtonLink>
          <ButtonLink href="/notifications" variant="secondary">Notifications</ButtonLink>
        </div>
        <p className="w-full text-xs text-muted">Account status, prescriptions, and notifications shown here are loaded from Supabase.</p>
      </PageContent>
    </AppShell>
  );
}
