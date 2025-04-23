import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}