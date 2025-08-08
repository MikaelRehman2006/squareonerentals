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
    
    let user = await User.findOne({ email: session.user.email });
    
    // If user not found by email, try to find by ID (for cases where email was changed)
    if (!user && session.user.id) {
      user = await User.findById(session.user.id);
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return raw user data for debugging
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        rawPreferences: user.preferences,
        preferencesType: typeof user.preferences,
        preferencesKeys: user.preferences ? Object.keys(user.preferences) : [],
        hasPreferences: !!user.preferences,
        preferencesStringified: JSON.stringify(user.preferences, null, 2)
      }
    });
  } catch (error) {
    console.error('Error debugging user preferences:', error);
    return NextResponse.json({ error: 'Failed to debug preferences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestData = await request.json();
    console.log('🔍 Debug POST - Received data:', requestData);

    await connectDB();
    
    let user = await User.findOne({ email: session.user.email });
    
    // If user not found by email, try to find by ID (for cases where email was changed)
    if (!user && session.user.id) {
      user = await User.findById(session.user.id);
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('🔍 Debug POST - Before save - User preferences:', user.preferences);

    // Initialize preferences if not exists
    if (!user.preferences) {
      user.preferences = {} as any;
      console.log('🔍 Debug POST - Initialized empty preferences');
    }

    // Handle onboarding survey data structure
    if (requestData.userTypes !== undefined || requestData.onboardingCompleted !== undefined) {
      console.log('🔍 Debug POST - Processing onboarding survey data:', requestData);
      
      // Update onboarding-related preferences
      (user.preferences as any).userTypes = requestData.userTypes || [];
      (user.preferences as any).onboardingCompleted = requestData.onboardingCompleted || false;
      
      // Handle nested preferences object from survey
      if (requestData.preferences) {
        // Save the preferences object directly
        (user.preferences as any).preferences = requestData.preferences;
      }

      console.log('🔍 Debug POST - After setting preferences:', user.preferences);
      
      // Use findOneAndUpdate for more reliable saving - removed runValidators to prevent validation errors
      const updateResult = await User.findByIdAndUpdate(
        user._id,
        { preferences: user.preferences },
        { new: true }
      );
      console.log('🔍 Debug POST - Update result:', updateResult?.preferences);
      
      // Fetch the user again to see what was actually saved
      const updatedUser = await User.findById(user._id);
      console.log('🔍 Debug POST - After save - User preferences:', updatedUser?.preferences);
      
      return NextResponse.json({ 
        message: 'Debug preferences updated successfully',
        beforeSave: user.preferences,
        afterSave: updatedUser?.preferences,
        updateResult: updateResult?.preferences,
        saveResult: updateResult?._id ? 'Success' : 'Failed'
      });
    }

    return NextResponse.json({ error: 'No onboarding data provided' }, { status: 400 });

  } catch (error) {
    console.error('Error debugging user preferences:', error);
    return NextResponse.json({ error: 'Failed to debug preferences' }, { status: 500 });
  }
}
