import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      preferences: user.preferences || {
        userTypes: [],
        city: '',
        onboardingCompleted: false
      }
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userTypes, preferences, onboardingCompleted } = body;

    if (!userTypes || !preferences || typeof preferences !== 'object') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that preferences has keys for each userType
    for (const type of userTypes) {
      if (!preferences[type]) {
        return NextResponse.json(
          { error: `Missing preferences for userType: ${type}` },
          { status: 400 }
        );
      }
    }

    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          preferences: {
            ...preferences,
            userTypes,
            onboardingCompleted: onboardingCompleted ?? true
          }
        }
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
} 