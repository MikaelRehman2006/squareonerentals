import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Session } from 'next-auth';

interface CustomSession {
  user: {
    id: string;
    email: string | null;
    name?: string | null;
    image?: string | null;
    role: "USER" | "ADMIN";
  };
  expires: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to report content' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('Report submission data:', data);
    
    // Validate required fields
    if (!data.type || !data.targetId || !data.reason) {
      console.error('Missing required fields for report:', { 
        type: data.type, 
        targetId: data.targetId, 
        reason: data.reason 
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if type is valid
    if (data.type !== 'LISTING' && data.type !== 'USER') {
      console.error('Invalid report type:', data.type);
      return NextResponse.json(
        { error: 'Invalid report type' },
        { status: 400 }
      );
    }

    // Verify that the target exists if it's a listing
    if (data.type === 'LISTING') {
      const listing = await prisma.listing.findUnique({
        where: { id: data.targetId }
      });
      
      if (!listing) {
        console.error('Listing not found for report:', data.targetId);
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        );
      }
    }

    // Create the report
    const report = await prisma.report.create({
      data: {
        type: data.type,
        targetId: data.targetId,
        reason: data.reason,
        description: data.description || null,
        reporterId: session.user.id,
        status: 'PENDING',
        // If it's a listing report, connect it to the listing
        ...(data.type === 'LISTING' && {
          listingId: data.targetId
        })
      }
    });

    console.log('Report created successfully:', report.id);
    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully',
      reportId: report.id
    });
    
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Only allow access to admin users
    // This would require implementing admin role check in your application
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // Build filter based on query parameters
    const filter: any = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    // Fetch reports with filters
    const reports = await prisma.report.findMany({
      where: filter,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        Listing: {
          select: {
            id: true,
            title: true,
            price: true,
            location: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(reports);
    
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
} 