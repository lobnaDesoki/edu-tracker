import { Navigate, Outlet } from "react-router";
import { ROUTES } from "../constants/routes";
import { pendingOnboardingStep } from "../features/auth/onboarding";
import { useAuth } from "../store/AuthContext";
import type { Role } from "../types";

/** Signed-in users only (onboarding pages). */
export function RequireSession() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={ROUTES.login} replace />;
}

/** Signed-in users who finished onboarding. */
export function RequireAuth() {
  const { user } = useAuth();
  if (!user) return <Navigate to={ROUTES.login} replace />;
  const step = pendingOnboardingStep(user);
  return step ? <Navigate to={step} replace /> : <Outlet />;
}

/** Pages limited to some roles; others go back to their dashboard. */
export function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth();
  return user && roles.includes(user.role) ? <Outlet /> : <Navigate to={ROUTES.dashboard} replace />;
}

/** Sign-in pages: a signed-in user is sent on to the app. */
export function RedirectIfSignedIn() {
  const { user } = useAuth();
  return user ? <Navigate to={ROUTES.dashboard} replace /> : <Outlet />;
}
