import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, getPriceId, PLANS } from '@/utils/stripe';

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to subscribe' },
        { status: 401 }
      );
    }

    // Get user details from session
    const { email, name } = session.user;
    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const { planType, isAnnual } = body;

    // Validate plan type
    if (!planType || !['BASIC', 'FEATURED'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Get the price ID for the selected plan and billing interval
    const priceId = getPriceId(planType as keyof typeof PLANS, isAnnual);
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not found for the selected plan' },
        { status: 400 }
      );
    }

    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: email || undefined,
      client_reference_id: userId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planType,
        isAnnual: isAnnual ? 'true' : 'false',
      },
      subscription_data: {
        metadata: {
          userId,
          planType,
          isAnnual: isAnnual ? 'true' : 'false',
        },
      },
      // Use NEXTAUTH_URL to ensure port consistency between auth and redirects
      success_url: `${process.env.NEXTAUTH_URL}/memberships/success?session_id={CHECKOUT_SESSION_ID}&plan_type=${planType}&is_annual=${isAnnual ? 'true' : 'false'}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/memberships`,
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
