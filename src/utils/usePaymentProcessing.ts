'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function usePaymentProcessing() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (planType: string, isAnnual: boolean) => {
    setIsLoading(true);
    
    try {
      // Call the API to create a checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: planType,
          isAnnual: isAnnual,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        // Store session ID in localStorage before redirecting
        if (data.sessionId) {
          localStorage.setItem('stripe_session_id', data.sessionId);
        }
        
        // Redirect to the Stripe Checkout page
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
        toast.error(data.error || 'Failed to start checkout process');
        
        // Show payment error notification
        try {
          await fetch('/api/stripe/payment-error', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              errorCode: 'checkout_creation_failed',
              errorMessage: data.error || 'Failed to start checkout process' 
            })
          });
        } catch (notificationError) {
          console.error('Failed to send error notification:', notificationError);
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('There was a problem connecting to our payment processor');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentFailure = async (errorCode: string, errorMessage: string) => {
    try {
      await fetch('/api/stripe/payment-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ errorCode, errorMessage })
      });
    } catch (error) {
      console.error('Failed to send payment error notification:', error);
    }
  };

  return {
    isLoading,
    handleCheckout,
    handlePaymentFailure
  };
} 