"use client";

import { ArrowUp, RotateCcw, Sparkles, Square, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { chatSuggestions, profile } from "@/content";
import type { ChatUIMessage } from "@/lib/ai/tools";
import { cn } from "@/lib/utils";
import { ChatMarkdown } from "./chat-markdown";
import { useChatWidget } from "./chat-provider";
import { ContactToolCard, ProjectsToolCard, ToolSkeleton } from "./tool-cards";

const MAX_CHARS = 1000;

/** The server returns `{ error }` JSON for 4xx/5xx; surface that text when present. */
function errorMessage(error: Error): string {
  try {
    const parsed = JSON.parse(error.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    // Not JSON: a streamed error message, already user-friendly.
  }
  return error.message || "Something went wrong. Please try again.";
}

function closeOnSmallScreens(close: () => void) {
  return () => {
    if (window.matchMedia("(max-width: 639px)").matches) close();
  };
}

export function ChatWidget() {
  const { chat, isOpen, openChat, closeChat, ask, reset } = useChatWidget();
  const { messages, status, error, stop, regenerate } = chat;
  const [input, setInput] = useState("");
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

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Keep the newest message in view while streaming.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

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
      {/* Floating launcher */}
      <button
        type="button"
        onClick={openChat}
        aria-label="Open the AI assistant"
        className={cn(
          "group fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-brand-gradient py-3 pr-5 pl-4 font-medium text-white shadow-xl shadow-brand-2/30 transition-all hover:scale-105 hover:shadow-2xl",
          isOpen && "pointer-events-none scale-90 opacity-0",
        )}
      >
        <Sparkles className="size-5 transition-transform group-hover:rotate-12" />
        <span className="text-sm">Ask my AI</span>
        <kbd className="hidden rounded bg-white/20 px-1.5 font-mono text-[10px] sm:inline">⌘K</kbd>
      </button>

      {/* Panel */}
      <section
        role="dialog"
        aria-modal="false"
        aria-label={`Chat with ${profile.shortName}'s AI assistant`}
        hidden={!isOpen}
        className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background sm:inset-auto sm:right-5 sm:bottom-5 sm:h-[min(680px,calc(100dvh-2.5rem))] sm:w-[420px] sm:rounded-2xl sm:border sm:shadow-2xl sm:shadow-brand-2/15"
      >
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <div className="grid size-9 place-items-center rounded-full bg-brand-gradient text-white">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{profile.shortName}&apos;s AI assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={cn("size-1.5 rounded-full", busy ? "animate-pulse bg-primary" : "bg-success")}
              />
              {busy ? "Typing…" : "Online · replies in your language"}
            </p>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={reset}
              aria-label="Clear conversation"
              title="Clear conversation"
            >
              <Trash2 />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={closeChat} aria-label="Close chat" title="Close (Esc)">
            <X />
          </Button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
          {messages.length === 0 && (
            <div className="flex h-full flex-col justify-end gap-4 pb-2">
              <div className="space-y-2">
                <p className="text-2xl font-semibold tracking-tight">
                  Hi! I&apos;m <span className="text-gradient">{profile.shortName}</span>&apos;s AI 👋
                </p>
                <p className="text-sm text-muted-foreground">
                  Ask me anything about my experience, projects or skills — in English, Spanish or any other
                  language.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {chatSuggestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => ask(q)}
                    className="rounded-full border bg-card px-3 py-1.5 text-left text-xs transition-colors hover:border-primary/50 hover:bg-accent"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <Message key={m.id} message={m} onNavigate={onNavigate} />
          ))}

          {status === "submitted" && lastIsUser && (
            <div className="flex items-center gap-1 pl-1" aria-label="Thinking">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="size-2 animate-bounce rounded-full bg-primary/60"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          )}

          {error && (
            <div className="space-y-2 rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
              <p>{errorMessage(error)}</p>
              <Button variant="secondary" size="sm" onClick={() => regenerate()}>
                <RotateCcw />
                Try again
              </Button>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="border-t p-3">
          <div className="flex items-end gap-2 rounded-2xl border bg-card px-3 py-2 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-ring/20">
            <label htmlFor="chat-input" className="sr-only">
              Your message
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={MAX_CHARS}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask me anything…"
              className="[field-sizing:content] max-h-32 min-h-6 flex-1 resize-none bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none"
            />
            {busy ? (
              <Button
                size="icon"
                variant="secondary"
                onClick={() => stop()}
                aria-label="Stop generating"
                title="Stop"
              >
                <Square className="fill-current" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                aria-label="Send message"
                title="Send (Enter)"
              >
                <ArrowUp />
              </Button>
            )}
          </div>
          <p className="mt-2 px-1 text-[11px] text-muted-foreground">
            AI can make mistakes — double-check important details. See the{" "}
            <Link href="/privacy" onClick={onNavigate} className="underline underline-offset-2">
              privacy policy
            </Link>
            .{input.length > MAX_CHARS * 0.8 && ` ${input.length}/${MAX_CHARS}`}
          </p>
        </form>
      </section>
    </>
  );
}

function Message({ message, onNavigate }: { message: ChatUIMessage; onNavigate: () => void }) {
  if (message.role === "user") {
    const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-gradient px-3.5 py-2 text-sm whitespace-pre-wrap text-white">
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
        <Sparkles className="size-3.5" />
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
              return <ToolSkeleton key={key} label="Looking up projects…" />;
            case "tool-showContactCard":
              if (part.state === "output-available")
                return <ContactToolCard key={key} contact={part.output} onNavigate={onNavigate} />;
              if (part.state === "output-error") return null;
              return <ToolSkeleton key={key} label="Preparing contact options…" />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
