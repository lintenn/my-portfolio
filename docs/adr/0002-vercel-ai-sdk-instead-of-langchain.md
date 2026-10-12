# 0002 — Vercel AI SDK instead of LangChain

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

The 2024 version combined LangChain (chains, retrievers, prompt templates) with AI SDK 3 only to adapt LangChain's stream to the browser, plus a manual `ReadableStream` transform. Upgrading meant moving two fast-moving libraries in lockstep (there was even a pinned `@langchain/core` override). Without RAG (ADR-0001), almost none of LangChain's abstractions are needed.

## Decision

Use the **Vercel AI SDK 7** end to end: `streamText` on the server (model, instructions, tools, multi-step loop, provider options), `toUIMessageStreamResponse` for the wire protocol, and `useChat` from `@ai-sdk/react` on the client with typed `UIMessage` parts. Talk to OpenAI through `@ai-sdk/openai` (Responses API).

## Consequences

- ✅ One library, end-to-end types: tool input/output types flow from the Zod schemas to the React components rendering them.
- ✅ Built-in streaming protocol, tool calling, multi-step agent loop, message validation and usage reporting.
- ✅ Provider-agnostic: switching to another provider (or the Vercel AI Gateway) is a one-line model change.
- ⚠️ The SDK evolves quickly (v3 → v7 changed messages to `parts`, `system` → `instructions`, etc.). Mitigated by pinning majors and reading types from `node_modules`.
