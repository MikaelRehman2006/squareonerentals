'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Something went wrong</h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            We're sorry, but there was an error processing your request.
          </p>
          {error.digest && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try again
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            <Link href="/">
              Return home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 