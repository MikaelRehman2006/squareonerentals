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

    console.log('🔍 GET preferences - Session user:', { email: session.user.email, id: session.user.id });

    await connectDB();
    
    let user = await User.findOne({ email: session.user.email });
    console.log('🔍 GET preferences - User found by email:', !!user);
    
    // If user not found by email, try to find by ID (for cases where email was changed)
    if (!user && session.user.id) {
      user = await User.findById(session.user.id);
      console.log('🔍 GET preferences - User found by ID:', !!user);
    }
    
    if (!user) {
      console.log('❌ GET preferences - User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ GET preferences - User found:', { id: user._id, email: user.email });

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
        expiresAt: user.pendingEmailChange.expiresAt ? user.pendingEmailChange.expiresAt.toISOString() : null,
        createdAt: user.pendingEmailChange.createdAt ? user.pendingEmailChange.createdAt.toISOString() : null
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
    console.error('❌ Error fetching user preferences:', error);
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
    console.log('📝 Received preferences data:', JSON.stringify(requestData, null, 2));

    await connectDB();
    
    let user = await User.findOne({ email: session.user.email });
    
    // If user not found by email, try to find by ID (for cases where email was changed)
    if (!user && session.user.id) {
      user = await User.findById(session.user.id);
    }
    
    if (!user) {
      console.error('❌ User not found for email:', session.user.email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ Found user:', { id: user._id, email: user.email });

    // Initialize preferences if not exists
    if (!user.preferences) {
      user.preferences = {} as any;
      console.log('🔧 Initialized empty preferences');
    }

    // Handle onboarding survey data structure
    if (requestData.userTypes !== undefined || requestData.onboardingCompleted !== undefined) {
      console.log('📝 Processing onboarding survey data:', {
        userTypes: requestData.userTypes,
        onboardingCompleted: requestData.onboardingCompleted,
        hasPreferences: !!requestData.preferences
      });
      
      // Update onboarding-related preferences
      (user.preferences as any).userTypes = requestData.userTypes || [];
      (user.preferences as any).onboardingCompleted = requestData.onboardingCompleted || false;
      
      // Handle nested preferences object from survey
      if (requestData.preferences) {
        // Save the preferences object directly
        (user.preferences as any).preferences = requestData.preferences;
      }

      console.log('💾 About to save user preferences:', JSON.stringify(user.preferences, null, 2));
      
      try {
        // Use findOneAndUpdate for more reliable saving
        const updateResult = await User.findByIdAndUpdate(
          user._id,
          { 
            $set: { 
              preferences: user.preferences 
            } 
          },
          { 
            new: true,
            runValidators: false // Disable validators to prevent issues
          }
        );
        
        if (!updateResult) {
          console.error('❌ Failed to update user preferences - no result returned');
          return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
        }
        
        console.log('✅ User preferences saved successfully:', JSON.stringify(updateResult.preferences, null, 2));
        
        // Verify the save by fetching the user again
        const verifiedUser = await User.findById(user._id);
        if (!verifiedUser) {
          console.error('❌ Failed to verify saved preferences - user not found');
          return NextResponse.json({ error: 'Failed to verify saved preferences' }, { status: 500 });
        }
        
        console.log('✅ Verified saved preferences:', JSON.stringify(verifiedUser.preferences, null, 2));
        
        return NextResponse.json({ 
          message: 'Onboarding preferences updated successfully',
          preferences: verifiedUser.preferences,
          userTypes: verifiedUser.preferences?.userTypes || [],
          onboardingCompleted: verifiedUser.preferences?.onboardingCompleted || false
        });
      } catch (updateError) {
        console.error('❌ Error updating user preferences:', updateError);
        return NextResponse.json({ error: 'Failed to save preferences to database' }, { status: 500 });
      }
    }

    // Handle notification settings data structure
    if (requestData.notificationSettings) {
      console.log('📝 Processing notification settings data');
      
      (user.preferences as any).notificationSettings = requestData.notificationSettings;
      
      try {
        const updateResult = await User.findByIdAndUpdate(
          user._id,
          { 
            $set: { 
              preferences: user.preferences 
            } 
          },
          { 
            new: true,
            runValidators: false
          }
        );

        if (!updateResult) {
          console.error('❌ Failed to update notification settings');
          return NextResponse.json({ error: 'Failed to save notification settings' }, { status: 500 });
        }

        return NextResponse.json({ 
          message: 'Notification preferences updated successfully',
          preferences: requestData.notificationSettings 
        });
      } catch (updateError) {
        console.error('❌ Error updating notification settings:', updateError);
        return NextResponse.json({ error: 'Failed to save notification settings' }, { status: 500 });
      }
    }

    // If neither structure is provided, return error
    console.error('❌ Invalid request data - no valid structure provided');
    return NextResponse.json({ 
      error: 'Invalid request data. Must include either onboarding data or notification settings.' 
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Error updating user preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
} 