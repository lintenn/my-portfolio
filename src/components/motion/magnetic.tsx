"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

/**
 * Pulls its child a few pixels towards the cursor, then springs back.
 * Only reacts to mouse/trackpad pointers, so touch devices are unaffected.
 */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="inline-flex"
      style={{ x: springX, y: springY }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
