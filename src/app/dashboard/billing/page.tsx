'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      redirectToStripePortal();
    }
  }, [status, router]);

  // Redirect to Stripe Customer Portal
  const redirectToStripePortal = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/billing', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe Billing Portal
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create billing portal session');
      }
    } catch (error) {
      console.error('Error redirecting to billing portal:', error);
      toast.error('Failed to access billing portal. Please try again later.');
      // Redirect back to subscription page after a short delay
      setTimeout(() => {
        router.push('/dashboard/subscription');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-semibold mb-2">Redirecting to Billing Portal</h2>
      <p className="text-gray-600 text-center max-w-md">
        Please wait while we redirect you to the secure billing management portal...
      </p>
    </div>
  );
} 