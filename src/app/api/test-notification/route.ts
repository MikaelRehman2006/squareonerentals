import { NextResponse } from 'next/server';
import { createNotification } from '@/lib/notification';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// Specify runtime configuration to fix deployment errors
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const notificationType = (url.searchParams.get('type') || 'SYSTEM') as 'SYSTEM' | 'NEWSLETTER' | 'MARKETING' | 'PAYMENT' | 'WELCOME';
    
    // If no email is provided, return an error
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }
    
    // Comprehensive diagnostic info
    const diagnosticInfo: Record<string, any> = {
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        hasResendApiKey: !!process.env.RESEND_API_KEY,
        databaseConfigured: !!process.env.MONGODB_URI,
      },
      email: email,
      notificationType: notificationType,
      steps: []
    };

    // Step 1: Connect to database
    try {
      await connectDB();
      diagnosticInfo.steps.push({ step: 'database_connection', status: 'success' });
    } catch (dbError) {
      diagnosticInfo.steps.push({ 
        step: 'database_connection', 
        status: 'error',
        error: dbError instanceof Error ? dbError.message : 'Unknown error' 
      });
      return NextResponse.json(diagnosticInfo, { status: 500 });
    }
    
    // Step 2: Find user by email
    let user;
    try {
      user = await User.findOne({ email });
      diagnosticInfo.steps.push({ 
        step: 'find_user', 
        status: user ? 'success' : 'error',
        found: !!user,
        userId: user?._id?.toString() 
      });
      
      if (!user) {
        return NextResponse.json(
          { ...diagnosticInfo, error: 'User not found with provided email' },
          { status: 404 }
        );
      }
    } catch (userError) {
      diagnosticInfo.steps.push({ 
        step: 'find_user', 
        status: 'error',
        error: userError instanceof Error ? userError.message : 'Unknown error' 
      });
      return NextResponse.json(diagnosticInfo, { status: 500 });
    }
    
    // Step 3: Create notification (this will automatically send email)
    let notification;
    try {
      const testMessages = {
        SYSTEM: 'This is a test system alert to verify the notification and email system is working correctly.',
        NEWSLETTER: 'This is a test newsletter to verify the notification and email system is working correctly.',
        MARKETING: 'This is a test special offer to verify the notification and email system is working correctly.',
        PAYMENT: 'This is a test payment notification to verify the notification and email system is working correctly.',
        WELCOME: 'This is a test welcome message to verify the notification and email system is working correctly.',
      };

      notification = await createNotification({
        userId: user._id.toString(),
        message: testMessages[notificationType] || testMessages.SYSTEM,
        type: notificationType,
        sendEmail: true, // This will trigger email sending
      });
      
      diagnosticInfo.steps.push({ 
        step: 'create_notification_with_email', 
        status: 'success',
        notificationId: notification._id.toString(),
        message: 'Notification created and email sent automatically'
      });
    } catch (notifError) {
      diagnosticInfo.steps.push({ 
        step: 'create_notification_with_email', 
        status: 'error',
        error: notifError instanceof Error ? notifError.message : 'Unknown error',
        stack: notifError instanceof Error ? notifError.stack : 'No stack trace'
      });
    }
    
    // Check if the step was successful
    const allSuccess = diagnosticInfo.steps.every((step: {status: string}) => step.status === 'success');
    
    return NextResponse.json({
      ...diagnosticInfo,
      success: allSuccess,
      message: allSuccess 
        ? 'Notification created and email sent successfully!' 
        : 'There were issues with one or more steps. Check the details.',
      notification: notification ? {
        id: notification._id.toString(),
        type: notification.type,
        message: notification.message,
        createdAt: notification.createdAt
      } : null
    }, { status: allSuccess ? 200 : 500 });
    
  } catch (error: any) {
    console.error('Error in test-notification route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        stack: error.stack,
        code: error.code
      },
      { status: 500 }
    );
  }
} 