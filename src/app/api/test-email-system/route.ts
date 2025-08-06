import { NextResponse } from 'next/server';
import { sendNotificationEmail } from '@/utils/resend';
import { createNotification } from '@/lib/notification';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const testType = url.searchParams.get('type') || 'SYSTEM';
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Testing email system for:', email, 'type:', testType);

    // Test 1: Direct Resend email
    console.log('1. Testing direct Resend email...');
    const directEmailResult = await sendNotificationEmail({
      userEmail: email,
      userName: 'Test User',
      subject: 'Direct Email Test - Square One Rentals',
      message: 'This is a direct email test to verify Resend is working.',
      notificationType: testType as any,
    });

    console.log('Direct email result:', directEmailResult);

    // Test 2: Find user in database
    console.log('2. Testing database connection and user lookup...');
    await connectDB();
    const user = await User.findOne({ email });
    console.log('User found:', !!user, user ? `ID: ${user._id}` : 'Not found');

    // Test 3: Create notification with email
    console.log('3. Testing notification creation with email...');
    let notificationResult = null;
    if (user) {
      try {
        notificationResult = await createNotification({
          userId: user._id.toString(),
          message: 'This is a test notification with automatic email sending.',
          type: testType as any,
          sendEmail: true,
        });
        console.log('Notification created:', !!notificationResult);
      } catch (error) {
        console.error('Notification creation error:', error);
      }
    }

    // Test 4: Check environment variables
    console.log('4. Checking environment variables...');
    const envCheck = {
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      resendApiKeyLength: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    };

    console.log('Environment check:', envCheck);

    return NextResponse.json({
      success: true,
      tests: {
        directEmail: directEmailResult,
        userFound: !!user,
        notificationCreated: !!notificationResult,
        environment: envCheck,
      },
      message: 'Email system test completed. Check console logs for details.',
    });

  } catch (error) {
    console.error('Email system test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      },
      { status: 500 }
    );
  }
}
