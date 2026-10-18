import type { ReactNode } from "react";
import { Table, type Column } from "../../components/ui/Table";
import { useLookups } from "../../hooks/useLookups";
import { useI18n } from "../../i18n/I18nContext";
import { findSubmission, scorePercent, submissionStatus } from "../../services/academics";
import { useData } from "../../store/DataContext";
import type { Assessment } from "../../types";
import { AssessmentStatusBadge } from "../courses/components/AssessmentStatusBadge";

interface GradesTableProps {
  studentId: string;
  assessments: Assessment[];
  /** Adds a course column (for lists across courses). */
  showCourse?: boolean;
  /** Adds an action column, e.g. "Grade" for instructors. */
  renderAction?: (assessment: Assessment) => ReactNode;
}

/** One row per assignment/quiz with the student's status, score and feedback. */
export function GradesTable({ studentId, assessments, showCourse = false, renderAction }: GradesTableProps) {
  const { t, l, formatDate, formatPercent } = useI18n();
  const { data } = useData();
  const { courseTitle } = useLookups();
  const submissionOf = (assessment: Assessment) => findSubmission(data, assessment.id, studentId);

  const columns: Column<Assessment>[] = [
    ...(showCourse ? [{ key: "course", header: t.common.course, render: (a: Assessment) => courseTitle(a.courseId) }] : []),
    {
      key: "title",
      header: t.common.title,
      render: (a) => (
        <div className="stack-sm">
          <strong>{l(a.title)}</strong>
          <span className="muted">{t.assessments.kinds[a.kind]}</span>
        </div>
      ),
    },
    { key: "due", header: t.assessments.dueDate, render: (a) => formatDate(a.dueAt) },
    { key: "status", header: t.common.status, render: (a) => <AssessmentStatusBadge status={submissionStatus(a, submissionOf(a))} /> },
    {
      key: "score",
      header: t.assessments.score,
      render: (a) => {
        const score = submissionOf(a)?.score;
        return score === undefined ? t.common.none : t.common.outOf(score, a.maxScore);
      },
    },
    { key: "percent", header: t.grades.percent, render: (a) => formatPercent(scorePercent(a, submissionOf(a))) },
    { key: "feedback", header: t.assessments.feedback, render: (a) => submissionOf(a)?.feedback ?? t.common.none },
    ...(renderAction ? [{ key: "action", header: t.common.actions, render: renderAction }] : []),
  ];

  return <Table columns={columns} rows={assessments} rowKey={(a) => a.id} emptyMessage={t.grades.empty} />;
}
