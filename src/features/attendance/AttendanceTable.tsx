import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Table, type Column } from "../../components/ui/Table";
import { useLookups } from "../../hooks/useLookups";
import { useI18n } from "../../i18n/I18nContext";
import { attendanceFor } from "../../services/academics";
import { useData } from "../../store/DataContext";
import type { AttendanceRecord, AttendanceStatus } from "../../types";

export const ATTENDANCE_TONE: Record<AttendanceStatus, BadgeTone> = {
  present: "success",
  late: "warning",
  absent: "danger",
};

interface AttendanceTableProps {
  studentId: string;
  courseIds: string[];
  /** Adds a course column (for lists across courses). */
  showCourse?: boolean;
}

export function AttendanceTable({ studentId, courseIds, showCourse = false }: AttendanceTableProps) {
  const { t, formatDate } = useI18n();
  const { data } = useData();
  const { courseTitle } = useLookups();

  const columns: Column<AttendanceRecord>[] = [
    { key: "date", header: t.common.date, render: (r) => formatDate(r.date) },
    ...(showCourse ? [{ key: "course", header: t.common.course, render: (r: AttendanceRecord) => courseTitle(r.courseId) }] : []),
    { key: "status", header: t.common.status, render: (r) => <Badge tone={ATTENDANCE_TONE[r.status]}>{t.attendance.status[r.status]}</Badge> },
  ];

  return (
    <Table
      columns={columns}
      rows={attendanceFor(data, studentId, courseIds)}
      rowKey={(r) => r.id}
      emptyMessage={t.attendance.empty}
    />
  );
}
