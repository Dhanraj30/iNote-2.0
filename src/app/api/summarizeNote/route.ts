//src/app/api/sumarizeNote/route.ts
import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Use Node.js runtime to support 'postgres'

export async function POST(req: Request) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User authentication failed:", userError?.message, "User data:", user);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body
    const { noteId, editorState } = await req.json();
    
    if (!noteId || !editorState) {
      return new NextResponse("Note ID and editorState are required", { status: 400 });
    }
    
    console.log(`Received User ID: ${user.id}, Note ID: ${noteId}, Parsed Note ID: ${parseInt(noteId)}, typeof noteId: ${typeof noteId}`);

    // Verify note belongs to user
    const notes = await db
      .select()
      .from($notes)
      .where(eq($notes.id, parseInt(noteId)))
      .where(eq($notes.userId, user.id));

     console.log("Query result:", notes, "Query conditions:", { id: parseInt(noteId), userId: user.id });

    // Filter to ensure we get the exact note
    const note = notes.find(n => n.id === parseInt(noteId));
    if (!note) {
      console.error(`Note with id ${noteId} not found or unauthorized for user ${user.id.trim()}`);
      return new NextResponse("Note not found or unauthorized", { status: 404 });
    }

    // Extract plain text from editorState (TipTap JSON)
    let parsedEditorState;
    try {
      parsedEditorState = JSON.parse(editorState);
    } catch (jsonError: any) {
      console.error("Failed to parse editorState:", jsonError.message);
      return new NextResponse("Invalid editorState format", { status: 400 });
    }

    const extractText = (content: any): string => {
      if (typeof content === "string") return content;
      if (Array.isArray(content)) {
        return content.map(item => extractText(item)).join(" ");
      }
      if (content.content) return extractText(content.content);
      if (content.text) return content.text;
      return "";
    };
    
    const text = extractText(parsedEditorState);
    if (!text || text.trim().length < 30) {
      return new NextResponse("Note content is too short for summarization (minimum 50 characters)", { status: 400 });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create prompt for summarization
    const prompt = `Provide a concise summary (2-3 sentences, under 200 words) of the following text:\n\n${text}`;

    // Generate summary
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Summarization error:", error.message);
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
  }
}