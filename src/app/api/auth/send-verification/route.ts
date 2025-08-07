import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/resend';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { 
  generateVerificationCode, 
  storeVerificationCode, 
  isRateLimited, 
  getRemainingRateLimitTime,
  getVerificationInfo 
} from '@/lib/verification';

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

    // Check rate limiting
    if (isRateLimited(email)) {
      const remainingTime = getRemainingRateLimitTime(email);
      return NextResponse.json(
        { 
          error: `Please wait ${remainingTime} seconds before requesting another code`,
          remainingTime 
        },
        { status: 429 }
      );
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Store verification code with rate limiting
    const stored = storeVerificationCode(email, verificationCode);
    if (!stored) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before requesting another code.' },
        { status: 429 }
      );
    }

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
        message: 'Verification code sent to your email',
        expiresIn: '15 minutes'
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

// Debug endpoint to check verification status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    const info = getVerificationInfo(email);
    return NextResponse.json(info);
  } catch (error) {
    console.error('Debug verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

 