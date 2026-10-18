import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import styles from "./Field.module.css";

interface FieldShellProps {
  label: string;
  /** Keeps the label for screen readers only, e.g. inside a table. Default: false */
  hideLabel?: boolean;
  /** Helper text under the control. */
  hint?: string;
  /** Error text under the control; also marks it invalid. */
  error?: string | null;
}

function FieldShell({ label, hideLabel = false, hint, error, id, children }: FieldShellProps & { id: string; children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={hideLabel ? "visually-hidden" : styles.label}>
        {label}
      </label>
      {children}
      {error ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : (
        hint && <span className={styles.hint}>{hint}</span>
      )}
    </div>
  );
}

type TextFieldProps = FieldShellProps & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, hideLabel, hint, error, ...input }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hideLabel={hideLabel} hint={hint} error={error}>
      <input id={id} className={styles.control} aria-invalid={!!error} {...input} />
    </FieldShell>
  );
}

type TextAreaFieldProps = FieldShellProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ label, hideLabel, hint, error, ...textarea }: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hideLabel={hideLabel} hint={hint} error={error}>
      <textarea id={id} className={`${styles.control} ${styles.textarea}`} aria-invalid={!!error} {...textarea} />
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

/** { value: label } → select options, e.g. from a translation group. */
export const toOptions = (labels: Record<string, string>): SelectOption[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

type SelectFieldProps = FieldShellProps & SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[] };

export function SelectField({ label, hideLabel, hint, error, options, ...select }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hideLabel={hideLabel} hint={hint} error={error}>
      <select id={id} className={styles.control} aria-invalid={!!error} {...select}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
