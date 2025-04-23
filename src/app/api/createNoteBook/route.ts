// /api/createNoteBook
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { uploadFileToSupabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

//export const runtime = "edge";
// Use Node.js runtime to support 'postgres'
export const runtime = "nodejs"

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

    // Generate image description
    const image_description = await generateImagePrompt(name);
    if (!image_description) {
      return new NextResponse("Failed to generate image description", {
        status: 500,
      });
    }

    // Generate image Blob
    const imageBlob = await generateImage(image_description);
    if (!imageBlob) {
      return new NextResponse("Failed to generate image", { status: 500 });
    }

    // Upload Blob to Supabase and get public URL
    const imageUrl = await uploadFileToSupabase(imageBlob, name);
    if (!imageUrl) {
      return new NextResponse("Failed to upload image to Supabase", { status: 500 });
    }

    // Insert into database with  image blob in string
    const note_ids = await db
      .insert($notes)
      .values({
        name,
        userId: user.id,
        imageUrl: imageUrl,
      })
      .returning({
        insertedId: $notes.id,
      });

    return NextResponse.json({
      note_id: note_ids[0].insertedId,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}