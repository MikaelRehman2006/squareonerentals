import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { sendWelcomeEmail } from '@/utils/resend';
import { createNotification } from '@/lib/notification';
import { Notification } from '@/models/Notification';
import { verifyCode } from '@/lib/verification';

// Add password validation helper
function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for complexity - require at least 3 of 4 character types
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const criteriaCount = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
  
  if (criteriaCount < 3) {
    return { 
      valid: false, 
      message: 'Password must contain at least 3 of the following: uppercase letters, lowercase letters, numbers, and special characters' 
    };
  }
  
  return { valid: true, message: '' };
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, password, verificationCode } = await request.json();

    // Validate input
    if (!name || !email || !password || !verificationCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Verify email verification code using new system
    if (!verifyCode(email, verificationCode)) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'USER',
      emailVerified: null,
      preferences: {
        userTypes: [],
        city: '',
        onboardingCompleted: false
      }
    });

    // Log the created user for debugging
    console.log('Created user:', {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      hasPassword: !!user.password,
    });

    // Clean up any old notifications for this email
    try {
      console.log('Cleaning up any old notifications for email:', email);
      await Notification.deleteMany({ userId: user._id.toString() });
      console.log('Old notifications cleaned up successfully');
    } catch (cleanupError) {
      console.error('Error cleaning up old notifications:', cleanupError);
      // Don't throw the error, continue with registration
    }

    // Create welcome notification first
    try {
      console.log('Creating welcome notification for user:', user._id.toString());
      
      // Ensure we have a valid MongoDB connection
      await connectDB();
      
      const notification = await createNotification({
        userId: user._id.toString(),
        message: `🎉 Welcome to Square One Rentals! We're thrilled to have you join our community. Whether you're looking for your next home or managing rental properties, we're here to make your rental journey seamless and successful. Complete your profile to get personalized recommendations, browse thousands of verified properties, save your favorites, and connect directly with landlords and tenants through our secure messaging system.`,
        type: 'WELCOME',
        sendEmail: true, // Explicitly enable email sending
      });
      
      if (!notification) {
        throw new Error('Failed to create welcome notification - no notification object returned');
      }
      
      console.log('Welcome notification created successfully:', {
        id: notification._id,
        userId: notification.userId,
        type: notification.type
      });
    } catch (notificationError) {
      console.error('Error creating welcome notification:', notificationError);
      console.error('Error details:', {
        error: notificationError instanceof Error ? notificationError.message : 'Unknown error',
        stack: notificationError instanceof Error ? notificationError.stack : 'No stack trace',
        userId: user._id.toString()
      });
      
      // Try to reconnect to the database and create the notification again
      try {
        console.log('Attempting to reconnect and create welcome notification again...');
        await connectDB();
        const retryNotification = await createNotification({
          userId: user._id.toString(),
          message: `🎉 Welcome to Square One Rentals! We're thrilled to have you join our community. Whether you're looking for your next home or managing rental properties, we're here to make your rental journey seamless and successful. Complete your profile to get personalized recommendations, browse thousands of verified properties, save your favorites, and connect directly with landlords and tenants through our secure messaging system.`,
          type: 'WELCOME',
          sendEmail: true, // Explicitly enable email sending
        });
        
        if (retryNotification) {
          console.log('Welcome notification created successfully on retry:', {
            id: retryNotification._id,
            userId: retryNotification.userId,
            type: retryNotification.type
          });
        }
      } catch (retryError) {
        console.error('Failed to create welcome notification on retry:', retryError);
      }
    }

    // Note: Welcome email is now sent through the notification system above
    // This ensures only one welcome email is sent with comprehensive content

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}