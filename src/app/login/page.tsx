'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';
import { Icons } from '@/components/ui/icons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Session check error:', error.message);
          return;
        }
        if (user) {
          console.log('User found, redirecting to dashboard');
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Unexpected session check error:', err);
      }
    };
    checkSession();
  }, [router, supabase]);

  // Handle email/password login
  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Email login API response status:', res.status);
      const contentType = res.headers.get('content-type');
      console.log('Email login API response content-type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.slice(0, 200)); // Log first 200 chars
        throw new Error('Server returned an invalid response');
      }

      const data = await res.json();
      console.log('Email login API response data:', data);

      if (!res.ok || data.error) {
        console.error('Login error:', data.error);
        setError(data.error || 'Login failed');
        toast({
          title: 'Error',
          description: data.error || 'Login failed',
          variant: 'destructive',
        });
        return;
      }

      // Verify session
      await supabase.auth.refreshSession();
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      if (sessionError || !user) {
        console.error('Session not set:', sessionError?.message || 'No user found');
        setError('Session not established. Please try again.');
        toast({
          title: 'Error',
          description: 'Session not established. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Logged in',
        description: 'You have successfully logged in',
      });
      console.log('Redirecting to dashboard');
      window.location.href = '/dashboard'; // Force hard redirect
    } catch (err: any) {
      console.error('Unexpected email login error:', err.message);
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' }),
      });

      console.log('Google login API response status:', res.status);
      const contentType = res.headers.get('content-type');
      console.log('Google login API response content-type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.slice(0, 200)); // Log first 200 chars
        throw new Error('Server returned an invalid response');
      }

      const data = await res.json();
      console.log('Google login API response data:', data);

      if (!res.ok || data.error) {
        console.error('Google login error:', data.error);
        setError(data.error || 'Google login failed');
        toast({
          title: 'Google Sign-In Error',
          description: data.error || 'Google login failed',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (data.redirect) {
        console.log('OAuth URL received:', data.redirect);
        window.location.href = data.redirect;
      } else {
        console.error('No redirect URL provided');
        setError('Google login failed: No redirect URL');
        toast({
          title: 'Google Sign-In Error',
          description: 'Google login failed: No redirect URL',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Unexpected Google login error:', err.message);
      setError(err.message);
      toast({
        title: 'Google Sign-In Error',
        description: err.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password to access your notes.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleEmailLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" className="p-0 h-auto" type="button">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push('/signup')}
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}