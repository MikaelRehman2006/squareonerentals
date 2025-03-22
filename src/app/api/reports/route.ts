import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { Collection, ObjectId } from 'mongodb';
import { z } from 'zod';

const reportSchema = z.object({
  type: z.string(),
  targetId: z.string(),
  reason: z.string(),
  description: z.string().optional(),
});

interface Report {
  _id: ObjectId;
  id: string;
  type: string;
  targetId: string;
  userId: string;
  reason: string;
  description: string | null;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

interface Listing {
  _id: ObjectId;
  id: string;
  title: string;
  price: number;
  location: string;
  status: string;
  userId: string;
}

interface User {
  _id: ObjectId;
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  role: 'USER' | 'ADMIN';
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = reportSchema.parse(json);

    const { db } = await connectToDatabase();
    const listingsCollection: Collection<Listing> = db.collection('listings');
    const usersCollection: Collection<User> = db.collection('users');
    const reportsCollection: Collection<Report> = db.collection('reports');

    // Validate required fields
    if (!body.type || !body.targetId || !body.reason) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if type is valid
    if (body.type !== 'LISTING' && body.type !== 'USER') {
      return new NextResponse('Invalid report type', { status: 400 });
    }

    // Verify that the target exists if it's a listing
    if (body.type === 'LISTING') {
      const listing = await listingsCollection.findOne({ id: body.targetId });
      if (!listing) {
        return new NextResponse('Listing not found', { status: 404 });
      }
    }

    // Create report
    const newReport = {
      _id: new ObjectId(),
      id: new ObjectId().toString(),
      type: body.type,
      targetId: body.targetId,
      userId: session.user.id,
      reason: body.reason,
      description: body.description || null,
      status: 'PENDING' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await reportsCollection.insertOne(newReport);

    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully',
      reportId: newReport.id
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }

    console.error('[REPORTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { db } = await connectToDatabase();
    const reportsCollection: Collection<Report> = db.collection('reports');
    const listingsCollection: Collection<Listing> = db.collection('listings');
    const usersCollection: Collection<User> = db.collection('users');

    // Only allow access to admin users
    const user = await usersCollection.findOne({ id: session.user.id });
    if (user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build filter
    const filter: { [key: string]: string } = {};
    if (status) filter.status = status;

    // Fetch reports with filters
    const reports = await reportsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Populate reports with listing and user data
    const populatedReports = await Promise.all(reports.map(async (report) => {
      const listing = await listingsCollection.findOne({ id: report.targetId });
      const user = await usersCollection.findOne({ id: report.userId });
      return {
        ...report,
        listing: listing,
        user: user,
      };
    }));

    return NextResponse.json(populatedReports);

  } catch (error) {
    console.error('[REPORTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}