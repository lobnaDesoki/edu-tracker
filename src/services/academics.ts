// Read-only queries over the app data. Pages compute everything they show through these.
import type { AppData, Assessment, Course, Role, Submission, User } from "../types";
import { compareIso, isPast } from "../utils/date";

export type SubmissionStatus = "graded" | "submitted" | "late" | "missing" | "upcoming";

const HANDED_IN: SubmissionStatus[] = ["graded", "submitted", "late"];

const isDefined = <T,>(value: T | undefined): value is T => value !== undefined;

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : undefined;

const toPercent = (part: number, total: number) => (total ? (part / total) * 100 : undefined);

export const findUser = (data: AppData, id: string) => data.users.find((user) => user.id === id);

export const findUserByEmail = (data: AppData, email: string) =>
  data.users.find((user) => user.email === email.trim().toLowerCase());

export const usersByRole =(data: AppData, role: Role) => data.users.filter((user) => user.role === role);

export const findCourse = (data: AppData, id: string) => data.courses.find((course) => course.id === id);

export const coursesForStudent = (data: AppData, studentId: string) =>
  data.courses.filter((course) => course.studentIds.includes(studentId));

export const coursesForInstructor = (data: AppData, instructorId: string) =>
  data.courses.filter((course) => course.instructorId === instructorId);

export const childrenOf = (data: AppData, parent: User) =>
  (parent.childIds ?? []).map((id) => findUser(data, id)).filter(isDefined);

export const parentsOf = (data: AppData, studentId: string) =>
  data.users.filter((user) => user.childIds?.includes(studentId));

export const studentsIn = (data: AppData, course: Course) =>
  course.studentIds.map((id) => findUser(data, id)).filter(isDefined);

export const contentFor = (data: AppData, courseId: string) =>
  data.content
    .filter((item) => item.courseId === courseId)
    .sort((a, b) => compareIso(b.publishedAt, a.publishedAt));

export const assessmentsFor = (data: AppData, courseIds: string[]) =>
  data.assessments
    .filter((assessment) => courseIds.includes(assessment.courseId))
    .sort((a, b) => compareIso(a.dueAt, b.dueAt));

export const timelineFor = (data: AppData, courseId: string) =>
  data.timeline.filter((event) => event.courseId === courseId).sort((a, b) => compareIso(a.date, b.date));

export const attendanceFor = (data: AppData, studentId: string, courseIds: string[]) =>
  data.attendance
    .filter((record) => record.studentId === studentId && courseIds.includes(record.courseId))
    .sort((a, b) => compareIso(b.date, a.date));

export const findAssessment = (data: AppData, id: string) =>
  data.assessments.find((assessment) => assessment.id === id);

export const findSubmission =(data: AppData, assessmentId: string, studentId: string) =>
  data.submissions.find((s) => s.assessmentId === assessmentId && s.studentId === studentId);

export function submissionStatus(assessment: Assessment, submission?: Submission): SubmissionStatus {
  if (submission?.score !== undefined) return "graded";
  if (submission?.submittedAt) return isLateSubmission(assessment, submission) ? "late" : "submitted";
  return isPast(assessment.dueAt) ? "missing" : "upcoming";
}

export const isHandedIn = (status: SubmissionStatus) => HANDED_IN.includes(status);

export const isLateSubmission = (assessment: Assessment, submission?: Submission) =>
  !!submission?.submittedAt && submission.submittedAt > assessment.dueAt;

export const scorePercent = (assessment: Assessment, submission?: Submission) =>
  submission?.score === undefined ? undefined : toPercent(submission.score, assessment.maxScore);

export const averageGrade = (data: AppData, studentId: string, courseIds: string[]) =>
  average(
    assessmentsFor(data, courseIds)
      .map((assessment) => scorePercent(assessment, findSubmission(data, assessment.id, studentId)))
      .filter(isDefined),
  );

export function attendanceRate(data: AppData, studentId: string, courseIds: string[]) {
  const records = attendanceFor(data, studentId, courseIds);
  return toPercent(records.filter((record) => record.status !== "absent").length, records.length);
}

/** Share of the course timeline already completed. */
export function courseProgress(data: AppData, courseId: string) {
  const events = timelineFor(data, courseId);
  return toPercent(events.filter((event) => event.done).length, events.length) ?? 0;
}

export function studentCourseSummary(data: AppData, studentId: string, courseId: string) {
  const assessments = assessmentsFor(data, [courseId]);
  const handedIn = assessments.filter((assessment) =>
    isHandedIn(submissionStatus(assessment, findSubmission(data, assessment.id, studentId))),
  ).length;
  return {
    progress: courseProgress(data, courseId),
    average: averageGrade(data, studentId, [courseId]),
    attendance: attendanceRate(data, studentId, [courseId]),
    handedIn,
    total: assessments.length,
  };
}

/** Assessments the student still has to hand in, soonest first. */
export const upcomingFor = (data: AppData, studentId: string) =>
  assessmentsFor(
    data,
    coursesForStudent(data, studentId).map((course) => course.id),
  ).filter((assessment) => submissionStatus(assessment, findSubmission(data, assessment.id, studentId)) === "upcoming");

/** Graded work for the student, newest grade first. */
export const recentGradesFor = (data: AppData, studentId: string) =>
  data.submissions
    .filter((submission) => submission.studentId === studentId && submission.gradedAt)
    .sort((a, b) => compareIso(b.gradedAt ?? "", a.gradedAt ?? ""));

/** Handed-in work in the instructor's courses that still needs a grade. */
export function pendingGradingFor(data: AppData, instructorId: string) {
  const courseIds = coursesForInstructor(data, instructorId).map((course) => course.id);
  return data.submissions
    .filter((submission) => submission.submittedAt && submission.score === undefined)
    .map((submission) => ({ submission, assessment: findAssessment(data, submission.assessmentId) }))
    .filter(
      (entry): entry is { submission: Submission; assessment: Assessment } =>
        !!entry.assessment && courseIds.includes(entry.assessment.courseId),
    );
}
