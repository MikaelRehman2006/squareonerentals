'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Add dynamic export to prevent prerendering issues
export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setIsLoaded(true);

    // Get the sessionId from localStorage that we'll set during checkout
    const sessionId = localStorage.getItem('stripe_session_id');
    
    if (sessionId) {
      const confirmPayment = async () => {
        try {
          // Call our new API endpoint to confirm the payment and update membership
          const response = await fetch('/api/stripe/confirm-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId })
          });
          
          const result = await response.json();
          
          if (response.ok) {
            console.log('Payment confirmed:', result);
            setPlan(result.membership?.type === 'FEATURED' ? 'Featured' : 'Basic');
            // Clear the session ID from localStorage
            localStorage.removeItem('stripe_session_id');
            
            // Display a success message
            toast.success(
              `${result.membership?.type === 'FEATURED' ? 'Featured' : 'Basic'} membership activated successfully!`,
              { duration: 5000 }
            );
          } else {
            console.error('Failed to confirm payment:', result.error);
            setError('There was an error activating your membership. Please contact support.');
          }
        } catch (error) {
          console.error('Error confirming payment:', error);
          setError('There was an error processing your payment. Please try again or contact support.');
        }
      };
      
      confirmPayment();
    } else {
      // If there's no session ID, they might have refreshed the page
      // or accessed it directly - show a generic success message
      console.log('No session ID found in localStorage');
    }
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        >
          <CheckCircle className="w-14 h-14 text-green-600" />
        </motion.div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          {error ? 'Something Went Wrong' : 'Payment Successful!'}
        </h1>
        
        <motion.p 
          className="mt-5 max-w-xl mx-auto text-xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {error ? error : `Thank you for subscribing to Square One Rentals${plan ? ` - ${plan} Plan` : ''}`}
        </motion.p>
        
        <div className="mt-10 space-y-4">
          {!error && (
            <p className="text-gray-700">
              Your membership is now <span className="font-semibold text-green-600">active</span>. 
              You can now create listings and use all the features of your membership.
            </p>
          )}
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => router.push('/submit')}
              className="bg-primary hover:bg-primary/90"
            >
              Create a New Listing
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
