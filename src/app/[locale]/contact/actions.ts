"use server";

import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { routing } from "@/i18n/routing";

type Field = "name" | "email" | "message";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<Field, string>>;
  /** Echo the values back so the form keeps them after a failed submission. */
  values?: Partial<Record<Field, string>>;
};

/**
 * Server Action for the contact form (progressively enhanced: it also works
 * without JavaScript). Messages are forwarded to Formspree, which emails them.
 */
export async function sendContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const rawLocale = String(formData.get("locale") ?? "");
  const locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Contact" });

  const schema = z.object({
    name: z.string().trim().min(2, t("errors.name")).max(100),
    email: z.email(t("errors.email")).max(200),
    message: z.string().trim().min(10, t("errors.messageShort")).max(5000, t("errors.messageLong")),
  });

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real visitors never see or fill this field; naive bots do.
  if (formData.get("company")) return { status: "success", message: t("success") };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as Field;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: t("errors.review"), fieldErrors, values: raw };
  }

  const formId = process.env.FORMSPREE_ENDPOINT;
  if (!formId) {
    console.error("[contact] FORMSPREE_ENDPOINT is not set");
    return { status: "error", message: t("errors.notConfigured"), values: raw };
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        language: locale,
        _subject: `Portfolio contact from ${parsed.data.name}`,
      }),
    });
    if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
    return { status: "success", message: t("success") };
  } catch (error) {
    console.error("[contact] failed to send", error);
    return { status: "error", message: t("errors.failed"), values: raw };
  }
}
