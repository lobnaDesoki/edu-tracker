import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/Field";
import { Notice } from "../../components/ui/Notice";
import { ROUTES } from "../../constants/routes";
import { useI18n } from "../../i18n/I18nContext";
import { findUserByEmail } from "../../services/academics";
import { generateCode } from "../../services/credentials";
import { useData } from "../../store/DataContext";
import type { User } from "../../types";
import { AuthPage } from "./AuthLayout";
import { NewPasswordForm } from "./components/NewPasswordForm";

type Step = "email" | "reset" | "done";

export function ForgotPasswordPage() {
  const { t } = useI18n();
  const { data, dispatch } = useData();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState<User | null>(null);
  const [sentCode, setSentCode] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const requestCode = (event: FormEvent) => {
    event.preventDefault();
    const match = findUserByEmail(data, email);
    if (!match) return setError(t.auth.unknownEmail);
    setAccount(match);
    setSentCode(generateCode());
    setStep("reset");
  };

  const resetPassword = (password: string) => {
    if (!account || code !== sentCode) return t.auth.invalidCode;
    dispatch({ type: "user/setPassword", userId: account.id, password });
    setStep("done");
    return null;
  };

  const backLink = <Link to={ROUTES.login}>{t.auth.backToLogin}</Link>;

  return (
    <AuthPage title={t.auth.forgotTitle} subtitle={t.auth.forgotSubtitle}>
      {step === "email" && (
        <form className="stack" onSubmit={requestCode}>
          <TextField label={t.common.email} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <Button type="submit" fullWidth>
            {t.auth.sendCode}
          </Button>
        </form>
      )}
      {step === "reset" && (
        <>
          <Notice>{t.auth.demoEmailCode(sentCode)}</Notice>
          <NewPasswordForm submitLabel={t.common.save} onSubmit={resetPassword}>
            <TextField label={t.auth.code} inputMode="numeric" required value={code} onChange={(e) => setCode(e.target.value)} />
          </NewPasswordForm>
        </>
      )}
      {step === "done" && <Notice tone="success">{t.auth.resetDone}</Notice>}
      {backLink}
    </AuthPage>
  );
}
