import { useState } from "react";
import { TextField } from "../../../components/ui/Field";
import { FormModal } from "../../../components/ui/FormModal";
import { useI18n } from "../../../i18n/I18nContext";
import { useData } from "../../../store/DataContext";
import type { TimelineEvent } from "../../../types";
import { fromDateInputValue, toDateInputValue } from "../../../utils/date";
import { createId } from "../../../utils/id";
import { sameInAllLanguages } from "../../../utils/localized";

interface TimelineEventModalProps {
  courseId: string;
  /** Milestone to edit; omit to add a new one. */
  event?: TimelineEvent;
  onClose: () => void;
}

/** Add or edit a course timeline milestone. */
export function TimelineEventModal({ courseId, event, onClose }: TimelineEventModalProps) {
  const { t, l } = useI18n();
  const { dispatch } = useData();
  const [title, setTitle] = useState(event ? l(event.title) : "");
  const [date, setDate] = useState(event ? toDateInputValue(event.date) : "");
  const [done, setDone] = useState(event?.done ?? false);

  const save = () => {
    // Keep the other language's text when the title wasn't changed.
    const unchanged = event && l(event.title) === title;
    dispatch({
      type: "timeline/save",
      event: {
        id: event?.id ?? createId("tl"),
        courseId,
        title: unchanged ? event.title : sameInAllLanguages(title),
        date: fromDateInputValue(date),
        done,
      },
    });
    onClose();
  };

  return (
    <FormModal title={event ? t.timeline.edit : t.timeline.add} onClose={onClose} onSubmit={save}>
      <TextField label={t.common.title} required value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label={t.common.date} type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
      <label className="checkbox">
        <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
        {t.timeline.markDone}
      </label>
    </FormModal>
  );
}
