import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ItemRow } from "../../components/ui/ItemRow";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { ICONS } from "../../constants/icons";
import { useLookups } from "../../hooks/useLookups";
import { useStudentScope } from "../../hooks/useStudentScope";
import { useI18n } from "../../i18n/I18nContext";
import { attendanceRate, averageGrade, findAssessment, recentGradesFor, upcomingFor } from "../../services/academics";
import { installmentsFor, sumAmounts, unpaid } from "../../services/payments";
import { useCurrentUser } from "../../store/AuthContext";
import { CourseGrid } from "../courses/components/CourseGrid";

const LIST_LIMIT = 5;

/** Home page for students and parents (parents see the selected child). */
export function LearnerDashboard() {
  const { t, l, formatDate, formatMoney, formatPercent } = useI18n();
  const user = useCurrentUser();
  const { data, student, courses, courseIds } = useStudentScope();
  const { courseTitle } = useLookups();
  const upcoming = upcomingFor(data, student.id).slice(0, LIST_LIMIT);
  const recentGrades = recentGradesFor(data, student.id).slice(0, LIST_LIMIT);

  return (
    <>
      <PageHeader
        title={t.dashboard.greeting(user.name)}
        subtitle={user.role === "parent" ? t.dashboard.parentSubtitle(student.name) : t.dashboard.studentSubtitle}
      />
      <div className="grid">
        <StatCard icon={ICONS.courses} label={t.dashboard.activeCourses} value={courses.length} />
        <StatCard icon={ICONS.grades} label={t.dashboard.averageGrade} value={formatPercent(averageGrade(data, student.id, courseIds))} />
        <StatCard icon={ICONS.attendance} label={t.dashboard.attendanceRate} value={formatPercent(attendanceRate(data, student.id, courseIds))} />
        <StatCard icon={ICONS.payments} label={t.dashboard.amountDue} value={formatMoney(sumAmounts(unpaid(installmentsFor(data, student.id))))} />
      </div>
      <div className="panels">
        <Card title={t.dashboard.upcoming}>
          {upcoming.length ? (
            <ul className="list-plain">
              {upcoming.map((assessment) => (
                <ItemRow
                  key={assessment.id}
                  icon={ICONS[assessment.kind]}
                  title={l(assessment.title)}
                  meta={`${courseTitle(assessment.courseId)} · ${t.assessments.due(formatDate(assessment.dueAt))}`}
                  trailing={<Badge>{t.assessments.kinds[assessment.kind]}</Badge>}
                />
              ))}
            </ul>
          ) : (
            <EmptyState message={t.dashboard.noUpcoming} />
          )}
        </Card>
        <Card title={t.dashboard.recentGrades}>
          {recentGrades.length ? (
            <ul className="list-plain">
              {recentGrades.map((submission) => {
                const assessment = findAssessment(data, submission.assessmentId);
                return (
                  assessment && (
                    <ItemRow
                      key={submission.id}
                      icon={ICONS.gradeOut}
                      title={l(assessment.title)}
                      meta={courseTitle(assessment.courseId)}
                      trailing={<Badge tone="primary">{t.common.outOf(submission.score ?? 0, assessment.maxScore)}</Badge>}
                    />
                  )
                );
              })}
            </ul>
          ) : (
            <EmptyState message={t.grades.empty} />
          )}
        </Card>
      </div>
      <CourseGrid courses={courses} studentId={student.id} />
    </>
  );
}
