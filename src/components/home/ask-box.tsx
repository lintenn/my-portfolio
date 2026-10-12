"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { useChatWidget } from "@/components/chat/chat-provider";
import { chatSuggestions } from "@/content";

/** Home-page entry point to the assistant: a real input plus one-click suggestions. */
export function AskBox() {
  const { ask } = useChatWidget();
  const [question, setQuestion] = useState("");

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
          setQuestion("");
        }}
        className="group relative rounded-2xl bg-brand-gradient p-px shadow-xl shadow-brand-2/15"
      >
        <div className="flex items-center gap-3 rounded-[15px] bg-background/95 px-4 py-3 backdrop-blur">
          <Sparkles className="size-5 shrink-0 text-primary" />
          <label htmlFor="ask-box" className="sr-only">
            Ask my AI assistant
          </label>
          <input
            id="ask-box"
            value={question}
            maxLength={1000}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything — e.g. “What's your experience with LLMs?”"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground focus-visible:outline-none"
          />
          <button
            type="submit"
            disabled={!question.trim()}
            aria-label="Ask"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-gradient text-white transition-opacity disabled:opacity-40"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </form>
      <div className="flex flex-wrap justify-center gap-2">
        {chatSuggestions.slice(0, 4).map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
