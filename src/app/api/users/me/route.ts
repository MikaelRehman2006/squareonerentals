import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Listing } from '@/models/Listing';

interface ListingType {
  _id: string;
  id: string;
  images: string[] | string | undefined;
  size?: number;
}

interface ImageSize {
  size?: number;
  _id?: string;
}

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
    const userListings = await Listing.find({
      userId: user._id
    }).select('images id').lean() as ListingType[];

    // Count the total number of images across all listings
    let totalImageCount = 0;
    let totalStorageUsed = 0;

    // Process each listing
    for (const listing of userListings) {
      // Handle both string and array image formats
      const listingImages = listing.images;
      const images = typeof listingImages === 'string' 
        ? listingImages.split(',').filter(Boolean) 
        : Array.isArray(listingImages) 
          ? listingImages.filter(Boolean)
          : [];
          
      totalImageCount += images.length;
      
      try {
        // Try to get actual image sizes from metadata if available
        const imageSizes = await Listing.find({
          _id: listing.id
        }).select('size').lean() as ImageSize[];
        
        // Sum up actual sizes if available
        if (imageSizes && imageSizes.length > 0) {
          // Calculate the sum from the image sizes
          const sizeSum = imageSizes.reduce((sum: number, img: ImageSize) => {
            const imgSize = img && typeof img.size === 'number' ? img.size : 0;
            return sum + imgSize;
          }, 0);
          
          // Add the sum to the total
          totalStorageUsed += sizeSum;
        } else {
          // Fallback to estimate - 400KB per image (average compressed size)
          totalStorageUsed += images.length * 400 * 1024;
        }
      } catch (error) {
        console.error('Error getting image sizes:', error);
        // Fallback to estimate if there's an error
        totalStorageUsed += images.length * 400 * 1024;
      }
    }

    // Return user data with storage information
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      membership: user.membership || null,
      storageUsage: {
        bytes: totalStorageUsed,
        count: totalImageCount
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
