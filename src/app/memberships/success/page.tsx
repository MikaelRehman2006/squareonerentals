'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoaded, setIsLoaded] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // If we have a session ID, verify the session and activate membership
    if (sessionId) {
      const verifySession = async () => {
        try {
          console.log('Verifying payment session:', sessionId);
          
          // Call the verify-session endpoint to validate payment and activate membership
          const response = await fetch('/api/stripe/verify-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId })
          });
          
          const result = await response.json();
          
          if (response.ok) {
            console.log('Payment verified and membership activated:', result);
            setPlan(result.membership.type === 'FEATURED' ? 'Featured' : 'Basic');
          } else {
            console.error('Failed to verify payment session:', result.error);
            alert('There was an error activating your membership. Please contact support.');
          }
        } catch (error) {
          console.error('Error verifying payment session:', error);
          alert('There was an error processing your payment. Please try again or contact support.');
        }
      };
      
      verifySession();
    }
  }, [sessionId]);
  
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
          Payment Successful!
        </h1>
        
        <motion.p 
          className="mt-5 max-w-xl mx-auto text-xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Thank you for subscribing to Square One Rentals
        </motion.p>
        
        <div className="mt-10 space-y-4">
          <p className="text-gray-700">
            Your membership is now <span className="font-semibold text-green-600">active</span>. 
            You can now create listings and use all the features of your membership.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => router.push('/listings/create')}
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
