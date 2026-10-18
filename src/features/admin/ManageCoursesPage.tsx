import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Table } from "../../components/ui/Table";
import { ICONS } from "../../constants/icons";
import { useI18n } from "../../i18n/I18nContext";
import { useData } from "../../store/DataContext";
import type { Course } from "../../types";
import { CourseFormModal } from "./CourseFormModal";
import { EnrollModal } from "./EnrollModal";
import { InstructorSelect } from "./InstructorSelect";

/** Admin: create courses, assign instructors and enroll students. */
export function ManageCoursesPage() {
  const { t, l, formatMoney } = useI18n();
  const { data, dispatch } = useData();
  const [creating, setCreating] = useState(false);
  const [enrolling, setEnrolling] = useState<Course | null>(null);

  return (
    <>
      <PageHeader
        title={t.nav.manageCourses}
        actions={
          <Button icon={ICONS.plus} onClick={() => setCreating(true)}>
            {t.admin.newCourse}
          </Button>
        }
      />
      <Card>
        <Table<Course>
          rows={data.courses}
          rowKey={(course) => course.id}
          emptyMessage={t.courses.empty}
          columns={[
            { key: "title", header: t.common.course, render: (c) => <strong>{l(c.title)}</strong> },
            {
              key: "instructor",
              header: t.common.instructor,
              render: (c) => (
                <InstructorSelect
                  label={`${t.common.instructor} · ${l(c.title)}`}
                  hideLabel
                  value={c.instructorId}
                  onChange={(instructorId) => dispatch({ type: "course/assignInstructor", courseId: c.id, instructorId })}
                />
              ),
            },
            { key: "fee", header: t.admin.fee, render: (c) => `${formatMoney(c.feeEgp)} / ${c.installmentCount}` },
            {
              key: "students",
              header: t.admin.manageStudents,
              render: (c) => (
                <Button size="sm" variant="secondary" icon={ICONS.students} onClick={() => setEnrolling(c)}>
                  {t.courses.studentsCount(c.studentIds.length)}
                </Button>
              ),
            },
          ]}
        />
      </Card>
      {creating && <CourseFormModal onClose={() => setCreating(false)} />}
      {enrolling && <EnrollModal course={enrolling} onClose={() => setEnrolling(null)} />}
    </>
  );
}
