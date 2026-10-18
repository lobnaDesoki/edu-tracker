import { useState } from "react";
import { EmptyState } from "../../components/ui/EmptyState";
import { FormModal } from "../../components/ui/FormModal";
import { useI18n } from "../../i18n/I18nContext";
import { usersByRole } from "../../services/academics";
import { useData } from "../../store/DataContext";
import type { Course } from "../../types";

interface EnrollModalProps {
  course: Course;
  onClose: () => void;
}

/** Admin links students to a course. New students get the course installments. */
export function EnrollModal({ course, onClose }: EnrollModalProps) {
  const { t, l } = useI18n();
  const { data, dispatch } = useData();
  const students = usersByRole(data, "student");
  const [selected, setSelected] = useState<string[]>(course.studentIds);

  const toggle = (studentId: string) =>
    setSelected(selected.includes(studentId) ? selected.filter((id) => id !== studentId) : [...selected, studentId]);

  const save = () => {
    dispatch({ type: "course/setStudents", courseId: course.id, studentIds: selected });
    onClose();
  };

  return (
    <FormModal title={t.admin.enrollTitle(l(course.title))} onClose={onClose} onSubmit={save}>
      {students.length ? (
        <fieldset className="stack-sm">
          <legend className="visually-hidden">{t.admin.manageStudents}</legend>
          {students.map((student) => (
            <label key={student.id} className="checkbox">
              <input type="checkbox" checked={selected.includes(student.id)} onChange={() => toggle(student.id)} />
              {student.name}
              <span className="muted">{student.email}</span>
            </label>
          ))}
        </fieldset>
      ) : (
        <EmptyState message={t.students.empty} />
      )}
    </FormModal>
  );
}
