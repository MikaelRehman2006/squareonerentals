import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Listing } from '@/models/Listing';
import { getAdminRole } from '@/lib/admin';
import { notifyAdminStatusChange } from '@/lib/notification';
import mongoose from 'mongoose';

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

    // Find listing with previous status
    const listing = await Listing.findById(id).populate('userId', 'name email');
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Store previous status before updating
    const previousStatus = listing.status;
    
    // Update the listing status
    listing.status = status;
    await listing.save();

    // Send notification to the listing owner about status change
    try {
      console.log(`Sending notification to listing owner about status change to: ${status}`);
      
      await notifyAdminStatusChange(
        id,
        previousStatus,
        status,
        listing.userId.toString(),
        session?.user?.id || 'admin'
      );
      
      console.log(`Notification sent to listing owner about status change from ${previousStatus} to ${status}`);
    } catch (notificationError) {
      console.error('Error sending status change notification:', notificationError);
      // Continue anyway - don't fail the status update if notification fails
    }

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

    // Clean up image metadata before deleting the listing
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

      // Delete all image metadata associated with this listing
      const deleteResult = await ImageMetadata.deleteMany({ listingId: id });
      console.log(`Deleted ${deleteResult.deletedCount} image metadata records for listing ${id}`);
    } catch (metadataError) {
      console.error('Error cleaning up image metadata:', metadataError);
      // Continue with listing deletion even if metadata cleanup fails
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
