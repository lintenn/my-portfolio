import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Locale routing (Next.js 16 "proxy", formerly middleware):
 * - `/about` is served in English, `/es/about` in Spanish, `/de/about` in German.
 * - On a first visit, the browser's Accept-Language decides; the choice is then kept in a cookie.
 */
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next.js/Vercel internals and files with an extension (llms.txt, sitemap.xml…).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
