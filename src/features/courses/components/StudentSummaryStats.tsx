import { StatCard } from "../../../components/ui/StatCard";
import { ICONS } from "../../../constants/icons";
import { useI18n } from "../../../i18n/I18nContext";
import { studentCourseSummary } from "../../../services/academics";
import { useData } from "../../../store/DataContext";

/** A student's average, attendance and hand-ins in one course. */
export function StudentSummaryStats({ studentId, courseId }: { studentId: string; courseId: string }) {
  const { t, formatPercent } = useI18n();
  const { data } = useData();
  const summary = studentCourseSummary(data, studentId, courseId);

  return (
    <div className="grid">
      <StatCard icon={ICONS.grades} label={t.dashboard.averageGrade} value={formatPercent(summary.average)} />
      <StatCard icon={ICONS.attendance} label={t.dashboard.attendanceRate} value={formatPercent(summary.attendance)} />
      <StatCard icon={ICONS.assignment} label={t.students.handedIn} value={t.common.countOf(summary.handedIn, summary.total)} />
    </div>
  );
}
