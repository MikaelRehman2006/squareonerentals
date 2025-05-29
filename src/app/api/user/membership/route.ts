import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// Specify runtime configuration to fix deployment errors
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the user and get their membership details
    const user = await User.findOne({ email: session.user.email }).lean();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return membership details (which might be null if the user doesn't have one)
    return NextResponse.json({ 
      membership: user.membership || null 
    });
  } catch (error) {
    console.error('Error fetching membership details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch membership details' },
      { status: 500 }
    );
  }
} 