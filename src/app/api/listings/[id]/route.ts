import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import mongoose from 'mongoose'
import { User, IUser } from '@/models/User'

type Props = {
  params: { id: string }
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
      ? str.split(',').filter(Boolean).map(item => item.trim())
      : defaultValue;
  }
};

// Helper function to validate image URLs
const validateImageUrls = (images: string[]): string[] => {
  return images
    .filter(url => url && typeof url === 'string')
    .map(url => {
      try {
        // Check if URL is already absolute
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }
        // If not, assume it's a relative path and make it absolute
        return `https://squareonerentals.com${url.startsWith('/') ? '' : '/'}${url}`;
      } catch {
        return '';
      }
    })
    .filter(Boolean); // Remove any empty strings
};

// Helper function to get user data safely
const getUserData = (userId: mongoose.Types.ObjectId | IUser) => {
  if ('name' in userId) {
    return {
      id: userId._id.toString(),
      name: userId.name || 'Anonymous',
      email: userId.email || '',
      image: userId.image || '',
    };
  }
  return {
    id: userId.toString(),
    name: 'Anonymous',
    email: '',
    image: '',
  };
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    
    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(id).populate('userId', 'name email image');
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Parse and validate array fields
    const images = validateImageUrls(listing.images);
    const amenities = listing.amenities || [];
    const buildingAmenities = listing.buildingAmenities || [];
    const features = listing.features || [];
    const utilities = listing.utilities || [];

    // Format the response
    const userData = getUserData(listing.userId);
    const parsedListing = {
      id: listing._id.toString(),
      title: listing.title,
      description: listing.description,
      price: Number(listing.price),
      location: listing.location,
      address: listing.location, // Use location as address for now
      images,
      amenities,
      buildingAmenities,
      features,
      utilities,
      bedrooms: Number(listing.bedrooms),
      bathrooms: Number(listing.bathrooms),
      squareFeet: Number(listing.size || 0),
      propertyType: listing.propertyType || 'APARTMENT',
      listingType: listing.leaseType || 'LONG_TERM',
      availableFrom: listing.availableDate,
      parking: 'Available', // Default parking value
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      userId: userData.id,
      status: listing.status || 'AVAILABLE',
      featured: Boolean(listing.featured),
      userName: userData.name,
      userEmail: userData.email,
      userImage: userData.image,
      user: userData,
    };

    return NextResponse.json(parsedListing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
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

    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
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

    // Get the listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check if the user owns the listing
    if (listing.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await listing.deleteOne();

    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
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

    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
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

    // Get the listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check if the user owns the listing
    if (listing.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();

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

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
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
        status: body.status || 'ACTIVE',
        featured: Boolean(body.featured),
      },
      { new: true }
    ).populate('userId');

    if (!updatedListing) {
      return NextResponse.json(
        { error: 'Failed to update listing' },
        { status: 500 }
      );
    }

    // Format the response
    const userData = getUserData(updatedListing.userId);
    const formattedListing = {
      id: updatedListing._id.toString(),
      title: updatedListing.title,
      description: updatedListing.description,
      price: Number(updatedListing.price),
      location: updatedListing.location,
      images: updatedListing.images,
      amenities: updatedListing.amenities,
      buildingAmenities: updatedListing.buildingAmenities,
      features: updatedListing.features,
      utilities: updatedListing.utilities,
      bedrooms: Number(updatedListing.bedrooms),
      bathrooms: Number(updatedListing.bathrooms),
      squareFeet: Number(updatedListing.size || 0),
      propertyType: updatedListing.propertyType,
      listingType: updatedListing.leaseType,
      availableFrom: updatedListing.availableDate,
      createdAt: updatedListing.createdAt,
      updatedAt: updatedListing.updatedAt,
      userId: userData.id,
      status: updatedListing.status,
      featured: updatedListing.featured,
      userName: userData.name,
      userEmail: userData.email,
      userImage: userData.image,
      user: userData,
    };

    return NextResponse.json(formattedListing);
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}