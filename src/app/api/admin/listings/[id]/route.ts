import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

type Props = {
  params: {
    id: string
  }
}

// Verify admin status middleware
async function verifyAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return { authorized: false, error: 'Unauthorized', status: 401 }
  }

  // Verify user is an admin
  const userEmail = session.user.email as string
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { role: true }
  })

  if (user?.role !== 'ADMIN') {
    return { authorized: false, error: 'Unauthorized - Admin access required', status: 403 }
  }

  return { authorized: true }
}

// GET a specific listing
export async function GET(request: NextRequest, { params }: Props) {
  if (!params?.id) {
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

    // Get listing details
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(listing)
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
  if (!params?.id) {
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

    // Parse request body for updates
    const updateData = await request.json()
    
    // Check if status update is valid
    if (updateData.status && !['ACTIVE', 'INACTIVE', 'PENDING'].includes(updateData.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }
    
    // Create update object based on provided fields
    const update: any = {}
    if (updateData.status) update.status = updateData.status
    if (typeof updateData.featured !== 'undefined') update.featured = updateData.featured
    
    // Update the listing
    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: update
    })

    return NextResponse.json(updatedListing)
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
  if (!params?.id) {
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

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: params.id }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Delete the listing
    await prisma.listing.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
} 