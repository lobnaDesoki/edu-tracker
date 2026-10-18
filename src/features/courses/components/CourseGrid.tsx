import { Link } from "react-router";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { coursePath } from "../../../constants/routes";
import { useLookups } from "../../../hooks/useLookups";
import { useI18n } from "../../../i18n/I18nContext";
import { courseProgress, studentCourseSummary } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { Course } from "../../../types";
import styles from "./CourseGrid.module.css";

interface CourseGridProps {
  courses: Course[];
  /** When set, each card shows this student's grade and hand-ins; otherwise the class size. */
  studentId?: string;
}

export function CourseGrid({ courses, studentId }: CourseGridProps) {
  const { t, l, formatPercent } = useI18n();
  const { data } = useData();
  const { userName } = useLookups();

  if (!courses.length) return <EmptyState message={t.courses.empty} />;

  return (
    <ul className="grid list-plain">
      {courses.map((course) => {
        const progress = courseProgress(data, course.id);
        const summary = studentId ? studentCourseSummary(data, studentId, course.id) : null;
        return (
          <li key={course.id}>
            <Link to={coursePath(course.id)} className={styles.card}>
              <strong className={styles.title}>{l(course.title)}</strong>
              <span className="muted">
                {userName(course.instructorId)} · {l(course.schedule)}
              </span>
              <ProgressBar value={progress} label={t.courses.progress} valueText={formatPercent(progress)} />
              <span className="muted">
                {summary
                  ? `${t.dashboard.averageGrade}: ${formatPercent(summary.average)} · ${t.assessments.handedIn(summary.handedIn, summary.total)}`
                  : t.courses.studentsCount(course.studentIds.length)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
