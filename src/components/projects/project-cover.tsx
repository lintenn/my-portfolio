import { cn } from "@/lib/utils";

/** Generated cover for projects without images: title + stack over a brand grid. */
export function ProjectCover({
  title,
  period,
  stack,
  className,
}: {
  title: string;
  period: string;
  stack: string[];
  className?: string;
}) {
  return (
    <div
      className={cn("absolute inset-0 flex flex-col justify-end bg-cover-pattern p-5 text-white", className)}
    >
      <p className="font-mono text-[11px] tracking-widest uppercase opacity-80">{period}</p>
      <p className="text-2xl font-semibold tracking-tight text-balance drop-shadow-sm">{title}</p>
      <p className="mt-1 truncate font-mono text-xs opacity-80">{stack.slice(0, 4).join(" · ")}</p>
    </div>
  );
}
