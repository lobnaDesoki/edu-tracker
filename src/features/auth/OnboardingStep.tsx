import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { ROUTES } from "../../constants/routes";
import { useI18n } from "../../i18n/I18nContext";
import { useCurrentUser } from "../../store/AuthContext";
import { AuthPage } from "./AuthLayout";
import { ONBOARDING_STEPS, pendingOnboardingStep } from "./onboarding";

interface OnboardingStepProps {
  route: (typeof ONBOARDING_STEPS)[number];
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Shows an onboarding step only while it is the user's pending one; otherwise moves them on. */
export function OnboardingStep({ route, title, subtitle, children }: OnboardingStepProps) {
  const { t } = useI18n();
  const pending = pendingOnboardingStep(useCurrentUser());
  if (pending !== route) return <Navigate to={pending ?? ROUTES.dashboard} replace />;

  return (
    <AuthPage
      eyebrow={t.auth.step(ONBOARDING_STEPS.indexOf(route) + 1, ONBOARDING_STEPS.length)}
      title={title}
      subtitle={subtitle}
    >
      {children}
    </AuthPage>
  );
}
