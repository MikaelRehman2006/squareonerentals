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
    
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set in environment variables');
      return NextResponse.json(
        { error: 'Database configuration is missing' },
        { status: 500 }
      );
    }
    
    // Connect to MongoDB
    try {
      console.log('Attempting MongoDB connection...');
      await connectDB();
      console.log('MongoDB connection successful');
    } catch (dbError: any) {
      console.error('MongoDB connection failed:', {
        message: dbError.message,
        code: dbError.code,
        name: dbError.name,
        stack: dbError.stack
      });
      return NextResponse.json(
        { error: `Database connection failed: ${dbError.message}` },
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

    console.log('Executing MongoDB query:', JSON.stringify(query));

    // Get total count for pagination
    const total = await Listing.countDocuments(query);

    // Execute query with pagination
    const listings = await Listing.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .lean();

    console.log(`Found ${listings.length} listings`);

    return NextResponse.json({
      listings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/listings:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    return NextResponse.json(
      { error: `Failed to fetch listings: ${error.message}` },
      { status: 500 }
    );
  } finally {
    // Don't disconnect as it might affect other requests
    // await disconnectDB();
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/listings: Starting request');
    
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
    // Don't disconnect as it might affect other requests
    // await disconnectDB();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set in environment variables');
      return NextResponse.json(
        { error: 'Database configuration is missing' },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Extract listingId from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const listingId = pathParts[pathParts.length - 1];

    if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validate input
    if (!data) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    // Find the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (listing.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only update your own listings' },
        { status: 403 }
      );
    }

    // Process image URLs
    if (data.images) {
      data.images = validateImageUrls(data.images);
    }

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    return NextResponse.json(updatedListing);
  } catch (error: any) {
    console.error('Error in PATCH /api/listings:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    return NextResponse.json(
      { error: `Failed to update listing: ${error.message}` },
      { status: 500 }
    );
  } finally {
    // Don't disconnect as it might affect other requests
    // await disconnectDB();
  }
}