'use client';

import { useState, useEffect, Suspense } from 'react';
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

function SignInContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const error = searchParams?.get('error');
  
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-400 animate-gradient">
      {/* Left Panel - Branding */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-10 relative overflow-hidden min-h-[320px]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center w-full"
        >
            <Image src="/images/logo.png" alt="Square One Rentals Logo" width={100} height={100} className="mx-auto mb-4 drop-shadow-lg" priority />
          <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">Square One Rentals</h1>
          <p className="text-lg text-white/90 max-w-md text-center mb-4">Your gateway to premium rental properties in the heart of Square One, Mississauga.</p>
          {/* Optional: Lottie animation placeholder */}
          {/* <div className="w-40 h-40 mt-4"><Lottie ... /></div> */}
        </motion.div>
        <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.08) 0%, transparent 70%)'}} />
      </div>

      {/* Right Panel - Sign In/Sign Up Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 min-h-[480px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="bg-card/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-center mb-6 tracking-tight text-white">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>

              {/* Google Sign In Button */}
              <Button
                type="button"
                variant="ghost"
                className="w-full flex items-center justify-center gap-2 mb-6 bg-white text-gray-900 font-medium border border-gray-200 hover:shadow-lg hover:ring-2 hover:ring-blue-400 transition-all duration-150 py-2 rounded-lg"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300/30" />
                <span className="mx-4 text-xs text-gray-400 font-semibold tracking-widest">OR CONTINUE WITH EMAIL</span>
                <div className="flex-grow border-t border-gray-300/30" />
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                  <div>
                    <Label htmlFor="name" className="text-gray-200">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="mt-1 bg-white/10 text-white border border-gray-400/20 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg transition-all"
                      required
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mt-1 bg-white/10 text-white border border-gray-400/20 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg transition-all"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-200">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mt-1 bg-white/10 text-white border border-gray-400/20 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg transition-all"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-150 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  disabled={isLoading}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                  {isLoading && <LoadingSpinner />}
                </Button>
              </form>

              {/* Sign Up/Sign In Toggle */}
              <div className="mt-6 text-center">
                {isSignUp ? (
                  <span className="text-gray-300">Already have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleSignUp}
                      className="text-blue-500 font-semibold hover:underline transition-colors"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span className="text-gray-300">Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleSignUp}
                      className="text-blue-500 font-semibold hover:underline transition-colors"
                    >
                      Sign Up
                    </button>
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <SignInContent />
    </Suspense>
  );
}
