import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Listing } from '@/models/Listing';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user with membership information
    // Use email to find user since the ID might not be in the correct ObjectId format
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate storage usage based on user's listings and images
    const listings = await Listing.find({ userId: user._id });
    
    // Count total images correctly
    let totalImageCount = 0;
    for (const listing of listings) {
      totalImageCount += listing.images?.length || 0;
    }
    
    // Calculate more accurate storage estimation - 400KB per image (average compressed size)
    const estimatedStorageUsage = totalImageCount > 0 ? totalImageCount * 400 * 1024 : 0; // Start at zero if no images
    
    // Return user data with storage information
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      membership: user.membership || null,
      storageUsage: {
        bytes: estimatedStorageUsage,
        imageCount: totalImageCount,
      }
    });
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
