import { generatePath, Link } from "react-router";
import { Table } from "../../../components/ui/Table";
import { ROUTES } from "../../../constants/routes";
import { useI18n } from "../../../i18n/I18nContext";
import { parentsOf, studentCourseSummary, studentsIn } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { Course, User } from "../../../types";

export function StudentsTab({ course }: { course: Course }) {
  const { t, formatPercent } = useI18n();
  const { data } = useData();
  const summaryOf = (student: User) => studentCourseSummary(data, student.id, course.id);

  return (
    <Table<User>
      rows={studentsIn(data, course)}
      rowKey={(student) => student.id}
      emptyMessage={t.students.empty}
      columns={[
        { key: "name", header: t.common.student, render: (s) => <strong>{s.name}</strong> },
        { key: "average", header: t.dashboard.averageGrade, render: (s) => formatPercent(summaryOf(s).average) },
        { key: "attendance", header: t.dashboard.attendanceRate, render: (s) => formatPercent(summaryOf(s).attendance) },
        {
          key: "handedIn",
          header: t.students.handedIn,
          render: (s) => t.common.countOf(summaryOf(s).handedIn, summaryOf(s).total),
        },
        {
          key: "parents",
          header: t.students.parents,
          render: (s) => parentsOf(data, s.id).map((parent) => parent.name).join(", ") || t.common.none,
        },
        {
          key: "action",
          header: t.common.actions,
          render: (s) => (
            <Link to={generatePath(ROUTES.studentStatus, { courseId: course.id, studentId: s.id })}>{t.students.viewStatus}</Link>
          ),
        },
      ]}
    />
  );
}
