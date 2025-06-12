/**
 * Secure environment variable management
 * This file centralizes all environment variable access and provides validation
 */

// Required environment variables for the application
const REQUIRED_ENV_VARS = [
  'NEXTAUTH_SECRET',
  'MONGODB_URI',
  'EMAIL_API_KEY',
  'STRIPE_SECRET_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY'
];

// Database configuration
export const DB_CONFIG = {
  uri: process.env.MONGODB_URI || '',
  isConfigured: !!process.env.MONGODB_URI
};

// Authentication configuration
export const AUTH_CONFIG = {
  secret: process.env.NEXTAUTH_SECRET || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  isGoogleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  isSecretConfigured: !!process.env.NEXTAUTH_SECRET
};

// Stripe configuration
export const STRIPE_CONFIG = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  isConfigured: !!process.env.STRIPE_SECRET_KEY
};

// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  isConfigured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)
};

// Email configuration
export const EMAIL_CONFIG = {
  apiKey: process.env.EMAIL_API_KEY || '',
  fromEmail: process.env.EMAIL_FROM || 'squareone.rental@gmail.com',
  contactEmail: process.env.CONTACT_EMAIL || 'squareone.rental@gmail.com',
  isConfigured: !!process.env.EMAIL_API_KEY
};

// Facebook integration
export const FACEBOOK_CONFIG = {
  accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
  pageId: process.env.FACEBOOK_PAGE_ID || '',
  groupId: process.env.FACEBOOK_GROUP_ID || '',
  isConfigured: !!(process.env.FACEBOOK_ACCESS_TOKEN && (process.env.FACEBOOK_PAGE_ID || process.env.FACEBOOK_GROUP_ID)),
  autoPost: process.env.FACEBOOK_AUTO_POST === 'true'
};

// Application URLs
export const APP_URLS = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
};

/**
 * Validate required environment variables
 * @returns Array of missing environment variables
 */
export function validateEnvVars(): string[] {
  const missing: string[] = [];
  
  REQUIRED_ENV_VARS.forEach(envVar => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });
  
  return missing;
}

/**
 * Log environment configuration status
 * Safe to use during startup - doesn't log sensitive values
 */
export function logEnvStatus(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment configuration status:');
    console.log('- Database:', DB_CONFIG.isConfigured ? 'Configured ✅' : 'Missing ❌');
    console.log('- Auth Secret:', AUTH_CONFIG.isSecretConfigured ? 'Configured ✅' : 'Missing ❌');
    console.log('- Google Auth:', AUTH_CONFIG.isGoogleConfigured ? 'Configured ✅' : 'Missing ❌');
    console.log('- Stripe:', STRIPE_CONFIG.isConfigured ? 'Configured ✅' : 'Missing ❌');
    console.log('- Cloudinary:', CLOUDINARY_CONFIG.isConfigured ? 'Configured ✅' : 'Missing ❌');
    console.log('- Email:', EMAIL_CONFIG.isConfigured ? 'Configured ✅' : 'Missing ❌');
    console.log('- Facebook:', FACEBOOK_CONFIG.isConfigured ? 'Configured ✅' : 'Missing ❌');
    
    const missing = validateEnvVars();
    if (missing.length > 0) {
      console.warn('⚠️ Missing required environment variables:', missing.join(', '));
      console.warn('Some functionality may be limited or unavailable');
    }
  }
} 