import { tool, type InferUITools, type UIDataTypes, type UIMessage } from "ai";
import { z } from "zod";
import { getContent } from "@/content";
import { projects as rawProjects } from "@/content/projects";
import type { Locale } from "@/i18n/routing";
import { formatYearRange } from "@/lib/dates";

const projectSlugs = rawProjects.map((p) => p.slug) as [string, ...string[]];
const PRESENT: Record<Locale, string> = { en: "Present", es: "Actualidad", de: "Heute" };

/**
 * Tools the model can call. Their *output* is streamed to the browser as a
 * typed message part (`tool-showProjects`, `tool-showContactCard`) and
 * rendered as a React component: this is "generative UI".
 *
 * They run on the server, read only from static content and have no side
 * effects, so they are safe to expose to an untrusted conversation. Outputs are
 * in the visitor's UI language (`locale`), even though the model reasons in English.
 */
export function createChatTools(locale: Locale) {
  const content = getContent(locale);
  const english = getContent("en");

  return {
    showProjects: tool({
      description:
        "Display one or more of Luis's projects as rich cards in the chat. Use it when the visitor wants to see or explore projects. Filter by slugs or by technology; with no filter, shows the featured projects.",
      inputSchema: z.object({
        slugs: z.array(z.enum(projectSlugs)).optional().describe("Specific projects to show"),
        technology: z
          .string()
          .max(40)
          .optional()
          .describe("Show projects whose stack includes this technology, e.g. 'React' or 'TensorFlow'"),
      }),
      execute: async ({ slugs, technology }) => {
        let selected = content.projects;
        if (slugs?.length) {
          selected = selected.filter((p) => slugs.includes(p.slug));
        } else if (technology) {
          // Match against the English stack names (what the model sees in its knowledge base).
          const needle = technology.toLowerCase();
          const matching = new Set(
            english.projects
              .filter((p) => p.stack.some((s) => s.toLowerCase().includes(needle)))
              .map((p) => p.slug),
          );
          selected = selected.filter((p) => matching.has(p.slug));
        } else {
          selected = selected.filter((p) => p.featured);
        }
        return selected.slice(0, 4).map((p) => ({
          slug: p.slug,
          title: p.title,
          period: formatYearRange(p.start, p.end, PRESENT[locale]),
          description: p.description,
          stack: p.stack.slice(0, 5),
          image: p.images[0] ?? null,
          github: p.github ?? null,
        }));
      },
    }),

    showContactCard: tool({
      description:
        "Display a card with Luis's contact options (email, LinkedIn, GitHub, contact form). Use it when the visitor wants to get in touch.",
      inputSchema: z.object({
        reason: z
          .string()
          .max(120)
          .optional()
          .describe("Short reason for contacting, if the visitor gave one"),
      }),
      execute: async () => ({
        name: content.profile.name,
        email: content.profile.email,
        linkedin: content.profile.socials.linkedin,
        github: content.profile.socials.github,
        contactPage: "/contact",
      }),
    }),
  };
}

export type ChatTools = InferUITools<ReturnType<typeof createChatTools>>;
export type ChatUIMessage = UIMessage<never, UIDataTypes, ChatTools>;
