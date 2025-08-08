import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import mongoose, { Model } from 'mongoose';

// Define interface for image metadata document
interface IImageMetadata {
  userId: string;
  url: string;
  publicId: string;
  size: number;
  listingId?: string;
  createdAt: Date;
}

interface Listing {
  _id: string;
  id: string;
  images: string[] | string | undefined;
  userId: string;
}

// Get or initialize the ImageMetadata model
let ImageMetadata: Model<IImageMetadata>;
try {
  ImageMetadata = mongoose.model<IImageMetadata>('ImageMetadata');
} catch (e) {
  // Model not registered yet, will be registered when metadata API is called
  const ImageMetadataSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    size: { type: Number, required: true },
    listingId: { type: String, index: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  ImageMetadata = mongoose.model<IImageMetadata>('ImageMetadata', ImageMetadataSchema);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Authenticate the request
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    const userId = params.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Get all image metadata for the user
    const metadata = await ImageMetadata.find({ userId }).lean();
    
    // Calculate total size - use actual sizes if available
    const totalSize = metadata.reduce((total: number, item: IImageMetadata) => {
      const itemSize = item && typeof item.size === 'number' ? item.size : 0;
      return total + itemSize;
    }, 0);
    
    const imageCount = metadata.length;

    // Calculate based on membership type
    const STORAGE_LIMITS: Record<string, number> = {
      FEATURED: 25 * 1024 * 1024, // 25MB
      BASIC: 10 * 1024 * 1024,    // 10MB
      NONE: 5 * 1024 * 1024       // 5MB default
    };

    // Get user's membership type
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    const membershipType = user?.membership?.type || 'NONE';
    const storageLimit = STORAGE_LIMITS[membershipType] || STORAGE_LIMITS.NONE;
    
    // Use actual size if we have metadata, otherwise use estimate
    let storageUsage: number;
    if (metadata.length > 0) {
      storageUsage = totalSize;
    } else {
      // Fallback to estimation if no metadata exists yet
      const Listing = mongoose.model('Listing');
      const listings = await Listing.find({ userId }).lean() as Listing[];
      
      // Calculate total images across all listings
      let fallbackImageCount = 0;
      for (const listing of listings) {
        const listingImages = listing.images;
        const images = typeof listingImages === 'string' 
          ? listingImages.split(',').filter(Boolean)
          : Array.isArray(listingImages)
            ? listingImages.filter(Boolean)
            : [];
        fallbackImageCount += images.length;
      }
      
      // Estimate storage: ~400KB per image
      storageUsage = fallbackImageCount * 400 * 1024;
    }

    return NextResponse.json({
      success: true,
      userId,
      storageUsage: {
        bytes: storageUsage,
        count: imageCount
      },
      imageCount,
      limit: storageLimit,
      percentage: Math.min(100, Math.round((storageUsage / storageLimit) * 100))
    });
  } catch (error) {
    console.error('Error fetching storage usage:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 