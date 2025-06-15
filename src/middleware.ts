import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// Define security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://js.stripe.com https://static.cloudflareinsights.com https://res.cloudinary.com https://widget.cloudinary.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https: blob: https://res.cloudinary.com; " +
    "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; " +
    "connect-src 'self' https://api.cloudinary.com https://vitals.vercel-insights.com https://api.stripe.com https://*.cloudinary.com; " +
    "frame-src https://js.stripe.com https://hooks.stripe.com; " +
    "media-src 'self' https://res.cloudinary.com blob:;"
};

export default withAuth(
  function middleware(req) {
    // Apply security headers to all responses
    const response = NextResponse.next();
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    // Get the user's role from the token
    const userRole = req.nextauth.token?.role;
    const isAdmin = userRole === 'ADMIN' || userRole === 'admin';

    // Protect admin routes - only allow users with admin role
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // If no token or not an admin, redirect to access denied page
      if (!req.nextauth.token || !isAdmin) {
        console.log('Unauthorized admin access attempt:', {
          user: req.nextauth.token?.email || 'unauthenticated',
          role: userRole || 'none',
          path: req.nextUrl.pathname
        });
        
        const redirectUrl = new URL('/access-denied', req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
    
    // Protect /submit route - requires any authenticated user
    if (req.nextUrl.pathname === '/submit' && !req.nextauth.token) {
      const redirectUrl = new URL('/auth/signin', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This function determines if the user is authorized to access protected routes
        // Return true to allow access to all protected routes
        // The specific route access is handled in the middleware function above
        return !!token;
      },
    },
  }
);

// Match protected routes
export const config = {
  matcher: ['/submit', '/admin/:path*', '/api/admin/:path*']
};