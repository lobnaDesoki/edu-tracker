/** Parses a typed score; null when empty, not a number, or outside 0…max. */
export function parseScore(value: string, maxScore: number): number | null {
  if (value.trim() === "") return null;
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 && score <= maxScore ? score : null;
}
