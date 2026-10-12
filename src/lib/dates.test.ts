import { describe, expect, it } from "vitest";
import {
  formatDuration,
  formatPeriod,
  formatYearMonth,
  formatYearRange,
  monthsBetween,
  yearsOfExperience,
} from "./dates";

describe("dates", () => {
  it("formats year-month and periods in each language", () => {
    expect(formatYearMonth("2022-09")).toBe("Sep 2022");
    expect(formatYearMonth("2022-09", "de")).toBe("Sept. 2022");
    expect(formatPeriod("2023-12", "2024-12", "en", "Present")).toBe("Dec 2023 – Dec 2024");
    expect(formatPeriod("2025-04", undefined, "es", "Actualidad")).toMatch(/2025 – Actualidad$/);
  });

  it("counts months inclusively, like LinkedIn", () => {
    // LinkedIn shows Dec 2023 – Dec 2024 as "1 yr 1 mo".
    expect(monthsBetween("2023-12", "2024-12")).toBe(13);
    expect(formatDuration(13)).toBe("1 year, 1 month");
    expect(formatDuration(19, "es")).toBe("1 año y 7 meses");
    expect(formatDuration(19, "de")).toBe("1 Jahr, 7 Monate");
    expect(formatDuration(12)).toBe("1 year");
    expect(monthsBetween("2025-04", new Date(2026, 9, 12))).toBe(19);
  });

  it("computes full years of experience", () => {
    expect(yearsOfExperience("2022-09", new Date(2026, 9, 12))).toBe(4);
    expect(yearsOfExperience("2022-09", new Date(2026, 7, 1))).toBe(3);
  });

  it("formats project year ranges", () => {
    expect(formatYearRange(2024, undefined, "Present")).toBe("2024 – Present");
    expect(formatYearRange(2021, 2022, "Present")).toBe("2021 – 2022");
    expect(formatYearRange(2026, 2026, "Present")).toBe("2026");
  });
});
