import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User, IUser } from '@/models/User';
import { Listing, IListing } from '@/models/Listing';
import mongoose from 'mongoose';

// Specify runtime configuration to fix deployment errors
export const dynamic = 'force-dynamic';

interface FavoriteResponse {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
}

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user by email with populated favorites
    const user = await User.findOne({ email: session.user.email })
      .populate<{ favorites: IListing[] }>('favorites')
      .lean() as (IUser & { favorites: IListing[] }) | null;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Make sure favorites exists and is an array
    const favorites: FavoriteResponse[] = (user.favorites || []).map((listing: IListing) => ({
      id: listing._id.toString(),
      title: listing.title || '',
      price: listing.price || 0,
      image: Array.isArray(listing.images) ? listing.images[0] || '' : '',
      location: listing.location || '',
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