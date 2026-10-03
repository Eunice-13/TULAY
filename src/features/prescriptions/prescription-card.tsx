import { FileIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PreviewPrescription } from "@/lib/preview/types";

/** E-reseta thread entry (Figma M8D / M8P). */
export function PrescriptionCard({ rx }: { rx: PreviewPrescription }) {
  return (
    <article className="rounded-tulay-12 border border-secondary-100 bg-surface p-4">
      <p className="text-sm font-semibold">{rx.issuedAt}</p>
      <p className="mt-1 text-sm text-secondary-500">{rx.note}</p>
      <div className="mt-3 flex gap-3 rounded-tulay-12 bg-canvas p-4">
        <FileIcon className="shrink-0" />
        <div className="min-w-0 text-sm leading-6">
          <p className="font-semibold break-words">E-reseta · {rx.fileName ?? "Structured prescription"}</p>
          <p>
            UPSC · <span className="font-mono">{rx.mockUpsc}</span>
          </p>
          <ul className="text-secondary-500">
            {rx.items.map((i) => (
              <li key={i.genericName}>
                {i.genericName} {i.strength} · {i.dosageForm}
              </li>
            ))}
          </ul>
          <p className="text-secondary-500">
            Issued {rx.issuedAt} · {rx.doctorName}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-secondary-500">
        <StatusBadge tone="success">Sent to patient</StatusBadge>
        <span>{rx.issuedTime} · Available in patient dashboard</span>
      </div>
    </article>
  );
}
