import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API auth routes
  const publicRoutes = ['/', '/login', '/signup', '/auth/callback'];
  if (publicRoutes.includes(pathname) || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Create Supabase client
  const supabase = await createClient();

  // Check user session
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // Match all routes except static files and _next
    '/', // Match root
    '/(api|trpc)(.*)', // Match API and TRPC routes
  ],
};