import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// This is a simplified endpoint for activating test memberships
// Use this only for development testing after Stripe payments
export async function POST(request: Request) {
  try {
    // Check if in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only for development testing' },
        { status: 403 }
      );
    }

    // Get authentication session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Parse request for membership type
    const body = await request.json();
    const { type = 'BASIC', isAnnual = false } = body;

    console.log('Activating test membership:', { type, isAnnual, userEmail: user.email });

    // Set membership dates
    const startDate = new Date();
    const endDate = new Date();
    
    if (isAnnual) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Create test membership
    user.membership = {
      type: type === 'FEATURED' ? 'FEATURED' : 'BASIC',
      isAnnual: isAnnual,
      startDate: startDate,
      endDate: endDate,
      stripeCustomerId: 'test_customer_' + Date.now(),
      stripeSubscriptionId: 'test_subscription_' + Date.now(),
      status: 'active'
    };

    await user.save();
    console.log('Test membership activated successfully');

    return NextResponse.json({
      success: true,
      message: `Test ${type} membership activated successfully`,
      membership: {
        type: type,
        isAnnual: isAnnual,
        status: 'active',
        endDate: endDate
      }
    });
  } catch (error) {
    console.error('Error activating test membership:', error);
    return NextResponse.json(
      { error: 'Failed to activate test membership' },
      { status: 500 }
    );
  }
}
