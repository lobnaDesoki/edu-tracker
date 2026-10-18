import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/Field";
import { Notice } from "../../../components/ui/Notice";
import { useI18n } from "../../../i18n/I18nContext";
import { generateCode } from "../../../services/credentials";
import { isValidPhone, stripSpaces } from "../../../services/validation";

interface PhoneVerificationFormProps {
  initialPhone: string;
  onVerified: (phone: string) => void;
}

/** Sends a (simulated) SMS code and checks it. Used in onboarding and settings. */
export function PhoneVerificationForm({ initialPhone, onVerified }: PhoneVerificationFormProps) {
  const { t } = useI18n();
  const [phone, setPhone] = useState(initialPhone);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sendCode = () => {
    if (!isValidPhone(phone)) return setError(t.auth.invalidPhone);
    setError(null);
    setCode("");
    setSentCode(generateCode());
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!sentCode) return sendCode();
    if (code !== sentCode) return setError(t.auth.invalidCode);
    onVerified(stripSpaces(phone));
  };

  return (
    <form className="stack" onSubmit={submit}>
      <TextField
        label={t.common.phone}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          setSentCode(null);
        }}
        error={sentCode ? null : error}
      />
      {sentCode && (
        <>
          <Notice>{t.auth.demoSmsCode(sentCode)}</Notice>
          <TextField label={t.auth.code} inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={(e) => setCode(e.target.value)} error={error} />
        </>
      )}
      <Button type="submit" fullWidth>
        {sentCode ? t.auth.verify : t.auth.sendSms}
      </Button>
      {sentCode && (
        <Button variant="ghost" onClick={sendCode}>
          {t.auth.resendSms}
        </Button>
      )}
    </form>
  );
}
