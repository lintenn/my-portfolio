"use client";

import { Sparkles } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useChatWidget } from "@/components/chat/chat-provider";
import { navigation } from "@/content/site";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguageSegmented, LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme";

/**
 * Floating navigation pill. It blends the 2024 header (full-width purple → indigo → blue
 * bar, underline on hover) with the 2026 glass pill:
 * - the old gradient lives on as an animated border, the sliding active pill and the
 *   scroll-progress line at the bottom;
 * - it compacts after scrolling and hides while scrolling down (reappears going up).
 */
export function SiteHeader() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { openChat } = useChatWidget();
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [logoSpins, setLogoSpins] = useState(0);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(!menuOpen && y > 160 && y > previous + 4);
    if (y < previous - 4) setHidden(false);
  });

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const close = () => setMenuOpen(false);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6"
      animate={{ y: hidden && !reduced ? "-120%" : "0%" }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Gradient border wrapper (1px of animated conic gradient around the pill). */}
        <div
          className={cn(
            "gradient-border rounded-full p-px shadow-lg shadow-brand-2/5 transition-shadow duration-300",
            scrolled && "shadow-xl shadow-brand-2/15",
            menuOpen && "rounded-[1.75rem]",
          )}
        >
          <div
            className={cn(
              "relative rounded-[inherit] bg-background/80 backdrop-blur-xl transition-colors duration-300",
              scrolled && "bg-background/70",
            )}
          >
            {/* Legacy gradient tint, stronger once the page scrolls. */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 bg-legacy-gradient opacity-[0.07] transition-opacity duration-500",
                scrolled && "opacity-[0.16]",
              )}
            />

            <div
              className={cn(
                "relative flex items-center justify-between gap-2 pr-2 pl-2.5 transition-[height] duration-300",
                scrolled ? "h-14" : "h-16",
              )}
            >
              <Link
                href="/"
                onClick={() => {
                  close();
                  setLogoSpins((n) => n + 1);
                }}
                className="group flex items-center gap-2.5 rounded-full pr-2 font-semibold"
                aria-label={t("logoHint")}
              >
                <motion.span
                  animate={{ rotate: logoSpins * 360 }}
                  whileHover={{ scale: 1.08, rotate: logoSpins * 360 + 8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  className="grid size-10 place-items-center rounded-full bg-brand-gradient font-mono text-sm text-white shadow-md shadow-brand-2/30"
                >
                  LG
                </motion.span>
                <span className="hidden leading-tight sm:block">
                  Luis García
                  <span className="block font-mono text-[10px] font-normal tracking-widest text-muted-foreground uppercase">
                    AI · Full-Stack
                  </span>
                </span>
              </Link>

              <nav aria-label={t("main")} className="hidden md:block">
                <ul className="flex items-center gap-1">
                  {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href} className="relative">
                        {active && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-full bg-legacy-gradient shadow-sm"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "underline-grow relative block rounded-full px-4 py-2 text-sm font-medium transition-colors",
                            active
                              ? "text-foreground after:hidden"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {t(item.key)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="flex items-center gap-0.5">
                <motion.button
                  type="button"
                  onClick={() => openChat()}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="group mr-1 hidden h-9 items-center gap-1.5 rounded-full bg-brand-gradient px-3.5 text-sm font-medium text-white shadow-md shadow-brand-2/25 sm:inline-flex"
                >
                  <Sparkles className="size-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[20deg]" />
                  {t("askAi")}
                </motion.button>
                <div className="hidden md:block">
                  <LanguageSwitcher />
                </div>
                <ThemeToggle />
                <button
                  type="button"
                  className="grid size-10 place-items-center rounded-full transition-colors hover:bg-accent md:hidden"
                  aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-nav"
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <MenuIcon open={menuOpen} />
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {menuOpen && (
                <motion.nav
                  id="mobile-nav"
                  aria-label={t("main")}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden md:hidden"
                >
                  <ul className="space-y-1 px-3 pt-1 pb-3">
                    {navigation.map((item, i) => {
                      const active = isActive(item.href);
                      return (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + i * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={close}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-semibold tracking-tight",
                              active ? "bg-legacy-gradient text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {t(item.key)}
                            <span className="font-mono text-xs opacity-60">0{i + 1}</span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                  <div className="space-y-3 border-t px-3 pt-3 pb-4">
                    <LanguageSegmented onSwitch={close} />
                    <button
                      type="button"
                      onClick={() => {
                        close();
                        openChat();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient py-3 font-medium text-white"
                    >
                      <Sparkles className="size-4" />
                      {t("askAi")}
                    </button>
                  </div>
                </motion.nav>
              )}
            </AnimatePresence>

            {/* Scroll progress: the 2024 gradient bar, reborn as a 2px line. */}
            <motion.div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-legacy-gradient"
              style={{ scaleX: progress }}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

/** Hamburger that morphs into an X. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-5" aria-hidden>
      <span
        className={cn(
          "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300",
          open ? "top-1.5 rotate-45" : "top-0",
        )}
      />
      <span
        className={cn(
          "absolute top-1.5 left-0 h-0.5 rounded-full bg-current transition-all duration-300",
          open ? "w-0 opacity-0" : "w-3.5",
        )}
      />
      <span
        className={cn(
          "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300",
          open ? "top-1.5 -rotate-45" : "top-3",
        )}
      />
    </span>
  );
}
