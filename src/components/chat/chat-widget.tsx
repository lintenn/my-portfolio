"use client";

import { ArrowUp, RotateCcw, Sparkles, Square, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import LuisPhoto from "@/assets/luis-photo.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { ChatUIMessage } from "@/lib/ai/tools";
import { cn } from "@/lib/utils";
import { ChatMarkdown } from "./chat-markdown";
import { useChatWidget } from "./chat-provider";
import { ContactToolCard, ProjectsToolCard, ToolSkeleton } from "./tool-cards";

const MAX_CHARS = 1000;
const NUDGE_KEY = "chat-nudge-seen";

/** The server returns `{ error }` JSON for 4xx/5xx; surface that text when present. */
function errorMessage(error: Error, fallback: string): string {
  try {
    const parsed = JSON.parse(error.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    // Not JSON: a streamed error message, already user-friendly.
  }
  return error.message || fallback;
}

function closeOnSmallScreens(close: () => void) {
  return () => {
    if (window.matchMedia("(max-width: 639px)").matches) close();
  };
}

/** Luis's photo with a small "AI" sparkle badge. */
function Avatar({ size = 36 }: { size?: number }) {
  return (
    <span className="relative block shrink-0" style={{ width: size, height: size }}>
      <Image
        src={LuisPhoto}
        alt=""
        width={size * 2}
        height={size * 2}
        className="size-full rounded-full object-cover ring-2 ring-background"
      />
      <span className="absolute -right-0.5 -bottom-0.5 grid size-4 place-items-center rounded-full bg-brand-gradient text-white ring-2 ring-background">
        <Sparkles className="size-2.5" />
      </span>
    </span>
  );
}

function markNudgeSeen() {
  try {
    sessionStorage.setItem(NUDGE_KEY, "1");
  } catch {
    // Storage unavailable: nothing to remember.
  }
}

export function ChatWidget({ name, suggestions }: { name: string; suggestions: string[] }) {
  const t = useTranslations("Chat");
  const { chat, isOpen, openChat, closeChat, ask, retry, reset } = useChatWidget();
  const { messages, status, error, stop } = chat;
  const [input, setInput] = useState("");
  const [nudge, setNudge] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";
  const onNavigate = closeOnSmallScreens(closeChat);

  // Global shortcuts: ⌘K / Ctrl+K toggles the assistant, Escape closes it.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) closeChat();
        else openChat();
      } else if (e.key === "Escape" && isOpen) {
        closeChat();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, openChat, closeChat]);

  // A one-time friendly nudge after a few seconds on the site.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(NUDGE_KEY) === "1";
    } catch {
      // Storage unavailable: show it anyway.
    }
    if (seen) return;
    const timer = window.setTimeout(() => setNudge(true), 9000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    markNudgeSeen(); // The nudge has done its job once the chat is opened.
    inputRef.current?.focus();
  }, [isOpen]);

  // Keep the newest message in view while streaming.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const dismissNudge = () => {
    setNudge(false);
    markNudgeSeen();
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy || text.length > MAX_CHARS) return;
    ask(text);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
  };

  const lastIsUser = messages.at(-1)?.role === "user";

  return (
    <>
      {/* Floating launcher + nudge bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="launcher"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6"
            data-no-ripple
          >
            <AnimatePresence>
              {nudge && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="relative max-w-60 rounded-2xl rounded-br-sm border bg-background/95 py-2.5 pr-8 pl-3.5 text-sm shadow-xl backdrop-blur"
                >
                  <button type="button" onClick={openChat} className="text-left">
                    {t("nudge")}
                  </button>
                  <button
                    type="button"
                    onClick={dismissNudge}
                    aria-label={t("dismiss")}
                    className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-accent"
                  >
                    <X className="size-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={openChat}
              aria-label={t("open")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="group flex animate-float items-center gap-2.5 rounded-full bg-brand-gradient p-1.5 font-medium text-white shadow-xl shadow-brand-2/30 sm:pr-4"
            >
              <Avatar size={40} />
              <span className="hidden text-sm sm:inline">{t("launcher")}</span>
              <kbd className="hidden rounded bg-white/20 px-1.5 font-mono text-[10px] sm:inline">⌘K</kbd>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="panel"
            role="dialog"
            aria-modal="false"
            aria-label={t("dialogLabel", { name })}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(680px,calc(100dvh-3rem))] sm:w-[420px] sm:rounded-3xl sm:border sm:shadow-2xl sm:shadow-brand-2/20"
          >
            <header className="relative flex items-center gap-3 border-b px-4 py-3">
              <div aria-hidden className="absolute inset-0 bg-legacy-gradient opacity-10" />
              <Avatar size={40} />
              <div className="relative min-w-0 flex-1">
                <p className="text-sm font-semibold">{t("title", { name })}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className={cn("size-1.5 rounded-full", busy ? "animate-pulse bg-primary" : "bg-success")}
                  />
                  {busy ? t("typing") : t("subtitle")}
                </p>
              </div>
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={reset}
                  aria-label={t("clear")}
                  title={t("clear")}
                  className="relative"
                >
                  <Trash2 />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeChat}
                aria-label={t("close")}
                title={t("close")}
                className="relative"
              >
                <X />
              </Button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.length === 0 && (
                <div className="flex h-full flex-col justify-end gap-4 pb-2">
                  <div className="space-y-2">
                    <p className="text-2xl font-semibold tracking-tight text-balance">
                      {t("greeting", { name })}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("intro")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((q, i) => (
                      <motion.button
                        key={q}
                        type="button"
                        onClick={() => ask(q)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full border bg-card px-3 py-1.5 text-left text-xs transition-colors hover:border-primary/50 hover:bg-accent"
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <Message key={m.id} message={m} onNavigate={onNavigate} />
              ))}

              {status === "submitted" && lastIsUser && (
                <div className="flex items-center gap-2.5" aria-label={t("thinking")}>
                  <Avatar size={28} />
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-3 py-2.5">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="size-1.5 animate-bounce rounded-full bg-primary/70"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="space-y-2 rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
                  <p>{errorMessage(error, t("genericError"))}</p>
                  <Button variant="secondary" size="sm" onClick={retry}>
                    <RotateCcw />
                    {t("retry")}
                  </Button>
                </div>
              )}
            </div>

            <form onSubmit={submit} className="border-t p-3">
              <div className="flex items-end gap-2 rounded-2xl border bg-card px-3 py-2 transition-shadow focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-ring/15">
                <label htmlFor="chat-input" className="sr-only">
                  {t("inputLabel")}
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={t("placeholder")}
                  className="[field-sizing:content] max-h-32 min-h-6 flex-1 resize-none bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none"
                />
                {busy ? (
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => stop()}
                    aria-label={t("stop")}
                    title={t("stop")}
                  >
                    <Square className="fill-current" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    aria-label={t("send")}
                    title={t("send")}
                  >
                    <ArrowUp />
                  </Button>
                )}
              </div>
              <p className="mt-2 px-1 text-[11px] text-muted-foreground">
                {t.rich("disclaimer", {
                  link: (chunks) => (
                    <Link href="/privacy" onClick={onNavigate} className="underline underline-offset-2">
                      {chunks}
                    </Link>
                  ),
                })}
                {input.length > MAX_CHARS * 0.8 && ` ${input.length}/${MAX_CHARS}`}
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

function Message({ message, onNavigate }: { message: ChatUIMessage; onNavigate: () => void }) {
  const t = useTranslations("Chat");

  if (message.role === "user") {
    const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex justify-end"
      >
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-gradient px-3.5 py-2 text-sm whitespace-pre-wrap text-white">
          {text}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5">
        <Avatar size={28} />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        {message.parts.map((part, i) => {
          const key = `${message.id}-${i}`;
          switch (part.type) {
            case "text":
              return (
                <ChatMarkdown key={key} onInternalLink={onNavigate}>
                  {part.text}
                </ChatMarkdown>
              );
            case "tool-showProjects":
              if (part.state === "output-available")
                return <ProjectsToolCard key={key} projects={part.output} onNavigate={onNavigate} />;
              if (part.state === "output-error") return null;
              return <ToolSkeleton key={key} label={t("lookingUpProjects")} />;
            case "tool-showContactCard":
              if (part.state === "output-available")
                return <ContactToolCard key={key} contact={part.output} onNavigate={onNavigate} />;
              if (part.state === "output-error") return null;
              return <ToolSkeleton key={key} label={t("preparingContact")} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
