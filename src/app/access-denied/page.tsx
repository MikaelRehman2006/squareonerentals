'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-xl flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldAlert className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-red-700">Access Denied</CardTitle>
          <CardDescription className="text-center text-red-600">
            You don't have permission to access this area
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-2">
          <p className="text-gray-700">
            This area is restricted to administrators only. If you believe you should have access,
            please contact the site administrator.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
