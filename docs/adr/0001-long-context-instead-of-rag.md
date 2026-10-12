# 0001 — Long-context grounding instead of vector-DB RAG

- **Status:** Accepted
- **Date:** 2026-10-12
- **Supersedes:** the 2024 RAG pipeline (LangChain + AstraDB + Upstash cache)

## Context

The 2024 assistant used Retrieval-Augmented Generation: at build time, `scripts/generate.ts` read the page `.tsx` sources, stripped imports/classNames with regexes, split them into chunks, embedded them with `text-embedding-3-small` and stored them in AstraDB. At request time a "history-aware retriever" asked `gpt-3.5-turbo` to rephrase the question, retrieved the top chunks and "stuffed" them into the prompt. Answers were cached in Upstash Redis.

By 2026 the chatbot was down (HTTP 500): it depended on four external services, two of them free tiers that hibernate on inactivity, the OpenAI balance was $0, and the build itself required all of them. The knowledge was also derived from JSX source code, which is noisy and breaks when markup changes.

The whole knowledge base is ~4k tokens, while current models have context windows of 1M tokens and providers offer automatic prompt caching.

## Decision

Send the **entire** knowledge base (generated from typed content, see ADR-0003) in the system prompt of every request. Order the prompt so the static part is a stable prefix that the provider caches. Remove embeddings, the vector store, the rephrasing step and the response cache.

## Consequences

- ✅ Better answers: the model sees every fact; no retrieval misses or chunks cut mid-sentence; multi-hop questions ("compare your two jobs") just work.
- ✅ One request to one service instead of three; the build needs no secrets; nothing to re-index when content changes.
- ✅ Cost stays low thanks to prompt caching (cached input tokens are heavily discounted).
- ⚠️ Every request carries ~4k input tokens. Fine at this scale; bounded by rate limits.
- 🔁 Revisit if the corpus grows beyond ~50–100k tokens (e.g. a blog): then reintroduce RAG — ideally hybrid search (vectors + keywords) with a reranker — or let the model call a `search` tool.
