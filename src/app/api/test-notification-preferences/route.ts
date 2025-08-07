import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

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

    // Test the preference checking logic
    const preferences = (user.preferences as any)?.notificationSettings || {};
    
    // Test different notification types
    const testTypes = ['SYSTEM', 'NEWSLETTER', 'MARKETING', 'FAVORITE', 'LISTING_UPDATE', 'PAYMENT'];
    const testResults: Record<string, any> = {};

    for (const type of testTypes) {
      const typeMapping: Record<string, string> = {
        'SYSTEM': 'systemAlerts',
        'NEWSLETTER': 'newsletter',
        'MARKETING': 'specialOffers',
        'FAVORITE': 'favoriteUpdates',
        'LISTING_UPDATE': 'listingChanges',
        'PAYMENT': 'paymentNotifications',
      };

      const preferenceKey = typeMapping[type];
      const userPreference = preferences[preferenceKey];
      
      testResults[type] = {
        preferenceKey,
        userPreference,
        inAppEnabled: userPreference?.inApp !== false,
        emailEnabled: userPreference?.email !== false,
      };
    }

    return NextResponse.json({
      userId: user._id.toString(),
      email: user.email,
      preferences,
      testResults,
    });
  } catch (error) {
    console.error('Error testing notification preferences:', error);
    return NextResponse.json({ error: 'Failed to test preferences' }, { status: 500 });
  }
}
