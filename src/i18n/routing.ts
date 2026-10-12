import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es", "de"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // English keeps the clean URLs (/about); Spanish and German are prefixed (/es/about, /de/about).
  localePrefix: "as-needed",
});

/** Native names, shown in the language switcher. */
export const localeNames: Record<Locale, string> = { en: "English", es: "Español", de: "Deutsch" };
