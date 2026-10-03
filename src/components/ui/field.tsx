import type {
  ComponentProps,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const control =
  "mt-1.5 block w-full min-h-11 rounded-tulay-8 border border-grey-200 bg-surface px-3.5 py-2.5 text-sm text-primary placeholder:text-secondary-500 disabled:bg-canvas disabled:text-secondary-500 aria-[invalid=true]:border-danger";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

function FieldShell({ id, label, hint, error, optional, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold leading-6">
        {label}
        {optional ? <span className="font-normal text-secondary-500"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs leading-5 text-secondary-500">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: ReactNode, error?: string) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

type TextFieldProps = Omit<ComponentProps<"input">, "id"> &
  Omit<FieldShellProps, "children">;

export function TextField({ id, label, hint, error, optional, className = "", ...rest }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        className={`${control} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> &
  Omit<FieldShellProps, "children"> & { children: ReactNode };

export function SelectField({ id, label, hint, error, optional, children, className = "", ...rest }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <select
        id={id}
        className={`${control} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}

type TextAreaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> &
  Omit<FieldShellProps, "children">;

export function TextAreaField({ id, label, hint, error, optional, className = "", ...rest }: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        rows={3}
        className={`${control} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldShell>
  );
}
