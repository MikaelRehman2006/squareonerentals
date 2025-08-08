import { NextRequest, NextResponse } from 'next/server';
import { Listing } from '@/models/Listing';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import { User } from '@/models/User';
import { connectDB, disconnectDB } from '@/lib/mongodb';
import { notifyFavoritedListingChange, notifyAdminStatusChange } from '@/lib/notification';

type Props = {
  params: { listingId: string };
};

interface ListingData {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string; // Added address field
  images: string[];
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  amenities: string[];
  buildingAmenities: string[];
  features: any;
  utilities: any;
  propertyType: string;
  listingType: string;
  leaseType: string;
  availableDate: Date;
  status: string;
  featured: boolean;
  userId: any;
  phoneNumber?: string;
  facebookUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to safely parse JSON or return default
const safeParseJSON = (str: string | null | undefined, defaultValue: any[] = []): any[] => {
  if (!str) return defaultValue;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch {
    // If JSON parsing fails, try splitting by comma
    return typeof str === 'string' 
      ? str.split(',').map((item) => item.trim())
      : defaultValue;
  }
};

// Helper function to validate image URLs
const validateImageUrls = (images: string | string[]): string[] => {
  if (!images) return [];
  const imageArray = Array.isArray(images) ? images : [images];
  return imageArray.filter((url) => {
    // Accept both remote URLs (http/https) and local paths (/uploads/)
    return url && (url.startsWith('http') || url.startsWith('/uploads/'));
  });
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Validate listingId
    if (!mongoose.Types.ObjectId.isValid(params.listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(params.listingId)
      .populate('userId')
      .lean() as ListingData;

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // If listing is not active, only allow access to the owner
    if (listing.status !== 'ACTIVE') {
      if (!session?.user?.email) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const user = await User.findOne({ email: session.user.email });
      if (!user || user._id.toString() !== listing.userId._id.toString()) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Format the listing data
    const formattedListing = {
      id: listing._id.toString(),
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      images: listing.images,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      squareFeet: listing.squareFeet,
      amenities: listing.amenities,
      buildingAmenities: listing.buildingAmenities,
      features: listing.features,
      utilities: listing.utilities,
      propertyType: listing.propertyType,
      listingType: listing.listingType,
      leaseType: listing.leaseType,
      availableDate: listing.availableDate,
      status: listing.status,
      featured: listing.featured,
      userId: listing.userId._id.toString(),
      phoneNumber: listing.phoneNumber || '',
      facebookUrl: listing.facebookUrl || '',
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt
    };

    return NextResponse.json(formattedListing);
  } catch (error) {
    console.error('Error in GET /api/listings/[listingId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch listing' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const listingId = params.listingId;
    // Fetch the original listing to compare changes later
    const originalListing = await Listing.findById(listingId).lean() as ListingData;
    
    if (!originalListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check if user owns the listing
    if (originalListing.userId.toString() !== user._id.toString()) {
      // Check if the user is an admin - admins can edit any listing
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();

    // Validate status
    if (body.status && !['ACTIVE', 'ARCHIVED'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be either ACTIVE or ARCHIVED' },
        { status: 400 }
      );
    }

    // Log what we received in the edit request
    console.log('Edit listing received data:', {
      address: body.address,
      images: Array.isArray(body.images) ? `${body.images.length} images` : typeof body.images,
      features: typeof body.features,
      amenities: typeof body.amenities,
      buildingAmenities: typeof body.buildingAmenities
    });

    // More robust processing of received data
    const images = validateImageUrls(body.images || []);
    console.log('Processed images for edit:', images.length, 'valid images');
    
    // Ensure we have the address field 
    const address = body.address || ''; 
    console.log('Address for edit:', address);
    
    // Update the listing with improved handling
    const data = {
      title: body.title,
      description: body.description,
      price: Number(body.price) || 0,
      location: body.location,
      // Explicitly include address 
      address: address,
      images: images,
      bedrooms: Number(body.bedrooms) || 0,
      bathrooms: Number(body.bathrooms) || 0,
      squareFeet: Number(body.squareFeet) || 0,
      amenities: typeof body.amenities === 'string' ? safeParseJSON(body.amenities) : (body.amenities || []),
      buildingAmenities: typeof body.buildingAmenities === 'string' ? safeParseJSON(body.buildingAmenities) : (body.buildingAmenities || []),
      features: typeof body.features === 'string' ? safeParseJSON(body.features) : (body.features || []),
      utilities: typeof body.utilities === 'string' ? safeParseJSON(body.utilities) : (body.utilities || []),
      propertyType: body.propertyType,
      listingType: body.listingType,
      leaseType: body.leaseType,
      availableDate: new Date(body.availableDate),
      status: body.status ? body.status.toUpperCase() : 'ACTIVE',
      featured: body.featured || false,
      phoneNumber: body.phoneNumber || '',
      facebookUrl: body.facebookUrl || '',
      updatedAt: new Date()
    };
    
    console.log('Final listing data for update:', {
      address: data.address,
      images: data.images.length,
      features: Array.isArray(data.features) ? data.features.length : typeof data.features,
      utilities: Array.isArray(data.utilities) ? data.utilities.length : typeof data.utilities
    });

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      data,
      { new: true, runValidators: true }
    ).lean() as ListingData;

    if (!updatedListing) {
      return NextResponse.json(
        { error: 'Failed to update listing' },
        { status: 500 }
      );
    }

    // Format the response
    const formattedListing = {
      id: updatedListing._id.toString(),
      ...data,
      userId: user._id.toString(),
      createdAt: updatedListing.createdAt,
    };

    // Send notifications in background (non-blocking)
    try {
      // Case 1: Admin changed the listing status (notify the listing owner)
      if (session.user.role === 'ADMIN' && 
          originalListing.status !== data.status && 
          originalListing.userId.toString() !== user._id.toString()) {
        
        notifyAdminStatusChange(
          listingId,
          originalListing.status,
          data.status,
          originalListing.userId.toString(),
          user._id.toString()
        );
      }

      console.log(`Attempting to notify users about changes to listing ${listingId}`);
      
      // Case 2: Any changes to the listing (notify users who favorited it)
      const notificationResult = await notifyFavoritedListingChange(
        listingId,
        originalListing,
        updatedListing,
        user._id.toString()
      );
      
      console.log(`Notification result for listing ${listingId}:`, 
        notificationResult ? `${Array.isArray(notificationResult) ? notificationResult.length : 1} notifications sent` : 'No notifications sent');
    } catch (notificationError) {
      // Log but don't interrupt the response flow
      console.error('Error sending notifications:', notificationError);
    }

    return NextResponse.json(formattedListing);
  } catch (error) {
    console.error('Error in PATCH /api/listings/[listingId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update listing' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const listing = await Listing.findById(params.listingId);

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Ensure user owns this listing
    const user = await User.findOne({ email: session.user.email });
    if (!user || user._id.toString() !== listing.userId.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Clean up image metadata before deleting the listing
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

      // Get the listing's image URLs
      const listingImages = listing.images as string | string[] | undefined;
      const images = Array.isArray(listingImages) 
        ? listingImages 
        : typeof listingImages === 'string' 
          ? listingImages.split(',').filter(Boolean)
          : [];

      // Delete metadata records that match the listing's image URLs
      let deletedCount = 0;
      if (images.length > 0) {
        const deleteResult = await ImageMetadata.deleteMany({
          url: { $in: images }
        });
        deletedCount = deleteResult.deletedCount;
      }

      // Also delete metadata records with this listingId (for records that were properly associated)
      const deleteByListingIdResult = await ImageMetadata.deleteMany({ listingId: params.listingId });
      deletedCount += deleteByListingIdResult.deletedCount;

      console.log(`Deleted ${deletedCount} image metadata records for listing ${params.listingId}`);
    } catch (metadataError) {
      console.error('Error cleaning up image metadata:', metadataError);
      // Continue with listing deletion even if metadata cleanup fails
    }

    await listing.deleteOne();
    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/listings/[listingId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
