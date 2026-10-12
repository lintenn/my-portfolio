/**
 * Content model for the whole site.
 *
 * Everything the visitor can read (pages) and everything the AI chatbot knows
 * (its knowledge base) is derived from the typed data in `src/content/`.
 * Edit the data files, never hard-code facts inside components.
 */

/** Year-month string, e.g. "2022-09". */
export type YearMonth = `${number}-${string}`;

export interface Link {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  /** Month the professional career started; used to compute years of experience. */
  careerStart: YearMonth;
  summary: string[];
  availability: string;
  socials: { github: string; linkedin: string };
  languages: { name: string; level: string }[];
  hobbies: string;
}

export interface Experience {
  company: string;
  companyUrl?: string;
  role: string;
  location: string;
  workMode: "On-site" | "Hybrid" | "Remote";
  employmentType: "Full-time" | "Internship";
  start: YearMonth;
  /** Omit for the current position. */
  end?: YearMonth;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface Education {
  institution: string;
  degree: string;
  start: number;
  end: number;
  details?: string;
  highlights?: string[];
  /** Courses passed with the highest distinction. */
  honors?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: YearMonth;
  url?: string;
}

export interface Award {
  title: string;
  issuer: string;
  date: YearMonth;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  period: string;
  description: string;
  challenges: string;
  results: string;
  stack: string[];
  /** Paths relative to `/public`. */
  images: string[];
  github?: string;
  links?: Link[];
  featured?: boolean;
}

export interface SkillGroup {
  name: string;
  skills: string[];
}
