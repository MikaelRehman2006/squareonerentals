import { NextResponse } from 'next/server';
import { sendNotificationEmail } from '@/utils/resend';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const testEmail = url.searchParams.get('email') || 'squareone.rental@gmail.com';
    
    console.log('🧪 Testing specific email:', testEmail);

    // Test 1: Direct Resend email
    console.log('1. Testing direct Resend email...');
    const directEmailResult = await sendNotificationEmail({
      userEmail: testEmail,
      userName: 'Test User',
      subject: 'Specific Email Test - Square One Rentals',
      message: 'This is a test email to debug the email delivery issue.',
      notificationType: 'SYSTEM',
    });

    console.log('Direct email result:', directEmailResult);

    // Test 2: Find user in database
    console.log('2. Testing database connection and user lookup...');
    await connectDB();
    const user = await User.findOne({ email: testEmail });
    console.log('User found:', !!user, user ? `ID: ${user._id}, Name: ${user.name}` : 'Not found');

    // Test 3: Check if user exists and has proper data
    if (user) {
      console.log('User details:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      });
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
        userDetails: user ? {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        } : null,
        environment: envCheck,
      },
      message: 'Specific email test completed. Check console logs for details.',
    });

  } catch (error) {
    console.error('Specific email test error:', error);
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
