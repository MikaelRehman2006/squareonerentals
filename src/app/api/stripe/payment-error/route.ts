import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPaymentNotification } from '@/lib/notification';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get error details from the request
    const { errorCode, errorMessage } = await request.json();
    
    // Default error message if none provided
    const details = errorMessage || 'There was an issue processing your payment. Please check your payment method or contact support.';
    
    // Create a payment failure notification
    await createPaymentNotification(
      session.user.id,
      'failure',
      0, // We don't know the amount
      `Payment failed: ${details}`
    );
    
    return NextResponse.json({ 
      success: true,
      message: 'Payment error notification sent'
    });
  } catch (error) {
    console.error('Error handling payment failure:', error);
    return NextResponse.json(
      { error: 'Failed to process payment error' },
      { status: 500 }
    );
  }
} 