import de from "@/i18n/messages/de.json";
import en from "@/i18n/messages/en.json";
import es from "@/i18n/messages/es.json";
import type { Locale } from "@/i18n/routing";

/** API-side strings (the chat route runs outside React, so it reads the catalogues directly). */
export const chatApiMessages: Record<Locale, (typeof en)["ChatApi"]> = {
  en: en.ChatApi,
  es: es.ChatApi,
  de: de.ChatApi,
};
