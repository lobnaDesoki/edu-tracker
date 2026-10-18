import type { ReactNode } from "react";
import styles from "./Notice.module.css";

interface NoticeProps {
  /** Default: "info" */
  tone?: "info" | "success" | "warning" | "danger";
  children: ReactNode;
}

/** A highlighted message box, e.g. a demo code or a success confirmation. */
export function Notice({ tone = "info", children }: NoticeProps) {
  return (
    <div className={`${styles.notice} ${styles[tone]}`} role="status">
      {children}
    </div>
  );
}
