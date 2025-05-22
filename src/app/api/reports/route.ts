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
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingId, reason } = body;

    if (!listingId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Get user info
    const reportedBy = await User.findOne({ email: session.user.email });
    if (!reportedBy) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find listing owner
    const listingOwner = await User.findById(listing.userId);

    // Check if user is reporting their own listing
    if (listingOwner && reportedBy._id.toString() === listingOwner._id.toString()) {
      return NextResponse.json(
        { error: 'You cannot report your own listing' },
        { status: 400 }
      );
    }

    // Check for duplicate reports
    const existingReport = await Report.findOne({
      listingId,
      reportedBy: reportedBy._id,
      status: 'PENDING'
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this listing' },
        { status: 400 }
      );
    }

    // Create report
    const report = await Report.create({
      listingId,
      reportedBy: reportedBy._id,
      listingOwner: listingOwner ? listingOwner._id : null,
      reason,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      message: 'Report submitted successfully',
      report: {
        id: report._id.toString(),
        reason: report.reason,
        status: report.status,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    console.error('Error in POST /api/reports:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit report' },
      { status: 500 }
    );
  } finally {
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
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'ADMIN') {
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

    if (!reports || reports.length === 0) {
      return NextResponse.json({
        reports: [],
        message: 'No reports found'
      });
    }

    const formattedReports = reports.map(report => ({
      id: report._id.toString(),
      listing: report.listingId ? {
        id: report.listingId._id.toString(),
        title: report.listingId.title
      } : null,
      reportedBy: report.reportedBy ? {
        id: report.reportedBy._id.toString(),
        name: report.reportedBy.name,
        email: report.reportedBy.email
      } : null,
      listingOwner: report.listingOwner ? {
        id: report.listingOwner._id.toString(),
        name: report.listingOwner.name,
        email: report.listingOwner.email
      } : null,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }));

    return NextResponse.json({ reports: formattedReports });
  } catch (error) {
    console.error('Error in GET /api/reports:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch reports' },
      { status: 500 }
    );
  } finally {
    // await disconnectDB();
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
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { reportId, status, action } = body;

    if (!reportId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['PENDING', 'RESOLVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Report status updated successfully',
      report: {
        id: report._id.toString(),
        status: report.status,
        updatedAt: report.updatedAt
      }
    });
  } catch (error) {
    console.error('Error in PATCH /api/reports:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update report status' },
      { status: 500 }
    );
  } finally {
    // await disconnectDB();
  }
}
