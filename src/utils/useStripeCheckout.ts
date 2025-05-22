import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

// Load Stripe outside of component render to avoid
// recreating the Stripe object on every render
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null; // Will be null if API key is not set

export function useStripeCheckout() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async (planType: 'BASIC' | 'FEATURED', isAnnual: boolean) => {
    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to subscribe to a plan',
        variant: 'destructive',
      });
      return;
    }

    // Check if Stripe is configured
    if (!stripePromise || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      toast({
        title: 'Configuration required',
        description: 'Stripe is not properly configured. Please set up your Stripe account and API keys.',
        variant: 'destructive',
      });
      
      // For development, show a helpful console message
      console.error(
        'Missing Stripe configuration. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file.'
      );
      
      return;
    }

    setIsLoading(true);

    try {
      // Create a checkout session via the API
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType, isAnnual }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API error: ' + response.status);
      }

      const { url, sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Store the session ID in localStorage before redirecting
      if (sessionId) {
        localStorage.setItem('stripe_session_id', sessionId);
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
        return;
      }

      throw new Error('No checkout URL returned');
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Checkout error',
        description: error.message || 'Failed to create checkout session',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleCheckout, isLoading };
}
