"use client";

import type { ComponentProps, PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * A card with a soft light that follows the cursor and a glowing border on hover.
 * The pointer position is written to CSS variables, so no React re-render happens.
 */
export function SpotlightCard({ className, children, ...props }: ComponentProps<"div">) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onPointerMove={onMove}
      className={cn(
        "group/spot relative rounded-2xl border bg-card text-card-foreground shadow-sm backdrop-blur-sm transition-[border-color,box-shadow,translate] duration-300",
        "pointer-fine:hover:-translate-y-0.5 pointer-fine:hover:border-primary/40 pointer-fine:hover:shadow-xl pointer-fine:hover:shadow-brand-2/10",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] spotlight opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
