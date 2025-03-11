import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    // Build where clause based on query parameters
    const where: any = {};
    if (featured) where.featured = true;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Process each listing to handle arrays and validate URLs
    const processedListings = listings.map(listing => {
      const images = validateImageUrls(safeParseJSON(listing.images));
      const amenities = safeParseJSON(listing.amenities);
      const buildingAmenities = safeParseJSON(listing.buildingAmenities);

      return {
        ...listing,
        images,
        amenities,
        buildingAmenities,
        price: Number(listing.price),
        size: Number(listing.size),
        bedrooms: Number(listing.bedrooms),
        bathrooms: Number(listing.bathrooms),
        featured: Boolean(listing.featured),
        // Add default values for optional fields
        status: listing.status || 'AVAILABLE',
        propertyType: listing.propertyType || 'APARTMENT',
        leaseType: listing.leaseType || 'LONG_TERM',
        user: {
          ...listing.user,
          image: listing.user.image || null,
        },
      };
    });

    return NextResponse.json(processedListings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Get the user's ID from their email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate and process arrays before saving
    const processedImages = validateImageUrls(
      Array.isArray(body.images) ? body.images : safeParseJSON(body.images)
    );
    
    const processedAmenities = Array.isArray(body.amenities) 
      ? body.amenities 
      : safeParseJSON(body.amenities);
    
    const processedBuildingAmenities = Array.isArray(body.buildingAmenities) 
      ? body.buildingAmenities 
      : safeParseJSON(body.buildingAmenities);

    const listing = await prisma.listing.create({
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        location: body.location,
        images: JSON.stringify(processedImages),
        bedrooms: Number(body.bedrooms),
        bathrooms: Number(body.bathrooms),
        size: Number(body.size),
        amenities: JSON.stringify(processedAmenities),
        buildingAmenities: JSON.stringify(processedBuildingAmenities),
        propertyType: body.propertyType || 'APARTMENT',
        leaseType: body.leaseType || 'LONG_TERM',
        status: body.status || 'AVAILABLE',
        featured: Boolean(body.featured),
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}