
import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { noteId: string } }) {
  try {
    const { noteId } = params;
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notes = await db
      .select()
      .from($notes)
      .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, user.id)));

    if (notes.length !== 1) {
      return new NextResponse("Note not found", { status: 404 });
    }

    return NextResponse.json(notes[0]);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
/*

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { noteId: string } }) {
  try {
    const { noteId } = params;

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: notes, error: noteError } = await supabase
      .from('notes')
      .select('id, name, image_url, editor_state')
      .eq('id', parseInt(noteId))
      .eq('user_id', user.id)
      .single();

    if (noteError || !notes) {
      return new NextResponse("Note not found or unauthorized", { status: 404 });
    }

    return NextResponse.json(notes);
  } catch (error: any) {
    console.error("Error fetching note:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
  */