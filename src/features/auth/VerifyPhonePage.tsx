import { ROUTES } from "../../constants/routes";
import { useI18n } from "../../i18n/I18nContext";
import { useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";
import { PhoneVerificationForm } from "./components/PhoneVerificationForm";
import { OnboardingStep } from "./OnboardingStep";

export function VerifyPhonePage() {
  const { t } = useI18n();
  const { dispatch } = useData();
  const user = useCurrentUser();

  return (
    <OnboardingStep route={ROUTES.verifyPhone} title={t.auth.verifyPhoneTitle} subtitle={t.auth.verifyPhoneSubtitle}>
      <PhoneVerificationForm
        initialPhone={user.phone}
        onVerified={(phone) => dispatch({ type: "user/verifyPhone", userId: user.id, phone })}
      />
    </OnboardingStep>
  );
}
