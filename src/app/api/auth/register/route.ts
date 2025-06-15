import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { sendNotificationEmail } from '@/utils/sendgrid';
import { createNotification } from '@/lib/notification';

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
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Make sure this matches the User model
      role: 'USER',
      emailVerified: null,
    });

    // Log the created user for debugging
    console.log('Created user:', {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      hasPassword: !!user.password,
    });

    // Create welcome notification first
    try {
      console.log('Creating welcome notification for user:', user._id.toString());
      
      // Ensure we have a valid MongoDB connection
      await connectDB();
      
      const notification = await createNotification({
        userId: user._id.toString(),
        message: `Welcome to Square One Rentals! Please check your email for important instructions on how to receive all notifications. If you don't see the email in your inbox, please check your spam folder.`,
        type: 'WELCOME'
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
      
      // Don't throw the error, but log it for debugging
      // The registration should still succeed even if notification fails
    }

    // Send welcome email
    try {
      console.log('Attempting to send welcome email to:', email);
      console.log('EMAIL_API_KEY configured:', !!process.env.EMAIL_API_KEY);
      console.log('EMAIL_API_KEY length:', process.env.EMAIL_API_KEY ? process.env.EMAIL_API_KEY.length : 0);
      
      const emailResult = await sendNotificationEmail({
        userEmail: email,
        userName: name,
        subject: 'Welcome to Square One Rentals',
        message: `Welcome to Square One Rentals! We're excited to have you on board.

To ensure you receive all our important notifications, please mark this email as "Not Spam" and add squareone.rental@gmail.com to your contacts.

You'll see a 🔴 notification badge beside your profile icon when you have unread notifications. Click on it to view your notifications.

You can now start browsing listings or create your own listing by logging into your account.`,
        notificationType: 'WELCOME'
      });
      
      console.log('Welcome email send result:', emailResult);
      console.log('Welcome email details (success):', {
        to: email,
        from: 'squareone.rental@gmail.com',
        subject: 'Welcome to Square One Rentals'
      });
    } catch (emailError) {
      // Log error but don't fail registration
      console.error('Error sending welcome email:', emailError);
      console.error('Error details:', {
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : 'No stack trace',
      });
    }

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