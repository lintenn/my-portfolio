import { locales, type Locale } from "@/i18n/routing";
import { awards, certifications, education, experience } from "./experience";
import { profile } from "./profile";
import { projects, sortProjects } from "./projects";
import { chatSuggestions, navigation, site } from "./site";
import { skillGroups, softSkills } from "./skills";
import type { L, Resolve } from "./types";

export * from "./types";
export { navigation, site, sortProjects };

function isTranslated(value: object): value is L {
  const keys = Object.keys(value);
  return keys.length === locales.length && locales.every((l) => typeof (value as L)[l] === "string");
}

/** Deeply replaces every `{ en, es, de }` text with the string for `locale`. */
export function resolve<T>(value: T, locale: Locale): Resolve<T> {
  if (Array.isArray(value)) return value.map((v) => resolve(v, locale)) as Resolve<T>;
  if (value && typeof value === "object") {
    if (isTranslated(value)) return value[locale] as Resolve<T>;
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v, locale)])) as Resolve<T>;
  }
  return value as Resolve<T>;
}

const raw = {
  profile,
  experience,
  education,
  certifications,
  awards,
  projects: sortProjects(projects),
  skillGroups,
  softSkills,
  chatSuggestions,
  siteDescription: site.description,
};

export type Content = Resolve<typeof raw>;
export type ProfileContent = Content["profile"];
export type ExperienceContent = Content["experience"][number];
export type ProjectContent = Content["projects"][number];

const cache = new Map<Locale, Content>();

/** All site content in one language. Cached: content is static. */
export function getContent(locale: Locale): Content {
  let content = cache.get(locale);
  if (!content) {
    content = resolve(raw, locale);
    cache.set(locale, content);
  }
  return content;
}
