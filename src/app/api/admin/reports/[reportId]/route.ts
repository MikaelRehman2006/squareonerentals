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

// GET a specific report
export async function GET(request: NextRequest, { params }: Props) {
  if (!params?.id) {
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

    // Get report details
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        Listing: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(report)
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is an admin
    const userEmail = session.user.email as string
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params
    
    // Find report
    const report = await prisma.report.findUnique({
      where: { id: id },
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { status: newStatus } = body

    if (!newStatus || !['PENDING', 'RESOLVED', 'REJECTED'].includes(newStatus)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Update report status
    const updatedReport = await prisma.report.update({
      where: { id: id },
      data: {
        status: newStatus
      }
    })

    // Not creating activity logs to simplify implementation
    
    return NextResponse.json(updatedReport)
  } catch (error) {
    console.error('Error updating report status:', error)
    return NextResponse.json(
      { error: 'Failed to update report status' },
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is an admin
    const userEmail = session.user.email as string
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params
    
    // Find report
    const report = await prisma.report.findUnique({
      where: { id: id },
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Delete report
    await prisma.report.delete({
      where: { id: id }
    })

    // Not creating activity logs to simplify implementation
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    )
  }
} 