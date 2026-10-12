"use client";

import { motion, type HTMLMotionProps } from "motion/react";

/** Fades and slides its children in the first time they scroll into view. */
export function Reveal({
  delay = 0,
  y = 24,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  );
}
