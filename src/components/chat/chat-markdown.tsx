import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders model output. react-markdown never uses dangerouslySetInnerHTML and
 * ignores raw HTML by default, so a prompt-injected `<script>` stays inert text.
 */
export function ChatMarkdown({
  children,
  onInternalLink,
}: {
  children: string;
  onInternalLink?: () => void;
}) {
  const components: Components = {
    a: ({ href = "", children }) => {
      if (href.startsWith("/")) {
        return (
          <Link href={href} onClick={onInternalLink}>
            {children}
          </Link>
        );
      }
      const safe = /^(https?:|mailto:)/.test(href) ? href : undefined;
      return (
        <a href={safe} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  };

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:my-2 prose-li:my-0.5">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
