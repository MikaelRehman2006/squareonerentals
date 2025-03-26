import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Listing } from '@/models/Listing';
import { User } from '@/models/User';
import { connectDB, disconnectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

interface IListing {
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
  createdAt: Date;
  updatedAt: Date;
  userId: {
    _id: mongoose.Types.ObjectId;
  };
}

export async function GET(request: NextRequest) {
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

    const listings = await Listing.find({ userId: user._id })
      .populate('userId')
      .lean() as IListing[];

    // Transform the data to match frontend expectations
    const formattedListings = listings.map(listing => ({
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
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      userId: listing.userId._id.toString(),
    }));

    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error('Error in GET /api/listings/me:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch listings' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}
