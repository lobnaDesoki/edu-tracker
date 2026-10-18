import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { SelectField, TextField, toOptions } from "../../components/ui/Field";
import { FormModal } from "../../components/ui/FormModal";
import { ItemRow } from "../../components/ui/ItemRow";
import { Modal } from "../../components/ui/Modal";
import { Notice } from "../../components/ui/Notice";
import { useI18n } from "../../i18n/I18nContext";
import { generateEmail, generatePassword } from "../../services/credentials";
import { isValidPhone, stripSpaces } from "../../services/validation";
import { useData } from "../../store/DataContext";
import type { Role, User } from "../../types";
import { createId } from "../../utils/id";

/** Admin creates an account; the email and a temporary password are generated. */
export function CreateUserModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { data, dispatch } = useData();
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<User | null>(null);

  const create = () => {
    if (phone && !isValidPhone(phone)) return setError(t.auth.invalidPhone);
    const user: User = {
      id: createId("u"),
      role,
      name: name.trim(),
      email: generateEmail(name, data.users.map((u) => u.email)),
      password: generatePassword(),
      phone: stripSpaces(phone),
      phoneVerified: false,
      mustChangePassword: true,
      ...(role === "parent" && { childIds: [] }),
    };
    dispatch({ type: "user/create", user });
    setCreated(user);
  };

  if (created) {
    return (
      <Modal
        title={t.admin.credentialsTitle}
        onClose={onClose}
        footer={<Button onClick={onClose}>{t.common.close}</Button>}
      >
        <Notice tone="success">{t.admin.credentialsNote}</Notice>
        <ul className="list-plain">
          <ItemRow title={created.email} meta={t.common.email} trailing={<CopyButton value={created.email} />} />
          <ItemRow title={created.password} meta={t.admin.tempPassword} trailing={<CopyButton value={created.password} />} />
        </ul>
      </Modal>
    );
  }

  return (
    <FormModal title={t.admin.createAccount} onClose={onClose} onSubmit={create} submitLabel={t.common.create}>
      <SelectField
        label={t.common.role}
        options={toOptions(t.roles)}
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
      />
      <TextField label={t.common.name} required value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label={t.common.phone} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={error} />
    </FormModal>
  );
}
