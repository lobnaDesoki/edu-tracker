import type { ReactNode } from "react";
import { Outlet } from "react-router";
import { EmptyState } from "../../components/ui/EmptyState";
import { useI18n } from "../../i18n/I18nContext";
import { useActiveStudent } from "../../store/ActiveStudentContext";

/** Learner pages need a student: the student themself or a parent's linked child. */
export function LearnerGate({ children }: { children?: ReactNode }) {
  const { t } = useI18n();
  const { student } = useActiveStudent();
  if (!student) return <EmptyState message={t.dashboard.noChildren} />;
  return children ?? <Outlet />;
}
