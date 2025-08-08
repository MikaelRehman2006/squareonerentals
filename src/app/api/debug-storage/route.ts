import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

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
    const totalStorageUsed = metadata.reduce((total: number, item: any) => {
      const itemSize = item && typeof item.size === 'number' ? item.size : 0;
      return total + itemSize;
    }, 0);
    
    const totalImageCount = metadata.length;

    // Get user's listings to compare
    const { Listing } = await import('@/models/Listing');
    const userListings = await Listing.find({ userId: user._id }).select('images id title').lean();

    // Calculate estimated storage from listings
    let estimatedStorage = 0;
    let estimatedImageCount = 0;
    
    for (const listing of userListings) {
      const listingImages = listing.images;
      const images = typeof listingImages === 'string' 
        ? listingImages.split(',').filter(Boolean) 
        : Array.isArray(listingImages) 
          ? listingImages.filter(Boolean)
          : [];
          
      estimatedImageCount += images.length;
      estimatedStorage += images.length * 400 * 1024; // ~400KB per image estimate
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        membership: user.membership
      },
      storage: {
        actual: {
          bytes: totalStorageUsed,
          count: totalImageCount,
          mb: (totalStorageUsed / (1024 * 1024)).toFixed(2)
        },
        estimated: {
          bytes: estimatedStorage,
          count: estimatedImageCount,
          mb: (estimatedStorage / (1024 * 1024)).toFixed(2)
        }
      },
      metadata: metadata.map(item => ({
        url: item.url,
        size: item.size,
        listingId: item.listingId,
        createdAt: item.createdAt
      })),
      listings: userListings.map(listing => ({
        id: listing._id,
        title: listing.title,
        images: listing.images
      }))
    });
    
  } catch (error) {
    console.error('Error debugging storage:', error);
    return NextResponse.json(
      { error: 'Failed to debug storage' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

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

    // Get user's listings
    const { Listing } = await import('@/models/Listing');
    const userListings = await Listing.find({ userId: user._id }).select('images id').lean();

    // Get all image metadata for the user
    const metadata = await ImageMetadata.find({ userId: user._id.toString() }).lean();
    
    // Find orphaned metadata records (metadata without corresponding listing images)
    const orphanedRecords = [];
    const validUrls = new Set();
    
    // Collect all valid image URLs from listings
    for (const listing of userListings) {
      const listingImages = listing.images;
      const images = typeof listingImages === 'string' 
        ? listingImages.split(',').filter(Boolean) 
        : Array.isArray(listingImages) 
          ? listingImages.filter(Boolean)
          : [];
      
      images.forEach(url => validUrls.add(url));
    }
    
    // Find metadata records that don't correspond to any listing images
    for (const record of metadata) {
      if (!validUrls.has(record.url)) {
        orphanedRecords.push(record);
      }
    }

    // Delete orphaned records
    let deletedCount = 0;
    if (orphanedRecords.length > 0) {
      const deleteResult = await ImageMetadata.deleteMany({
        _id: { $in: orphanedRecords.map(r => r._id) }
      });
      deletedCount = deleteResult.deletedCount;
    }

    return NextResponse.json({
      message: 'Cleanup completed',
      orphanedRecords: orphanedRecords.length,
      deletedCount,
      orphanedUrls: orphanedRecords.map(r => r.url)
    });
    
  } catch (error) {
    console.error('Error cleaning up storage:', error);
    return NextResponse.json(
      { error: 'Failed to clean up storage' },
      { status: 500 }
    );
  }
}
