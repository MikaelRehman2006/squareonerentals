import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

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

export async function GET(request: NextRequest, { params }: Props) {
  // Make sure params.id is awaited before use
  const id = params?.id;
  if (!id) {
    return NextResponse.json(
      { error: 'Missing listing ID' },
      { status: 400 }
    )
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
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
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Parse and validate array fields
    const images = validateImageUrls(safeParseJSON(listing.images));
    const amenities = safeParseJSON(listing.amenities);
    const buildingAmenities = safeParseJSON(listing.buildingAmenities);

    // Format the response
    const parsedListing = {
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

    return NextResponse.json(parsedListing)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Missing listing ID' },
      { status: 400 }
    )
  }

  try {
    // Get user session to verify ownership
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Not logged in' },
        { status: 401 }
      )
    }

    console.log('Delete request for listing:', params.id);
    console.log('User session:', JSON.stringify({
      email: session.user.email,
      name: session.user.name
    }));

    // Check if listing exists 
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    console.log('Listing owner:', listing.user.email);

    // Only allow the listing owner or admin to delete
    const userEmail = session.user.email as string
    
    // Check if user is the owner or an admin
    const isOwner = listing.user.email?.toLowerCase() === userEmail?.toLowerCase();
    
    // Get user role from database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    })

    const isAdmin = user?.role === 'ADMIN'

    console.log('Authorization check:', { isOwner, isAdmin, userRole: user?.role });

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - you can only delete your own listings' },
        { status: 403 }
      )
    }

    // Delete the listing
    await prisma.listing.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Missing listing ID' },
      { status: 400 }
    )
  }

  try {
    console.log('Updating listing with ID:', params.id);
    
    // Get user session to verify ownership
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Only allow the listing owner or admin to update
    const userEmail = session.user.email as string
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, email: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is the owner or an admin
    const isOwner = listing.user.email === user.email
    const isAdmin = user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - you can only update your own listings' },
        { status: 403 }
      )
    }

    // Get update data from request
    let body;
    try {
      body = await request.json();
      console.log('Update data received:', JSON.stringify(body, null, 2));
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json(
        { error: 'Invalid request body - could not parse JSON' },
        { status: 400 }
      );
    }

    // Validate data structure
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Prepare data for database update - only include fields that exist in database
    const updateData: any = {};
    
    // Basic fields
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined && !isNaN(Number(body.price))) updateData.price = Number(body.price);
    if (body.location !== undefined) updateData.location = body.location;
    if (body.bedrooms !== undefined && !isNaN(Number(body.bedrooms))) updateData.bedrooms = Number(body.bedrooms);
    if (body.bathrooms !== undefined && !isNaN(Number(body.bathrooms))) updateData.bathrooms = Number(body.bathrooms);
    if (body.size !== undefined && !isNaN(Number(body.size))) updateData.size = Number(body.size);
    if (body.propertyType !== undefined) updateData.propertyType = body.propertyType;
    if (body.leaseType !== undefined) updateData.leaseType = body.leaseType;
    
    // Arrays that need to be stringified for storage
    if (body.amenities !== undefined) {
      try {
        updateData.amenities = Array.isArray(body.amenities) 
          ? JSON.stringify(body.amenities) 
          : JSON.stringify([]);
      } catch (e) {
        console.error('Error stringifying amenities:', e);
      }
    }
    
    if (body.buildingAmenities !== undefined) {
      try {
        updateData.buildingAmenities = Array.isArray(body.buildingAmenities) 
          ? JSON.stringify(body.buildingAmenities) 
          : JSON.stringify([]);
      } catch (e) {
        console.error('Error stringifying buildingAmenities:', e);
      }
    }
    
    if (body.images !== undefined) {
      try {
        updateData.images = Array.isArray(body.images) 
          ? JSON.stringify(validateImageUrls(body.images)) 
          : JSON.stringify([]);
      } catch (e) {
        console.error('Error stringifying images:', e);
      }
    }

    console.log('Prepared update data:', updateData);

    // Update the listing
    try {
      const updatedListing = await prisma.listing.update({
        where: { id: params.id },
        data: updateData
      });
      
      console.log('Listing updated successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Listing updated successfully',
        listing: updatedListing
      });
    } catch (dbError) {
      console.error('Database error updating listing:', dbError);
      return NextResponse.json(
        { error: 'Database error: ' + (dbError instanceof Error ? dbError.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 