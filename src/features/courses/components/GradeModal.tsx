import { useState } from "react";
import { TextAreaField, TextField } from "../../../components/ui/Field";
import { FormModal } from "../../../components/ui/FormModal";
import { Notice } from "../../../components/ui/Notice";
import { useLookups } from "../../../hooks/useLookups";
import { useI18n } from "../../../i18n/I18nContext";
import { findSubmission, isLateSubmission } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { Assessment } from "../../../types";
import { parseScore } from "../grading";
import styles from "./GradeModal.module.css";

export interface GradeTarget {
  assessment: Assessment;
  studentId: string;
}

interface GradeModalProps extends GradeTarget {
  onClose: () => void;
}

/** Shows a student's submission and lets the instructor grade it. Mount only while open. */
export function GradeModal({ assessment, studentId, onClose }: GradeModalProps) {
  const { t, l, formatDateTime } = useI18n();
  const { data, dispatch } = useData();
  const { userName } = useLookups();
  const submission = findSubmission(data, assessment.id, studentId);
  const [score, setScore] = useState(submission?.score?.toString() ?? "");
  const [feedback, setFeedback] = useState(submission?.feedback ?? "");
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const value = parseScore(score, assessment.maxScore);
    if (value === null) return setError(t.assessments.scoreInvalid(assessment.maxScore));
    dispatch({ type: "submission/grade", assessmentId: assessment.id, studentId, score: value, feedback });
    onClose();
  };

  return (
    <FormModal title={t.assessments.gradeTitle(userName(studentId), l(assessment.title))} onClose={onClose} onSubmit={save}>
      {submission?.submittedAt && <span className="muted">{t.assessments.submittedOn(formatDateTime(submission.submittedAt))}</span>}
      {isLateSubmission(assessment, submission) && <Notice tone="warning">{t.assessments.lateNote}</Notice>}
      <blockquote className={styles.answer}>{submission?.text || t.assessments.noText}</blockquote>
      <TextField
        label={t.assessments.scoreOutOf(assessment.maxScore)}
        type="number"
        min={0}
        max={assessment.maxScore}
        step="0.5"
        required
        value={score}
        onChange={(e) => setScore(e.target.value)}
        error={error}
      />
      <TextAreaField label={t.assessments.feedback} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
    </FormModal>
  );
}
