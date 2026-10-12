import { describe, expect, it } from "vitest";
import de from "@/i18n/messages/de.json";
import en from "@/i18n/messages/en.json";
import es from "@/i18n/messages/es.json";
import { locales } from "@/i18n/routing";
import { getContent, sortProjects } from ".";

function keys(obj: unknown, prefix = ""): string[] {
  if (Array.isArray(obj) || typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe("translations", () => {
  it("es and de UI messages have exactly the same keys as en", () => {
    expect(keys(es).sort()).toEqual(keys(en).sort());
    expect(keys(de).sort()).toEqual(keys(en).sort());
  });

  it("resolves content to plain strings in every language", () => {
    for (const locale of locales) {
      const { profile, projects } = getContent(locale);
      expect(typeof profile.role).toBe("string");
      expect(typeof projects[0]?.description).toBe("string");
    }
    expect(getContent("es").profile.location).toBe("Málaga, España");
  });
});

describe("projects", () => {
  it("are ordered newest first (ongoing, then by end year, then by start year)", () => {
    const order = getContent("en").projects.map((p) => p.slug);
    expect(order).toEqual([
      "ai-portfolio",
      "oleoh",
      "gratemate",
      "risto",
      "smart-space-journey",
      "age-detector",
    ]);
  });

  it("sortProjects is stable for ties", () => {
    const sorted = sortProjects([{ start: 2020, end: 2022 }, { start: 2021, end: 2022 }, { start: 2019 }]);
    expect(sorted).toEqual([{ start: 2019 }, { start: 2021, end: 2022 }, { start: 2020, end: 2022 }]);
  });
});
