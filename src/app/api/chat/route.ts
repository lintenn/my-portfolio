import { ChatOpenAI } from "@langchain/openai";
import { LangChainAdapter, Message as VercelChatMessage } from "ai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { getVectorStore } from "@/lib/astradb";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";
import { Redis } from "@upstash/redis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    const chatHistory = messages
      .slice(0, -1)
      .map((m: VercelChatMessage) =>
        m.role === "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content),
      );

    const currentMessageContent = messages[messages.length - 1].content;

    const redisCache = new UpstashRedisCache({
      client: Redis.fromEnv(),
    });

    const chatModel = new ChatOpenAI({
      // It automatically looks for OPENAI_API_KEY env-variable
      modelName: "gpt-3.5-turbo",
      streaming: true,
      //callbacks: [handlers],
      verbose: true,
      cache: redisCache,
    });

    const rephrasingModel = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      verbose: true,
      cache: redisCache,
    });

    const retriever = (await getVectorStore()).asRetriever();

    const rephrasePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
      [
        "user",
        "Given the above conversation, generate a search query to look up in order to get information relevant to the current question. " +
          "Don't leave out any relevant keywords. Only return the query and no other text.",
      ],
    ]);

    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
      llm: rephrasingModel,
      retriever,
      rephrasePrompt,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a chatbot for a personal portfolio website. You impersonate the website's owner. " +
          "Answer the user's questions based on the below context. " +
          "Whenever it makes sense, provide links to pages that contain more information about the topic from the given context. " +
          "Format your messages in markdown format.\n\n" +
          "Context:\n{context}",
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
      documentPrompt: PromptTemplate.fromTemplate(
        "Page URL: {url}\n\nPage content:\n{page_content}", // The {url} is obtained from the metadata specified in generateEmbeddings()
      ),
      documentSeparator: "\n--------\n",
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain,
      retriever: historyAwareRetrieverChain,
    });

    // Use the .stream() method and pass it to LangChainAdapter
    const stream = await retrievalChain.stream({
      input: currentMessageContent,
      chat_history: chatHistory,
    });

    // Transform the stream into a compatible format
    const transformedStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          // Assume that 'chunk.answer' is the relevant content
          const transformedChunk = {
            content: chunk.answer || "", // Ensure 'content' exists
          };

          controller.enqueue(transformedChunk);
        }
        controller.close();
      },
    });

    // Return the stream using LangChainAdapter
    return LangChainAdapter.toDataStreamResponse(transformedStream);
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
