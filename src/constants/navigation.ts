import type { Dictionary } from "../i18n/en";
import type { Role } from "../types";
import { ROUTES } from "./routes";

export type NavKey = keyof Dictionary["nav"];

/** Path of every sidebar entry. Labels come from i18n and icons from ICONS, both by key. */
export const NAV_PATHS: Record<NavKey, string> = {
  dashboard: ROUTES.dashboard,
  courses: ROUTES.courses,
  grades: ROUTES.grades,
  attendance: ROUTES.attendance,
  payments: ROUTES.payments,
  messages: ROUTES.messages,
  notifications: ROUTES.notifications,
  settings: ROUTES.settings,
  users: ROUTES.users,
  manageCourses: ROUTES.manageCourses,
  families: ROUTES.families,
};

const LEARNER_NAV: NavKey[] = [
  "dashboard",
  "courses",
  "grades",
  "attendance",
  "payments",
  "messages",
  "notifications",
  "settings",
];

/** Sidebar entries per role. The website tour walks through the same list. */
export const NAV_BY_ROLE: Record<Role, NavKey[]> = {
  student: LEARNER_NAV,
  parent: LEARNER_NAV,
  instructor: ["dashboard", "courses", "messages", "settings"],
  admin: ["dashboard", "users", "manageCourses", "families", "settings"],
};
