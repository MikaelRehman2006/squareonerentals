import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, disconnectDB } from '@/lib/mongodb';
import { Report } from '@/models/Report';
import { User } from '@/models/User';
import mongoose from 'mongoose';

// GET all reports for admin
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/admin/reports: Starting request');
    
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

    // Get user session to verify admin status
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('Admin reports API: No session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is an admin
    const user = await User.findOne({ email: session.user.email });

    console.log(`Admin reports API: User role check - Email: ${session.user.email}, Role: ${user?.role}`);

    // Case-insensitive check for admin role
    if (!user || user.role !== 'ADMIN') {
      console.log('Admin reports API: User is not an admin');
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';
    
    // Build filter object
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status.toUpperCase();
    }

    // Log for debugging
    console.log('Fetching reports for admin with filter:', filter);

    // Get all reports with related user and listing data
    const reports = await Report.find(filter)
      .populate('listingId', 'title status')
      .populate('reportedBy', 'name email')
      .populate('listingOwner', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${reports.length} reports`);
    
    // Format the response data
    const formattedReports = reports.map(report => ({
      id: report._id ? report._id.toString() : '',
      listing: {
        id: report.listingId?._id?.toString() || '',
        title: report.listingId?.title || 'Unknown Listing',
        status: report.listingId?.status || 'UNKNOWN'
      },
      reportedBy: {
        id: report.reportedBy?._id?.toString() || '',
        name: report.reportedBy?.name || 'Unknown User',
        email: report.reportedBy?.email || null
      },
      listingOwner: {
        id: report.listingOwner?._id?.toString() || '',
        name: report.listingOwner?.name || 'Unknown Owner',
        email: report.listingOwner?.email || null
      },
      reason: report.reason,
      description: report.description || '',
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }));
    
    return NextResponse.json({ reports: formattedReports });
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  } finally {
    // Don't disconnect as it might affect other requests
    // await disconnectDB();
  }
}