import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

// GET - Retrieve user preferences (handles both onboarding and notification settings)
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

    // Get user preferences
    const userPrefs = (user.preferences as any) || {};

    // Return comprehensive preferences object
    const allPreferences = {
      // Onboarding preferences
      userTypes: userPrefs.userTypes || [],
      onboardingCompleted: userPrefs.onboardingCompleted || false,
      preferences: userPrefs.preferences || {},
      
      // Notification settings (default to all enabled if not set)
      notificationSettings: userPrefs.notificationSettings || {
        systemAlerts: { inApp: true, email: true },
        newsletter: { inApp: true, email: true },
        specialOffers: { inApp: true, email: true },
        favoriteUpdates: { inApp: true, email: true },
        listingChanges: { inApp: true, email: true },
        paymentNotifications: { inApp: true, email: true },
      },
      
      // Pending email change
      pendingEmailChange: user.pendingEmailChange ? {
        newEmail: user.pendingEmailChange.newEmail,
        verificationCode: user.pendingEmailChange.verificationCode,
        expiresAt: user.pendingEmailChange.expiresAt.toISOString(),
        createdAt: user.pendingEmailChange.createdAt.toISOString()
      } : null
    };

    console.log('📤 Returning user preferences:', {
      userTypes: allPreferences.userTypes,
      onboardingCompleted: allPreferences.onboardingCompleted,
      preferences: allPreferences.preferences,
      pendingEmailChange: allPreferences.pendingEmailChange
    });

    // Return in the structure expected by the frontend
    return NextResponse.json({
      // Top-level properties for frontend compatibility
      userTypes: allPreferences.userTypes,
      onboardingCompleted: allPreferences.onboardingCompleted,
      notificationSettings: allPreferences.notificationSettings,
      // Nested preferences for backward compatibility
      preferences: allPreferences.preferences,
      // Pending email change
      pendingEmailChange: allPreferences.pendingEmailChange
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

// POST - Update user preferences (handles both onboarding survey and notification settings)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestData = await request.json();
    console.log('Received preferences data:', requestData);

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize preferences if not exists
    if (!user.preferences) {
      user.preferences = {} as any;
    }

    // Handle onboarding survey data structure
    if (requestData.userTypes !== undefined || requestData.onboardingCompleted !== undefined) {
      console.log('📝 Processing onboarding survey data:', requestData);
      
      // Update onboarding-related preferences
      (user.preferences as any).userTypes = requestData.userTypes || [];
      (user.preferences as any).onboardingCompleted = requestData.onboardingCompleted || false;
      
      // Handle nested preferences object from survey
      if (requestData.preferences) {
        // Save the preferences object directly
        (user.preferences as any).preferences = requestData.preferences;
      }

      console.log('💾 Saving user preferences:', user.preferences);
      
      // Use findOneAndUpdate for more reliable saving
      const updateResult = await User.findOneAndUpdate(
        { email: session.user.email },
        { preferences: user.preferences },
        { new: true, runValidators: true }
      );
      
      console.log('✅ User preferences saved successfully:', updateResult?.preferences);
      
      return NextResponse.json({ 
        message: 'Onboarding preferences updated successfully',
        preferences: user.preferences
      });
    }

    // Handle notification settings data structure
    if (requestData.notificationSettings) {
      console.log('Processing notification settings data');
      
      (user.preferences as any).notificationSettings = requestData.notificationSettings;
      
      // Use findOneAndUpdate for more reliable saving
      const updateResult = await User.findOneAndUpdate(
        { email: session.user.email },
        { preferences: user.preferences },
        { new: true, runValidators: true }
      );

      return NextResponse.json({ 
        message: 'Notification preferences updated successfully',
        preferences: requestData.notificationSettings 
      });
    }

    // If neither structure is provided, return error
    return NextResponse.json({ 
      error: 'Invalid request data. Must include either onboarding data or notification settings.' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
} 