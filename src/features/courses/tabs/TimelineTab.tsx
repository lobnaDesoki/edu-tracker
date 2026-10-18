import { useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ICONS } from "../../../constants/icons";
import { useI18n } from "../../../i18n/I18nContext";
import { timelineFor } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { Course, TimelineEvent } from "../../../types";
import { cx } from "../../../utils/cx";
import { TimelineEventModal } from "../components/TimelineEventModal";
import styles from "./TimelineTab.module.css";

interface TimelineTabProps {
  course: Course;
  /** Instructors can add and edit milestones. */
  editable: boolean;
}

/** Undefined = closed, null = adding, event = editing. */
type Editing = TimelineEvent | null | undefined;

export function TimelineTab({ course, editable }: TimelineTabProps) {
  const { t, l, formatDate } = useI18n();
  const { data } = useData();
  const [editing, setEditing] = useState<Editing>(undefined);
  const events = timelineFor(data, course.id);

  return (
    <div className="stack">
      {editable && (
        <div>
          <Button icon={ICONS.plus} onClick={() => setEditing(null)}>
            {t.timeline.add}
          </Button>
        </div>
      )}
      {events.length ? (
        <ol className={cx("list-plain", styles.timeline)}>
          {events.map((event) => (
            <li key={event.id} className={cx(styles.event, event.done && styles.done)}>
              <span className={styles.dot} aria-hidden="true">
                {event.done && ICONS.check}
              </span>
              <div className={styles.body}>
                <span className="muted">{formatDate(event.date)}</span>
                <strong>{l(event.title)}</strong>
              </div>
              <div className="row">
                <Badge tone={event.done ? "success" : "neutral"}>{event.done ? t.timeline.done : t.timeline.upcoming}</Badge>
                {editable && (
                  <Button size="sm" variant="ghost" icon={ICONS.edit} onClick={() => setEditing(event)}>
                    {t.common.edit}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState message={t.timeline.empty} />
      )}
      {editing !== undefined && (
        <TimelineEventModal courseId={course.id} event={editing ?? undefined} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
