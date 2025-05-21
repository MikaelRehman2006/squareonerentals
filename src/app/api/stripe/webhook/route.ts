import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/utils/stripe';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get('stripe-signature');

  if (!sig || !endpointSecret) {
    return NextResponse.json(
      { error: 'Missing signature or endpoint secret' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook event: ${error}`);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const { metadata, client_reference_id: userId, subscription: subscriptionId } = session;

  if (!userId || !subscriptionId) {
    console.error('Missing userId or subscriptionId in session');
    return;
  }

  await connectDB();

  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const planId = subscription.items.data[0].price.product as string;
  const priceId = subscription.items.data[0].price.id;
  const isAnnual = subscription.items.data[0].price.recurring?.interval === 'year';
  const planType = metadata?.planType || (priceId.includes('basic') ? 'BASIC' : 'FEATURED');
  
  // Calculate membership end date (30 days or 365 days from now based on billing interval)
  const startDate = new Date();
  const endDate = new Date();
  if (isAnnual) {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setDate(endDate.getDate() + 30);
  }

  // Update user with membership information
  await User.findByIdAndUpdate(userId, {
    $set: {
      'membership.type': planType,
      'membership.isAnnual': isAnnual,
      'membership.startDate': startDate,
      'membership.endDate': endDate,
      'membership.stripeCustomerId': session.customer,
      'membership.stripeSubscriptionId': subscriptionId,
      'membership.status': 'active',
    }
  });
}

async function handleSubscriptionUpdated(subscription: any) {
  const { metadata, customer: customerId } = subscription;
  
  if (!customerId) {
    console.error('Missing customerId in subscription');
    return;
  }

  await connectDB();

  // Find the user with this customer ID
  const user = await User.findOne({ 'membership.stripeCustomerId': customerId });

  if (!user) {
    console.error(`No user found with customer ID: ${customerId}`);
    return;
  }

  const planId = subscription.items.data[0].price.product as string;
  const priceId = subscription.items.data[0].price.id;
  const isAnnual = subscription.items.data[0].price.recurring?.interval === 'year';
  const planType = metadata?.planType || (priceId.includes('basic') ? 'BASIC' : 'FEATURED');

  // Calculate new end date based on billing interval
  const startDate = new Date();
  const endDate = new Date();
  if (isAnnual) {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setDate(endDate.getDate() + 30);
  }

  // Update user membership information
  await User.findByIdAndUpdate(user._id, {
    $set: {
      'membership.type': planType,
      'membership.isAnnual': isAnnual,
      'membership.startDate': startDate,
      'membership.endDate': endDate,
      'membership.status': subscription.status,
    }
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  const { customer: customerId } = subscription;
  
  if (!customerId) {
    console.error('Missing customerId in subscription');
    return;
  }

  await connectDB();

  // Find the user with this customer ID
  const user = await User.findOne({ 'membership.stripeCustomerId': customerId });

  if (!user) {
    console.error(`No user found with customer ID: ${customerId}`);
    return;
  }

  // Update user membership information
  await User.findByIdAndUpdate(user._id, {
    $set: {
      'membership.status': 'canceled'
    }
  });
}
