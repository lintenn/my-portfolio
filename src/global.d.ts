import type messages from "./i18n/messages/en.json";
import type { routing } from "./i18n/routing";

// Type-safe translations: t("Home.title") autocompletes and typos fail the build.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

// Intl.DurationFormat ships in Node 24 and modern browsers, but TypeScript 5.9's lib doesn't type it yet.
declare global {
  namespace Intl {
    interface DurationFormatOptions {
      style?: "long" | "short" | "narrow" | "digital";
    }
    class DurationFormat {
      constructor(locales?: string | string[], options?: DurationFormatOptions);
      format(duration: { years?: number; months?: number; weeks?: number; days?: number }): string;
    }
  }
}
