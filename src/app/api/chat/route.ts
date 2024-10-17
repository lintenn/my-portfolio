import { ChatOpenAI } from "@langchain/openai";
import {
  LangChainAdapter,
  LangChainStream,
  OpenAIStream,
  StreamingTextResponse,
} from "ai";
import { ChatCompletionMessageParam } from "ai/prompts";
import OpenAI from "openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    //const openai = new OpenAI(); // It automatically looks for OPENAI_API_KEY env-variable

    const currentMessageContent = messages[messages.length - 1].content;

    //const { stream, handlers } = LangChainAdapter();

    const chatModel = new ChatOpenAI({
      // It automatically looks for OPENAI_API_KEY env-variable
      modelName: "gpt-3.5-turbo",
      streaming: true,
      //callbacks: [handlers],
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a sarcasm bot. You answer all user questions in a sarcastic way.",
      ],
      ["user", "{input}"],
    ]);

    const chain = prompt.pipe(chatModel);

    /*
    chain.invoke({
      input: currentMessageContent,
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
    */

    // Use the .stream() method and pass it to LangChainAdapter
    const stream = await chain.stream({
      input: currentMessageContent,
    });

    // Return the stream using LangChainAdapter
    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
