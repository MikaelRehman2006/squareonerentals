import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// GET - Retrieve user notification preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user preferences, defaulting to all enabled if not set
    const preferences = (user.preferences as any)?.notificationSettings || {
      systemAlerts: { inApp: true, email: true },
      newsletter: { inApp: true, email: true },
      specialOffers: { inApp: true, email: true },
      favoriteUpdates: { inApp: true, email: true },
      listingChanges: { inApp: true, email: true },
      paymentNotifications: { inApp: true, email: true },
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

// POST - Update user notification preferences
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationSettings } = await request.json();
    
    if (!notificationSettings) {
      return NextResponse.json({ error: 'Notification settings are required' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user preferences
    if (!user.preferences) {
      user.preferences = {} as any;
    }
    
    (user.preferences as any).notificationSettings = notificationSettings;
    await user.save();

    return NextResponse.json({ 
      message: 'Preferences updated successfully',
      preferences: notificationSettings 
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
} 