"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell me your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Your message is a bit short.")
    .max(5000, "Please keep it under 5000 characters."),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof contactSchema>, string>>;
  /** Echo the values back so the form keeps them after a failed submission. */
  values?: Partial<Record<keyof z.infer<typeof contactSchema>, string>>;
};

/**
 * Server Action for the contact form (progressively enhanced: it also works
 * without JavaScript). Messages are forwarded to Formspree, which emails them.
 */
export async function sendContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real visitors never see or fill this field; naive bots do.
  if (formData.get("company")) {
    return { status: "success", message: "Thanks for your message! I'll get back to you soon." };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof raw;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please review the highlighted fields.", fieldErrors, values: raw };
  }

  const formId = process.env.FORMSPREE_ENDPOINT;
  if (!formId) {
    console.error("[contact] FORMSPREE_ENDPOINT is not set");
    return {
      status: "error",
      message: "The contact form is not configured right now. Please email me instead.",
      values: raw,
    };
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, _subject: `Portfolio contact from ${parsed.data.name}` }),
    });
    if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
    return { status: "success", message: "Thanks for your message! I'll get back to you soon." };
  } catch (error) {
    console.error("[contact] failed to send", error);
    return {
      status: "error",
      message: "Oops, the message could not be sent. Please try again or email me directly.",
      values: raw,
    };
  }
}
