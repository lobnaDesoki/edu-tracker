const DAY_MS = 24 * 60 * 60 * 1000;
const pad = (value: number) => String(value).padStart(2, "0");

/** ISO timestamp `days` away from today at `hour` local time (negative = past). */
export function daysFromToday(days: number, hour = 9): string {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

/** Moves an ISO timestamp by a (possibly fractional) number of days. */
export const shiftDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();

export const nowIso = () => new Date().toISOString();

export const isPast = (iso: string) => new Date(iso).getTime() < Date.now();

export const daysUntil = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / DAY_MS);

/** ISO timestamp → "YYYY-MM-DD" in local time, for <input type="date">. */
export function toDateInputValue(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "YYYY-MM-DD" from <input type="date"> → ISO timestamp at `hour` local time. */
export function fromDateInputValue(value: string, hour = 9): string {
  return new Date(`${value}T${pad(hour)}:00`).toISOString();
}

export const isSameDay = (a: string, b: string) => toDateInputValue(a) === toDateInputValue(b);

export const compareIso = (a: string, b: string) => a.localeCompare(b);
