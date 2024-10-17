"use client";

import { Bot } from "lucide-react";
import { useState } from "react";
import AIChatBox from "./AIChatBox";

export default function AIChatButton() {
  const [chatBoxOpen, steChatBoxOpen] = useState(false);

  return (
    <>
      <button onClick={() => steChatBoxOpen(true)}
        title="Open Chatbot">
        <Bot size={24} />
      </button>
      <AIChatBox open={chatBoxOpen} onClose={() => steChatBoxOpen(false)} />
    </>
  );
}
