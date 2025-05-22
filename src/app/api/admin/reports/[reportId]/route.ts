import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Report } from '@/models/Report'
import { User } from '@/models/User'
import mongoose from 'mongoose'

type Props = {
  params: {
    reportId: string
  }
}

// Verify admin status middleware
async function verifyAdmin() {
  try {
    // Connect to MongoDB
    await connectDB()
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return { authorized: false, error: 'Unauthorized', status: 401 }
    }

    // Verify user is an admin
    const user = await User.findOne({ email: session.user.email })
    
    // Case-insensitive check for admin role
    if (!user || user.role !== 'ADMIN') {
      return { authorized: false, error: 'Unauthorized - Admin access required', status: 403 }
    }

    return { authorized: true }
  } catch (error) {
    console.error('Error in verifyAdmin:', error)
    return { authorized: false, error: 'Server error during authorization', status: 500 }
  }
}

// GET a specific report
export async function GET(request: NextRequest, { params }: Props) {
  if (!params?.reportId) {
    return NextResponse.json(
      { error: 'Missing report ID' },
      { status: 400 }
    )
  }

  try {
    // Verify admin status
    const adminCheck = await verifyAdmin()
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.reportId)) {
      return NextResponse.json(
        { error: 'Invalid report ID format' },
        { status: 400 }
      )
    }

    // Get report details
    const report = await Report.findById(params.reportId)
      .populate('listingId', 'title status')
      .populate('reportedBy', 'name email')
      .populate('listingOwner', 'name email')
      .lean() as any // Type assertion to avoid TypeScript errors with MongoDB document

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Format the response
    const formattedReport = {
      id: report._id.toString(),
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
    }

    return NextResponse.json(formattedReport)
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}

// PATCH - Update report status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  try {
    // Get user session to verify admin status
    const adminCheck = await verifyAdmin()
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.reportId)) {
      return NextResponse.json(
        { error: 'Invalid report ID format' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const { status } = data
    
    // Validate required fields
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status value
    const validStatuses = ['PENDING', 'REVIEWED', 'ACTIONED', 'DISMISSED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Update report status
    const updatedReport = await Report.findByIdAndUpdate(
      params.reportId,
      { status, updatedAt: new Date() },
      { new: true }
    )
      .populate('listingId', 'title status')
      .populate('reportedBy', 'name email')
      .populate('listingOwner', 'name email')
      .lean() as any

    if (!updatedReport) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // If we're actioning a report, flag the associated listing too
    if (status === 'ACTIONED' && updatedReport.listingId) {
      const { Listing } = mongoose.models;
      await Listing.findByIdAndUpdate(
        updatedReport.listingId._id,
        { status: 'FLAGGED', updatedAt: new Date() }
      );
    }

    // Format response similarly to GET
    const formattedReport = {
      id: updatedReport._id.toString(),
      listing: {
        id: updatedReport.listingId?._id?.toString() || '',
        title: updatedReport.listingId?.title || 'Unknown Listing',
        status: updatedReport.listingId?.status || 'UNKNOWN'
      },
      reportedBy: {
        id: updatedReport.reportedBy?._id?.toString() || '',
        name: updatedReport.reportedBy?.name || 'Unknown User',
        email: updatedReport.reportedBy?.email || null
      },
      listingOwner: {
        id: updatedReport.listingOwner?._id?.toString() || '',
        name: updatedReport.listingOwner?.name || 'Unknown Owner',
        email: updatedReport.listingOwner?.email || null
      },
      reason: updatedReport.reason,
      description: updatedReport.description || '',
      status: updatedReport.status,
      createdAt: updatedReport.createdAt,
      updatedAt: updatedReport.updatedAt
    }

    return NextResponse.json(formattedReport)
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a report (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    // Get user session to verify admin status
    const adminCheck = await verifyAdmin()
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      )
    }

    if (!params.reportId) {
      return NextResponse.json(
        { error: 'Missing report ID' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.reportId)) {
      return NextResponse.json(
        { error: 'Invalid report ID format' },
        { status: 400 }
      )
    }

    // Check if report exists
    const report = await Report.findById(params.reportId)
      .populate('listingId')
      .lean() as any

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Delete the report
    await Report.findByIdAndDelete(params.reportId)

    return NextResponse.json({
      message: 'Report deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    )
  }
} 