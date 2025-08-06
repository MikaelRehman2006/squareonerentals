import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const isAdmin = (email: string | null | undefined) => {
  const adminEmails = ['volcanxic@gmail.com', 'mikaelr112@gmail.com', 'squareone.rental@gmail.com'];
  return email ? adminEmails.includes(email.toLowerCase()) : false;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      status: 'success',
      data: {
        session,
        isAuthenticated: !!session,
        userEmail: session?.user?.email,
        isAdmin: isAdmin(session?.user?.email),
        adminEmails: ['volcanxic@gmail.com', 'mikaelr112@gmail.com'],
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
