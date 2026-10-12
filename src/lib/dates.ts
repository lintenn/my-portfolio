import type { YearMonth } from "@/content/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parse(value: YearMonth) {
  const [year, month] = value.split("-").map(Number);
  return { year: year ?? 0, month: month ?? 1 };
}

/** "2022-09" → "Sep 2022" */
export function formatYearMonth(value: YearMonth): string {
  const { year, month } = parse(value);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "Sep 2022 – Present" */
export function formatPeriod(start: YearMonth, end?: YearMonth): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "Present"}`;
}

/** Whole months between two dates, counting both the start and the end month (LinkedIn-style). */
export function monthsBetween(start: YearMonth, end: YearMonth | Date = new Date()): number {
  const a = parse(start);
  const b = end instanceof Date ? { year: end.getFullYear(), month: end.getMonth() + 1 } : parse(end);
  return Math.max(0, (b.year - a.year) * 12 + (b.month - a.month) + 1);
}

/** 19 → "1 yr 7 mos" */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rest) parts.push(`${rest} mo${rest > 1 ? "s" : ""}`);
  return parts.join(" ") || "< 1 mo";
}

/** Full years of professional experience since `careerStart`. */
export function yearsOfExperience(careerStart: YearMonth, now: Date = new Date()): number {
  return Math.floor((monthsBetween(careerStart, now) - 1) / 12);
}
