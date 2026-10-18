import type { ReactNode } from "react";
import { Outlet } from "react-router";
import { LanguageToggle } from "../../components/layout/LanguageToggle";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./AuthLayout.module.css";

/** Centered card layout for sign-in and onboarding pages. */
export function AuthLayout() {
  const { t } = useI18n();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <strong className={styles.brand}>{t.appName}</strong>
          <p className="muted">{t.appTagline}</p>
        </div>
        <LanguageToggle />
      </header>
      <main className={styles.card}>
        <Outlet />
      </main>
    </div>
  );
}

interface AuthPageProps {
  title: string;
  subtitle?: string;
  /** Small text above the title, e.g. "Step 1 of 2". */
  eyebrow?: string;
  children: ReactNode;
}

export function AuthPage({ title, subtitle, eyebrow, children }: AuthPageProps) {
  return (
    <div className="stack">
      <div className="stack-sm">
        {eyebrow && <span className="muted">{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
