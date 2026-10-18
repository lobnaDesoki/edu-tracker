import type { ReactNode } from "react";
import { useParams, useSearchParams } from "react-router";
import { EmptyState } from "../../../components/ui/EmptyState";
import { PageHeader } from "../../../components/ui/PageHeader";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { Tabs } from "../../../components/ui/Tabs";
import { QUERY } from "../../../constants/routes";
import { useLookups } from "../../../hooks/useLookups";
import type { Dictionary } from "../../../i18n/en";
import { useI18n } from "../../../i18n/I18nContext";
import { courseProgress, findCourse } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { Course } from "../../../types";

export type CourseTab = keyof Dictionary["courses"]["tabs"];

interface CourseShellProps {
  tabs: CourseTab[];
  /** Whether the current user may open this course. */
  canAccess: (course: Course) => boolean;
  /** Content shown between the header and the tabs. */
  summary?: (course: Course) => ReactNode;
  /** Content of the active tab. */
  children: (tab: CourseTab, course: Course) => ReactNode;
}

/** Course header, progress and tabs (the active tab is kept in the URL). */
export function CourseShell({ tabs, canAccess, summary, children }: CourseShellProps) {
  const { t, l, formatPercent } = useI18n();
  const { data } = useData();
  const { userName } = useLookups();
  const { courseId = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const course = findCourse(data, courseId);

  if (!course || !canAccess(course)) return <EmptyState message={t.courses.notFound} />;

  const requested = searchParams.get(QUERY.tab);
  const active = tabs.find((tab) => tab === requested) ?? tabs[0];
  const progress = courseProgress(data, course.id);

  return (
    <>
      <PageHeader title={l(course.title)} subtitle={`${userName(course.instructorId)} · ${l(course.schedule)}`} />
      <ProgressBar value={progress} label={t.courses.progress} valueText={formatPercent(progress)} />
      {summary?.(course)}
      <Tabs
        label={l(course.title)}
        tabs={tabs.map((id) => ({ id, label: t.courses.tabs[id] }))}
        active={active}
        onChange={(tab) => setSearchParams({ [QUERY.tab]: tab }, { replace: true })}
      />
      {children(active, course)}
    </>
  );
}
