"use client";

import { Check, Languages } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Switches language while staying on the same page (and keeps the #hash). */
function useSwitchLocale() {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const switchTo = (locale: Locale) =>
    startTransition(() => router.replace(`${pathname}${window.location.hash}`, { locale, scroll: false }));
  return { switchTo, pending };
}

/** Compact dropdown for the desktop header. */
export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Nav");
  const { switchTo, pending } = useSwitchLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node))
        setOpen(false);
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        title={t("language")}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full px-2.5 font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground",
          pending && "animate-pulse",
        )}
      >
        <Languages className="size-4" />
        {locale}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t("language")}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-40 origin-top-right overflow-hidden rounded-2xl border bg-background/95 p-1 shadow-xl backdrop-blur-xl"
          >
            {routing.locales.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l === locale}
                  lang={l}
                  onClick={() => {
                    setOpen(false);
                    if (l !== locale) switchTo(l);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  <span>
                    <span className="mr-2 font-mono text-xs text-muted-foreground uppercase">{l}</span>
                    {localeNames[l]}
                  </span>
                  {l === locale && <Check className="size-4 text-primary" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Segmented control for the mobile menu. */
export function LanguageSegmented({ onSwitch }: { onSwitch?: () => void }) {
  const locale = useLocale();
  const t = useTranslations("Nav");
  const { switchTo } = useSwitchLocale();

  return (
    <div
      role="radiogroup"
      aria-label={t("language")}
      className="relative flex rounded-full border bg-muted/60 p-1"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={l === locale}
          lang={l}
          onClick={() => {
            onSwitch?.();
            if (l !== locale) switchTo(l);
          }}
          className="relative flex-1 rounded-full px-3 py-1.5 text-sm font-medium"
        >
          {l === locale && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-legacy-gradient shadow-sm"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className={cn("relative", l === locale ? "text-foreground" : "text-muted-foreground")}>
            {localeNames[l]}
          </span>
        </button>
      ))}
    </div>
  );
}
