import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const [totalUsers, totalListings, totalReports, activeListings] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.report.count(),
      prisma.listing.count({
        where: {
          status: 'ACTIVE',
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalListings,
      totalReports,
      activeListings,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 