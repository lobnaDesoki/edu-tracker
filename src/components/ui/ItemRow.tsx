import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./ItemRow.module.css";

interface ItemRowProps {
  icon?: string;
  title: ReactNode;
  /** Secondary line under the title. */
  meta?: ReactNode;
  /** Badges or buttons on the end side. */
  trailing?: ReactNode;
  /** Highlights the row, e.g. an unread notification. */
  highlighted?: boolean;
  children?: ReactNode;
}

/** One row of a list: icon, title, details and actions. */
export function ItemRow({ icon, title, meta, trailing, highlighted = false, children }: ItemRowProps) {
  return (
    <li className={cx(styles.row, highlighted && styles.highlighted)}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className={styles.main}>
        <div className={styles.title}>{title}</div>
        {meta && <div className="muted">{meta}</div>}
        {children}
      </div>
      {trailing && <div className={styles.trailing}>{trailing}</div>}
    </li>
  );
}
