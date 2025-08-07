import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      hasSession: !!session,
      sessionData: session ? {
        user: {
          email: session.user?.email,
          name: session.user?.name,
          image: session.user?.image
        },
        expires: session.expires
      } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json({ error: 'Failed to check session' }, { status: 500 });
  }
}
