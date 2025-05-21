import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// This API route is ONLY for development testing
// It should be disabled or removed in production
export async function POST(request: Request) {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse body to get membership type
    const body = await request.json();
    const { type = 'BASIC' } = body; // Default to BASIC if not specified
    
    // Connect to database
    await connectDB();
    
    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Set test membership - valid for 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    // Update user with test membership matching the User schema structure
    user.membership = {
      type: type, // 'BASIC' or 'FEATURED'
      isAnnual: false,
      startDate: new Date(),
      endDate: thirtyDaysFromNow,
      stripeCustomerId: 'test_customer_' + Date.now(),
      stripeSubscriptionId: 'test_subscription_' + Date.now(),
      status: 'active'
    };
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: `Test ${type} membership activated for 30 days`,
      membership: user.membership
    });
  } catch (error) {
    console.error('Error activating test membership:', error);
    return NextResponse.json(
      { error: 'Failed to activate test membership' },
      { status: 500 }
    );
  }
}
