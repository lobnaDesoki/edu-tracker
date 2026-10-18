import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/Field";
import { APP_CONFIG } from "../../../constants/config";
import { useI18n } from "../../../i18n/I18nContext";
import { validateNewPassword } from "../../../services/validation";

interface NewPasswordFormProps {
  submitLabel: string;
  /** Saves the password. Return an error message to stop, or null on success. */
  onSubmit: (password: string) => string | null;
  /** Extra fields shown above the password fields (e.g. a code or the current password). */
  children?: ReactNode;
}

/** New password + confirmation, shared by onboarding, password reset and settings. */
export function NewPasswordForm({ submitLabel, onSubmit, children }: NewPasswordFormProps) {
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const problem = validateNewPassword(password, confirmation);
    const message =
      problem === "tooShort"
        ? t.auth.passwordErrors.tooShort(APP_CONFIG.minPasswordLength)
        : problem === "mismatch"
          ? t.auth.passwordErrors.mismatch
          : onSubmit(password);
    setError(message);
    if (!message) {
      setPassword("");
      setConfirmation("");
    }
  };

  return (
    <form className="stack" onSubmit={submit}>
      {children}
      <TextField label={t.auth.newPassword} type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <TextField label={t.auth.confirmPassword} type="password" autoComplete="new-password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} error={error} />
      <Button type="submit" fullWidth>
        {submitLabel}
      </Button>
    </form>
  );
}
