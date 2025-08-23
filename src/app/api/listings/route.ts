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
  address: string; // Added address field
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
  phoneNumber?: string;
  facebookUrl?: string;
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
        // Ensure the URL is valid and only from allowed domains
        const parsedUrl = new URL(url);
        const allowedDomains = [
          'res.cloudinary.com',
          'cloudinary.com',
          'source.unsplash.com',
          'images.unsplash.com'
        ];
        
        if (allowedDomains.some(domain => parsedUrl.hostname.includes(domain))) {
          return url;
        }
        return '';
      } catch {
        return '';
      }
    })
    .filter(Boolean); // Remove any empty strings
};

// Add validation helper functions
const sanitizeString = (str: string): string => {
  if (!str) return '';
  // Remove potential HTML/script tags and limit length
  return str.replace(/<[^>]*>/g, '').substring(0, 1000);
};

const sanitizeNumber = (num: any): number => {
  const parsed = parseFloat(num);
  return isNaN(parsed) ? 0 : parsed;
};

const validateAddress = (address: string): string => {
  // Simple sanitization for addresses - remove potential HTML and scripts
  return sanitizeString(address);
};

// Sanitize listing input
const sanitizeListingInput = (data: any): IListingInput => {
  // Helper function to ensure we have an array
  const ensureArray = (value: any): string[] => {
    if (Array.isArray(value)) {
      return value.map(sanitizeString);
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(sanitizeString) : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  return {
    title: sanitizeString(data.title || ''),
    description: sanitizeString(data.description || ''),
    price: sanitizeNumber(data.price),
    location: sanitizeString(data.location || ''),
    address: validateAddress(data.address || ''),
    images: validateImageUrls(data.images || []),
    bedrooms: sanitizeNumber(data.bedrooms),
    bathrooms: sanitizeNumber(data.bathrooms),
    squareFeet: sanitizeNumber(data.squareFeet),
    amenities: ensureArray(data.amenities),
    buildingAmenities: ensureArray(data.buildingAmenities),
    features: ensureArray(data.features),
    utilities: ensureArray(data.utilities),
    propertyType: sanitizeString(data.propertyType || ''),
    listingType: sanitizeString(data.listingType || ''),
    leaseType: sanitizeString(data.leaseType || ''),
    availableDate: data.availableDate ? new Date(data.availableDate) : new Date(),
    status: ['ACTIVE', 'PENDING', 'INACTIVE', 'ARCHIVED'].includes(data.status) ? data.status : 'ACTIVE',
    featured: Boolean(data.featured),
    userId: data.userId,
    phoneNumber: sanitizeString(data.phoneNumber || ''),
    facebookUrl: sanitizeString(data.facebookUrl || '')
  };
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
    const {
      title,
      description,
      price,
      location,
      address,
      images,
      bedrooms,
      bathrooms,
      squareFeet,
      amenities,
      buildingAmenities,
      features,
      utilities,
      propertyType,
      listingType,
      leaseType,
      availableDate,
      phoneNumber,
      facebookUrl
    } = body;

    // Validate required fields
    if (!title || !description || !price || !location || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that at least one image is provided
    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    // Create the listing
    const listing = new Listing({
      title,
      description,
      price,
      location,
      address,
      images: images || [],
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      squareFeet: squareFeet || 0,
      amenities: amenities || [],
      buildingAmenities: buildingAmenities || [],
      features: features || {},
      utilities: utilities || {},
      propertyType: propertyType || 'Apartment',
      listingType: listingType || 'RENT',
      leaseType: leaseType || 'FULL',
      availableDate: availableDate ? new Date(availableDate + 'T00:00:00') : new Date(),
      status: 'ACTIVE',
      featured: false,
      userId: user._id,
      phoneNumber,
      facebookUrl
    });

    await listing.save();

    // Update image metadata records with the listing ID
    if (images && images.length > 0) {
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

        // Update metadata records for the uploaded images
        const updateResult = await ImageMetadata.updateMany(
          { 
            userId: user._id.toString(),
            url: { $in: images },
            listingId: { $exists: false } // Only update records without listingId
          },
          { listingId: listing._id.toString() }
        );

        console.log(`Updated ${updateResult.modifiedCount} image metadata records with listing ID ${listing._id}`);
      } catch (metadataError) {
        console.error('Error updating image metadata:', metadataError);
        // Continue even if metadata update fails
      }
    }

    return NextResponse.json({
      message: 'Listing created successfully',
      listing: {
        id: listing._id,
        title: listing.title,
        status: listing.status
      }
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