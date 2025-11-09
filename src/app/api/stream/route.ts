import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt: prompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Error response", err);
    return new Response("Failed to stream text", { status: 500 });
  }
}
