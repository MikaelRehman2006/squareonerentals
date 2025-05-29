'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function PaymentErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Get error details from URL params
    const errorCode = searchParams?.get('code') || 'unknown';
    const errorMessage = searchParams?.get('message') || 'An unknown error occurred';
    
    // Send error notification to the user via API
    const sendErrorNotification = async () => {
      try {
        await fetch('/api/stripe/payment-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            errorCode,
            errorMessage 
          })
        });
      } catch (error) {
        console.error('Failed to send payment error notification:', error);
      }
    };
    
    sendErrorNotification();
  }, [searchParams]);
  
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        >
          <AlertTriangle className="w-14 h-14 text-red-600" />
        </motion.div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Payment Failed
        </h1>
        
        <motion.p 
          className="mt-5 max-w-xl mx-auto text-xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          There was an issue processing your payment
        </motion.p>
        
        <p className="mt-3 text-gray-700">
          Your payment could not be processed. This might be due to insufficient funds, an expired card, or other payment issues.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => router.push('/memberships')}
            className="bg-primary hover:bg-primary/90"
          >
            Try Again
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            onClick={() => router.push('/')}
          >
            Return to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 