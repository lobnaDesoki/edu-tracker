import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ItemRow } from "../../components/ui/ItemRow";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { ICONS } from "../../constants/icons";
import { useLookups } from "../../hooks/useLookups";
import { useI18n } from "../../i18n/I18nContext";
import { assessmentsFor, coursesForInstructor, isLateSubmission, pendingGradingFor } from "../../services/academics";
import { useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";
import { isPast } from "../../utils/date";
import { CourseGrid } from "../courses/components/CourseGrid";
import { GradeModal, type GradeTarget } from "../courses/components/GradeModal";

export function InstructorDashboard() {
  const { t, l, formatDateTime } = useI18n();
  const { data } = useData();
  const user = useCurrentUser();
  const { courseTitle, userName } = useLookups();
  const [grading, setGrading] = useState<GradeTarget | null>(null);
  const courses = coursesForInstructor(data, user.id);
  const pending = pendingGradingFor(data, user.id);
  const studentCount = new Set(courses.flatMap((course) => course.studentIds)).size;
  const upcomingCount = assessmentsFor(data, courses.map((course) => course.id)).filter((a) => !isPast(a.dueAt)).length;

  return (
    <>
      <PageHeader title={t.dashboard.greeting(user.name)} subtitle={t.dashboard.instructorSubtitle} />
      <div className="grid">
        <StatCard icon={ICONS.courses} label={t.dashboard.activeCourses} value={courses.length} />
        <StatCard icon={ICONS.students} label={t.dashboard.totalStudents} value={studentCount} />
        <StatCard icon={ICONS.grades} label={t.dashboard.toGrade} value={pending.length} />
        <StatCard icon={ICONS.submissionDue} label={t.dashboard.upcoming} value={upcomingCount} />
      </div>
      <Card title={t.dashboard.needsGrading}>
        {pending.length ? (
          <ul className="list-plain">
            {pending.map(({ assessment, submission }) => (
              <ItemRow
                key={submission.id}
                icon={ICONS[assessment.kind]}
                title={`${userName(submission.studentId)} · ${l(assessment.title)}`}
                meta={`${courseTitle(assessment.courseId)} · ${t.assessments.submittedOn(formatDateTime(submission.submittedAt ?? ""))}`}
                trailing={
                  <>
                    {isLateSubmission(assessment, submission) && <Badge tone="warning">{t.assessments.status.late}</Badge>}
                    <Button size="sm" onClick={() => setGrading({ assessment, studentId: submission.studentId })}>
                      {t.assessments.grade}
                    </Button>
                  </>
                }
              />
            ))}
          </ul>
        ) : (
          <EmptyState message={t.dashboard.nothingToGrade} />
        )}
      </Card>
      <CourseGrid courses={courses} />
      {grading && <GradeModal {...grading} onClose={() => setGrading(null)} />}
    </>
  );
}
