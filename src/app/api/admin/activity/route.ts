import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Collection, ObjectId } from 'mongodb';

interface Activity {
  _id: ObjectId;
  id: string;
  userId: string | null;
  type: string;
  data: {
    description: string;
    metadata?: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    const usersCollection: Collection = db.collection('users');
    const activitiesCollection: Collection<Activity> = db.collection('activities');

    // Check if user is admin
    const user = await usersCollection.findOne({ id: session.user.id });
    if (user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Get recent activities
    const recentActivities = await activitiesCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(recentActivities);

  } catch (error) {
    console.error('[ADMIN_ACTIVITY]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}