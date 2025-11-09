"use client";

import { useCompletion } from "@ai-sdk/react";

export default function StreamPage() {
  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    setInput,
    stop,
  } = useCompletion({
    api: "/api/stream",
  });

  return (
    <div className="flex flex-col w-full max-w-md mx-auto stretch p-4">
      {error && <div className="text-red-500">{error.message}</div>}
      {isLoading && !completion && <div>Loading...</div>}
      {completion && <div className="whitespace-pre-wrap">{completion}</div>}

      <form
        onSubmit={(e) => {
            e.preventDefault();
            setInput("");
            handleSubmit(e);
        }}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-700 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 rounded-lg text-white placeholder-zinc-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ask me anything..."
            type="text"
            value={input}
            onChange={handleInputChange}
          />
          {isLoading ? (
            <button
              onClick={stop}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >Stop</button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              type="submit"
              disabled={isLoading}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
