import { SelectField } from "../../components/ui/Field";
import { useI18n } from "../../i18n/I18nContext";
import { usersByRole } from "../../services/academics";
import { useData } from "../../store/DataContext";

interface InstructorSelectProps {
  label: string;
  /** Keeps the label for screen readers only (e.g. inside a table). */
  hideLabel?: boolean;
  value: string;
  onChange: (instructorId: string) => void;
}

/** Choose a course's instructor, or leave it unassigned. */
export function InstructorSelect({ label, hideLabel, value, onChange }: InstructorSelectProps) {
  const { t } = useI18n();
  const { data } = useData();
  const options = [
    { value: "", label: t.common.unassigned },
    ...usersByRole(data, "instructor").map((instructor) => ({ value: instructor.id, label: instructor.name })),
  ];

  return (
    <SelectField label={label} hideLabel={hideLabel} options={options} value={value} onChange={(e) => onChange(e.target.value)} />
  );
}
