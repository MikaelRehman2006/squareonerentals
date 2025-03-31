import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const isAdmin = (email: string | null | undefined) => {
  const adminEmails = ['volcanxic@gmail.com', 'mikaelr112@gmail.com'];
  return email ? adminEmails.includes(email.toLowerCase()) : false;
};

export default withAuth(
  function middleware(req) {
    // Check if it's an admin route
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!isAdmin(req.nextauth.token?.email)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Only protect /submit route
    if (req.nextUrl.pathname === '/submit' && !req.nextauth.token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only require auth for /submit and /admin routes
        return true;
      },
    },
  }
);

// Match both /submit and /admin routes
export const config = {
  matcher: ['/submit', '/admin/:path*']
};