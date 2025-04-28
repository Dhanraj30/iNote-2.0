// /api/createNoteBook
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { uploadFileToSupabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
// Use Node.js runtime to support 'postgres'
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Insert notebook into the database
    const note_ids = await db
      .insert($notes)
      .values({
        name,
        userId: user.id,
        imageUrl: null, // Placeholder for the image URL
      })
      .returning({
        insertedId: $notes.id,
      });

    const noteId = note_ids[0].insertedId;

    // Trigger image generation and upload asynchronously
    (async () => {
      try {
        // Generate image description
        const image_description = await generateImagePrompt(name);
        if (!image_description) {
          console.error("Failed to generate image description");
          return;
        }

        // Generate image Blob
        const imageBlob = await generateImage(image_description);
        if (!imageBlob) {
          console.error("Failed to generate image");
          return;
        }

        // Upload Blob to Supabase and get public URL
        const imageUrl = await uploadFileToSupabase(imageBlob, name);
        if (!imageUrl) {
          console.error("Failed to upload image to Supabase");
          return;
        }

        // Update the notebook with the image URL
        const updateResult = await db
          .update($notes)
          .set({ imageUrl })
          .where(eq($notes.id, noteId));
        if (!updateResult || updateResult.length === 0) {
          console.error("Failed to update notebook with image URL: No rows were updated.");
          return;
        }
        console.log("Update result:", updateResult);
      } catch (err) {
        console.error("Error during image generation/upload:", err);
      }
    })();

    return NextResponse.json({
      note_id: noteId,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}