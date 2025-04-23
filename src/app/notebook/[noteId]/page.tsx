"use client";

import DeleteButton from "@/components/DeleteButton";
import TipTapEditor from "@/components/TipTapEditor";
import Summarization from "@/components/Summarization";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Props = {
  params: {
    noteId: string;
  };
};

const NotebookPage = ({ params }: Props) => {
  const { noteId } = params;
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Fetch note and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user from Supabase client-side
        const userRes = await fetch("/api/auth/user");
        if (!userRes.ok) {
          throw new Error("Failed to fetch user: " + (await userRes.text()));
        }
        const userData = await userRes.json();
        setUser(userData);

        // Fetch note from Supabase
        const noteRes = await fetch(`/api/note/${noteId}`);
        if (!noteRes.ok) {
          throw new Error("Failed to fetch note: " + (await noteRes.text()));
        }
        const noteData = await noteRes.json();
        console.log("Fetched note:", noteData);
        setNote(noteData);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
        toast.error(error.message);
        router.push("/dashboard");
      }
    };
    fetchData();
  }, [noteId, router]);

  if (!note || !user) {
    return <div className="min-h-screen flex items-center justify-center text-stone-600">Loading...</div>;
  }

  // Log editorState before passing to Summarization
  console.log("editorState before Summarization:", note.editorState);

  // Get user display name
  const displayName = user.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
    : user.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-4 flex items-center">
          <Link href="/dashboard">
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              size="sm"
            >
              Back
            </Button>
          </Link>
          <div className="w-3"></div>
          <span className="font-semibold text-stone-800">{displayName}</span>
          <span className="inline-block mx-2 text-stone-400">/</span>
          <span className="text-stone-600 font-semibold">{note.name}</span>
          <div className="ml-auto">
            <DeleteButton noteId={note.id} />
          </div>
        </div>

        {/* Editor and Summarization */}
        <div className="mt-6 bg-white border border-stone-200 rounded-lg shadow-sm p-6">
          <div className="prose max-w-none">
            <TipTapEditor note={note} />
          </div>
          <Summarization noteId={noteId} editorState={note.editorState} />
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;