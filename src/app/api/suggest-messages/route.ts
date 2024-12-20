import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { APICallError } from "ai";
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    if (error instanceof APICallError) {
      return Response.json(
        {
          success: false,
          message: `OpenAI Error: ${error.message}`,
          code: error.statusCode,
        },
        { status: error.statusCode || 500 }
      );
    } else {
      // Handle general errors
      return Response.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        },
        { status: 500 }
      );
    }
  }
}
