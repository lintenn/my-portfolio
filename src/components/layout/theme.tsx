"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ComponentProps, MouseEvent } from "react";
import { Button } from "@/components/ui/button";

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    />
  );
}

/**
 * Light/dark toggle. Where supported, the new theme spreads as a circle from the
 * button (View Transitions API); elsewhere it just switches.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("Nav");

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) return setTheme(next);

    const { clientX: x, clientY: y } = e;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => {
      // Apply the class synchronously so the browser snapshots the new theme.
      document.documentElement.classList.toggle("dark", next === "dark");
      setTheme(next);
    });
    void transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 650,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("toggleTheme")}
      title={t("toggleTheme")}
      onClick={toggle}
      className={className}
    >
      <Sun className="scale-100 rotate-0 transition-transform duration-500 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute scale-0 rotate-90 transition-transform duration-500 dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
