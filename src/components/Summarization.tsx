import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import { generateJSON } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

type SummarizationProps = {
  noteId: string;
  editorState: string | null | undefined;
};

const Summarization = ({ noteId, editorState }: SummarizationProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle summarization
  const handleSummarize = async () => {
    if (!editorState) {
      toast.error("No content to summarize");
      return;
    }

    // Convert HTML editorState to TipTap JSON
    let editorStateJson: string;
    try {
      // Ensure editorState is a string and starts with HTML-like content
      if (typeof editorState !== "string" || !editorState.startsWith("<")) {
        throw new Error("Editor content is not in HTML format");
      }

      // Convert HTML to TipTap JSON using generateJSON
      const json = generateJSON(editorState, [StarterKit]);
      editorStateJson = JSON.stringify(json);
    } catch (error: any) {
      console.error("Failed to convert HTML to JSON:", error.message);
      toast.error("Failed to process note content for summarization");
      return;
    }

    setIsLoading(true);
    setSummary(null); // Reset summary to hide card while loading
    try {
      const res = await fetch("/api/summarizeNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, editorState: editorStateJson }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const { summary } = await res.json();
      setSummary(summary);
      toast.success("Summary generated!");
    } catch (error: any) {
      console.error("Summarization error:", error.message);
      toast.error("Failed to generate summary: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle closing the summary card
  const handleCloseSummary = () => {
    setSummary(null);
  };

  return (
    <div className="mt-4">
      <Button
        onClick={handleSummarize}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Summarizing...
          </span>
        ) : (
          "Summarize Note"
        )}
      </Button>
      {summary && (
        <div className="mt-4 p-6 bg-stone-50 border border-stone-200 rounded-lg shadow-md relative">
          <button
            onClick={handleCloseSummary}
            className="absolute top-3 right-3 text-stone-500 hover:text-stone-700 transition-colors duration-150"
            aria-label="Close summary"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-stone-800 mb-2">Summary</h3>
          <p className="text-stone-600 leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default Summarization;