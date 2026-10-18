import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  label: string;
  /** Text on the right of the label, e.g. "60%". */
  valueText: string;
}

export function ProgressBar({ value, label, valueText }: ProgressBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.labels}>
        <span>{label}</span>
        <span>{valueText}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
      >
        <div className={styles.fill} style={{ inlineSize: `${value}%` }} />
      </div>
    </div>
  );
}
