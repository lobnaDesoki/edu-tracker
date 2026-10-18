import { ROUTES } from "../../constants/routes";
import { useI18n } from "../../i18n/I18nContext";
import { useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";
import { NewPasswordForm } from "./components/NewPasswordForm";
import { OnboardingStep } from "./OnboardingStep";

export function SetPasswordPage() {
  const { t } = useI18n();
  const { dispatch } = useData();
  const user = useCurrentUser();

  return (
    <OnboardingStep route={ROUTES.setPassword} title={t.auth.setPasswordTitle} subtitle={t.auth.setPasswordSubtitle}>
      <NewPasswordForm
        submitLabel={t.common.next}
        onSubmit={(password) => {
          dispatch({ type: "user/setPassword", userId: user.id, password });
          return null;
        }}
      />
    </OnboardingStep>
  );
}
