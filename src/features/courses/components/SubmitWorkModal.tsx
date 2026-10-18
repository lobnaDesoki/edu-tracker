import { useState } from "react";
import { TextAreaField } from "../../../components/ui/Field";
import { FormModal } from "../../../components/ui/FormModal";
import { useI18n } from "../../../i18n/I18nContext";
import { findSubmission } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { Assessment } from "../../../types";

interface SubmitWorkModalProps {
  assessment: Assessment;
  studentId: string;
  onClose: () => void;
}

/** Student hands in or edits their answer. */
export function SubmitWorkModal({ assessment, studentId, onClose }: SubmitWorkModalProps) {
  const { t, l } = useI18n();
  const { data, dispatch } = useData();
  const [text, setText] = useState(findSubmission(data, assessment.id, studentId)?.text ?? "");

  const save = () => {
    dispatch({ type: "submission/save", assessmentId: assessment.id, studentId, text });
    onClose();
  };

  return (
    <FormModal title={l(assessment.title)} onClose={onClose} onSubmit={save} submitLabel={t.assessments.submit}>
      <p className="muted">{l(assessment.description)}</p>
      <TextAreaField
        label={t.assessments.answer}
        placeholder={t.assessments.answerPlaceholder}
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </FormModal>
  );
}
