import { useState } from "react";
import { Link, useParams } from "react-router";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ItemRow } from "../../components/ui/ItemRow";
import { PageHeader } from "../../components/ui/PageHeader";
import { ICONS } from "../../constants/icons";
import { coursePath } from "../../constants/routes";
import { useOpenConversation } from "../../hooks/useOpenConversation";
import { useI18n } from "../../i18n/I18nContext";
import { assessmentsFor, findCourse, findUser, parentsOf } from "../../services/academics";
import { useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";
import { AttendanceTable } from "../attendance/AttendanceTable";
import { GradesTable } from "../grades/GradesTable";
import { GradeModal, type GradeTarget } from "./components/GradeModal";
import { StudentSummaryStats } from "./components/StudentSummaryStats";

/** Instructor's view of one student in one course. */
export function StudentStatusPage() {
  const { t, l } = useI18n();
  const { data } = useData();
  const user = useCurrentUser();
  const openConversation = useOpenConversation();
  const { courseId = "", studentId = "" } = useParams();
  const [grading, setGrading] = useState<GradeTarget | null>(null);
  const course = findCourse(data, courseId);
  const student = findUser(data, studentId);

  if (!course || !student || course.instructorId !== user.id || !course.studentIds.includes(student.id)) {
    return <EmptyState message={t.students.notFound} />;
  }

  const parents = parentsOf(data, student.id);
  const contact = (userId: string) => openConversation({ userId, courseId: course.id, studentId: student.id });

  return (
    <>
      <PageHeader
        title={student.name}
        subtitle={<Link to={coursePath(course.id, "students")}>{l(course.title)}</Link>}
        actions={
          <Button variant="secondary" icon={ICONS.messages} onClick={() => contact(student.id)}>
            {t.students.message}
          </Button>
        }
      />
      <StudentSummaryStats studentId={student.id} courseId={course.id} />
      <Card title={t.courses.tabs.grades}>
        <GradesTable
          studentId={student.id}
          assessments={assessmentsFor(data, [course.id])}
          renderAction={(assessment) => (
            <Button size="sm" variant="secondary" onClick={() => setGrading({ assessment, studentId: student.id })}>
              {t.assessments.grade}
            </Button>
          )}
        />
      </Card>
      <div className="panels">
        <Card title={t.courses.tabs.attendance}>
          <AttendanceTable studentId={student.id} courseIds={[course.id]} />
        </Card>
        <Card title={t.students.parents}>
          {parents.length ? (
            <ul className="list-plain">
              {parents.map((parent) => (
                <ItemRow
                  key={parent.id}
                  title={parent.name}
                  meta={parent.phone}
                  trailing={
                    <Button size="sm" variant="secondary" icon={ICONS.messages} onClick={() => contact(parent.id)}>
                      {t.students.message}
                    </Button>
                  }
                />
              ))}
            </ul>
          ) : (
            <EmptyState message={t.students.noParents} />
          )}
        </Card>
      </div>
      {grading && <GradeModal {...grading} onClose={() => setGrading(null)} />}
    </>
  );
}
