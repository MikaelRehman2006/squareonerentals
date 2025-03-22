import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { Collection } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { db } = await connectToDatabase();
    const usersCollection: Collection = db.collection('users');
    const listingsCollection: Collection = db.collection('listings');
    const reportsCollection: Collection = db.collection('reports');

    // Get counts
    const [
      totalUsers,
      totalListings,
      totalReports,
      activeListings
    ] = await Promise.all([
      usersCollection.countDocuments(),
      listingsCollection.countDocuments(),
      reportsCollection.countDocuments(),
      listingsCollection.countDocuments({ status: 'ACTIVE' })
    ]);

    return NextResponse.json({
      totalUsers,
      totalListings,
      totalReports,
      activeListings
    });

  } catch (error) {
    console.error('[ADMIN_STATS]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}