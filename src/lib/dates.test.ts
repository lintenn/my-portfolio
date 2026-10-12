import { describe, expect, it } from "vitest";
import { formatDuration, formatPeriod, formatYearMonth, monthsBetween, yearsOfExperience } from "./dates";

describe("dates", () => {
  it("formats year-month and periods", () => {
    expect(formatYearMonth("2022-09")).toBe("Sep 2022");
    expect(formatPeriod("2023-12", "2024-12")).toBe("Dec 2023 – Dec 2024");
    expect(formatPeriod("2025-04")).toBe("Apr 2025 – Present");
  });

  it("counts months inclusively, like LinkedIn", () => {
    // LinkedIn shows Dec 2023 – Dec 2024 as "1 yr 1 mo".
    expect(monthsBetween("2023-12", "2024-12")).toBe(13);
    expect(formatDuration(13)).toBe("1 yr 1 mo");
    // Sep 2022 – Dec 2023 → "1 yr 4 mos".
    expect(formatDuration(monthsBetween("2022-09", "2023-12"))).toBe("1 yr 4 mos");
    expect(monthsBetween("2025-04", new Date(2026, 9, 12))).toBe(19);
  });

  it("computes full years of experience", () => {
    expect(yearsOfExperience("2022-09", new Date(2026, 9, 12))).toBe(4);
    expect(yearsOfExperience("2022-09", new Date(2026, 7, 1))).toBe(3);
  });
});
