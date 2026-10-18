import { generatePath } from "react-router";

export const ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",
  setPassword: "/welcome/password",
  verifyPhone: "/welcome/phone",
  dashboard: "/",
  courses: "/courses",
  course: "/courses/:courseId",
  studentStatus: "/courses/:courseId/students/:studentId",
  grades: "/grades",
  attendance: "/attendance",
  payments: "/payments",
  messages: "/messages",
  notifications: "/notifications",
  settings: "/settings",
  users: "/users",
  manageCourses: "/manage-courses",
  families: "/families",
} as const;

/** Query parameter names shared by links and the pages that read them. */
export const QUERY = {
  tab: "tab",
  thread: "thread",
} as const;

/** Link to a course, optionally opening one of its tabs. */
export function coursePath(courseId: string, tab?: string) {
  const path = generatePath(ROUTES.course, { courseId });
  return tab ? `${path}?${new URLSearchParams({ [QUERY.tab]: tab })}` : path;
}
