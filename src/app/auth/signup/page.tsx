'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState<'details' | 'verification'>('details');
  const [emailValid, setEmailValid] = useState(false);

  // Auto-send verification code when email is valid and user moves to verification step
  useEffect(() => {
    if (step === 'verification' && emailValid && !codeSent) {
      handleSendVerificationCode();
    }
  }, [step, emailValid, codeSent]);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Validate email format
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  const handleSendVerificationCode = async () => {
    if (!emailValid) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSendingCode(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setCodeSent(true);
        setCountdown(30); // 30-second rate limit
        toast.success('Verification code sent to your email!');
        console.log('Code sent successfully');
      } else {
        if (res.status === 429) {
          setCountdown(data.remainingTime || 30);
          toast.error(data.error || 'Please wait before requesting another code');
        } else {
          toast.error(data.error || 'Failed to send verification code');
        }
        console.log('Failed to send code:', data.error);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error('An error occurred while sending verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleNextStep = () => {
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!emailValid) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    setStep('verification');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          verificationCode,
        }),
      });

      if (res.ok) {
        toast.success('Account created successfully!');
        router.push('/auth/signin');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', {
        callbackUrl: '/',
        redirect: true
      });
    } catch (error) {
      toast.error('An error occurred during Google sign-in');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Join Square One Rentals to find your perfect rental
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10">
          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-3 h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>

          {step === 'details' ? (
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter your email address"
                    disabled={isLoading}
                  />
                  {email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {email && !emailValid && (
                  <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Create a password"
                    disabled={isLoading}
                  />
                </div>
                {password && password.length < 8 && (
                  <p className="mt-1 text-sm text-red-600">Password must be at least 8 characters</p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleNextStep}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                disabled={isLoading || !name.trim() || !emailValid || password.length < 8}
              >
                Continue
              </Button>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
                <p className="text-gray-600 mb-4">
                  We've sent a verification code to <strong>{email}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-center text-lg font-mono"
                    disabled={isLoading}
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Code expires in 15 minutes
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('details')}
                  className="flex-1 h-12"
                  disabled={isLoading}
                >
                  Back
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendVerificationCode}
                  disabled={isSendingCode || countdown > 0 || isLoading}
                  className="flex-1 h-12"
                >
                  {isSendingCode ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      {countdown}s
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Resend
                    </>
                  )}
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                disabled={isLoading || !verificationCode || verificationCode.length !== 6}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}