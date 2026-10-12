"use client";

import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sendContactMessage, type ContactFormState } from "./actions";

const initialState: ContactFormState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border bg-background/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/20 aria-invalid:border-destructive";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="size-12 text-success" />
        <p className="text-lg font-medium">{state.message}</p>
      </div>
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={state.fieldErrors?.name}>
          <input {...field("name")} required autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Email" name="email" error={state.fieldErrors?.email}>
          <input {...field("email")} type="email" required autoComplete="email" className={inputClass} />
        </Field>
      </div>
      <Field label="Message" name="message" error={state.fieldErrors?.message}>
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
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Your data is only used to reply. See the{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? <LoaderCircle className="animate-spin" /> : <Send />}
          {pending ? "Sending…" : "Send message"}
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
