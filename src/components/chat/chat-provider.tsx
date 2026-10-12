"use client";

import { useChat } from "@ai-sdk/react";
import { useLocale } from "next-intl";
import { createContext, use, useEffect, useRef, useState, type ReactNode } from "react";
import type { ChatUIMessage } from "@/lib/ai/tools";

const STORAGE_KEY = "portfolio-chat-v2";

type ChatHelpers = ReturnType<typeof useChat<ChatUIMessage>>;

interface ChatWidgetContext {
  chat: ChatHelpers;
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  /** Opens the chat and sends `question` right away. */
  ask: (question: string) => void;
  /** Regenerates the last answer (after an error). */
  retry: () => void;
  reset: () => void;
}

const Context = createContext<ChatWidgetContext | null>(null);

/**
 * Owns the single chat session of the page. It lives in the root layout, so
 * the conversation survives client-side navigation and closing the panel, and
 * it is mirrored to sessionStorage so it also survives a reload.
 */
export function ChatProvider({ children }: { children: ReactNode }) {
  // The page language travels with every request: tool cards and errors come back in it.
  const locale = useLocale();
  const chat = useChat<ChatUIMessage>();
  const [isOpen, setIsOpen] = useState(false);
  const restored = useRef(false);
  const { messages, setMessages, status, sendMessage, regenerate, stop, clearError } = chat;

  // Restore once on mount (sessionStorage is not available during SSR).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved) as ChatUIMessage[]);
    } catch {
      // Storage blocked or corrupted: start fresh.
    }
    restored.current = true;
  }, [setMessages]);

  // Persist only settled conversations, not every streamed token.
  useEffect(() => {
    if (!restored.current || status === "streaming" || status === "submitted") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore quota / privacy-mode errors.
    }
  }, [messages, status]);

  const busy = status === "streaming" || status === "submitted";

  const value: ChatWidgetContext = {
    chat,
    isOpen,
    openChat: () => setIsOpen(true),
    closeChat: () => setIsOpen(false),
    ask: (question) => {
      setIsOpen(true);
      if (!busy && question.trim()) {
        clearError();
        void sendMessage({ text: question.trim() }, { body: { locale } });
      }
    },
    retry: () => {
      clearError();
      void regenerate({ body: { locale } });
    },
    reset: () => {
      void stop();
      clearError();
      setMessages([]);
    },
  };

  return <Context value={value}>{children}</Context>;
}

export function useChatWidget() {
  const ctx = use(Context);
  if (!ctx) throw new Error("useChatWidget must be used inside <ChatProvider>");
  return ctx;
}
