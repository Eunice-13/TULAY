import Link from "next/link";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * TULAY / Phone / Input (57:82): 14px semibold label, bordered 8px-radius
 * control, optional 12px hint.
 * - `tone="muted"` matches the Log in frame (muted value text);
 *   `tone="black"` matches registration frames.
 * - `tall` reproduces the 15.5px vertical padding used in P1 • Registration.
 * - `labelGap` is 8px in most frames, 6px in Dependents / Calendar.
 */
type FieldStyleProps = {
  /** muted: Log in · black: P1 registration · faint: Edit dependents (muted @ 72%) */
  tone?: "muted" | "black" | "faint";
  tall?: boolean;
  labelGap?: "gap-2" | "gap-1.5";
};

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> &
  FieldStyleProps & {
    label: string;
    hint?: string;
    className?: string;
  };

const controlBase = "w-full rounded-lg border border-canvas bg-surface px-3 text-base sm:text-sm";

function controlClasses({ tone = "black", tall }: FieldStyleProps) {
  return cn(
    controlBase,
    tall ? "py-[15.5px]" : "py-3",
    tone === "muted" && "text-muted placeholder:text-muted",
    tone === "black" && "text-black placeholder:text-black/70",
    tone === "faint" && "text-muted/72 placeholder:text-muted/72",
  );
}

export function TextField({ label, hint, id, className, tone, tall, labelGap = "gap-2", ...inputProps }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn("flex w-full flex-col", labelGap, className)}>
      <label htmlFor={inputId} className="text-sm font-semibold text-primary break-words-safe">
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={hintId}
        className={cn(controlClasses({ tone, tall }), "focus:border-teal")}
        {...inputProps}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-primary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Native select styled as TULAY / Phone / Input. `reserveHint` keeps the
 * empty 20px hint line present in the filter frames.
 */
type SelectFieldProps = FieldStyleProps & {
  label: string;
  name: string;
  options: readonly string[];
  defaultValue?: string;
  reserveHint?: boolean;
  className?: string;
};

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  reserveHint,
  className,
  tone = "muted",
  tall,
  labelGap = "gap-2",
}: SelectFieldProps) {
  const id = useId();
  return (
    <div className={cn("flex w-full flex-col", labelGap, className)}>
      <label htmlFor={id} className="text-sm font-semibold text-primary break-words-safe">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className={cn(controlClasses({ tone, tall }), "cursor-pointer appearance-none focus:border-teal")}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {reserveHint ? <span aria-hidden="true" className="block h-5" /> : null}
    </div>
  );
}

/**
 * Input-styled link that opens a picker screen (Birth date calendar,
 * Membership category). Rendered as a link so it is keyboard operable.
 */
type LinkFieldProps = FieldStyleProps & {
  href: string;
  label: string;
  value: ReactNode;
  hint?: string;
  /** P1 hints are 12px primary; P5 booking hints are 14px muted. */
  hintTone?: "primary" | "muted";
  className?: string;
};

export function LinkField({
  href,
  label,
  value,
  hint,
  hintTone = "primary",
  className,
  tone,
  tall,
  labelGap = "gap-2",
}: LinkFieldProps) {
  return (
    <Link href={href} className={cn("group flex w-full flex-col rounded-tulay text-left", labelGap, className)}>
      <span className="text-sm font-semibold text-primary break-words-safe">{label}</span>
      <span className={cn(controlClasses({ tone, tall }), "block group-hover:border-secondary-400")}>{value}</span>
      {hint ? (
        <span className={hintTone === "primary" ? "text-xs text-primary" : "min-h-5 text-sm text-muted"}>{hint}</span>
      ) : null}
    </Link>
  );
}
