import type { BadgeTone } from "../components/ui/Badge";
import type { Role } from "../types";

export const ROLES: Role[] = ["admin", "instructor", "student", "parent"];
/** Roles that follow a student's learning (the student and their parents). */
export const LEARNER_ROLES: Role[] = ["student", "parent"];
/** Roles that belong to courses (everyone except the admin). */
export const MEMBER_ROLES: Role[] = [...LEARNER_ROLES, "instructor"];

export const ROLE_TONE: Record<Role, BadgeTone> = {
  admin: "neutral",
  instructor: "primary",
  student: "info",
  parent: "success",
};
