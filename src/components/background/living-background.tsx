"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";

/** Blob placement per page: x/y in viewport %, size in vmax, depth = parallax strength. */
type Blob = { x: number; y: number; size: number; depth: number };

const LAYOUTS: Record<string, [Blob, Blob, Blob]> = {
  "/": [
    { x: -12, y: 4, size: 44, depth: 1 },
    { x: 62, y: -14, size: 38, depth: 0.6 },
    { x: 68, y: 60, size: 30, depth: 1.4 },
  ],
  "/about": [
    { x: 58, y: 2, size: 46, depth: 1 },
    { x: -14, y: 52, size: 36, depth: 0.7 },
    { x: 34, y: 82, size: 26, depth: 1.3 },
  ],
  "/projects": [
    { x: -16, y: -12, size: 42, depth: 0.8 },
    { x: 70, y: 30, size: 40, depth: 1.2 },
    { x: 18, y: 74, size: 28, depth: 1 },
  ],
  "/contact": [
    { x: 52, y: 46, size: 50, depth: 1 },
    { x: -8, y: -8, size: 34, depth: 0.6 },
    { x: 82, y: -12, size: 26, depth: 1.4 },
  ],
};
const DEFAULT_LAYOUT: [Blob, Blob, Blob] = [
  { x: 70, y: -10, size: 32, depth: 1 },
  { x: -12, y: 60, size: 30, depth: 0.7 },
  { x: 60, y: 80, size: 18, depth: 1.2 },
];

const GRADIENTS = [
  "linear-gradient(140deg, var(--blob-1), var(--blob-2) 55%, var(--blob-3))",
  "linear-gradient(200deg, var(--blob-3), var(--blob-2) 50%, var(--blob-1))",
  "linear-gradient(60deg, var(--blob-2), var(--blob-1))",
];

type Ripple = { id: number; x: number; y: number };

/**
 * The site's backdrop: a dotted canvas with three organic, slowly morphing blobs
 * (a living version of the 2024 background image). Blobs rearrange on every page,
 * drift with the cursor and scroll (parallax), the dots light up around the cursor,
 * and clicking an empty spot sends out a ripple.
 */
export function LivingBackground() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const layout = LAYOUTS[pathname] ?? DEFAULT_LAYOUT;
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Pointer position normalized to [-0.5, 0.5], smoothed with springs.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 20 });
  const sy = useSpring(py, { stiffness: 40, damping: 20 });
  const { scrollY } = useScroll();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
      spotlightRef.current?.style.setProperty("--mx", `${e.clientX}px`);
      spotlightRef.current?.style.setProperty("--my", `${e.clientY}px`);
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select, label, [role=dialog], [data-no-ripple]"))
        return;
      const ripple = { id: e.timeStamp, x: e.clientX, y: e.clientY };
      setRipples((r) => [...r.slice(-4), ripple]);
      window.setTimeout(() => setRipples((r) => r.filter((x) => x.id !== ripple.id)), 900);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [px, py, reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-dots" />
      {/* A brighter copy of the dots, only visible in a circle around the cursor. */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 bg-dots opacity-0 transition-opacity duration-500 pointer-fine:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklch, var(--brand-2) 55%, transparent) 1.2px, transparent 1.2px)",
          maskImage:
            "radial-gradient(14rem circle at var(--mx, -100%) var(--my, -100%), black, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(14rem circle at var(--mx, -100%) var(--my, -100%), black, transparent 70%)",
        }}
      />
      {layout.map((blob, i) => (
        <BlobShape key={i} blob={blob} gradient={GRADIENTS[i]!} sx={sx} sy={sy} scrollY={scrollY} index={i} />
      ))}
      <div className="absolute inset-0 bg-grain mix-blend-overlay" />
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute size-56 animate-ripple rounded-full border-2 border-primary/40"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </div>
  );
}

function BlobShape({
  blob,
  gradient,
  sx,
  sy,
  scrollY,
  index,
}: {
  blob: Blob;
  gradient: string;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  scrollY: MotionValue<number>;
  index: number;
}) {
  const x = useTransform(sx, (v) => v * 60 * blob.depth);
  const scrollShift = useTransform(scrollY, (v) => -v * 0.08 * blob.depth);
  const pointerY = useTransform(sy, (v) => v * 60 * blob.depth);
  const y = useTransform(() => scrollShift.get() + pointerY.get());

  return (
    <motion.div
      className="absolute transition-[left,top,width,height] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        left: `${blob.x}vw`,
        top: `${blob.y}vh`,
        width: `${blob.size}vmax`,
        height: `${blob.size}vmax`,
        x,
        y,
      }}
    >
      <div
        className="size-full blob dark:blur-2xl"
        style={{
          background: gradient,
          animationDelay: `${index * -6}s`,
          animationDuration: `${18 + index * 4}s`,
        }}
      />
    </motion.div>
  );
}
