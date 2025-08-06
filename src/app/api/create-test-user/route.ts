import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: Request) {
  try {
    const { email = 'squareone.rental@gmail.com', name = 'Square One Rentals' } = await request.json();
    
    console.log('📝 Creating user account:', email);

    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: `User ${email} already exists`,
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role
        }
      });
    }

    // Create the user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      role: 'ADMIN',
      password: 'temp-password', // Will be updated later
      emailVerified: new Date(), // Mark as verified
    });

    console.log('✅ User created successfully:', {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    return NextResponse.json({
      success: true,
      message: `User ${email} created successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
