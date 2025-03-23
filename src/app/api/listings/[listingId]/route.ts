import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Listing } from '@/models/Listing';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import { User } from '@/models/User';

type Props = {
  params: { listingId: string };
};

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
const validateImageUrls = (images: string[]): string[] => {
  return images.filter((url) => url.startsWith('http'));
};

// Helper function to get user data safely
const getUserData = async (userId: mongoose.Types.ObjectId | any) => {
  if (userId instanceof mongoose.Types.ObjectId) {
    const user = await User.findById(userId).lean();
    if (user) {
      return {
        id: user._id.toString(),
        name: user.name || null,
        email: user.email || null,
        image: user.image || null,
      };
    }
  }
  return null;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const listing = await Listing.findById(params.listingId)
      .populate('userId')
      .lean();

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Ensure user owns this listing
    if (listing.userId._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Format the listing data
    const formattedListing = {
      id: listing._id.toString(),
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      propertyType: listing.propertyType,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      amenities: listing.amenities,
      images: validateImageUrls(safeParseJSON(listing.images)),
      userId: await getUserData(listing.userId),
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    };

    return NextResponse.json(formattedListing);
  } catch (error) {
    console.error('Error in GET /api/listings/[listingId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const listing = await Listing.findById(params.listingId);

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Ensure user owns this listing
    if (listing.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    Object.assign(listing, data);
    await listing.save();

    // Format the updated listing
    const formattedListing = {
      id: listing._id.toString(),
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      propertyType: listing.propertyType,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      amenities: listing.amenities,
      images: validateImageUrls(safeParseJSON(listing.images)),
      userId: await getUserData(listing.userId),
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    };

    return NextResponse.json(formattedListing);
  } catch (error) {
    console.error('Error in PATCH /api/listings/[listingId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update listing' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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
    if (listing.userId.toString() !== session.user.id) {
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
