"use client";

import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { sendContactMessage, type ContactFormState } from "./actions";

const initialState: ContactFormState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border bg-background/60 px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:ring-4 focus:ring-ring/15 aria-invalid:border-destructive";

export function ContactForm() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  if (state.status === "success") {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 py-10 text-center"
      >
        <motion.span
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.1 }}
        >
          <CheckCircle2 className="size-14 text-success" />
        </motion.span>
        <p className="text-lg font-medium">{state.message}</p>
      </motion.div>
    );
  }

  const field = (name: "name" | "email" | "message") => ({
    id: name,
    name,
    defaultValue: state.values?.[name],
    "aria-invalid": state.fieldErrors?.[name] ? true : undefined,
    "aria-describedby": state.fieldErrors?.[name] ? `${name}-error` : undefined,
  });

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} name="name" error={state.fieldErrors?.name}>
          <input {...field("name")} required autoComplete="name" className={inputClass} />
        </Field>
        <Field label={t("email")} name="email" error={state.fieldErrors?.email}>
          <input {...field("email")} type="email" required autoComplete="email" className={inputClass} />
        </Field>
      </div>
      <Field label={t("message")} name="message" error={state.fieldErrors?.message}>
        <textarea
          {...field("message")}
          rows={6}
          required
          maxLength={5000}
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      {/* Honeypot: hidden from humans and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <motion.p
          role="alert"
          initial={{ x: 0 }}
          animate={{ x: [0, -8, 8, -4, 4, 0] }}
          transition={{ duration: 0.4 }}
          className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.message}
        </motion.p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {t.rich("privacyNote", {
            link: (chunks) => (
              <Link href="/privacy" className="underline underline-offset-2">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <Button type="submit" size="lg" disabled={pending} className="group">
          {pending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Send className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:-rotate-12" />
          )}
          {pending ? t("sending") : t("send")}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
