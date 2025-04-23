
"use client";
import React, { useState, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";
import { useCompletion } from "ai/react";
import dynamic from "next/dynamic";
//import ExcalidrawWrapper from "./ExcaliDrawWrapper"; // Import the Excalidraw wrapper
import { Coffee } from "lucide-react";

// Dynamically import ExcalidrawWrapper to avoid SSR issues
const ExcalidrawWrapper = dynamic(
  async () =>(await import("./ExcaliDrawWrapper")).default,
  { ssr: false, },
);
type Props = { note: NoteType };

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = useState(
    note.editorState || `<h1>${note.name}</h1>`
  );
  const [showDrawCanvas, setShowDrawCanvas] = useState(false); // State to toggle draw canvas
  const { complete, completion } = useCompletion({ api: "/api/completion" });

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-a": () => {
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const lastCompletion = useRef("");

  useEffect(() => {
    if (!completion || !editor) return;
    const cleanedCompletion = completion
      .replace(/{}/g, "")
      .replace(/\\/g, "") // Remove backslashes
      .replace(/\//g, "") // Remove forward slashes
      .replace(/\*\*/g, "") // Remove double asterisks
      .replace(/#/g, "") // Remove hash symbols
      .replace(/\\n/g, " ") // Replace newline characters with a space
      .trim(); // Remove leading/trailing whitespace
    const diff = cleanedCompletion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  const debouncedEditorState = useDebounce(editorState, 500);

  useEffect(() => {
    if (debouncedEditorState === "") return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => console.log("success update!", data),
      onError: (err) => console.error(err),
    });
  }, [debouncedEditorState]);

  // Function to handle inserting the drawn image
  {
    /*const handleInsertDrawing = () => {
    const imgSrc = "path/to/drawing.png"; // Replace with actual image source
    if (editor) {
      editor.commands.insertContent(`<img src="${imgSrc}" alt="Drawing" />`);
    }
    setShowDrawCanvas(false); // Close the drawing canvas after inserting the image
  };
*/
  }
  return (
    <>
      <div className="min-h-screen bg-[#f8f5e6] bg-[url('/paper-texture.svg')] p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Left binding effect */}
          <div className="absolute left-0 top-0 bottom-0 w-6 md:w-12 bg-[#e2d9bc] shadow-inner">
            <div className="h-full flex flex-col justify-between py-8">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-2 bg-[#d1c7a3] rounded-full shadow-sm"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 mb-8 p-2 bg-[#e9e2cc] rounded-lg shadow-sm overflow-x-auto">
            {editor && <TipTapMenuBar editor={editor} />}
            <Button className="text-[#5c4f3a]" disabled variant={"outline"}>
              {saveNote.isLoading ? "Saving..." : "Saved"}
            </Button>
            <Button
              className="bg-[#5c4f3a] hover:bg-[#3a3124] text-white rounded-lg font-serif"
              onClick={() => setShowDrawCanvas(true)}
            >
              Draw
            </Button>
          </div>

          {showDrawCanvas && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Draw Something</h2>
                  <button
                    onClick={() => setShowDrawCanvas(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
                <div className="h-[500px]">
                  <ExcalidrawWrapper />
                </div>
                {/* <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowDrawCanvas(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleInsertDrawing} className="bg-orange-500 text-white px-4 py-2 rounded">
                Insert Drawing
              </button>
            </div>*/}
              </div>
            </div>
          )}
          <div className="relative">
            {/* Notebook lines */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-8 border-b border-[#d1c7a3] opacity-40"
                  style={{ top: `${i * 2}rem` }}
                />
              ))}
            </div>

            <div className="prose prose-sm w-full mt-4">
              <EditorContent editor={editor} />
            </div>

            <div className="flex items-center gap-2 text-[#8a7456] font-serif italic h-4">
              <Coffee size={16} />
              <span className="text-sm">
                Tip: Press{" "}
                <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                  Shift + A
                </kbd>{" "}
                for AI autocomplete
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TipTapEditor;
