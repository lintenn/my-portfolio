import type { MetadataRoute } from "next";
import { navigation, site } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...navigation.map((n) => n.href), "/privacy"];
  return pages.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
