import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { stripe } from '@/utils/stripe';
import { createPaymentNotification } from '@/lib/notification';

export async function POST(request: NextRequest) {
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

    // Find the user and get their subscription details
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the user has an active subscription
    if (!user.membership || !user.membership.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Cancel the subscription in Stripe
    try {
      await stripe.subscriptions.update(
        user.membership.stripeSubscriptionId,
        { cancel_at_period_end: true }
      );

      // Update the user's membership status in the database
      user.membership.status = 'canceled';
      await user.save();
      
      // Create a notification for the user
      await createPaymentNotification(
        user._id.toString(),
        'receipt', // Using receipt type for informational notifications
        0, // No amount involved
        'Your subscription has been canceled. You will continue to have access until the end of your current billing period.'
      );

      return NextResponse.json({
        success: true,
        message: 'Subscription canceled successfully'
      });
    } catch (stripeError) {
      console.error('Error canceling subscription in Stripe:', stripeError);
      return NextResponse.json(
        { error: 'Failed to cancel subscription with payment provider' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
} 