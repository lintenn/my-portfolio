import { tool, type InferUITools, type UIDataTypes, type UIMessage } from "ai";
import { z } from "zod";
import { profile, projects } from "@/content";

const projectSlugs = projects.map((p) => p.slug) as [string, ...string[]];

/**
 * Tools the model can call. Their *output* is streamed to the browser as a
 * typed message part (`tool-showProjects`, `tool-showContactCard`) and
 * rendered as a React component: this is "generative UI".
 *
 * They run on the server, read only from static content and have no side
 * effects, so they are safe to expose to an untrusted conversation.
 */
export const chatTools = {
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
      let selected = projects;
      if (slugs?.length) {
        selected = projects.filter((p) => slugs.includes(p.slug));
      } else if (technology) {
        const needle = technology.toLowerCase();
        selected = projects.filter((p) => p.stack.some((s) => s.toLowerCase().includes(needle)));
      } else {
        selected = projects.filter((p) => p.featured);
      }
      return selected.slice(0, 4).map((p) => ({
        slug: p.slug,
        title: p.title,
        period: p.period,
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
      reason: z.string().max(120).optional().describe("Short reason for contacting, if the visitor gave one"),
    }),
    execute: async () => ({
      name: profile.name,
      email: profile.email,
      linkedin: profile.socials.linkedin,
      github: profile.socials.github,
      contactPage: "/contact",
    }),
  }),
};

export type ChatTools = InferUITools<typeof chatTools>;
export type ChatUIMessage = UIMessage<never, UIDataTypes, ChatTools>;
