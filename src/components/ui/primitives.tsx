import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Small uppercase label above section titles. */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("font-mono text-xs font-medium tracking-widest text-primary uppercase", className)}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl space-y-3", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading
        className={cn(
          "font-semibold tracking-tight text-balance",
          Heading === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
        )}
      >
        {title}
      </Heading>
      {description && <p className="text-lg text-pretty text-muted-foreground">{description}</p>}
    </div>
  );
}
