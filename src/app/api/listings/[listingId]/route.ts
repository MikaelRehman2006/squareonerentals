import { NextRequest, NextResponse } from 'next/server';
import { Listing } from '@/models/Listing';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import { User } from '@/models/User';
import { connectDB, disconnectDB } from '@/lib/mongodb';

type Props = {
  params: { listingId: string };
};

interface ListingData {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  location: string;
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
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check if user owns the listing
    if (listing.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate status
    if (body.status && !['ACTIVE', 'ARCHIVED'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be either ACTIVE or ARCHIVED' },
        { status: 400 }
      );
    }

    // Update the listing
    const data = {
      title: body.title,
      description: body.description,
      price: Number(body.price),
      location: body.location,
      images: validateImageUrls(body.images),
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      squareFeet: Number(body.squareFeet),
      amenities: safeParseJSON(body.amenities),
      buildingAmenities: safeParseJSON(body.buildingAmenities),
      features: safeParseJSON(body.features),
      utilities: safeParseJSON(body.utilities),
      propertyType: body.propertyType,
      listingType: body.listingType,
      leaseType: body.leaseType,
      availableDate: new Date(body.availableDate),
      status: body.status.toUpperCase(),
      featured: body.featured,
      phoneNumber: body.phoneNumber || '',
      facebookUrl: body.facebookUrl || '',
      updatedAt: new Date()
    };

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
