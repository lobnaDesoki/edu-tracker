import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ItemRow } from "../../../components/ui/ItemRow";
import { ICONS } from "../../../constants/icons";
import { useI18n } from "../../../i18n/I18nContext";
import { contentFor } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { Course } from "../../../types";
import { ContentFormModal } from "../components/ContentFormModal";

interface ContentTabProps {
  course: Course;
  /** Instructors can publish new content. */
  editable: boolean;
}

export function ContentTab({ course, editable }: ContentTabProps) {
  const { t, l, formatDate } = useI18n();
  const { data } = useData();
  const [adding, setAdding] = useState(false);
  const items = contentFor(data, course.id);

  return (
    <div className="stack">
      {editable && (
        <div>
          <Button icon={ICONS.plus} onClick={() => setAdding(true)}>
            {t.content.add}
          </Button>
        </div>
      )}
      {items.length ? (
        <ul className="list-plain">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              icon={ICONS[item.type]}
              title={l(item.title)}
              meta={`${t.content.types[item.type]} · ${t.content.published(formatDate(item.publishedAt))}`}
            >
              <p>{l(item.body)}</p>
            </ItemRow>
          ))}
        </ul>
      ) : (
        <EmptyState message={t.content.empty} />
      )}
      {adding && <ContentFormModal courseId={course.id} onClose={() => setAdding(false)} />}
    </div>
  );
}
