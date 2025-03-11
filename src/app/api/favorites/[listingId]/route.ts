import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Session } from 'next-auth';

interface CustomSession extends Session {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}

export async function POST(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: params.listingId,
      },
    });

    if (!listing) {
      return new NextResponse('Listing not found', { status: 404 });
    }

    // Add to favorites
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        favorites: {
          connect: {
            id: params.listingId,
          },
        },
      },
    });

    return new NextResponse('Added to favorites', { status: 200 });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Remove from favorites
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        favorites: {
          disconnect: {
            id: params.listingId,
          },
        },
      },
    });

    return new NextResponse('Removed from favorites', { status: 200 });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 