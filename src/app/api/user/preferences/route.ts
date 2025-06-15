import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userTypes, city } = await request.json();

    if (!userTypes || !Array.isArray(userTypes) || userTypes.length === 0) {
      return NextResponse.json(
        { error: 'User types are required' },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        { error: 'City is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          preferences: {
            userTypes,
            city,
            completedOnboarding: true
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      preferences: updatedUser.preferences
    });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
} 