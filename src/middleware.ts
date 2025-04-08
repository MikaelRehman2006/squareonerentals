import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Protect /submit and /admin routes
    if ((req.nextUrl.pathname === '/submit' || req.nextUrl.pathname.startsWith('/admin')) && !req.nextauth.token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only require auth for protected routes
        return true;
      },
    },
  }
);

// Match protected routes
export const config = {
  matcher: ['/submit', '/admin/:path*']
};