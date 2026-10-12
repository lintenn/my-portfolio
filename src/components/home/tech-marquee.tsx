import type { CSSProperties } from "react";
import { marqueeTech } from "@/components/tech-icon";
import { cn } from "@/lib/utils";

/** Two infinite rows of technologies scrolling in opposite directions; icons light up in their brand color on hover. */
export function TechMarquee({ label }: { label: string }) {
  const half = Math.ceil(marqueeTech.length / 2);
  const rows = [marqueeTech.slice(0, half), marqueeTech.slice(half)];

  return (
    <section aria-label={label} className="space-y-5">
      {rows.map((row, r) => (
        <div key={r} className="overflow-hidden mask-fade-x">
          <ul
            className={cn(
              "flex w-max gap-4 hover:[animation-play-state:paused]",
              r === 0 ? "animate-marquee" : "animate-marquee-reverse",
            )}
          >
            {[...row, ...row].map(({ name, icon: Icon, color }, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= row.length}
                style={{ "--brand": color ?? "var(--foreground)" } as CSSProperties}
                className="group flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-muted-foreground backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)]/40 hover:text-foreground"
              >
                <Icon className="size-5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-[-8deg] group-hover:text-[var(--brand)]" />
                <span className="text-sm font-medium whitespace-nowrap">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
