'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle2, Info, ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useStripeCheckout } from '@/utils/useStripeCheckout';
import { usePaymentProcessing } from '@/utils/usePaymentProcessing';

export default function MembershipsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [annualBilling, setAnnualBilling] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Animation for price changes
  const [priceAnimation, setPriceAnimation] = useState(false);

  useEffect(() => {
    // Set loaded state for animations
    setIsLoaded(true);
    
    // Price change animation trigger
    if (isLoaded) {
      setPriceAnimation(true);
      const timer = setTimeout(() => setPriceAnimation(false), 300);
      return () => clearTimeout(timer);
    }
  }, [annualBilling, isLoaded]);

  const { handleCheckout, isLoading: isCheckoutLoading } = useStripeCheckout();
  const { handleCheckout: handleCheckoutWithNotification, isLoading: isProcessingPayment } = usePaymentProcessing();

  const handleSubscribe = async (plan: 'Basic' | 'Featured') => {
    // Set the selected plan for UI feedback
    setSelectedPlan(plan);
    
    try {
      // Use our payment processing hook that handles notifications
      await handleCheckoutWithNotification(
        plan === 'Basic' ? 'BASIC' : 'FEATURED',
        annualBilling
      );
      // The handleCheckout function will handle the redirect to Stripe
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your payment. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Membership Plans
        </h1>
        <motion.p 
          className="mt-5 max-w-xl mx-auto text-xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Choose the right plan for your rental listing needs
        </motion.p>
        <motion.div 
          className="mt-4 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-center">
            <div className="flex items-center text-blue-800 text-sm">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>🔒 Secure payments powered by <strong>Stripe</strong> - we never see your payment details</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Simple Equal-Sized Toggle Switch */}
      <motion.div 
        className="mt-12 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div 
          className="relative flex rounded-full p-1.5 bg-[#f0f0f0] shadow-inner border border-gray-200 overflow-hidden w-[280px] transition-all duration-300 ease-in-out"
          role="radiogroup"
          aria-label="Billing frequency toggle"
        >
          {/* Simple sliding background with fixed width */}
          <div 
            className="absolute top-1.5 bottom-1.5 bg-white shadow-md rounded-full w-[135px] transition-transform duration-300 ease-in-out"
            style={{ transform: annualBilling ? 'translateX(100%)' : 'translateX(0)' }}
          />
          
          {/* Monthly Button */}
          <button
            onClick={() => setAnnualBilling(false)}
            className={cn(
              "relative z-10 px-7 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 w-[50%] text-center",
              !annualBilling ? "text-gray-900 font-semibold" : "text-gray-500"
            )}
            aria-checked={!annualBilling}
            role="radio"
          >
            Monthly
          </button>
          
          {/* Annual Button with tooltip */}
          <div className="relative group w-[50%]">
            <button
              onClick={() => setAnnualBilling(true)}
              className={cn(
                "relative z-10 px-7 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 w-full text-center",
                annualBilling ? "text-gray-900 font-semibold" : "text-gray-500"
              )}
              aria-checked={annualBilling}
              role="radio"
              type="button"
            >
              Annual
            </button>
            <span className="absolute left-1/2 -bottom-8 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none bg-gray-900 text-white text-xs rounded px-2 py-1 transition-opacity duration-300 whitespace-nowrap shadow-lg">Coming Soon</span>
          </div>
        </div>
      </motion.div>

      <div className="mt-16 flex flex-col lg:flex-row justify-center items-stretch gap-8">
        {/* Basic Plan */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex h-full" /* Ensure equal height */
          whileHover={{ scale: 1.05 }}
        >
          <Card 
            className={cn(
              "relative flex flex-col p-10 rounded-2xl border border-gray-200/30",
              "shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105",
              "bg-gradient-to-b from-[#1E1E1E] to-[#272727] text-white h-full",
              selectedPlan === 'Basic' ? 'ring-2 ring-primary ring-opacity-80' : ''
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <h3 className="text-3xl font-extrabold text-white mb-3">
                Basic Listing
                {annualBilling && (
                  <span 
                    className="ml-2 inline-flex items-center justify-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 shadow-sm"
                  >
                    Save 15%
                  </span>
                )}
              </h3>
              <p className="mt-2 text-[#E0E0E0] text-sm leading-relaxed">Perfect for individual landlords with single properties</p>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-baseline"
              animate={{ scale: priceAnimation ? 1.05 : 1 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 700 }}
              whileHover={{ scale: 1.03 }}
            >
              <span className="text-5xl font-extrabold tracking-tight text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                {annualBilling ? '$50.99' : '$4.99'}
              </span>
              <span className="ml-1 text-2xl font-medium text-[#E0E0E0]">
                {annualBilling ? '/year' : '/month'}
              </span>
            </motion.div>
            <p className="mt-1 text-xs text-[#BBBBBB]">
              CAD + applicable taxes
            </p>
            
            <div className="my-8 h-px w-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 opacity-30" />

            <ul className="mt-6 mb-8 space-y-5">
              <ListItem tooltip="Your listing will be posted on our Facebook group" light>
                Facebook listing (standard)
              </ListItem>
              <ListItem tooltip="Your listing will appear in normal search results on our website" light>
                Website listing (standard)
              </ListItem>
              <ListItem tooltip="Get support via email within 24 hours" light>
                Standard email support
              </ListItem>
              <ListItem tooltip="Your listing remains active for 30 days before needing renewal" light>
                {annualBilling ? '1 year' : '30 days'} of active visibility
              </ListItem>
              <ListItem tooltip="Upload images within the storage limit for your property" light>
                10MB storage cap
              </ListItem>
              <ListItem tooltip="Access to our network of realtors and realtor services" light>
                Access to find realtors and other realtor services
              </ListItem>
            </ul>

            <div className="mt-auto pt-4">
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-[#1E1E1E] font-semibold transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-xl" 
                size="lg" 
                onClick={() => handleSubscribe('Basic')}
              >
                <motion.span 
                  className="flex items-center justify-center"
                  whileHover={{ x: [0, 5, 0], transition: { repeat: Infinity, duration: 0.8 } }}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.span>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex h-full" /* Ensure equal height */
          whileHover={{ scale: 1.05 }}
        >
          <Card 
            className={cn(
              "relative flex flex-col p-10 rounded-2xl",
              "shadow-xl transition-all duration-300 hover:shadow-2xl bg-gradient-to-b from-[#F6F6F6] to-[#FAFAFA] h-full",
              "border border-primary/30",
              selectedPlan === 'Featured' ? 'ring-2 ring-primary ring-opacity-70' : ''
            )}
          >
            <div className="absolute -top-6 left-0 right-0 mx-auto w-40 flex justify-center lg:justify-end">
              <div className="relative animate-bounce">
                <div className="absolute inset-0 bg-primary blur-sm opacity-40 rounded-full"></div>
                <div className="relative rounded-full bg-gradient-to-r from-primary/90 to-primary py-2 px-4 text-center font-extrabold text-white shadow-lg border border-primary/20">
                  <span className="text-sm tracking-wide uppercase">POPULAR</span>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="pt-3"
            >
              <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
                Featured Listing
                {annualBilling && (
                  <span 
                    className="ml-2 inline-flex items-center justify-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 shadow-sm"
                  >
                    Save 15%
                  </span>
                )}
              </h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">Ideal for property owners wanting maximum exposure</p>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-baseline"
              animate={{ scale: priceAnimation ? 1.05 : 1 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 700 }}
              whileHover={{ scale: 1.03 }}
            >
              <span className="text-5xl font-extrabold tracking-tight text-gray-900" style={{ textShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                {annualBilling ? '$71.99' : '$6.99'}
              </span>
              <span className="ml-1 text-2xl font-medium text-gray-700">
                {annualBilling ? '/year' : '/month'}
              </span>
              {annualBilling && (
                <motion.div 
                  className="ml-3 -mt-1 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  BEST VALUE
                </motion.div>
              )}
            </motion.div>
            <p className="mt-1 text-xs text-gray-500">
              CAD + applicable taxes
            </p>

            <div className="my-8 h-px w-full bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5" />

            <ul className="mt-6 mb-8 space-y-5">
              <ListItem tooltip="Your listing will be featured in our Facebook group" premium>
                Facebook listing (featured)
              </ListItem>
              <ListItem tooltip="Your listing will be highlighted on our website" premium>
                Website listing (featured)
              </ListItem>
              <ListItem tooltip="Get priority support with responses within 12 hours" premium>
                Priority email support
              </ListItem>
              <ListItem tooltip="Your listing remains active for the entire period before needing renewal" premium>
                {annualBilling ? '1 year' : '30 days'} of active visibility
              </ListItem>
              <ListItem tooltip="Upload higher quality images with a larger storage limit" premium>
                25MB storage cap
              </ListItem>
              <ListItem tooltip="Access to extended realtor services and promotion" premium>
                Access to more realtor services
              </ListItem>
            </ul>

            <div className="mt-auto pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-xl" 
                size="lg"
                onClick={() => handleSubscribe('Featured')}
              >
                <motion.span 
                  className="flex items-center justify-center"
                  whileHover={{ x: [0, 5, 0], transition: { repeat: Infinity, duration: 0.8 } }}
                >
                  Get Featured
                  <Sparkles className="ml-2 h-4 w-4" />
                </motion.span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        className="mt-16 bg-gray-50 p-8 rounded-2xl shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            {
              question: "What's included in a Basic Membership?",
              answer: "Basic membership includes Facebook listing (standard), website listing (standard), standard email support, 30 days of active visibility (or 1 year for annual plans), 10MB storage cap, and access to find realtors and other realtor services.",
            },
            {
              question: "What's included in a Featured Membership?",
              answer: "Featured membership includes Facebook listing (featured), website listing (featured), priority email support, 30 days of active visibility (or 1 year for annual plans), 25MB storage cap, and access to more realtor services (in addition to basic).",
            },
            {
              question: "How do subscriptions work?",
              answer: "Subscriptions auto-renew at the end of your billing period (monthly or annually) until canceled. You can manage your subscription at any time through your dashboard.",
            },
            {
              question: "Can I cancel my membership?",
              answer: "Yes, you can cancel your membership at any time from your dashboard by navigating to Subscription and clicking 'Manage Subscription'. This will take you to the Stripe portal where you can cancel your subscription. Your access will continue until the end of your billing period.",
            },
            {
              question: "What happens when I cancel?",
              answer: "When you cancel, your subscription remains active until the end of your current billing period. After that, your account reverts to a free account and your listings will no longer be visible to others.",
            },
            {
              question: "Are there refunds if I cancel early?",
              answer: "We do not offer prorated refunds for partial months or years. Your subscription remains active until the end of your billing period even after cancellation.",
            },
            {
              question: "How do I get started?",
              answer: "Choose the plan that fits your needs and click the 'Get Started' button. After completing the payment process, you can immediately start posting listings with your new membership benefits.",
            },
            {
              question: "Is my payment information secure?",
              answer: "Yes! We use Stripe, the world's most trusted payment platform, to process all payments. We never collect or store your payment information directly - Stripe handles all payment details securely with bank-level encryption and PCI compliance.",
            },
          ].map((item, idx) => (
            <AccordionItem key={item.question} question={item.question} answer={item.answer} defaultOpen={idx === 0} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ListItem({ children, tooltip, light, premium }: { children: React.ReactNode; tooltip?: string; light?: boolean; premium?: boolean }) {
  return (
    <motion.li 
      className={cn(
        "flex items-start group transition-all duration-200",
        "hover:translate-x-1",
        light ? "text-white" : premium ? "text-gray-800" : "text-gray-800"
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <div className={cn("flex-shrink-0 mt-0.5")}>
        <CheckCircle2 
          className={cn(
            "h-5 w-5",
            light ? "text-green-400" : premium ? "text-primary" : "text-green-600"
          )} 
        />
      </div>
      {tooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="flex items-center focus:outline-none">
                <span className={cn(
                  "ml-3 text-sm font-medium",
                  light ? "text-[#E0E0E0] group-hover:text-white" : 
                  premium ? "text-gray-800 group-hover:text-gray-900" : 
                  "text-gray-800 group-hover:text-gray-900"
                )}>
                  {children}
                </span>
                <Info className={cn(
                  "ml-1.5 h-3.5 w-3.5",
                  light ? "text-gray-400 group-hover:text-gray-300" : 
                  "text-gray-400 group-hover:text-gray-600"
                )} />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top"
              align="center"
              className="bg-gray-900 text-white p-3 text-xs max-w-xs z-50 shadow-xl rounded-md"
              sideOffset={5}
            >
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {tooltip}
              </motion.div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <p className={cn(
          "ml-3 text-sm font-medium",
          light ? "text-[#E0E0E0] group-hover:text-white" : 
          premium ? "text-gray-800 group-hover:text-gray-900" : 
          "text-gray-800 group-hover:text-gray-900"
        )}>
          {children}
        </p>
      )}
    </motion.li>
  );
}

type AccordionItemProps = { question: string; answer: string; defaultOpen?: boolean };

function AccordionItem(props: AccordionItemProps) {
  const { question, answer, defaultOpen = false } = props;
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <button
        className="w-full flex items-center justify-between px-4 py-4 text-left focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium text-gray-900 text-base">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className={`px-4 pb-4 text-gray-700 text-sm transition-all duration-300 ${open ? 'block' : 'hidden'}`}>{answer}</div>
    </div>
  );
}
