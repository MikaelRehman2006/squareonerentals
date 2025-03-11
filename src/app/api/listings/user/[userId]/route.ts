import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Ensure users can only access their own listings
    if (session.user.id !== params.userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const listings = await prisma.listing.findMany({
      where: {
        userId: params.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        createdAt: true,
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 