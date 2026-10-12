"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Every animation honors the OS "reduce motion" accessibility setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
