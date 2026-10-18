import { useState } from "react";
import { SelectField, TextAreaField, TextField, toOptions } from "../../../components/ui/Field";
import { FormModal } from "../../../components/ui/FormModal";
import { APP_CONFIG } from "../../../constants/config";
import { useI18n } from "../../../i18n/I18nContext";
import { useData } from "../../../store/DataContext";
import type { AssessmentKind } from "../../../types";
import { fromDateInputValue } from "../../../utils/date";
import { createId } from "../../../utils/id";
import { sameInAllLanguages } from "../../../utils/localized";

interface AssessmentFormModalProps {
  courseId: string;
  onClose: () => void;
}

/** Instructor creates a new assignment or quiz. */
export function AssessmentFormModal({ courseId, onClose }: AssessmentFormModalProps) {
  const { t } = useI18n();
  const { dispatch } = useData();
  const [kind, setKind] = useState<AssessmentKind>("assignment");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxScore, setMaxScore] = useState("");

  const save = () => {
    dispatch({
      type: "assessment/add",
      assessment: {
        id: createId("a"),
        courseId,
        kind,
        title: sameInAllLanguages(title),
        description: sameInAllLanguages(description),
        dueAt: fromDateInputValue(dueDate, APP_CONFIG.defaultDueHour),
        maxScore: Number(maxScore),
      },
    });
    onClose();
  };

  return (
    <FormModal title={t.assessments.add} onClose={onClose} onSubmit={save} submitLabel={t.common.create}>
      <SelectField
        label={t.assessments.kind}
        options={toOptions(t.assessments.kinds)}
        value={kind}
        onChange={(e) => setKind(e.target.value as AssessmentKind)}
      />
      <TextField label={t.common.title} required value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextAreaField label={t.common.description} value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="grid">
        <TextField label={t.assessments.dueDate} type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <TextField label={t.assessments.maxScore} type="number" min={1} required value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />
      </div>
    </FormModal>
  );
}
