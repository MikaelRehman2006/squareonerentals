import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Fetch recent activities (last 10)
    const recentActivities = await prisma.activity.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        type: true,
        description: true,
        createdAt: true,
      },
    });

    // Format the activities for the frontend
    const formattedActivities = recentActivities.map((activity: Activity) => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      timestamp: activity.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 