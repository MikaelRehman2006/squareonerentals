import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { sendVerificationEmail } from '@/utils/resend';
import { createEmailChangeNotification } from '@/lib/notification';
import { 
  generateVerificationCode, 
  storeVerificationCode, 
  isRateLimited, 
  getRemainingRateLimitTime,
  verifyCode,
  cleanupExpiredCodes
} from '@/lib/verification';

// Request email change
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newEmail, currentPassword } = await request.json();
    
    if (!newEmail || !currentPassword) {
      return NextResponse.json({ 
        error: 'New email and current password are required' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json({ 
        error: 'Please enter a valid email address' 
      }, { status: 400 });
    }

    await connectDB();

    // Check if new email is already in use
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return NextResponse.json({ 
        error: 'This email address is already registered' 
      }, { status: 400 });
    }

    // Verify current password (you'll need to implement this based on your auth system)
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // For now, we'll skip password verification since it depends on your auth system
    // In a real implementation, you'd verify the current password here

    // Check rate limiting
    if (isRateLimited(newEmail)) {
      const remainingTime = getRemainingRateLimitTime(newEmail);
      return NextResponse.json(
        { 
          error: `Please wait ${remainingTime} seconds before requesting another verification code`,
          remainingTime 
        },
        { status: 429 }
      );
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Store verification code
    const stored = storeVerificationCode(newEmail, verificationCode);
    if (!stored) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before requesting another code.' },
        { status: 429 }
      );
    }

    // Send verification email to new email address
    const emailSent = await sendVerificationEmail({
      userEmail: newEmail,
      verificationCode
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    // Store pending email change in user document
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        pendingEmailChange: {
          newEmail,
          verificationCode,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
          createdAt: new Date()
        }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to new email address',
      pendingEmailChange: updatedUser?.pendingEmailChange ? {
        newEmail: updatedUser.pendingEmailChange.newEmail,
        verificationCode: updatedUser.pendingEmailChange.verificationCode,
        expiresAt: updatedUser.pendingEmailChange.expiresAt.toISOString(),
        createdAt: updatedUser.pendingEmailChange.createdAt.toISOString()
      } : null
    });

  } catch (error) {
    console.error('[EMAIL_CHANGE_REQUEST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify email change
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { verificationCode } = await request.json();
    
    if (!verificationCode) {
      return NextResponse.json({ 
        error: 'Verification code is required' 
      }, { status: 400 });
    }

    await connectDB();

    // Find user with pending email change
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.pendingEmailChange) {
      return NextResponse.json({ 
        error: 'No pending email change found' 
      }, { status: 400 });
    }

    const { newEmail, verificationCode: storedCode, expiresAt } = user.pendingEmailChange;

    // Check if expired
    if (new Date() > expiresAt) {
      // Clean up expired pending change
      await User.findOneAndUpdate(
        { email: session.user.email },
        { $unset: { pendingEmailChange: 1 } }
      );
      return NextResponse.json({ 
        error: 'Verification code has expired. Please request a new one.' 
      }, { status: 400 });
    }

    // Verify code
    if (verificationCode !== storedCode) {
      return NextResponse.json({ 
        error: 'Invalid verification code' 
      }, { status: 400 });
    }

    // Check if new email is still available
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return NextResponse.json({ 
        error: 'This email address is already registered' 
      }, { status: 400 });
    }

    // Store old email for notification
    const oldEmail = user.email;

    // Update email
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        email: newEmail,
        $unset: { pendingEmailChange: 1 }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
    }

    // Create notification about email change
    try {
      await createEmailChangeNotification(
        updatedUser._id.toString(),
        oldEmail,
        newEmail
      );
    } catch (notificationError) {
      console.error('Failed to create email change notification:', notificationError);
      // Don't fail the email change if notification fails
    }

    // Clean up verification code
    cleanupExpiredCodes();

    return NextResponse.json({
      success: true,
      message: 'Email updated successfully',
      newEmail
    });

  } catch (error) {
    console.error('[EMAIL_CHANGE_VERIFY]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Cancel pending email change
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Remove pending email change
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $unset: { pendingEmailChange: 1 } }
    );

    return NextResponse.json({
      success: true,
      message: 'Pending email change cancelled'
    });

  } catch (error) {
    console.error('[EMAIL_CHANGE_CANCEL]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
