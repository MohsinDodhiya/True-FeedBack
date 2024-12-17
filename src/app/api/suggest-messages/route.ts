import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Use streamText for a streaming response
    const result = streamText({
      model: openai("gpt-4o"), // Use the appropriate model
      messages: [{ role: "user", content: prompt }], // Pass the prompt as a message
    });

    // Stream the response back to the client
    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      // Handle OpenAI-specific errors
      console.error("API error:", error.message);
      return NextResponse.json(
        {
          error: "An error occurred while processing your request.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Handle unexpected errors
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
