import { useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ItemRow } from "../../../components/ui/ItemRow";
import { ICONS } from "../../../constants/icons";
import { useI18n } from "../../../i18n/I18nContext";
import { assessmentsFor, findSubmission, submissionStatus } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { Assessment, Course } from "../../../types";
import { AssessmentStatusBadge } from "../components/AssessmentStatusBadge";
import { SubmitWorkModal } from "../components/SubmitWorkModal";

interface LearnerAssessmentsTabProps {
  course: Course;
  studentId: string;
  /** Students hand in work; parents only see whether it was handed in. */
  canSubmit: boolean;
}

export function LearnerAssessmentsTab({ course, studentId, canSubmit }: LearnerAssessmentsTabProps) {
  const { t, l, formatDate, formatDateTime } = useI18n();
  const { data } = useData();
  const [submitting, setSubmitting] = useState<Assessment | null>(null);
  const assessments = assessmentsFor(data, [course.id]);

  if (!assessments.length) return <EmptyState message={t.assessments.empty} />;

  return (
    <>
      <ul className="list-plain">
        {assessments.map((assessment) => {
          const submission = findSubmission(data, assessment.id, studentId);
          const status = submissionStatus(assessment, submission);
          // Assignments are handed in online until graded; quizzes happen in class.
          const canEdit = canSubmit && assessment.kind === "assignment" && status !== "graded";
          return (
            <ItemRow
              key={assessment.id}
              icon={ICONS[assessment.kind]}
              title={l(assessment.title)}
              meta={`${t.assessments.kinds[assessment.kind]} · ${t.assessments.due(formatDate(assessment.dueAt))}`}
              trailing={
                <>
                  <AssessmentStatusBadge status={status} />
                  {submission?.score !== undefined && (
                    <Badge tone="primary">{t.common.outOf(submission.score, assessment.maxScore)}</Badge>
                  )}
                  {canEdit && (
                    <Button size="sm" variant={submission?.submittedAt ? "secondary" : "primary"} onClick={() => setSubmitting(assessment)}>
                      {submission?.submittedAt ? t.assessments.editSubmission : t.assessments.submit}
                    </Button>
                  )}
                </>
              }
            >
              <p>{l(assessment.description)}</p>
              {submission?.submittedAt && (
                <span className="muted">{t.assessments.submittedOn(formatDateTime(submission.submittedAt))}</span>
              )}
              {assessment.kind === "quiz" && <span className="muted">{t.assessments.inClass}</span>}
              {submission?.feedback && <span className="muted">{`${t.assessments.feedback}: ${submission.feedback}`}</span>}
            </ItemRow>
          );
        })}
      </ul>
      {submitting && <SubmitWorkModal assessment={submitting} studentId={studentId} onClose={() => setSubmitting(null)} />}
    </>
  );
}
