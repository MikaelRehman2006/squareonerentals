import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User, IUser } from '@/models/User';
import { Listing, IListing } from '@/models/Listing';
import mongoose from 'mongoose';

const safeParseJSON = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
};

const validateImageUrls = (urls: string[] = []): string[] => {
  return urls
    .map(url => {
      try {
        new URL(url);
        return url;
      } catch {
        return '';
      }
    })
    .filter(Boolean); // Remove any empty strings
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const propertyType = searchParams.get('propertyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minBedrooms = searchParams.get('minBedrooms');
    const location = searchParams.get('location');

    const query: any = { status: 'ACTIVE' };

    if (featured) {
      query.featured = true;
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minBedrooms) {
      query.bedrooms = { $gte: Number(minBedrooms) };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const listings = await Listing.find(query)
      .populate<{ userId: IUser }>('userId', 'name email image')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean() as (IListing & { userId: IUser })[];

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
      userId: listing.userId._id.toString(),
      status: listing.status,
      featured: listing.featured,
      userName: listing.userId.name || 'Anonymous',
      userEmail: listing.userId.email || '',
      userImage: listing.userId.image || '',
    }));

    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error('Error in GET /api/listings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    if (!session?.user?.email) {
      console.error('No session or email found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);

    // Get or create the user
    let user = await User.findOne({ email: session.user.email });

    if (!user) {
      console.log('Creating new user...');
      try {
        user = await User.create({
          email: session.user.email,
          name: session.user.name || 'Anonymous',
          image: session.user.image || '',
          role: 'USER',
          favorites: [],
        });
        console.log('Created user:', user);
      } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
    }

    // Process arrays before saving
    const processedImages = validateImageUrls(
      Array.isArray(body.images) ? body.images : safeParseJSON(body.images)
    );
    
    const processedAmenities = Array.isArray(body.amenities) 
      ? body.amenities 
      : safeParseJSON(body.amenities);
    
    const processedBuildingAmenities = Array.isArray(body.buildingAmenities) 
      ? body.buildingAmenities 
      : safeParseJSON(body.buildingAmenities);

    const processedFeatures = Array.isArray(body.features)
      ? body.features
      : safeParseJSON(body.features);

    const processedUtilities = Array.isArray(body.utilities)
      ? body.utilities
      : safeParseJSON(body.utilities);

    const listingData: Omit<IListing, '_id' | 'createdAt' | 'updatedAt'> = {
      title: body.title,
      description: body.description,
      price: Number(body.price),
      location: body.location,
      images: processedImages,
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      size: Number(body.squareFeet),
      amenities: processedAmenities,
      buildingAmenities: processedBuildingAmenities,
      features: processedFeatures,
      utilities: processedUtilities,
      propertyType: body.propertyType || 'APARTMENT',
      leaseType: body.listingType || 'LONG_TERM',
      availableDate: body.availableFrom ? new Date(body.availableFrom) : new Date(),
      status: 'ACTIVE',
      featured: Boolean(body.featured),
      userId: user._id,
      favoritedBy: [],
    };

    const listing = await Listing.create(listingData);
    console.log('Created listing:', listing);

    const populatedListing = await Listing.findById(listing._id)
      .populate<{ userId: IUser }>('userId')
      .lean() as (IListing & { userId: IUser });

    if (!populatedListing) {
      throw new Error('Failed to create listing');
    }

    // Format the response
    const formattedListing = {
      id: populatedListing._id.toString(),
      title: populatedListing.title,
      description: populatedListing.description,
      price: populatedListing.price,
      location: populatedListing.location,
      images: populatedListing.images,
      amenities: populatedListing.amenities,
      buildingAmenities: populatedListing.buildingAmenities,
      features: populatedListing.features,
      utilities: populatedListing.utilities,
      bedrooms: populatedListing.bedrooms,
      bathrooms: populatedListing.bathrooms,
      squareFeet: populatedListing.size,
      propertyType: populatedListing.propertyType,
      listingType: populatedListing.leaseType,
      availableFrom: populatedListing.availableDate,
      createdAt: populatedListing.createdAt,
      updatedAt: populatedListing.updatedAt,
      userId: populatedListing.userId._id.toString(),
      status: populatedListing.status,
      featured: populatedListing.featured,
      userName: populatedListing.userId.name || 'Anonymous',
      userEmail: populatedListing.userId.email || '',
      userImage: populatedListing.userId.image || '',
    };

    return NextResponse.json(formattedListing);

  } catch (error) {
    console.error('Error in POST /api/listings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create listing' },
      { status: 500 }
    );
  }
}