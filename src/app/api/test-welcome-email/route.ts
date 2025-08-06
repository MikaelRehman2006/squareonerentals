import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/utils/resend';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    console.log('Testing welcome email to:', email);
    console.log('RESEND_API_KEY configured:', !!process.env.RESEND_API_KEY);

    const result = await sendWelcomeEmail({
      userEmail: email,
      userName: name
    });

    if (result) {
      return NextResponse.json({ 
        success: true, 
        message: 'Welcome email sent successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to send welcome email' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test welcome email error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 