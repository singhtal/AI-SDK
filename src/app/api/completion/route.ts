import { generateText } from "ai";
import { google } from "@ai-sdk/google";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error) || "An unknown error occurred during text generation.";
}

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
             return new Response(
                JSON.stringify({ error: "Prompt is required." }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        console.log("Received Prompt:", prompt);

        const { text } = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: prompt,
        })

        return Response.json({ text });

    } catch (error: unknown) {
        
        console.error("API Route Error:", error);

        const errorMessage = getErrorMessage(error);

        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}