import { NextResponse } from 'next/server';
import { sendNotificationEmail } from '@/utils/resend';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const testEmail = url.searchParams.get('email') || 'squareone.rental@gmail.com';
    
    console.log('🧪 Simple email test for:', testEmail);

    // Test direct Resend email
    const emailResult = await sendNotificationEmail({
      userEmail: testEmail,
      userName: 'Test User',
      subject: 'Simple Email Test - Square One Rentals',
      message: 'This is a simple test email to debug the delivery issue.',
      notificationType: 'SYSTEM',
    });

    console.log('Email result:', emailResult);

    return NextResponse.json({
      success: true,
      emailResult,
      testEmail,
      message: 'Simple email test completed'
    });

  } catch (error) {
    console.error('Simple email test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
