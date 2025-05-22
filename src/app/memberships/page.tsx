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

  const handleSubscribe = async (plan: 'Basic' | 'Featured') => {
    // Set the selected plan for UI feedback
    setSelectedPlan(plan);
    
    try {
      // Use our Stripe checkout integration
      await handleCheckout(
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
    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
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
      </motion.div>

      {/* Simple Equal-Sized Toggle Switch */}
      <motion.div 
        className="mt-12 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div 
          className="relative flex rounded-full p-1.5 bg-[#f0f0f0] shadow-inner border border-gray-200 overflow-hidden w-[280px]"
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
          
          {/* Annual Button */}
          <button
            onClick={() => setAnnualBilling(true)}
            className={cn(
              "relative z-10 px-7 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 w-[50%] text-center",
              annualBilling ? "text-gray-900 font-semibold" : "text-gray-500"
            )}
            aria-checked={annualBilling}
            role="radio"
          >
            Annual
          </button>
        </div>
      </motion.div>

      <div className="mt-16 grid gap-8 md:grid-cols-1 lg:grid-cols-2 lg:gap-12">
        {/* Basic Plan */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex h-full" /* Ensure equal height */
          whileHover={{ y: -5 }}
        >
          <Card 
            className={cn(
              "relative flex flex-col p-10 rounded-2xl border border-gray-200/30",
              "shadow-lg transition-all duration-300 hover:shadow-xl",
              "bg-gradient-to-b from-[#1E1E1E] to-[#272727] text-white h-full", // Using dark neutral background as requested
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
              <ListItem tooltip="Your listing will appear in regular search results" light>
                Standard listing visibility
              </ListItem>
              <ListItem tooltip="Your listing will be posted on our Facebook group" light>
                Facebook group post
              </ListItem>
              <ListItem tooltip="Your listing will appear in normal search results on our website" light>
                Standard website placement
              </ListItem>
              <ListItem tooltip="Upload images within the storage limit for your property" light>
                10 MB storage cap
              </ListItem>
              <ListItem tooltip="See how many views and inquiries your listing receives" light>
                Basic analytics
              </ListItem>
              <ListItem tooltip="Get support via email within 24 hours" light>
                Standard email support
              </ListItem>
              <ListItem tooltip="Your listing remains active for 30 days before needing renewal" light>
                30 day active listing period
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
          whileHover={{ y: -5 }}
        >
          <Card 
            className={cn(
              "relative flex flex-col p-10 rounded-2xl",
              "shadow-xl transition-all duration-300 hover:shadow-2xl bg-gradient-to-b from-[#F6F6F6] to-[#FAFAFA] h-full",
              "border border-primary/30",
              selectedPlan === 'Featured' ? 'ring-2 ring-primary ring-opacity-70' : ''
            )}
          >
            <div className="absolute -top-6 left-0 right-0 mx-auto w-40">
              <div className="relative">
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
              <ListItem tooltip="Your listing will appear at the top of search results and on the homepage" premium>
                Featured placement on listings page
              </ListItem>
              <ListItem tooltip="Your listing will be posted on our Facebook group" premium>
                Facebook group post
              </ListItem>
              <ListItem tooltip="Your listing will be featured in our Facebook group" premium>
                Featured Facebook promotion
              </ListItem>
              <ListItem tooltip="Your listing will be highlighted on our website" premium>
                Featured website placement
              </ListItem>
              <ListItem tooltip="Upload higher quality images with a larger storage limit" premium>
                25 MB storage cap
              </ListItem>
              <ListItem tooltip="Detailed analytics on views, inquiries, and user engagement" premium>
                Advanced analytics and reporting
              </ListItem>
              <ListItem tooltip="Get priority support with responses within 12 hours" premium>
                Priority customer support
              </ListItem>
              <ListItem tooltip="Your listing remains active for 30 days before needing renewal" premium>
                30 day active listing period
              </ListItem>
              <ListItem tooltip="Add 3D virtual tours or video walkthroughs to your listing" premium>
                Virtual tour support
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
        <div className="space-y-8">
          <FaqItem 
            question="What's included in a basic membership?"
            answer="Basic membership includes standard listing visibility, up to 8 photos per listing, and basic analytics to track views and inquiries. Your listing will remain active for 30 days."
          />
          <FaqItem 
            question="How does the featured listing work?"
            answer="Featured listings appear at the top of search results and on the homepage. They also get promoted in our Square One Rentals Facebook group which has over 5,000 members. Featured listings remain active for 45 days and include priority support."
          />
          <FaqItem 
            question="Can I cancel my subscription?"
            answer="Yes, you can cancel your subscription at any time. For monthly plans, your membership will remain active until the end of the current billing cycle."
          />
          <FaqItem 
            question="Do you offer refunds?"
            answer="We offer a 7-day money-back guarantee if you're not satisfied with your membership for any reason."
          />
          <FaqItem 
            question="How do I get started?"
            answer="Simply select the plan that best fits your needs and click the button to subscribe. If you're not already logged in, you'll be prompted to create an account or sign in. Then you can complete the payment process and start creating your listing right away."
          />
        </div>
      </motion.div>
      {/* Developer Testing Section - only shown in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 border-t pt-10 pb-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Developer Testing Tools</h2>
          <div className="max-w-lg mx-auto bg-gray-100 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Activate Free Test Membership</h3>
            <p className="text-sm text-gray-600 mb-4">
              For development and testing only. This will create a free test membership that lasts for 30 days.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/test-membership', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ type: 'BASIC' })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                      alert(`Success: ${result.message}`);
                      // Reload to reflect membership status
                      window.location.reload();
                    } else {
                      alert(`Error: ${result.error || 'Failed to activate test membership'}`);
                    }
                  } catch (error) {
                    console.error('Test membership error:', error);
                    alert('Error activating test membership. See console for details.');
                  }
                }}
                variant="outline"
                className="bg-blue-50 border-blue-200 hover:bg-blue-100"
                disabled={isCheckoutLoading}
              >
                Activate Basic (Free)
              </Button>
              
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/test-membership', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ type: 'FEATURED' })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                      alert(`Success: ${result.message}`);
                      // Reload to reflect membership status
                      window.location.reload();
                    } else {
                      alert(`Error: ${result.error || 'Failed to activate test membership'}`);
                    }
                  } catch (error) {
                    console.error('Test membership error:', error);
                    alert('Error activating test membership. See console for details.');
                  }
                }}
                variant="outline"
                className="bg-purple-50 border-purple-200 hover:bg-purple-100"
                disabled={isCheckoutLoading}
              >
                Activate Featured (Free)
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4 italic">
              This option is only available in development mode and will not appear in production.
            </p>
          </div>
        </motion.div>
      )}
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

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // On desktop, don't collapse by default
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);
  
  return (
    <motion.div 
      className={cn(
        "p-4 rounded-lg transition-all duration-300",
        "border border-transparent",
        isOpen ? "bg-white shadow-sm" : "hover:bg-white/50"
      )}
      layout
      initial={{ opacity: 0.9 }}
      whileHover={{ opacity: 1 }}
    >
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
          }
        }}
      >
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-primary md:hidden" // Only show toggle on mobile
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </motion.div>
      </div>
      
      <AnimatePresence initial={false}>
        {(isOpen || !isMobile) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <p className="mt-3 text-base text-gray-700 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
