import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User, IUser } from '@/models/User';
import { Listing, IListing } from '@/models/Listing';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user with favorites
    const user = await User.findById(session.user.id)
      .populate<{ favorites: Array<IListing & { _id: mongoose.Types.ObjectId }> }>({
        path: 'favorites',
        select: 'title price images location _id'
      })
      .lean() as IUser & { 
        _id: mongoose.Types.ObjectId;
        favorites: Array<IListing & { _id: mongoose.Types.ObjectId }>;
      };

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const favorites = user.favorites.map(listing => ({
      id: listing._id.toString(),
      title: listing.title,
      price: listing.price,
      image: listing.images[0],
      location: listing.location,
    }));

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}