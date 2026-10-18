import type { AppData, User } from "../types";
import { compareIso } from "../utils/date";
import { coursesForInstructor, coursesForStudent, parentsOf } from "./academics";

/** Someone the user may message, and the student/course the conversation is about. */
export interface Contact {
  userId: string;
  courseId: string;
  studentId: string;
}

/**
 * Students and parents message the instructors of the student's courses.
 * Instructors message the students in their courses and those students' parents.
 */
export function contactsFor(data: AppData, user: User, activeStudentId?: string): Contact[] {
  if (user.role === "instructor") {
    return coursesForInstructor(data, user.id).flatMap((course) =>
      course.studentIds.flatMap((studentId) => [
        { userId: studentId, courseId: course.id, studentId },
        ...parentsOf(data, studentId).map((parent) => ({ userId: parent.id, courseId: course.id, studentId })),
      ]),
    );
  }
  if (!activeStudentId) return [];
  return coursesForStudent(data, activeStudentId)
    .filter((course) => course.instructorId)
    .map((course) => ({ userId: course.instructorId, courseId: course.id, studentId: activeStudentId }));
}

export const messagesIn = (data: AppData, threadId: string) =>
  data.messages.filter((message) => message.threadId === threadId).sort((a, b) => compareIso(a.sentAt, b.sentAt));

const lastActivity = (data: AppData, threadId: string) => messagesIn(data, threadId).at(-1)?.sentAt ?? "";

export const threadsFor = (data: AppData, userId: string) =>
  data.threads
    .filter((thread) => thread.participantIds.includes(userId))
    .sort((a, b) => compareIso(lastActivity(data, b.id), lastActivity(data, a.id)));

export const findThread = (data: AppData, userId: string, contact: Contact) =>
  data.threads.find(
    (thread) =>
      thread.courseId === contact.courseId &&
      thread.studentId === contact.studentId &&
      thread.participantIds.includes(userId) &&
      thread.participantIds.includes(contact.userId),
  );
