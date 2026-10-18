// Notifications are derived from the data, so they always match what happened.
import { APP_CONFIG } from "../constants/config";
import type { AppData, AssessmentKind, Localized, Role, User } from "../types";
import { compareIso, daysUntil } from "../utils/date";
import {
  assessmentsFor,
  coursesForStudent,
  findSubmission,
  isLateSubmission,
  submissionStatus,
} from "./academics";

export type NotificationKind = "quizDue" | "submissionDue" | "gradeOut" | "absent" | "missing" | "late";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  date: string;
  studentId: string;
  courseTitle: Localized;
  subject: Localized;
}

/** Which notifications each role receives (from the user stories). */
const KINDS_BY_ROLE: Partial<Record<Role, NotificationKind[]>> = {
  student: ["quizDue", "submissionDue", "gradeOut"],
  parent: ["quizDue", "gradeOut", "absent", "missing", "late"],
};

const DUE_KIND: Record<AssessmentKind, NotificationKind> = {
  quiz: "quizDue",
  assignment: "submissionDue",
};

function notificationsForStudent(data: AppData, studentId: string): AppNotification[] {
  return coursesForStudent(data, studentId).flatMap((course) => {
    const make = (kind: NotificationKind, refId: string, date: string, subject: Localized): AppNotification => ({
      id: `${kind}-${refId}-${studentId}`,
      kind,
      date,
      studentId,
      courseTitle: course.title,
      subject,
    });

    const fromAssessments = assessmentsFor(data, [course.id]).flatMap((assessment) => {
      const submission = findSubmission(data, assessment.id, studentId);
      const status = submissionStatus(assessment, submission);
      const list: AppNotification[] = [];
      if (status === "upcoming" && daysUntil(assessment.dueAt) <= APP_CONFIG.reminderWindowDays) {
        list.push(make(DUE_KIND[assessment.kind], assessment.id, assessment.dueAt, assessment.title));
      }
      if (status === "missing") list.push(make("missing", assessment.id, assessment.dueAt, assessment.title));
      if (submission?.gradedAt) list.push(make("gradeOut", assessment.id, submission.gradedAt, assessment.title));
      if (submission?.submittedAt && isLateSubmission(assessment, submission)) {
        list.push(make("late", assessment.id, submission.submittedAt, assessment.title));
      }
      return list;
    });

    const absences = data.attendance
      .filter((record) => record.courseId === course.id && record.studentId === studentId && record.status === "absent")
      .map((record) => make("absent", record.id, record.date, course.title));

    return [...fromAssessments, ...absences];
  });
}

export const notificationsEnabledFor = (role: Role) => !!KINDS_BY_ROLE[role];

export function notificationsFor(data: AppData, user: User): AppNotification[] {
  const kinds = KINDS_BY_ROLE[user.role];
  if (!kinds) return [];
  const studentIds = user.role === "parent" ? (user.childIds ?? []) : [user.id];
  return studentIds
    .flatMap((studentId) => notificationsForStudent(data, studentId))
    .filter((notification) => kinds.includes(notification.kind))
    .sort((a, b) => compareIso(b.date, a.date));
}
