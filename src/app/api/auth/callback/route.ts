import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (!code) {
    console.error('No code provided in OAuth callback');
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?error=No%20code%20provided`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth session exchange error:', error.message);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?error=${encodeURIComponent(error.message)}`);
    }

    await supabase.auth.refreshSession();
    console.log('OAuth callback successful, redirecting to:', next);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}${next}`);
  } catch (error: any) {
    console.error('Callback error:', error.message);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?error=${encodeURIComponent('Unexpected error')}`);
  }
}