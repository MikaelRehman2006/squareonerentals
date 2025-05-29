const handleSubscription = async () => {
  setIsLoading(true);
  
  try {
    // Call the API to create a checkout session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planType: plan.toUpperCase(),
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
      toast({
        title: 'Error',
        description: data.error || 'Failed to start checkout process',
        variant: 'destructive',
      });
      
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
    toast({
      title: 'Error',
      description: 'There was a problem connecting to our payment processor',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
}; 