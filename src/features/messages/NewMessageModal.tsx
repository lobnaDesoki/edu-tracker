import { useState } from "react";
import { EmptyState } from "../../components/ui/EmptyState";
import { SelectField } from "../../components/ui/Field";
import { FormModal } from "../../components/ui/FormModal";
import { useLookups } from "../../hooks/useLookups";
import { useOpenConversation } from "../../hooks/useOpenConversation";
import { useI18n } from "../../i18n/I18nContext";
import { findUser } from "../../services/academics";
import { contactsFor } from "../../services/messaging";
import { useActiveStudent } from "../../store/ActiveStudentContext";
import { useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";

/** Pick who to write to; opens (or creates) the conversation. */
export function NewMessageModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { data } = useData();
  const user = useCurrentUser();
  const { student } = useActiveStudent();
  const { courseTitle, userName } = useLookups();
  const openConversation = useOpenConversation();
  const contacts = contactsFor(data, user, student?.id);
  const [selected, setSelected] = useState(0);

  const options = contacts.map((contact, index) => {
    const role = findUser(data, contact.userId)?.role;
    return {
      value: String(index),
      label: `${userName(contact.userId)}${role ? ` (${t.roles[role]})` : ""} · ${t.messages.about(userName(contact.studentId), courseTitle(contact.courseId))}`,
    };
  });

  const start = () => {
    const contact = contacts[selected];
    onClose();
    if (contact) openConversation(contact);
  };

  return (
    <FormModal title={t.messages.new} onClose={onClose} onSubmit={start} submitLabel={t.common.next}>
      {contacts.length ? (
        <SelectField label={t.messages.to} options={options} value={String(selected)} onChange={(e) => setSelected(Number(e.target.value))} />
      ) : (
        <EmptyState message={t.messages.noContacts} />
      )}
    </FormModal>
  );
}
