import Stripe from 'stripe';
import { STRIPE_CONFIG } from '@/lib/envConfig';

export const PLANS = {
  BASIC: {
    name: 'Basic Listing',
    id: process.env.STRIPE_BASIC_PLAN_ID || '',
    price: {
      monthly: {
        amount: 499, // $4.99 in cents
        id: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID || ''
      },
      annual: {
        amount: 5099, // $50.99 in cents
        id: process.env.STRIPE_BASIC_ANNUAL_PRICE_ID || ''
      }
    },
    features: [
      'Standard listing visibility',
      'Facebook group post',
      'Standard website placement',
      '10 MB storage cap',
      'Basic analytics',
      'Standard email support',
      '30 day active listing period'
    ]
  },
  FEATURED: {
    name: 'Featured Listing',
    id: process.env.STRIPE_FEATURED_PLAN_ID || '',
    price: {
      monthly: {
        amount: 699, // $6.99 in cents
        id: process.env.STRIPE_FEATURED_MONTHLY_PRICE_ID || ''
      },
      annual: {
        amount: 7199, // $71.99 in cents
        id: process.env.STRIPE_FEATURED_ANNUAL_PRICE_ID || ''
      }
    },
    features: [
      'Featured placement on listings page',
      'Facebook group post',
      'Featured Facebook promotion',
      'Featured website placement',
      '25 MB storage cap',
      'Advanced analytics and reporting',
      'Priority customer support',
      '30 day active listing period',
      'Virtual tour support'
    ]
  }
};

// Initialize Stripe
if (!STRIPE_CONFIG.isConfigured) {
  console.warn('Missing Stripe configuration');
}

// Create a conditional initialization to handle build time
const createStripeClient = () => {
  // During build or when no API key is available, return a mock client
  if (!STRIPE_CONFIG.isConfigured || process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'preview') {
    // Return a mock object that won't throw during build
    return {
      checkout: {
        sessions: {
          create: async () => ({ url: '#' }),
          retrieve: async () => ({}),
        }
      },
      customers: {
        create: async () => ({}),
        retrieve: async () => ({}),
      },
      subscriptions: {
        retrieve: async () => ({}),
        update: async () => ({}),
        cancel: async () => ({}),
      },
      products: {
        list: async () => ({ data: [] }),
      },
      prices: {
        list: async () => ({ data: [] }),
      },
      webhooks: {
        constructEvent: () => ({ type: 'test', data: { object: {} } }),
      }
    } as unknown as Stripe;
  }
  
  // In production with proper API key, use the real Stripe client
  return new Stripe(STRIPE_CONFIG.secretKey, {
    apiVersion: '2025-04-30.basil',
    typescript: true,
  });
};

export const stripe = createStripeClient();

// Helper function to get price ID based on plan and billing interval
export const getPriceId = (plan: keyof typeof PLANS, isAnnual: boolean) => {
  return isAnnual 
    ? PLANS[plan].price.annual.id
    : PLANS[plan].price.monthly.id;
};

// Helper to format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount / 100);
};
