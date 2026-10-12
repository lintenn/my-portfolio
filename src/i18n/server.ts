import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { site } from "@/content";
import { getPathname } from "./navigation";
import { routing, type Locale } from "./routing";

/** Reads and validates the `[locale]` route param. Unknown locales → 404. */
export async function localeFromParams(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}

const OG_LOCALES: Record<Locale, string> = { en: "en_US", es: "es_ES", de: "de_DE" };

/**
 * Canonical URL + hreflang alternates so search engines index each language
 * version and show visitors the right one.
 */
export function localizedMetadata(path: string, locale: Locale): Pick<Metadata, "alternates" | "openGraph"> {
  const url = (l: Locale) =>
    `${site.url}${getPathname({ href: path, locale: l })}`.replace(/\/$/, "") || site.url;
  return {
    alternates: {
      canonical: url(locale),
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, url(l)])),
        "x-default": url(routing.defaultLocale),
      },
    },
    openGraph: {
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      url: url(locale),
    },
  };
}
