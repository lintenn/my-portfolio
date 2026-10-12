import { buildKnowledgeBase } from "@/lib/ai/knowledge";

/**
 * `/llms.txt`: a plain-Markdown version of the site for AI agents and crawlers
 * (https://llmstxt.org). It is the exact same document the chatbot is grounded on.
 */
export const revalidate = 86400;

export function GET() {
  return new Response(buildKnowledgeBase(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
