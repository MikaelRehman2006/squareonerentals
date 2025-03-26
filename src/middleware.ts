import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/test',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/listings',
    '/contact',
    '/about',
  ];

  // API routes that should always be accessible
  const publicApiRoutes = [
    '/api/auth/register',
    '/api/auth/login',
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith('/listings/') ||
    request.nextUrl.pathname.startsWith('/api/auth/') ||  // Allow all auth routes
    publicApiRoutes.some(apiRoute => request.nextUrl.pathname === apiRoute)
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected API routes that require authentication
  const protectedApiRoutes = [
    '/api/users',
    '/api/listings/me',
    '/api/listings/[listingId]',
    '/api/favorites',
    '/api/reports',
    '/api/notifications',
    '/api/profile',
    '/api/settings',
  ];

  // Protected page routes that require authentication
  const protectedPageRoutes = [
    '/dashboard',
    '/listings/[listingId]/edit',
    '/profile',
    '/settings',
    '/submit',
    '/notifications',
    '/favorites',
  ];

  // Check if the current route needs protection
  const needsProtection = 
    protectedPageRoutes.some(route => request.nextUrl.pathname.startsWith(route)) ||
    protectedApiRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  // If the route needs protection and there's no token, redirect to sign in
  if (needsProtection && !token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Update the matcher to include all relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|images/).*)',
  ],
};