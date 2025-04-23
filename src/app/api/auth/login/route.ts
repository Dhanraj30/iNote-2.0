import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, provider } = body;

    const supabase = await createClient();

    if (provider === 'google') {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const auth_callback_url =`${origin}/api/auth/callback`;
      console.log('Auth callback URL:', auth_callback_url);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: auth_callback_url,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google OAuth error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (!data.url) {
        console.error('No OAuth redirect URL returned');
        return NextResponse.json({ error: 'No OAuth redirect URL' }, { status: 500 });
      }

      return NextResponse.json({ redirect: data.url });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Email login error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase.auth.refreshSession();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Login API error:', error.message);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}