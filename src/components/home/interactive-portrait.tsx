"use client";

import { AnimatePresence, motion, useAnimationControls, useMotionValue, useSpring } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { useChatWidget } from "@/components/chat/chat-provider";

const EMOJIS = ["✨", "💜", "🤖", "💃", "🥊", "☀️", "🧠", "⚡", "🍳", "🚀"];
const EASTER_EGG_AT = 5;

type Particle = { id: number; emoji: string; x: number; y: number; rotate: number };
type Bubble = { id: number; text: string; cta?: boolean };

/**
 * The hero photo, as a toy:
 * - hover: it tilts in 3D towards the cursor and the glow behind it brightens;
 * - click/tap: it bounces (squash & stretch), bursts into emojis and tells a fun fact;
 * - after a few clicks, it suggests chatting with the AI instead. 😄
 */
export function InteractivePortrait({
  photo,
  alt,
  facts,
  hint,
  easterEgg,
  easterEggCta,
}: {
  photo: StaticImageData;
  alt: string;
  facts: string[];
  hint: string;
  easterEgg: string;
  easterEggCta: string;
}) {
  const { openChat } = useChatWidget();
  const controls = useAnimationControls();
  const [hovered, setHovered] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const bubbleTimer = useRef<number | undefined>(undefined);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 14 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 14 });

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 18);
    rotateX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 18);
  };
  const onLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const showBubble = (next: Bubble, ms: number) => {
    window.clearTimeout(bubbleTimer.current);
    setBubble(next);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
  };

  const onClick = () => {
    const count = clicks + 1;
    setClicks(count);
    void controls.start({
      scale: [1, 0.86, 1.1, 0.96, 1.02, 1],
      rotate: [0, -6, 4, -2, 1, 0],
      transition: { duration: 0.7, ease: "easeOut" },
    });

    const burst = Array.from({ length: 10 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
      const distance = 130 + Math.random() * 90;
      return {
        id: Date.now() + i,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]!,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotate: (Math.random() - 0.5) * 120,
      };
    });
    setParticles((p) => [...p.slice(-20), ...burst]);
    window.setTimeout(() => setParticles((p) => p.filter((x) => !burst.includes(x))), 1000);

    if (count >= EASTER_EGG_AT && count % EASTER_EGG_AT === 0) {
      showBubble({ id: count, text: easterEgg, cta: true }, 6000);
    } else {
      showBubble({ id: count, text: facts[(count - 1) % facts.length]! }, 2600);
    }
  };

  return (
    <div className="relative mx-auto w-56 sm:w-72 md:w-full md:max-w-sm" style={{ perspective: 900 }}>
      {/* Glow: brighter and larger while hovered */}
      <motion.div
        aria-hidden
        className="absolute -inset-6 rounded-full bg-brand-gradient blur-3xl"
        animate={{ opacity: hovered ? 0.75 : 0.35, scale: hovered ? 1.12 : 1 }}
        transition={{ duration: 0.5 }}
      />

      <motion.button
        type="button"
        aria-label={`${alt}. ${hint}`}
        onPointerEnter={() => setHovered(true)}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={onClick}
        animate={controls}
        whileTap={{ scale: 0.95 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative block w-full cursor-pointer rounded-full outline-offset-8"
        data-no-ripple
      >
        {/* Spinning gradient ring (spins faster on hover) */}
        <span
          aria-hidden
          className="absolute -inset-1.5 animate-spin-slow rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, var(--brand-1), var(--brand-3), var(--legacy-1), var(--brand-2), var(--brand-1))",
            animationDuration: hovered ? "2.5s" : "8s",
          }}
        />
        <Image
          src={photo}
          alt=""
          priority
          placeholder="blur"
          sizes="(min-width: 768px) 384px, 288px"
          className="relative aspect-square rounded-full border-4 border-background object-cover shadow-2xl"
        />
      </motion.button>

      {/* "Click me" hint until the first click */}
      <AnimatePresence>
        {clicks === 0 && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.2 } }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 animate-float rounded-full border bg-background/90 px-3 py-1 text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur"
          >
            {hint}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Emoji burst */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute z-20 text-3xl drop-shadow-md"
              initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y, scale: [0.4, 1.3, 1], opacity: [1, 1, 0], rotate: p.rotate }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Speech bubble with a fun fact (or the easter egg) */}
      <div aria-live="polite" className="absolute -top-4 right-0 left-0 flex justify-center sm:-top-6">
        <AnimatePresence mode="wait">
          {bubble && (
            <motion.div
              key={bubble.id}
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="relative z-10 max-w-64 rounded-2xl border bg-background/95 px-4 py-2.5 text-center text-sm font-medium shadow-xl backdrop-blur"
            >
              {bubble.text}
              {bubble.cta && (
                <button
                  type="button"
                  onClick={() => {
                    setBubble(null);
                    openChat();
                  }}
                  className="mt-2 block w-full rounded-full bg-brand-gradient px-3 py-1.5 text-xs text-white"
                >
                  {easterEggCta}
                </button>
              )}
              <span className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b bg-background" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
