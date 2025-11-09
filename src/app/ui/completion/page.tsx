"use client";

import { useState } from "react";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error) || "An unknown error occurred during completion.";
}

export default function CompletionPage() {
    const [prompt, setPrompt] = useState("");
    const [completion, setCompletion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const complete = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            setCompletion("");
            return;
        }

        setIsLoading(true);
        setError(null);
        setCompletion(""); 

        try {
            const response = await fetch("/api/completion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.text) {
                throw new Error("Received an invalid response from the API.");
            }

            setCompletion(data.text);
            setPrompt(""); 

        } catch (err: unknown) { 
            console.error("Completion Error:", err);
            
            const errorMessage = getErrorMessage(err);
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col w-full max-w-md mx-auto stretch p-4">
            {isLoading ? (
                <div className="text-center p-4 text-blue-500">Loading...</div>
            ) : error ? (
                <div className="text-red-500 bg-red-100 p-4 border border-red-400 rounded-md whitespace-pre-wrap">
                    **Error:** {error}
                </div>
            ) : completion ? (
                <div className="p-4 rounded-md whitespace-pre-wrap">{completion}</div>
            ) : (
                <div className="text-center text-gray-500 p-4">Enter a prompt to start.</div>
            )}

            <form onSubmit={complete} className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-700 shadow-lg">
                <div className="flex gap-2">
                    <input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 rounded-lg text-white placeholder-zinc-400 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="How can I help you?"
                        type="text"
                        disabled={isLoading}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                        type="submit"
                        disabled={isLoading || !prompt.trim()}>
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}