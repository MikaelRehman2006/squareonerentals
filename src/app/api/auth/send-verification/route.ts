import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/resend';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { verificationCodes, generateVerificationCode, cleanupExpiredCodes } from '@/lib/verification';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Clean up expired codes first
    cleanupExpiredCodes();

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Store verification code (in production, use Redis or database)
    verificationCodes.set(email, { code: verificationCode, expiresAt });

    console.log('Sending verification email to:', email);
    console.log('Verification code:', verificationCode);

    // Send verification email
    const emailResult = await sendVerificationEmail({
      userEmail: email,
      verificationCode: verificationCode
    });

    if (emailResult) {
      return NextResponse.json({ 
        success: true, 
        message: 'Verification code sent to your email' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to send verification code' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

 