import { useId, type FormEvent, type ReactNode } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface FormModalProps {
  title: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  /** Default: "Save" */
  submitLabel?: string;
  children: ReactNode;
}

/** A modal wrapping a form, with Cancel / Save in the footer. */
export function FormModal({ title, onClose, onSubmit, submitLabel, children }: FormModalProps) {
  const { t } = useI18n();
  const formId = useId();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form={formId}>
            {submitLabel ?? t.common.save}
          </Button>
        </>
      }
    >
      <form id={formId} className="stack" onSubmit={submit}>
        {children}
      </form>
    </Modal>
  );
}
