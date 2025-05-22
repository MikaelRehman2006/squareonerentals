// Client-side actions for membership pages
'use client';

import { toast } from 'sonner';

/**
 * Initiate a checkout session with Stripe
 */
export async function initiateCheckout(planType: string, isAnnual: boolean) {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planType, isAnnual }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    // Store the session ID in localStorage before redirecting
    if (data.sessionId) {
      localStorage.setItem('stripe_session_id', data.sessionId);
    }

    // Redirect to Stripe Checkout
    window.location.href = data.url;
  } catch (error) {
    console.error('Error initiating checkout:', error);
    toast.error('Failed to initiate checkout. Please try again.');
  }
}
