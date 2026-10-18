import { useEffect, useRef, type ReactNode } from "react";
import { ICONS } from "../../constants/icons";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./Modal.module.css";

interface ModalProps {
  title: ReactNode;
  onClose: () => void;
  /** Buttons pinned to the bottom. */
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * Native <dialog>: traps focus and closes on Escape.
 * Render it only while it should be open; unmounting closes it and resets any form inside.
 */
export function Modal({ title, onClose, footer, children }: ModalProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog ref={ref} className={styles.dialog} onClose={onClose}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t.common.close}>
            {ICONS.close}
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </dialog>
  );
}
