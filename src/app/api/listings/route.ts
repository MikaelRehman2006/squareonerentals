import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Listing } from '@/models/Listing';
import { User } from '@/models/User';
import { connectDB, disconnectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

interface IListingInput {
  _id?: mongoose.Types.ObjectId;
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
  features: string[];
  utilities: string[];
  propertyType: string;
  listingType: string;
  leaseType: string;
  availableDate: Date;
  status: string;
  featured: boolean;
  userId: mongoose.Types.ObjectId;
}

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
    console.log('GET /api/listings: Starting request');
    
    // Connect to MongoDB
    try {
      await connectDB();
      console.log('MongoDB connection successful');
    } catch (dbError) {
      console.error('MongoDB connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const propertyType = searchParams.get('propertyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minBedrooms = searchParams.get('minBedrooms');
    const location = searchParams.get('location');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    console.log('Query parameters:', { featured, propertyType, minPrice, maxPrice, page, limit });

    // Create query object
    const query: any = { status: 'ACTIVE' }; // Only show active listings by default

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

    console.log('Final query:', JSON.stringify(query));

    // Fetch listings with error handling
    let listings;
    try {
      listings = await Listing.find(query)
        .populate('userId', 'name email image')
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      console.log(`Found ${listings.length} listings`);
    } catch (findError) {
      console.error('Error finding listings:', findError);
      return NextResponse.json(
        { error: 'Failed to fetch listings from database' },
        { status: 500 }
      );
    }

    // Format listings for response
    const formattedListings = listings.map(listing => ({
      id: listing._id?.toString(),
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      images: Array.isArray(listing.images) ? listing.images : [],
      amenities: Array.isArray(listing.amenities) ? listing.amenities : [],
      buildingAmenities: Array.isArray(listing.buildingAmenities) ? listing.buildingAmenities : [],
      features: listing.features || [],
      utilities: listing.utilities || [],
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      squareFeet: listing.squareFeet,
      propertyType: listing.propertyType,
      listingType: listing.listingType,
      leaseType: listing.leaseType || 'FIXED',
      availableDate: listing.availableDate,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      userId: listing.userId?._id?.toString() || '',
      status: listing.status,
      featured: !!listing.featured,
      userName: listing.userId?.name || 'Anonymous',
      userEmail: listing.userId?.email,
      userImage: listing.userId?.image
    }));

    const total = await Listing.countDocuments(query);

    return NextResponse.json({
      listings: formattedListings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error in GET /api/listings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch listings' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Ensure required fields are present
    if (!body.listingType) {
      return NextResponse.json(
        { error: 'listingType is required' },
        { status: 400 }
      );
    }

    if (!body.leaseType) {
      return NextResponse.json(
        { error: 'leaseType is required' },
        { status: 400 }
      );
    }

    if (!body.squareFeet) {
      return NextResponse.json(
        { error: 'Square footage is required' },
        { status: 400 }
      );
    }

    if (!body.availableDate) {
      return NextResponse.json(
        { error: 'Available date is required' },
        { status: 400 }
      );
    }

    // Convert features and utilities to arrays
    const features = Array.isArray(body.features) ? body.features : [];
    const utilities = Array.isArray(body.utilities) ? body.utilities : [];

    // Create the listing
    const data: IListingInput = {
      title: body.title,
      description: body.description,
      price: Number(body.price),
      location: body.location,
      images: Array.isArray(body.images) ? validateImageUrls(body.images) : [],
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      squareFeet: Number(body.squareFeet),
      amenities: safeParseJSON(body.amenities),
      buildingAmenities: safeParseJSON(body.buildingAmenities),
      features,
      utilities,
      propertyType: body.propertyType,
      listingType: body.listingType,
      leaseType: body.leaseType,
      availableDate: new Date(body.availableDate),
      status: body.status,
      featured: body.featured,
      userId: user._id,
    };

    const listing = new Listing(data);

    await listing.save();

    return NextResponse.json({ 
      message: 'Listing created successfully',
      id: listing._id?.toString()
    });
  } catch (error) {
    console.error('Error in POST /api/listings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create listing' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { listingId } = request.params;

    // Ensure required fields are present
    if (!body.listingType) {
      return NextResponse.json(
        { error: 'listingType is required' },
        { status: 400 }
      );
    }

    if (!body.leaseType) {
      return NextResponse.json(
        { error: 'leaseType is required' },
        { status: 400 }
      );
    }

    if (!body.squareFeet) {
      return NextResponse.json(
        { error: 'Square footage is required' },
        { status: 400 }
      );
    }

    if (!body.availableDate) {
      return NextResponse.json(
        { error: 'Available date is required' },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (listing.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Convert features and utilities to arrays
    const features = Array.isArray(body.features) ? body.features : [];
    const utilities = Array.isArray(body.utilities) ? body.utilities : [];

    // Update the listing
    const data: IListingInput = {
      title: body.title,
      description: body.description,
      price: body.price,
      location: body.location,
      images: body.images,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      squareFeet: body.squareFeet,
      amenities: body.amenities,
      buildingAmenities: body.buildingAmenities,
      features,
      utilities,
      propertyType: body.propertyType,
      listingType: body.listingType,
      leaseType: body.leaseType,
      availableDate: new Date(body.availableDate),
      status: body.status,
      featured: body.featured,
      userId: user._id,
    };

    await Listing.findByIdAndUpdate(listingId, data);

    return NextResponse.json({ message: 'Listing updated successfully' });
  } catch (error) {
    console.error('Error in PATCH /api/listings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update listing' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}