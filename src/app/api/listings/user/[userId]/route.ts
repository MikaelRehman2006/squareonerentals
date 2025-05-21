import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Listing } from '@/models/Listing';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Ensure users can only access their own listings
    if (session.user.id !== params.userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const listings = await Listing.find({ userId: params.userId })
      .sort({ createdAt: -1 })
      .select('id title price location createdAt images')
      .lean();

    // Format the response
    const formattedListings = listings.map(listing => ({
      id: listing._id.toString(),
      title: listing.title,
      price: listing.price,
      location: listing.location,
      createdAt: listing.createdAt,
      images: listing.images || [],
    }));

    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}