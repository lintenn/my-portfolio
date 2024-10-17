import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react";
import { Bot, XCircle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hi, I'm the chatbot!",
      },
      {
        id: "2",
        role: "user",
        content: "Hi, I'm the user!",
      },
      {
        id: "3",
        role: "assistant",
        content: `
[Github Luis](https://github.com/lintenn)
List:
- Item 1
- Item 2
- Item 3
`,
      },
    ],
  }); // By default: useChat({api: "/api/chat"});

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-50 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} className="rounded-full bg-background" />
      </button>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div className="mt-3 h-full overflow-y-auto px-3">
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message: { role, content } }: ChatMessageProps) {
  const isAIMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAIMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAIMessage && <Bot className="mr-2 flex-none" />}
      <div
        className={cn(
          "rounded-md border px-3 py-2",
          isAIMessage ? "bg-background" : "bg-foreground text-background",
        )}
      >
        <ReactMarkdown
          components={{
            a: ({ node, ref, ...props }) => (
              <Link
                {...props}
                href={props.href ?? ""}
                className="text-primary hover:underline"
              />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="mt-3 first:mt-0" />
            ),
            ul: ({ node, ...props }) => (
              <ul
                {...props}
                className="mt-3 list-inside list-disc first:mt-0"
              />
            ),
            li: ({ node, ...props }) => <li {...props} className="mt-1" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
