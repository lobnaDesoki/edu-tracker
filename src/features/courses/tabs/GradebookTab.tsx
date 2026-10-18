import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Notice } from "../../../components/ui/Notice";
import { Table, type Column } from "../../../components/ui/Table";
import { useI18n } from "../../../i18n/I18nContext";
import { assessmentsFor, findSubmission, studentsIn } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { Course, User } from "../../../types";
import { parseScore } from "../grading";
import styles from "./GradebookTab.module.css";

const cellKey = (assessmentId: string, studentId: string) => `${assessmentId}:${studentId}`;

type Feedback = { tone: "success" | "danger"; text: string } | null;

/** Grid of every student × assessment so the instructor can enter many grades at once. */
export function GradebookTab({ course }: { course: Course }) {
  const { t, l } = useI18n();
  const { data, dispatch } = useData();
  const assessments = assessmentsFor(data, [course.id]);
  const students = studentsIn(data, course);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);

  const savedScore = (assessmentId: string, studentId: string) =>
    findSubmission(data, assessmentId, studentId)?.score?.toString() ?? "";

  const save = () => {
    const changes = Object.entries(drafts).map(([key, value]) => {
      const [assessmentId, studentId] = key.split(":");
      const assessment = assessments.find((a) => a.id === assessmentId);
      return { assessmentId, studentId, assessment, score: assessment ? parseScore(value, assessment.maxScore) : null };
    });
    const invalid = changes.find((change) => change.score === null);
    if (invalid?.assessment) {
      return setFeedback({ tone: "danger", text: `${l(invalid.assessment.title)}: ${t.assessments.scoreInvalid(invalid.assessment.maxScore)}` });
    }
    changes.forEach(({ assessmentId, studentId, score }) => {
      if (score !== null) dispatch({ type: "submission/grade", assessmentId, studentId, score });
    });
    setDrafts({});
    setFeedback({ tone: "success", text: t.assessments.gradesSaved });
  };

  const columns: Column<User>[] = [
    { key: "student", header: t.common.student, render: (s) => <strong>{s.name}</strong> },
    ...assessments.map((assessment) => ({
      key: assessment.id,
      header: (
        <span className="stack-sm">
          {l(assessment.title)}
          <span className="muted">/ {assessment.maxScore}</span>
        </span>
      ),
      render: (student: User) => {
        const key = cellKey(assessment.id, student.id);
        return (
          <input
            className={styles.scoreInput}
            type="number"
            min={0}
            max={assessment.maxScore}
            step="0.5"
            aria-label={`${student.name} · ${l(assessment.title)}`}
            value={drafts[key] ?? savedScore(assessment.id, student.id)}
            onChange={(e) => setDrafts({ ...drafts, [key]: e.target.value })}
          />
        );
      },
    })),
  ];

  return (
    <div className="stack">
      {feedback && <Notice tone={feedback.tone}>{feedback.text}</Notice>}
      <Table columns={columns} rows={students} rowKey={(s) => s.id} emptyMessage={t.students.empty} />
      <div>
        <Button onClick={save} disabled={!Object.keys(drafts).length}>
          {t.assessments.saveGrades}
        </Button>
      </div>
    </div>
  );
}
