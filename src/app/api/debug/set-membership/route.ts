import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// THIS IS FOR DEBUGGING ONLY - REMOVE IN PRODUCTION
// This endpoint allows setting memberships without authentication
// for testing purposes only
export async function POST(request: Request) {
  try {
    // Check if in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only for development testing' },
        { status: 403 }
      );
    }

    // Get the email from the request body
    const body = await request.json();
    const { email, type = 'BASIC', isAnnual = false } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Debug: Setting membership for email:', email);
    
    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found with email: ' + email },
        { status: 404 }
      );
    }

    console.log('Debug: User found:', { 
      id: user._id, 
      name: user.name,
      membership: user.membership ? 'Yes' : 'No'
    });

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
      isAnnual: Boolean(isAnnual),
      startDate: startDate,
      endDate: endDate,
      stripeCustomerId: 'debug_customer_' + Date.now(),
      stripeSubscriptionId: 'debug_subscription_' + Date.now(),
      status: 'active'
    };

    try {
      await user.save();
      console.log('Debug: Membership set successfully!');
    } catch (saveError) {
      console.error('Debug: Error saving user:', saveError);
      return NextResponse.json(
        { 
          error: 'Database error when saving membership', 
          details: saveError instanceof Error ? saveError.message : String(saveError) 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Debug: ${type} membership set for ${email}`,
      membership: {
        type: type,
        isAnnual: isAnnual,
        status: 'active',
        endDate: endDate
      }
    });
  } catch (error) {
    console.error('Debug: Error setting membership:', error);
    return NextResponse.json(
      { 
        error: 'Failed to set membership', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
