import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { sendNotificationEmail } from '@/utils/sendgrid';
import { createNotification } from '@/lib/notification';

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

    // Send welcome email
    try {
      await sendNotificationEmail({
        userEmail: email,
        userName: name,
        subject: 'Welcome to Square One Rentals',
        message: `Welcome to Square One Rentals! We're excited to have you on board.

To ensure you receive all our important notifications, please mark this email as "Not Spam" and add squareone.rental@gmail.com to your contacts.

You'll see a 🔴 notification badge beside your profile icon when you have unread notifications. Click on it to view your notifications.

You can now start browsing listings or create your own listing by logging into your account.`,
        notificationType: 'WELCOME'
      });
      
      // Create in-app notification
      await createNotification({
        userId: user._id.toString(),
        message: `Welcome to Square One Rentals! Please check your email for important instructions on how to receive all notifications. If you don't see the email in your inbox, please check your spam folder.`,
        type: 'WELCOME'
      });
    } catch (emailError) {
      // Log error but don't fail registration
      console.error('Error sending welcome email:', emailError);
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