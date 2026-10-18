import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { useStudentScope } from "../../hooks/useStudentScope";
import { useI18n } from "../../i18n/I18nContext";
import { assessmentsFor, averageGrade } from "../../services/academics";
import { GradesTable } from "./GradesTable";

/** Every grade of the active student, grouped by course. */
export function GradesPage() {
  const { t, l, formatPercent } = useI18n();
  const { data, student, courses, courseIds } = useStudentScope();
  const averageText = (ids: string[]) => t.grades.averageOf(formatPercent(averageGrade(data, student.id, ids)));

  return (
    <>
      <PageHeader title={t.nav.grades} subtitle={`${student.name} · ${averageText(courseIds)}`} />
      {courses.length ? (
        courses.map((course) => (
          <Card key={course.id} title={l(course.title)} actions={<span className="muted">{averageText([course.id])}</span>}>
            <GradesTable studentId={student.id} assessments={assessmentsFor(data, [course.id])} />
          </Card>
        ))
      ) : (
        <EmptyState message={t.courses.empty} />
      )}
    </>
  );
}
