import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import { User } from '@/models/User'
import { Report } from '@/models/Report'
import mongoose from 'mongoose'
import { notifyAdminStatusChange } from '@/lib/notification'

type Props = {
  params: {
    listingId: string
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
    console.log(`Admin listings API: User role check - Email: ${session.user.email}, Role: ${user?.role}`)
    
    // Check for admin role using uppercase to match TypeScript types
    if (!user || user.role !== 'ADMIN') {
      return { authorized: false, error: 'Unauthorized - Admin access required', status: 403 }
    }

    return { authorized: true }
  } catch (error) {
    console.error('Error in verifyAdmin:', error)
    return { authorized: false, error: 'Server error during authorization', status: 500 }
  }
}

// GET a specific listing
export async function GET(request: NextRequest, { params }: Props) {
  if (!params?.listingId) {
    return NextResponse.json(
      { error: 'Missing listing ID' },
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

    await connectDB()
    console.log(`Getting listing details for ID: ${params.listingId}`)

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID format' },
        { status: 400 }
      )
    }

    // Get listing details
    const listing = await Listing.findById(params.listingId)
      .populate('userId', 'name email')
      .lean() as any // Type assertion to handle MongoDB document

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Format the response
    const formattedListing = {
      id: listing._id.toString(),
      title: listing.title,
      description: listing.description,
      price: listing.price,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      zipcode: listing.zipcode,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      squareFeet: listing.squareFeet,
      status: listing.status,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      user: {
        id: listing.userId?._id?.toString() || '',
        name: listing.userId?.name || 'Unknown User',
        email: listing.userId?.email || ''
      }
    }

    return NextResponse.json(formattedListing)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}

// PATCH a specific listing
export async function PATCH(request: NextRequest, { params }: Props) {
  if (!params?.listingId) {
    return NextResponse.json(
      { error: 'Missing listing ID' },
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

    await connectDB()
    console.log(`Updating listing status for ID: ${params.listingId}`)

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID format' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status } = body
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate the status value
    const validStatuses = ['ACTIVE', 'ARCHIVED', 'FLAGGED', 'PENDING', 'REJECTED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Find the listing to check current status and get user info
    const listing = await Listing.findById(params.listingId)
      .populate('userId', 'name email')
      .lean() as any

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      params.listingId,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email').lean() as any

    // Get the session to identify the admin
    const session = await getServerSession(authOptions)
    
    // Send notification to the listing owner about status change
    try {
      console.log(`Sending notification to listing owner about status change to: ${status}`)
      
      // Get previous status from the original listing
      const previousStatus = listing.status
      
      // Send notification to the listing owner
      await notifyAdminStatusChange(
        params.listingId,
        previousStatus,
        status,
        listing.userId._id.toString(),
        session?.user?.id || 'admin'
      )
      
      console.log(`Notification sent to listing owner (${listing.userId.email}) about status change`)
    } catch (notificationError) {
      console.error('Error sending status change notification:', notificationError)
      // Continue anyway - don't fail the status update if notification fails
    }

    // If listing is being flagged, create an admin report
    if (status === 'FLAGGED') {
      console.log('Creating admin report for flagged listing')
      
      try {
        // Create a report from admin
        const report = new Report({
          listingId: params.listingId,
          reportedBy: session?.user?.email ? await User.findOne({ email: session.user.email }) : null,
          listingOwner: listing.userId._id,
          reason: 'ADMIN_FLAGGED',
          description: 'This listing was flagged by an admin for review.',
          status: 'ACTIONED'
        })
        
        await report.save()
        console.log('Admin report created successfully')
      } catch (reportError) {
        console.error('Error creating admin report:', reportError)
        // Continue anyway - don't fail the status update if report creation fails
      }
    }

    // Format the response
    const formattedListing = {
      id: updatedListing._id.toString(),
      title: updatedListing.title,
      status: updatedListing.status,
      createdAt: updatedListing.createdAt,
      updatedAt: updatedListing.updatedAt,
      user: {
        id: updatedListing.userId?._id?.toString() || '',
        name: updatedListing.userId?.name || 'Unknown User',
        email: updatedListing.userId?.email || ''
      }
    }

    return NextResponse.json(formattedListing)
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    )
  }
}

// DELETE a listing
export async function DELETE(request: NextRequest, { params }: Props) {
  if (!params?.listingId) {
    return NextResponse.json(
      { error: 'Missing listing ID' },
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
    
    await connectDB()
    console.log(`Deleting listing with ID: ${params.listingId}`)

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID format' },
        { status: 400 }
      )
    }

    // Check if listing exists
    const listing = await Listing.findById(params.listingId)

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Delete the listing
    await Listing.findByIdAndDelete(params.listingId)

    // Delete any associated reports
    await Report.deleteMany({ listingId: params.listingId })

    return NextResponse.json({
      message: 'Listing deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}