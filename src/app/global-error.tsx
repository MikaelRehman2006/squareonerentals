'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Critical Error</h1>
              <p className="mt-3 text-lg text-gray-600">
                Something went critically wrong with the application.
              </p>
              {error.digest && (
                <p className="mt-2 text-sm text-gray-500">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            
            <div className="mt-6">
              <Button
                onClick={() => reset()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 