import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Membership } from '@/models/Membership';
import { stripe } from '@/utils/stripe';
import { logActivity } from '@/lib/activity';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the session ID from the request body
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Verify the session was successful
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Extract metadata from the session
    const userId = checkoutSession.metadata?.userId || session.user.id;
    const planType = checkoutSession.metadata?.planType || 'BASIC';
    const isAnnual = checkoutSession.metadata?.isAnnual === 'true';

    // Update or create the user's membership
    const membership = await Membership.findOneAndUpdate(
      { userId },
      {
        userId,
        type: planType,
        isAnnual,
        stripeSubscriptionId: checkoutSession.subscription as string,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: isAnnual 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) 
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    // Update user role if needed
    await User.findByIdAndUpdate(userId, { 
      hasMembership: true 
    });

    // Log the activity
    await logActivity({
      userId,
      action: 'MEMBERSHIP_PURCHASED',
      details: `${planType} plan (${isAnnual ? 'annual' : 'monthly'})`,
      metadata: {
        membershipId: membership._id.toString(),
        planType,
        isAnnual,
      },
    });

    return NextResponse.json({ 
      success: true, 
      membership,
      redirectUrl: '/dashboard'
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
