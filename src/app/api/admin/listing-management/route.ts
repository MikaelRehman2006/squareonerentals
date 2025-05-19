import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Listing } from '@/models/Listing';
import { getAdminRole } from '@/lib/admin';

// GET all listings (admin access)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin role
    const adminRole = getAdminRole(session.user.email);
    if (!adminRole) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const listingId = url.searchParams.get('id');

    await connectDB();

    // If listingId is provided, return a specific listing
    if (listingId) {
      const listing = await Listing.findById(listingId).populate('userId', 'name email');
      
      if (!listing) {
        return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
      }
      
      return NextResponse.json(listing);
    }

    // Otherwise, return all listings
    const listings = await Listing.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error in GET /api/admin/listing-management:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// PATCH to update a listing (admin access)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin role
    const adminRole = getAdminRole(session.user.email);
    if (!adminRole) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id, status } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing listing ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    listing.status = status;
    await listing.save();

    return NextResponse.json({
      message: 'Listing updated successfully',
      listing: {
        id: listing._id.toString(),
        status: listing.status,
      },
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/listing-management:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

// DELETE a listing (admin access)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin role
    const adminRole = getAdminRole(session.user.email);
    if (!adminRole) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing listing ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    await listing.deleteOne();

    return NextResponse.json({
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/listing-management:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
