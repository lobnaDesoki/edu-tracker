import { useState } from "react";
import { TextField } from "../../components/ui/Field";
import { FormModal } from "../../components/ui/FormModal";
import { useI18n } from "../../i18n/I18nContext";
import { useData } from "../../store/DataContext";
import { createId } from "../../utils/id";
import { sameInAllLanguages } from "../../utils/localized";
import { InstructorSelect } from "./InstructorSelect";

const DEFAULT_INSTALLMENTS = "3";

/** Admin creates a course and assigns its instructor. */
export function CourseFormModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { dispatch } = useData();
  const [title, setTitle] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [schedule, setSchedule] = useState("");
  const [fee, setFee] = useState("");
  const [installments, setInstallments] = useState(DEFAULT_INSTALLMENTS);

  const save = () => {
    dispatch({
      type: "course/create",
      course: {
        id: createId("c"),
        title: sameInAllLanguages(title),
        schedule: sameInAllLanguages(schedule),
        instructorId,
        studentIds: [],
        feeEgp: Number(fee),
        installmentCount: Number(installments),
      },
    });
    onClose();
  };

  return (
    <FormModal title={t.admin.newCourse} onClose={onClose} onSubmit={save} submitLabel={t.common.create}>
      <TextField label={t.admin.courseTitle} required value={title} onChange={(e) => setTitle(e.target.value)} />
      <InstructorSelect label={t.common.instructor} value={instructorId} onChange={setInstructorId} />
      <TextField label={t.courses.schedule} required value={schedule} onChange={(e) => setSchedule(e.target.value)} />
      <div className="grid">
        <TextField label={t.admin.fee} type="number" min={0} required value={fee} onChange={(e) => setFee(e.target.value)} />
        <TextField label={t.admin.installments} type="number" min={1} required value={installments} onChange={(e) => setInstallments(e.target.value)} />
      </div>
    </FormModal>
  );
}
