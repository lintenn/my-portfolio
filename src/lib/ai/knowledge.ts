import {
  awards,
  certifications,
  education,
  experience,
  navigation,
  profile,
  projects,
  site,
  skillGroups,
  softSkills,
} from "@/content";
import { formatDuration, formatPeriod, formatYearMonth, monthsBetween, yearsOfExperience } from "@/lib/dates";

/**
 * Serializes the typed site content into a single Markdown document.
 *
 * This is the chatbot's entire knowledge base ("context stuffing"): it is small
 * (a few thousand tokens), so we send all of it with every request instead of
 * retrieving chunks from a vector database. It is also served at `/llms.txt`.
 *
 * Keep the output deterministic (no timestamps, stable ordering): an identical
 * prompt prefix is what lets the provider reuse its prompt cache.
 */
export function buildKnowledgeBase(now: Date = new Date()): string {
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
  for (const job of experience) {
    const months = monthsBetween(job.start, job.end ?? now);
    push(
      `### ${job.role} — ${job.company}`,
      "",
      `${formatPeriod(job.start, job.end)} (${formatDuration(months)}) · ${job.location} · ${job.workMode} · ${job.employmentType}`,
      "",
      job.summary,
      "",
      ...job.highlights.map((h) => `- ${h}`),
      "",
      `Stack: ${job.stack.join(", ")}`,
      "",
    );
  }

  push("## Projects", "", "More details and images at /projects.", "");
  for (const project of projects) {
    push(
      `### ${project.title} (${project.period})`,
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
  for (const group of skillGroups) push(`- ${group.name}: ${group.skills.join(", ")}`);
  push(`- Soft skills: ${softSkills.join(", ")}`, "");

  push("## Education", "");
  for (const edu of education) {
    push(`### ${edu.degree} — ${edu.institution} (${edu.start}–${edu.end})`, "");
    if (edu.details) push(edu.details, "");
    for (const h of edu.highlights ?? []) push(`- ${h}`);
    if (edu.honors?.length) push(`- Highest distinction (Matrícula de Honor) in: ${edu.honors.join(", ")}`);
    push("");
  }

  push("## Certifications", "");
  for (const c of certifications) {
    push(`- ${c.name} — ${c.issuer} (${formatYearMonth(c.date)})${c.url ? ` · ${c.url}` : ""}`);
  }
  push("");

  push("## Awards", "");
  for (const a of awards) push(`- ${a.title} — ${a.issuer} (${formatYearMonth(a.date)}): ${a.description}`);
  push("");

  push("## Languages", "");
  for (const l of profile.languages) push(`- ${l.name}: ${l.level}`);
  push("");

  push("## Hobbies", "", profile.hobbies, "");

  push("## Website pages", "");
  for (const page of navigation) push(`- [${page.label}](${page.href}): ${page.description}`);
  push(`- [Privacy policy](/privacy): how chat messages and contact data are handled`);
  push(`- Source code of this website: ${site.repo}`, "");

  push(
    "## About this website",
    "",
    "Built with Next.js, React, TypeScript and Tailwind CSS, deployed on Vercel. The AI assistant uses the Vercel AI SDK with an OpenAI model. All the content above is sent to the model as context (no vector database needed at this size), with prompt caching, tool calling to render rich UI cards, rate limiting and automated evals.",
  );

  return lines.join("\n").trim() + "\n";
}
