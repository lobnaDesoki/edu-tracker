// Every change to the app data goes through one of these actions.
import { APP_CONFIG } from "../constants/config";
import { buildInstallments } from "../services/payments";
import type {
  AppData,
  Assessment,
  AttendanceStatus,
  ContentItem,
  Course,
  Message,
  PaymentMethod,
  Thread,
  TimelineEvent,
  User,
} from "../types";
import { createId } from "../utils/id";
import { isSameDay, nowIso } from "../utils/date";

export type DataAction =
  | { type: "submission/save"; assessmentId: string; studentId: string; text: string }
  | { type: "submission/grade"; assessmentId: string; studentId: string; score: number; feedback?: string }
  | { type: "assessment/add"; assessment: Assessment }
  | { type: "content/add"; item: ContentItem }
  | { type: "timeline/save"; event: TimelineEvent }
  | { type: "attendance/save"; courseId: string; date: string; statuses: Record<string, AttendanceStatus> }
  | { type: "installment/pay"; installmentId: string; method: PaymentMethod; reference: string }
  | { type: "thread/create"; thread: Thread }
  | { type: "message/send"; message: Message }
  | { type: "user/create"; user: User }
  | { type: "user/delete"; userId: string }
  | { type: "user/setPassword"; userId: string; password: string }
  | { type: "user/verifyPhone"; userId: string; phone: string }
  | { type: "course/create"; course: Course }
  | { type: "course/assignInstructor"; courseId: string; instructorId: string }
  | { type: "course/setStudents"; courseId: string; studentIds: string[] }
  | { type: "family/link"; parentId: string; studentId: string }
  | { type: "family/unlink"; parentId: string; studentId: string };

const updateById = <T extends { id: string }>(items: T[], id: string, change: (item: T) => T) =>
  items.map((item) => (item.id === id ? change(item) : item));

const upsert = <T extends { id: string }>(items: T[], next: T) =>
  items.some((item) => item.id === next.id) ? updateById(items, next.id, () => next) : [...items, next];

const submissionId = (assessmentId: string, studentId: string) => `s-${assessmentId}-${studentId}`;

export function dataReducer(state: AppData, action: DataAction): AppData {
  switch (action.type) {
    case "submission/save": {
      const id = submissionId(action.assessmentId, action.studentId);
      const existing = state.submissions.find((s) => s.id === id);
      const next = { ...existing, id, assessmentId: action.assessmentId, studentId: action.studentId, text: action.text, submittedAt: nowIso() };
      return { ...state, submissions: upsert(state.submissions, next) };
    }
    case "submission/grade": {
      const id = submissionId(action.assessmentId, action.studentId);
      const existing = state.submissions.find((s) => s.id === id);
      const next = { ...existing, id, assessmentId: action.assessmentId, studentId: action.studentId, score: action.score, feedback: action.feedback, gradedAt: nowIso() };
      return { ...state, submissions: upsert(state.submissions, next) };
    }
    case "assessment/add":
      return { ...state, assessments: [...state.assessments, action.assessment] };
    case "content/add":
      return { ...state, content: [...state.content, action.item] };
    case "timeline/save":
      return { ...state, timeline: upsert(state.timeline, action.event) };
    case "attendance/save": {
      const kept = state.attendance.filter((r) => r.courseId !== action.courseId || !isSameDay(r.date, action.date));
      const added = Object.entries(action.statuses).map(([studentId, status]) => ({
        id: createId("at"),
        courseId: action.courseId,
        studentId,
        date: action.date,
        status,
      }));
      return { ...state, attendance: [...kept, ...added] };
    }
    case "installment/pay": {
      // Cash is only confirmed when the front desk receives it.
      const paidAt = action.method === "cash" ? undefined : nowIso();
      return {
        ...state,
        installments: updateById(state.installments, action.installmentId, (installment) => ({
          ...installment,
          method: action.method,
          reference: action.reference,
          paidAt,
        })),
      };
    }
    case "thread/create":
      return { ...state, threads: [...state.threads, action.thread] };
    case "message/send":
      return { ...state, messages: [...state.messages, action.message] };
    case "user/create":
      return { ...state, users: [...state.users, action.user] };
    case "user/delete":
      return {
        ...state,
        users: state.users
          .filter((user) => user.id !== action.userId)
          .map((user) => (user.childIds ? { ...user, childIds: user.childIds.filter((id) => id !== action.userId) } : user)),
        courses: state.courses.map((course) => ({
          ...course,
          instructorId: course.instructorId === action.userId ? "" : course.instructorId,
          studentIds: course.studentIds.filter((id) => id !== action.userId),
        })),
      };
    case "user/setPassword":
      return {
        ...state,
        users: updateById(state.users, action.userId, (user) => ({ ...user, password: action.password, mustChangePassword: false })),
      };
    case "user/verifyPhone":
      return {
        ...state,
        users: updateById(state.users, action.userId, (user) => ({ ...user, phone: action.phone, phoneVerified: true })),
      };
    case "course/create":
      return { ...state, courses: [...state.courses, action.course] };
    case "course/assignInstructor":
      return {
        ...state,
        courses: updateById(state.courses, action.courseId, (course) => ({ ...course, instructorId: action.instructorId })),
      };
    case "course/setStudents": {
      const course = state.courses.find((c) => c.id === action.courseId);
      if (!course) return state;
      const newStudents = action.studentIds.filter(
        (id) => !state.installments.some((i) => i.courseId === course.id && i.studentId === id),
      );
      return {
        ...state,
        courses: updateById(state.courses, course.id, (c) => ({ ...c, studentIds: action.studentIds })),
        installments: [
          ...state.installments,
          ...newStudents.flatMap((id) => buildInstallments(course, id, APP_CONFIG.firstInstallmentOffsetDays)),
        ],
      };
    }
    case "family/link":
    case "family/unlink":
      return {
        ...state,
        users: updateById(state.users, action.parentId, (parent) => {
          const others = (parent.childIds ?? []).filter((id) => id !== action.studentId);
          return { ...parent, childIds: action.type === "family/link" ? [...others, action.studentId] : others };
        }),
      };
  }
}
