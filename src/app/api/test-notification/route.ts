import { NextResponse } from 'next/server';
import { sendNotificationEmail } from '@/utils/sendgrid';
import { createNotification } from '@/lib/notification';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Notification } from '@/models/Notification';

// Specify runtime configuration to fix deployment errors
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const notificationType = (url.searchParams.get('type') || 'WELCOME') as 'WELCOME' | 'SYSTEM';
    
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
        hasEmailApiKey: !!process.env.EMAIL_API_KEY,
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
    
    // Step 3: Create in-app notification
    let notification;
    try {
      notification = await Notification.create({
        userId: user._id.toString(),
        message: 'This is a test notification to verify the notification system is working correctly.',
        type: notificationType,
        read: false,
      });
      
      diagnosticInfo.steps.push({ 
        step: 'create_notification', 
        status: 'success',
        notificationId: notification._id.toString() 
      });
    } catch (notifError) {
      diagnosticInfo.steps.push({ 
        step: 'create_notification', 
        status: 'error',
        error: notifError instanceof Error ? notifError.message : 'Unknown error' 
      });
      // Continue to next step even if this fails
    }
    
    // Step 4: Send email notification
    try {
      const emailResult = await sendNotificationEmail({
        userEmail: email,
        userName: user.name || 'User',
        subject: 'Test Notification',
        message: 'This is a test notification to verify the email notification system is working correctly.',
        notificationType: notificationType,
      });
      
      diagnosticInfo.steps.push({ 
        step: 'send_email', 
        status: emailResult ? 'success' : 'error' 
      });
    } catch (emailError) {
      diagnosticInfo.steps.push({ 
        step: 'send_email', 
        status: 'error',
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : 'No stack trace'
      });
    }
    
    // Check if both steps were successful
    const allSuccess = diagnosticInfo.steps.every((step: {status: string}) => step.status === 'success');
    
    return NextResponse.json({
      ...diagnosticInfo,
      success: allSuccess,
      message: allSuccess 
        ? 'Both notification and email were sent successfully!' 
        : 'There were issues with one or more steps. Check the details.'
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