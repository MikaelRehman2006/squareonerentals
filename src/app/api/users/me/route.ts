import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Listing } from '@/models/Listing';
import mongoose from 'mongoose';

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

    // Get actual storage usage from ImageMetadata collection
    let totalStorageUsed = 0;
    let totalImageCount = 0;

    try {
      // Get or initialize the ImageMetadata model
      let ImageMetadata: mongoose.Model<any>;
      try {
        ImageMetadata = mongoose.model('ImageMetadata');
      } catch (e) {
        const ImageMetadataSchema = new mongoose.Schema({
          userId: { type: String, required: true, index: true },
          url: { type: String, required: true, unique: true },
          publicId: { type: String, required: true },
          size: { type: Number, required: true },
          listingId: { type: String, index: true },
          createdAt: { type: Date, default: Date.now }
        });
        
        ImageMetadata = mongoose.model('ImageMetadata', ImageMetadataSchema);
      }

      // Get all image metadata for the user
      const metadata = await ImageMetadata.find({ userId: user._id.toString() }).lean();
      
      // Calculate total size from actual metadata
      totalStorageUsed = metadata.reduce((total: number, item: any) => {
        const itemSize = item && typeof item.size === 'number' ? item.size : 0;
        return total + itemSize;
      }, 0);
      
      totalImageCount = metadata.length;
    } catch (error) {
      console.error('Error getting image metadata:', error);
      
      // Fallback to estimation if metadata collection fails
      for (const listing of userListings) {
        const listingImages = listing.images;
        const images = typeof listingImages === 'string' 
          ? listingImages.split(',').filter(Boolean) 
          : Array.isArray(listingImages) 
            ? listingImages.filter(Boolean)
            : [];
            
        totalImageCount += images.length;
        
        // Estimate storage: ~400KB per image
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
