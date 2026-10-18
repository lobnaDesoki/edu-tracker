import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Default: "primary" */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Default: "md" */
  size?: "sm" | "md";
  /** Shown before the label. */
  icon?: ReactNode;
  /** Stretch to the container width. Default: false */
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)}
      {...rest}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
