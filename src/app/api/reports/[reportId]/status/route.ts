import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, disconnectDB } from '@/lib/mongodb';
import { Report } from '@/models/Report';
import { User } from '@/models/User';

type Props = {
  params: { reportId: string };
};

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
    if (!user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['PENDING', 'RESOLVED', 'REJECTED'].includes(status)) {
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
    ).lean();

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
    console.error('Error in PATCH /api/reports/[reportId]/status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update report status' },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}
