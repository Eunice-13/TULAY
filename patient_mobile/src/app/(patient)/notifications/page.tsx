import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { InfoRow } from "@/components/ui/InfoRow";
import { listMyNotifications } from "@/lib/data/patient";

export const metadata: Metadata = { title: "Notifications • TULAY" };

/** TULAY / SMS • Visual preference (222:3988) / Visual On state (222:5562 via `?sms=on`). */
export default async function NotificationsPage() {
  const notifications = await listMyNotifications();

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href="/dashboard" />
        <h1 className="w-full text-2xl font-semibold text-primary">Notifications</h1>
        <p className="w-full text-sm text-muted">Updates stored for your TULAY account.</p>
        {notifications.length === 0 ? (
          <p className="w-full rounded-tulay bg-soft p-4 text-sm text-muted">No notifications yet.</p>
        ) : (
          <ul className="flex w-full flex-col gap-4">
            {notifications.map((notification) => (
              <li key={notification.id} className="rounded-tulay border border-canvas bg-surface p-4">
                <InfoRow title={notification.title}>
                  {notification.message}<br />
                  <span className="text-xs">{new Date(notification.createdAt).toLocaleString()} · {notification.channel === "simulated_sms" ? "Simulated SMS" : "In app"}</span>
                </InfoRow>
              </li>
            ))}
          </ul>
        )}
      </PageContent>
    </AppShell>
  );
}
