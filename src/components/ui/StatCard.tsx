import type { ReactNode } from "react";
import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: string;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className={styles.stat}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <div>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );
}
