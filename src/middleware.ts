import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
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
        
        return NextResponse.redirect(new URL('/access-denied', req.url));
      }
    }
    
    // Protect /submit route - requires any authenticated user
    if (req.nextUrl.pathname === '/submit' && !req.nextauth.token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
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