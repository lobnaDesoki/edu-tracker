import { useI18n } from "../i18n/I18nContext";
import { findCourse, findUser } from "../services/academics";
import { useData } from "../store/DataContext";

/** Display names for ids, with a fallback when the record no longer exists. */
export function useLookups() {
  const { data } = useData();
  const { t, l } = useI18n();
  return {
    courseTitle: (courseId: string) => {
      const course = findCourse(data, courseId);
      return course ? l(course.title) : t.common.none;
    },
    userName: (userId: string) => findUser(data, userId)?.name ?? t.common.unassigned,
  };
}
