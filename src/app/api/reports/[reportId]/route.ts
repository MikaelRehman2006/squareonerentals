import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, disconnectDB } from '@/lib/mongodb';
import { Report } from '@/models/Report';
import { User } from '@/models/User';
import mongoose from 'mongoose';

type Props = {
  params: { reportId: string };
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only admins or the user who reported can view a report
    const isAdmin = user.role === 'ADMIN';

    const report = await Report.findById(params.reportId)
      .populate('listingId', 'title images status')
      .populate('reportedBy', 'name email')
      .populate('listingOwner', 'name email')
      .lean() as any;

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this report
    if (!isAdmin && report.reportedBy._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized to view this report' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: report._id.toString(),
      listing: {
        id: report.listingId._id.toString(),
        title: report.listingId.title,
        status: report.listingId.status,
      },
      reportedBy: {
        id: report.reportedBy._id.toString(),
        name: report.reportedBy.name,
        email: report.reportedBy.email,
      },
      listingOwner: {
        id: report.listingOwner._id.toString(),
        name: report.listingOwner.name,
        email: report.listingOwner.email,
      },
      reason: report.reason,
      description: report.description,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    });
  } catch (error) {
    console.error('Error in GET /api/reports/[reportId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch report' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['PENDING', 'RESOLVED', 'REJECTED', 'WARNED', 'ACTIONED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const report = await Report.findByIdAndUpdate(
      params.reportId,
      {
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).lean() as any;

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Report updated successfully',
      report: {
        id: report._id.toString(),
        status: report.status,
        updatedAt: report.updatedAt
      }
    });
  } catch (error) {
    console.error('Error in PATCH /api/reports/[reportId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update report' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const report = await Report.findByIdAndDelete(params.reportId);

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/reports/[reportId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete report' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}
