import { getContent, navigation, site, type WorkMode, type EmploymentType } from "@/content";
import {
  formatDuration,
  formatPeriod,
  formatYearMonth,
  formatYearRange,
  monthsBetween,
  yearsOfExperience,
} from "@/lib/dates";

const workModes: Record<WorkMode, string> = { onSite: "On-site", hybrid: "Hybrid", remote: "Remote" };
const employmentTypes: Record<EmploymentType, string> = { fullTime: "Full-time", internship: "Internship" };

/**
 * Serializes the typed site content into a single Markdown document.
 *
 * This is the chatbot's entire knowledge base ("context stuffing"): it is small
 * (a few thousand tokens), so we send all of it with every request instead of
 * retrieving chunks from a vector database. It is also served at `/llms.txt`.
 *
 * It is always built in English (one canonical, cacheable prompt); the model
 * translates on the fly into the visitor's language.
 *
 * Keep the output deterministic (no timestamps, stable ordering): an identical
 * prompt prefix is what lets the provider reuse its prompt cache.
 */
export function buildKnowledgeBase(now: Date = new Date()): string {
  const c = getContent("en");
  const { profile } = c;
  const years = yearsOfExperience(profile.careerStart, now);
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  push(`# ${profile.name}`, "", `> ${profile.role}. ${profile.tagline}`, "");
  push("## Profile", "");
  push(`- Location: ${profile.location}`);
  push(`- Professional experience: ${years}+ years (since ${formatYearMonth(profile.careerStart)})`);
  push(`- Email: ${profile.email}`);
  push(`- LinkedIn: ${profile.socials.linkedin}`);
  push(`- GitHub: ${profile.socials.github}`);
  push(`- Availability: ${profile.availability}`, "");
  push(...profile.summary.flatMap((p) => [p, ""]));

  push("## Experience", "");
  for (const job of c.experience) {
    const months = monthsBetween(job.start, job.end ?? now);
    push(
      `### ${job.role} — ${job.company}`,
      "",
      `${formatPeriod(job.start, job.end, "en", "Present")} (${formatDuration(months)}) · ${job.location} · ${workModes[job.workMode]} · ${employmentTypes[job.employmentType]}`,
      "",
      job.summary,
      "",
      ...(job.companyUrl ? [`Company website: ${job.companyUrl}`, ""] : []),
      ...job.highlights.map((h) => `- ${h}`),
      "",
      `Stack: ${job.stack.join(", ")}`,
      "",
    );
  }

  push("## Projects", "", "Newest first. More details and images at /projects.", "");
  for (const project of c.projects) {
    push(
      `### ${project.title} (${formatYearRange(project.start, project.end, "Present")})`,
      "",
      project.description,
      "",
      `- Challenges: ${project.challenges}`,
      `- Results: ${project.results}`,
      `- Stack: ${project.stack.join(", ")}`,
    );
    if (project.github) push(`- Source code: ${project.github}`);
    for (const link of project.links ?? []) push(`- ${link.label}: ${link.href}`);
    push("");
  }

  push("## Skills", "");
  for (const group of c.skillGroups) push(`- ${group.name}: ${group.skills.join(", ")}`);
  push(`- Soft skills: ${c.softSkills.join(", ")}`, "");

  push("## Education", "");
  for (const edu of c.education) {
    push(`### ${edu.degree} — ${edu.institution} (${edu.start}–${edu.end})`, "");
    if (edu.details) push(edu.details, "");
    for (const h of edu.highlights ?? []) push(`- ${h}`);
    if (edu.honors?.length) push(`- Highest distinction (Matrícula de Honor) in: ${edu.honors.join(", ")}`);
    push("");
  }

  push("## Certifications", "");
  for (const cert of c.certifications) {
    push(
      `- ${cert.name} — ${cert.issuer} (${formatYearMonth(cert.date)})${cert.url ? ` · ${cert.url}` : ""}`,
    );
  }
  push("");

  push("## Awards", "");
  for (const a of c.awards) push(`- ${a.title} — ${a.issuer} (${formatYearMonth(a.date)}): ${a.description}`);
  push("");

  push("## Languages", "");
  for (const l of profile.languages) push(`- ${l.name}: ${l.level}`);
  push("");

  push("## Hobbies", "", profile.hobbies, "");

  push("## Website pages", "");
  for (const page of navigation) push(`- [${page.key}](${page.href}): ${page.description}`);
  push(`- [privacy](/privacy): how chat messages and contact data are handled`);
  push(`- The site is available in English, Spanish and German (language switcher in the header).`);
  push(`- Source code of this website: ${site.repo}`, "");

  push(
    "## About this website",
    "",
    "Built with Next.js, React, TypeScript and Tailwind CSS, translated with next-intl, deployed on Vercel. The AI assistant uses the Vercel AI SDK with an OpenAI model. All the content above is sent to the model as context (no vector database needed at this size), with prompt caching, tool calling to render rich UI cards, rate limiting and automated evals.",
  );

  return lines.join("\n").trim() + "\n";
}
