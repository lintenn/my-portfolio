import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0";

const variants = {
  primary:
    "bg-brand-gradient text-white shadow-lg shadow-brand-2/25 hover:shadow-xl hover:shadow-brand-2/35 hover:brightness-110",
  secondary: "border bg-card text-foreground backdrop-blur hover:bg-accent hover:text-accent-foreground",
  ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
} as const;

const sizes = {
  sm: "h-8 px-3",
  md: "h-10 px-5",
  lg: "h-12 px-6 text-base",
  icon: "size-9",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function buttonVariants({
  variant = "primary",
  size = "md",
}: { variant?: Variant; size?: Size } = {}) {
  return cn(base, variants[variant], sizes[size]);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

/** A Next.js `<Link>` styled as a button. External URLs open in a new tab. */
export function ButtonLink({ variant, size, className, href, ...props }: ButtonLinkProps) {
  const external = typeof href === "string" && /^(https?:|mailto:)/.test(href);
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      {...(external && !String(href).startsWith("mailto:")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      {...props}
    />
  );
}
