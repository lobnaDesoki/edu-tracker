import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { useStudentScope } from "../../hooks/useStudentScope";
import { useI18n } from "../../i18n/I18nContext";
import { attendanceRate } from "../../services/academics";
import { AttendanceTable } from "./AttendanceTable";

/** Attendance of the active student: overall, per course and every session. */
export function AttendancePage() {
  const { t, l, formatPercent } = useI18n();
  const { data, student, courses, courseIds } = useStudentScope();

  return (
    <>
      <PageHeader title={t.nav.attendance} subtitle={student.name} />
      <div className="grid">
        <StatCard label={t.attendance.rate} value={formatPercent(attendanceRate(data, student.id, courseIds))} />
        {courses.map((course) => (
          <StatCard key={course.id} label={l(course.title)} value={formatPercent(attendanceRate(data, student.id, [course.id]))} />
        ))}
      </div>
      <Card>
        <AttendanceTable studentId={student.id} courseIds={courseIds} showCourse />
      </Card>
    </>
  );
}
