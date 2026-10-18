import { useState } from "react";
import { SelectField, type SelectOption } from "../../components/ui/Field";
import { FormModal } from "../../components/ui/FormModal";
import { useI18n } from "../../i18n/I18nContext";
import { findUser, usersByRole } from "../../services/academics";
import { useData } from "../../store/DataContext";
import type { User } from "../../types";

const toUserOptions = (users: User[]): SelectOption[] => users.map((user) => ({ value: user.id, label: user.name }));

export function LinkParentModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { data, dispatch } = useData();
  const parents = usersByRole(data, "parent");
  const students = usersByRole(data, "student");
  const [parentId, setParentId] = useState(parents[0]?.id ?? "");
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);

  const link = () => {
    if (findUser(data, parentId)?.childIds?.includes(studentId)) return setError(t.admin.alreadyLinked);
    dispatch({ type: "family/link", parentId, studentId });
    onClose();
  };

  return (
    <FormModal title={t.admin.linkStudent} onClose={onClose} onSubmit={link}>
      <SelectField label={t.roles.parent} required options={toUserOptions(parents)} value={parentId} onChange={(e) => setParentId(e.target.value)} />
      <SelectField
        label={t.roles.student}
        required
        options={toUserOptions(students)}
        value={studentId}
        onChange={(e) => {
          setStudentId(e.target.value);
          setError(null);
        }}
        error={error}
      />
    </FormModal>
  );
}
