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

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const favorites = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        favorites: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!favorites) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Parse JSON strings for each listing
    const parsedFavorites = favorites.favorites.map(listing => ({
      ...listing,
      images: JSON.parse(listing.images || '[]'),
      amenities: JSON.parse(listing.amenities || '[]'),
      buildingAmenities: JSON.parse(listing.buildingAmenities || '[]')
    }));

    return NextResponse.json(parsedFavorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 