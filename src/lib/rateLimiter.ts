import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting (would use Redis in production)
const rateLimitStore = new Map<string, { count: number, resetTime: number }>();

interface RateLimitOptions {
  limit: number;     // Maximum requests allowed in the window
  window: number;    // Time window in seconds
  identifier?: (req: NextRequest) => string; // Function to identify the client
}

/**
 * Rate limiting middleware for API routes
 */
export function rateLimit(options: RateLimitOptions) {
  const { 
    limit = 10, 
    window = 60,  // 1 minute default
    identifier = (req) => {
      // Default identifier uses IP or X-Forwarded-For header
      const ip = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
      const path = new URL(req.url).pathname;
      return `${ip}:${path}`;
    }
  } = options;

  return async function middleware(req: NextRequest) {
    const key = identifier(req);
    const now = Date.now();
    
    // Get current rate limit data for this client
    const clientData = rateLimitStore.get(key) || { count: 0, resetTime: now + (window * 1000) };
    
    // If the reset time has passed, reset the counter
    if (now > clientData.resetTime) {
      clientData.count = 0;
      clientData.resetTime = now + (window * 1000);
    }
    
    // Increment the counter
    clientData.count++;
    rateLimitStore.set(key, clientData);
    
    // Add rate limit headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', limit.toString());
    headers.set('X-RateLimit-Remaining', Math.max(0, limit - clientData.count).toString());
    headers.set('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000).toString());
    
    // If rate limit is exceeded, return a 429 Too Many Requests
    if (clientData.count > limit) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests, please try again later',
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
        }),
        { 
          status: 429, 
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString(),
            ...Object.fromEntries(headers.entries())
          }
        }
      );
    }
    
    // Continue to the API route
    return NextResponse.next({
      headers
    });
  };
}

// Predefined rate limiters for different scenarios
export const standardRateLimit = rateLimit({ limit: 60, window: 60 }); // 60 requests per minute
export const authRateLimit = rateLimit({ limit: 10, window: 60 });     // 10 requests per minute for auth
export const contactFormRateLimit = rateLimit({ limit: 5, window: 60 }); // 5 contact form submissions per minute 