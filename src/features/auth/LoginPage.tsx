import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/Field";
import { Notice } from "../../components/ui/Notice";
import { ROUTES } from "../../constants/routes";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import { AuthPage } from "./AuthLayout";
import { DemoAccounts } from "./components/DemoAccounts";

export function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(false);

  // On success the auth guards route the user to onboarding or the dashboard.
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setFailed(!login(email, password));
  };

  return (
    <AuthPage title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}>
      <form className="stack" onSubmit={submit}>
        {failed && <Notice tone="danger">{t.auth.invalidCredentials}</Notice>}
        <TextField label={t.common.email} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label={t.common.password} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" fullWidth>
          {t.auth.login}
        </Button>
        <Link to={ROUTES.forgotPassword}>{t.auth.forgotLink}</Link>
      </form>
      <DemoAccounts
        onPick={(account) => {
          setEmail(account.email);
          setPassword(account.password);
          setFailed(false);
        }}
      />
    </AuthPage>
  );
}
