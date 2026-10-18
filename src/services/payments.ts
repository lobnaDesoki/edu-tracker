import { APP_CONFIG } from "../constants/config";
import type { AppData, Course, Installment } from "../types";
import { compareIso, daysFromToday, isPast } from "../utils/date";

export type InstallmentStatus = "paid" | "awaitingCash" | "overdue" | "due";

/** Splits a course fee into monthly installments for one student. */
export function buildInstallments(course: Course, studentId: string, firstDueInDays: number): Installment[] {
  const amountEgp = Math.round(course.feeEgp / course.installmentCount);
  return Array.from({ length: course.installmentCount }, (_, index) => ({
    id: `inst-${course.id}-${studentId}-${index + 1}`,
    courseId: course.id,
    studentId,
    number: index + 1,
    amountEgp,
    dueDate: daysFromToday(firstDueInDays + index * APP_CONFIG.installmentIntervalDays),
  }));
}

export function installmentStatus(installment: Installment): InstallmentStatus {
  if (installment.paidAt) return "paid";
  if (installment.method === "cash") return "awaitingCash";
  return isPast(installment.dueDate) ? "overdue" : "due";
}

export const installmentsFor = (data: AppData, studentId: string) =>
  data.installments
    .filter((installment) => installment.studentId === studentId)
    .sort((a, b) => compareIso(a.dueDate, b.dueDate));

export const sumAmounts = (installments: Installment[]) =>
  installments.reduce((sum, installment) => sum + installment.amountEgp, 0);

export const unpaid = (installments: Installment[]) => installments.filter((installment) => !installment.paidAt);
