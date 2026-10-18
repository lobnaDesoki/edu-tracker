import { useState } from "react";
import { SelectField, TextAreaField, TextField, toOptions } from "../../../components/ui/Field";
import { FormModal } from "../../../components/ui/FormModal";
import { useI18n } from "../../../i18n/I18nContext";
import { useData } from "../../../store/DataContext";
import type { ContentType } from "../../../types";
import { nowIso } from "../../../utils/date";
import { createId } from "../../../utils/id";
import { sameInAllLanguages } from "../../../utils/localized";

interface ContentFormModalProps {
  courseId: string;
  onClose: () => void;
}

/** Instructor publishes a lesson, video or file. */
export function ContentFormModal({ courseId, onClose }: ContentFormModalProps) {
  const { t } = useI18n();
  const { dispatch } = useData();
  const [type, setType] = useState<ContentType>("lesson");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const save = () => {
    dispatch({
      type: "content/add",
      item: {
        id: createId("ct"),
        courseId,
        type,
        title: sameInAllLanguages(title),
        body: sameInAllLanguages(body),
        publishedAt: nowIso(),
      },
    });
    onClose();
  };

  return (
    <FormModal title={t.content.add} onClose={onClose} onSubmit={save} submitLabel={t.common.create}>
      <SelectField
        label={t.content.type}
        options={toOptions(t.content.types)}
        value={type}
        onChange={(e) => setType(e.target.value as ContentType)}
      />
      <TextField label={t.common.title} required value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextAreaField label={t.content.body} value={body} onChange={(e) => setBody(e.target.value)} />
    </FormModal>
  );
}
