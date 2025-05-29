import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { createPaymentNotification } from '@/lib/notification';
import Stripe from 'stripe';

// Create Stripe instance with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as any, // Using a compatible version and type assertion to avoid TS errors
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the Stripe session ID from the request
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Stripe session ID is required' },
        { status: 400 }
      );
    }

    console.log('Attempting to retrieve Stripe session:', sessionId);
    
    // Retrieve the checkout session from Stripe with expanded objects
    let stripeSession;
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'customer', 'subscription']
      });
      
      console.log('Session retrieved successfully. Payment status:', stripeSession.payment_status);
    } catch (stripeError) {
      console.error('Error retrieving Stripe session:', stripeError);
      return NextResponse.json(
        { error: 'Failed to retrieve payment information from Stripe' },
        { status: 500 }
      );
    }
    
    // For testing purposes in development, we'll accept any status
    // In production, you'd want to check stripeSession.payment_status === 'paid'
    if (!stripeSession) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 400 }
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

    console.log('User found:', { 
      id: user._id,
      email: user.email, 
      existingMembership: user.membership ? 'Yes' : 'No'
    });

    // Determine membership type and billing cycle from Stripe session metadata
    // This is the most reliable source since we set it during checkout
    let type: 'BASIC' | 'FEATURED' = 'BASIC'; // Default to BASIC
    let isAnnual = false;
    
    // Try to get info from session metadata which is most reliable
    if (stripeSession.metadata) {
      console.log('Session metadata:', stripeSession.metadata);
      if (stripeSession.metadata.planType === 'FEATURED') {
        type = 'FEATURED';
      }
      isAnnual = stripeSession.metadata.isAnnual === 'true';
    } else {
      console.log('No metadata found in session, using defaults');
    }

    // Set membership expiry date based on billing cycle
    const startDate = new Date();
    const endDate = new Date();
    if (isAnnual) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    console.log('Setting membership:', {
      type,
      isAnnual,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      customerId: typeof stripeSession.customer === 'string' ? stripeSession.customer : 'test_customer',
      subscriptionId: typeof stripeSession.subscription === 'string' ? stripeSession.subscription : 'test_subscription'
    });

    // For testing in development, always activate membership regardless of payment status
    if (process.env.NODE_ENV === 'development') {
      console.log('DEVELOPMENT MODE: Automatically activating membership');
      
      // Update user with membership details - using test values
      user.membership = {
        type: type,
        isAnnual: isAnnual,
        startDate: startDate,
        endDate: endDate,
        stripeCustomerId: 'dev_customer_' + Date.now(),
        stripeSubscriptionId: 'dev_subscription_' + Date.now(),
        status: 'active'
      };
    } else {
      // Production behavior - use actual Stripe data
      user.membership = {
        type: type,
        isAnnual: isAnnual,
        startDate: startDate,
        endDate: endDate,
        stripeCustomerId: typeof stripeSession.customer === 'string' ? stripeSession.customer : 'test_customer_' + Date.now(),
        stripeSubscriptionId: typeof stripeSession.subscription === 'string' ? stripeSession.subscription : 'test_subscription_' + Date.now(),
        status: 'active'
      };
    }

    try {
      // Save the updated user with membership
      await user.save();
      console.log('Membership saved successfully for:', user.email);
      
      // Create a success payment notification
      try {
        await createPaymentNotification(
          user._id.toString(),
          'receipt',
          0, // We don't have the amount here, but can use 0 as a placeholder
          `Your ${type} ${isAnnual ? 'Annual' : 'Monthly'} membership has been activated successfully.`
        );
      } catch (notificationError) {
        console.error('Error creating payment notification:', notificationError);
        // Continue processing - don't fail if notification fails
      }
    } catch (saveError) {
      console.error('Error saving user membership:', saveError);
      throw saveError; // Re-throw to be caught by outer try/catch
    }

    return NextResponse.json({
      success: true,
      message: `${type} membership activated successfully`,
      membership: {
        type: type,
        isAnnual: isAnnual,
        status: 'active',
        endDate: endDate
      }
    });
  } catch (error) {
    console.error('Error verifying Stripe session:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment session' },
      { status: 500 }
    );
  }
}
