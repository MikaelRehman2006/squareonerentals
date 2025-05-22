import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Helper function to verify if a user is an admin in API routes
 * This adds a second layer of security beyond middleware
 */
export async function verifyAdminAccess() {
  try {
    // Get server session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Unauthorized access' },
          { status: 401 }
        )
      };
    }
    
    // Get user role
    const userRole = session.user.role;
    
    // Check if user is an admin (using uppercase to match TypeScript types)
    if (userRole !== 'ADMIN') {
      console.warn('Admin access denied:', {
        user: session.user.email,
        role: userRole,
        timestamp: new Date().toISOString()
      });
      
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Admin privileges required' },
          { status: 403 }
        )
      };
    }
    
    // User is authorized
    return {
      authorized: true,
      session
    };
  } catch (error) {
    console.error('Error verifying admin access:', error);
    
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Internal server error during authorization' },
        { status: 500 }
      )
    };
  }
}

/**
 * Helper function to hide admin components and links in UI
 * @param role The user's role
 */
export function isAdmin(role?: string): boolean {
  if (!role) return false;
  
  // Support both uppercase and lowercase 'admin'
  return role.toLowerCase() === 'admin';
}
