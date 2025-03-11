import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/listings',
    '/contact',
    '/about',
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith('/listings/')
  );

  // Protected API routes that require authentication
  const protectedApiRoutes = [
    '/api/users',
    '/api/listings/create',
    '/api/listings/update',
    '/api/listings/delete',
    '/api/favorites',
    '/api/reports',
    '/api/notifications',
    '/api/profile',
    '/api/settings',
  ].map(route => request.nextUrl.origin + route);

  // Protected page routes that require authentication
  const protectedPageRoutes = [
    '/dashboard',
    '/dashboard/edit',
    '/profile',
    '/settings',
    '/submit',
    '/notifications',
    '/favorites',
  ];

  // Check if the current route is protected
  const isProtectedRoute = protectedPageRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for protected API routes
  if (protectedApiRoutes.some(route => request.url.startsWith(route))) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // Check for protected page routes
  if (isProtectedRoute) {
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/profile/:path*',
    '/messages/:path*',
    '/notifications/:path*',
    '/favorites/:path*',
    '/dashboard/:path*',
  ],
}; 