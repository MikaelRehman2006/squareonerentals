import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Listing } from '@/models/Listing';
import { getAdminRole } from '@/lib/admin';
import { Types } from 'mongoose';

interface ListingDocument {
  _id: Types.ObjectId;
  title: string;
  price: number;
  status: string;
  createdAt: Date;
  userId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
}

// GET all listings for admin
export async function GET(request: NextRequest) {
  try {
    // Get user session to verify admin status
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('Admin listings API: No session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is an admin
    const adminRole = getAdminRole(session.user.email);
    if (!adminRole) {
      console.log(`Admin listings API: User ${session.user.email} is not admin`);
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    
    await connectDB();
    
    const filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    
    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .lean() as ListingDocument[];
    
    const total = await Listing.countDocuments(filter);
    
    return NextResponse.json({
      listings: listings.map(listing => ({
        id: listing._id.toString(),
        title: listing.title,
        price: listing.price,
        status: listing.status,
        createdAt: listing.createdAt,
        userId: listing.userId._id.toString(),
        user: {
          name: listing.userId.name,
          email: listing.userId.email,
        },
      })),
      total,
      limit,
      skip
    });
  } catch (error) {
    console.error('Error in admin listings API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}