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
    
    // Check if user has an active membership
    if (!user.membership || user.membership.status !== 'active') {
      return NextResponse.json(
        { error: 'Active membership required to create listings', redirectUrl: '/memberships' },
        { status: 403 }
      );
    }
    
    // Check if membership has expired
    if (user.membership.endDate && new Date(user.membership.endDate) < new Date()) {
      return NextResponse.json(
        { error: 'Your membership has expired. Please renew to create listings', redirectUrl: '/memberships' },
        { status: 403 }
      );
    }
    
    // Check for listing limits - both membership types are limited to 1 listing
    const activeListingsCount = await Listing.countDocuments({ 
      userId: user._id, 
      status: 'ACTIVE' 
    });
    
    console.log(`User has ${activeListingsCount} active listings with ${user.membership.type} membership`);
    
    if (activeListingsCount >= 1) {
      return NextResponse.json(
        { 
          error: 'Your membership allows only one active listing at a time. Please archive your existing listing before creating a new one.',
          redirectUrl: '/dashboard'
        },
        { status: 403 }
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

    // Log what we're receiving from the client
    console.log('Received request body for new listing:', {
      address: body.address,
      images: Array.isArray(body.images) ? `${body.images.length} images` : typeof body.images,
      amenities: body.amenities,
      buildingAmenities: body.buildingAmenities,
      features: body.features,
      utilities: body.utilities
    });
    
    // Check if user has Featured membership to automatically set listing as featured
    const hasFeaturedMembership = user.membership?.type === 'FEATURED' && user.membership.status === 'active';
    
    // Sanitize and validate all input data
    const sanitizedData = sanitizeListingInput({
      ...body,
      userId: user._id,
      featured: hasFeaturedMembership ? true : (body.featured || false)
    });
    
    console.log('Sanitized listing data:', {
      title: sanitizedData.title,
      address: sanitizedData.address,
      images: sanitizedData.images.length
    });

    const listing = new Listing(sanitizedData);

    await listing.save();

    // Try to post to Facebook if integration is configured
    if (process.env.FACEBOOK_AUTO_POST === 'true' && process.env.FACEBOOK_ACCESS_TOKEN && (process.env.FACEBOOK_PAGE_ID || process.env.FACEBOOK_GROUP_ID)) {
      try {
        console.log('Facebook auto-post triggered for listing:', listing._id.toString());
        
        // Prepare message for Facebook post
        const listingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.squareonerentals.com'}/listings/${listing._id}`;
        const message = `🏠 New Listing: ${sanitizedData.title}\n\n💰 Price: $${sanitizedData.price}/month\n📍 Location: ${sanitizedData.location}\n\n${sanitizedData.description.substring(0, 200)}${sanitizedData.description.length > 200 ? '...' : ''}\n\nView full listing: ${listingUrl}`;

        // Get the first image if available
        const imageUrl = sanitizedData.images && sanitizedData.images.length > 0 ? sanitizedData.images[0] : undefined;

        const postData = {
          message,
          link: listingUrl,
          listingId: listing._id.toString(),
          title: sanitizedData.title,
          price: sanitizedData.price,
          location: sanitizedData.location,
          imageUrl
        };
        
        console.log('Calling Facebook API with post data:', JSON.stringify(postData));

        // Post to Facebook
        const fbResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/facebook/post-to-group`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
        });

        const fbResult = await fbResponse.json();
        console.log('Facebook API response status:', fbResponse.status);
        
        if (!fbResponse.ok) {
          console.error('Failed to post to Facebook:', fbResult);
          // Don't return an error, just log it - the listing was still created successfully
        } else {
          console.log('Successfully posted to Facebook:', fbResult);
        }
      } catch (fbError) {
        console.error('Error posting to Facebook:', fbError);
        // Don't return an error, just log it - the listing was still created successfully
      }
    } else {
      console.log('Facebook auto-post not triggered. Environment check:', {
        autoPostEnabled: process.env.FACEBOOK_AUTO_POST === 'true',
        hasAccessToken: !!process.env.FACEBOOK_ACCESS_TOKEN,
        hasPageId: !!process.env.FACEBOOK_PAGE_ID,
        hasGroupId: !!process.env.FACEBOOK_GROUP_ID
      });
    }

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