import { Icon } from "@/components/ui/Icon";

/** "Form heading and patient icon" row used across P1 screens. */
export function FormHeading({ children }: { children: string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <h1 className="min-w-0 flex-1 text-2xl font-bold text-primary break-words-safe">{children}</h1>
      <Icon name="user" size={24} />
    </div>
  );
}
