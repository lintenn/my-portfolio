"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Wraps the timeline and draws a gradient line that fills as the reader scrolls through it. */
export function TimelineProgress({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-border" />
      <motion.div
        aria-hidden
        className="absolute top-0 bottom-0 left-0 w-0.5 origin-top -translate-x-[0.5px] rounded-full bg-gradient-to-b from-brand-1 via-brand-2 to-brand-3"
        style={{ scaleY }}
      />
      {children}
    </div>
  );
}
