import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, disconnectDB } from '@/lib/mongodb';
import { Report } from '@/models/Report';
import { User } from '@/models/User';
import { Listing } from '@/models/Listing';
import { Types } from 'mongoose';

interface ReportDocument {
  _id: Types.ObjectId;
  listingId: {
    _id: Types.ObjectId;
    title: string;
  };
  reportedBy: {
    _id: Types.ObjectId;
    name: string | null;
    email: string | null;
  };
  listingOwner: {
    _id: Types.ObjectId;
    name: string | null;
    email: string | null;
  };
  reason: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/reports: Starting request');
    
    // Connect to MongoDB
    try {
      await connectDB();
      console.log('MongoDB connection successful');
    } catch (dbError) {
      console.error('MongoDB connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('POST /api/reports: Unauthorized attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user information
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log('POST /api/reports: User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Report submission body:', body);

    // Validate required fields
    if (!body.listingId) {
      console.log('POST /api/reports: Missing listingId');
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    if (!body.reason) {
      console.log('POST /api/reports: Missing reason');
      return NextResponse.json(
        { error: 'Reason is required' },
        { status: 400 }
      );
    }

    // Validate listing exists
    const listing = await Listing.findById(body.listingId);
    if (!listing) {
      console.log('POST /api/reports: Listing not found');
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Create the report with validated data
    const reportData = {
      listingId: body.listingId,
      reportedBy: user._id,
      listingOwner: listing.userId,
      reason: body.reason,
      description: body.description || '',
      status: 'PENDING'
    };
    
    // Create the report
    console.log('Creating report with data:', reportData);
    const report = new Report(reportData);
    await report.save();

    return NextResponse.json({
      message: 'Report submitted successfully',
      reportId: report._id.toString(),
      status: 'success'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error in POST /api/reports:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to submit report',
        status: 'error'
      },
      { status: 500 }
    );
  } finally {
    // Don't disconnect as it might affect other requests
    // await disconnectDB();
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const adminRole = getAdminRole(session.user.email);
    if (!adminRole) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const reports = await Report.find()
      .populate('reportedBy', 'name email')
      .populate('listingOwner', 'name email')
      .populate('listingId', 'title')
      .sort({ createdAt: -1 })
      .lean() as ReportDocument[];

    const formattedReports = reports.map(report => ({
      id: report._id.toString(),
      listing: {
        id: report.listingId?._id.toString(),
        title: report.listingId?.title || 'Deleted Listing',
      },
      reportedBy: {
        id: report.reportedBy?._id.toString(),
        name: report.reportedBy?.name || report.reportedBy?.email || 'Unknown User',
        email: report.reportedBy?.email,
      },
      listingOwner: {
        id: report.listingOwner?._id.toString(),
        name: report.listingOwner?.name || report.listingOwner?.email || 'Unknown User',
        email: report.listingOwner?.email,
      },
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    }));

    return NextResponse.json({ reports: formattedReports });
  } catch (error) {
    console.error('Error in GET /api/reports:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch reports' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const adminRole = getAdminRole(session.user.email);
    if (!adminRole) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { reportId, status } = body;

    if (!reportId || !status) {
      return NextResponse.json(
        { error: 'Report ID and status are required' },
        { status: 400 }
      );
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    report.status = status;
    report.updatedAt = new Date();
    await report.save();

    return NextResponse.json({
      message: 'Report updated successfully',
      report: {
        id: report._id.toString(),
        status: report.status,
        updatedAt: report.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error in PATCH /api/reports:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update report' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}