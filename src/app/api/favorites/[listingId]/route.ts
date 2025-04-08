import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Listing } from '@/models/Listing';
import mongoose from 'mongoose';

export async function POST(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate listingId format
    if (!mongoose.Types.ObjectId.isValid(params.listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID format' },
        { status: 400 }
      );
    }

    // Check if listing exists
    const listing = await Listing.findById(params.listingId);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Add listing to user's favorites and update listing's favoritedBy
    const [updatedUser] = await Promise.all([
      User.findByIdAndUpdate(
        user._id,
        { $addToSet: { favorites: params.listingId } },
        { new: true }
      ),
      Listing.findByIdAndUpdate(
        params.listingId,
        { $addToSet: { favoritedBy: user._id } },
        { new: true }
      )
    ]);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user favorites' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Listing added to favorites',
      isFavorited: true
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate listingId format
    if (!mongoose.Types.ObjectId.isValid(params.listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID format' },
        { status: 400 }
      );
    }

    // Remove listing from user's favorites and update listing's favoritedBy
    const [updatedUser] = await Promise.all([
      User.findByIdAndUpdate(
        user._id,
        { $pull: { favorites: params.listingId } },
        { new: true }
      ),
      Listing.findByIdAndUpdate(
        params.listingId,
        { $pull: { favoritedBy: user._id } },
        { new: true }
      )
    ]);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user favorites' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Listing removed from favorites',
      isFavorited: false
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}