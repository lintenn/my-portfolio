import type { MetadataRoute } from "next";
import { navigation, site } from "@/content";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** One entry per page, with hreflang alternates for every language. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...navigation.map((n) => n.href), "/privacy"];
  const url = (href: string, locale: (typeof routing.locales)[number]) =>
    `${site.url}${getPathname({ href, locale })}`.replace(/\/$/, "") || site.url;

  return pages.map((href) => ({
    url: url(href, routing.defaultLocale),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: href === "/" ? 1 : 0.7,
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, url(href, l)])) },
  }));
}
