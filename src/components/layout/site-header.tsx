"use client";

import { Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useChatWidget } from "@/components/chat/chat-provider";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { navigation } from "@/content/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme";

export function SiteHeader() {
  const pathname = usePathname();
  const { openChat } = useChatWidget();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-semibold"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid size-8 place-items-center rounded-lg bg-brand-gradient font-mono text-sm text-white shadow-md shadow-brand-2/30 transition-transform group-hover:rotate-6">
            LG
          </span>
          <span className="hidden sm:inline">Luis García</span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 rounded-full border bg-card/60 p-1 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive(item.href) && "bg-accent text-accent-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button size="sm" onClick={() => openChat()} className="hidden sm:inline-flex">
            <Sparkles />
            Ask my AI
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </Container>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t bg-background/95 backdrop-blur-xl md:hidden"
        >
          <Container className="flex flex-col py-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-3 text-base font-medium text-muted-foreground",
                  isActive(item.href) && "bg-accent text-accent-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
