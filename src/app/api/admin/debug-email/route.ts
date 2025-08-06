import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { sendNotificationEmail } from '@/utils/resend';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (you can adjust this logic based on your admin role system)
    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { userEmail, userName } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    console.log('Sending debug email to:', userEmail);

    // Send debug email using the notification email function
    const emailResult = await sendNotificationEmail({
      userEmail: userEmail,
      userName: userName || 'Admin User',
      subject: 'Debug Email Test - Square One Rentals',
      message: 'This is a debug email to test the email functionality. If you received this, the email system is working correctly!',
      notificationType: 'SYSTEM'
    });

    if (emailResult) {
      console.log('Debug email sent successfully to:', userEmail);
      return NextResponse.json({
        success: true,
        message: 'Debug email sent successfully'
      });
    } else {
      console.error('Failed to send debug email to:', userEmail);
      return NextResponse.json({
        success: false,
        message: 'Failed to send debug email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Debug email error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
} 