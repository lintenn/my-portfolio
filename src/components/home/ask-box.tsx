"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useChatWidget } from "@/components/chat/chat-provider";

/** Types and deletes example questions in the placeholder, like someone thinking aloud. */
function useTypewriter(texts: string[], enabled: boolean) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!enabled || texts.length === 0) return;
    let text = 0;
    let char = 0;
    let deleting = false;
    let timer: number;
    const tick = () => {
      const current = texts[text]!;
      char += deleting ? -1 : 1;
      setValue(current.slice(0, char));
      let delay = deleting ? 25 : 55;
      if (!deleting && char === current.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && char === 0) {
        deleting = false;
        text = (text + 1) % texts.length;
        delay = 350;
      }
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 800);
    return () => window.clearTimeout(timer);
  }, [texts, enabled]);

  return value;
}

/** Home-page entry point to the assistant: a real input plus one-click suggestions. */
export function AskBox({
  suggestions,
  label,
  placeholder,
  submitLabel,
}: {
  suggestions: string[];
  label: string;
  placeholder: string;
  submitLabel: string;
}) {
  const { ask } = useChatWidget();
  const [question, setQuestion] = useState("");
  const [focused, setFocused] = useState(false);
  const typed = useTypewriter(suggestions, !focused && !question);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
          setQuestion("");
        }}
        className="group relative rounded-2xl p-px shadow-xl shadow-brand-2/15 transition-shadow focus-within:shadow-2xl focus-within:shadow-brand-2/30"
      >
        <span aria-hidden className="absolute inset-0 gradient-border rounded-2xl" />
        <div className="relative flex items-center gap-3 rounded-[15px] bg-background/95 px-4 py-3 backdrop-blur">
          <Sparkles className="size-5 shrink-0 text-primary transition-transform duration-500 group-focus-within:rotate-12" />
          <label htmlFor="ask-box" className="sr-only">
            {label}
          </label>
          <input
            id="ask-box"
            value={question}
            maxLength={1000}
            onChange={(e) => setQuestion(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : `${typed}▍`}
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground focus-visible:outline-none"
          />
          <motion.button
            type="submit"
            disabled={!question.trim()}
            aria-label={submitLabel}
            whileTap={{ scale: 0.9 }}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-gradient text-white transition-opacity disabled:opacity-40"
          >
            <ArrowUp className="size-4" />
          </motion.button>
        </div>
      </form>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.slice(0, 4).map((q) => (
          <motion.button
            key={q}
            type="button"
            onClick={() => ask(q)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {q}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
