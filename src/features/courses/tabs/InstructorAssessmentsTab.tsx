import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ItemRow } from "../../../components/ui/ItemRow";
import { Modal } from "../../../components/ui/Modal";
import { Table } from "../../../components/ui/Table";
import { ICONS } from "../../../constants/icons";
import { useI18n } from "../../../i18n/I18nContext";
import { assessmentsFor, findSubmission, isHandedIn, studentsIn, submissionStatus } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { Assessment, Course, User } from "../../../types";
import { AssessmentFormModal } from "../components/AssessmentFormModal";
import { AssessmentStatusBadge } from "../components/AssessmentStatusBadge";
import { GradeModal, type GradeTarget } from "../components/GradeModal";

export function InstructorAssessmentsTab({ course }: { course: Course }) {
  const { t, l, formatDate, formatDateTime } = useI18n();
  const { data } = useData();
  const [adding, setAdding] = useState(false);
  const [reviewing, setReviewing] = useState<Assessment | null>(null);
  const [grading, setGrading] = useState<GradeTarget | null>(null);
  const assessments = assessmentsFor(data, [course.id]);
  const students = studentsIn(data, course);

  const statusOf = (assessment: Assessment, studentId: string) =>
    submissionStatus(assessment, findSubmission(data, assessment.id, studentId));

  return (
    <div className="stack">
      <div>
        <Button icon={ICONS.plus} onClick={() => setAdding(true)}>
          {t.assessments.add}
        </Button>
      </div>
      {assessments.length ? (
        <ul className="list-plain">
          {assessments.map((assessment) => (
            <ItemRow
              key={assessment.id}
              icon={ICONS[assessment.kind]}
              title={l(assessment.title)}
              meta={`${t.assessments.kinds[assessment.kind]} · ${t.assessments.due(formatDate(assessment.dueAt))} · ${t.assessments.handedIn(
                students.filter((student) => isHandedIn(statusOf(assessment, student.id))).length,
                students.length,
              )}`}
              trailing={
                <Button size="sm" variant="secondary" onClick={() => setReviewing(assessment)}>
                  {t.assessments.submissions}
                </Button>
              }
            />
          ))}
        </ul>
      ) : (
        <EmptyState message={t.assessments.empty} />
      )}

      {reviewing && (
        <Modal title={l(reviewing.title)} onClose={() => setReviewing(null)}>
          <Table<User>
            rows={students}
            rowKey={(student) => student.id}
            emptyMessage={t.students.empty}
            columns={[
              { key: "name", header: t.common.student, render: (s) => s.name },
              { key: "status", header: t.common.status, render: (s) => <AssessmentStatusBadge status={statusOf(reviewing, s.id)} /> },
              {
                key: "submitted",
                header: t.common.date,
                render: (s) => {
                  const submittedAt = findSubmission(data, reviewing.id, s.id)?.submittedAt;
                  return submittedAt ? formatDateTime(submittedAt) : t.common.none;
                },
              },
              {
                key: "grade",
                header: t.assessments.score,
                render: (s) => (
                  <Button size="sm" variant="secondary" onClick={() => setGrading({ assessment: reviewing, studentId: s.id })}>
                    {findSubmission(data, reviewing.id, s.id)?.score ?? t.assessments.grade}
                  </Button>
                ),
              },
            ]}
          />
        </Modal>
      )}
      {grading && <GradeModal {...grading} onClose={() => setGrading(null)} />}
      {adding && <AssessmentFormModal courseId={course.id} onClose={() => setAdding(false)} />}
    </div>
  );
}
