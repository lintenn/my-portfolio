/**
 * Content model for the whole site.
 *
 * Everything the visitor can read (pages) and everything the AI chatbot knows
 * (its knowledge base) is derived from the typed data in `src/content/`.
 * Edit the data files, never hard-code facts inside components.
 *
 * Text is either a plain `string` (identical in every language, e.g. "TensorFlow")
 * or an `L` object with one translation per locale — TypeScript enforces all of them.
 */
import type { Locale } from "@/i18n/routing";

export type { Locale };

/** A translated text: one string per supported locale. */
export type L = Record<Locale, string>;
/** Text that may or may not need translation. */
export type Text = string | L;

/** Year-month string, e.g. "2022-09". */
export type YearMonth = `${number}-${string}`;

export interface Link {
  label: Text;
  href: string;
}

export interface Profile {
  name: string;
  shortName: string;
  role: L;
  tagline: L;
  location: L;
  email: string;
  /** Month the professional career started; used to compute years of experience. */
  careerStart: YearMonth;
  summary: L[];
  availability: L;
  socials: { github: string; linkedin: string };
  languages: { name: L; level: L }[];
  hobbies: L;
  /** Short playful facts shown when the visitor clicks the profile photo. */
  funFacts: L[];
}

export type WorkMode = "onSite" | "hybrid" | "remote";
export type EmploymentType = "fullTime" | "internship";

export interface Experience {
  company: string;
  companyUrl?: string;
  role: L;
  location: L;
  workMode: WorkMode;
  employmentType: EmploymentType;
  start: YearMonth;
  /** Omit for the current position. */
  end?: YearMonth;
  summary: L;
  highlights: L[];
  stack: Text[];
}

export interface Education {
  institution: L;
  degree: L;
  start: number;
  end: number;
  details?: L;
  highlights?: L[];
  /** Courses passed with the highest distinction. */
  honors?: L[];
}

export interface Certification {
  name: Text;
  issuer: Text;
  date: YearMonth;
  url?: string;
}

export interface Award {
  title: L;
  issuer: Text;
  date: YearMonth;
  description: L;
}

export interface Project {
  slug: string;
  title: Text;
  /** Year the project started. */
  start: number;
  /** Year it ended; omit while it's ongoing. Projects are sorted by these years, newest first. */
  end?: number;
  description: L;
  challenges: L;
  results: L;
  stack: Text[];
  /** Paths relative to `/public`. Any aspect ratio works (shown uncropped). */
  images: string[];
  github?: string;
  links?: Link[];
  featured?: boolean;
}

export interface SkillGroup {
  name: L;
  skills: Text[];
}

/** Replaces every translatable `L` with a plain string (see `resolve` in ./index.ts). */
export type Resolve<T> = T extends L
  ? string
  : T extends readonly (infer U)[]
    ? Resolve<U>[]
    : T extends object
      ? { [K in keyof T]: Resolve<T[K]> }
      : T;
