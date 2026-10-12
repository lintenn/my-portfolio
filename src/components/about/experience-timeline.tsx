import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { experience } from "@/content";
import { formatDuration, formatPeriod, monthsBetween } from "@/lib/dates";
import { cn } from "@/lib/utils";

/** Vertical timeline of all positions. `compact` hides highlights and stack (home page). */
export function ExperienceTimeline({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="relative space-y-8 border-l border-border/80 pl-6 sm:pl-8">
      {experience.map((job) => {
        const current = !job.end;
        return (
          <li key={`${job.company}-${job.start}`} className="relative">
            <span
              aria-hidden
              className={cn(
                "absolute top-1.5 -left-[31px] size-3.5 rounded-full border-2 border-background sm:-left-[39px]",
                current ? "bg-brand-gradient ring-4 ring-primary/20" : "bg-muted-foreground/40",
              )}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-semibold">
                {job.role} <span className="text-muted-foreground">·</span>{" "}
                {job.companyUrl ? (
                  <a
                    href={job.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gradient hover:underline"
                  >
                    {job.company}
                  </a>
                ) : (
                  <span className="text-gradient">{job.company}</span>
                )}
              </h3>
              <p className="font-mono text-xs text-muted-foreground">
                {formatPeriod(job.start, job.end)} · {formatDuration(monthsBetween(job.start, job.end))}
              </p>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {job.location}
              </span>
              <span>{job.workMode}</span>
              {job.employmentType !== "Full-time" && <span>{job.employmentType}</span>}
              {current && <Badge className="border-success/40 bg-success/10 text-success">Current</Badge>}
            </p>
            <p className="mt-3 text-pretty">{job.summary}</p>
            {!compact && (
              <>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                      <span className="text-pretty">{h}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {job.stack.map((s) => (
                    <li key={s}>
                      <Badge>{s}</Badge>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
