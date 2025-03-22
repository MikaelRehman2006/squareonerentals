import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User, IUser } from '@/models/User';
import { Listing, IListing } from '@/models/Listing';
import mongoose from 'mongoose';

export async function POST(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if listing exists
    const listing = await Listing.findById(params.listingId).lean() as IListing & { _id: mongoose.Types.ObjectId } | null;

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Add listing to user's favorites
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $addToSet: { favorites: params.listingId } },
      { new: true }
    ).lean() as IUser & { _id: mongoose.Types.ObjectId } | null;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Listing added to favorites' });
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

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Remove listing from user's favorites
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $pull: { favorites: params.listingId } },
      { new: true }
    ).lean() as IUser & { _id: mongoose.Types.ObjectId } | null;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Listing removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}