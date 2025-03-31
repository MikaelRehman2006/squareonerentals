'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Mail, Lock, ArrowRight } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  
  const [isSignUp, setIsSignUp] = useState(() => {
    // Check URL parameters for initial state
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('isSignUp') === 'true';
    }
    return false;
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      console.error('Sign-in error:', error);
      toast.error(error === 'OAuthSignin' ? 'Error signing in with Google' : error);
    }
  }, [error]);

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
    if (status === 'authenticated' && session?.user) {
      console.log('Redirecting to:', callbackUrl);
      router.push(callbackUrl);
      router.refresh();
    }
  }, [status, session, router, callbackUrl]);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    console.log('Starting Google sign-in...');
    signIn('google', {
      callbackUrl,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      if (isSignUp) {
        // Handle sign up
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to sign up');
        }

        // After successful signup, sign in automatically
        await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        router.push(callbackUrl);
        router.refresh();
      } else {
        // Handle sign in
        console.log('Starting credentials sign-in for email:', email);
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        console.log('Sign-in result:', result);

        if (result?.error) {
          console.error('Sign-in error:', result.error);
          toast.error(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error);
          setIsLoading(false);
          return;
        }

        console.log('Sign-in successful, redirecting to:', callbackUrl);
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const toggleSignUp = () => {
    const newValue = !isSignUp;
    setIsSignUp(newValue);
    
    // Update URL without full page reload
    const url = new URL(window.location.href);
    if (newValue) {
      url.searchParams.set('isSignUp', 'true');
    } else {
      url.searchParams.delete('isSignUp');
    }
    window.history.pushState({}, '', url.toString());
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Logo and Design */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/90 to-primary flex-col items-center justify-center text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center"
        >
          <Building2 className="w-20 h-20 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-4">Square One Rentals</h1>
          <p className="text-lg text-white/80 max-w-md">
            Your gateway to premium rental properties in the heart of Square One, Mississauga.
          </p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent" />
      </div>

      {/* Right Panel - Sign In/Sign Up Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="bg-card p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>

              {/* Google Sign In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-6"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {isSignUp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required={isSignUp}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </span>{' '}
                <button
                  onClick={toggleSignUp}
                  className="text-primary hover:underline font-medium"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}