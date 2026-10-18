import { useLayoutEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { NAV_BY_ROLE, type NavKey } from "../../constants/navigation";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth, useCurrentUser } from "../../store/AuthContext";
import styles from "./Tour.module.css";

interface TourStep {
  title: string;
  body: string;
  /** Sidebar entry to highlight. */
  target?: NavKey;
}

/** Walks through the sidebar of the current role, highlighting each entry. */
export function Tour() {
  const { t } = useI18n();
  const user = useCurrentUser();
  const { finishTour } = useAuth();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const steps: TourStep[] = [
    { title: t.tour.welcomeTitle(user.name), body: t.tour.welcomeBody },
    ...NAV_BY_ROLE[user.role].map((key) => ({ title: t.nav[key], body: t.tour.steps[key], target: key })),
    { title: t.tour.doneTitle, body: t.tour.doneBody },
  ];
  const step = steps[index];
  const isLast = index === steps.length - 1;

  useLayoutEffect(() => {
    const measure = () =>
      setRect(step.target ? (document.querySelector(`[data-tour="${step.target}"]`)?.getBoundingClientRect() ?? null) : null);
    measure();
    // Re-measure after the mobile sidebar finishes sliding in, and on resize.
    document.addEventListener("transitionend", measure);
    window.addEventListener("resize", measure);
    return () => {
      document.removeEventListener("transitionend", measure);
      window.removeEventListener("resize", measure);
    };
  }, [step.target]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="tour-title">
      {rect ? (
        <div
          className={styles.spotlight}
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        />
      ) : (
        <div className={styles.dim} />
      )}
      <div className={styles.card}>
        <span className="muted">{t.tour.progress(index + 1, steps.length)}</span>
        <h2 id="tour-title" className={styles.title}>
          {step.title}
        </h2>
        <p>{step.body}</p>
        <div className="spread">
          {isLast ? <span /> : (
            <Button variant="ghost" onClick={finishTour}>
              {t.common.skip}
            </Button>
          )}
          <div className="row">
            {index > 0 && (
              <Button variant="secondary" onClick={() => setIndex(index - 1)}>
                {t.common.back}
              </Button>
            )}
            <Button onClick={isLast ? finishTour : () => setIndex(index + 1)} autoFocus>
              {isLast ? t.common.finish : t.common.next}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
