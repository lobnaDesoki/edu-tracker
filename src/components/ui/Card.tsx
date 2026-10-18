import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./Card.module.css";

interface CardProps {
  title?: ReactNode;
  /** Buttons shown on the title row. */
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ title, actions, className, children }: CardProps) {
  return (
    <section className={cx(styles.card, className)}>
      {(title || actions) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
