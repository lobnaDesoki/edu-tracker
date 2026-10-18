import { ROUTES } from "../../constants/routes";
import type { User } from "../../types";

/** First-sign-in steps, in order: choose a password, then verify the phone. */
export const ONBOARDING_STEPS = [ROUTES.setPassword, ROUTES.verifyPhone] as const;

/** The onboarding page the user still has to finish, or null when done. */
export function pendingOnboardingStep(user: User): (typeof ONBOARDING_STEPS)[number] | null {
  if (user.mustChangePassword) return ROUTES.setPassword;
  if (!user.phoneVerified) return ROUTES.verifyPhone;
  return null;
}
