"use client";

import { useState } from "react";

// Helper function to safely extract the message from an unknown error
function getErrorMessage(error: unknown): string {
    // Check if the error is an instance of the standard JavaScript Error class
    if (error instanceof Error) {
        return error.message;
    }
    // If it's not a standard Error, try converting it to a string.
    // This handles cases where a string or other object might be thrown.
    return String(error) || "An unknown error occurred during completion.";
}

export default function CompletionPage() {
    // New state for error messages
    const [prompt, setPrompt] = useState("");
    const [completion, setCompletion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // State for error

    const complete = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Basic validation
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            setCompletion("");
            return;
        }

        setIsLoading(true);
        setError(null); // Clear previous errors
        setCompletion(""); // Clear previous completion

        try {
            const response = await fetch("/api/completion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            })

            // 2. Check for non-200 HTTP status
            if (!response.ok) {
                // Try to read a specific error message from the response body
                const errorData = await response.json();
                // Throw a standard Error so it can be caught below
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // 3. Check for expected data
            if (!data.text) {
                throw new Error("Received an invalid response from the API.");
            }

            setCompletion(data.text);
            setPrompt(""); // Clear prompt on success

        } catch (err: unknown) { // 'err' is correctly typed as unknown
            // 4. Handle fetch/logic errors
            console.error("Completion Error:", err);
            
            // Safely extract the error message
            const errorMessage = getErrorMessage(err);
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col w-full max-w-md mx-auto stretch p-4">
            {/* --- Display Status/Result --- */}
            {isLoading ? (
                <div className="text-center p-4 text-blue-500">Loading...</div>
            ) : error ? (
                // Display Error Message
                <div className="text-red-500 bg-red-100 p-4 border border-red-400 rounded-md whitespace-pre-wrap">
                    **Error:** {error}
                </div>
            ) : completion ? (
                // Display Completion Result
                <div className="p-4 rounded-md whitespace-pre-wrap">{completion}</div>
            ) : (
                // Initial state message
                <div className="text-center text-gray-500 p-4">Enter a prompt to start.</div>
            )}

            {/* --- Input Form --- */}
            <form onSubmit={complete} className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-700 shadow-lg">
                <div className="flex gap-2">
                    <input
                        // Correctly bind value and onChange to the prompt state
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