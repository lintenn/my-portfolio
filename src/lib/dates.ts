import type { YearMonth } from "@/content/types";
import type { Locale } from "@/i18n/routing";

function parse(value: YearMonth) {
  const [year, month] = value.split("-").map(Number);
  return { year: year ?? 0, month: month ?? 1 };
}

/** "2022-09" → "Sep 2022" / "sept 2022" / "Sept. 2022" */
export function formatYearMonth(value: YearMonth, locale: Locale = "en"): string {
  const { year, month } = parse(value);
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(
    Date.UTC(year, month - 1, 15),
  );
}

/** "Sep 2022 – Present" (pass the translated word for "Present"). */
export function formatPeriod(start: YearMonth, end: YearMonth | undefined, locale: Locale, present: string) {
  return `${formatYearMonth(start, locale)} – ${end ? formatYearMonth(end, locale) : present}`;
}

/** Whole months between two dates, counting both the start and the end month (LinkedIn-style). */
export function monthsBetween(start: YearMonth, end: YearMonth | Date = new Date()): number {
  const a = parse(start);
  const b = end instanceof Date ? { year: end.getFullYear(), month: end.getMonth() + 1 } : parse(end);
  return Math.max(0, (b.year - a.year) * 12 + (b.month - a.month) + 1);
}

/** 19 → "1 year, 7 months" / "1 año y 7 meses" / "1 Jahr, 7 Monate" */
export function formatDuration(months: number, locale: Locale = "en"): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return new Intl.DurationFormat(locale, { style: "long" }).format({
    ...(years && { years }),
    ...((rest || !years) && { months: rest }),
  });
}

/** Full years of professional experience since `careerStart`. */
export function yearsOfExperience(careerStart: YearMonth, now: Date = new Date()): number {
  return Math.floor((monthsBetween(careerStart, now) - 1) / 12);
}

/** "2024 – Present", "2021 – 2022" or just "2026". */
export function formatYearRange(start: number, end: number | undefined, present: string): string {
  if (end === undefined) return `${start} – ${present}`;
  return start === end ? String(start) : `${start} – ${end}`;
}
