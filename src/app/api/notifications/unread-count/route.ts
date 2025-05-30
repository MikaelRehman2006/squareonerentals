import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUnreadCount } from '@/lib/notification';

// Add dynamic export to prevent static rendering issues
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }
    
    const userId = session.user.id;
    
    // Add additional error handling
    if (!userId) {
      console.error('User ID is missing in session');
      return NextResponse.json({ count: 0 }, { status: 200 });
    }
    
    const count = await getUnreadCount(userId);
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    // Return 0 count instead of an error to prevent UI issues
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
} 