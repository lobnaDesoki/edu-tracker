import { useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/Field";
import { Notice } from "../../../components/ui/Notice";
import { Table } from "../../../components/ui/Table";
import { useI18n } from "../../../i18n/I18nContext";
import { attendanceRate, studentsIn } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { AttendanceStatus, Course, User } from "../../../types";
import { fromDateInputValue, isSameDay, nowIso, toDateInputValue } from "../../../utils/date";
import { ATTENDANCE_TONE } from "../../attendance/AttendanceTable";

const STATUSES: AttendanceStatus[] = ["present", "late", "absent"];
const DEFAULT_STATUS: AttendanceStatus = "present";

/** Instructor records attendance for one session date. */
export function AttendanceTakingTab({ course }: { course: Course }) {
  const { t, formatPercent } = useI18n();
  const { data, dispatch } = useData();
  const students = studentsIn(data, course);
  const [date, setDate] = useState(toDateInputValue(nowIso()));
  const [drafts, setDrafts] = useState<Record<string, AttendanceStatus>>({});
  const [saved, setSaved] = useState(false);

  const recordedStatus = (studentId: string) =>
    data.attendance.find(
      (r) => r.courseId === course.id && r.studentId === studentId && isSameDay(r.date, fromDateInputValue(date)),
    )?.status ?? DEFAULT_STATUS;

  const statusOf = (studentId: string) => drafts[studentId] ?? recordedStatus(studentId);

  const save = () => {
    const statuses = Object.fromEntries(students.map((s) => [s.id, statusOf(s.id)]));
    dispatch({ type: "attendance/save", courseId: course.id, date: fromDateInputValue(date), statuses });
    setDrafts({});
    setSaved(true);
  };

  return (
    <div className="stack">
      <div className="row">
        <TextField
          label={t.attendance.session}
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setDrafts({});
            setSaved(false);
          }}
        />
      </div>
      {saved && <Notice tone="success">{t.attendance.saved}</Notice>}
      <Table<User>
        rows={students}
        rowKey={(s) => s.id}
        emptyMessage={t.students.empty}
        columns={[
          { key: "name", header: t.common.student, render: (s) => <strong>{s.name}</strong> },
          {
            key: "status",
            header: t.common.status,
            render: (s) => (
              <div className="row" role="radiogroup" aria-label={s.name}>
                {STATUSES.map((status) => (
                  <label key={status} className="checkbox">
                    <input
                      type="radio"
                      name={`attendance-${s.id}`}
                      checked={statusOf(s.id) === status}
                      onChange={() => {
                        setDrafts({ ...drafts, [s.id]: status });
                        setSaved(false);
                      }}
                    />
                    <Badge tone={ATTENDANCE_TONE[status]}>{t.attendance.status[status]}</Badge>
                  </label>
                ))}
              </div>
            ),
          },
          { key: "rate", header: t.attendance.history, render: (s) => formatPercent(attendanceRate(data, s.id, [course.id])) },
        ]}
      />
      <div>
        <Button onClick={save} disabled={!students.length}>
          {t.attendance.save}
        </Button>
      </div>
    </div>
  );
}
