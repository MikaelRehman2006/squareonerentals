import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User, IUser } from '@/models/User';
import { Listing, IListing } from '@/models/Listing';

export async function GET(
  request: NextRequest,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's listings
    const listings = await Listing.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean() as IListing[];

    const formattedListings = listings.map(listing => ({
      id: listing._id.toString(),
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      images: listing.images,
      amenities: listing.amenities,
      buildingAmenities: listing.buildingAmenities,
      features: listing.features,
      utilities: listing.utilities,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      squareFeet: listing.size,
      propertyType: listing.propertyType,
      listingType: listing.leaseType,
      availableFrom: listing.availableDate,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      status: listing.status,
      featured: listing.featured,
    }));

    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error('Error in GET /api/listings/user/[userId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user listings' },
      { status: 500 }
    );
  }
}
