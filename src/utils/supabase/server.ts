
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
//import type { Database } from '@/utils/supabase/types';

export async function createClient() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch(error) {
            console.error("Error setting cookies:", error);
            // Ignore errors during cookie setting
          }
        },
      },
    }
  );

  // Log the user to verify session
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Current user from session:", user?.id);

  return supabase;
}